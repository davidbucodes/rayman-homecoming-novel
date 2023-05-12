import { getElementId } from "../elementId";

export class Checkbox {
	private _inputContainer: HTMLDivElement;

	constructor(
		fieldName: string,
		onChangeCallback: (selectedOption: boolean) => void,
		defaultValue?: boolean,
	) {
		const id = getElementId(fieldName);
		const input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		input.id = id;

		const label = document.createElement("label");
		label.setAttribute("for", id);
		label.innerText = `${fieldName}: `;

		input.onchange = () => {
			const { checked } = input;
			onChangeCallback(checked);
		};

		if (defaultValue) {
			input.setAttribute("checked", String(defaultValue));
		}

		this._inputContainer = document.createElement("div");

		this._inputContainer.appendChild(label);
		this._inputContainer.appendChild(input);
	}

	getElement() {
		return this._inputContainer;
	}
}
