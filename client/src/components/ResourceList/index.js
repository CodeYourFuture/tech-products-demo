import { useEffect, useState } from "react";

import { getResources } from "../../services/resourceService";

export default function ResourceList() {
	const [resources, setResources] = useState([]);

	useEffect(() => {
		getResources()
			.then(setResources)
			.catch(() => {});
	}, []);

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
