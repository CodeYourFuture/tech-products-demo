export default class ResourceService {
	static ENDPOINT = "/api/resources";

	constructor(request = fetch) {
		this.fetch = request;
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

	async getPublished() {
		const res = await this.fetch(ResourceService.ENDPOINT);
		if (res.ok) {
			return res.json();
		}
		return [];
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

	async suggest(resource) {
		const res = await this.fetch(ResourceService.ENDPOINT, {
			body: JSON.stringify(resource),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});
		switch (res.status) {
			case 201:
				return res.json();
			case 409:
				throw new Error("a very similar resource already exists");
			default:
				throw new Error("something went wrong");
		}
	}
}
