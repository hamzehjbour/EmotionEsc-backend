const headers = new Headers();
headers.append("accept", "application/json");
headers.append("Authorization", `Bearer ${process.env.TMDB_API_KEY} `);

const options = {
  method: "GET",
  headers,
};

const movieGenres = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const emotionToGenresMap = {
  angry: [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Family",
    "Fantasy",
    "Music",
    "Science Fiction",
    "TV Movie",
  ],
  disgusted: [
    "Animation",
    "Comedy",
    "Family",
    "Music",
    "Adventure",
    "Fantasy",
    "Science Fiction",
    "TV Movie",
  ],
  fearful: [
    "Animation",
    "Comedy",
    "Family",
    "Music",
    "Adventure",
    "Fantasy",
    "Romance",
    "Science Fiction",
    "TV Movie",
  ],
  sad: [
    "Animation",
    "Comedy",
    "Family",
    "Music",
    "Adventure",
    "Fantasy",
    "Romance",
    "Science Fiction",
    "TV Movie",
  ],

  neutral: [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ],
  happy: [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ],
  surprised: [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ],
};

export const getMovieRecommendations = async function (
  em,
  page = 1,
  lang = "en-US",
) {
  let url = `${process.env.TMDB_URL}/discover/movie?page${page}&language=${lang}`;

  if (em) {
    const genres = emotionToGenresMap[em];

    /*
  const ids = movieGenres
    .map((movieGenre) => {
      if (genres.includes(movieGenre.name)) return movieGenre.id;
    })
    .filter((id) => id !== undefined);
    */

    // More Readable and Maintainable approach
    const ids = movieGenres
      .filter((movieGenre) => genres.includes(movieGenre.name))
      .map((movieGenre) => movieGenre.id)
      .join("|");

    // console.log(ids);

    url = url.concat(`&with_genres=${ids}`);
  }

  const response = await fetch(url, options);

  const data = await response.json();

  return data;
};

export const getPopularMovies = async function (page = 1, lang = "en-US") {
  const response = await fetch(
    `${process.env.TMDB_URL}/movie/popular?page=${page}&language=${lang}`,
    options,
  );

  const data = await response.json();

  return data;
};

export const getTopRatedMovies = async function (page = 1, lang = "en-US") {
  const response = await fetch(
    `${process.env.TMDB_URL}/movie/top_rated?page=${page}&language=${lang}`,
    options,
  );

  const data = await response.json();

  return data;
};

export const getMovieDetails = async function (movieID) {
  const response = await fetch(
    `${process.env.TMDB_URL}/movie/${movieID}?append_to_response=videos`,
    options,
  );

  const data = await response.json();

  const videos = data.videos;

  const trailers = videos.results.filter((res) => res.type === "Trailer");

  delete data.videos;

  // console.log(details, posters);

  return { ...data, trailers };
};
