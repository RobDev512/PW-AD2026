const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: 'Servidor Express funcionando correctamente',  
        estado: 'OK'
    });
});

app.get('/saludo/:nombre', (req, res) => {
    const n = req.params.nombre;
    res.status(200).json({
        mensaje: 'Hola ' +n,
        estado: 'OK'
    });
});

app.get('/sumar/:a/:b', (req, res) => {
    const n1 = parseInt(req.params.a);
    const n2 = parseInt(req.params.b);
    const r = n1 + n2;
    res.status(200).json({
        operacion: 'suma',
        valores: {a:n1, b:n2},
        resultado: r
    });
});

app.listen(3000, () => {
    console.log('Servidor Corriendo en http://localhost:3000');
});