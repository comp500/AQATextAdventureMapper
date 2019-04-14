import { html, TemplateResult } from "lit-html";
import { Save } from "./SaveParser";

export class Position {
	constructor(public x: number, public y: number, public z: number) {}
}

function getSubObjects(id: number, save: Save): GameObject[] {
	return (<GameObject[]>save.items.filter(item => item.location == id)).concat(
		save.characters.filter(char => char.currentLocation == id)
	);
}

function sentenceCase(str: string) {
	return str[0].toUpperCase() + str.substr(1).toLowerCase();
}

export abstract class GameObject {
	public selected = false;

	abstract renderInfo(save: Save, isAncestor: boolean): TemplateResult;

	renderCanvas(ctx: CanvasRenderingContext2D, save: Save) {}

	//abstract getPosition(): Position
}

export class Place extends GameObject {
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
			<p><strong>Commands: </strong>${this.commands} -> ${this.results}</p>
			${subItems.length > 0
				? html`
						<p><strong>Contains: </strong></p>
				  `
				: html``}
			${subItems}
		`;
	}
}
