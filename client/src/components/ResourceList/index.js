import { useState, useMemo } from "react";

import { Pagination } from "../../components";
import {
	useFetchPublishedResources,
	usePagination,
	useFetchTopics,
} from "../../hooks";
import { formatUrl } from "../../utils/utils";

import "./ResourceList.scss";
import TopicSelector from "./TopicSelector";

export default function ResourceList() {
	const [selectedTopic, setSelectedTopic] = useState(undefined);

	const topics = useFetchTopics();
	const { perPage, page, allResources } = useFetchPublishedResources();
	const filteredResources = useMemo(() => {
		if (!selectedTopic) {
			return allResources;
		}
		return allResources.filter(({ topic }) => topic === selectedTopic);
	}, [allResources, selectedTopic]);

	const displayedResources = usePagination(filteredResources, page, perPage);
	const calculatedLastPage = filteredResources
		? Math.ceil(filteredResources.length / perPage)
		: 1;

	return (
		<>
			<div>
				{topics && (
					<TopicSelector setSelectedTopic={setSelectedTopic} topics={topics} />
				)}
			</div>

			<ul className="resource-list">
				{displayedResources.length === 0 && (
					<li className="no-resources">
						<em>No resources to show.</em>
					</li>
				)}
				{displayedResources.map(
					({ description, id, title, topic_name, url }) => (
						<li key={id}>
							<div>
								<h3>{title}</h3>
								{topic_name && <span className="topic">{topic_name}</span>}
							</div>
							{description && <p>{description}</p>}
							<a href={url}>{formatUrl(url)}</a>
						</li>
					)
				)}
			</ul>
			<Pagination lastPage={calculatedLastPage ?? 1} />
		</>
	);
}
