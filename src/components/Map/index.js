import React, { Component } from 'react';
import ContentBox from '../../components/ContentBox';
import flagData from '../../data/flag1.json';
import Modesta from '../../data/Modesta';

//
//               Up     North
//               y    -z
//               |
//               |   /
//               |
//   West        | /
//   -x _ _ _ _ _|__________x
//              /           East
//             / |
//            /
//           /   |
//          /
//   South z     -y Down
//

class Map extends Component {
	constructor(props) {
		super(props);

		const links = [];
		const places = props.data.places
			.map((place) => {
				// Collect items that are in this place
				const items = props.data.items.filter(item => item.location === place.id);
				return Object.assign({}, place, {
					items
				})
			})
			.map((place) => {
				// Point to locations if the doors were open
				place.items
					.filter(item => item.commands === 'open,close')
					.forEach((item) => {
						const results = /(\w+),(\d+);/i.exec(item.results);
						place[results[1]] = Number.parseInt(results[2], 10);
					})
				
				return place;
			})
			.map((place) => {
				if (place.id === 1) {
					place.x = 0;
					place.y = 0;
					place.z = 0;
				} else {
					const link = links.find(link => place.id === link.id);
					if (link) {
						place.x = link.x;
						place.y = link.y;
						place.z = link.z;
					}
				}

				if (place.north) {
					links.push({
						x: place.x,
						y: place.y,
						z: place.z - 1,
						id: place.north
					})
				}

				if (place.east) {
					links.push({
						x: place.x + 1,
						y: place.y,
						z: place.z,
						id: place.east
					})
				}

				if (place.south) {
					links.push({
						x: place.x,
						y: place.y,
						z: place.z + 1,
						id: place.south
					})
				}

				if (place.west) {
					links.push({
						x: place.x - 1,
						y: place.y,
						z: place.z,
						id: place.west
					})
				}

				if (place.up) {
					links.push({
						x: place.x,
						y: place.y + 1,
						z: place.z,
						id: place.up
					})
				}

				if (place.down) {
					links.push({
						x: place.x,
						y: place.y - 1,
						z: place.z,
						id: place.down
					})
				}

				return place;
			})
			.map((place) => {
				place.items = place.items.map(item => item.id);
				return place;
			})
		
		this.state = {
			places
		}
	}
  render() {
		let minX = Infinity
		let minY = Infinity
		let minZ = Infinity
		let maxX = -Infinity
		let maxY = -Infinity
		let maxZ = -Infinity

		// Get the minimum and maximum X, Y and Z values
		this.state.places.forEach((place) => {
			minX = Math.min(minX, place.x);
			minY = Math.min(minY, place.y);
			minZ = Math.min(minZ, place.z);
			maxX = Math.max(maxX, place.x);
			maxY = Math.max(maxY, place.y);
			maxZ = Math.max(maxZ, place.z);
		});

		// Floors is an array of tables/floor
		// Floor is an array of table rows/strip
		// Strip is an array of table fields
		const floors = [];

		// Count from largest y to smallest y
		for (let yCounter = maxY; yCounter >= minY; yCounter--) {
			const floor = [];

			// Construct the header of the table
			const indexStrip = [];
			indexStrip.push(<th key="header"></th>)
			for (let xCounter = minX; xCounter <= maxX; xCounter++) {
				indexStrip.push(<th key={xCounter}>X = {xCounter}</th>)
			}
			
			// Construct the table within this Y level
			for (let zCounter = minZ; zCounter <= maxZ; zCounter++) {
				const strip = [];
				strip.push(<td key="header">z = {zCounter}</td>);
				for (let xCounter = minX; xCounter <= maxX; xCounter++) {
					const place = this.state.places.find(place => place.x === xCounter && place.y === yCounter && place.z === zCounter);
					if (place) {
						strip.push(<td key={xCounter}>{place.id}</td>)
					} else {
						strip.push(<td key={xCounter}>No Room</td>)
					}
				}
				floor.push(
					<tr key={zCounter}>
						{strip}
					</tr>
				);
			}
			floors.push(
				<ContentBox key={yCounter}>
					<h3>Y = {yCounter}</h3>
					<div className={Modesta.tableContainer}>
						<table>
							<thead>
								<tr>
									{indexStrip}
								</tr>
							</thead>
							<tbody>
								{floor}
							</tbody>
						</table>
					</div>
				</ContentBox>
			);
		}

    return floors;
  }
}

export default Map;
