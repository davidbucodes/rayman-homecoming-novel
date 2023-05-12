import { ChapterNodeTypes } from "./chapterNodeTypes";

export type ChapterNode =
	| ChapterNodeTypes.Decisions
	| ChapterNodeTypes.Dialog
	| ChapterNodeTypes.Speakers
	| ChapterNodeTypes.BackgroundImage
	| ChapterNodeTypes.Music
	| ChapterNodeTypes.Sound
	| ChapterNodeTypes.Filter;
