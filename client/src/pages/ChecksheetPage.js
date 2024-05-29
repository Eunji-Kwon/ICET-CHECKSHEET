import { useEffect, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {
    IconButton,
    Box,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import moment from 'moment';
import io from 'socket.io-client';


const ChecksheetPage = () => {
    const [data, setData] = useState([]);
    // const local = 'http://localhost:5000';
    // const URL = process.env.REACT_APP_API_URL || local;
    //    const [socket, setSocket] = useState(io(URL));
//    const socket = useMemo(() => io('/api'), []);
//const socket = useMemo(() => io('wss://35.183.100.104/api'), []);
	const socket = useMemo( () => io('http://35.183.100.104'),[]);
//const socket = useMemo(() => io('wss://35.183.100.104', {
//    path: '/api/socket.io',
//   transports: ['websocket', 'polling'],
//}), []);


    useEffect(() => {
        // if (!socket) {
        //     setSocket(io(URL));
        // }

        const fetchData = async () => {
            const response = await fetch('/api/checksheet', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            // Access the data array and filter out the checked ones
            const uncheckedSheets = data.filter(sheet => !sheet.isChecked);

            // Map the data to a new format
            const mappedData = uncheckedSheets.map(sheet => ({
                id: sheet._id,
                day: sheet.day,
                lab: sheet.lab,
                startTime: moment(sheet.startTime, 'HH:mm:ss').format('hh:mm A'),
                checkedBy: sheet.checkedBy,
                actualTime: sheet.actualTime ? moment(sheet.actualTime).format('hh:mm A') : ""
            }));

            setData(mappedData);
        };
        fetchData();

        socket.on("checksheetCreated", (createdChecksheet) => {
            console.log('Checksheet created', createdChecksheet);
            fetchData();
        });

        
        return () => {
            //socket.disconnect();
            socket.off("checksheetCreated");
        };
    }, [socket]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on('connect', () => {
            console.log('Connected to socket');
        });

        socket.on('checksheetUpdated', (updatedChecksheet) => {
            if (!updatedChecksheet) {
                console.error('Received undefined checksheet');
                return;
            }

            // Transform the updated checksheet into the same format as the data in the state
            const transformedChecksheet = {
                id: updatedChecksheet._id,
                day: updatedChecksheet.day,
                lab: updatedChecksheet.lab,
                startTime: moment(updatedChecksheet.startTime).format('hh:mm A'),
                checkedBy: updatedChecksheet.checkedBy,
                actualTime: updatedChecksheet.actualTime ? moment(updatedChecksheet.actualTime).format('hh:mm A') : "",
                isChecked: updatedChecksheet.isChecked,
            };

            setData(prevData => {
                // Replace the updated checksheet in the data array
                const updatedData = prevData.map(sheet => sheet.id === transformedChecksheet.id ? transformedChecksheet : sheet);
                // Filter the data to show only the checksheets where isChecked is false
                return updatedData.filter(sheet => !sheet.isChecked);

            });

        });

        // Clean up the effect by disconnecting from the socket when the component is unmounted
        return () => {
            socket.off("checksheetUpdated");
            //socket.off("connect");
        };

    }, [socket]);

    const handleCheck = async ({ id, userName }) => {
        // Check if the socket is connected before emitting the event
        if (!socket.connected) {
            socket.connect();
        }
        try {
            if (!userName) {
                userName = prompt('Please enter your name');
                if (userName === null || userName === '') {
                    alert('Name is required');
                    return;
                }
            }

            const now = new Date();
            const actualTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            const response = await fetch(`/api/checksheet/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isChecked: true,
                    checkedBy: userName,
                    actualTime: actualTime,
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            //const data = await response.json();
            //console.log(data, 'Checksheet updated');

            // Fetch the updated checksheet
            const updatedChecksheetResponse = await fetch(`/api/checksheet/${id}`);
            const updatedChecksheet = await updatedChecksheetResponse.json();

            alert("Checksheet updated");
            socket.emit('checksheetUpdated', updatedChecksheet);

        } catch (err) {
            console.error(err);
            alert('Failed to update checksheet');
        }
    };

const handleCreateChecksheet = async () => {
    try {
        if (!socket.connected) {
            socket.connect();
        }
        const response = await fetch(`api/checksheet/create`, {
				 method: 'POST',
				 headers: {
                    'Content-Type': 'application/json',
},
                 });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Network response was not ok');
        }
        const createdChecksheet = await response.json();
        alert('Checksheet created');
        socket.emit('checksheetCreated', createdChecksheet);
    } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
    }
};


    const isSmallScreen = useMediaQuery({ query: '(max-width: 600px)' });

    const columns = useMemo(
        () => isSmallScreen ? [
            {
                accessorKey: 'lab',
                header: 'Lab',
                size: 30,
                filtervariant: 'select',
            },
            {
                accessorKey: 'startTime',
                header: 'Check Time',
                size: 50,
            },
        ] : [
            {
                accessorKey: 'lab',
                header: 'Lab',
                size: 30,
                filtervariant: 'select',
            },
            {
                accessorKey: 'startTime',
                header: 'Check Time',
                size: 50,
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
                size: 30,
            },
            {
                accessorKey: 'actualTime',
                header: 'Actual Time',
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
            columnPinning: { right: ['mrt-row-actions'] },
            columnOrder: [
                'mrt-row-select',
                'day',
                'lab',
                'startTime',
                'checkedBy',
            ],
            showColumnFilters: false,
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
        enableRowActions: true,
        positionActionsColumn: 'last',
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
        renderRowActions: ({ row }) => (
            <IconButton
                variant="light"
                disabled={row.original.checkedBy !== ""} // Disable the button if checkedBy is not an empty string
                sx={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                        backgroundColor: 'lightgray',
                    },
                }}
                onClick={async () => {
                    handleCheck({ id: row.original.id });
                }}
            >
                <CheckCircleOutlineIcon />
            </IconButton>
        ),
        renderTopToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                <Button
                    variant='primary'
                    onClick={async () => {
                        try {
                            if (!socket.connected) {
                                socket.connect();
                            }
                            const response = await fetch(`/api/checksheet/create`, {
				 method: 'POST',
				 headers: {
						'Content-Type': 'application/json',
				 	 },
					 });
                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Network response was not ok');
                            }
                            const createdChecksheet = await response.json();

                            alert('Checksheet created');
                            socket.emit('checksheetCreated', createdChecksheet);
                            //window.location.reload();
                        } catch (err) {
                            console.error(err);
                            alert(err.message);
                        }
                    }}
                >
                    Start a Checksheet
                </Button>

            </Box>

        ),
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

export default ChecksheetPage;
