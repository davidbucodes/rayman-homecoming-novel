import { getElementId } from "../elementId";

export class Image {
	private _image: HTMLImageElement;

	constructor(fieldName: string, imageUrl: string, width: number, height: number) {
		const id = getElementId(fieldName);
		const image = document.createElement("img");
		image.id = id;
		image.src = imageUrl;
		image.width = width;
		image.height = height;
		this._image = image;
	}

	update(imageUrl: string) {
		this._image.src = imageUrl;
	}

	getElement() {
		return this._image;
	}
}
