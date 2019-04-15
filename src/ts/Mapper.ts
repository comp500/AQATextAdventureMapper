import { Save } from "./SaveParser";
import InfoRenderer from "./InfoRenderer";
import FloorSelector from "./FloorSelector";

export default class Mapper {
	canvas = <HTMLCanvasElement>document.getElementById("map-canvas");
	ctx: CanvasRenderingContext2D;
	infoRenderer: InfoRenderer;
	floor = 0;
	floorSelector: FloorSelector;

	constructor(public save: Save) {
		this.ctx = this.canvas.getContext("2d");
		this.infoRenderer = new InfoRenderer(save);
		// TODO get floor min/max
		this.floorSelector = new FloorSelector(0, 1, this.setFloor.bind(this));

		document.getElementById("mapper-panel").classList.remove("is-hidden");

		this.infoRenderer.select(save.places[0]);
		this.render();
	}

	render() {
		if (this.ctx != null) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
		// TODO filter for floor
		this.save.places.map(place => place.renderCanvas(this.ctx, this.save));
	}

	cleanup() {
		document.getElementById("mapper-panel").classList.add("is-hidden");
		this.floorSelector.enabled = false;
	}

	setFloor(floor: number) {
		this.floor = floor;
		this.render();
	}
}
