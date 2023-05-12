import * as PIXI from "pixi.js";
import { MapDirection } from "../../databases/worldMap";
import { Device } from "../../device/device";
import { KeyboardKeyId } from "../../events/keyboardEvents";
import { Coordinates, Size } from "../graphicElement/dimensions";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { KeyboardKey } from "../keyboardKey/keyboardKey";
import { Anchor } from "../graphicElement/anchor";
import { Text } from "../text/text";
import { TextStyle } from "../styles/textStyle";
import { Config } from "../../config/config";
import { convertTextToTextValue } from "../text/textValue";
import { LanguageId } from "../../databases/identifiers/languageId";

interface NextDirectionsOptions extends GraphicElementOptions {
	frameWidth?: number;
	backgroundColor?: number;
	backgroundOpacity?: number;
	textColor?: number;
	fontSize?: number;
	startKey?: keyof typeof KeyboardKeyId;
}

const defaultOptions: Partial<NextDirectionsOptions> = {
	frameWidth: 8,
	backgroundColor: 0x4d004d,
	backgroundOpacity: 0.65,
	textColor: 0xffffff,
	fontSize: Device.getScreenRelativeWidth(0.014),
};

export class NextDirections extends GraphicElement<NextDirectionsOptions> {
	private _panels: Array<PIXI.Container>;
	private _panelsContainer: PIXI.Container;
	private _text: Text;

	constructor(options: NextDirectionsOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		this._panels = [];
	}

	update(nextDirections: Record<MapDirection, string>) {
		this._panelsContainer?.destroy();
		this._panelsContainer = new PIXI.Container();

		let currentX = 0;
		let currentY = 0;

		for (const direction in nextDirections) {
			const text = nextDirections[direction as MapDirection];

			const key: keyof typeof KeyboardKeyId = this.getKeyFromDirection(direction);

			const { directionPanel, frameSize } = this.getKeyboardKeyPanel(
				this._panelsContainer,
				key,
				text,
				currentX,
			);
			this._panels.push(directionPanel);

			const panelLeftPadding = frameSize.height * 0.3;
			currentX += frameSize.width + panelLeftPadding;
			currentY = Math.max(frameSize.height, currentY);
		}

		if (this.options.startKey) {
			const { directionPanel, frameSize } = this.getKeyboardKeyPanel(
				this._panelsContainer,
				this.options.startKey,
				"Start",
				currentX,
			);
			this._panels.push(directionPanel);

			const panelLeftPadding = frameSize.height * 0.3;
			currentX += frameSize.width + panelLeftPadding;
			currentY = Math.max(frameSize.height, currentY);
		}

		this._panelsContainer.x = (this.options.dimensions.width - currentX) / 2;
		this._panelsContainer.y = (this.options.dimensions.height - currentY) / 2;

		this._container.addChild(this._panelsContainer);
	}

	private getKeyFromDirection(direction: string) {
		let key: keyof typeof KeyboardKeyId;
		switch (direction as MapDirection) {
			case "up": {
				key = "Up";
				break;
			}
			case "down": {
				key = "Down";
				break;
			}
			case "right": {
				key = "Right";
				break;
			}
			case "left": {
				key = "Left";
				break;
			}
		}
		return key;
	}

	private getKeyboardKeyPanel(
		container: PIXI.Container,
		key: keyof typeof KeyboardKeyId,
		text: string,
		currentX: number,
	) {
		const directionPanel = new PIXI.Container();
		directionPanel.x = currentX;

		const keyboardKey = this.getKeyboardKeyFromDirection(directionPanel, key);

		const textLeftPadding = keyboardKey.dimensions.height * 0.3;
		const coordinates: Coordinates = {
			x: keyboardKey.dimensions.width + textLeftPadding,
			y: keyboardKey.dimensions.height / 2,
		};
		this.addTextObject(directionPanel, coordinates, text);

		const frameRightPadding = keyboardKey.dimensions.height * 0.3;
		const width =
			keyboardKey.dimensions.width +
			textLeftPadding +
			this._text.metrics.width +
			frameRightPadding;
		const height = keyboardKey.dimensions.height;
		const frameSize = { width, height };
		const frame = this.getPanelFrame(frameSize);

		directionPanel.sortableChildren = true;
		frame.zIndex = -1;
		directionPanel.addChild(frame);

		container.addChild(directionPanel);

		return { directionPanel, frameSize };
	}

	private getPanelFrame(size: Size) {
		const frame = new PIXI.Graphics();

		frame.beginFill(this.options.backgroundColor);
		frame.alpha = this.options.backgroundOpacity;
		frame.drawRoundedRect(0, 0, size.width, size.height, 30);
		frame.endFill();
		return frame;
	}

	private addTextObject(parentContainer: PIXI.Container, coordinates: Coordinates, text: string) {
		const style = this.getTextStyle(this.options.fontSize, this.options.textColor);
		const anchor: Anchor = {
			x: 0,
			y: 0.5,
		};

		this._text = new Text({
			parentContainer,
			textValue: convertTextToTextValue(text),
			style,
			anchor,
			coordinates,
			stickToLanguageStyle: LanguageId.enUS,
		});
	}

	private getTextStyle(fontSize: number, fill?: number): Partial<PIXI.ITextStyle> {
		return {
			fontSize,
			fill,
			wordWrap: true,
			breakWords: true,
			fontWeight: "bold",
			wordWrapWidth: Infinity,
		};
	}

	private getKeyboardKeyFromDirection(
		parentContainer: PIXI.Container,
		key: keyof typeof KeyboardKeyId,
	) {
		const keyboardKey = new KeyboardKey({
			parentContainer,
			key,
		});

		return keyboardKey;
	}
}
