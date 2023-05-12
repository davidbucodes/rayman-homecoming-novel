import glob from "glob";
import { readFileSync } from "fs";
import { join, resolve } from "path";
import * as Validator from "jsonschema";
import yaml from "js-yaml";
import { Compiler, WebpackError } from "webpack";
import { generateJsonSchemas, typesByFile } from "./generateJsonSchemas";

export class WebpackValidateYamlSchemaPlugin {
	private _isInitiated = false;

	apply(compiler: Compiler) {
		compiler.hooks.emit.tapPromise("WebpackValidateYamlSchemaPlugin", async (compilation) => {
			if (!this._isInitiated) {
				this._isInitiated = true;
				generateJsonSchemas();
			}
			await this.validateYamlFiles(compilation.errors);
		});
		compiler.hooks.watchRun.tapPromise(
			"WebpackValidateYamlSchemaPlugin",
			async (compilation) => {
				const filesDefiningJsonSchemas = Object.keys(typesByFile).map((file) =>
					resolve(file),
				);

				const modifiedFileRelatedToJsonSchema = [
					...new Set(compilation.modifiedFiles),
				].find((modifiedFile) => modifiedFile.includes("identifiers"));

				if (modifiedFileRelatedToJsonSchema) {
					console.log(
						`[WebpackValidateYamlSchemaPlugin] File related to identifiers changed, generating schemas. File changed: ${modifiedFileRelatedToJsonSchema}`,
					);
					generateJsonSchemas();
				}
			},
		);
	}
	async validateYamlFiles(errors: WebpackError[]) {
		const pattern = "../**/*.yaml";
		const yamlFilePaths = await this.glob(pattern);
		yamlFilePaths.forEach((yamlFilePath) => {
			const yamlContent = readFileSync(yamlFilePath, { encoding: "utf8" });
			const jsonContent = yaml.load(yamlContent);

			const schemaFilePath = yamlContent.match(/\$schema=(.*?)\r/);

			if (schemaFilePath) {
				const yamlFileFolder = yamlFilePath.split("/").slice(0, -1).join("/");
				const schemaContent = require(`${yamlFileFolder}/${schemaFilePath?.[1]}`);
				const result = Validator.validate(jsonContent, schemaContent);
				if (result.errors?.length) {
					result.errors.forEach((error) => {
						const webpackError = new WebpackError();
						webpackError.message = "Invalid YAML file structure.";
						webpackError.file = yamlFilePath;
						webpackError.details = error.stack;
						errors.push(webpackError);
					});
				}
			}
		});
	}

	private async glob(pattern: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			const patternAbsolutePath = join(__dirname, pattern).replace(/\\/g, "/");
			glob(patternAbsolutePath, (err, files) => {
				if (err) {
					return reject(err);
				}

				return resolve(files);
			});
		});
	}
}
