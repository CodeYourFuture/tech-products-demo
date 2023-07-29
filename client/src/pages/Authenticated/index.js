import { Navigate, Outlet } from "react-router-dom";

import { usePrincipal } from "../../authContext";

export default function Authenticated() {
	const principal = usePrincipal();

	if (!principal) {
		return <Navigate to="/" />;
	}

	return <Outlet />;
}
