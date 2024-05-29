const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const checksheetController = require('./controllers/checksheetController');
const Checksheet = require('./models/Checksheet'); // Path to Models

const app = express();
const server = http.createServer(app);

const checksheetRouter = require('./routes/checksheetRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');

const mongoUrl = process.env.MONGO_URL;

async function getUpdatedChecksheet(id) {
    const updatedChecksheet = await Checksheet.findById(id);
    return updatedChecksheet;
}

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log(process.env.FRONTEND_URL), "frontend url";

const io = require("socket.io")(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

app.use('/api/checksheet', checksheetRouter);
app.use('/api/schedule', scheduleRouter);

io.on("connect", (socket) => {
    socket.on('checksheetUpdated', (updatedChecksheet) => {
        console.log('Checksheet updated', updatedChecksheet._id);
        // Emit the 'checksheetUpdated' event to the other clients with the updated checksheet
        io.emit('checksheetUpdated', updatedChecksheet);
        console.log('broadcasted');
    });
    socket.on('checksheetCreated', (createdChecksheets) => {
        io.emit('checksheetCreated', createdChecksheets);
        console.log('Checksheet created -server', createdChecksheets);
    });
    socket.on('scheduleUpdated', () => console.log('Schedule updated'));
    socket.on('disconnect', () => console.log('Client disconnected'));
});


app.post('/api/checksheet/create', (req, res) => {
    try {
        // Your logic here
        res.json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const port = process.env.PORT || 5000;
//app.listen(5000, () => {
//    console.log('Server running on http://localhost:5000');
//});
//const port = 5000;
server.listen(port, () => console.log(`Server running on port ${port}`));

