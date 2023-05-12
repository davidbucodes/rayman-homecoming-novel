import { ChapterNodeTypes } from "../../../src/databases/chapter/chapterNodeTypes";
import { SpeakerId } from "../../../src/databases/identifiers/speakerId";
import { Checkbox } from "../basic/checkbox";
import { Select } from "../basic/select";
import { Textbox } from "../basic/textbox";
import { Audio } from "../basic/audio";
import { NodesRepo } from "../../repos/nodesRepo";
import { AudioRepo } from "../../repos/audioRepo";
import { LanguageId } from "../../../src/databases/identifiers/languageId";
import { Button } from "../basic/button";
import { recordDialogNodeVoice } from "../..";
import { Voice } from "../../voiceRecorder/voice";
import { Gender, speakersDatabase } from "../../../src/databases/speaker";
import { TextUtils } from "../../../src/views/text/textUtils";

export class DialogNode {
	private _container: HTMLDivElement;

	constructor(node: ChapterNodeTypes.Dialog, focus = false) {
		this._container = document.createElement("div");

		new Button().init("Record voice", this._container, () => {
			recordDialogNodeVoice(node);
		});

		this._container.appendChild(
			new Select<SpeakerId>(
				"speaker",
				Object.values(SpeakerId),
				(newValue) => {
					node.speaker = newValue;
				},
				node.speaker,
			).getElement(),
		);

		for (const [language, index] of Object.values(LanguageId).map<[LanguageId, number]>(
			(id, index) => [id, index],
		)) {
			this._container.appendChild(this.getTextAndAudio(language, node, index === 0 && focus));
		}

		this._container.appendChild(
			new Checkbox(
				"shouldSpeakSlow",
				(newValue) => {
					if (newValue) {
						node.shouldSpeakSlow = newValue;
					} else {
						delete node.shouldSpeakSlow;
					}
				},
				node.shouldSpeakSlow,
			).getElement(),
		);
	}

	private getTextAndAudio(
		language: LanguageId,
		node: ChapterNodeTypes.Dialog,
		focus = false,
	): HTMLDivElement {
		const div = document.createElement("div");
		const textboxElement = new Textbox(
			`${language} Text`,
			(newValue) => {
				node.text[language] = newValue;
			},
			node.text[language],
			language,
			focus,
		).getElement();

		div.appendChild(textboxElement);

		new Button().init("Play", textboxElement, () => {
			Voice.speakLang(
				language,
				TextUtils.formatTextForSpeak(node.text, language),
				speakersDatabase[node.speaker],
			);
		});

		if (node.audio?.[language]) {
			const base64Audio = AudioRepo.get(node.audio[language]);
			div.appendChild(new Audio("audio", base64Audio).getElement());
		}

		return div;
	}

	getElement() {
		return this._container;
	}
}
