import { Save } from "./SaveParser";
import InfoRenderer from "./InfoRenderer";

export default class Mapper {
	canvas = <HTMLCanvasElement>document.getElementById("map-canvas");
	context: CanvasRenderingContext2D;
	infoRenderer = new InfoRenderer();

	constructor(public save: Save) {
		this.context = this.canvas.getContext("2d");

		document.getElementById("mapper-panel").classList.remove("is-hidden");
	}

	cleanup() {
		document.getElementById("mapper-panel").classList.add("is-hidden");
		if (this.context != null) {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
}
