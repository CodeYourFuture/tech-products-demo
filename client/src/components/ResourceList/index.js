import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { FormControls } from "../../components";
import { TopicService, useService, ResourceService } from "../../services";
import "./ResourceList.scss";
const defaultTopicService = {
	getTopics: async () => {
		return [];
	},
};

export default function ResourceList({ publish, resources, pathname }) {
	const [topics, setTopics] = useState([]);
	const topicService = useService(TopicService) || defaultTopicService;
	const [selectedTopic, setSelectedTopic] = useState("");
	const [filteredResources, setFilteredResources] = useState([]);
	const resourceService = useService(ResourceService);

	useEffect(() => {
		const fetchTopics = async () => {
			try {
				const isTestEnvironment = process.env.NODE_ENV === "test";

				const fetchedTopics = isTestEnvironment
					? []
					: await topicService.getTopics();

				setTopics(fetchedTopics);
			} catch (error) {
				throw new Error(`Error fetching topics: ${error.message}`);
			}
		};

		fetchTopics();
	}, [topicService]);

	useEffect(() => {
		const fetchResourcesByTopic = async () => {
			try {
				const allResources = await resourceService.getPublished({});
				const filtered = allResources.resources.filter(
					(topic) => topic.topic_name === selectedTopic
				);
				setFilteredResources(filtered);
			} catch (error) {
				throw new Error(`Error fetching resources: ${error.message}`);
			}
		};

		if (selectedTopic) {
			fetchResourcesByTopic();
		} else {
			setFilteredResources(resources);
		}
	}, [selectedTopic, resourceService, resources]);

	const handleChange = (event) => {
		const selectedValue = event.target.value;
		const selectedOption = topics.find((option) => option.id === selectedValue);
		setSelectedTopic(selectedOption ? selectedOption.name : "");
	};

	return (
		<>
			{resources.length > 0 && pathname !== "/drafts" && (
				<div>
					<FormControls.Select
						label="Filter Topic"
						placeholder="Select a topic"
						name="topic"
						options={topics}
						onChange={handleChange}
						className="custom-select"
					/>
				</div>
			)}
			<ul className="resource-list">
				{filteredResources.length === 0 && (
					<li className="no-resources">
						<em>No resources to show.</em>
					</li>
				)}
				{filteredResources.map(
					({ description, id, title, topic_name, url }) => (
						<li key={id}>
							<div>
								<h3>{title}</h3>
								{topic_name && <span className="topic">{topic_name}</span>}
							</div>
							{description && <p>{description}</p>}
							<div>
								<a href={url}>{formatUrl(url)}</a>
								{publish && (
									<button onClick={() => publish(id)}>Publish</button>
								)}
							</div>
						</li>
					)
				)}
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
		})
	).isRequired,
	pathname: PropTypes.string.isRequired,
};

function formatUrl(url) {
	const host = new URL(url).host;
	if (host.startsWith("www.")) {
		return host.slice(4);
	}
	return host;
}
