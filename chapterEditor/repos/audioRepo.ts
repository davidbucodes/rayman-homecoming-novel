import yaml from "js-yaml";
import { AudioData, Chapter } from "../../src/databases/chapter/chapter";

export class AudioRepo {
	static onVoicesChangedCallbacks: Array<() => void> = [];
	private static _audiosData: AudioData[] = [];

	static set(audiosData: AudioData[] = []) {
		this._audiosData = audiosData;
	}

	static reset() {
		this._audiosData = [];
	}

	static get(audioId: string): string {
		return this._audiosData.find((audio) => audio.id === audioId)?.base64Audio;
	}

	static add(audioData: AudioData) {
		this._audiosData.push(audioData);
		this.onVoicesChangedCallbacks.forEach((callback) => callback());
	}

	static remove(previousAudioId: string) {
		if (previousAudioId) {
			this._audiosData = this._audiosData.filter((audio) => audio.id !== previousAudioId);
			this.onVoicesChangedCallbacks.forEach((callback) => callback());
		}
	}

	static get voices(): AudioData[] {
		return this._audiosData;
	}

	static get yaml(): string {
		const objectToDump: Partial<Chapter> = { audio: this._audiosData };
		const yamlContent = yaml.dump(objectToDump, {
			indent: 2,
		});
		return yamlContent;
	}

	static onVoicesChanged(callback: () => void) {
		this.onVoicesChangedCallbacks.push(callback);
	}
}
