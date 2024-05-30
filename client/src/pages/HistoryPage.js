import { useEffect, useState, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';
import moment from 'moment';
import io from 'socket.io-client';

const HistoryPage = () => {
    const [data, setData] = useState([]);
    // const local = 'http://localhost:5000';
    // const URL = process.env.REACT_APP_API_URL || local;
    //const URL = local;
    //const [socket, setSocket] = useState(io(URL));
//    const socket = useMemo(() => io('/api'), []); 
const socket = useMemo( () => io('http://35.183.100.104'),[]);

    useEffect(() => {
    // if (!socket) {
    //     setSocket(io(URL));
    // }
    const fetchData = async () => {
        const response = await fetch('api/checksheet', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        // Filter the data to only include checksheets where isChecked is true
        const filteredData = data.filter(sheet => sheet.isChecked);

        // Map the filtered data to a new format
        const mappedData = filteredData.map(sheet => ({
            id: sheet._id,
            day: sheet.day,
            lab: sheet.lab,
            startTime: moment(sheet.startTime, 'HH:mm:ss').format('HH:mm'),
            checkedBy: sheet.checkedBy,
            actualTime: sheet.actualTime ? moment(sheet.actualTime).format('MM/DD/YYYY HH:mm') : ""
        }));

        setData(mappedData);
    };
    fetchData();

    // Listen for the 'checksheetUpdated' event and update the state
    socket.on('checksheetUpdated', (updatedChecksheet) => {
        setData(prevData => {
            // Replace the updated checksheet in the data array
            return prevData.map(sheet => sheet.id === updatedChecksheet.id ? updatedChecksheet : sheet);
        });
    });

}, [socket]);

    
    const isSmallScreen = useMediaQuery({ query: '(max-width: 600px)' });

    const columns = useMemo(
        () => isSmallScreen ? [
            {
                accessorKey: 'lab',
                header: 'Lab',
                size: 10,
                filtervariant: 'select',
            },
            {
                accessorKey: 'startTime',
                header: 'Check Time',
                size:20,
            },
            {
                accessorKey: 'checkedBy',
                header: 'Checked By',
                size: 20,
            },
            {
                accessorKey: 'actualTime',
                header: 'Checked Time',
                size: 50,
            },
        ] : [
            {
                accessorKey: 'lab',
                header: 'Lab',
                size: 10,
                filtervariant: 'select',
            },
            {
                accessorKey: 'startTime',
                header: 'Check Time',
                size: 20,
            },
            {
                accessorKey: 'day',
                header: 'Day',
                size: 20,
                filtervariant: 'select',
            },
            {
                accessorKey: 'checkedBy',
                header: 'Checked By',
                size:20,
            },
            {
                accessorKey: 'actualTime',
                header: 'Checked Time',
                size: 30,
            },

        ],
        [isSmallScreen]
    );

    const table = useMaterialReactTable({
        columns: columns,
        data: data,
        density: 'compact',
        enableGrouping: false,
        enablePagination: false,
        initialState: {
            columnOrder: [
                'actualTime',
                'day',
                'lab',
                'startTime',
                'checkedBy',
            ],
            showColumnFilters: true,
            showColumnVisibilityManager: false,
            showDensitySelector: false,
            showGroupingControls: false,
            showRowSelector: false,
            showSearch: false,
            showSettings: false,
            showSummary: false,
            showTableSelector: false,
            showViewChanger: false,
        },
        muiTopToolbarProps: {
            sx: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0px',
                marginLeft: '5%',
                marginRight: '5%',
                fontFamily: 'Arial',
                button: {
                    fontSize: '1em',
                    borderRadius: '5px',
                },
            },
        },
        muiTableContainerProps: {
            sx: {
                marginTop: '1%',
                width: '90%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginBottom: '0px',
            },
        },
        muiTableBodyCellProps: {
            sx: {
                fontSize: isSmallScreen ? '0.8em' : '1em',
            }
        },
        muiTableHeadCellProps: {
            sx: {
                fontSize: isSmallScreen ? '0.8em' : '1.2em',
            }
        },

    });

    return (
        <>
            <Box
                justifyContent={'center'}
                alignItems={'center'}
                marginTop={'2vh'}
                marginBottom={'0px'}
                marginLeft={'auto'}
                marginRight={'auto'}
                maxWidth={'96%'}
                overflow={'auto'}
                padding={'0px'}
            >
                <MaterialReactTable table={table} />
            </Box>
        </>
    );
};

export default HistoryPage;
