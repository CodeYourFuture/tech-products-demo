import { useMemo } from "react";

import { useAuthenticatedFetch } from "../authContext";

export { default as ResourceService } from "./resourceService";
export { default as BookmarkService } from "./bookmarkService";
export { default as TopicService } from "./topicService";

/**
 * Inject the authenticated fetch wrapper into the specified service.
 * @template T
 * @param {{new (fetcher: typeof fetch): T}} Service
 * @returns {T}
 */
export function useService(Service) {
	const authenticatedFetch = useAuthenticatedFetch();
	return useMemo(() => {
		return new Service(authenticatedFetch);
	}, [authenticatedFetch, Service]);
}
