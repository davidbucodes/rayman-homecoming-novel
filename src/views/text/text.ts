import * as PIXI from "pixi.js";
import { Coordinates } from "../graphicElement/dimensions";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { Anchor } from "../graphicElement/anchor";
import { HTMLText } from "./htmlText";
import { ConfigEvent, ConfigEvents } from "../../events/configEvents";
import { Config } from "../../config/config";
import { emptyTextValue, TextValue } from "./textValue";
import { TextUtils } from "./textUtils";
import { LanguageId } from "../../databases/identifiers/languageId";
import { TextStyle } from "../styles/textStyle";
import { FontGradientColor } from "../styles/colors";

interface TextOptions extends Omit<GraphicElementOptions, "dimensions"> {
	coordinates: Coordinates;
	style?: Partial<PIXI.ITextStyle>;
	textValue?: TextValue;
	anchor?: Anchor;
	isVisible?: boolean;
	color?: FontGradientColor;
	stickToLanguageStyle?: LanguageId;
	forcePixiText?: boolean;
}

const defaultOptions: Partial<TextOptions> = {
	textValue: emptyTextValue,
	isVisible: true,
	style: {},
};

export class Text extends GraphicElement<TextOptions> {
	private static _instances: Text[] = [];
	private _textObject: PIXI.Text | HTMLText;
	private _currLanguage: LanguageId;

	static {
		ConfigEvents.registerCallback(ConfigEvent.ConfigUpdated, async ({ previousConfig }) => {
			if (previousConfig.language !== Config.options.language) {
				for (const instance of this._instances) {
					instance.updateText();
				}
			}
		});
	}

	constructor(options: TextOptions) {
		super(Object.assign({}, defaultOptions, options));
		Text._instances.push(this);
		this.init();
	}

	get metrics(): Readonly<PIXI.TextMetrics> {
		return PIXI.TextMetrics.measureText(
			this.options.textValue[Config.options.language],
			this._style,
		);
	}

	updateStyle(style: Partial<PIXI.ITextStyle>) {
		this.options.style = style;
		this.updateText();
	}

	updateTextValue(textValue: TextValue = emptyTextValue) {
		this.options.textValue = textValue;
		this.updateText();
	}

	updateCoordinations(coordinates: Coordinates) {
		this.options.coordinates = coordinates;
		this._container.x = coordinates.x;
		this._container.y = coordinates.y;
	}

	updateVisibility(isVisible: boolean) {
		this.options.isVisible = isVisible;
		this._textObject.visible = isVisible;
	}

	async init() {
		this._currLanguage = Config.options.language;
		this.initTextObject();

		if (this.options.coordinates?.x) {
			this._container.x = this.options.coordinates.x;
		}

		if (this.options.coordinates?.y) {
			this._container.y = this.options.coordinates.y;
		}
	}

	private initTextObject() {
		const text = this.options.textValue[Config.options.language];
		const formattedText = TextUtils.formatTextForDisplay(text, Config.options.language);

		if (
			!this.options.forcePixiText &&
			this.options.stickToLanguageStyle !== LanguageId.enUS &&
			Config.options.language !== LanguageId.enUS
		) {
			this._textObject = new HTMLText(formattedText, this._style);
		} else {
			this._textObject = new PIXI.Text(formattedText, this._style);
		}

		if (this.options.anchor) {
			this._textObject.anchor.set(this.options.anchor.x || 0, this.options.anchor.y || 0);
		}

		this._textObject.visible = this.options.isVisible;

		this._container.addChild(this._textObject);
	}

	private get _style() {
		return TextStyle.getTextStyle(
			this.options.stickToLanguageStyle
				? this.options.stickToLanguageStyle
				: Config.options.language,
			this.options.style,
			this.options.color,
		);
	}

	private updateText() {
		if (this._currLanguage !== Config.options.language) {
			this._currLanguage = Config.options.language;
			this._textObject.destroy();
			this.initTextObject();
		} else {
			const text = this.options.textValue[Config.options.language];
			const formattedText = TextUtils.formatTextForDisplay(text, Config.options.language);

			this._textObject.text = formattedText;
		}
	}
}
