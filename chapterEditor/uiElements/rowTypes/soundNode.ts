import { ChapterNodeTypes } from "../../../src/databases/chapter/chapterNodeTypes";
import { SoundId } from "../../../src/databases/identifiers/soundId";
import { soundDatabase } from "../../../src/databases/sound";
import { Select } from "../basic/select";
import { Audio } from "../basic/audio";

export class SoundNode {
	private _container: HTMLDivElement;

	constructor(node: ChapterNodeTypes.Sound) {
		this._container = document.createElement("div");

		const sound = new Audio("soundId", this.getSoundUrl(node.soundId));
		this._container.appendChild(sound.getElement());

		this._container.appendChild(
			new Select<SoundId>(
				"soundId",
				Object.values(SoundId),
				(newValue) => {
					node.soundId = newValue;
					sound.update(this.getSoundUrl(node.soundId));
				},
				node.soundId,
			).getElement(),
		);
	}

	private getSoundUrl(soundId: SoundId) {
		return soundDatabase[soundId]?.url;
	}

	getElement() {
		return this._container;
	}
}
