import { LanguageId } from "../../databases/identifiers/languageId";
import { TextValue } from "./textValue";

const FURIGANA_NOTATIONS_REGEXP = /‘(.*?)‘(.*?)‘/g;

export class TextUtils {
	static formatTextForDisplay(text: string, language: LanguageId): string {
		if (language === LanguageId.jaJP) {
			const formattedText = this.replaceNotationsWithHtmlRuby(text);
			return formattedText;
		}
		if (language === LanguageId.heIL) {
			const formattedText = this.removeNotations(text);
			return formattedText;
		}
		return text;
	}

	static formatTextForSpeak(text: Partial<TextValue>, language: LanguageId): string {
		const currentLanguageText = text[language];
		if ([LanguageId.jaJP, LanguageId.heIL].includes(language)) {
			return this.replaceNotationsWithFurigana(currentLanguageText);
		}
		return currentLanguageText;
	}

	private static removeNotations(text: string) {
		return text.replace(FURIGANA_NOTATIONS_REGEXP, "$1");
	}

	private static replaceNotationsWithFurigana(text: string): string {
		return text.replace(FURIGANA_NOTATIONS_REGEXP, "$2");
	}

	private static replaceNotationsWithHtmlRuby(text: string): string {
		return text.replace(FURIGANA_NOTATIONS_REGEXP, "<ruby>$1<rt>$2</rt></ruby>");
	}
}
