import { useEffect, useState, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
<<<<<<< HEAD
import { Box,
        Typography,
    
} from '@mui/material';
=======
import { Box } from '@mui/material';
>>>>>>> 9cb1631 (version 1.0)
import moment from 'moment';
import io from 'socket.io-client';

const HistoryPage = () => {
    const [data, setData] = useState([]);
<<<<<<< HEAD
    const [today, setToday] = useState('');


const socket = useMemo( () => io('http://35.183.100.104'),[]);

const shortenDay = (day) => {
    switch(day) {
        case 'Monday':
            return 'Mon';
        case 'Tuesday':
            return 'Tues';
        case 'Wednesday':
            return 'Wed';
        case 'Thursday':
            return 'Thurs';
        case 'Friday':
            return 'Fri';
        case 'Saturday':
            return 'Sat';
        case 'Sunday':
            return 'Sun';
        default:
            return day;
    }
};

    useEffect(() => {
        
 setToday(moment().format('MMMM Do, YYYY'));
=======
    // const local = 'http://localhost:5000';
    // const URL = process.env.REACT_APP_API_URL || local;
    //const URL = local;
    //const [socket, setSocket] = useState(io(URL));
//    const socket = useMemo(() => io('/api'), []); 
const socket = useMemo( () => io('http://35.183.100.104'),[]);

    useEffect(() => {
>>>>>>> 9cb1631 (version 1.0)
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
<<<<<<< HEAD
        
         // Calculate the date n days ago
         const n = 3;
         const nDaysAgo = moment().subtract(n, 'days');

    // Filter the data to only include checksheets where isChecked is true and actualTime is within the last 3 days
        const filteredData = data.filter(sheet =>
        sheet.isChecked &&
         moment(sheet.actualTime).isAfter(nDaysAgo));
=======

        // Filter the data to only include checksheets where isChecked is true
        const filteredData = data.filter(sheet => sheet.isChecked);
>>>>>>> 9cb1631 (version 1.0)

        // Map the filtered data to a new format
        const mappedData = filteredData.map(sheet => ({
            id: sheet._id,
<<<<<<< HEAD
            day: shortenDay(sheet.day), 
            lab: sheet.lab,
            startTime: moment(sheet.startTime, 'HH:mm:ss').format('HH:mm'),
            checkedBy: sheet.checkedBy,
            actualTime: sheet.actualTime ? moment(sheet.actualTime).format('YYYY/MM/DD HH:mm') : ""
           // formattedTime: sheet.actualTime ? moment(sheet.actualTime).format('MMM D, HH:mm') : ""
=======
            day: sheet.day,
            lab: sheet.lab,
            startTime: moment(sheet.startTime, 'HH:mm:ss').format('hh:mm A'),
            checkedBy: sheet.checkedBy,
            actualTime: sheet.actualTime ? moment(sheet.actualTime).format('hh:mm A') : ""
>>>>>>> 9cb1631 (version 1.0)
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
<<<<<<< HEAD
                size: 0.2,
=======
                size: 30,
>>>>>>> 9cb1631 (version 1.0)
                filtervariant: 'select',
            },
            {
                accessorKey: 'startTime',
                header: 'Check Time',
<<<<<<< HEAD
                size:0.3,
            },
            {
                accessorKey: 'checkedBy',
                header: 'Checked By',
                size: 1,
            },
            {
                accessorKey: 'actualTime',
                header: 'Checked Time',
                size: 4,
            },
             {
                accessorKey: 'day',
                header: 'Day',
                size: 0.2,
                filtervariant: 'select',
            },
        ] : [
              {
                accessorKey: 'actualTime',
                header: 'Checked Time',
                size: 20,
            },
            {
                accessorKey: 'lab',
                header: 'Lab',
                size: 10,
=======
                size: 50,
            },
        ] : [
            {
                accessorKey: 'lab',
                header: 'Lab',
                size: 30,
>>>>>>> 9cb1631 (version 1.0)
                filtervariant: 'select',
            },
            {
                accessorKey: 'startTime',
                header: 'Check Time',
<<<<<<< HEAD
                size: 10,
=======
                size: 50,
>>>>>>> 9cb1631 (version 1.0)
            },
            {
                accessorKey: 'day',
                header: 'Day',
<<<<<<< HEAD
                size: 10,
=======
                size: 20,
>>>>>>> 9cb1631 (version 1.0)
                filtervariant: 'select',
            },
            {
                accessorKey: 'checkedBy',
                header: 'Checked By',
<<<<<<< HEAD
                size:15,
            },
          
=======
                size: 30,
            },
            {
                accessorKey: 'actualTime',
                header: 'Actual Time',
                size: 30,
            },
>>>>>>> 9cb1631 (version 1.0)

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
<<<<<<< HEAD
                'actualTime',
=======
>>>>>>> 9cb1631 (version 1.0)
                'day',
                'lab',
                'startTime',
                'checkedBy',
            ],
<<<<<<< HEAD
            showColumnFilters: false, //
=======
            showColumnFilters: true,
>>>>>>> 9cb1631 (version 1.0)
            showColumnVisibilityManager: false,
            showDensitySelector: false,
            showGroupingControls: false,
            showRowSelector: false,
            showSearch: false,
            showSettings: false,
            showSummary: false,
            showTableSelector: false,
            showViewChanger: false,
<<<<<<< HEAD
            sorting: [
                { id: 'actualTime', desc: true } 
            ],
=======
>>>>>>> 9cb1631 (version 1.0)
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
<<<<<<< HEAD
    
    //   useEffect(() => {

    //     table.setSorting([{ id: 'actualTime', desc: true }]);
    // }, [table]);

    return (
        <>
            
            <Typography 
                align="left"
                 sx={{
                        paddingTop: '1px',
                        paddingRight: '4px', 
                        fontSize: '0.7rem',
                        fontStyle: 'italic'
                    }}>
                This history record is kept for 3 days and then removed.
                </Typography>
            
=======

    return (
        <>
>>>>>>> 9cb1631 (version 1.0)
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
<<<<<<< HEAD
            
            >
                    
                <Typography 
                    variant="h6" 
                    align="right"  
                    gutterBottom 
                    sx={{
                        paddingRight: '2px', 
                        fontSize: '0.8rem',
                        fontStyle: 'italic'
                    }}
                >
                {today}
                </Typography>
               
                <MaterialReactTable table={table} />
               
=======
            >
                <MaterialReactTable table={table} />
>>>>>>> 9cb1631 (version 1.0)
            </Box>
        </>
    );
};

export default HistoryPage;
