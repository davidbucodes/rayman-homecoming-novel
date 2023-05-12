import "../../global";
import { LanguageId } from "./identifiers/languageId";
import { ChapterId } from "./identifiers/chapterId";
import { Chapter } from "./chapter/chapter";
import { LoadingImageId } from "./identifiers/loadingImageId";

export interface ChapterData {
	name: Record<LanguageId, string>;
	getContent: () => Promise<Chapter>;
	loadingImageId: LoadingImageId;
}

export const chapterDatabase: Record<ChapterId, ChapterData> = {
	Tarayzan: {
		name: {
			"en-US": "Tarayzan",
			"he-IL": "טרייזן",
			"ja-JP": "タライザン",
		},
		getContent: async () => (await import("../chapters/tarayzan.yaml")).default,
		loadingImageId: LoadingImageId.Jungle,
	},
	Notes: {
		name: {
			"en-US": "Notes",
			"he-IL": "תווים",
			"ja-JP": "音符",
		},
		getContent: async () => (await import("../chapters/notes.yaml")).default,
		loadingImageId: LoadingImageId.Music,
	},
	MusicianHouse: {
		name: {
			"en-US": "Musician's House",
			"he-IL": "הבית של המוזיקאי",
			"ja-JP": "ミュジシャーンの家",
		},
		getContent: async () => (await import("../chapters/musicianHouse.yaml")).default,
		loadingImageId: LoadingImageId.Rocks,
	},
	MrSkops: {
		name: {
			"en-US": "Mr. Skops",
			"he-IL": "אדון סקופס",
			"ja-JP": "スコプス殿",
		},
		getContent: async () => (await import("../chapters/mrskops.yaml")).default,
		loadingImageId: LoadingImageId.Caves,
	},
	BetillasGarden: {
		name: {
			"en-US": "Betilla's Garden",
			"he-IL": "הגינה של בטילה",
			"ja-JP": "ベチラの庭",
		},
		getContent: async () => (await import("../chapters/betillasGarden.yaml")).default,
		loadingImageId: LoadingImageId.Jungle,
	},
	TheMagiciansChallenge: {
		name: {
			"en-US": "The Magician's Challenge",
			"he-IL": "אתגר הקוסם",
			"ja-JP": "マジシャンのチャレンジ",
		},
		getContent: async () => (await import("../chapters/theMagiciansChallenge.yaml")).default,
		loadingImageId: LoadingImageId.Jungle,
	},
};
