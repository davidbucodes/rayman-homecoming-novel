import { ChapterNodeTypeId } from "../src/databases/identifiers/chapterNodeTypeId";
import { BackgroundImageId } from "../src/databases/identifiers/backgroundImageId";
import { LanguageId } from "../src/databases/identifiers/languageId";
import { speakersDatabase } from "../src/databases/speaker";
import { NodesRepo } from "./repos/nodesRepo";
import { AudioRepo } from "./repos/audioRepo";
import { Button } from "./uiElements/basic/button";
import { NodesView } from "./uiElements/nodesView";
import { YamlFileInput } from "./uiElements/yamlInput";
import { getBase64ReadVoice } from "./voiceRecorder/voiceRecorder";
import { TextUtils } from "../src/views/text/textUtils";
import { ChapterNodeTypes } from "../src/databases/chapter/chapterNodeTypes";

const rootElement = document.getElementById("root") as HTMLDivElement;

YamlFileInput.init(rootElement);
new Button().init("Dump YAML", rootElement, saveNodes, "s");
new Button().init("Record all voices", rootElement, addVoices, "v");
NodesView.init(rootElement);

NodesRepo.set([
	{
		type: ChapterNodeTypeId.BackgroundImage,
		backgroundImage: BackgroundImageId.BandLand_1,
	},
]);

async function addVoices() {
	AudioRepo.reset();
	for (const node of NodesRepo.nodes) {
		if (node.type === ChapterNodeTypeId.Dialog) {
			await recordDialogNodeVoice(node);
		}
	}
}

export async function recordDialogNodeVoice(node: ChapterNodeTypes.Dialog) {
	for (const language of Object.values(LanguageId)) {
		const textToRead = TextUtils.formatTextForSpeak(node.text, language);

		if (!textToRead) {
			continue;
		}

		const audioData = await getBase64ReadVoice(
			language,
			textToRead,
			speakersDatabase[node.speaker],
			node.shouldSpeakSlow,
		);

		if (audioData && audioData.base64Audio.length > 10) {
			console.log(textToRead, audioData.base64Audio.length);
			node.audio ||= {};
			const previousAudioId = node.audio[language];
			node.audio[language] = audioData.id;
			AudioRepo.add(audioData);
			AudioRepo.remove(previousAudioId);
		}
	}
}

let isSaving = false;

async function saveNodes() {
	if (isSaving) {
		return;
	}
	isSaving = true;

	try {
		const nodesYaml = NodesRepo.yaml;
		const audioYaml = AudioRepo.yaml;
		const schemaReference = "# yaml-language-server: $schema=../../jsonSchemas/chapter.json";
		const yaml = [schemaReference, nodesYaml, audioYaml].join("\n");
		console.log(yaml);

		// create a new handle
		const newHandle = await window.showSaveFilePicker({
			types: [
				{
					accept: { "text/yaml": [".yaml"] },
					description: "YAML chapter nodes file",
				},
			],
			suggestedName: YamlFileInput.getSelectedFileName(),
		});

		// create a FileSystemWritableFileStream to write to
		const writableStream = await newHandle.createWritable();

		let blobData = new Blob([yaml], { type: "text/yaml" });

		// write our file
		await writableStream.write(blobData);

		// close the file and write the contents to disk.
		await writableStream.close();
	} catch (err) {
		console.error(err);
	} finally {
		isSaving = false;
	}
}
