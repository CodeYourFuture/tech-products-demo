import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ResourceService, useService } from "../../services";

import "./Resource.scss";

export default function Resource() {
	const [resource, setResource] = useState(undefined);
	const resourceService = useService(ResourceService);
	const { id } = useParams();

	useEffect(() => {
		resourceService.getOne(id).then(setResource);
	}, [id, resourceService]);

	if (!resource) {
		return null;
	}

	return (
		<>
			<h2>
				Resource &gt; <span>{resource.title}</span>
			</h2>
			<section>
				<table aria-label="resource details" className="resource-details">
					<tbody>
						<tr>
							<th>Title</th>
							<td>{resource.title}</td>
						</tr>
						<tr>
							<th>ID</th>
							<td>{resource.id}</td>
						</tr>
						<tr>
							<th>URL</th>
							<td>
								<a href={resource.url}>{formatUrl(resource.url)}</a>
							</td>
						</tr>
						<tr>
							<th>Topic</th>
							<td>{resource.topic_name ?? <em>N/A</em>}</td>
						</tr>
						<tr>
							<th>Suggested</th>
							<td>
								<time dateTime={resource.accession.toISOString()}>
									{resource.accession.toLocaleString()} by{" "}
									{resource.source_name}
								</time>
							</td>
						</tr>
						<tr>
							<th>Published</th>
							<td>
								<time dateTime={resource.publication.toISOString()}>
									{resource.publication.toLocaleString()} by{" "}
									{resource.publisher_name}
								</time>
							</td>
						</tr>
					</tbody>
				</table>
			</section>
		</>
	);
}

function formatUrl(url) {
	const host = new URL(url).host;
	if (host.startsWith("www.")) {
		return host.slice(4);
	}
	return host;
}
