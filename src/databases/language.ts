import { LanguageId } from "./identifiers/languageId";

export interface LanguageData {
	displayName: Record<LanguageId, string>;
}

export const languageDatabase: Record<LanguageId, LanguageData> = {
	"ja-JP": {
		displayName: {
			"ja-JP": "日本語",
			"en-US": "Japanese",
			"he-IL": "יפנית",
		},
	},
	"en-US": {
		displayName: {
			"ja-JP": "英語",
			"en-US": "English",
			"he-IL": "אנגלית",
		},
	},
	"he-IL": {
		displayName: {
			"ja-JP": "ヘブライ語",
			"en-US": "Hebrew",
			"he-IL": "עברית",
		},
	},
};
