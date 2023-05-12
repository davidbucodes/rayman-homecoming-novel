import { ChapterNodeTypes } from "../../../src/databases/chapter/chapterNodeTypes";
import { SpeakerId } from "../../../src/databases/identifiers/speakerId";
import { MultiSelect } from "../basic/multiSelect";
import { Select } from "../basic/select";

export class SpeakersNode {
	private _container: HTMLDivElement;

	constructor(node: ChapterNodeTypes.Speakers) {
		this._container = document.createElement("div");

		this._container.appendChild(
			new MultiSelect<SpeakerId>(
				"left",
				Object.values(SpeakerId),
				(newValues) => {
					node.left = newValues;
				},
				node.left,
			).getElement(),
		);

		this._container.appendChild(
			new MultiSelect<SpeakerId>(
				"right",
				Object.values(SpeakerId),
				(newValues) => {
					node.right = newValues;
				},
				node.right,
			).getElement(),
		);
	}

	getElement() {
		return this._container;
	}
}
