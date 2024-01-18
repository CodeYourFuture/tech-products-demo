import PropTypes from "prop-types";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

const AuthContext = createContext({ logout: () => {} });

/**
 * If the user is not authenticated, clear the principal.
 * @returns {typeof fetch}
 */
export function useAuthenticatedFetch() {
	const logout = useLogout();
	return useCallback(
		async (...args) => {
			const res = await fetch(...args);
			if (res.status === 401) {
				logout();
			}
			return res;
		},
		[logout]
	);
}

export const useLogout = () => {
	const { logout } = useContext(AuthContext);
	return logout;
};

export const usePrincipal = () => {
	const { principal } = useContext(AuthContext);
	return principal;
};

export default function AuthProvider({ children }) {
	const [loading, setLoading] = useState(true);
	const [principal, setPrincipal] = useState();
	const logout = useCallback(() => setPrincipal(undefined), []);

	useEffect(() => {
		fetch("/api/auth/principal")
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
			})
			.then(setPrincipal)
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return null;
	}

	return (
		<AuthContext.Provider value={{ logout, principal }}>
			{children}
		</AuthContext.Provider>
	);
}

AuthProvider.propTypes = {
	children: PropTypes.element.isRequired,
};
