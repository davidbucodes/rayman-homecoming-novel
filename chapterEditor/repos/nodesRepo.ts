import yaml from "js-yaml";
import { Chapter } from "../../src/databases/chapter/chapter";
import { ChapterNode } from "../../src/databases/chapter/chapterNode";
import { ChapterNodeTypeId } from "../../src/databases/identifiers/chapterNodeTypeId";
import { ChapterNodeTypes } from "../../src/databases/chapter/chapterNodeTypes";
import { SpeakerId } from "../../src/databases/identifiers/speakerId";

export class NodesRepo {
	private static onNodesUpdatedCallbacks: Array<() => void> = [];

	private static _nodes: ChapterNode[] = [];

	static set(nodes: ChapterNode[]) {
		this._nodes = nodes;
		this.onNodesUpdatedCallbacks.forEach((callback) => callback());
	}

	static get nodes(): ChapterNode[] {
		return this._nodes;
	}

	static get yaml(): string {
		const objectToDump: Partial<Chapter> = { nodes: this._nodes };
		const yamlContent = yaml.dump(objectToDump, {
			indent: 2,
		});
		return yamlContent;
	}

	static onNodesUpdated(callback: () => void) {
		this.onNodesUpdatedCallbacks.push(callback);
	}

	static removeNodeAt(removeAtIndex: any) {
		this._nodes.splice(removeAtIndex, 1);
	}

	static insertNodeAt(index: any) {
		const newNode: ChapterNodeTypes.Dialog = {
			type: ChapterNodeTypeId.Dialog,
			speaker: SpeakerId.Rayman,
			text: {
				"en-US": "Text",
				"he-IL": "טקסט",
				"ja-JP": "テキスト",
			},
		};
		this._nodes.splice(index, 0, newNode);
		return newNode;
	}
}
