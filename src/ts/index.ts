import parseSave, { Save } from "./SaveParser";
import { html, render, TemplateResult } from "lit-html";
import Mapper from "./Mapper";

if (File && FileReader && FileList && Blob) {
	let currentMapper = null;

	let displayError = (err: string) => {
		document.getElementById("error-parent").classList.remove("is-hidden");
		render(
			html`
				<strong>There was an error reading the file: </strong><br />${err}
			`,
			document.getElementById("error")
		);
	};

	document.getElementById("save-input").addEventListener("change", e => {
		let files = (<HTMLInputElement>e.target).files;
		if (files.length > 0) {
			document.getElementById("save-input-parent").classList.add("has-name");
			let nameEl = document.getElementById("save-input-name");
			nameEl.classList.remove("is-hidden");
			nameEl.innerText = files[0].name;

			let reader = new FileReader();
			reader.onload = () => {
				if (currentMapper != null) {
					currentMapper.cleanup();
				}
				let save: Save = null;
				try {
					save = parseSave(<ArrayBuffer>reader.result);
				} catch (e) {
					displayError(e);
				}
				if (save != null) {
					currentMapper = new Mapper(save);
				}
			};
			reader.onerror = () => {
				displayError(reader.error.toString());
			};

			reader.readAsArrayBuffer(files[0]);
		}
	});
} else {
	alert("The File APIs are not fully supported in this browser, so this website will not work!");
}
