import { ChapterNode } from "../../databases/chapter/chapterNode";
import { ChapterNodeTypeId } from "../../databases/identifiers/chapterNodeTypeId";
import { DialogUI } from "./dialogUI";

export interface ChapterNodesEngine {
	handleChapterNode: (ui: DialogUI, node: ChapterNode) => Promise<void>;
}

const handleChapterNode = async (ui: DialogUI, node: ChapterNode): Promise<void> => {
	switch (node.type) {
		case ChapterNodeTypeId.Dialog: {
			await ui.displayDialog(node);
			break;
		}
		case ChapterNodeTypeId.BackgroundImage: {
			await ui.setScene(node);
			break;
		}
		case ChapterNodeTypeId.Music: {
			await ui.startMusic(node);
			break;
		}
		case ChapterNodeTypeId.Sound: {
			await ui.startSound(node);
			break;
		}
		case ChapterNodeTypeId.Speakers: {
			await ui.displaySpeakers(node);
			break;
		}
		case ChapterNodeTypeId.Filter: {
			await ui.setFilter(node);
			break;
		}
		case ChapterNodeTypeId.Decisions: {
			await ui.promptChoices(node);
			break;
		}
	}
};

export const chapterNodesEngine: ChapterNodesEngine = {
	handleChapterNode,
};
