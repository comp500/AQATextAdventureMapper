import { html, render, TemplateResult } from "lit-html";
import { GameObject } from "./Objects";
import { Save } from "./SaveParser";

export default class InfoRenderer {
	infoPanel = document.getElementById("info-panel");
	selected: GameObject = null;

	reset() {
		this.selected = null;
		render(this.renderContent(), this.infoPanel);
	}

	private renderContent() {
		let content: TemplateResult;
		if (this.selected == null) {
			content = html`<p class="title is-4 is-paddingless">Select an item, character or place...</p>`;
		} else {
			content = this.selected.renderInfo(this.save, true);
		}

		return html`${content}`;
	}

	select(selection: GameObject) {
		this.selected = selection;
		render(this.renderContent(), this.infoPanel);
	}

	constructor(public save: Save) {
		this.reset();
	}
}
