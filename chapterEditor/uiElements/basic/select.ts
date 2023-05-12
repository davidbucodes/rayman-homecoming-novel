import { getElementId } from "../elementId";

export class Select<T extends string> {
	private _inputContainer: HTMLDivElement;

	constructor(
		fieldName: string,
		options: T[],
		onChangeCallback: (selectedOption: T) => void,
		defaultValue?: T,
		allowEmptyValue = false,
	) {
		const id = getElementId(fieldName);
		const select = document.createElement("select");
		select.id = id;

		const label = document.createElement("label");
		label.setAttribute("for", id);
		label.innerText = `${fieldName}: `;

		if (allowEmptyValue) {
			options.unshift("" as T);
		}

		options.forEach((optionText) => {
			const option = document.createElement("option");
			option.innerText = optionText;
			option.value = optionText;
			select.appendChild(option);
		});

		select.onchange = () => {
			const { value } = select;
			onChangeCallback(value as T);
		};

		if (defaultValue) {
			select.value = defaultValue;
		}

		this._inputContainer = document.createElement("div");

		this._inputContainer.appendChild(label);
		this._inputContainer.appendChild(select);
	}

	getElement() {
		return this._inputContainer;
	}
}
