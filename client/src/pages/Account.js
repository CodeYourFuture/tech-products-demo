import { Navigate } from "react-router-dom";

import { usePrincipal } from "../authContext";

export default function Account() {
	const principal = usePrincipal();
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
						<td>{principal?.email}</td>
					</tr>
				</tbody>
			</table>
		</>
	);
}
