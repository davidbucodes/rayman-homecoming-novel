export class Button {
	private _button: HTMLButtonElement;

	init(
		text: string,
		parentElement: HTMLDivElement,
		onClickCallback: () => void,
		accesskey?: string,
	) {
		this.createButtonElement(text, parentElement, accesskey);

		this._button.onclick = onClickCallback;
		this._button.onkeyup = onClickCallback;
	}

	private createButtonElement(text: string, parentElement: HTMLDivElement, accesskey?: string) {
		const button = document.createElement("button");
		button.innerText = text;

		if (accesskey) {
			button.setAttribute("accesskey", accesskey);
		}

		parentElement.appendChild(button);
		this._button = button;
	}
}
