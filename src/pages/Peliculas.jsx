import MovieCard from "../components/MovieCard";
import MovieSection from "../components/MovieSection";

const PELICULAS = [
  {
    id: 1,
    titulo: "Inception",
    poster: "https://m.media-amazon.com/images/I/71uKM+LdgFL.jpg",
    anio: 2010,
  },
  {
    id: 2,
    titulo: "Interstellar Interstellar Interstellar Interstellar",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    anio: 2014,
  },
  {
    id: 3,
    titulo: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    anio: 2008,
  },
  {
    id: 4,
    titulo: "Avatar",
    poster: "https://image.tmdb.org/t/p/w500/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
    anio: 2009,
  },
  {
    id: 5,
    titulo: "Avengers: Endgame",
    poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    anio: 2019,
  },
  {
    id: 6,
    titulo: "Dune",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    anio: 2021,
  },
  {
    id: 7,
    titulo: "Oppenheimer",
    poster: "https://moviepostermexico.com/cdn/shop/files/oppenheimer_ver3_xxlg_1024x1024@2x.jpg?v=1690337282",
    anio: 2023,
  },
  {
    id: 8,
    titulo: "The Matrix",
    poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
    anio: 1999,
  },
  {
    id: 9,
    titulo: "Gladiator",
    poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
    anio: 2000,
  },
  {
    id: 10,
    titulo: "Titanic",
    poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    anio: 1997,
  },
  {
    id: 11,
    titulo: "Joker",
    poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    anio: 2019,
  },
  {
    id: 12,
    titulo: "Fight Club",
    poster: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
    anio: 1999,
  },
  {
    id: 13,
    titulo: "Forrest Gump",
    poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    anio: 1994,
  },
  {
    id: 14,
    titulo: "The Lord of the Rings",
    poster: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    anio: 2001,
  },
  {
    id: 15,
    titulo: "Star Wars: A New Hope",
    poster: "https://image.tmdb.org/t/p/w500/6FfCtAuVAW8XJjZ7eWeLibRLWTw.jpg",
    anio: 1977,
  },
  {
    id: 16,
    titulo: "Spider-Man: No Way Home",
    poster: "https://image.tmdb.org/t/p/w500/uJYYizSuA9Y3DCs0qS4qWvHfZg4.jpg",
    anio: 2021,
  },
  {
    id: 17,
    titulo: "Doctor Strange",
    poster: "https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
    anio: 2016,
  },
  {
    id: 18,
    titulo: "Black Panther",
    poster: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    anio: 2018,
  },
  {
    id: 19,
    titulo: "Toy Story",
    poster: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    anio: 1995,
  },
  {
    id: 20,
    titulo: "Jurassic Park",
    poster: "https://cdn.shopify.com/s/files/1/0747/3829/products/HP3038_4be877cf-40be-4cd6-8973-3c5063475b14.jpg?v=1748536972",
    anio: 1993,
  },
];

function Peliculas() {
  return (
    <div className="mt-28">
      <MovieSection title="Todas las Peliculas" movies={PELICULAS} layout="grid" />
    </div>
  );
}

export default Peliculas;
