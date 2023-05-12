import { LanguageId } from "./identifiers/languageId";
import { Gender } from "./speaker";

type VoiceData = Record<Gender, string>;

export const voiceDatabase: Record<LanguageId, VoiceData> = {
	"ja-JP": {
		male: "Microsoft Ichiro - Japanese (Japan)",
		female: "Microsoft Haruka - Japanese (Japan)",
	},
	"en-US": {
		male: "Microsoft Mark - English (United States)",
		female: "Microsoft Zira - English (United States)",
	},
	"he-IL": {
		male: "Microsoft Asaf - Hebrew (Israel)",
		female: "Microsoft Zira - English (United States)",
	},
};
