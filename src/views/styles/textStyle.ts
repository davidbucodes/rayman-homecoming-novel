import * as PIXI from "pixi.js";
import { LanguageId } from "../../databases/identifiers/languageId";
import { FontFamily } from "../loaders/fontLoader";
import { FontGradientColor, Colors } from "./colors";

export class TextStyle {
	static getTextStyle(
		language: LanguageId,
		additionalStyle?: Partial<PIXI.ITextStyle>,
		fontGradientColor?: FontGradientColor,
	): PIXI.TextStyle {
		let style: PIXI.TextStyle;

		switch (language) {
			case LanguageId.enUS: {
				style = new PIXI.TextStyle({
					align: "left",
					// fontWeight: "normal",
					// letterSpacing: -1,
					fontFamily: FontFamily.Rayman,
					...additionalStyle,
				});
				break;
			}
			case LanguageId.jaJP: {
				style = new PIXI.TextStyle({
					align: "left",
					fontWeight: "bold",
					fontFamily: FontFamily.SystemUI,
					...additionalStyle,
				});
				break;
			}
			case LanguageId.heIL: {
				style = new PIXI.TextStyle({
					fontWeight: "bold",
					align: "right",
					fontFamily: FontFamily.SystemUI,
					...additionalStyle,
				});
				break;
			}
		}

		if (fontGradientColor) {
			style.fill = Colors.menuTextFillMapping[fontGradientColor];
			style.fillGradientStops = [0.4, 0.6];

			style.dropShadowColor = Colors.menuTextDropShadowColorMapping[fontGradientColor];
			style.dropShadow = true;
			style.dropShadowAngle = 0;
			style.dropShadowBlur = 3;
			style.dropShadowDistance = 0;

			style.strokeThickness = 4;
			style.stroke = Colors.menuTextStrokeMapping[fontGradientColor];
		}

		return style;
	}
}
