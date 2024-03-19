import { useState } from "react";

import { Pagination } from "../../components";
import { useFetchPublishedResources, useFetchTopics } from "../../hooks";
import { formatUrl } from "../../utils/utils";

import "./ResourceList.scss";
import TopicSelector from "./TopicSelector";

export default function ResourceList() {
	const [selectedTopic, setSelectedTopic] = useState(undefined);
	const topics = useFetchTopics();
	const { lastPage, resources } = useFetchPublishedResources(selectedTopic);

	return (
		<>
			<div>
				{topics && (
					<TopicSelector setSelectedTopic={setSelectedTopic} topics={topics} />
				)}
			</div>

			<ul className="resource-list">
				{resources && resources.length === 0 && (
					<li className="no-resources">
						<em>No resources to show.</em>
					</li>
				)}
				{resources &&
					resources.map(({ description, id, title, topic_name, url }) => (
						<li key={id}>
							<div>
								<h3>{title}</h3>
								{topic_name && <span className="topic">{topic_name}</span>}
							</div>
							{description && <p>{description}</p>}
							<a href={url}>{formatUrl(url)}</a>
						</li>
					))}
			</ul>
			<Pagination lastPage={lastPage ?? 1} />
		</>
	);
}
