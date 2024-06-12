import PropTypes from "prop-types";
import "./ResourceList.scss";
import { Link } from "react-router-dom";

export default function ResourceList({ publish, resources }) {
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
						<Link
							to={`/resdetails/${id}?title=${encodeURIComponent(title)}&topic_name=${encodeURIComponent(topic_name)}&description=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}`}
						>
							<h3>{title}</h3>
						</Link>
						{topic_name && <span className="topic">{topic_name}</span>}
					</div>
					{description && <p className="resource-description">{description}</p>}
					<div>
						<a href={url}>{formatUrl(url)}</a>
						{publish && <button onClick={() => publish(id)}>Publish</button>}
					</div>
				</li>
			))}
		</ul>
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
