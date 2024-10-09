import { useEffect, useState } from "react";

const BookmarksPage = () => {
	const [bookmarks, setBookmarks] = useState([]);

	useEffect(() => {
		const fetchBookmarks = async () => {
			const response = await fetch("/api/bookmarks");
			const data = await response.json();
			setBookmarks(data);
		};

		fetchBookmarks();
	}, []);

	return (
		<div>
			<h2>Your Bookmarks</h2>
			<ul>
				{bookmarks.map((bookmark) => (
					<li key={bookmark.id}>
						<a href={bookmark.url}>{bookmark.title}</a>
					</li>
				))}
			</ul>
		</div>
	);
};

export default BookmarksPage;
