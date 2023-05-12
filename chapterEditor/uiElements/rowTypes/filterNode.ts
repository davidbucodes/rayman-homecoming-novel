import { ChapterNodeTypes } from "../../../src/databases/chapter/chapterNodeTypes";
import { FilterId } from "../../../src/databases/identifiers/filterId";
import { Select } from "../basic/select";
import { Image } from "../basic/image";

export class FilterNode {
	private _container: HTMLDivElement;

	constructor(node: ChapterNodeTypes.Filter) {
		this._container = document.createElement("div");

		this._container.appendChild(
			new Select<FilterId>(
				"filter",
				Object.values(FilterId),
				(newValue) => {
					node.filterId = newValue;
				},
				node.filterId,
				true,
			).getElement(),
		);
	}

	getElement() {
		return this._container;
	}
}
