import { ChapterNodeTypes } from "../../../src/databases/chapter/chapterNodeTypes";
import { BackgroundImageId } from "../../../src/databases/identifiers/backgroundImageId";
import { Checkbox } from "../basic/checkbox";
import { Select } from "../basic/select";
import { Image } from "../basic/image";
import { backgroundImageDatabase } from "../../../src/databases/backgroundImage";

export class BackgroundImageNode {
	private _container: HTMLDivElement;

	constructor(node: ChapterNodeTypes.BackgroundImage) {
		this._container = document.createElement("div");

		const image = new Image(
			"backgroundImage",
			this.getBackgroundImageUrl(node.backgroundImage),
			130,
			100,
		);
		this._container.appendChild(image.getElement());

		this._container.appendChild(
			new Select<BackgroundImageId>(
				"backgroundImage",
				Object.values(BackgroundImageId),
				(newValue) => {
					node.backgroundImage = newValue;
					image.update(this.getBackgroundImageUrl(newValue));
				},
				node.backgroundImage,
			).getElement(),
		);
	}

	private getBackgroundImageUrl(backgroundImageId: BackgroundImageId) {
		return backgroundImageDatabase[backgroundImageId]?.imageUrl;
	}

	getElement() {
		return this._container;
	}
}
