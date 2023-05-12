import { Config } from "../../config/config";
import { CursorId } from "../../databases/identifiers/cursorId";
import { MouseEvents } from "../../events/mouseEvents";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { FontGradientColor } from "../styles/colors";
import { TextValue } from "../text/textValue";
import { MenuText } from "./menuText";

interface MenuButtonOptions extends GraphicElementOptions {
	textValue: TextValue;
	clickCallback: () => void;
	fontSize: number;
	isSelectable: boolean;
	frameWidth?: number;
	backgroundColor?: number;
	backgroundOpacity?: number;
	textColor?: number;
	isSelected?: boolean;
}

const defaultOptions: Partial<MenuButtonOptions> = {
	frameWidth: 4,
	backgroundColor: 0x4d004d,
	backgroundOpacity: 0.95,
	textColor: 0xffffff,
	isSelected: false,
	cursorId: CursorId.Clickable,
};

export class MenuButton extends GraphicElement<MenuButtonOptions> {
	private _menuText: MenuText;

	constructor(options: MenuButtonOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	updateIsSelected(isSelected: boolean) {
		this.options.isSelected = isSelected;
		const color = this.getTextColor();
		this._menuText.updateColor(color);
	}

	protected init() {
		MouseEvents.registerPointerUpEvent(this._container, () => {
			this.options.clickCallback();
		});

		this._menuText = new MenuText({
			parentContainer: this._container,
			color: this.getTextColor(),
			textValue: this.options.textValue,
			fontSize: this.options.fontSize,
			dimensions: {
				...this.options.dimensions,
				x: 0,
				y: 0,
			},
			language: Config.options.language,
			cursorId: this.options.cursorId,
		});
	}

	private getTextColor(): FontGradientColor {
		return !this.options.isSelectable
			? FontGradientColor.Yellow
			: this.options.isSelected
			? FontGradientColor.Red
			: FontGradientColor.Green;
	}
}
