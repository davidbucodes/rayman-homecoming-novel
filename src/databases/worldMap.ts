import { RelativeCoordinates } from "../views/graphicElement/dimensions";
import { ChapterId } from "./identifiers/chapterId";
import { CharacterId } from "./identifiers/characterId";

export type MapDirection = "up" | "down" | "left" | "right";

export const oppositeMapDirectionDictionary: Record<MapDirection, MapDirection> = {
	up: "down",
	down: "up",
	right: "left",
	left: "right",
};

interface WorldMap {
	startPoint: WorldMapPoint;
	points: Record<CharacterId, WorldMapPoint>;
	links: WorldMapPointsLink[];
}

export type WorldMapPointsLink = [CharacterId, CharacterId, MapDirection];

export interface WorldMapPoint {
	chapterId: ChapterId;
	characterId: CharacterId;
	mapRelativeCoordinates: RelativeCoordinates;
}

const startPointBadgeId = CharacterId.Rayman;
const worldMapPoints: Record<CharacterId, WorldMapPoint> = {
	Betilla: {
		characterId: CharacterId.Betilla,
		chapterId: ChapterId.BetillasGarden,
		mapRelativeCoordinates: {
			relativeX: 0.38750000794728595,
			relativeY: 0.5708333474618418,
		},
	},
	Bzzit: {
		characterId: CharacterId.Bzzit,
		chapterId: ChapterId.Tarayzan,
		mapRelativeCoordinates: {
			relativeX: 0.4208333492279053,
			relativeY: 0.831944430315936,
		},
	},
	Electoon: {
		characterId: CharacterId.Electoon,
		chapterId: ChapterId.Notes,
		mapRelativeCoordinates: {
			relativeX: 0.39374999205271405,
			relativeY: 0.10046298415572555,
		},
	},
	Joe: {
		characterId: CharacterId.Joe,
		chapterId: ChapterId.MrSkops,
		mapRelativeCoordinates: {
			relativeX: 0.8604166507720947,
			relativeY: 0.8467593016447844,
		},
	},
	Magician: {
		characterId: CharacterId.Magician,
		chapterId: ChapterId.TheMagiciansChallenge,
		mapRelativeCoordinates: {
			relativeX: 0.07708333432674408,
			relativeY: 0.5745370299727829,
		},
	},
	Medallion: {
		characterId: CharacterId.Medallion,
		chapterId: ChapterId.Notes,
		mapRelativeCoordinates: {
			relativeX: 0.13229166467984518,
			relativeY: 0.25046297355934427,
		},
	},
	MrDark: {
		characterId: CharacterId.MrDark,
		chapterId: ChapterId.MrSkops,
		mapRelativeCoordinates: {
			relativeX: 0.8531250158945719,
			relativeY: 0.26157407407407407,
		},
	},
	MrSax: {
		characterId: CharacterId.MrSax,
		chapterId: ChapterId.Notes,
		mapRelativeCoordinates: {
			relativeX: 0.2677083412806193,
			relativeY: 0.3819444444444444,
		},
	},
	MrSkops: {
		characterId: CharacterId.MrSkops,
		chapterId: ChapterId.MrSkops,
		mapRelativeCoordinates: {
			relativeX: 0.9364583492279053,
			relativeY: 0.5208333333333334,
		},
	},
	MrStone: {
		characterId: CharacterId.MrStone,
		chapterId: ChapterId.MrSkops,
		mapRelativeCoordinates: {
			relativeX: 0.7072916825612386,
			relativeY: 0.152314821879069,
		},
	},
	Musician: {
		characterId: CharacterId.Musician,
		chapterId: ChapterId.MusicianHouse,
		mapRelativeCoordinates: {
			relativeX: 0.5458333492279053,
			relativeY: 0.41342594005443434,
		},
	},
	Painter: {
		characterId: CharacterId.Painter,
		chapterId: ChapterId.Tarayzan,
		mapRelativeCoordinates: {
			relativeX: 0.7364583810170492,
			relativeY: 0.5597222999290183,
		},
	},
	Photographer: {
		characterId: CharacterId.Photographer,
		chapterId: ChapterId.Notes,
		mapRelativeCoordinates: {
			relativeX: 0.5416666666666666,
			relativeY: 0.6245370794225622,
		},
	},
	Rayman: {
		characterId: CharacterId.Rayman,
		chapterId: ChapterId.Tarayzan,
		mapRelativeCoordinates: {
			relativeX: 0.10208333532015483,
			relativeY: 0.8671296437581381,
		},
	},
	SpaceMama: {
		characterId: CharacterId.SpaceMama,
		chapterId: ChapterId.MrSkops,
		mapRelativeCoordinates: {
			relativeX: 0.643749992052714,
			relativeY: 0.8930555979410807,
		},
	},
	Tarayzan: {
		characterId: CharacterId.Tarayzan,
		chapterId: ChapterId.Tarayzan,
		mapRelativeCoordinates: {
			relativeX: 0.24895832935969034,
			relativeY: 0.6800926349781178,
		},
	},
};

const worldMapPointsLinks: WorldMapPointsLink[] = [
	[CharacterId.Betilla, CharacterId.MrSax, "up"],
	[CharacterId.Betilla, CharacterId.Bzzit, "down"],
	[CharacterId.Bzzit, CharacterId.Photographer, "right"],
	[CharacterId.Electoon, CharacterId.Musician, "right"],
	[CharacterId.Joe, CharacterId.MrSkops, "up"],
	[CharacterId.MrSax, CharacterId.Medallion, "left"],
	[CharacterId.MrSax, CharacterId.Electoon, "right"],
	[CharacterId.MrSkops, CharacterId.MrDark, "up"],
	[CharacterId.MrStone, CharacterId.Painter, "down"],
	[CharacterId.Musician, CharacterId.MrStone, "right"],
	[CharacterId.Musician, CharacterId.Electoon, "left"],
	[CharacterId.Painter, CharacterId.Joe, "right"],
	[CharacterId.Photographer, CharacterId.Musician, "up"],
	[CharacterId.Photographer, CharacterId.SpaceMama, "right"],
	[CharacterId.Rayman, CharacterId.Magician, "up"],
	[CharacterId.Rayman, CharacterId.Tarayzan, "right"],
	[CharacterId.SpaceMama, CharacterId.Painter, "right"],
	[CharacterId.Tarayzan, CharacterId.Betilla, "right"],
];

export const worldMapDatabase: WorldMap = {
	startPoint: worldMapPoints[startPointBadgeId],
	points: worldMapPoints,
	links: worldMapPointsLinks,
};
