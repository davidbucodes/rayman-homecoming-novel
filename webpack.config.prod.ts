import * as webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { resolve } from "path";
import "webpack-dev-server";
import { WebpackValidateYamlSchemaPlugin } from "./jsonSchemas/webpack-validate-yaml-schema-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const webpackConfig: webpack.Configuration = {
	mode: "production",
	entry: {
		main: "./src/index.ts",
	},
	cache: true,
	output: {
		path: resolve(__dirname, "dist"),
		filename: "[name].js",
		chunkFilename: "[name].chunk.js",
		sourceMapFilename: "[name].js.map",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js"],
	},
	module: {
		rules: [
			{
				test: /\.ya?ml$/,
				use: "yaml-loader",
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true,
				},
			},
		],
	},
	optimization: {
		splitChunks: {
			chunks: "all",
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
			title: "My Simulator",
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: resolve(__dirname, "./style.css"),
				},
				{
					from: resolve(__dirname, "./assets"),
					to: "./assets",
				},
				{
					from: resolve(__dirname, "./favicon.ico"),
				},
			],
		}),
		new WebpackValidateYamlSchemaPlugin(),
		new ForkTsCheckerWebpackPlugin(),
	],
	devtool: "source-map",
};
export default webpackConfig;
