import SaveParser from "./SaveParser";
import { html, render, TemplateResult } from "lit-html";

render(html`test`, document.getElementById("hi"));

console.log(SaveParser(new ArrayBuffer(100)));