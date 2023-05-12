import { CharacterId } from "./identifiers/characterId";

export interface CharacterData {
	badgeImageUrl: string;
}

export const characterBadgeDatabase: {
	[characterId in CharacterId]: CharacterData;
} = {
	Betilla: {
		badgeImageUrl: "./assets/images/characterBadge/betilla.png",
	},
	Bzzit: {
		badgeImageUrl: "./assets/images/characterBadge/bzzit.png",
	},
	Electoon: {
		badgeImageUrl: "./assets/images/characterBadge/electoon.png",
	},
	Joe: {
		badgeImageUrl: "./assets/images/characterBadge/joe.png",
	},
	Magician: {
		badgeImageUrl: "./assets/images/characterBadge/magician.png",
	},
	Medallion: {
		badgeImageUrl: "./assets/images/characterBadge/Medallion.png",
	},
	MrDark: {
		badgeImageUrl: "./assets/images/characterBadge/mrdark.png",
	},
	MrSax: {
		badgeImageUrl: "./assets/images/characterBadge/mrsax.png",
	},
	MrSkops: {
		badgeImageUrl: "./assets/images/characterBadge/mrskops.png",
	},
	MrStone: {
		badgeImageUrl: "./assets/images/characterBadge/mrstone.png",
	},
	Musician: {
		badgeImageUrl: "./assets/images/characterBadge/musician.png",
	},
	Painter: {
		badgeImageUrl: "./assets/images/characterBadge/painter.png",
	},
	Photographer: {
		badgeImageUrl: "./assets/images/characterBadge/photographer.png",
	},
	Rayman: {
		badgeImageUrl: "./assets/images/characterBadge/rayman.png",
	},
	SpaceMama: {
		badgeImageUrl: "./assets/images/characterBadge/spacemama.png",
	},
	Tarayzan: {
		badgeImageUrl: "./assets/images/characterBadge/tarayzan.png",
	},
};
