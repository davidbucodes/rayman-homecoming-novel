import { AudioData } from "../../databases/chapter/chapter";
import { Audio, AudioVolume } from "../../sound/audio";

export class AudioLoader {
	private static _audioById: Record<string, Audio> = {};

	static async load(
		audiosData: AudioData[],
		cleanPreviousAudio = true,
		volume: AudioVolume = 100,
	) {
		if (cleanPreviousAudio) {
			this.cleanLoadedAudio();
		}

		const loadPromises: Promise<void>[] = [];
		const loaded: Record<string, "notloaded" | "loaded"> = {};
		for (const audioData of audiosData) {
			if (loaded[audioData.id] === "loaded") {
				continue;
			}

			loadPromises.push(
				new Promise((resolve) => {
					loaded[audioData.id] = "notloaded";
					const audio = new Audio({
						onReadyCallback: () => {
							loaded[audioData.id] = "loaded";
							resolve();
						},
					});
					audio.setVolume(volume);
					audio.setAudio(audioData.base64Audio);
					this._audioById[audioData.id] = audio;
				}),
			);
		}

		await Promise.all(loadPromises);
	}

	static get(audioId: string): Audio {
		return this._audioById[audioId];
	}

	static stopAll() {
		Object.values(this._audioById).forEach((audio) => audio.pause());
	}

	private static cleanLoadedAudio() {
		Object.values(this._audioById).forEach((audio) => audio.remove());
		this._audioById = {};
	}
}
