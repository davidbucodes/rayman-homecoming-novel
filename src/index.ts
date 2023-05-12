import "../global";
import { chapterDatabase } from "./databases/chapter";
import { ChapterId } from "./databases/identifiers/chapterId";
import { GameEvents, GameEvent } from "./events/gameEvents";
import { Music } from "./sound/music";
import { App } from "./views/app/app";
import { ChapterView } from "./views/chapter/chapterView";
import { ChapterSelectView } from "./views/chapterSelect/chapterSelectView";
import { MenuPopup } from "./views/configMenu/menuPopup";
import { FontFamily, FontLoader } from "./views/loaders/fontLoader";
import { LoadingView } from "./views/loading/loadingView";

type StartType = "chapter" | "chapterSelect" | "loading" | "menuPopup";

async function startGame() {
	await FontLoader.load(FontFamily.Rayman);

	const start: StartType = (() => "chapterSelect" as StartType)();

	switch (start) {
		case "chapterSelect": {
			chapterSelect();
			break;
		}
		case "loading": {
			await loadingView();
			break;
		}
		case "chapter": {
			chapter(ChapterId.BetillasGarden);
			break;
		}
		case "menuPopup": {
			menuPopup();
			break;
		}
	}
}

startGame();

function chapterSelect() {
	new ChapterSelectView({
		parentContainer: App.mainContainer,
	});
}

function chapter(chapter: ChapterId) {
	new ChapterView({
		parentContainer: App.mainContainer,
		chapterData: chapterDatabase[chapter],
		useVoice: true,
	});
}

async function loadingView() {
	const loadingView = new LoadingView({
		parentContainer: App.mainContainer,
	});
	await loadingView.init();
}

async function menuPopup() {
	const menuPopup = new MenuPopup({
		parentContainer: App.popupContainer,
		mainBackgroundMusic: new Music(),
	});
	await menuPopup.init();
	GameEvents.emitEvent(GameEvent.OpenMenuPopup);
}
