import {FormElement} from "./form-element.model";

export class FormTextElement implements FormElement{
  id: string;
  name: string;
  placeholder: string;
  type: string;
  value: string = "";
  class: string = "form-control";

  constructor(fields: {
    id: string;
    name?: string;
    placeholder?: string;
    type?: string;
    value?: string;
    class?: string;
  }) {
    if (fields) Object.assign(this, fields);
  }

  render() {
    let el = document.getElementById('form-elements');
    if(el) {
      let parent = document.createElement("div");
      let child = document.createElement("label");
      child.innerHTML = this.name;
      parent.appendChild(child);

      let child = document.createElement("input");
      child.setAttribute("placeholder", this.placeholder);
      child.setAttribute("class", this.class);
      child.setAttribute("value", this.value);
      parent.appendChild(child);

      el.appendChild(parent);
    }
  }
}
