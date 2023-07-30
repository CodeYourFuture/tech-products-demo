import PropTypes from "prop-types";

import "./ResourceList.scss";

export default function ResourceList({ publish, resources }) {
	if (resources.length === 0) {
		return <em>No resources to show.</em>;
	}
	return (
		<ul className="resource-list">
			{resources.map(({ description, id, title, url }) => (
				<li key={id}>
					<h3>
						<a href={url}>{title}</a>
					</h3>
					{description && <p>{description}</p>}
					{publish && <button onClick={() => publish(id)}>Publish</button>}
				</li>
			))}
		</ul>
	);
}

ResourceList.propTypes = {
	publish: PropTypes.func,
	resources: PropTypes.arrayOf(PropTypes.object).isRequired,
};
