export default class UserService {
	static ENDPOINT = "/api/users";

	constructor(request = fetch) {
		this.fetch = request;
	}

	async getByUser(id) {
		const res = await this.fetch(`${UserService.ENDPOINT}/${id}`);
		if (res.ok) {
			const { resources, ...rest } = await res.json();
			return { ...rest, resources: resources.map(this._revive.bind(this)) };
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
