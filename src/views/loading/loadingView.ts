import * as PIXI from "pixi.js";
import { Device } from "../../device/device";
import { LoadingImage } from "./loadingImage";
import { TexturesLoader } from "../loaders/texturesLoader";
import { loadingImageDatabase } from "../../databases/loadingImage";
import { LoadingImageId } from "../../databases/identifiers/loadingImageId";
import { Filters } from "../filters/filters";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { convertTextToTextValue, TextValue } from "../text/textValue";
import { Text } from "../text/text";
import { Config } from "../../config/config";
import { FilterId } from "../../databases/identifiers/filterId";
import { Coordinates } from "../graphicElement/dimensions";
import { TextStyle } from "../styles/textStyle";
import { FontGradientColor } from "../styles/colors";
import { Anchor } from "../graphicElement/anchor";
import { LanguageId } from "../../databases/identifiers/languageId";

interface LoadingViewOptions extends GraphicElementOptions {
	loadingText?: TextValue;
	loadingImage?: LoadingImageId;
}

const defaultOptions: Partial<LoadingViewOptions> = {
	dimensions: Device.screenDimensions,
	loadingText: convertTextToTextValue("LOADING..."),
	loadingImage: LoadingImageId.Caves,
};

export class LoadingView extends GraphicElement<LoadingViewOptions> {
	constructor(options: LoadingViewOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	async init() {
		await this.loadAssets();

		const loadingImageHeight = this.options.dimensions.height * 0.7;
		const loadingImagePaddingTopBottom = this.options.dimensions.height * 0.05;

		const loadingImage = new LoadingImage({
			parentContainer: this._container,
			coordinates: {
				x: this.options.dimensions.width / 2,
				y: loadingImagePaddingTopBottom,
			},
			height: loadingImageHeight,
			anchor: {
				x: 0.5,
			},
		});
		loadingImage.set(this.options.loadingImage);

		const loadingTotalHeight = loadingImageHeight + loadingImagePaddingTopBottom * 2;
		const titleText = this.getChapterTitle(
			loadingTotalHeight,
			this.options.dimensions.height - loadingTotalHeight,
		);

		const { filter, animation } = this.getShockwaveAnimation(
			loadingImage,
			titleText.metrics.width,
			loadingImageHeight,
		);
		super.setFilter(filter, animation, true);
	}

	async remove() {
		await this.fadeOut({ timeoutBefore: 1000 });
		super.remove();
	}

	protected async loadAssets() {
		const loadingImageUrl = loadingImageDatabase[this.options.loadingImage].imageUrl;
		await TexturesLoader.load([loadingImageUrl]);
	}

	private getChapterTitle(y: number, height: number) {
		const style: Partial<PIXI.ITextStyle> = {
			fontSize: height * 0.7,
			fontWeight: "bold",
			fontFamily: "Rayman",
			breakWords: true,
		};
		const coordinates: Coordinates = {
			x: this.options.dimensions.width / 2,
			y,
		};
		const anchor: Anchor = {
			x: 0.5,
			y: 0,
		};
		return new Text({
			parentContainer: this._container,
			coordinates,
			style,
			textValue: this.options.loadingText,
			anchor,
			color: FontGradientColor.Blue,
			stickToLanguageStyle: LanguageId.enUS,
		});
	}

	private getShockwaveAnimation(
		loadingImage: LoadingImage,
		titleTextWidth: number,
		loadingImageHeight: number,
	) {
		const center: Coordinates = {
			x: Math.max(loadingImage.width, titleTextWidth) / 2,
			y: loadingImageHeight / 2,
		};
		return Filters.generate({
			filterId: FilterId.Shockwave,
			center,
		});
	}
}
