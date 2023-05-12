import * as PIXI from "pixi.js";
import { Device } from "../../device/device";
import { Dimensions, Size } from "../graphicElement/dimensions";
import { App } from "../app/app";
import { Music } from "../../sound/music";
import { MusicId } from "../../databases/identifiers/musicId";
import { Menu } from "./menu";
import { GameEvent, GameEvents } from "../../events/gameEvents";
import { Filters } from "../filters/filters";
import { FilterId } from "../../databases/identifiers/filterId";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";

interface MenuPopupOptions extends GraphicElementOptions {
	mainBackgroundMusic: Music;
}

const defaultOptions: Partial<MenuPopupOptions> = {
	dimensions: Device.screenDimensions,
};

export class MenuPopup extends GraphicElement<MenuPopupOptions> {
	private _isMenuVisible = false;
	private _menuBackgroundMusic: Music = null;
	private _blackAndWhiteFilter: PIXI.Filter;
	private _menuPopupContainerDimensions: Dimensions;
	private _menuPopupContainer: PIXI.Container;
	private _menuWindowContainerDimensions: Dimensions;
	private _menuWindowContainer: PIXI.Container;

	constructor(options: MenuPopupOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	async init() {
		this.createMenuPopupContainer();
		this.createMenuWindowContainer();

		new Menu({
			parentContainer: this._menuWindowContainer,
			dimensions: { ...this._menuWindowContainerDimensions, x: 0, y: 0 },
		});

		GameEvents.registerCallback(GameEvent.OpenMenuPopup, async () => {
			if (!this._isMenuVisible) {
				this.openMenu();
			}
		});

		GameEvents.registerCallback(GameEvent.MenuClosed, async () => {
			if (this._isMenuVisible) {
				this.closeMenu();
			}
		});
	}

	private createMenuPopupContainer() {
		const menuViewContainerDimentsions = Device.screenDimensions;

		const menuViewContainer = new PIXI.Container();
		menuViewContainer.x = menuViewContainerDimentsions.x;
		menuViewContainer.y = menuViewContainerDimentsions.y;
		menuViewContainer.width = menuViewContainerDimentsions.width;
		menuViewContainer.height = menuViewContainerDimentsions.height;
		menuViewContainer.visible = this._isMenuVisible;
		this._menuPopupContainer = menuViewContainer;
		this._menuPopupContainerDimensions = menuViewContainerDimentsions;

		this._container.addChild(menuViewContainer);
	}

	private createMenuWindowContainer() {
		const menuWindowContainerSize: Size = {
			width: this._menuPopupContainerDimensions.width * 0.7,
			height: this._menuPopupContainerDimensions.height * 0.8,
		};

		const menuWindowContainerDimensions: Dimensions = {
			...menuWindowContainerSize,
			x: this._menuPopupContainerDimensions.width / 2 - menuWindowContainerSize.width / 2,
			y: this._menuPopupContainerDimensions.height / 2 - menuWindowContainerSize.height / 2,
		};

		const menuWindowContainer = new PIXI.Container();
		menuWindowContainer.x = menuWindowContainerDimensions.x;
		menuWindowContainer.y = menuWindowContainerDimensions.y;
		menuWindowContainer.width = menuWindowContainerDimensions.width;
		menuWindowContainer.height = menuWindowContainerDimensions.height;

		this._menuWindowContainer = menuWindowContainer;
		this._menuWindowContainerDimensions = menuWindowContainerDimensions;

		const frame = new PIXI.Graphics();
		const frameWidth = 6;
		frame.blendMode = PIXI.BLEND_MODES.HARD_LIGHT;

		const lightLineStyle = {
			color: 0xc7c7c7,
			width: frameWidth,
			alignment: 0,
		};
		const darkLineStyle = {
			color: 0x777777,
			width: frameWidth,
			alignment: 0,
		};

		const startPoint = {
			x: 0 - frameWidth / 2,
			y: 0 - frameWidth / 2,
		};
		frame
			.moveTo(startPoint.x, startPoint.y)
			.lineStyle(lightLineStyle)
			.lineTo(this._menuWindowContainerDimensions.width + frameWidth / 2, startPoint.y)
			.lineStyle(darkLineStyle)
			.lineTo(
				this._menuWindowContainerDimensions.width + frameWidth / 2,
				this._menuWindowContainerDimensions.height + frameWidth / 2,
			)
			.lineTo(startPoint.x, this._menuWindowContainerDimensions.height + frameWidth / 2)
			.lineStyle(lightLineStyle)
			.lineTo(startPoint.x, startPoint.y);
		this._menuWindowContainer.addChild(frame);

		const background = new PIXI.Graphics();
		background.beginFill(0x000065, 0.9);
		const blendFilter = Filters.generate({ filterId: FilterId.Blend }).filter;
		background.filters = [blendFilter];
		background.drawRect(
			frameWidth / 2,
			frameWidth / 2,
			this._menuWindowContainerDimensions.width - frameWidth,
			this._menuWindowContainerDimensions.height - frameWidth,
		);
		background.endFill();
		this._menuWindowContainer.addChild(background);

		this._menuPopupContainer.addChild(menuWindowContainer);
	}

	private openMenu() {
		this._isMenuVisible = true;
		this.updateMusic();
		this.updateVisibility();
	}

	private closeMenu() {
		this._isMenuVisible = false;
		this.updateMusic();
		this.updateVisibility();
	}

	private updateVisibility() {
		this._menuPopupContainer.visible = this._isMenuVisible;

		this.setBlackAndWhiteFilter(this._isMenuVisible);
	}

	private updateMusic() {
		if (this._isMenuVisible) {
			this.options.mainBackgroundMusic.pause();
			this._menuBackgroundMusic = new Music();
			this._menuBackgroundMusic.start(MusicId.WorldMap);
		} else {
			this._menuBackgroundMusic.stop();
			this.options.mainBackgroundMusic.fadeIn();
		}
	}

	private setBlackAndWhiteFilter(isActive: boolean) {
		if (isActive && !this._blackAndWhiteFilter) {
			const { filter: blackAndWhiteFilter } = Filters.generate({
				filterId: FilterId.BlackAndWhite,
			});

			this._blackAndWhiteFilter = blackAndWhiteFilter;
		}

		if (!App.mainContainer.filters) {
			App.mainContainer.filters = [];
		} else {
			App.mainContainer.filters = App.mainContainer.filters?.filter(
				(filter) => filter !== this._blackAndWhiteFilter,
			);
		}

		if (isActive) {
			App.mainContainer.filters.push(this._blackAndWhiteFilter);
		}
	}
}
