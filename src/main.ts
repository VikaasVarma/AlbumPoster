import "./background-style.scss";
import "./poster-style.scss";

import handleInputs from "./inputs";
import AlbumData from "./album_data";

// createAlbumCover("/endless.jpeg", title, artist, length, date, genres, tracks);
const albumData = new AlbumData();
handleInputs(albumData);
