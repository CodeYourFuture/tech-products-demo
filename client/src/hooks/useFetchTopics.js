import { useState, useEffect } from "react";

import { TopicService, useService } from "../services";

export function useFetchTopics() {
	const topicService = useService(TopicService);
	const [topics, setTopics] = useState([]);

	useEffect(() => {
		const fetchTopics = async () => {
			try {
				const fetchedTopics = await topicService.getTopics();
				setTopics(fetchedTopics);
			} catch (error) {
				throw new Error("Error fetching topics");
			}
		};

		fetchTopics();
	}, [topicService]);

	return topics;
}
