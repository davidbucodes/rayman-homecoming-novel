import FontFaceObserver from "fontfaceobserver";

export enum FontFamily {
	Rayman = "Rayman",
	SystemUI = "system-ui",
	None = "none",
}

export class FontLoader {
	static async load(fontFamily: string) {
		const fontObserver = new FontFaceObserver(fontFamily);

		return new Promise((resolve) => {
			fontObserver.load().then(resolve);
		});
	}
}
