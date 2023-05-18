import { MusicId } from "../databases/identifiers/musicId";
import { musicDatabase } from "../databases/music";
import { Audio } from "./audio";

export class Music extends Audio {
	constructor() {
		super({ loop: true });
	}

	start(musicId: MusicId) {
		this.setAudio(musicDatabase[musicId].url);
		this.setVolume(musicDatabase[musicId].extraVolume ? 50 : 10);

		this.fadeIn();
	}
}
