import { GameEvent, GameEvents } from "../../events/gameEvents";
import { BackgroundImage } from "../image/backgroundImage";
import { Dialog } from "./dialog";
import { TexturesLoader } from "../loaders/texturesLoader";
import { chapterNodesEngine } from "./chapterNodesEngine";
import { Config } from "../../config/config";
import { speakersDatabase } from "../../databases/speaker";
import { SpeakerId } from "../../databases/identifiers/speakerId";
import { backgroundImageDatabase } from "../../databases/backgroundImage";
import { BackgroundImageId } from "../../databases/identifiers/backgroundImageId";
import { Music } from "../../sound/music";
import { KeyboardEvents, KeyboardKeyId } from "../../events/keyboardEvents";
import { Device } from "../../device/device";
import { ChapterData } from "../../databases/chapter";
import { Timeout } from "../../device/timeout";
import { MenuPopup } from "../configMenu/menuPopup";
import { Button } from "../button/button";
import { ChapterNode } from "../../databases/chapter/chapterNode";
import { ChapterNodeTypes } from "../../databases/chapter/chapterNodeTypes";
import { DialogUI, getDialogUI } from "./dialogUI";
import { LoadingView } from "../loading/loadingView";
import { AudioLoader } from "../loaders/audioLoader";
import { Chapter } from "../../databases/chapter/chapter";
import { GraphicElementOptions, GraphicElement } from "../graphicElement/graphicElement";
import { CursorId } from "../../databases/identifiers/cursorId";
import { App } from "../app/app";
import { ChapterSelectView } from "../chapterSelect/chapterSelectView";
import { MouseEvents } from "../../events/mouseEvents";
import { VoiceEvents } from "../../events/voiceEvents";
import { AutoplayEvents } from "../../events/autoplayEvents";
import { convertTextToTextValue } from "../text/textValue";

interface ChapterViewOptions extends GraphicElementOptions {
	chapterData: ChapterData;
	useVoice?: true;
}

const defaultOptions: Partial<ChapterViewOptions> = {
	dimensions: Device.screenDimensions,
};

