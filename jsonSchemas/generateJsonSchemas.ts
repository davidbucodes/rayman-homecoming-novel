import { writeFileSync } from "fs";
import { resolve } from "path";
import * as TJS from "typescript-json-schema";

export const typesByFile: { [fileName: string]: string } = {
	"./src/databases/chapter/chapter.ts": "Chapter",
};

function camelize(text: string) {
	text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
	return text.substring(0, 1).toLowerCase() + text.substring(1);
}

export async function generateJsonSchemas() {
	console.log("Start generating JSON schemas...");

	const program = TJS.getProgramFromFiles(Object.keys(typesByFile).map((file) => resolve(file)));

	Object.values(typesByFile).forEach((typeName) => {
		const schema = TJS.generateSchema(program, typeName, {
			required: true,
			noExtraProps: true,
		});

		const stringifiedSchema = JSON.stringify(schema, null, 4).replace("anyOf", "oneOf");
		writeFileSync(__dirname + `/${camelize(typeName)}.json`, stringifiedSchema, {
			encoding: "utf8",
		});
	});

	console.log("Generated JSON schemas successfully");
}
