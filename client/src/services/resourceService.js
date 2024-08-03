export default class ResourceService {
	static ENDPOINT = "/api/resources";

	constructor(request = fetch) {
		this.fetch = request;
	}

	async getDrafts() {
		const res = await this.fetch(
			`${ResourceService.ENDPOINT}?${new URLSearchParams({ draft: true })}`
		);
		if (res.ok) {
			const { resources } = await res.json();
			return resources.map(this._revive.bind(this));
		}
		return [];
	}

	async getOne(id) {
		const res = await this.fetch(`${ResourceService.ENDPOINT}/${id}`);
		if (res.ok) {
			return this._revive(await res.json());
		}
	}

	async getPublished({ page, perPage } = {}) {
		const res = await this.fetch(
			`${ResourceService.ENDPOINT}?${new URLSearchParams(
				Object.entries({ page, perPage }).filter(
					([, value]) => value !== undefined
				)
			)}`
		);
		if (res.ok) {
			const { resources, ...rest } = await res.json();
			return { ...rest, resources: resources.map(this._revive.bind(this)) };
		}
	}

	async publish(id) {
		const res = await this.fetch(`${ResourceService.ENDPOINT}/${id}`, {
			body: JSON.stringify({ draft: false }),
			headers: { "Content-Type": "application/json" },
			method: "PATCH",
		});
		if (res.ok) {
			return this._revive(await res.json());
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
				return this._revive(await res.json());
			case 409:
				throw new Error("a very similar resource already exists");
			default:
				throw new Error("something went wrong");
		}
	}

	_revive({ accession, publication, ...resource }) {
		return {
			...resource,
			accession: accession && new Date(accession),
			publication: publication && new Date(publication),
		};
	}
}
