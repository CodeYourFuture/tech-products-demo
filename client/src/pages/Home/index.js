import { useEffect, useState } from "react";

import { Pagination, ResourceList } from "../../components";
import { useSearchParams } from "../../hooks";
import { useResourceService } from "../../services";

export function Home() {
	const resourceService = useResourceService();
	const searchParams = useSearchParams();
	const [{ lastPage, resources } = {}, setEnvelope] = useState();

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams]);

	return (
		<>
			<ResourceList resources={resources ?? []} />
			<Pagination lastPage={lastPage ?? 1} />
		</>
	);
}

export default Home;
