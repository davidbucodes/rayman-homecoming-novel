import * as PIXI from "pixi.js";
import { Config } from "../../config/config";
import { LanguageId } from "../../databases/identifiers/languageId";
import { Device } from "../../device/device";
import { KeyboardKeyId } from "../../events/keyboardEvents";
import { Coordinates, Dimensions } from "../graphicElement/dimensions";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { TextStyle } from "../styles/textStyle";
import { Text } from "../text/text";
import { convertTextToTextValue } from "../text/textValue";

interface KeyboardKeyOptions extends GraphicElementOptions {
	key: keyof typeof KeyboardKeyId;
	frameWidth?: number;
	backgroundColor?: number;
	backgroundOpacity?: number;
	textColor?: number;
	fontSize?: number;
	bottomRightCoordinates?: Coordinates;
}

const defaultOptions: Partial<KeyboardKeyOptions> = {
	frameWidth: 8,
	backgroundColor: 0xcfcfcf,
	backgroundOpacity: 0.95,
	textColor: 0x1e1e1e,
	fontSize: Device.getScreenRelativeWidth(0.014),
};

export class KeyboardKey extends GraphicElement<KeyboardKeyOptions> {
	private _textObject: Text;
	private _textFrame: PIXI.Graphics;
	private _textFrameDimensions: Dimensions;

	constructor(options: KeyboardKeyOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	get dimensions(): Dimensions {
		return this._textFrameDimensions;
	}

	protected init() {
		this._textObject = this.getTextObject();
		const textPadding = this._textObject.metrics.height * 0.7;
		this._textObject.updateCoordinations({
			x: textPadding,
			y: textPadding,
		});

		const { frame, frameDimensions } = this.createTextFrame(
			this._textObject.metrics,
			textPadding,
		);
		this._textFrame = frame;
		this._textFrameDimensions = frameDimensions;
		this._container.addChild(this._textFrame);

		this._container.sortableChildren = true;
		this._textFrame.zIndex = -1;

		this.updateContainerDimensions();
	}

	private updateContainerDimensions() {
		if (this.options.bottomRightCoordinates?.x) {
			this._container.x = this.options.bottomRightCoordinates.x - this.dimensions.width;
		}
		if (this.options.bottomRightCoordinates?.y) {
			this._container.y = this.options.bottomRightCoordinates.y - this.dimensions.height;
		}
	}

	private getTextObject(): Text {
		const style = this.getTextStyle(this.options.fontSize, this.options.textColor);
		const coordinates: Coordinates = {
			y: 0,
			x: 0,
		};
		const textObject = new Text({
			parentContainer: this._container,
			style,
			coordinates,
			textValue: convertTextToTextValue(this.options.key),
			stickToLanguageStyle: LanguageId.enUS,
		});
		return textObject;
	}

	private getTextStyle(fontSize: number, fill?: number): Partial<PIXI.ITextStyle> {
		return {
			fontSize,
			fill,
			wordWrap: true,
			breakWords: true,
			fontWeight: "bold",
			align: "center",
			textBaseline: "alphabetic",
		};
	}

	private createTextFrame(textMetrics: PIXI.TextMetrics, textPadding: number) {
		const frame = new PIXI.Graphics();

		const frameDimensions: Dimensions = {
			x: 0,
			y: 0,
			height: textMetrics.height + textPadding * 2,
			width: textMetrics.width + textPadding * 2,
		};

		frame.lineStyle({
			color: 0xffffff,
			width: this.options.frameWidth,
			alignment: 0,
		});
		frame.drawRoundedRect(
			frameDimensions.x,
			frameDimensions.y,
			frameDimensions.width,
			frameDimensions.height,
			30,
		);

		frame.beginFill(this.options.backgroundColor);
		frame.alpha = this.options.backgroundOpacity;
		frame.drawRoundedRect(
			frameDimensions.x,
			frameDimensions.y,
			frameDimensions.width,
			frameDimensions.height,
			30,
		);
		frame.endFill();
		return { frame, frameDimensions };
	}
}
