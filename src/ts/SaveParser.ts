function readString(buffer: ArrayBuffer, offset = new OffsetCounter()) {
	let offsetNum = offset.get();
	let strLength = new DataView(buffer).getUint16(offsetNum);
	offset.increment(strLength + 2);
	return new TextDecoder("utf-8").decode(buffer.slice(offsetNum + 2, offsetNum + strLength + 2));
}

class OffsetCounter {
	private offset = 0;
	increment(value = 1) {
		this.offset += value;
	}
	get() {
		return this.offset;
	}
	getAndIncrement(value = 1) {
		let origOffset = this.offset;
		this.offset += value;
		return origOffset;
	}
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

	static parse(buffer: ArrayBuffer, offset = new OffsetCounter()) {
		let view = new DataView(buffer);
		let numPlaces = view.getInt32(offset.getAndIncrement(4));
		let places: Place[] = [];

		for (let i = 0; i < numPlaces; i++) {
			let id = view.getInt32(offset.getAndIncrement(4));
			let desc = readString(buffer, offset);

			places[i] = new Place(
				desc,
				id,
				view.getInt32(offset.getAndIncrement(4)),
				view.getInt32(offset.getAndIncrement(4)),
				view.getInt32(offset.getAndIncrement(4)),
				view.getInt32(offset.getAndIncrement(4)),
				view.getInt32(offset.getAndIncrement(4)),
				view.getInt32(offset.getAndIncrement(4))
			);
		}

		return places;
	}
}

class Character {
	constructor(public name: string, public description: string, public id: number, public currentLocation: number) {}

	static parse(buffer: ArrayBuffer, offset = new OffsetCounter()) {
		let view = new DataView(buffer);
		let numChars = view.getInt32(offset.getAndIncrement(4));
		let characters: Character[] = [];

		for (let i = 0; i < numChars; i++) {
			let id = view.getInt32(offset.getAndIncrement(4));
			let name = readString(buffer, offset);
			let desc = readString(buffer, offset);

			characters[i] = new Character(name, desc, id, view.getInt32(offset.getAndIncrement(4)));
		}

		return characters;
	}
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

	static parse(buffer: ArrayBuffer, offset = new OffsetCounter()) {
		let view = new DataView(buffer);
		let numItems = view.getInt32(offset.getAndIncrement(4));
		let items: Item[] = [];

		for (let i = 0; i < numItems; i++) {
			let id = view.getInt32(offset.getAndIncrement(4));
			let desc = readString(buffer, offset);
			let status = readString(buffer, offset);
			let location = view.getInt32(offset.getAndIncrement(4));

			items[i] = new Item(
				id,
				location,
				desc,
				status,
				readString(buffer, offset),
				readString(buffer, offset),
				readString(buffer, offset)
			);
		}

		return items;
	}
}

class Save {
	constructor(public characters: Character[], public places: Place[], public items: Item[]) {}
}

export default function parse(buffer: ArrayBuffer) {
	let offset = new OffsetCounter();
	return new Save(Character.parse(buffer, offset), Place.parse(buffer, offset), Item.parse(buffer, offset));
}
