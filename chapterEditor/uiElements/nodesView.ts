import { ChapterNode } from "../../src/databases/chapter/chapterNode";
import { AudioRepo } from "../repos/audioRepo";
import { NodesRepo } from "../repos/nodesRepo";
import { NodeRow } from "./nodeRow";

export class NodesView {
	private static _rootElement: HTMLDivElement;
	private static _container: HTMLDivElement;
	private static _nodeRows: NodeRow[] = [];

	static init(rootElement: HTMLDivElement) {
		this._rootElement = rootElement;

		NodesRepo.onNodesUpdated(() => {
			this.refreshDisplay();
		});

		AudioRepo.onVoicesChanged(() => {
			this.refreshDisplay();
		});

		window.addEventListener("keyup", (event: KeyboardEvent) => {
			// console.log(event.code);
			if (event.code === "NumpadAdd") {
				this.insertNodeAt(NodesRepo.nodes.length);
			}
		});
	}

	private static refreshDisplay(newNodeIndex?: number) {
		if (this._container) {
			this._container.remove();
		}

		this._container = document.createElement("div");
		this._rootElement.appendChild(this._container);
		this._nodeRows.length = 0;

		NodesRepo.nodes.forEach((node, nodeIndex: number) =>
			this.addNodeToDisplay(node, nodeIndex, nodeIndex === newNodeIndex),
		);
	}

	private static addNodeToDisplay(node: ChapterNode, nodeIndex: number, focus: boolean) {
		const nodeRow = new NodeRow(
			node,
			nodeIndex,
			() => this.refreshDisplay(),
			(insertAtIndex) => this.insertNodeAt(insertAtIndex),
			(removeAtIndex) => this.removeNodeAt(removeAtIndex),
			focus,
		);
		this._container.appendChild(nodeRow.getElement());
		this._nodeRows.push(nodeRow);
	}

	private static removeNodeAt(removeAtIndex: any) {
		NodesRepo.removeNodeAt(removeAtIndex);
		this.refreshDisplay();
	}

	private static insertNodeAt(index: any) {
		NodesRepo.insertNodeAt(index);
		this.refreshDisplay(index);
		this._nodeRows[index].scrollIntoView();
	}
}
