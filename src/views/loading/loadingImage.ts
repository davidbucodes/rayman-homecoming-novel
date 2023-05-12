import * as PIXI from "pixi.js";
import { Coordinates } from "../graphicElement/dimensions";
import { loadingImageDatabase } from "../../databases/loadingImage";
import { LoadingImageId } from "../../databases/identifiers/loadingImageId";
import { TexturesLoader } from "../loaders/texturesLoader";
import { GraphicElement } from "../graphicElement/graphicElement";

interface LoadingImageOptions {
	parentContainer: PIXI.Container;
	coordinates?: Coordinates;
	height?: number;
	anchor?: Partial<Coordinates>;
}

const defaultOptions: Partial<LoadingImageOptions> = {
	coordinates: {
		x: 0,
		y: 0,
	},
};

export class LoadingImage extends GraphicElement<LoadingImageOptions> {
	private _sprite: PIXI.Sprite = null;

	constructor(options: LoadingImageOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		this._sprite = new PIXI.Sprite();

		this._sprite.x = this.options.coordinates.x;
		this._sprite.y = this.options.coordinates.y;
		this._sprite.height = this.options.height;

		if (this.options.anchor) {
			const { x, y } = this.options.anchor;
			this._sprite.anchor.set(x || 0, y || 0);
		}

		this._container.addChild(this._sprite);
	}

	get width(): number {
		const { texture } = this._sprite || {};
		if (texture) {
			const ratio = texture.height / texture.width;
			const width = Math.round(this.options.height / ratio);
			return width;
		}
		return 0;
	}

	set(loadingImageId: LoadingImageId) {
		const texture = TexturesLoader.get(loadingImageDatabase[loadingImageId].imageUrl);
		if (!this._sprite) {
			this.init();
		}
		const ratio = texture.height / texture.width;
		this._sprite.width = Math.round(this.options.height / ratio);
		this._sprite.texture = texture;
	}

	remove() {
		super.remove();
		this._sprite.destroy();
	}
}
