import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const usePrincipal = () => {
	const { principal } = useContext(AuthContext);
	return principal;
};

export default function AuthProvider({ children }) {
	const [principal, setPrincipal] = useState();

	useEffect(() => {
		fetch("/api/auth/principal")
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
			})
			.then(setPrincipal);
	}, []);

	return (
		<AuthContext.Provider value={{ principal }}>
			{children}
		</AuthContext.Provider>
	);
}

AuthProvider.propTypes = {
	children: PropTypes.element.isRequired,
};
