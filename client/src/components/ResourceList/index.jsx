import PropTypes from "prop-types";

import "./ResourceList.scss";

export default function ResourceList({ publish, resources, reject }) {
	return (
		<ul className="resource-list">
			{resources.length === 0 && (
				<li className="no-resources">
					<em>No resources to show.</em>
				</li>
			)}
			{resources.map(({ description, id, title, topic_name, url }) => (
				<li key={id}>
					<div>
						<h3>{title}</h3>
						{topic_name && <span className="topic">{topic_name}</span>}
					</div>
					{description && <p className="resource-description">{description}</p>}
					<div>
						<a href={url}>{formatUrl(url)}</a>
						{publish && <button onClick={() => publish(id)}>Publish</button>}
						{reject && <button onClick={() => reject(id)}>Reject</button>}
					</div>
				</li>
			))}
		</ul>
	);
}

ResourceList.propTypes = {
	publish: PropTypes.func,
	reject: PropTypes.func,
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
