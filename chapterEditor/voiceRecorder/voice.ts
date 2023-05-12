import { Config } from "../../src/config/config";
import { Gender, SpeakerData } from "../../src/databases/speaker";
import { GameEvents, GameEvent } from "../../src/events/gameEvents";
import { LanguageId } from "../../src/databases/identifiers/languageId";
import { voiceDatabase } from "../../src/databases/voice";
import { Interval } from "../../src/device/interval";
import { Timeout } from "../../src/device/timeout";
import { ConfigEvents, ConfigEvent } from "../../src/events/configEvents";

export class Voice {
	static isStoppedByNewMessage: boolean;
	static get isSpeaking(): boolean {
		return !!this.currentMessage;
	}
	private static interval: Interval = null;
	private static _voices: SpeechSynthesisVoice[] = null;
	static currentMessage: SpeechSynthesisUtterance = null;
	static get isVoiceAvailable(): number {
		return speechSynthesis?.getVoices().length || 0;
	}

	static async loadAllVoices() {
		if (this._voices) {
			return this._voices;
		}

		let voices = speechSynthesis.getVoices();

		let retries = 0;
		while ((!voices || voices.length === 0) && retries < 20) {
			await new Promise<void>((res) => {
				new Timeout(() => {
					return res();
				}, 30);
			});
			voices = speechSynthesis.getVoices();
			retries++;
		}
		this._voices = voices;
		return voices;
	}

	static stopSpeaking() {
		if (this.currentMessage) {
			this.currentMessage.onend = null;
			this.currentMessage = null;
		}
		speechSynthesis.cancel();
	}

	static async speakLang(
		language: LanguageId,
		text: string,
		speakerData: SpeakerData,
		shouldSpeakSlow?: true,
	) {
		const voiceName = voiceDatabase[language][speakerData.voice.gender];
		const voice = await Voice.getVoice(voiceName);
		if (!voice) {
			return;
		}
		Voice.speak(
			speakerData.voice.pitch,
			text,
			voice,
			language,
			speakerData.voice.gender,
			shouldSpeakSlow,
		);
	}

	private static speak(
		pitch: number,
		text: string,
		voice: SpeechSynthesisVoice,
		languageCode: string,
		speakerGender: Gender,
		shouldSpeakSlow?: true,
	) {
		const message = new SpeechSynthesisUtterance();
		this.currentMessage = message;
		message.voice = voice;

		if (Config.options.backgroundMute) {
			message.volume = 0;
		} else {
			message.volume = 1; // From 0 to 1
		}

		if (speakerGender === Gender.Male) {
			message.rate = shouldSpeakSlow ? 0.4 : 1.7; // From 0.1 to 10
		}
		if (speakerGender === Gender.Female) {
			message.rate = shouldSpeakSlow ? 0.5 : 0.7; // From 0.1 to 10
		}
		message.pitch = pitch; // From 0 to 2
		message.text = text;
		message.lang = languageCode;
		if (speechSynthesis.speaking) {
			speechSynthesis.cancel();
			this.isStoppedByNewMessage = true;
		}
		speechSynthesis.speak(message);

		ConfigEvents.registerCallback(ConfigEvent.ConfigUpdated, async ({ previousConfig }) => {
			if (
				previousConfig.backgroundMute !== Config.options.backgroundMute &&
				!Config.options.backgroundMute
			) {
				speechSynthesis.cancel();
			}
		});

		message.onboundary = (ev) => {
			GameEvents.emitEvent(GameEvent.StartLipMove, { millisecondsFromStart: ev.elapsedTime });
			Voice.interval?.clear();
			const nextIntervalInMilliseconds = 120 * (ev.charLength || 1);
			Voice.interval = new Interval(() => {
				GameEvents.emitEvent(GameEvent.StopLipMove, {
					millisecondsFromStart: ev.elapsedTime + nextIntervalInMilliseconds,
				});
				Voice.interval?.clear();
			}, nextIntervalInMilliseconds);
			this.isStoppedByNewMessage = false;
		};
		message.onend = (ev) => {
			this.currentMessage = null;
			if (!this.isStoppedByNewMessage) {
				GameEvents.emitEvent(GameEvent.VoiceRead, {
					elapsedSpeakTime: ev.elapsedTime,
				});
			} else {
				this.isStoppedByNewMessage = false;
			}
		};
	}

	private static async getVoice(voiceName: string) {
		const voices = await Voice.loadAllVoices();
		return voices.find((voice) => voice.name === voiceName);
	}
}
