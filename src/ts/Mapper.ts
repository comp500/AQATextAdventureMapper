import { Save } from "./SaveParser";
import InfoRenderer from "./InfoRenderer";
import FloorSelector from "./FloorSelector";
import { Position, GameObject } from "./Objects";

export default class Mapper {
	canvas = <HTMLCanvasElement>document.getElementById("map-canvas");
	ctx: CanvasRenderingContext2D;
	infoRenderer: InfoRenderer;
	floor = 0;
	floorSelector: FloorSelector;
	private boundClickHandler = this.clickHandler.bind(this);

	constructor(public save: Save) {
		this.ctx = this.canvas.getContext("2d");
		this.infoRenderer = new InfoRenderer(save);
		this.canvas.addEventListener("click", this.boundClickHandler);

		// Resolve locations
		if (save.places.length > 0) {
			save.places[0].resolvePositions(save, new Position(0, 0, 0));
		}
		let floorMin = 0,
			floorMax = 0;
		save.places
			.filter(place => place.position != null)
			.forEach(place => {
				if (place.position.z > floorMax) {
					floorMax++;
				}
				if (place.position.z < floorMin) {
					floorMin--;
				}
			});
		this.floorSelector = new FloorSelector(floorMin, floorMax, this.setFloor.bind(this));

		document.getElementById("mapper-panel").classList.remove("is-hidden");

		this.infoRenderer.select(save.places[0]);
		this.render();
	}

	render() {
		if (this.ctx != null) {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
		this.save.places
			.filter(place => place.position != null && place.position.z == this.floor)
			.map(place => place.renderCanvas(this.ctx, this.save, this.infoRenderer.selected));
	}

	cleanup() {
		document.getElementById("mapper-panel").classList.add("is-hidden");
		this.floorSelector.enabled = false;
		this.canvas.removeEventListener("click", this.boundClickHandler);
	}

	setFloor(floor: number) {
		this.floor = floor;
		this.infoRenderer.select(null);
		this.render();
	}

	private clickHandler(e: MouseEvent) {
		let x = e.pageX - this.canvas.offsetLeft;
		let y = e.pageY - this.canvas.offsetTop;

		if (this.save != null) {
			console.log(e, x, y);
			let found = this.save.characters.find(char => char.wasClicked(x, y)) as GameObject;
			if (found == null) {
				found = this.save.items.find(item => item.wasClicked(x, y));
			}
			if (found == null) {
				found = this.save.places.find(place => place.wasClicked(x, y));
			}
			this.infoRenderer.select(found);
		}
	}
}
