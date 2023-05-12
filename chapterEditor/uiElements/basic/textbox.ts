export class Textbox {
	private _inputContainer: HTMLDivElement;

	constructor(
		fieldName: string,
		onChangeCallback: (newValue: string) => void,
		defaultValue?: string,
		lang?: string,
		focus = false,
	) {
		const input = document.createElement("input");
		input.setAttribute("type", "text");
		input.placeholder = fieldName;

		const span = document.createElement("span");
		span.innerText = `${fieldName}: `;

		input.onchange = () => {
			const { value } = input;
			onChangeCallback(value);
		};

		if (defaultValue) {
			input.value = defaultValue;
		}

		if (lang) {
			input.setAttribute("lang", lang);
		}
		this._inputContainer = document.createElement("div");

		this._inputContainer.appendChild(span);
		this._inputContainer.appendChild(input);

		if (focus) {
			setTimeout(() => {
				input.focus();
			}, 0);
		}
	}

	getElement() {
		return this._inputContainer;
	}
}
