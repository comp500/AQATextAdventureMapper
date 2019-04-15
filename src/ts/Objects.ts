import { html, TemplateResult } from "lit-html";
import { Save } from "./SaveParser";
import InfoRenderer from "./InfoRenderer";
import { Container } from "@svgdotjs/svg.js";

export class Position {
	constructor(public x: number, public y: number, public z: number) {}
}

function getSubObjects(id: number, save: Save): GameObject[] {
	return (<GameObject[]>save.items.filter(item => item.location == id)).concat(
		save.characters.filter(char => char.currentLocation == id)
	);
}

function getObjectById(id: number, save: Save): GameObject | undefined {
	return (<GameObject[]>save.items).concat(save.places, save.characters).find(obj => obj.id == id);
}

function sentenceCase(str: string) {
	return str[0].toUpperCase() + str.substr(1).toLowerCase();
}

export abstract class GameObject {
	public selected = false;
	public id: number;

	abstract renderInfo(save: Save, isAncestor: boolean): TemplateResult;

	abstract renderDrawing(drawing: Container, save: Save, infoRenderer: InfoRenderer, redraw: () => void);

	//abstract getPosition(): Position
}

export class Place extends GameObject {
	public position = null;

	constructor(
		public description: string,
		public id: number,
		public north: number,
		public east: number,
		public south: number,
		public west: number,
		public up: number,
		public down: number
	) {
		super();
	}

	renderInfo(save: Save, isAncestor: boolean) {
		let subItems = getSubObjects(this.id, save)
			.map(obj => obj.renderInfo(save, false))
			.map(
				content =>
					html`
						<div class="box">${content}</div>
					`
			);

		return html`
			<p class="title ${isAncestor ? "is-4" : "is-6 is-marginless"} is-paddingless">Place</p>
			<p><strong>Description: </strong>${this.description}</p>
			${subItems.length > 0
				? html`
						<p><strong>Contains: </strong></p>
				  `
				: html``}
			${subItems}
		`;
	}

	resolvePositions(save: Save, newPos: Position) {
		if (this.position != null) {
			if (this.position.x != newPos.x || this.position.y != newPos.y || this.position.z != newPos.z) {
				throw new Error("Position already assigned, differs from existing!");
			}
			return;
		}
		this.position = newPos;

		let recursePosition = (obj: GameObject, pos: Position) => {
			if (obj != null && obj instanceof Place) {
				(<Place>obj).resolvePositions(save, pos);
			}
		};

		// Y is flipped as y goes downwards in canvas
		let posMap = {
			north: new Position(this.position.x, this.position.y - 1, this.position.z),
			east: new Position(this.position.x + 1, this.position.y, this.position.z),
			south: new Position(this.position.x, this.position.y + 1, this.position.z),
			west: new Position(this.position.x - 1, this.position.y, this.position.z),
			up: new Position(this.position.x, this.position.y, this.position.z + 1),
			down: new Position(this.position.x, this.position.y, this.position.z - 1)
		};

		recursePosition(getObjectById(this.north, save), posMap.north);
		recursePosition(getObjectById(this.east, save), posMap.east);
		recursePosition(getObjectById(this.south, save), posMap.south);
		recursePosition(getObjectById(this.west, save), posMap.west);
		recursePosition(getObjectById(this.up, save), posMap.up);
		recursePosition(getObjectById(this.down, save), posMap.down);

		(<Item[]>getSubObjects(this.id, save).filter(obj => obj != null && obj instanceof Item))
			.filter(item => item.status == "close" || item.status == "locked")
			.map(door => door.getOutputForCommand("open"))
			.filter(result => result != null)
			.forEach(result => {
				let split = result.split(",");
				let dir = split[0];
				let id = parseInt(split[1]);
				recursePosition(getObjectById(id, save), posMap[dir]);
			});
	}

