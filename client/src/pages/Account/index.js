import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";

import { usePrincipal } from "../../authContext";
import { Button } from "../../components";
import { ResourceList } from "../../components";
import { ResourceService, UserService, useService } from "../../services";
import "./Account.scss";

export default function Account() {
	const LIMIT = 15;
	const principal = usePrincipal();
	const userService = useService(UserService);
	const resourceService = useService(ResourceService);
	const [{ resources, totalCount } = {}, setEnvelope] = useState();
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(LIMIT);

	const loadMore = () => {
		setShowMore((prevResource) => prevResource + LIMIT);
	};

	const refreshResource = useCallback(async () => {
		await userService.getByUser(principal?.id).then(setEnvelope);
		setLoading(false);
	}, [userService, principal]);

	useEffect(() => {
		userService.getByUser(principal?.id).then(setEnvelope);
		setLoading(false);
	}, [userService, principal]);

	const publish = useCallback(
		async (id) => {
			await resourceService.publish(id);
			await refreshResource();
		},
		[refreshResource, resourceService]
	);

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
			<form
				action="/api/auth/logout"
				aria-labelledby="logout-button"
				method="POST"
			>
				<Button id="logout-button" style="secondary">
					Log out
				</Button>
			</form>
			<h2>My Resources</h2>
			<section>
				<ResourceList
					showBadge={true}
					showMore={showMore}
					loadMore={loadMore}
					loading={loading}
					publish={publish}
					totalCount={totalCount}
					resources={resources ?? []}
				/>
			</section>
		</>
	);
}