export class ChapterView extends GraphicElement<ChapterViewOptions> {
	private _backgroundMusic: Music;
	constructor(options: ChapterViewOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	async init() {
		const chapterContent = await this.loadChapterContent();

		this._backgroundMusic = new Music();
		const backgroundImage = new BackgroundImage({
			parentContainer: this._container,
		});
		const dialog = new Dialog({
			parentContainer: this._container,
		});
		this.createMenu(this._backgroundMusic);

		const ui = getDialogUI(
			this._backgroundMusic,
			backgroundImage,
			dialog,
			this,
			chapterContent.audio,
			this.options.useVoice,
		);

		this.registerInputEvents();
		this.registerGameEvents(ui, chapterContent);

		GameEvents.emitEvent(GameEvent.Continue);
	}

	private registerGameEvents(ui: DialogUI, chapterContent: Chapter) {
		let currNodeIndex: number = 0;

		GameEvents.registerCallback(GameEvent.MenuClosed, async () => {
			this.registerInputEvents();
			if (Config.options.autoplayDialog) {
				AutoplayEvents.setTimeout(1000);
			}
		});

		GameEvents.registerCallback(GameEvent.VoiceRead, async ({ elapsedSpeakTime }) => {
			if (Config.options.autoplayDialog) {
				AutoplayEvents.setTimeout(1000 - elapsedSpeakTime);
			}
		});

		const continueCallbackId = GameEvents.registerCallback(GameEvent.Continue, async () => {
			VoiceEvents.clearAllTimeouts();

			let currNode = chapterContent.nodes[currNodeIndex];

			if (!currNode) {
				GameEvents.removeCallback(continueCallbackId);
				return await this.close();
			}

			while (currNode && currNode?.type !== "dialog") {
				await chapterNodesEngine.handleChapterNode(ui, currNode);
				currNodeIndex++;
				currNode = chapterContent.nodes[currNodeIndex];
			}

			if (currNode) {
				await chapterNodesEngine.handleChapterNode(ui, currNode);
				currNodeIndex++;
			}
		});
	}
	async close() {
		AudioLoader.stopAll();
		await Promise.all([
			() => {
				AutoplayEvents.clearTimeout();
				VoiceEvents.clearAllTimeouts();
				KeyboardEvents.removeAllCallbacks();
				GameEvents.removeAllCallbacks();
			},
			this._backgroundMusic.fadeOut(2000),
			this.fadeOut({}),
		]);
		this.remove();
		new ChapterSelectView({
			parentContainer: App.mainContainer,
		});
	}

	private registerInputEvents() {
		MouseEvents.registerPointerUpEvent(this._container, () => {
			if (Device.isTouchDevice) {
				GameEvents.emitEvent(GameEvent.Continue);
			}
		});

		KeyboardEvents.registerCallback(KeyboardKeyId.Space, async () => {
			if (!Device.isTouchDevice) {
				GameEvents.emitEvent(GameEvent.Continue);
			}
		});
	}

	private createMenu(backgroundMusic: Music) {
		new MenuPopup({
			parentContainer: App.popupContainer,
			mainBackgroundMusic: backgroundMusic,
		});

		const screenDimensions = Device.screenDimensions;

		const buttonWidth = Device.getScreenRelativeWidth(0.07);
		const buttonHeight = Device.getScreenRelativeHeight(0.07);
		const buttonX = screenDimensions.width - buttonWidth * 1.5;
		const buttonY = buttonHeight / 2;

		new Button({
			parentContainer: this._container,
			textCoordinates: {
				x: buttonX,
				y: buttonY,
			},
			textValue: convertTextToTextValue("Menu"),
			clickCallback: () => {
				AutoplayEvents.clearTimeout();
				VoiceEvents.clearAllTimeouts();
				KeyboardEvents.removeAllCallbacks();
				AudioLoader.stopAll();
				GameEvents.emitEvent(GameEvent.StopLipMove);
				GameEvents.emitEvent(GameEvent.OpenMenuPopup);
			},
			textSize: {
				height: buttonHeight,
				width: buttonWidth,
			},
			cursorId: CursorId.Clickable,
		});
	}

	private async loadChapterContent() {
		const loadingView = new LoadingView({
			parentContainer: this._container,
			loadingImage: this.options.chapterData.loadingImageId,
		});
		await loadingView.init();

		const chapterContent = await this.options.chapterData.getContent();
		await this.loadChapterAssets(chapterContent);

		await loadingView.remove();
		return chapterContent;
	}

	private async loadChapterAssets({ nodes, audio }: Chapter) {
		if (!nodes) {
			return;
		}

		const speakers: SpeakerId[] = [
			...new Set(
				nodes
					.map((node: ChapterNodeTypes.Speakers) =>
						node.type === "speakers"
							? [...(node.left || []), ...(node.right || [])]
							: [],
					)
					.flat()
					.filter((i) => i),
			),
		];
		const speakersAssetsConfig = speakers.reduce((config, speakerId) => {
			for (const image of speakersDatabase[speakerId].images.profile) {
				config.push(image);
			}
			if (speakersDatabase[speakerId].images.profileBlink) {
				config.push(speakersDatabase[speakerId].images.profileBlink);
			}
			return config;
		}, []);

		const backgroundImagesIds: BackgroundImageId[] = [
			...new Set(
				nodes
					.map((node: ChapterNodeTypes.BackgroundImage) => node.backgroundImage)
					.filter((i) => i),
			),
		];
		const backgroundImagesAssetsConfig = backgroundImagesIds.reduce(
			(config, backgroundImageId) => {
				config.push(backgroundImageDatabase[backgroundImageId].imageUrl);
				return config;
			},
			[],
		);

		await TexturesLoader.load([...speakersAssetsConfig, ...backgroundImagesAssetsConfig]);

		if (audio && !this.options.useVoice) {
			await AudioLoader.load(audio);
		}
	}
}
