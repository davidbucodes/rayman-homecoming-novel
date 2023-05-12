import { LanguageId } from "../../databases/identifiers/languageId";

export type TextValue = Record<LanguageId, string>;

export const emptyTextValue: TextValue = {
	"ja-JP": "",
	"en-US": "",
	"he-IL": "",
};

export function convertTextToTextValue(text: string) {
	return {
		"ja-JP": text,
		"en-US": text,
		"he-IL": text,
	};
}
