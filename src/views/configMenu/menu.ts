import { Config } from "../../config/config";
import * as PIXI from "pixi.js";
import { Dimensions } from "../graphicElement/dimensions";
import { MenuButton } from "./menuButton";
import {
	menuSettingsConfig,
	SettingsButtonConfig,
	SettingsGroupConfig,
} from "../../config/menuSettingsConfig";
import { MenuText } from "./menuText";
import { GameEvent, GameEvents } from "../../events/gameEvents";
import { LanguageId } from "../../databases/identifiers/languageId";
import { FontGradientColor } from "../styles/colors";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { ConfigEvent, ConfigEvents } from "../../events/configEvents";
import { convertTextToTextValue } from "../text/textValue";

interface MenuOptions extends GraphicElementOptions {}

const defaultOptions: Partial<MenuOptions> = {};

export class Menu extends GraphicElement<MenuOptions> {
	private _paddedMenuContainer: PIXI.Container = null;
	private _paddedMenuContainerDimensions: Dimensions = null;
	private _menuLineHeight: number;
	private _buttonLeftPadding: number;
	private _textFontSize: number;

	constructor(options: MenuOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		const menuContainerPaddingTopBottom = this.options.dimensions.height * 0.07;
		const menuContainerPaddingRightLeft = this.options.dimensions.width * 0.07;
		this._textFontSize = this.options.dimensions.height * 0.075;

		this._paddedMenuContainerDimensions = {
			x: menuContainerPaddingRightLeft,
			y: menuContainerPaddingTopBottom,
			width: this.options.dimensions.width - menuContainerPaddingRightLeft * 2,
			height: this.options.dimensions.height - menuContainerPaddingTopBottom * 2,
		};

		this._paddedMenuContainer = new PIXI.Container();
		this._paddedMenuContainer.x = this._paddedMenuContainerDimensions.x;
		this._paddedMenuContainer.y = this._paddedMenuContainerDimensions.y;
		this._paddedMenuContainer.width = this._paddedMenuContainerDimensions.width;
		this._paddedMenuContainer.height = this._paddedMenuContainerDimensions.height;

		this._container.addChild(this._paddedMenuContainer);

		const titleReservedLines = 1;
		this._menuLineHeight =
			this._paddedMenuContainerDimensions.height /
			(titleReservedLines + menuSettingsConfig.length);
		this._buttonLeftPadding = 0.25 * this._menuLineHeight;

		this.createMenuTitle();

		menuSettingsConfig.forEach((settingsGroups, index) => {
			if (settingsGroups.type === "group") {
				this.createButtonsGroup(settingsGroups, index + titleReservedLines);
			} else if (settingsGroups.type === "button") {
				this.createButton(settingsGroups, index + titleReservedLines);
			}
		});
	}

	private createButton(settingsGroups: SettingsButtonConfig, lineIndex: number) {
		const currLineY = this._menuLineHeight * lineIndex;

		const buttonWidth = this._paddedMenuContainerDimensions.width;

		const button = new MenuButton({
			fontSize: this._textFontSize,
			parentContainer: this._paddedMenuContainer,
			dimensions: {
				x: 0,
				y: currLineY,
				height: this._menuLineHeight,
				width: buttonWidth,
			},
			textValue: settingsGroups.label,
			clickCallback: () => {
				settingsGroups.onClick();
			},
			isSelectable: false,
		});

		return button;
	}

	private createButtonsGroup<T>(settingsGroups: SettingsGroupConfig<T>, lineIndex: number) {
		const currLineY = this._menuLineHeight * lineIndex;

		const cellsReservedForLabel = 1;
		const cellsNumber = settingsGroups.options.length + cellsReservedForLabel;
		const cellWidth = this._paddedMenuContainerDimensions.width / cellsNumber;

		const buttonWidth = cellWidth - this._buttonLeftPadding;

		const labelDimensions: Dimensions = {
			width: cellWidth,
			x: 0,
			y: currLineY,
			height: this._menuLineHeight,
		};
		const textObject = new MenuText({
			color: FontGradientColor.Green,
			fontSize: this._textFontSize,
			language: Config.options.language,
			parentContainer: this._paddedMenuContainer,
			textValue: settingsGroups.label,
			dimensions: labelDimensions,
		});

		const buttons = settingsGroups.options.map((option, index) => {
			const buttonIndex: number = index + cellsReservedForLabel;
			return new MenuButton({
				fontSize: this._textFontSize,
				parentContainer: this._paddedMenuContainer,
				dimensions: {
					x: cellWidth * buttonIndex + this._buttonLeftPadding,
					y: currLineY,
					height: this._menuLineHeight,
					width: buttonWidth,
				},
				textValue: option.text,
				clickCallback: () => {
					settingsGroups.onClick(option.value);
				},
				isSelectable: true,
				isSelected: settingsGroups.isSelected(option.value),
			});
		});

		ConfigEvents.registerCallback(ConfigEvent.ConfigUpdated, async () => {
			buttons.forEach((button, index) => {
				button.updateIsSelected(
					settingsGroups.isSelected(settingsGroups.options[index].value),
				);
			});
		});
	}

	private createMenuTitle() {
		const fontSize = this._menuLineHeight;
		const textValue = convertTextToTextValue("OPTIONS");
		const dimensions: Dimensions = {
			x: 0,
			y: 0,
			width: this._paddedMenuContainerDimensions.width,
			height: this._menuLineHeight,
		};
		new MenuText({
			color: FontGradientColor.Red,
			fontSize,
			language: LanguageId.enUS,
			parentContainer: this._paddedMenuContainer,
			textValue,
			dimensions,
		});
	}
}
