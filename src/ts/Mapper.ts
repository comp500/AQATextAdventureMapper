import { Save } from "./SaveParser";
import InfoRenderer from "./InfoRenderer";
import FloorSelector from "./FloorSelector";
import { Position, GameObject } from "./Objects";
import { SVG, Svg } from "@svgdotjs/svg.js";

export default class Mapper {
	drawing: Svg;
	infoRenderer: InfoRenderer;
	floor = 0;
	floorSelector: FloorSelector;

	constructor(public save: Save) {
		this.infoRenderer = new InfoRenderer(save);
		this.drawing = SVG().addTo("#map-svg");

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
		this.drawAll();
	}

	drawAll() {
		this.drawing.clear();
		this.save.places
			.filter(place => place.position != null && place.position.z == this.floor)
			.map(place => {
				let nest = this.drawing.group();
				place.renderDrawing(nest, this.save, this.infoRenderer, this.drawAll.bind(this));
				let scale = 10;
				nest.move((place.position.x + 5) * scale * 2, (place.position.y + 5) * scale * 2);
			});
	}

	cleanup() {
		document.getElementById("mapper-panel").classList.add("is-hidden");
		this.floorSelector.enabled = false;
	}

	setFloor(floor: number) {
		this.floor = floor;
		this.infoRenderer.select(null);
		this.drawing.clear();
		this.drawAll();
	}
}
