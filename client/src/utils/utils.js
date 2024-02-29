// Shared function to format URL
export function formatUrl(url) {
	const host = new URL(url).host;
	if (host.startsWith("www.")) {
		return host.slice(4);
	}
	return host;
}
