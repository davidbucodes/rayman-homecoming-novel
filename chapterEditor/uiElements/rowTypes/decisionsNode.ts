import { ChapterNodeTypes } from "../../../src/databases/chapter/chapterNodeTypes";

export class DecisionsNode {
	private _container: HTMLDivElement;

	constructor(node: ChapterNodeTypes.Decisions) {
		this._container = document.createElement("div");

		this._container.innerText = node.decisionsTitle;
	}

	getElement() {
		return this._container;
	}
}
