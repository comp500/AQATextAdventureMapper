import { html, render } from "lit-html";

export default class FloorSelector {
	selectEl = document.getElementById("map-floor-select");
	value = 1;
	enabled = true;

	constructor(public minValue: number, public maxValue: number, public onChange: (floor: number) => void) {
		this.selectEl.classList.remove("is-hidden");
		this.render();
	}

	render() {
		render(
			html`
				<a class="button" ?disabled=${this.value <= this.minValue} @click=${this.decrement.bind(this)}>Go down</a>
				<span class="button is-static">Floor ${this.value}</span>
				<a class="button" ?disabled=${this.value >= this.maxValue} @click=${this.increment.bind(this)}>Go up</a>
			`,
			this.selectEl
		);
	}

	increment() {
		if (this.value >= this.maxValue) {
			return;
		}
		this.value++;
		this.render();
		this.onChange(this.value);
	}

	decrement() {
		if (this.value <= this.minValue) {
			return;
		}
		this.value--;
		this.render();
		this.onChange(this.value);
	}
}
