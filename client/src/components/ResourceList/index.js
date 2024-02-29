import PropTypes from "prop-types";
import { useEffect, useState, useMemo } from "react";

import { FormControls } from "../../components";
import { TopicService, useService } from "../../services";
import "./ResourceList.scss";

export default function ResourceList({
	publish,
	resources,
	allowTopicFiltering,
}) {
	const [selectedTopic, setSelectedTopic] = useState(undefined);
	const [topics, setTopics] = useState([]);
	const topicService = useService(TopicService);

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

	const displayResources = useMemo(() => {
		if (!selectedTopic) {
			return resources;
		}
		return resources.filter(({ topic }) => topic === selectedTopic);
	}, [resources, selectedTopic]);

	const handleChange = (event) => {
		setSelectedTopic(event.target.value);
	};

	return (
		<>
			{allowTopicFiltering && (
				<div>
					<FormControls.Select
						label="Filter Topic"
						placeholder="Select a topic"
						name="filter topic"
						options={topics}
						onChange={handleChange}
						className="custom-select"
					/>
				</div>
			)}
			<ul className="resource-list">
				{displayResources.length === 0 && (
					<li className="no-resources">
						<em>No resources to show.</em>
					</li>
				)}
				{displayResources.map(({ description, id, title, topic_name, url }) => (
					<li key={id}>
						<div>
							<h3>{title}</h3>
							{topic_name && <span className="topic">{topic_name}</span>}
						</div>
						{description && <p>{description}</p>}
						<div>
							<a href={url}>{formatUrl(url)}</a>
							{publish && <button onClick={() => publish(id)}>Publish</button>}
						</div>
					</li>
				))}
			</ul>
		</>
	);
}

ResourceList.propTypes = {
	publish: PropTypes.func,
	resources: PropTypes.arrayOf(
		PropTypes.shape({
			description: PropTypes.string,
			id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			topic_name: PropTypes.string,
			url: PropTypes.string.isRequired,
			topic: PropTypes.string,
		})
	).isRequired,
	allowTopicFiltering: PropTypes.bool,
};

function formatUrl(url) {
	const host = new URL(url).host;
	if (host.startsWith("www.")) {
		return host.slice(4);
	}
	return host;
}
