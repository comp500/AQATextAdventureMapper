function readString(buffer: ArrayBuffer, offset: number) {
	let strLength = new DataView(buffer).getUint16(offset);
	return new TextDecoder("utf-8").decode(buffer.slice(offset + 2, offset + strLength + 2));
}

class Place {
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

	static parse(buffer: ArrayBuffer) {
		let view = new DataView(buffer);
		let numPlaces = view.getInt32(0);
		let places: Place[] = [];

		let offset = 4;
		for (let i = 0; i < numPlaces; i++) {
			let id = view.getInt32(offset);
			offset += 4;
			let desc = readString(buffer, offset);
			offset += desc.length + 2;

			places[i] = new Place(
				desc,
				id,
				view.getInt32(offset),
				view.getInt32(offset + 4),
				view.getInt32(offset + 8),
				view.getInt32(offset + 12),
				view.getInt32(offset + 16),
				view.getInt32(offset + 20),
			);
			offset += 24;
		}

		return places;
	}
}

class Character {
	constructor(public name: string, public description: string, public id: number, public currentLocation: number) {}
}

class Item {
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

export default class SaveParser {}
