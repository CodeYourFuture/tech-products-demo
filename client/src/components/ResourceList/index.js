import PropTypes from "prop-types";

import "./ResourceList.scss";

export default function ResourceList({ publish, resources }) {
	if (resources.length === 0) {
		return <em>No resources to show.</em>;
	}
	return (
		<ul className="resource-list">
			{resources.map(({ description, id, title, topic_name, url }) => (
				<li key={id}>
					<div>
						<h3>
							<a href={url}>{title}</a>
						</h3>
						{topic_name && <span className="topic">{topic_name}</span>}
					</div>
					{description && <p>{description}</p>}
					{publish && (
						<div>
							<button onClick={() => publish(id)}>Publish</button>
						</div>
					)}
				</li>
			))}
		</ul>
	);
}

ResourceList.propTypes = {
	publish: PropTypes.func,
	resources: PropTypes.arrayOf(PropTypes.object).isRequired,
};
