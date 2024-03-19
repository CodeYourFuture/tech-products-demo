import { useEffect, useState } from "react";

import { ResourceService, useService } from "../services";

import { useSearchParams } from "./index";

export function useFetchPublishedResources(selectedTopic) {
	const resourceService = useService(ResourceService);
	const searchParams = useSearchParams();

	const [{ perPage, page, resources, lastPage } = {}, setEnvelope] = useState();

	useEffect(() => {
		// Merge selectedTopic with existing search parameters if present
		const updatedSearchParams = selectedTopic
			? { ...searchParams, topic: selectedTopic }
			: searchParams;

		resourceService.getPublished(updatedSearchParams).then(setEnvelope);
	}, [resourceService, searchParams, selectedTopic]);

	return { perPage, page, resources, lastPage };
}
