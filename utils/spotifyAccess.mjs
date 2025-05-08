import AppError from "./AppError.mjs";

/* eslint-disable camelcase */
export default async function (code) {
  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  headers.append(
    "Authorization",
    `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
  );

  const response = await fetch(`${process.env.SPOTIFY_ACCESS_TOKEN_URL}`, {
    method: "POST",
    headers,
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new AppError("Failed to retrieve Spotify tokens", 400);
  }

  const { access_token, refresh_token, expires_in } = await response.json();

  return { access_token, refresh_token, expires_in };
}
