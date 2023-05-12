import { Config } from "./config";
import { languageDatabase } from "../databases/language";
import { LanguageId } from "../databases/identifiers/languageId";
import { GameEvent, GameEvents } from "../events/gameEvents";
import { KeyboardKeyId } from "../events/keyboardEvents";

export interface SettingsButtonConfig {
	type: "button";
	label: Record<LanguageId, string>;
	keyboardKey: KeyboardKeyId;
	onClick: () => unknown;
}

interface SettingsConfig<T> {
	text: Record<LanguageId, string>;
	keyboardKey: KeyboardKeyId;
	value: T;
}

export interface SettingsGroupConfig<T = unknown> {
	isSelected(value: T): boolean;
	type: "group";
	label: Record<LanguageId, string>;
	options: Array<SettingsConfig<T>>;
	onClick: (selectedValue: T) => unknown;
}

type MenuSettingsConfig = Array<SettingsGroupConfig | SettingsButtonConfig>;

export const menuSettingsConfig: MenuSettingsConfig = [
	{
		type: "group",
		onClick(value: boolean) {
			Config.update({
				backgroundMute: value,
			});
		},
		isSelected(value) {
			return Config.options.backgroundMute === value;
		},
		label: {
			"ja-JP": "Mute",
			"en-US": "Mute",
			"he-IL": "השתקה",
		},
		options: [
			{
				keyboardKey: KeyboardKeyId.J,
				text: {
					"ja-JP": "はい",
					"en-US": "Yes",
					"he-IL": "כן",
				},
				value: true,
			},
			{
				keyboardKey: KeyboardKeyId.E,
				text: {
					"ja-JP": "いえ",
					"en-US": "No",
					"he-IL": "לא",
				},
				value: false,
			},
		],
	},
	{
		type: "group",
		onClick(selectedLanguageId: LanguageId) {
			Config.update({
				language: selectedLanguageId as LanguageId,
			});
		},
		isSelected(value) {
			return Config.options.language === value;
		},
		label: {
			"ja-JP": "言語",
			"en-US": "Language",
			"he-IL": "שפה",
		},
		options: [
			{
				keyboardKey: KeyboardKeyId.J,
				text: languageDatabase[LanguageId.jaJP].displayName,
				value: LanguageId.jaJP,
			},
			{
				keyboardKey: KeyboardKeyId.E,
				text: languageDatabase[LanguageId.enUS].displayName,
				value: LanguageId.enUS,
			},
			{
				keyboardKey: KeyboardKeyId.H,
				text: languageDatabase[LanguageId.heIL].displayName,
				value: LanguageId.heIL,
			},
		],
	},
	{
		type: "group",
		onClick(value: boolean) {
			Config.update({
				autoplayDialog: value,
			});
		},
		isSelected(value: boolean) {
			return Config.options.autoplayDialog === value;
		},
		label: {
			"ja-JP": "Autoplay",
			"en-US": "Autoplay",
			"he-IL": "הפעלה אוטומטית",
		},
		options: [
			{
				keyboardKey: KeyboardKeyId.J,
				text: {
					"ja-JP": "はい",
					"en-US": "Yes",
					"he-IL": "כן",
				},
				value: true,
			},
			{
				keyboardKey: KeyboardKeyId.E,
				text: {
					"ja-JP": "いえ",
					"en-US": "No",
					"he-IL": "לא",
				},
				value: false,
			},
		],
	},
	{
		type: "button",
		keyboardKey: KeyboardKeyId.M,
		onClick() {
			alert("何なんだてめえ…");
		},
		label: {
			"ja-JP": "ダビド",
			"en-US": "David",
			"he-IL": "דוד",
		},
	},
	{
		type: "button",
		keyboardKey: KeyboardKeyId.M,
		onClick() {
			GameEvents.emitEvent(GameEvent.MenuClosed);
		},
		label: {
			"ja-JP": "メニューを閉めて",
			"en-US": "Close menu",
			"he-IL": "סגירת התפריט",
		},
	},
];