	renderDrawing(drawing: Container, save: Save, infoRenderer: InfoRenderer, redraw: () => void) {
		let scale = 10;
		let box = drawing.rect(scale, scale).fill(infoRenderer.selected == this ? "blue" : "black");
		box.on("click", () => {
			infoRenderer.select(this);
			redraw();
		});
	}
}

export class Character extends GameObject {
	constructor(public name: string, public description: string, public id: number, public currentLocation: number) {
		super();
	}

	renderInfo(save: Save, isAncestor: boolean) {
		let subItems = getSubObjects(this.id, save)
			.map(obj => obj.renderInfo(save, false))
			.map(
				content =>
					html`
						<div class="box">${content}</div>
					`
			);
		let name = sentenceCase(this.name);

		return html`
			<p class="title ${isAncestor ? "is-4" : "is-6 is-marginless"} is-paddingless">Character: ${name}</p>
			<p><strong>Description: </strong>${this.description}</p>
			${subItems.length > 0
				? html`
						<p><strong>Holds: </strong></p>
				  `
				: html``}
			${subItems}
		`;
	}

	renderDrawing(drawing: Container, save: Save, infoRenderer: InfoRenderer, redraw: () => void) {
		throw new Error("Method not implemented.");
	}
}

export class Item extends GameObject {
	constructor(
		public id: number,
		public location: number,
		public description: string,
		public status: string,
		public name: string,
		public commands: string,
		public results: string
	) {
		super();
	}

	renderInfo(save: Save, isAncestor: boolean) {
		let subItems = getSubObjects(this.id, save)
			.map(obj => obj.renderInfo(save, false))
			.map(
				content =>
					html`
						<div class="box">${content}</div>
					`
			);
		let name = sentenceCase(this.name);

		return html`
			<p class="title ${isAncestor ? "is-4" : "is-6 is-marginless"} is-paddingless">Item: ${name}</p>
			<p><strong>Description: </strong>${this.description}</p>
			<p><strong>Status: </strong>${this.status}</p>
			<p><strong>Commands: </strong>${this.printCommands(save)}</p>
			${subItems.length > 0
				? html`
						<p><strong>Contains: </strong></p>
				  `
				: html``}
			${subItems}
		`;
	}

	getCommands(): { [key: string]: string } {
		let splitCommands = this.commands.split(",");
		let splitResults = this.results.split(";");
		let map = {} as { [key: string]: string };
		splitCommands.forEach((command, i) => {
			if (i >= splitResults.length) {
				i = splitResults.length - 1;
			}
			map[command] = splitResults[i];
		});
		return map;
	}

	getOutputForCommand(command: string) {
		return this.getCommands()[command];
	}

	static printCommand(command: string, result: string, save: Save): TemplateResult {
		command = sentenceCase(command);

		if (result.includes("lockunlock")) {
			let split = result.split(",");
			let unlocks = getObjectById(parseInt(split[1]), save);
			if (unlocks instanceof Item) {
				return html`<p>${command}: Locks/unlocks ${(<Item>unlocks).name}</p>`;
			} else {
				return html`<p>${command}: Locks/unlocks ${unlocks.id}</p>`;
			}
		}
		switch (command) {
			case "Open":
				return html`
					<p>Open: Open ${result.split(",")[0]} pathway</p>
				`;
			case "Close":
				return html`
					<p>Close: Close ${result.split(",")[0]} pathway</p>
				`;
			default:
				let split = result.split(",");
				if (split.length > 1 && split[0] == "say") {
					return html`
						<p>${command}: ${split[1]}</p>
					`;
				}
				if (result == "n/a") {
					result = "N/A";
				} else {
					result = sentenceCase(result);
				}
				return html`
					<p>${command}: ${result}</p>
				`;
		}
	}

	printCommands(save: Save) {
		let commands = this.getCommands();
		return html`
			${Object.keys(commands).map(command => Item.printCommand(command, commands[command], save))}
		`;
	}

	renderDrawing(drawing: Container, save: Save, infoRenderer: InfoRenderer, redraw: () => void) {
		throw new Error("Method not implemented.");
	}
}
