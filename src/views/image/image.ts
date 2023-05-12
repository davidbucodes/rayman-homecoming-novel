import * as PIXI from "pixi.js";
import { TexturesLoader } from "../loaders/texturesLoader";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { Device } from "../../device/device";

type ImageOptions = GraphicElementOptions;

const defaultOptions: Partial<ImageOptions> = {
	dimensions: Device.screenDimensions,
};

export class Image extends GraphicElement<ImageOptions> {
	private _sprite: PIXI.Sprite = null;

	constructor(options: ImageOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		this._sprite = new PIXI.Sprite();

		this._sprite.width = this.options.dimensions.width;
		this._sprite.height = this.options.dimensions.height;

		this._container.addChild(this._sprite);
	}

	set(imageUrl: string) {
		const texture = TexturesLoader.get(imageUrl);
		if (!this._sprite) {
			this.init();
		}
		this._sprite.texture = texture;
	}

	remove() {
		super.remove();
		this._sprite.destroy();
	}
}
