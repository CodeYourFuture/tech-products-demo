import { Link, NavLink } from "react-router-dom";

import { usePrincipal } from "../../authContext";

import "./Header.scss";
import logo from "./logo.png";

export default function Header() {
	const user = usePrincipal();
	const principal = usePrincipal();
	return (
		<header>
			<h1>
				<Link to="/">
					<img alt="" src={logo} />
					&nbsp;Resources
				</Link>
			</h1>
			<nav aria-label="site navigation">
				<ul>
					<li>
						{principal && (
							<NavLink to="/suggest">
								{user.is_admin ? "Publish" : "Suggest"}
							</NavLink>
						)}
					</li>
					<li>
						{principal?.is_admin && <NavLink to="/drafts">Drafts</NavLink>}
					</li>
				</ul>
				<ul>
					<li>
						<NavLink to="/about">About</NavLink>
					</li>
					<li>
						{principal ? (
							<NavLink to="/account">Account</NavLink>
						) : (
							<a href="/api/auth/login">Log In</a>
						)}
					</li>
				</ul>
			</nav>
		</header>
	);
}
