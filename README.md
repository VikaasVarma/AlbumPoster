# AlbumPoster
HTML frontend hooked up to Spotify API to generate a good looking poster for any input album.

# Usage

At the moment, to use this for yourself, there is a bit of setup required:
1. Clone the repository
2. Download `node.js` if you don't already have it and run `npm install` in the root directory
3. Create a [Spotify Developer](https://developer.spotify.com/) account and [create an app](https://developer.spotify.com/documentation/web-api/concepts/apps)
4. Create a `.env.development` file in the root directory and add the client ID and client secret under the environment variables `VITE_SPOTIFY_CLIENT_ID` and `VITE_SPOTIFY_CLIENT_SECRET`
5. Open a terminal and run `npm run dev` to start the server
6. Navigate to the provided url (most likely [http://localhost:5173/](http://localhost:5173/)) in your browser and you should be greeted by a screen similar to the below.
7. Have fun.

<br>

![Title Screen](https://drive.google.com/uc?id=15FKP3vM2q46IZE5bhLn3vbbBgnU7JjKR)

# Example Covers

![Circles](examples/Circles%20by%20Mac%20Miller.png)

![DAMN](examples/DAMN.%20by%20Kendrick%20Lamar.png)

![Endtroducing](examples/Endtroducing.....%20by%20DJ%20Shadow.png)