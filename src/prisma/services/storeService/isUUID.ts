export default function isUUID(str: string): boolean {
	// Standard UUID format: 8-4-4-4-12 alphanumeric characters
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return uuidRegex.test(str);
}
