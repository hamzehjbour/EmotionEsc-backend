import AppError from "../utils/AppError.mjs";

const headers = new Headers();
headers.append("Content-Type", "application/x-www-form-urlencoded");

let accessToken = "";
let expiresIn = 3600;

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

export const getMusicRecommendation = async function () {};

// Function to fetch today's top music from Spotify
export const getTodaysTopMusic = async function (page = 1) {
  if (page < 0 || !parseInt(page)) {
    throw new AppError("Invalid Page Number", 400);
  }
  const limit = 10;
  const offset = (page - 1) * limit;
  const response = await fetch(
    `${process.env.SPOTIFY_URL}/playlists/5ABHKGoOzxkaa28ttQV9sE/tracks?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  const data = await response.json();
  const tracks = data.items.map(({ track }) => ({
    name: track.name,
    duration_ms: track.duration_ms,
    uri: track.uri,
    artist: track.artists[0]?.name,
    images: track.album.images,
  }));

  if (data.error) {
    const statusCode = data.error.status || 500;
    const message = data.error.message || "Failed to fetch top music";

    throw new AppError(message, statusCode); // Throw an error
  }

  return tracks;
};
