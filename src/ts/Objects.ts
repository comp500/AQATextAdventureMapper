import { html, TemplateResult } from "lit-html";

export abstract class GameObject {
	abstract renderInfo(): TemplateResult
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

	renderInfo() {
		return html`Place selected!`;
	}
}

export class Character extends GameObject {
	constructor(public name: string, public description: string, public id: number, public currentLocation: number) {
		super();
	}

	renderInfo() {
		return html`Character selected!`;
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

	renderInfo() {
		return html`Item selected!`;
	}
}
