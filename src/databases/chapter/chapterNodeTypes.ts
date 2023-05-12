import { BackgroundImageId } from "../identifiers/backgroundImageId";
import { MusicId } from "../identifiers/musicId";
import { SoundId } from "../identifiers/soundId";
import { SpeakerId } from "../identifiers/speakerId";
import { TextValue } from "../../views/text/textValue";
import { ChapterNodeTypeId } from "../identifiers/chapterNodeTypeId";
import { FilterId } from "../identifiers/filterId";

export declare namespace ChapterNodeTypes {
	export interface Decisions {
		type: ChapterNodeTypeId.Decisions;
		decisionsTitle?: string;
		decisions: { question: TextValue; options: TextValue[] }[];
	}
	export interface Dialog {
		type: ChapterNodeTypeId.Dialog;
		speaker: SpeakerId;
		text: TextValue;
		shouldSpeakSlow?: true;
		audio?: Partial<TextValue>;
	}
	export interface Speakers {
		type: ChapterNodeTypeId.Speakers;
		right?: SpeakerId[];
		left?: SpeakerId[];
	}
	export interface BackgroundImage {
		type: ChapterNodeTypeId.BackgroundImage;
		backgroundImage: BackgroundImageId;
	}
	export interface Music {
		type: ChapterNodeTypeId.Music;
		musicId: MusicId;
	}
	export interface Sound {
		type: ChapterNodeTypeId.Sound;
		soundId: SoundId;
	}
	export interface Filter {
		type: ChapterNodeTypeId.Filter;
		filterId?: FilterId;
	}
}
