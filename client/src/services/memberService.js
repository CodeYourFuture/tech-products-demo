export default class MemberService {
	static ENDPOINT = "/api/users";

	constructor(request = fetch) {
		this.fetch = request;
	}

	async getUserById(id) {
		let result = {
			data: undefined,
			error: undefined,
		};

		try {
			let response = await this.fetch(`${MemberService.ENDPOINT}/${id}`);

			if (response?.ok) {
				result.data = await response.json();
			} else {
				result.error = `error with status ${response?.status}`;
			}
		} catch (error) {
			let fetchError = new Error("error in fetch");
			fetchError.data = { name: "user servicer", desc: error };

			result.error = fetchError;
		}

		return result;
	}
}
