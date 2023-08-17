import AlbumData from "./album_data";
import getColors from "./process_image";
import createSkillWheel from "./skill_wheel";
import { searchAlbums } from "./spotify";
import createAlbumCover from "./album_cover";

import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

function setupColors(albumData: AlbumData) {
	document
		.getElementById("reset-colors")
		?.addEventListener("click", async () =>
			createSkillWheel(await getColors(), albumData.skill_means ?? [])
		);
}

function setupDownload() {
	document.getElementById("download")?.addEventListener("click", () => {
		// Render and download the album poster
		const element = document.getElementById("capture")!;
		const title = (document.getElementById("album-input") as HTMLInputElement).value;
		if (element !== null) {
			html2canvas(element, { scale: 4, allowTaint: true, useCORS: true }).then((canvas) => {
				canvas.toBlob(function (blob) {
					if (blob !== null) {
						saveAs(blob, `${title}.png` ?? "album-poster.png");
					}
				});
			});
		}
	});
}

function selectAlbum(albumData: AlbumData) {
	const capture = document.getElementById("capture");
	if (capture !== null) {
		capture.remove();
	}
	albumData.initialiseData().then(() => {
		createAlbumCover(albumData);
	});
}

function setupDropdown(albumData: AlbumData) {
	const dropdownItems = document.getElementById("dropdown-items")!;
	const albumInput = document.getElementById("album-input")!;

	let timeout: null | NodeJS.Timeout = null;
	albumInput.addEventListener("input", (event) => {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			dropdownItems.innerHTML = "";

			if ((event.target as HTMLInputElement).value === "") {
				return;
			}

			searchAlbums((event.target as HTMLInputElement).value).then((albums) => {
				albums
					?.map(({ name, artists, id }) => ({
						name: `${name} by ${artists[0].name}`,
						id,
					}))
					.filter(({ name }) =>
						name
							.toLowerCase()
							.startsWith((event.target as HTMLInputElement).value.toLowerCase())
					)
					.map(({ name, id }) => {
						const option = document.createElement("p");
						option.innerText = name;
						option.addEventListener("click", () => {
							(albumInput as HTMLInputElement).value = name;
							dropdownItems.innerHTML = "";
							albumData.setId(id);
							selectAlbum(albumData);
						});
						dropdownItems.appendChild(option);
					});
			});
		}, 500);
	});
}

export default function handleInputs(albumData: AlbumData) {
	setupDownload();
	setupDropdown(albumData);
	setupColors(albumData);
}
