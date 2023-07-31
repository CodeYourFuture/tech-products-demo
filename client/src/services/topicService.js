export default class TopicService {
	static ENDPOINT = "/api/topics";

	constructor(request = fetch) {
		this.fetch = request;
	}

	async getTopics() {
		const res = await this.fetch(TopicService.ENDPOINT);
		if (res.ok) {
			return res.json();
		}
	}
}
