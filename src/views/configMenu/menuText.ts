import * as PIXI from "pixi.js";
import { ITextStyle } from "pixi.js";
import { LanguageId } from "../../databases/identifiers/languageId";
import { Coordinates } from "../graphicElement/dimensions";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { TextStyle } from "../styles/textStyle";
import { FontGradientColor } from "../styles/colors";
import { Anchor } from "../graphicElement/anchor";
import { Text } from "../text/text";
import { TextValue } from "../text/textValue";

interface MenuTextOptions extends GraphicElementOptions {
	textValue: TextValue;
	fontSize: number;
	color: FontGradientColor;
	language: LanguageId;
}

const defaultOptions: Partial<MenuTextOptions> = {};

export class MenuText extends GraphicElement<MenuTextOptions> {
	private _textObject: Text;

	constructor(options: MenuTextOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		this._textObject = this.getTextObject();
	}

	updateColor(color: FontGradientColor) {
		this.options.color = color;
		this._textObject.remove();
		this.init();
	}

	private getTextObject(): Text {
		const style = this.getTextStyle();
		const coordinates: Coordinates = {
			x: this.options.dimensions.width / 2,
			y: this.options.dimensions.height / 2,
		};
		const anchor: Anchor = {
			x: 0.5,
			y: 0.5,
		};
		const textObject = new Text({
			parentContainer: this._container,
			style,
			coordinates,
			anchor,
			textValue: this.options.textValue,
			cursorId: this.options.cursorId,
			color: this.options.color,
			forcePixiText: true
		});
		return textObject;
	}

	private getTextStyle(): Partial<ITextStyle> {
		const textMaxWidth = this.options.dimensions.width * 1.5;
		const textStyle: Partial<ITextStyle> = {
			fontSize: this.options.fontSize,
			wordWrap: true,
			breakWords: true,
			lineJoin: "round",
			trim: true,
			whiteSpace: "normal",
			align: "center",
			wordWrapWidth: textMaxWidth,
		};
		return textStyle;
	}
}
