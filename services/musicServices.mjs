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
export const getTodaysTopMusic = async function () {};
