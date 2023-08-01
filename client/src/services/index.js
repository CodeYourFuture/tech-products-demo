import { useMemo } from "react";

import { useAuthenticatedFetch } from "../authContext";

import ResourceService from "./resourceService";
import TopicService from "./topicService";

export function useResourceService() {
	const authenticatedFetch = useAuthenticatedFetch();
	return useMemo(
		() => new ResourceService(authenticatedFetch),
		[authenticatedFetch]
	);
}

export function useTopicService() {
	const authenticatedFetch = useAuthenticatedFetch();
	return useMemo(
		() => new TopicService(authenticatedFetch),
		[authenticatedFetch]
	);
}
