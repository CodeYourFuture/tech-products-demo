import React, { useEffect, useState } from "react";

import { Pagination, ResourceList } from "../../components";
import { useSearchParams } from "../../hooks";
import { ResourceService, useService } from "../../services";

const Home = () => {
	const resourceService = useService(ResourceService);
	const searchParams = useSearchParams();
	const [{ lastPage, resources } = {}, setEnvelope] = useState({});

	const storedPageSize = localStorage.getItem("pageSizePreference");
	let initialPageSize;

	try {
		initialPageSize = storedPageSize ? JSON.parse(storedPageSize) : "default";
	} catch (error) {
		// Handle the error as needed
		initialPageSize = "default";
		throw new Error("Error parsing page size preference:", error);
	}

	const [pageSize, setPageSize] = useState(initialPageSize);

	// This function is to save the selected page-size into local storage
	const savePageSizePreference = (pageSize) => {
		localStorage.setItem("pageSizePreference", JSON.stringify(pageSize));
	};

	useEffect(() => {
		// Using the selected page size in my API request
		resourceService
			.getPublished({ ...searchParams, pageSize })
			.then(setEnvelope)
			.catch((error) => {
				// Handle the error from the API request as needed
				throw new Error("Error fetching published resources:", error);
			});
	}, [resourceService, searchParams, pageSize]);

	return (
		<section>
			{/* Create the UI for page size selection */}
			<label htmlFor="pageSize">Page Size: </label>
			<select
				id="pageSize"
				value={pageSize}
				onChange={(e) => {
					const selectedPageSize = e.target.value;
					setPageSize(selectedPageSize);
					savePageSizePreference(selectedPageSize);
				}}
			>
				<option value="default">Default</option>
				<option value="small">Small</option>
				<option value="large">Large</option>
			</select>

			<ResourceList resources={resources || []} />
			<Pagination lastPage={lastPage || 1} />
		</section>
	);
};

export default Home;
