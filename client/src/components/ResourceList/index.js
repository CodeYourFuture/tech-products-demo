import PropTypes from "prop-types";

import { FormControls } from "../../components";
import { formatUrl } from "../../utils/utils";
import "./ResourceList.scss";

export default function ResourceList({ resources, handleChange, topics }) {
	return (
		<>
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
						<a href={url}>{formatUrl(url)}</a>
					</li>
				))}
			</ul>
		</>
	);
}

ResourceList.propTypes = {
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
	topics: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})
	).isRequired,
	handleChange: PropTypes.func,
};
