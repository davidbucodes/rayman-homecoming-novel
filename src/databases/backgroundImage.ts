import { BackgroundImageId } from "./identifiers/backgroundImageId";

export interface BackgroundImageData {
	imageUrl: string;
}

export const backgroundImageDatabase: {
	[backgroundImageId in BackgroundImageId]?: BackgroundImageData;
} = {
	WorldMap: { imageUrl: "./assets/images/background/world-map.png" },
	WorldMapPixelized: {
		imageUrl: "./assets/images/background/world-map-pixelized.png",
	},
	WorldMapUpscaled: {
		imageUrl: "./assets/images/background/world-map-upscaled.png",
	},
	MusicianHouse: {
		imageUrl: "./assets/images/background/musician-house.png",
	},
	BandLand_1: { imageUrl: "./assets/images/background/band-land-1.png" },
	BandLand_2: { imageUrl: "./assets/images/background/band-land-2.png" },
	BandLand_3: { imageUrl: "./assets/images/background/band-land-3.png" },
	BandLand_4: { imageUrl: "./assets/images/background/band-land-4.png" },
	BlueMountains_2: {
		imageUrl: "./assets/images/background/blue-mountains-2.png",
	},
	BlueMountains_3: {
		imageUrl: "./assets/images/background/blue-mountains-3.png",
	},
	CandyChateau_1: {
		imageUrl: "./assets/images/background/candy-chateau-1.png",
	},
	CandyChateau_2: {
		imageUrl: "./assets/images/background/candy-chateau-2.png",
	},
	EatAtJoes: { imageUrl: "./assets/images/background/eat-at-joes.png" },
	MamaBoss_1: { imageUrl: "./assets/images/background/mama-boss-1.png" },
	MamaBoss_2: { imageUrl: "./assets/images/background/mama-boss-2.png" },
	MoskitosNest: { imageUrl: "./assets/images/background/moskitos-nest.png" },
	MrDarksDare: { imageUrl: "./assets/images/background/mr-darks-dare.png" },
	MrSaxsHullaballo: {
		imageUrl: "./assets/images/background/mr-saxs-hullaballo.png",
	},
	MrSkopsStalactites: {
		imageUrl: "./assets/images/background/mr-skops-stalactites.png",
	},
	MrStonesPeaks: {
		imageUrl: "./assets/images/background/mr-stones-peaks.png",
	},
	PictureCity_2: {
		imageUrl: "./assets/images/background/picture-city-2.png",
	},
	PictureCity_3: {
		imageUrl: "./assets/images/background/picture-city-3.png",
	},
	TheCaveOfSkops_1: {
		imageUrl: "./assets/images/background/the-cave-of-skops-1.png",
	},
	TheCaveOfSkops_2: {
		imageUrl: "./assets/images/background/the-cave-of-skops-2.png",
	},
	TheDreamForest_1: {
		imageUrl: "./assets/images/background/the-dream-forest-1.png",
	},
	TheDreamForest_3: {
		imageUrl: "./assets/images/background/the-dream-forest-3.png",
	},
	TitleScreen: { imageUrl: "./assets/images/background/title-screen.png" },
	RaymansHome: { imageUrl: "./assets/images/background/raymans-home.png" },
	BetillasHouse: { imageUrl: "./assets/images/background/betillas-house.png" },
	BetillasSalon: { imageUrl: "./assets/images/background/betillas-salon.jpg" },
};
