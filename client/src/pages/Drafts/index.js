import { useCallback, useEffect, useState } from "react";

import { ResourceService, useService } from "../../services";

import DraftList from "./DraftList";

export default function Drafts() {
	const [drafts, setDrafts] = useState([]);
	const resourceService = useService(ResourceService);

	const refreshDrafts = useCallback(async () => {
		setDrafts(await resourceService.getDrafts());
	}, [resourceService]);

	const publish = useCallback(
		async (id) => {
			await resourceService.publish(id);
			await refreshDrafts();
		},
		[refreshDrafts, resourceService]
	);

	useEffect(() => {
		refreshDrafts();
	}, [refreshDrafts]);

	return (
		<>
			<h2>Drafts</h2>
			<p>Review resources that have been submitted but not yet published.</p>
			<section>
				<DraftList publish={publish} resources={drafts} />
			</section>
		</>
	);
}
