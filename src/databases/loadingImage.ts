import { LoadingImageId } from "./identifiers/loadingImageId";

export interface LoadingImageData {
	imageUrl: string;
}

export const loadingImageDatabase: {
	[loadingImageId in LoadingImageId]?: LoadingImageData;
} = {
	Cake: { imageUrl: "./assets/images/loading/cake.png" },
	Caves: { imageUrl: "./assets/images/loading/caves.png" },
	Jungle: { imageUrl: "./assets/images/loading/jungle.png" },
	Music: { imageUrl: "./assets/images/loading/music.png" },
	Paint: { imageUrl: "./assets/images/loading/paint.png" },
	Rocks: { imageUrl: "./assets/images/loading/rocks.png" },
};
