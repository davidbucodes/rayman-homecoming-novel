import * as PIXI from "pixi.js";
import { backgroundImageDatabase } from "../../databases/backgroundImage";
import { chapterDatabase } from "../../databases/chapter";
import { characterBadgeDatabase } from "../../databases/character";
import { BackgroundImageId } from "../../databases/identifiers/backgroundImageId";
import { ChapterId } from "../../databases/identifiers/chapterId";
import { MusicId } from "../../databases/identifiers/musicId";
import { Device } from "../../device/device";
import { GameEvents } from "../../events/gameEvents";
import { KeyboardEvents, KeyboardKeyId } from "../../events/keyboardEvents";
import { MouseEvents } from "../../events/mouseEvents";
import { Music } from "../../sound/music";
import { App } from "../app/app";
import { ChapterView } from "../chapter/chapterView";
import { Anchor } from "../graphicElement/anchor";
import { Coordinates } from "../graphicElement/dimensions";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { BackgroundImage } from "../image/backgroundImage";
import { TexturesLoader } from "../loaders/texturesLoader";
import { FontGradientColor } from "../styles/colors";
import { Text } from "../text/text";
import { NextDirections } from "./nextDirections";
import { WorldMap } from "./worldMap";

type ChapterSelectViewOptions = GraphicElementOptions;

const defaultOptions: Partial<ChapterSelectViewOptions> = {
	dimensions: Device.screenDimensions,
};

export class ChapterSelectView extends GraphicElement<ChapterSelectViewOptions> {
	private _backgroundMusic: Music;
	private _backgroundImageId: BackgroundImageId = BackgroundImageId.WorldMapPixelized;
	private _worldMap: WorldMap;
	private _nextDirections: NextDirections;
	private _worldMapPaddingTopBottom: number;
	private _titleText: Text;

	constructor(options: ChapterSelectViewOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected async init() {
		this._worldMapPaddingTopBottom = this.options.dimensions.height * 0.16;

		await this.loadAssets();
		await this.addBackgroundImage();
		this.addChapterTitle();

		this._backgroundMusic = new Music();
		this._backgroundMusic.start(MusicId.WorldMap);

		MouseEvents.registerPointerUpEvent(this._container, () => {
			Device.openFullscreen();
		});

		const worldMapHeight = this.options.dimensions.height - this._worldMapPaddingTopBottom * 2;
		this._worldMap = new WorldMap({
			dimensions: {
				...this.options.dimensions,
				x: 0,
				y: this._worldMapPaddingTopBottom,
				height: worldMapHeight,
			},
			parentContainer: this._container,
			onPointDoubleClicked: async (selectedPoint) => {
				this.startCurrChapter(selectedPoint.chapterId);
			},
			onPointSelected: (selectedPoint, nextPointsDirections) => {
				const selectedChapter = chapterDatabase[selectedPoint.chapterId];
				this._titleText.updateTextValue(selectedChapter.name);

				this._nextDirections?.update(nextPointsDirections);
			},
		});

		if (!Device.isTouchDevice) {
			this._nextDirections = new NextDirections({
				dimensions: {
					...this.options.dimensions,
					x: 0,
					y: worldMapHeight + this._worldMapPaddingTopBottom,
					height: this._worldMapPaddingTopBottom,
				},
				parentContainer: this._container,
				startKey: "Space",
			});
		} else {
			this.addTouchManual(worldMapHeight);
		}

		await this._worldMap.draw();
		this.registerKeyboardEvents();
	}

	private async startCurrChapter(chapterId: ChapterId) {
		KeyboardEvents.removeAllCallbacks();
		GameEvents.removeAllCallbacks();

		await this._backgroundMusic.fadeOut();
		await this.fadeOut({ timeoutAfter: 500 });
		super.remove();

		KeyboardEvents.removeAllCallbacks();
		new ChapterView({
			parentContainer: App.mainContainer,
			chapterData: chapterDatabase[chapterId],
		});
	}

	private registerKeyboardEvents() {
		KeyboardEvents.registerCallback(KeyboardKeyId.Up, async () => {
			this._worldMap.moveTo("up");
		});

		KeyboardEvents.registerCallback(KeyboardKeyId.Down, async () => {
			this._worldMap.moveTo("down");
		});

		KeyboardEvents.registerCallback(KeyboardKeyId.Right, async () => {
			this._worldMap.moveTo("right");
		});

		KeyboardEvents.registerCallback(KeyboardKeyId.Left, async () => {
			this._worldMap.moveTo("left");
		});

		const startChapterCallbackId = KeyboardEvents.registerCallback(
			KeyboardKeyId.Space,
			async () => {
				if (!this._container) {
					return;
				}

				const currChapterId = this._worldMap.selectedPoint.chapterId;
				await this.startCurrChapter(currChapterId);
			},
		);
	}

	private async loadAssets() {
		const allBadgesUrl = Object.values(characterBadgeDatabase).map(
			({ badgeImageUrl: imageUrl }) => imageUrl,
		);
		const backgroundImageUrl = backgroundImageDatabase[this._backgroundImageId].imageUrl;
		await TexturesLoader.load([backgroundImageUrl, ...allBadgesUrl]);
	}

	private async addBackgroundImage() {
		const backgroundImage = new BackgroundImage({
			parentContainer: this._container,
		});
		backgroundImage.set(BackgroundImageId.WorldMapPixelized);
	}

	private addChapterTitle() {
		const style: Partial<PIXI.ITextStyle> = {
			fontSize: this._worldMapPaddingTopBottom * 0.7,
			fill: "white",
			fontWeight: "bold",
			wordWrap: true,
			wordWrapWidth: this.options.dimensions.width,
		};
		const coordinates: Coordinates = {
			x: this.options.dimensions.width * 0.5,
			y: this._worldMapPaddingTopBottom * 0.6,
		};
		const anchor: Anchor = {
			x: 0.5,
			y: 0.5,
		};

		this._titleText = new Text({
			parentContainer: this._container,
			coordinates,
			anchor,
			style,
			color: FontGradientColor.Green,
			forcePixiText: true,
		});
	}

	private addTouchManual(worldMapHeight: number) {
		const style: Partial<PIXI.ITextStyle> = {
			fontSize: this._worldMapPaddingTopBottom * 0.3,
			fill: "white",
			fontWeight: "bold",
		};

		const coordinates: Coordinates = {
			x: this.options.dimensions.width * 0.5,
			y:
				worldMapHeight +
				this._worldMapPaddingTopBottom +
				this._worldMapPaddingTopBottom * 0.6,
		};
		const anchor: Anchor = {
			x: 0.5,
			y: 0.5,
		};

		new Text({
			parentContainer: this._container,
			coordinates,
			anchor,
			style,
			textValue: {
				"ja-JP": "Click to show chapter title, click again to start the selected chapter",
				"en-US": "Click to show chapter title, click again to start the selected chapter",
				"he-IL": "יש ללחוץ על מנת לראות את כותרת הפרק, וללחוץ שוב כדי להפעיל את הפרק",
			},
			color: FontGradientColor.Green,
			forcePixiText: true,
		});
	}
}
