import { getElementId } from "../elementId";

export class MultiSelect<T extends string> {
	private _inputContainer: HTMLDivElement;

	constructor(
		fieldName: string,
		options: T[],
		onChangeCallback: (selectedOptions: T[]) => void,
		defaultValues?: T[],
	) {
		const id = getElementId(fieldName);
		const select = document.createElement("select");
		select.id = id;
		select.setAttribute("multiple", "true");

		const label = document.createElement("label");
		label.setAttribute("for", id);
		label.innerText = `${fieldName}: `;

		options.forEach((optionText) => {
			const option = document.createElement("option");
			option.innerText = optionText;
			option.value = optionText;

			if (defaultValues?.includes(optionText)) {
				option.selected = true;
			}

			select.appendChild(option);
		});

		select.onchange = () => {
			const { selectedOptions } = select;

			onChangeCallback([...(selectedOptions || [])].map((option) => option.value as T));
		};

		this._inputContainer = document.createElement("div");

		this._inputContainer.appendChild(label);
		this._inputContainer.appendChild(select);
	}

	getElement() {
		return this._inputContainer;
	}
}
