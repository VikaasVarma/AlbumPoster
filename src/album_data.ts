import moment from "moment";
import { getAlbumData } from "./spotify";

export default class AlbumData {
	constructor(
		public id: string | null = null,
		public title: string | null = null,
		public image: string | null = null,
		public artist: string | null = null,
		public length: string | null = null,
		public date: string | null = null,
		public genres: string[] | null = null,
		public tracks: string[] | null = null,
		public skill_means: number[] | null = null
	) {}

	setId(id: string) {
		this.id = id;
	}

	async initialiseData() {
		if (this.id === null) {
			console.error("Album ID not set");
			return;
		}

		const { album, tracks, track_features, artist } = await getAlbumData(this.id);
		this.title = album.body.name;
		this.image = album.body.images[0].url;
		this.artist = album.body.artists[0].name;

		const length = moment.duration(
			tracks.body.tracks.reduce((acc, { duration_ms }) => acc + duration_ms / 1000, 0),
			"seconds"
		);
		this.length = `${Math.floor(length.asMinutes())}:${length
			.seconds()
			.toString()
			.padStart(2, "0")}`;

		this.date = moment(album.body.release_date).format("DD MMMM YYYY");

		this.genres = artist.body.genres;
		this.tracks = tracks.body.tracks.map(({ name }) => name.split(" - ")[0]);

		const num_tracks = tracks.body.tracks.length;
		this.skill_means = track_features.body.audio_features.reduce(
			(
				[_danceability, _energy, _valence, _instrumentalness, _tempo],
				{ danceability, energy, valence, instrumentalness, tempo }
			) => [
				_danceability + danceability / num_tracks,
				_energy + energy / num_tracks,
				_valence + valence / num_tracks,
				_instrumentalness + instrumentalness / num_tracks,
				_tempo + tempo / num_tracks / 200,
			],
			[0, 0, 0, 0, 0]
		);
	}
}
