import PropTypes from "prop-types";
import "./ResourceList.scss";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResourceList({ publish, resources }) {
	const [selectedTopic, setSelectedTopic] = useState("");

	const handleTopicChange = (event) => {
		setSelectedTopic(event.target.value);
	};

	const filteredResources = selectedTopic
		? resources.filter((resource) => resource.topic_name === selectedTopic)
		: resources;

	const uniqueTopics = [
		...new Set(
			resources.map((resource) => resource.topic_name).filter(Boolean)
		),
	];

	return (
		<div>
			<div className="filter">
				<label htmlFor="topic-filter">Filter by Topic: </label>
				<select
					id="topic-filter"
					value={selectedTopic}
					onChange={handleTopicChange}
				>
					<option value="">All Topics</option>
					{uniqueTopics.map((topic) => (
						<option key={topic} value={topic}>
							{topic}
						</option>
					))}
				</select>
			</div>

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
								<Link
									to={`/resdetails/${id}?title=${encodeURIComponent(title)}&topic_name=${encodeURIComponent(topic_name)}&description=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}`}
								>
									<h3>{title}</h3>
								</Link>
								{topic_name && <span className="topic">{topic_name}</span>}
							</div>
							{description && (
								<p className="resource-description">{description}</p>
							)}
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
		</div>
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
};

function formatUrl(url) {
	const host = new URL(url).host;
	if (host.startsWith("www.")) {
		return host.slice(4);
	}
	return host;
}
