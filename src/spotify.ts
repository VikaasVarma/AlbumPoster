import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

async function setupSpotifyApi(): Promise<SpotifyWebApi> {
	const spotifyApi = new SpotifyWebApi({
		clientId: clientId,
		clientSecret: clientSecret,
		redirectUri: "http://localhost",
	});

	await axios({
		url: "https://accounts.spotify.com/api/token",
		method: "post",
		data: {
			grant_type: "client_credentials",
			client_id: clientId,
			client_secret: clientSecret,
		},
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	}).then((response) => {
		spotifyApi.setAccessToken(response.data.access_token);
	});

	return spotifyApi;
}

const spotifyApi = await setupSpotifyApi();

async function searchAlbums(query: string) {
	return await spotifyApi.searchAlbums(query).then((data) => {
		return data.body.albums?.items;
	});
}

async function getAlbumData(albumId: string) {
	const album = await spotifyApi.getAlbum(albumId);
	const artist = await spotifyApi.getArtist(album.body.artists[0].id);
	const _tracks = await spotifyApi.getAlbumTracks(albumId, { limit: 50 });
	const tracks = await spotifyApi.getTracks(_tracks.body.items.map(({ id }) => id));
	const track_features = await spotifyApi.getAudioFeaturesForTracks(
		_tracks.body.items.map(({ id }) => id)
	);
	return { album, tracks, track_features, artist };
}

export { setupSpotifyApi, searchAlbums, getAlbumData };
