import { useEffect, useState } from "react";

import { ResourceService, useService } from "../services";

import { useSearchParams } from "./index";

export function useFetchPublishedResources() {
	const resourceService = useService(ResourceService);
	const searchParams = useSearchParams();

	const [{ perPage, page, allResources } = {}, setEnvelope] = useState();

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams]);

	return { perPage, page, allResources };
}
