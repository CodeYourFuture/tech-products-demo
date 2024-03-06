import { useMemo } from "react";

export function usePagination(resources, page, perPage) {
	const paginationStartIndex = (page - 1) * perPage;
	const paginationEndIndex = page * perPage;

	const displayedResources = useMemo(() => {
		return resources
			? resources.slice(paginationStartIndex, paginationEndIndex)
			: [];
	}, [resources, paginationStartIndex, paginationEndIndex]);

	return displayedResources;
}
