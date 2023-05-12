import { VoiceEvent } from "../../events/voiceEvents";
import { ChapterNode } from "./chapterNode";

export type AudioData = {
	id: string;
	base64Audio: string;
	voiceEvents: Array<VoiceEvent>;
};

export type Chapter = {
	nodes: ChapterNode[];
	audio?: AudioData[];
};
