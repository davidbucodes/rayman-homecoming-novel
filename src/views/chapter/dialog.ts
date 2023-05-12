import { Dimensions } from "../graphicElement/dimensions";
import { DialogSpeakerImage } from "./dialogSpeakerImage";
import { DialogSpeakerName } from "./dialogSpeakerName";
import { DialogText } from "./dialogText";
import { Config } from "../../config/config";
import { Device } from "../../device/device";
import { speakersDatabase } from "../../databases/speaker";
import { SpeakerId } from "../../databases/identifiers/speakerId";
import { ChapterNodeTypes } from "../../databases/chapter/chapterNodeTypes";
import { GraphicElementOptions, GraphicElement } from "../graphicElement/graphicElement";

interface DialogOptions extends GraphicElementOptions {
	backgroundColor?: number;
	backgroundOpacity?: number;
	textColor?: number;
}

const defaultOptions: Partial<DialogOptions> = {
	dimensions: Device.screenDimensions,
	backgroundColor: 0xb891f7,
	backgroundOpacity: 0.95,
	textColor: 0xffffff,
};

export class Dialog extends GraphicElement<DialogOptions> {
	private _dialogText: DialogText = null;
	private _dialogSpeakerName: DialogSpeakerName = null;
	private _dialogSpeakerImages: Partial<Record<SpeakerId, DialogSpeakerImage>> = {};
	private _currDialogNode: ChapterNodeTypes.Dialog = null;
	private _rightSpeakers: SpeakerId[];

	constructor(options: DialogOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	protected init() {
		const dialogTextDimensions = this.getDialogTextDimensions();
		const speakerNameTextY = dialogTextDimensions.height * 0.2;

		this._dialogText = new DialogText({
			parentContainer: this._container,
			dimensions: dialogTextDimensions,
			backgroundColor: this.options.backgroundColor,
			backgroundOpacity: this.options.backgroundOpacity,
			textColor: this.options.textColor,
			speakerNameTextY,
			frameWidth: dialogTextDimensions.width * 0.01,
			paddingTop: speakerNameTextY * 1.25,
			paddingLeftRight: speakerNameTextY / 2,
		});

		this._dialogSpeakerName = new DialogSpeakerName({
			dimensions: dialogTextDimensions,
			parentContainer: this._container,
			frameHeight: speakerNameTextY,
			frameLineWidth: dialogTextDimensions.width * 0.01 * 0.5,
			textColor: this.options.textColor,
			fontSize: speakerNameTextY * 0.45,
		});
	}

	async updateDialog(node: ChapterNodeTypes.Dialog) {
		this._currDialogNode = node;
		this._dialogText.update(this._currDialogNode.text, Config.options.language);
		let side: "left" | "right" = "left";
		if (this._rightSpeakers?.includes(node.speaker)) {
			side = "right";
		}
		this._dialogSpeakerName.update(this._currDialogNode, side);
		this.setSpeakingSpeaker(this._currDialogNode.speaker);
	}

	async updateSpeakers(node: ChapterNodeTypes.Speakers) {
		const dialogTextDimensions = this.getDialogTextDimensions();
		const speakerImageWidth = dialogTextDimensions.width * 0.3;

		for (const speakerName in this._dialogSpeakerImages) {
			this._dialogSpeakerImages[speakerName as SpeakerId].remove();
		}
		this._dialogSpeakerImages = {};

		const shouldShrinkSpace = (node.left?.length || 0) + (node.right?.length || 0) > 3;
		node.left?.forEach((speaker, index) => {
			this._dialogSpeakerImages[speaker] = new DialogSpeakerImage({
				parentContainer: this._container,
				imageHeight: speakerImageWidth,
				imageWidth: speakerImageWidth,
				dimensions: dialogTextDimensions,
				side: "left",
				speakerData: speakersDatabase[speaker],
				sideIndex: index,
				shrinkSpace: shouldShrinkSpace,
			});
		});
		node.right?.forEach((speaker, index) => {
			this._dialogSpeakerImages[speaker] = new DialogSpeakerImage({
				parentContainer: this._container,
				imageHeight: speakerImageWidth,
				imageWidth: speakerImageWidth,
				dimensions: dialogTextDimensions,
				side: "right",
				speakerData: speakersDatabase[speaker],
				sideIndex: index,
				shrinkSpace: shouldShrinkSpace,
			});
		});
		for (const speakerName in this._dialogSpeakerImages) {
			this._dialogSpeakerImages[speakerName as SpeakerId]?.update();
		}

		const shouldNotDisplayDialog =
			(!node.right || !node.right.length) && (!node.left || !node.left.length);
		this._container.visible = !shouldNotDisplayDialog;
		if (shouldNotDisplayDialog) {
			this._dialogText.clear();
		}
		this._rightSpeakers = node.right;
	}

	private setSpeakingSpeaker(currSpeaker: SpeakerId) {
		for (const dialogSpeakerImage of Object.values(this._dialogSpeakerImages)) {
			dialogSpeakerImage.isSpeaking = false;
		}
		if (this._dialogSpeakerImages[currSpeaker]) {
			this._dialogSpeakerImages[currSpeaker].isSpeaking = true;
		}
	}

	private getDialogTextDimensions(): Dimensions {
		const dialogRelativeWidth = 0.7;
		const dialogRelativeHeight = 0.35;

		const dialogWidth = this.options.dimensions.width * dialogRelativeWidth;
		const dialogHeight = this.options.dimensions.height * dialogRelativeHeight;

		const dialogX = (this.options.dimensions.width - dialogWidth) * 0.5;
		const dialogY = (this.options.dimensions.height - dialogHeight) * 0.95;

		return {
			x: dialogX,
			y: dialogY,
			width: dialogWidth,
			height: dialogHeight,
		};
	}
}
