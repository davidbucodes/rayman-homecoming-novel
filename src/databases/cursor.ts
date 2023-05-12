import { CursorId } from "./identifiers/cursorId";

type CursorData = {
	imageUrl: string;
};

export const cursorDatabase: Record<CursorId, CursorData> = {
	Clickable: {
		imageUrl: "./assets/images/cursor/clickable.png",
	},
	Nonclickable: {
		imageUrl: "./assets/images/cursor/nonclickable.png",
	},
};
