import { useEffect, useState } from "react";

import { getResources } from "../../services/resourceService";

export default function ResourceList() {
	const [resources, setResources] = useState([]);

	useEffect(() => {
		getResources().then(setResources);
	}, []);

	return (
		<ul>
			{resources.map((resource) => (
				<li key={resource.id}>
					<a href={resource.url}>{resource.title}</a>
				</li>
			))}
		</ul>
	);
}
