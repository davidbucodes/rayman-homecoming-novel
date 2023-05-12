import yaml from "js-yaml";
import { Chapter } from "../../src/databases/chapter/chapter";
import { ChapterNode } from "../../src/databases/chapter/chapterNode";
import { AudioRepo } from "../repos/audioRepo";
import { NodesRepo } from "../repos/nodesRepo";

const INPUT_ELEMENT_ID = "fileInput";

export class YamlFileInput {
	private static _rootElement: HTMLDivElement;
	private static _fileInput: HTMLInputElement;
	private static _container: HTMLDivElement;

	static init(rootElement: HTMLDivElement) {
		this._rootElement = rootElement;
		this.createInputElements();

		this._fileInput.onchange = async () => {
			const file: File = this._fileInput.files[0];
			if (file) {
				const fileContent = await file.text();
				this.handleFile(fileContent);
			}
		};
	}

	static getSelectedFileName(): string {
		return this._fileInput?.files?.[0]?.name;
	}

	static handleFile(fileContent: string) {
		const parsedChapter = yaml.load(fileContent) as Chapter;
		AudioRepo.set(parsedChapter.audio);
		NodesRepo.set(parsedChapter.nodes);
	}

	private static createInputElements() {
		const input = document.createElement("input");
		input.id = INPUT_ELEMENT_ID;
		input.type = "file";

		const label = document.createElement("label");
		label.setAttribute("for", INPUT_ELEMENT_ID);
		label.innerText = "Load YAML file...";

		this._container = document.createElement("div");
		this._container.appendChild(input);
		this._container.appendChild(label);
		this._rootElement.appendChild(this._container);
		this._fileInput = input;
	}
}
