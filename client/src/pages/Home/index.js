import { useEffect, useState } from "react";

import { Pagination, ResourceList } from "../../components";
import { useSearchParams } from "../../hooks";
import { ResourceService, useService } from "../../services";

export function Home() {
	const resourceService = useService(ResourceService);
	const searchParams = useSearchParams();
	const [{ lastPage, resources } = {}, setEnvelope] = useState();

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams]);

	return (
		<section>
			<ResourceList resources={resources ?? []} pathname="/" />
			<Pagination lastPage={lastPage ?? 1} />
		</section>
	);
}

export default Home;
