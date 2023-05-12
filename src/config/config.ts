import { GameEvent, GameEvents } from "../events/gameEvents";
import { LanguageId } from "../databases/identifiers/languageId";
import { ConfigEvents, ConfigEvent } from "../events/configEvents";

export interface ConfigOptions {
	backgroundMute: boolean;
	language: LanguageId;
	autoplayDialog: boolean;
}

export class Config {
	private static _options: ConfigOptions = {
		backgroundMute: false,
		language: LanguageId.jaJP,
		autoplayDialog: true,
	};

	static get options(): Readonly<ConfigOptions> {
		return Config._options;
	}

	static update(newConfig: Partial<ConfigOptions>) {
		const previousConfig: ConfigOptions = { ...Config._options };
		Object.assign(Config._options, newConfig);
		ConfigEvents.emitEvent(ConfigEvent.ConfigUpdated, { previousConfig });
	}
}
