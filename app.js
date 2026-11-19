// kütüphane tanımlamaları
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const fs = require('fs');
// basit veritabanı sistemi
function saveData(key, value) {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    data[key] = value;
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

function getData(key) {
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    return data[key];
}

const app = express();

// Socket.IO sunucusu oluşturma
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('sensorData', (data) => {
        io.emit('sensorData', data);
    });
    socket.on('saveSettings', (data) => {
        saveData('sensorSettings', data);
    });
    socket.on('ultrasonikData', (data) => {
        io.emit('ultrasonikData', data)
    })
    socket.on('sicaklikData', (data) => {
        io.emit('sicaklikData', data);
    });
    socket.on('nemData', (data) => {
        io.emit('nemData', data);
    });
    socket.on('isikData', (data) => {
        io.emit('isikData', data);
    });
    socket.on('gazData', (data) => {
        io.emit('gazData', data);
    });
    socket.on('titresimData', (data) => {
        io.emit('titresimData', data);
    });
});



app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/sensorler', (req, res) => {
    res.render('sensorler');
});

app.get('/alarm', (req, res) => {
    res.render('alarm');
});

app.get('/ayarlar', (req, res) => {
    res.render('ayarlar', { sensorSettings: getData('sensorSettings') });
});

app.post('/getSettingsData', (req, res) => {
    res.json({
        ultrasonik: getData('ultrasonik'),
        gas: getData('gas'),
        titresim: getData('vibration'),
        sicaklik: getData('temp'),
        nem: getData('humidity'),
        isik: getData('light')
    })
});



app.post('/saveSettings', (req, res) => {
    const { sensorType, min, max, delay } = req.body;
    saveData(sensorType, { min: parseInt(min), max: parseInt(max), ms: parseInt(delay) });
    res.json({ success: true });
});

server.listen(3000, () => {
    console.log(`Kontrol paneli çalışıyor. http://localhost:3000`);
});