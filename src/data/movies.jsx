export const PELICULAS = [
  {
    id: 1,
    titulo: "Inception",
    poster: "https://m.media-amazon.com/images/I/71uKM+LdgFL.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    anio: 2010,
    director: "Christopher Nolan",
    duracion: "2h 28m",
    rating: 8.8,
    sinopsis: "Dom Cobb es un ladrón con una extraña habilidad para entrar a los sueños...",
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0", // <--- URL Embed de YouTube
    // Convertimos el elenco en objetos con foto
    elenco: [
      { nombre: "Leonardo DiCaprio", personaje: "Cobb", foto: "https://image.tmdb.org/t/p/w200/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { nombre: "Joseph Gordon-Levitt", personaje: "Arthur", foto: "https://image.tmdb.org/t/p/w200/4X1WbT8685kL12M28J1uQWjQGj5.jpg" },
      { nombre: "Elliot Page", personaje: "Ariadne", foto: "https://image.tmdb.org/t/p/w200/tp5p45FLL9x7YQ9k8dM8lWbN5q.jpg" },
      { nombre: "Tom Hardy", personaje: "Eames", foto: "https://image.tmdb.org/t/p/w200/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg" },
    ],
    // 1. NUEVO: Array de Imágenes para la Galería
    galeria: [
        "https://image.tmdb.org/t/p/w500/8ZTVqvKDQ8emSguM1agfeX5o2Z.jpg",
        "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg",
        "https://image.tmdb.org/t/p/w500/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
        "https://image.tmdb.org/t/p/w500/citn1apBkOEwyPQVOwvzxhtkTqS.jpg"
    ],

    // 2. NUEVO: Array de Reseñas de usuarios
    resenas: [
        { usuario: "Cinéfilo99", avatar: null, rating: 10, comentario: "Simplemente una obra maestra. Nolan lo hizo de nuevo.", fecha: "2024-01-15" },
        { usuario: "Maria_Movie", avatar: "https://i.pravatar.cc/150?u=maria", rating: 9, comentario: "Visualmente impresionante, aunque la trama es compleja.", fecha: "2024-02-10" },
        { usuario: "JuanPerez", avatar: null, rating: 8, comentario: "Un poco larga, pero vale la pena por el final.", fecha: "2024-03-05" }
    ],
    tagline: "Tu mente es la escena del crimen.", // <--- Esto se verá genial
    genero: "Ciencia Ficción, Thriller, Acción", // Asegúrate que sea un string separado por comas o un array
  },
  // ... resto de películas
];