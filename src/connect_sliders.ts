export default function connectSliders() {
	document.getElementById("title-font-size")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("title-text")).map((element) => {
			(element as HTMLElement).style.fontSize = `${
				(event.target as HTMLInputElement).value
			}%`;
		});
	});

	document.getElementById("title-letter-spacing")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("title-text")).map((element) => {
			(element as HTMLElement).style.letterSpacing = `${
				(event.target as HTMLInputElement).value
			}vh`;
		});
	});

	document.getElementById("artist-font-size")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("artist-text")).map((element) => {
			(element as HTMLElement).style.fontSize = `${
				(event.target as HTMLInputElement).value
			}%`;
		});
	});

	document.getElementById("artist-letter-spacing")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("artist-text")).map((element) => {
			(element as HTMLElement).style.letterSpacing = `${
				(event.target as HTMLInputElement).value
			}vh`;
		});
	});

	document.getElementById("metadata-font-size")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("metadata-text")).map((element) => {
			(element as HTMLElement).style.fontSize = `${
				(event.target as HTMLInputElement).value
			}%`;
		});
	});

	document.getElementById("metadata-letter-spacing")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("metadata-text")).map((element) => {
			(element as HTMLElement).style.letterSpacing = `${
				(event.target as HTMLInputElement).value
			}vh`;
		});
	});

	document.getElementById("track-font-size")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("track-text")).map((element) => {
			(element as HTMLElement).style.fontSize = `${
				(event.target as HTMLInputElement).value
			}%`;
		});
	});

	document.getElementById("track-letter-spacing")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("track-text")).map((element) => {
			(element as HTMLElement).style.letterSpacing = `${
				(event.target as HTMLInputElement).value
			}vh`;
		});
	});

	document.getElementById("track-height")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("track-text")).map((element) => {
			(element as HTMLElement).style.marginTop = `${
				(event.target as HTMLInputElement).value
			}%`;
		});
	});

	document.getElementById("track-width")?.addEventListener("input", (event) => {
		Array.from(document.getElementsByClassName("track-text")).map((element) => {
			(element as HTMLElement).style.marginRight = `${
				(event.target as HTMLInputElement).value
			}%`;
		});
	});
}
