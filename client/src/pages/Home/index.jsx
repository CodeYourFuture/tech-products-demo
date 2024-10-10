import { useEffect, useState } from "react";

import { Pagination, ResourceList } from "../../components";
import { useSearchParams } from "../../hooks";
import { ResourceService, BookmarkService, useService } from "../../services";

export function Home() {
	const resourceService = useService(ResourceService);
	const bookmarkService = useService(BookmarkService);
	const searchParams = useSearchParams();
	const [{ lastPage, resources } = {}, setEnvelope] = useState();
	const [bookmarkedResources, setBookmarkedResources] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const publishedResources =
					await resourceService.getPublished(searchParams);
				setEnvelope(publishedResources);

				const bookmarks = await bookmarkService.getBookmarks();
				setBookmarkedResources(bookmarks);
			} catch (error) {
				return error;
			}
		};

		fetchData();
	}, [resourceService, bookmarkService, searchParams]);

	return (
		<section>
			<ResourceList
				resources={resources ?? []}
				bookmarkedResources={bookmarkedResources ?? []}
				setBookmarkedResources={setBookmarkedResources}
			/>
			<Pagination lastPage={lastPage ?? 1} />
		</section>
	);
}

export default Home;
