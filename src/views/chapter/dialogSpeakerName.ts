import * as PIXI from "pixi.js";
import { ChapterNodeTypes } from "../../databases/chapter/chapterNodeTypes";
import { LanguageId } from "../../databases/identifiers/languageId";
import { speakersDatabase } from "../../databases/speaker";
import { Device } from "../../device/device";
import { Dimensions, Coordinates } from "../graphicElement/dimensions";
import { TextStyle } from "../styles/textStyle";
import { Anchor } from "../graphicElement/anchor";
import { Text } from "../text/text";
import { Config } from "../../config/config";
import { GraphicElementOptions, GraphicElement } from "../graphicElement/graphicElement";
interface DialogSpeakerNameOptions extends GraphicElementOptions {
	frameHeight: number;
	frameLineWidth: number;
	textColor: number;
	fontSize?: number;
}

const defaultOptions: Partial<DialogSpeakerNameOptions> = {
	fontSize: Device.getScreenRelativeWidth(0.02),
};

export class DialogSpeakerName extends GraphicElement<DialogSpeakerNameOptions> {
	private _text: Text;
	private _textFrame: PIXI.Graphics;
	private _frameWidth: number;

	constructor(options: DialogSpeakerNameOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	update(dialog: ChapterNodeTypes.Dialog, side: "right" | "left") {
		this._text.updateVisibility(!!dialog.speaker);
		this._textFrame.visible = !!dialog.speaker;
		this._text.updateTextValue(speakersDatabase[dialog.speaker].name);
		this._text.updateStyle(this.getTextStyle());
		this.updateDimensions(side);
	}

	protected init() {
		this._frameWidth = this.options.dimensions.width * 0.25;

		this.updateDimensions();

		this._text = this.getTextObject(this._container);
		this._text.updateVisibility(false);

		this._textFrame = this.createTextFrame();
		this._textFrame.visible = false;
		this._container.addChild(this._textFrame);
	}

	private updateDimensions(side: "right" | "left" = "left") {
		const coordinates = this.getTextOptionDimensions(side);
		this._container.x = coordinates.x;
		this._container.y = coordinates.y;
	}

	private getTextOptionDimensions(side: "right" | "left"): Coordinates {
		let coordinates: Coordinates;

		const y = this.options.dimensions.y - this.options.frameLineWidth * 2;

		if (side === "right") {
			coordinates = {
				x:
					this.options.dimensions.x +
					this.options.dimensions.width -
					this._frameWidth +
					this.options.frameLineWidth * 2,
				y,
			};
		} else if (side === "left") {
			coordinates = {
				x: this.options.dimensions.x - this.options.frameLineWidth * 2,
				y,
			};
		}

		return coordinates;
	}

	private createTextFrame(): PIXI.Graphics {
		const frame = new PIXI.Graphics();
		frame.lineStyle({
			color: 0xffffff,
			width: this.options.frameLineWidth,
			alignment: 0,
		});

		frame.drawRoundedRect(0, 0, this._frameWidth, this.options.frameHeight, 10);
		return frame;
	}

	private getTextObject(parentContainer: PIXI.Container): Text {
		const style = this.getTextStyle();
		const coordinates: Coordinates = {
			x: this._frameWidth / 2,
			y: this.options.frameHeight / 2,
		};
		const anchor: Anchor = {
			x: 0.5,
			y: 0.4,
		};

		const textObject = new Text({
			parentContainer,
			coordinates,
			anchor,
			style,
		});

		return textObject;
	}

	private getTextStyle(): Partial<PIXI.ITextStyle> {
		return {
			fontSize: this.options.fontSize,
			fill: this.options.textColor,
			align: "center",
			fontWeight: "bold",
			wordWrap: true,
			wordWrapWidth: this.options.dimensions.width * 2,
		};
	}
}
