import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Pagination, ResourceList } from "../../components";
import { useSearchParams, usePagination, useFetchTopics } from "../../hooks";
import { ResourceService, useService, TopicService } from "../../services";

export function Home() {
	const resourceService = useService(ResourceService);
	const searchParams = useSearchParams();
	const [{ perPage, page, allResources } = {}, setEnvelope] = useState();

	const [selectedTopic, setSelectedTopic] = useState(undefined);
	const navigate = useNavigate();
	const topics = useFetchTopics(useService(TopicService));

	const filteredResources = useMemo(() => {
		if (!selectedTopic) {
			return allResources;
		}
		return allResources.filter(({ topic }) => topic === selectedTopic);
	}, [allResources, selectedTopic]);

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams, selectedTopic]);

	const calculatedLastPage = filteredResources
		? Math.ceil(filteredResources.length / perPage)
		: 1;
	const displayedResources = usePagination(filteredResources, page, perPage);
	const handleChange = (event) => {
		setSelectedTopic(event.target.value);
		navigate("/");
	};

	return (
		<section>
			<ResourceList
				resources={displayedResources ?? []}
				topics={topics}
				handleChange={handleChange}
			/>
			<Pagination lastPage={calculatedLastPage ?? 1} />
		</section>
	);
}

export default Home;
