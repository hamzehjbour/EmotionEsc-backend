import AppError from "../utils/AppError.mjs";

const headers = new Headers();
headers.append("Content-Type", "application/x-www-form-urlencoded");

let accessToken = "";
let expiresIn = 3600;
const emotionToGenresMap = {
  happy: ["pop", "dance", "reggae"],
  sad: ["blues", "acoustic", "singer-songwriter"],
  angry: ["rock", "metal", "punk"],
  fearful: ["ambient", "experimental", "soundtrack"],
  disgusted: ["industrial", "hardcore"],
  surprised: ["electronic", "alternative"],
  neutral: ["classical", "jazz", "chill"]
};


export const getAccessToken = async function () {
  try {
    const res = await fetch(`${process.env.SPOTIFY_ACCESS_TOKEN_URL}`, {
      method: "POST",
      headers,
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: `${process.env.SPOTIFY_CLIENT_ID}`,
        client_secret: `${process.env.SPOTIFY_CLIENT_SECRET}`,
      }),
    });

    const data = await res.json();

    accessToken = data.access_token;
    expiresIn = data.expires_in || 3600;
    // console.log(data);

    setTimeout(getAccessToken, (expiresIn - 300) * 100);
  } catch (err) {
    throw new AppError(err.message, 401);
  }
};

export const getMusicRecommendation = async function (em="happy",page=1) {
  
  if (!emotionToGenresMap[em]) {
    throw new AppError("Can't recognize your emotion ", 400);
  }
  if ( page < 1 || !parseInt(page)) {
    throw new AppError("Invalid page number", 400);
  }
  const limit=10;
  const genre = emotionToGenresMap[em].join(",");
  const offset=(page-1)*limit;
  const url = new URL(`${process.env.SPOTIFY_URL}/search?q=${genre}&type=track&limit=${limit}&offset=${offset}`);

  const res = await fetch(url, {
      method: "GET",
      headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
      },
  });

  if (!res.ok) {
      throw new AppError("Failed to fetch music recommendations", res.status);
  }

  const data = await res.json();
  
  if (!data.tracks || !data.tracks.items) {
      throw new AppError("Invalid track data format", 500);
  }

  return data.tracks.items.map(track => ({
      duration_ms: track.duration_ms,
      id: track.id,
      name: track.name,
      uri: track.uri,
      artists: track.album.artists.map(artist => artist.name), 
      images: track.album. images
  }));
};

export const getTodaysTopMusic = async function () {};