import { ChapterNodeTypes } from "../../../src/databases/chapter/chapterNodeTypes";
import { MusicId } from "../../../src/databases/identifiers/musicId";
import { musicDatabase } from "../../../src/databases/music";
import { Audio } from "../basic/audio";
import { Select } from "../basic/select";

export class MusicNode {
	private _container: HTMLDivElement;

	constructor(node: ChapterNodeTypes.Music) {
		this._container = document.createElement("div");

		const music = new Audio("musicId", this.getMusicUrl(node.musicId));
		this._container.appendChild(music.getElement());

		this._container.appendChild(
			new Select<MusicId>(
				"musicId",
				Object.values(MusicId),
				(newValue) => {
					node.musicId = newValue;
					music.update(this.getMusicUrl(node.musicId));
				},
				node.musicId,
			).getElement(),
		);
	}

	private getMusicUrl(musicId: MusicId) {
		return musicDatabase[musicId]?.url;
	}

	getElement() {
		return this._container;
	}
}
