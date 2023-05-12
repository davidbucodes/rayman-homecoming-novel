import { AudioData } from "../../src/databases/chapter/chapter";
import { VoiceEvent } from "../../src/events/voiceEvents";
import { LanguageId } from "../../src/databases/identifiers/languageId";
import { SpeakerData } from "../../src/databases/speaker";
import { GameEvent, GameEvents } from "../../src/events/gameEvents";
import { Voice } from "./voice";
import { generateId } from "../uiElements/elementId";

let recorder: Recorder;

export async function getBase64ReadVoice(
	language: LanguageId,
	text: string,
	speakerData: SpeakerData,
	shouldSpeakSlow?: true,
) {
	return new Promise<AudioData>(async (resolve) => {
		if (!recorder) {
			recorder = new Recorder();
		}

		registerGameEvents(resolve);
		await recorder.start();
		Voice.speakLang(language, text, speakerData, shouldSpeakSlow);
	});
}

class Recorder {
	private _chunks: Blob[];
	private _mediaRecorder: MediaRecorder;

	async start() {
		// https://stackoverflow.com/a/70665493/10198772
		if (!this._chunks) {
			await this.init();
		}
		this._chunks = [];
		this._mediaRecorder.start(500);
	}

	async stop(): Promise<{ base64Audio: string }> {
		const type = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
		const blob = new Blob(this._chunks, { type });

		this._chunks = [];
		this._mediaRecorder.stop();

		const base64Audio = await new Promise<string>((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.readAsDataURL(blob);
		});
		return {
			base64Audio,
		};
	}

	private async init() {
		const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
		const track = stream.getAudioTracks()[0];
		if (!track) throw "System audio not available";

		stream.getVideoTracks().forEach((track) => track.stop());

		const mediaStream = new MediaStream();
		mediaStream.addTrack(track);

		this._mediaRecorder = new MediaRecorder(mediaStream, { bitsPerSecond: 128000 });
		this._mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) this._chunks.push(event.data);
		};
	}
}

function registerGameEvents(resolve: (value: AudioData | PromiseLike<AudioData>) => void) {
	let voiceEvents: Array<VoiceEvent> = [];
	GameEvents.registerCallback(GameEvent.VoiceRead, async ({ elapsedSpeakTime }) => {
		voiceEvents.push({
			gameEvent: GameEvent.VoiceRead,
			millisecondsFromStart: elapsedSpeakTime,
		});
		const { base64Audio } = await recorder.stop();
		const audioData: AudioData = { base64Audio, id: generateId(), voiceEvents };
		voiceEvents = [];
		GameEvents.removeAllCallbacks();
		resolve(audioData);
	});
	GameEvents.registerCallback(GameEvent.StartLipMove, async ({ millisecondsFromStart }) => {
		voiceEvents.push({ gameEvent: GameEvent.StartLipMove, millisecondsFromStart });
	});
	GameEvents.registerCallback(GameEvent.StopLipMove, async ({ millisecondsFromStart }) => {
		voiceEvents.push({ gameEvent: GameEvent.StopLipMove, millisecondsFromStart });
	});
}
