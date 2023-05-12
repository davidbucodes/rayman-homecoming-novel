import { SoundId } from "./identifiers/soundId";

export interface SoundData {
	url: string;
	extraVolume?: true;
}

export const soundDatabase: Record<SoundId, SoundData> = {
	UbisoftPresents: {
		url: "./assets/sounds/ubisoft_presents.mp3",
	},
	Yeah: {
		url: "./assets/sounds/yeah.mp3",
	},
};
