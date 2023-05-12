import { Voice } from "../../../chapterEditor/voiceRecorder/voice";
import { Config } from "../../config/config";
import { AudioData } from "../../databases/chapter/chapter";
import { ChapterNodeTypes } from "../../databases/chapter/chapterNodeTypes";
import { LanguageId } from "../../databases/identifiers/languageId";
import { Gender, speakersDatabase } from "../../databases/speaker";
import { VoiceEvents } from "../../events/voiceEvents";
import { Music } from "../../sound/music";
import { Sound } from "../../sound/sound";
import { Filters } from "../filters/filters";
import { BackgroundImage } from "../image/backgroundImage";
import { AudioLoader } from "../loaders/audioLoader";
import { TextUtils } from "../text/textUtils";
import { ChapterView } from "./chapterView";
import { Dialog } from "./dialog";

export interface DialogUI {
	startMusic(node: ChapterNodeTypes.Music): Promise<void>;
	startSound(node: ChapterNodeTypes.Sound): Promise<void>;
	setScene(node: ChapterNodeTypes.BackgroundImage): Promise<void>;
	displayDialog: (node: ChapterNodeTypes.Dialog) => Promise<void>;
	promptChoices: (node: ChapterNodeTypes.Decisions) => Promise<void>;
	setFilter: (node: ChapterNodeTypes.Filter) => Promise<void>;
	displaySpeakers: (node: ChapterNodeTypes.Speakers) => Promise<void>;
}

export function getDialogUI(
	backgroundMusic: Music,
	backgroundImage: BackgroundImage,
	dialog: Dialog,
	chapterView: ChapterView,
	audios?: AudioData[],
	useVoice?: boolean,
): DialogUI {
	return {
		startMusic: async (node: ChapterNodeTypes.Music) => {
			await backgroundMusic.fadeOut();
			backgroundMusic.start(node.musicId);
		},
		startSound: async (node: ChapterNodeTypes.Sound) => {
			const sound = new Sound();
			sound.start(node.soundId);
		},
		setScene: async (node: ChapterNodeTypes.BackgroundImage) => {
			backgroundImage.set(node.backgroundImage);
		},
		setFilter: async (node: ChapterNodeTypes.Filter) => {
			const { filterId } = node;
			if (filterId) {
				const { filter, animation } = Filters.generate({ filterId });
				chapterView.setFilter(filter, animation, true);
			} else {
				chapterView.setFilter(null, null);
			}
		},
		displayDialog: async (node: ChapterNodeTypes.Dialog) => {
			if (!useVoice && node.audio) {
				const audioData = audios?.find(
					({ id }) => id === node.audio[Config.options.language],
				);

				if (audioData) {
					AudioLoader.stopAll();
					AudioLoader.get(audioData.id).play();

					VoiceEvents.clearAllTimeouts();
					VoiceEvents.setVoiceEventTimeouts(audioData.voiceEvents);
				}
			} else {
				const formattedText = TextUtils.formatTextForSpeak(
					node.text,
					Config.options.language,
				);
				Voice.speakLang(
					Config.options.language,
					formattedText,
					speakersDatabase[node.speaker],
					node.shouldSpeakSlow,
				);
			}
			dialog.updateDialog(node);
		},
		displaySpeakers: async (node: ChapterNodeTypes.Speakers) => {
			dialog.updateSpeakers(node);
		},
		promptChoices: async () => {
			return null;
		},
	};
}
