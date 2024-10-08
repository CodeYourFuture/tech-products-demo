import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

import "./ResourceList.scss";
import BookmarkFlag from "../BookmarkFlag";

export default function ResourceList({ publish, resources }) {
	const [bookmarkedResources, setBookmarkedResources] = useState({});

	const handleToggleBookmark = (id) => {
		setBookmarkedResources((prevBookmarks) => ({
			...prevBookmarks,
			[id]: !prevBookmarks[id], // Toggle the bookmark state for this specific resource
		}));
	};

	return (
		<ul className="resource-list">
			{resources.length === 0 && (
				<li className="no-resources">
					<em>No resources to show.</em>
				</li>
			)}
			{resources.map(({ description, id, title, topic_name, url }) => (
				<li
					key={id}
					style={{
						backgroundColor: bookmarkedResources[id] ? "#E1D7C6" : "white",
						border: "1px solid #333",
						borderRadius: "4px",
						padding: "16px",
					}}
				>
					<div>
						<h3>
							<Link to={`/resource/${id}`}>{title}</Link>
						</h3>
						{topic_name && <span className="topic">{topic_name}</span>}
					</div>
					{description && <p className="resource-description">{description}</p>}
					<div>
						<a href={url}>{formatUrl(url)}</a>
						{publish && <button onClick={() => publish(id)}>Publish</button>}
						<BookmarkFlag
							color={bookmarkedResources[id] ? "black" : "white"}
							stroke="black"
							onClick={() => handleToggleBookmark(id)}
						/>
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
