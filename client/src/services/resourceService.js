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

	async getDrafts() {
		const res = await this.fetch(
			`${ResourceService.ENDPOINT}?${new URLSearchParams({ drafts: true })}`
		);
		if (res.ok) {
			const resources = await res.json();
			return resources.filter(({ draft }) => draft);
		}
		return [];
	}

	async getResources() {
		const res = await this.fetch(ResourceService.ENDPOINT);
		if (!res.ok) {
			throw new Error(res.statusText);
		}
		return res.json();
	}

	async publish(id) {
		const res = await this.fetch(`${ResourceService.ENDPOINT}/${id}`, {
			body: JSON.stringify({ draft: false }),
			headers: { "Content-Type": "application/json" },
			method: "PATCH",
		});
		if (res.ok) {
			return res.json();
		}
	}
}
