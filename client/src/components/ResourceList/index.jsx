import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { BookmarkService, useService } from "../../services";
import BookmarkFlag from "../BookmarkFlag";

import "./ResourceList.scss";

export default function ResourceList({
	publish,
	resources,
	bookmarkedResources,
	setBookmarkedResources,
	onBookmarkToggle,
}) {
	const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState({});
	const bookmarkService = useService(BookmarkService);

	useEffect(() => {
		const ids = {};
		bookmarkedResources.forEach((bookmark) => {
			ids[bookmark.resource_id] = true;
		});
		setBookmarkedResourceIds(ids);
	}, [bookmarkedResources]);

	const handleToggleBookmark = async (resourceId) => {
		try {
			if (bookmarkedResourceIds[resourceId]) {
				await bookmarkService.removeBookmark(resourceId);
				setBookmarkedResourceIds((prev) => ({ ...prev, [resourceId]: false }));
				setBookmarkedResources((prev) =>
					prev.filter((bookmark) => bookmark.resource_id !== resourceId)
				);
				onBookmarkToggle(resourceId);
			} else {
				const newBookmark = await bookmarkService.addBookmark(resourceId);
				setBookmarkedResourceIds((prev) => ({ ...prev, [resourceId]: true }));
				setBookmarkedResources((prev) => [...prev, newBookmark]);
			}
		} catch (error) {
			throw error("Error toggling bookmark:", error);
		}
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
						backgroundColor: bookmarkedResourceIds[id] ? "#E1D7C6" : "white",
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
							color={bookmarkedResourceIds[id] ? "black" : "white"}
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
	bookmarkedResources: PropTypes.arrayOf(
		PropTypes.shape({
			resource_id: PropTypes.string.isRequired,
		})
	).isRequired,
	setBookmarkedResources: PropTypes.func.isRequired,
	onBookmarkToggle: PropTypes.func.isRequired,
};

function formatUrl(url) {
	const host = new URL(url).host;
	if (host.startsWith("www.")) {
		return host.slice(4);
	}
	return host;
}
