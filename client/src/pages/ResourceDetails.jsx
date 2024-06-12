import "./ResourceDetails.scss";

import { useParams } from "react-router-dom";

import { useSearchParams } from "../hooks";

export function ResourceDetails() {
	const searchParams = useSearchParams();

	const { title, url, topic_name } = searchParams;
	const { id } = useParams();

	return (
		<div className="container">
			<h1>
				Resource {"> "}
				<span className="title">{title}</span>
			</h1>
			<table className="resource-table">
				<tr className="resource-row">
					<th className="resource-header">ID:</th>
					<td className="resource-data">{id}</td>
				</tr>
				<tr className="resource-row">
					<th className="resource-header">URL:</th>
					<td className="resource-data">{url}</td>
				</tr>
				<tr className="resource-row">
					<th className="resource-header">Topic:</th>
					<td className="resource-data">{topic_name}</td>
				</tr>
			</table>
		</div>
	);
}

export default ResourceDetails;
