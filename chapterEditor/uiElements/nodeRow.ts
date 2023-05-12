import { ChapterNode } from "../../src/databases/chapter/chapterNode";
import { ChapterNodeTypeId } from "../../src/databases/identifiers/chapterNodeTypeId";
import { BackgroundImageNode } from "./rowTypes/backgroundImageNode";
import { DecisionsNode } from "./rowTypes/decisionsNode";
import { DialogNode } from "./rowTypes/dialogNode";
import { MusicNode } from "./rowTypes/musicNode";
import { SoundNode } from "./rowTypes/soundNode";
import { SpeakersNode } from "./rowTypes/speakersNode";
import { Select } from "./basic/select";
import { ChapterNodeTypes } from "../../src/databases/chapter/chapterNodeTypes";
import { BackgroundImageId } from "../../src/databases/identifiers/backgroundImageId";
import { SpeakerId } from "../../src/databases/identifiers/speakerId";
import { MusicId } from "../../src/databases/identifiers/musicId";
import { SoundId } from "../../src/databases/identifiers/soundId";
import { Button } from "./basic/button";
import { FilterNode } from "./rowTypes/filterNode";

export type NodeTypeChangedCallback = () => void;
export type InsertNodeCallback = (insertAtIndex: number) => void;
export type RemoveNodeCallback = (removeAtIndex: number) => void;

export class NodeRow {
	private _container: HTMLDivElement;

	constructor(
		node: ChapterNode,
		nodeIndex: number,
		onNodeTypeChangedCallback: NodeTypeChangedCallback,
		onInsertNodeCallback: InsertNodeCallback,
		onRemoveNodeCallback: RemoveNodeCallback,
		focus = false,
	) {
		this._container = document.createElement("div");
		this._container.classList.add("node-row");
		this._container.classList.add(node.type);

		new Button().init("Add", this._container, () => {
			onInsertNodeCallback(nodeIndex + 1);
		});

		new Button().init("Remove", this._container, () => {
			onRemoveNodeCallback(nodeIndex);
		});

		const select = new Select(
			"type",
			Object.values(ChapterNodeTypeId),
			(newType) => {
				Object.keys(node).forEach((key) => delete (node as any)[key]);
				node.type = newType;
				this.initNode(node);
				onNodeTypeChangedCallback();
			},
			node.type,
		).getElement();

		this._container.appendChild(select);

		switch (node.type) {
			case ChapterNodeTypeId.BackgroundImage: {
				const backgroundImageNode = new BackgroundImageNode(node).getElement();
				this._container.appendChild(backgroundImageNode);
				break;
			}
			case ChapterNodeTypeId.Decisions: {
				const decisionsNode = new DecisionsNode(node).getElement();
				this._container.appendChild(decisionsNode);
				break;
			}
			case ChapterNodeTypeId.Dialog: {
				const dialogNode = new DialogNode(node, focus).getElement();
				this._container.appendChild(dialogNode);
				break;
			}
			case ChapterNodeTypeId.Music: {
				const musicNode = new MusicNode(node).getElement();
				this._container.appendChild(musicNode);
				break;
			}
			case ChapterNodeTypeId.Sound: {
				const soundNode = new SoundNode(node).getElement();
				this._container.appendChild(soundNode);
				break;
			}
			case ChapterNodeTypeId.Speakers: {
				const speakersNode = new SpeakersNode(node).getElement();
				this._container.appendChild(speakersNode);
				break;
			}
			case ChapterNodeTypeId.Filter: {
				const filterNode = new FilterNode(node).getElement();
				this._container.appendChild(filterNode);
				break;
			}
		}
	}

	initNode(node: ChapterNode) {
		switch (node.type) {
			case ChapterNodeTypeId.BackgroundImage: {
				Object.assign(node, {
					backgroundImage: BackgroundImageId.BandLand_1,
				} as ChapterNodeTypes.BackgroundImage);
				break;
			}
			case ChapterNodeTypeId.Decisions: {
				Object.assign(node, {
					decisions: [],
					decisionsTitle: "DecisionsTitle",
				} as ChapterNodeTypes.Decisions);
				break;
			}
			case ChapterNodeTypeId.Dialog: {
				Object.assign(node, {
					speaker: SpeakerId.Rayman,
					text: {
						"en-US": "Text",
						"he-IL": "טקסט",
						"ja-JP": "テキスト",
					},
				} as ChapterNodeTypes.Dialog);
				break;
			}
			case ChapterNodeTypeId.Music: {
				Object.assign(node, {
					musicId: MusicId.AnimalLife,
				} as ChapterNodeTypes.Music);
				break;
			}
			case ChapterNodeTypeId.Sound: {
				Object.assign(node, {
					soundId: SoundId.Yeah,
				} as ChapterNodeTypes.Sound);
				break;
			}
			case ChapterNodeTypeId.Speakers: {
				Object.assign(node, {
					left: [],
					right: [],
				} as ChapterNodeTypes.Speakers);
				break;
			}
		}
	}

	getElement() {
		return this._container;
	}

	remove() {
		this._container.remove();
	}

	scrollIntoView() {
		setTimeout(() => {
			this._container.scrollIntoView({
				behavior: "auto",
				block: "center",
				inline: "center",
			});
			this._container.classList.add("highlight");
		}, 30);
	}
}
