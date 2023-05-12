import { LanguageId } from "./identifiers/languageId";
import { SpeakerId } from "./identifiers/speakerId";

export enum Gender {
	Male = "male",
	Female = "female",
}

export interface SpeakerData {
	voice: {
		pitch: number;
		gender: Gender;
	};
	images: {
		profile: string[];
		profileDirection: "right" | "left" | "center";
		profileBlink?: string;
	};
	name: Record<LanguageId, string>;
}

export const speakersDatabase: { [speakerId in SpeakerId]: SpeakerData } = {
	Rayman: {
		name: {
			"he-IL": "ריימן",
			"en-US": "Rayman",
			"ja-JP": "レイマン",
		},
		voice: {
			gender: Gender.Male,
			pitch: 1.7,
		},
		images: {
			profile: [
				"./assets/images/speaker/rayman/0.png",
				"./assets/images/speaker/rayman/1.png",
				"./assets/images/speaker/rayman/2.png",
			],
			profileDirection: "center",
		},
	},
	Musician: {
		name: {
			"he-IL": "מוזיקאי",
			"en-US": "Musician",
			"ja-JP": "ミュジシャーン",
		},
		voice: {
			gender: Gender.Male,
			pitch: 1,
		},
		images: {
			profile: [
				"./assets/images/speaker/musician/0.png",
				"./assets/images/speaker/musician/1.png",
				"./assets/images/speaker/musician/2.png",
			],
			profileDirection: "right",
			profileBlink: "./assets/images/speaker/musician/blink.png",
		},
	},
	Globox: {
		name: {
			"he-IL": "גלובוקס",
			"en-US": "Globox",
			"ja-JP": "ゲロボックス",
		},
		voice: {
			gender: Gender.Male,
			pitch: 0,
		},
		images: {
			profile: [
				"./assets/images/speaker/globox/0.png",
				"./assets/images/speaker/globox/1.png",
				"./assets/images/speaker/globox/2.png",
			],
			profileDirection: "center",
			profileBlink: "./assets/images/speaker/globox/blink.png",
		},
	},
	Tarayzan: {
		name: {
			"he-IL": "טרייזן",
			"en-US": "Tarayzan",
			"ja-JP": "タライザン",
		},
		voice: {
			gender: Gender.Male,
			pitch: 1.5,
		},
		images: {
			profile: [
				"./assets/images/speaker/tarayzan/0.png",
				"./assets/images/speaker/tarayzan/1.png",
				"./assets/images/speaker/tarayzan/2.png",
			],
			profileDirection: "center",
			profileBlink: "./assets/images/speaker/tarayzan/blink.png",
		},
	},
	MrSkops: {
		name: {
			"he-IL": "אדון סקופס",
			"en-US": "MrSkops",
			"ja-JP": "スコプス殿",
		},
		voice: {
			gender: Gender.Male,
			pitch: 0,
		},
		images: {
			profile: [
				"./assets/images/speaker/mrskops/0.png",
				"./assets/images/speaker/mrskops/1.png",
				"./assets/images/speaker/mrskops/2.png",
			],
			profileDirection: "center",
			profileBlink: "./assets/images/speaker/mrskops/blink.png",
		},
	},
	Betilla: {
		name: {
			"he-IL": "בטילה",
			"en-US": "Betilla",
			"ja-JP": "ベティラ",
		},
		voice: {
			gender: Gender.Female,
			pitch: 1,
		},
		images: {
			profile: [
				"./assets/images/speaker/betilla/0.png",
				"./assets/images/speaker/betilla/1.png",
			],
			profileDirection: "left",
			profileBlink: "./assets/images/speaker/betilla/blink.png",
		},
	},
	Joe: {
		name: {
			"he-IL": "ג'ו",
			"en-US": "Joe",
			"ja-JP": "ジョー",
		},
		voice: {
			gender: Gender.Male,
			pitch: 5,
		},
		images: {
			profile: [
				"./assets/images/speaker/joe/0.png",
				"./assets/images/speaker/joe/1.png",
				"./assets/images/speaker/joe/2.png",
			],
			profileDirection: "left",
			profileBlink: "./assets/images/speaker/joe/blink.png",
		},
	},
	Magician: {
		name: {
			"he-IL": "הקוסם",
			"en-US": "The Magician",
			"ja-JP": "マジシャンさん",
		},
		voice: {
			gender: Gender.Male,
			pitch: 7,
		},
		images: {
			profile: ["./assets/images/speaker/magician/1.png"],
			profileDirection: "left",
		},
	},
};
