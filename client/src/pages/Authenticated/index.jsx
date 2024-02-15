import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

import { usePrincipal } from "../../authContext";

export default function Authenticated({ adminOnly }) {
	const principal = usePrincipal();

	if (!principal || (adminOnly && !principal.is_admin)) {
		return <Navigate to="/" />;
	}

	return <Outlet />;
}

Authenticated.propTypes = {
	adminOnly: PropTypes.bool,
};
