import * as webpack from "webpack";
import { resolve } from "path";
import "webpack-dev-server";
import CopyWebpackPlugin from "copy-webpack-plugin";

const webpackConfig: webpack.Configuration = {
	mode: "development",
	entry: {
		main: "./index.ts",
	},
	context: __dirname,
	cache: true,
	output: {
		path: resolve(__dirname, "dist"),
		filename: "[name].js",
	},
	resolve: {
		extensions: [".ts", ".js"],
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
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: resolve(__dirname, "./index.html"),
				},
				{
					from: resolve(__dirname, "./style.css"),
				},
				{
					from: resolve(__dirname, "./favicon.ico"),
				},
			],
		}),
	],
	devtool: "source-map",
	devServer: {
		static: {
			directory: resolve(__dirname, "../assets"),
			publicPath: "/assets",
		},
		compress: false,
		port: 3000,
		hot: false,
		open: true,
		liveReload: true,
	},
};
export default webpackConfig;
