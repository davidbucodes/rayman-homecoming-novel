import * as PIXI from "pixi.js";
type TextureUrl = string;

export class TexturesLoader {
	static async load(
		texturesUrls: TextureUrl[],
		progressCallback?: (progressPercentage: number) => void,
	) {
		PIXI.Loader.shared.onProgress.add((progressEvent) => {
			if (progressCallback) {
				progressCallback(progressEvent.progress);
			}
		});
		PIXI.Loader.shared.add(
			texturesUrls.filter((textureUrl) => !PIXI.Loader.shared.resources[textureUrl]),
		);
		return await new Promise<void>((resolve) => {
			PIXI.Loader.shared.onComplete.once(() => {
				resolve();
			});
			PIXI.Loader.shared.load();
		});
	}

	static get(textureUrl: string): PIXI.Texture<PIXI.Resource> {
		const texture = PIXI.Loader.shared.resources[textureUrl]?.texture;
		if (texture) {
			texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
		}
		return texture;
	}
}
