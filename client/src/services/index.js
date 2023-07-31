import { useCallback, useMemo } from "react";

import { useLogout } from "../authContext";

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

/**
 * If the user is not authenticated, clear the principal.
 * @returns {typeof fetch}
 */
function useAuthenticatedFetch() {
	const logout = useLogout();
	return useCallback(
		async (...args) => {
			const res = await fetch(...args);
			if (res.status === 401) {
				logout();
			}
			return res;
		},
		[logout]
	);
}
