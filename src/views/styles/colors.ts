export enum FontGradientColor {
	Red = "Red",
	Green = "Green",
	Yellow = "Yellow",
	Blue = "Blue",
}

export class Colors {
	static menuTextFillMapping: Record<FontGradientColor, string[]> = {
		Red: ["#e00000", "#c16767", "#db0000"],
		Green: ["#00e018", "#67c170", "#00db3c"],
		Yellow: ["#f1cb11", "#c1af67", "#dbb600"],
		Blue: ["#115df1", "#678dc1", "#0025db"],
	};
	static menuTextStrokeMapping: Record<FontGradientColor, string> = {
		Red: "#520000",
		Green: "#005212",
		Yellow: "#524d00",
		Blue: "#001152",
	};
	static menuTextDropShadowColorMapping: Record<FontGradientColor, string> = {
		Red: "#850000",
		Green: "#008533",
		Yellow: "#857400",
		Blue: "#001c85",
	};
}
