import { Save } from "./SaveParser";
import InfoRenderer from "./InfoRenderer";

export default class Mapper {
	canvas = <HTMLCanvasElement>document.getElementById("map-canvas");
	ctx: CanvasRenderingContext2D;
	infoRenderer: InfoRenderer;

	constructor(public save: Save) {
		this.ctx = this.canvas.getContext("2d");
		this.infoRenderer = new InfoRenderer(save);

		document.getElementById("mapper-panel").classList.remove("is-hidden");

		this.infoRenderer.select(save.places[0]);
		this.render();
	}

	render() {
		
	}

	cleanup() {
		document.getElementById("mapper-panel").classList.add("is-hidden");
		if (this.ctx != null) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
}
