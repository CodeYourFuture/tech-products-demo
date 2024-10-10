import { useEffect, useState } from "react";

import { ResourceList } from "../../components";
import { useService } from "../../services";
import { BookmarkService, ResourceService } from "../../services";

const BookmarksPage = () => {
	const [bookmarkedResourcesList, setBookmarkedResourcesList] = useState([]);
	const [allBookmarks, setAllBookmarks] = useState([]);
	const bookmarkService = useService(BookmarkService);
	const resourceService = useService(ResourceService);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const allResourcesEnvelope = await resourceService.getPublished();
				const allResources = allResourcesEnvelope.resources;

				const bookmarks = await bookmarkService.getBookmarks();
				setAllBookmarks(bookmarks);

				const bookmarkedResources = allResources.filter((resource) =>
					bookmarks.some((bookmark) => bookmark.resource_id === resource.id)
				);
				setBookmarkedResourcesList(bookmarkedResources);
			} catch (error) {
				throw ("Error fetching bookmarks or resources:", error);
			}
		};

		fetchData();
	}, [bookmarkService, resourceService]);

	const handleBookmarkToggle = (resourceId) => {
		setBookmarkedResourcesList((prev) =>
			prev.filter((resource) => resource.id !== resourceId)
		);
	};

	return (
		<section>
			<h2>Your Bookmarked Resources</h2>
			{bookmarkedResourcesList.length > 0 ? (
				<ResourceList
					resources={bookmarkedResourcesList}
					bookmarkedResources={allBookmarks}
					setBookmarkedResources={setAllBookmarks}
					onBookmarkToggle={handleBookmarkToggle}
				/>
			) : (
				<p>You haven&apos;t bookmarked any resources yet.</p>
			)}
		</section>
	);
};

export default BookmarksPage;
