import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Pagination, ResourceList } from "../../components";
import { useSearchParams } from "../../hooks";
import { ResourceService, useService, TopicService } from "../../services";

export function Home() {
	const resourceService = useService(ResourceService);
	const searchParams = useSearchParams();
	const [{ perPage, page, allResources } = {}, setEnvelope] = useState();
	const [topics, setTopics] = useState([]);
	const topicService = useService(TopicService);
	const [selectedTopic, setSelectedTopic] = useState(undefined);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchTopics = async () => {
			try {
				const fetchedTopics = await topicService.getTopics();
				setTopics(fetchedTopics);
			} catch (error) {
				throw new Error("Error fetching topics");
			}
		};

		fetchTopics();
	}, [topicService]);

	const filteredResources = useMemo(() => {
		if (!selectedTopic) {
			return allResources;
		}
		return allResources.filter(({ topic }) => topic === selectedTopic);
	}, [allResources, selectedTopic]);

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams, selectedTopic]);

	const paginationStartIndex = (page - 1) * perPage;
	const paginationEndIndex = page * perPage;
	const displayedResources = filteredResources
		? filteredResources.slice(paginationStartIndex, paginationEndIndex)
		: [];

	const calculatedLastPage = filteredResources
		? Math.ceil(filteredResources.length / perPage)
		: 1;
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
