import * as PIXI from "pixi.js";
import { Config } from "../../config/config";
import { Device } from "../../device/device";
import { MouseEvents } from "../../events/mouseEvents";
import { Coordinates, Size } from "../graphicElement/dimensions";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { TextStyle } from "../styles/textStyle";
import { Text } from "../text/text";
import { TextValue } from "../text/textValue";

interface ButtonOptions extends GraphicElementOptions {
	backgroundColor?: number;
	backgroundOpacity?: number;
	clickCallback: () => void;
	frameColor?: number;
	frameWidth?: number;
	parentContainer: PIXI.Container;
	textValue: TextValue;
	textColor?: number;
	textCoordinates: Coordinates;
	textSize?: Size;
}

const defaultOptions: Partial<ButtonOptions> = {
	backgroundColor: 0x4d004d,
	backgroundOpacity: 0.95,
	frameColor: 0xffffff,
	frameWidth: 4,
	textColor: 0xffffff,
	textSize: {
		height: 35,
		width: 130,
	},
};

export class Button extends GraphicElement<ButtonOptions> {
	private text: Text = null;

	constructor(options: ButtonOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		MouseEvents.registerPointerUpEvent(this._container, () => {
			this.options.clickCallback();
		});

		const textFrame = this.createTextFrame();
		this._container.addChild(textFrame);

		this.text = this.getText(this.options.textValue, 2, Device.getScreenRelativeWidth(0.014));
	}

	update(textValue: TextValue) {
		this.text.updateTextValue(textValue);
	}

	private getText(textValue: TextValue, padding: number, fontSize: number): Text {
		const wordWrapWidth = this.options.textSize.width - padding * 2;
		const style: Partial<PIXI.ITextStyle> = {
			fontSize,
			fill: this.options.textColor,
			wordWrap: true,
			breakWords: true,
			fontWeight: "bold",
			wordWrapWidth,
			align: "center",
			textBaseline: "alphabetic",
		};
		const coordinates: Coordinates = {
			x: this.options.textCoordinates.x + padding + this.options.textSize.width / 2,
			y: this.options.textCoordinates.y + this.options.textSize.height / 2,
		};
		const anchor: Coordinates = {
			x: 0.5,
			y: 0.5,
		};

		return new Text({
			parentContainer: this._container,
			coordinates,
			anchor,
			style,
			textValue,
			cursorId: this.options.cursorId,
		});
	}

	private createTextFrame(): PIXI.Graphics {
		const frame = new PIXI.Graphics();
		frame.beginFill(this.options.backgroundColor);
		frame.alpha = this.options.backgroundOpacity;
		frame.drawRoundedRect(
			this.options.textCoordinates.x,
			this.options.textCoordinates.y,
			this.options.textSize.width,
			this.options.textSize.height,
			5,
		);
		frame.endFill();
		frame.lineStyle({
			color: this.options.frameColor,
			width: this.options.frameWidth,
			alignment: 0,
		});
		frame.drawRoundedRect(
			this.options.textCoordinates.x,
			this.options.textCoordinates.y,
			this.options.textSize.width,
			this.options.textSize.height,
			10,
		);
		return frame;
	}
}
