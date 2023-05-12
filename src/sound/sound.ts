import { soundDatabase } from "../databases/sound";
import { SoundId } from "../databases/identifiers/soundId";
import { Audio } from "./audio";

export class Sound extends Audio {
	constructor() {
		super({ removeOnPause: true });
	}

	start(soundId: SoundId) {
		this.setAudio(soundDatabase[soundId].url);
		this.setVolume(soundDatabase[soundId].extraVolume ? 70 : 30);

		this.play();
	}
}
