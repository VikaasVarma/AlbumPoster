import createSkillWheel from "./skill_wheel";
import connectSliders from "./connect_sliders";
import getColors from "./process_image";
import AlbumData from "./album_data";

function setupBackground() {
	const poster = document.createElement("div");
	poster.classList.add("poster");
	poster.id = "capture";
	poster.style.backgroundColor = "#ebeae6";

	document.getElementById("poster-div")!.appendChild(poster);
	return poster;
}

function addAlbumCover(container: HTMLElement, img: string) {
	const albumCover = document.createElement("img");
	albumCover.classList.add("image");
	albumCover.id = "album-cover";
	albumCover.crossOrigin = "anonymous";
	albumCover.src = img;
	container.appendChild(albumCover);
}

function addTitle(container: HTMLElement, title: string) {
	const _title = document.createElement("div");
	_title.classList.add("title");

	const titleText = document.createElement("p");
	titleText.classList.add("title-text");
	titleText.innerText = title;

	_title.appendChild(titleText);
	container.appendChild(_title);
}

function addArtist(container: HTMLElement, artist: string) {
	const _artist = document.createElement("div");
	_artist.classList.add("artist");

	const artistText = document.createElement("p");
	artistText.classList.add("artist-text");
	artistText.innerText = artist;

	_artist.appendChild(artistText);
	container.appendChild(_artist);
}

function addDivider(container: HTMLElement, row: number) {
	const divider = document.createElement("div");
	divider.classList.add("divider");
	divider.style.cssText = `--row: ${row}`;
	container.appendChild(divider);
}

function addMetadata(container: HTMLElement, length: string, date: string, genres: string[]) {
	const metedata = document.createElement("div");
	metedata.classList.add("metadata");

	for (const text of [length, genres.join(" • "), date]) {
		const _text = document.createElement("p");
		_text.classList.add("metadata-text");
		_text.innerText = text;
		metedata.appendChild(_text);
	}

	container.appendChild(metedata);
}

function addTracks(container: HTMLElement, tracks: string[]) {
	const _tracks = document.createElement("div");
	_tracks.classList.add("tracks");
	for (const track of tracks) {
		const _track = document.createElement("p");
		_track.classList.add("track-text");
		_track.innerText = track;
		_tracks.appendChild(_track);
	}
	container.appendChild(_tracks);
}

export default async function createAlbumCover(albumData: AlbumData) {
	const { image, title, artist, length, date, genres, tracks, skill_means } = albumData;
	if (
		image === null ||
		title === null ||
		artist === null ||
		length === null ||
		date === null ||
		genres === null ||
		tracks === null ||
		skill_means === null
	) {
		console.error("Album data not set");
		return;
	}

	const container = setupBackground();

	addAlbumCover(container, image);

	addTitle(container, title);
	addArtist(container, artist);

	addDivider(container, 5);
	addMetadata(container, length, date, genres);
	addDivider(container, 6);

	addTracks(container, tracks);

	connectSliders();
	createSkillWheel(await getColors(), skill_means);
}
