class Place {
	description: string;
	id: number;
	north: number;
	east: number;
	south: number;
	west: number;
	up: number;
	down: number;
}

class Character {
	name: string;
	description: string;
	id: number;
	currentLocation: number;
}

class Item {
	id: number;
	location: number;
	description: string;
	status: string;
	name: string;
	commands: string;
	results: string;
}

export default class SaveParser {}
