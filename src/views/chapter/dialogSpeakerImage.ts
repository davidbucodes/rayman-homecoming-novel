import * as PIXI from "pixi.js";
import { SpeakerData } from "../../databases/speaker";
import { GameEvents, GameEvent } from "../../events/gameEvents";
import { Timeout } from "../../device/timeout";
import { Dimensions } from "../graphicElement/dimensions";
import { TexturesLoader } from "../loaders/texturesLoader";
import { GraphicElementOptions, GraphicElement } from "../graphicElement/graphicElement";
interface DialogSpeakerImageOptions extends GraphicElementOptions {
	imageWidth: number;
	imageHeight: number;
	side: string;
	sideIndex: number;
	speakerData: SpeakerData;
	shrinkSpace: boolean;
}

const defaultOptions: Partial<DialogSpeakerImageOptions> = {
	shrinkSpace: false,
};

export class DialogSpeakerImage extends GraphicElement<DialogSpeakerImageOptions> {
	private imageObject: PIXI.AnimatedSprite = null;
	private _isSpeaking = false;
	private blinkingTexture: PIXI.Texture<PIXI.Resource>;
	private gameEventsCallbackIds: string[] = [];

	constructor(options: DialogSpeakerImageOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	update() {
		if (!this.imageObject) {
			this.init();
		}
	}

	set isSpeaking(value: boolean) {
		this._isSpeaking = value;
		if (!value && this.imageObject) {
			this.imageObject?.stop();
			this.imageObject.texture = this.imageObject
				.textures?.[0] as PIXI.Texture<PIXI.Resource>;
		}
	}

	remove() {
		this.gameEventsCallbackIds.forEach((callbackId) => {
			GameEvents.removeCallback(callbackId);
		});
		super.remove();
	}

	protected init() {
		this.imageObject = this.createImage(this.options.imageHeight, this.options.imageWidth);
		this._container.addChild(this.imageObject);

		this.imageObject.animationSpeed = 0.15;

		const startLipCallbackId = GameEvents.registerCallback(GameEvent.StartLipMove, async () => {
			if (this._isSpeaking && !this.imageObject.playing) {
				this.imageObject.texture = this.imageObject
					.textures[0] as PIXI.Texture<PIXI.Resource>;
				this.imageObject.play();
			}
		});

		const stopLipCallbackId = GameEvents.registerCallback(GameEvent.StopLipMove, async () => {
			this.imageObject.stop();
			this.imageObject.texture = this.imageObject.textures[0] as PIXI.Texture<PIXI.Resource>;
		});

		this.gameEventsCallbackIds.push(startLipCallbackId, stopLipCallbackId);

		this.startBlinking();
	}

	private blink() {
		const blinkTimeout = Math.floor(Math.random() * 2500) + 1500;
		new Timeout(() => {
			if (this.imageObject.playing) {
				this.blink();
			} else {
				this.imageObject.texture = this.blinkingTexture;

				new Timeout(() => {
					if (!this.imageObject.playing) {
						this.imageObject.texture = this.imageObject
							.textures[0] as PIXI.Texture<PIXI.Resource>;
					}
					this.blink();
				}, 60);
			}
		}, blinkTimeout);
	}

	private startBlinking() {
		if (this.blinkingTexture) {
			this.blink();
		}
	}

	private createImage(height: number, width: number): PIXI.AnimatedSprite {
		const textures: PIXI.Texture[] = this.options.speakerData.images.profile.map(
			(profileImage) => TexturesLoader.get(profileImage),
		);

		const sprite = new PIXI.AnimatedSprite(textures);
		if (this.options.speakerData.images.profileBlink) {
			this.blinkingTexture = TexturesLoader.get(this.options.speakerData.images.profileBlink);
		}

		sprite.width = width;
		sprite.height = height;

		if (this.options.side === "left") {
			sprite.x =
				this.options.imageWidth * this.options.sideIndex -
				(this.options.shrinkSpace
					? this.options.imageWidth * 0.2 * (this.options.sideIndex + 1)
					: 0);
		}
		if (this.options.side === "right") {
			sprite.x =
				this.options.dimensions.width -
				this.options.imageWidth -
				this.options.imageWidth * this.options.sideIndex +
				(this.options.shrinkSpace
					? this.options.imageWidth * 0.2 * (this.options.sideIndex + 1)
					: 0);
		}

		if (this.options.side === this.options.speakerData.images.profileDirection) {
			sprite.anchor.x = 1;
			sprite.scale.x *= -1;
		}

		sprite.y = -height;

		return sprite;
	}
}
