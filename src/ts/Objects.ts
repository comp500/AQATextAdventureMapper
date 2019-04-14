export class GameObject {}

export class Place {
	constructor(
		public description: string,
		public id: number,
		public north: number,
		public east: number,
		public south: number,
		public west: number,
		public up: number,
		public down: number
	) {}
}

export class Character {
	constructor(public name: string, public description: string, public id: number, public currentLocation: number) {}
}

export class Item {
	constructor(
		public id: number,
		public location: number,
		public description: string,
		public status: string,
		public name: string,
		public commands: string,
		public results: string
	) {}
}
