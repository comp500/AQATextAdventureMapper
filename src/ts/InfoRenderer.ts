import { html, render, TemplateResult } from "lit-html";

export default class InfoRenderer {
	infoPanel = document.getElementById("info-panel");

	reset() {
		this.infoPanel.innerHTML = "";
		render(
			html`
				<p class="title is-4 is-paddingless">Select an item, character or place...</p>
			`,
			this.infoPanel
		);
	}

	constructor() {
		this.reset();
	}
}
