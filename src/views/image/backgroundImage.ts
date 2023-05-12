import { backgroundImageDatabase } from "../../databases/backgroundImage";
import { BackgroundImageId } from "../../databases/identifiers/backgroundImageId";
import { Image } from "./image";

export class BackgroundImage extends Image {
	set(backgroundImageId: BackgroundImageId) {
		super.set(backgroundImageDatabase[backgroundImageId].imageUrl);
	}
}
