import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { usePrincipal } from "../../authContext";
import { Button } from "../../components";
import { Pagination, ResourceList } from "../../components";
import { ResourceService, useService } from "../../services";

import "./Account.scss";

export default function Account() {
	const principal = usePrincipal();
	const [{ lastPage, resources } = {}, setEnvelope] = useState();
	const resourceService = useService(ResourceService);
	useEffect(() => {
		resourceService.getUserResources(principal?.id).then(setEnvelope);
	}, [resourceService, principal?.id]);
	if (!principal) {
		return <Navigate to="/" />;
	}
	return (
		<>
			<h2>Account</h2>
			<table>
				<tbody>
					<tr>
						<th>Name</th>
						<td>{principal?.name}</td>
					</tr>
					<tr>
						<th>Email</th>
						<td>{principal?.email ?? <em>N/A</em>}</td>
					</tr>
				</tbody>
			</table>
			<section>
				<ResourceList resources={resources ?? []} />
				<Pagination lastPage={lastPage ?? 1} />
			</section>
			<form
				action="/api/auth/logout"
				aria-labelledby="logout-button"
				method="POST"
			>
				<Button id="logout-button" style="secondary">
					Log out
				</Button>
			</form>
		</>
	);
}
