import SaveParser from "./SaveParser";
import { html, render, TemplateResult } from "lit-html";

if (File && FileReader && FileList && Blob) {
	document.getElementById("save-input").addEventListener("change", e => {
		let files = (<HTMLInputElement>e.target).files;
		if (files.length > 0) {
			document.getElementById("save-input-parent").classList.add("has-name");
			let nameEl = document.getElementById("save-input-name");
			nameEl.classList.remove("is-hidden");
			nameEl.innerText = files[0].name;

			let reader = new FileReader();
			reader.onload = () => {
				console.log(SaveParser(<ArrayBuffer>reader.result));
			};
			reader.onerror = () => {
				document.getElementById("error-parent").classList.remove("is-hidden");
				render(
					html`
						<strong>There was an error reading the file: </strong><br />${reader.error}
					`,
					document.getElementById("error")
				);
			};

			reader.readAsArrayBuffer(files[0]);
		}
	});
} else {
	alert("The File APIs are not fully supported in this browser, so this website will not work!");
}
