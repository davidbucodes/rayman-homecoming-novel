import * as webpack from "webpack";
import { resolve } from "path";
import "webpack-dev-server";
import prodWebpackConfig from "./webpack.config.prod";

const webpackConfig: webpack.Configuration = {
	...prodWebpackConfig,
	mode: "development",
	context: __dirname,
	output: {
		...prodWebpackConfig.output,
		publicPath: "http://192.168.31.192:9000/",
	},
	devServer: {
		static: {
			directory: resolve(__dirname, "./assets"),
			publicPath: "/assets",
		},
		compress: false,
		port: 9000,
		hot: false,
		open: true,
		liveReload: true,
	},
};
export default webpackConfig;
