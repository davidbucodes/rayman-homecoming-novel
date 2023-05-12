import * as PIXI from "pixi.js";
import { Device } from "../../device/device";

export class App {
	private static _app: PIXI.Application = null;
	private static _mainContainer: PIXI.Container = null;
	private static _popupContainer: PIXI.Container = null;

	static get mainContainer(): PIXI.Container {
		this.initApp();
		return this._mainContainer;
	}

	static get popupContainer(): PIXI.Container {
		this.initApp();
		return this._popupContainer;
	}

	static get ticker(): PIXI.Ticker {
		this.initApp();
		return this._app.ticker;
	}

	private static initApp() {
		if (!this._app) {
			this._app = this.getApp();
		}
		if (!this._mainContainer) {
			this._mainContainer = this.getFullScreenContainer();
			this._app.stage.addChild(this._mainContainer);
		}
		if (!this._popupContainer) {
			this._popupContainer = this.getFullScreenContainer();
			this._app.stage.addChild(this._popupContainer);
		}
	}

	private static getFullScreenContainer() {
		const container = new PIXI.Container();
		const screenDimensions = Device.screenDimensions;
		container.x = screenDimensions.x;
		container.y = screenDimensions.y;
		container.width = screenDimensions.width;
		container.height = screenDimensions.height;
		return container;
	}

	private static getApp(): PIXI.Application {
		const app = new PIXI.Application({
			resizeTo: window,
			antialias: true,
			autoDensity: true,
			resolution: 1,
			forceCanvas: true,
		});

		document.body.appendChild(app.view);

		return app;
	}
}
