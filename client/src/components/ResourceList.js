import PropTypes from "prop-types";

export default function ResourceList({ resources }) {
	return (
		<ul>
			{resources.map(({ description, id, title, url }) => (
				<li key={id}>
					<a href={url}>{title}</a>
					{description && ` - ${description}`}
				</li>
			))}
		</ul>
	);
}

ResourceList.propTypes = {
	resources: PropTypes.arrayOf(PropTypes.object).isRequired,
};
