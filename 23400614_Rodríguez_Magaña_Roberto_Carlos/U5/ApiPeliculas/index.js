const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// ID
let siguienteId = 3;

// Arreglo de películas
let peliculas = [
    { id: 1, 
        nombre: 'Interestelar',
        director: 'Christopher Nolan',
        duracion: 169,
        imagen: 'https://th.bing.com/th/id/OIP.A_Un1W81X2-IvRPaGidRWwHaKz?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
        año: 2014,
        calificacion: 8.7
    },
    { id: 2,
        nombre: 'Inception',
        director: 'Christopher Nolan',
        duracion: 148,
        imagen: 'https://th.bing.com/th/id/OIP.8v5v5v5v5v5v5v5v5v5v5vHaKz?pid=ImgDetMain',
        año: 2010,
        calificacion: 8.8
    }
];
    
// READ - Ruta base
app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: 'Bienvenido a la API de Películas'
    });
});

// READ - Obtener todas las películas
app.get('/peliculas', (req, res) => {
    res.status(200).json({
        mensaje: 'Lista de películas',
        datos: peliculas
    });
});

// READ - Obtener una película por ID
app.get('/peliculas/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const pelicula = peliculas.find(p => p.id === id);

    if (!pelicula) {
        return res.status(404).json({
            mensaje: 'Película no encontrada'
        });
    }

    res.status(200).json(pelicula);
});

// CREATE - Agregar una pelicula
app.post('/peliculas', (req, res) => {
    const nuevaPelicula = {
        id: siguienteId++,
        nombre: req.body.nombre,
        director: req.body.director,
        duracion: req.body.duracion,
        imagen: req.body.imagen,
        año: req.body.año,
        calificacion: req.body.calificacion
    };

    peliculas.push(nuevaPelicula);

    res.status(201).json({
        mensaje: 'Película agregada correctamente',
        datos: nuevaPelicula
    });
});

// UPDATE - Modificar una película
app.put('/peliculas/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const pelicula = peliculas.find(p => p.id === id);

    if (!pelicula) {
        return res.status(404).json({
            mensaje: 'Película no encontrada'
        });
    }

    pelicula.nombre = req.body.nombre;
    pelicula.director = req.body.director;
    pelicula.duracion = req.body.duracion;
    pelicula.imagen = req.body.imagen;
    pelicula.año = req.body.año;
    pelicula.calificacion = req.body.calificacion;

    res.status(200).json({
        mensaje: 'Película actualizada correctamente',
        datos: pelicula
    });
});

// DELETE - Eliminar una película
app.delete('/peliculas/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const indice = peliculas.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Película no encontrada'
        });
    }

    peliculas.splice(indice, 1);

    res.status(200).json({
        mensaje: 'Película eliminada correctamente'
    });
});

// Iniciar servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
