import PropTypes from "prop-types";

import "./ResourceList.scss";

export default function ResourceList({
	showBadge = false,
	loading = false,
	totalCount = 0,
	loadMore,
	showMore,
	publish,
	resources,
}) {
	const noResource = totalCount === 0;
	const exceedResource = showMore >= totalCount;
	return (
		<ul className="resource-list">
			{noResource && (
				<li className="no-resources">
					<em>No resources to show.</em>
				</li>
			)}
			{resources
				?.slice(0, showMore ? showMore : totalCount)
				.map(({ description, draft, id, title, topic_name, url }) => (
					<li key={id}>
						{showBadge ? (
							draft ? (
								<h4>&#x2610; Draft</h4>
							) : (
								<h4>&#x2611; Published</h4>
							)
						) : (
							""
						)}
						<div>
							<h3>{title}</h3>
							{topic_name && <span className="topic">{topic_name}</span>}
						</div>
						{description && (
							<p className="resource-description">{description}</p>
						)}
						<div>
							<a href={url}>{formatUrl(url)}</a>
							{publish && draft && (
								<button onClick={() => publish(id)}>Publish</button>
							)}
						</div>
					</li>
				))}
			{!noResource && showMore && (
				<button onClick={loadMore} disabled={exceedResource ? "disabled" : ""}>
					{loading
						? "Loading..."
						: exceedResource
							? "No more to load"
							: "Load More"}
				</button>
			)}
		</ul>
	);
}

ResourceList.propTypes = {
	showBadge: PropTypes.bool,
	loading: PropTypes.bool,
	showMore: PropTypes.number,
	totalCount: PropTypes.number,
	loadMore: PropTypes.func,
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
