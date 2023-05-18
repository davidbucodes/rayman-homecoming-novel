import { Timeout } from "../device/timeout";

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N
	? Acc[number]
	: Enumerate<N, [...Acc, Acc["length"]]>;

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type AudioVolume = IntRange<0, 101>;

export interface AudioOptions {
	loop?: true;
	removeOnPause?: true;
	onReadyCallback?: () => void;
}

export class Audio {
	private _audioElement: HTMLAudioElement = null;
	private _volume: number;

	constructor(private options: AudioOptions = {}) {
		this.init();
	}

	private init() {
		this._audioElement = document.createElement("audio");

		this._audioElement.setAttribute("preload", "auto");
		this._audioElement.setAttribute("controls", "none");

		if (this.options.loop) {
			this._audioElement.setAttribute("loop", "true");
		}

		this._audioElement.style.display = "none";

		if (this.options.removeOnPause) {
			this._audioElement.onpause = () => this.remove();
		}

		if (this.options.onReadyCallback) {
			this._audioElement.oncanplaythrough = () => this.options.onReadyCallback();
		}
	}

	remove() {
		this._audioElement.remove();
		this._audioElement = null;
	}

	setVolume(volume: AudioVolume) {
		this._volume = volume / 100;
		this._audioElement.volume = this._volume;
	}

	play() {
		this._audioElement.play();
	}

	pause() {
		this._audioElement.pause();
	}

	stop() {
		this.pause();
		this._audioElement.currentTime = 0;
	}

	setAudio(audioUrl: string) {
		this._audioElement.src = audioUrl;
	}

	async fadeOut(duration: number = 500) {
		if (typeof this._volume !== "number") {
			return;
		}

		const startVolume = this._volume;
		const fadeSteps = 5;

		for (let i = 0; i < fadeSteps; i++) {
			this._audioElement.volume = startVolume - (startVolume / fadeSteps) * i;
			await new Promise<void>((res) => {
				new Timeout(() => {
					return res();
				}, duration / fadeSteps);
			});
		}
		this.pause();
	}

	async fadeIn() {
		this._audioElement.volume = 0;
		this.play();

		const fadeSteps = 5;
		const fadeVolumeTo = this._volume;

		for (let i = 0; i < fadeSteps; i++) {
			this._audioElement.volume = (fadeVolumeTo / fadeSteps) * (i + 1);
			await new Promise<void>((res) => {
				new Timeout(() => {
					return res();
				}, 100);
			});
		}
	}
}
