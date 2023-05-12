import * as PIXI from "pixi.js";
import { LanguageId } from "../../databases/identifiers/languageId";
import { Device } from "../../device/device";
import { Coordinates } from "../graphicElement/dimensions";
import { GraphicElementOptions, GraphicElement } from "../graphicElement/graphicElement";
import { KeyboardKey } from "../keyboardKey/keyboardKey";
import { TextUtils } from "../text/textUtils";
import { TextStyle } from "../styles/textStyle";
import { Text } from "../text/text";
import { Config } from "../../config/config";
import { ConfigEvent, ConfigEvents } from "../../events/configEvents";
import { TextValue } from "../text/textValue";

interface DialogTextOptions extends GraphicElementOptions {
	speakerNameTextY?: number;
	frameWidth?: number;
	backgroundColor?: number;
	backgroundOpacity?: number;
	textColor?: number;
	fontSize?: number;
	paddingTop?: number;
	paddingLeftRight?: number;
}

const defaultOptions: Partial<DialogTextOptions> = {
	fontSize: Device.getScreenRelativeWidth(0.03),
};

export class DialogText extends GraphicElement<DialogTextOptions> {
	private _text: Text = null;
	private _currLanguage: LanguageId;

	constructor(options: DialogTextOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		const textFrame = this.createTextFrame();
		this._container.addChild(textFrame);

		this.addBottomLineBadges();
	}

	clear() {
		this._text.updateTextValue();
		this._text.remove();
		this._text = null;
	}

	update(textValue: TextValue, language: LanguageId) {
		if (!this._text || language !== this._currLanguage) {
			this._currLanguage = language;
			if (this._text) {
				this.clear();
			}

			const wordWrapWidth = this.options.dimensions.width - this.options.paddingLeftRight * 2;
			const languageTextStyle: Partial<PIXI.ITextStyle> = {
				fill: this.options.textColor,
				wordWrap: true,
				breakWords: true,
				fontSize: this.options.fontSize,
				wordWrapWidth,
			};

			this._text = this.getTextObject(this._container, languageTextStyle);
			this._text.updateCoordinations(this.getTextCoordinates());
		}

		this._text.updateTextValue(textValue);
	}

	private getTextCoordinates(): Coordinates {
		return {
			x: this.options.paddingLeftRight,
			y: this.options.paddingTop,
		};
	}

	private addBottomLineBadges() {
		const continueKeyboardKeyPaddingBottomLeft = this.options.dimensions.width * 0.015;
		const bottomRightCoordinates: Coordinates = {
			x: this.options.dimensions.width - continueKeyboardKeyPaddingBottomLeft,
			y: this.options.dimensions.height - continueKeyboardKeyPaddingBottomLeft,
		};
		const key = new KeyboardKey({
			parentContainer: this._container,
			bottomRightCoordinates,
			key: "Space",
		});

		const autoplayOn = new Text({
			parentContainer: this._container,
			textValue: {
				"ja-JP": "Autoplay on",
				"en-US": "Autoplay on",
				"he-IL": "Autoplay on",
			},
			coordinates: {
				x: 0,
				y: 0,
			},
			anchor: {
				x: 0,
				y: 0.5,
			},
		});

		autoplayOn.updateCoordinations({
			x:
				bottomRightCoordinates.x -
				key.dimensions.width -
				autoplayOn.metrics.width -
				continueKeyboardKeyPaddingBottomLeft,
			y: bottomRightCoordinates.y - key.dimensions.height / 2,
		});

		autoplayOn.updateVisibility(Config.options.autoplayDialog);

		ConfigEvents.registerCallback(ConfigEvent.ConfigUpdated, async () => {
			autoplayOn.updateVisibility(Config.options.autoplayDialog);
		});
	}

	private getTextObject(parentContainer: PIXI.Container, style: Partial<PIXI.ITextStyle>): Text {
		const coordinates: Coordinates = this.getTextCoordinates();

		const textObject = new Text({
			parentContainer,
			coordinates,
			style,
		});

		return textObject;
	}

	private createTextFrame(): PIXI.Graphics {
		const frame = new PIXI.Graphics();
		frame.beginFill(this.options.backgroundColor);
		frame.alpha = this.options.backgroundOpacity;
		frame.drawRect(0, 0, this.options.dimensions.width, this.options.dimensions.height);
		frame.endFill();
		frame.lineStyle({
			color: 0xffffff,
			width: this.options.frameWidth,
			alignment: 0,
		});
		frame.drawRoundedRect(
			0 - this.options.frameWidth,
			0 - this.options.frameWidth,
			this.options.dimensions.width + this.options.frameWidth * 2,
			this.options.dimensions.height + this.options.frameWidth * 2,
			10,
		);
		return frame;
	}
}
