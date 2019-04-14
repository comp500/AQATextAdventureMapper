import SaveParser from "./SaveParser";
import { html, render, TemplateResult } from "lit-html";

if (File && FileReader && FileList && Blob) {
	// Great success! All the File APIs are supported.
} else {
	alert("The File APIs are not fully supported in this browser.");
	render(
		html`
			ohno
		`,
		document.getElementById("error")
	);
}

render(
	html`
		test
	`,
	document.getElementById("error")
);

console.log(SaveParser(new ArrayBuffer(100)));
