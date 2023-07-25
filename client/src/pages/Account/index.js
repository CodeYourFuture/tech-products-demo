import { Navigate } from "react-router-dom";

import { usePrincipal } from "../../authContext";

import "./Account.scss";

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
						<td>{principal?.email ?? <em>N/A</em>}</td>
					</tr>
				</tbody>
			</table>
			<form
				action="/api/auth/logout"
				aria-labelledby="logout-button"
				method="POST"
			>
				<button className="secondary" id="logout-button" type="submit">
					Log out
				</button>
			</form>
		</>
	);
}
