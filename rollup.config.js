import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

export default {
	input: "./src/ts/index.ts",
	plugins: [
		typescript(),
		resolve({
			module: true
		}),
		babel({
			presets: ["@babel/preset-env"]
		})
	],
	output: {
		file: "./src/index.js",
		format: "iife"
	}
};