export default class TopicService {
	static ENDPOINT = "/api/topics";

	constructor(request = fetch) {
		this.fetch = request;
	}
	async getTopics() {
		try {
			const res = await this.fetch(TopicService.ENDPOINT);
			return res.ok ? res.json() : [];
		} catch (error) {
			return undefined;
		}
	}
}
