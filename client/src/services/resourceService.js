export default class ResourceService {
	static ENDPOINT = "/api/resources";

	constructor(request = fetch) {
		this.fetch = request;
	}

	async createResource(resource) {
		const res = await this.fetch(ResourceService.ENDPOINT, {
			body: JSON.stringify(resource),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});
		if (!res.ok) {
			throw new Error(res.statusText);
		}
		return res.json();
	}

	async getResources() {
		const res = await this.fetch(ResourceService.ENDPOINT);
		if (!res.ok) {
			throw new Error(res.statusText);
		}
		return res.json();
	}
}
