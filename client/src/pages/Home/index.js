import { useEffect, useState } from "react";

import { Pagination, ResourceList } from "../../components";
import { useSearchParams } from "../../hooks";
import { ResourceService, useService } from "../../services";

export function Home() {
	const resourceService = useService(ResourceService);
	const searchParams = useSearchParams();
	const [{ lastPage, perPage, page, allResources } = {}, setEnvelope] =
		useState();

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams]);
	const paginationStartIndex = (page - 1) * perPage;
	const paginationEndIndex = page * perPage;
	const displayedResources = allResources
		? allResources.slice(paginationStartIndex, paginationEndIndex)
		: [];

	return (
		<section>
			<ResourceList resources={displayedResources ?? []} />
			<Pagination lastPage={lastPage ?? 1} />
		</section>
	);
}

export default Home;
