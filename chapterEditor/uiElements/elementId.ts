export function generateId() {
	return Math.random().toString(16).slice(2);
}

export function getElementId(fieldName: string) {
	return `${fieldName.replace(/ /g, "")}${generateId()}`;
}
