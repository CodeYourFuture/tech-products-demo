import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export function useFetchPublishedResources(resourceService, searchParams) {
	const [{ perPage, page, allResources } = {}, setEnvelope] = useState();

	useEffect(() => {
		resourceService.getPublished(searchParams).then(setEnvelope);
	}, [resourceService, searchParams]);

	return { perPage, page, allResources };
}
useFetchPublishedResources.propTypes = {
	resourceService: PropTypes.object.isRequired,
	searchParams: PropTypes.object.isRequired,
};
