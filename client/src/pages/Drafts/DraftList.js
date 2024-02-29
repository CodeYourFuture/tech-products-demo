import PropTypes from "prop-types";

import "../../components/ResourceList/ResourceList.scss";
import { formatUrl } from "../../utils/utils";
export default function DraftList({ publish, resources }) {
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
					{description && <p>{description}</p>}
					<div>
						<a href={url}>{formatUrl(url)}</a>
						{publish && <button onClick={() => publish(id)}>Publish</button>}
					</div>
				</li>
			))}
		</ul>
	);
}

DraftList.propTypes = {
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
