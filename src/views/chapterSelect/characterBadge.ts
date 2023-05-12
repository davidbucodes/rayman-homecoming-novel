import * as PIXI from "pixi.js";
import { characterBadgeDatabase } from "../../databases/character";
import { cursorDatabase } from "../../databases/cursor";
import { CharacterId } from "../../databases/identifiers/characterId";
import { CursorId } from "../../databases/identifiers/cursorId";
import { MouseEvents } from "../../events/mouseEvents";
import { GraphicElement, GraphicElementOptions } from "../graphicElement/graphicElement";
import { TexturesLoader } from "../loaders/texturesLoader";

interface CharacterBadgeOptions extends GraphicElementOptions {
	characterId: CharacterId;
	setCurrentClickedBadge: (characterId: CharacterId) => unknown;
}

const defaultOptions: Partial<CharacterBadgeOptions> = {};

export class CharacterBadge extends GraphicElement<CharacterBadgeOptions> {
	private _spriteContainer: PIXI.Container = null;
	private _spriteContainerBackground: PIXI.Graphics = null;

	constructor(options: CharacterBadgeOptions) {
		super(Object.assign({}, defaultOptions, options));
		this.init();
	}

	setSelected(isSelected: boolean) {
		this._spriteContainerBackground.visible = isSelected;
	}

	protected init() {
		const background = this.getBackground();
		this._spriteContainerBackground = background;
		this._container.addChild(background);

		const characterImage = this.getCharacterImage();
		this._container.addChild(characterImage);

		this._container.interactive = true;
		MouseEvents.registerPointerUpEvent(this._container, () => {
			this.options.setCurrentClickedBadge(this.options.characterId);
		});

		this._container.cursor = `url('${cursorDatabase[CursorId.Clickable].imageUrl}'),auto`;
		this._container.calculateBounds();
		this._container.updateTransform();
	}

	private getBackground() {
		const background = new PIXI.Graphics();
		background.beginFill(0x4d004d);
		background.alpha = 0.17;
		const maxRadius = this.options.dimensions.width * 0.75;
		const minRadius = this.options.dimensions.width * 0.5;
		const circles = 12;
		for (let i = 0; i < circles; i++) {
			const currRadius = minRadius + ((maxRadius - minRadius) / circles) * i;
			background.drawCircle(
				this.options.dimensions.width / 2,
				this.options.dimensions.height / 2,
				currRadius,
			);
		}
		background.endFill();
		background.visible = false;
		return background;
	}

	private getCharacterImage() {
		const sprite = new PIXI.Sprite();
		sprite.interactive = true;

		const texture = TexturesLoader.get(
			characterBadgeDatabase[this.options.characterId].badgeImageUrl,
		);
		sprite.texture = texture;

		sprite.width = this.options.dimensions.width;
		sprite.height = this.options.dimensions.height;
		sprite.x = 0;
		sprite.y = 0;

		return sprite;
	}
}
