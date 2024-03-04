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
	const finalResources = allResources
		? allResources.slice((page - 1) * perPage, page * perPage)
		: [];

	return (
		<section>
			<ResourceList resources={finalResources ?? []} />
			<Pagination lastPage={lastPage ?? 1} />
		</section>
	);
}

export default Home;
