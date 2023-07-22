export const createResource = async (resource) => {
	const res = await fetch("/api/resources", {
		body: JSON.stringify(resource),
		headers: { "Content-Type": "application/json" },
		method: "POST",
	});
	if (!res.ok) {
		throw new Error(res.statusText);
	}
	return res.json();
};
