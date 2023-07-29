import { useEffect, useState } from "react";

import { useResourceService } from "../../services";

export default function ResourceList() {
	const resourceService = useResourceService();
	const [resources, setResources] = useState([]);

	useEffect(() => {
		resourceService
			.getResources()
			.then(setResources)
			.catch(() => {});
	}, [resourceService]);

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
