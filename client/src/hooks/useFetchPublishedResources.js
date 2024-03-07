import { useEffect, useState } from "react";

import { ResourceService, useService } from "../services";

import { useSearchParams } from "./index";

export function useFetchPublishedResources() {
	const resourceService = useService(ResourceService);
	const searchParams = useSearchParams();

	const [envelope, setEnvelope] = useState({
		perPage: 10,
		page: 1,
		allResources: [],
	});

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams]);

	return envelope;
}
