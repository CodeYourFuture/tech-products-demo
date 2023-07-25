import { Link, NavLink } from "react-router-dom";

import { usePrincipal } from "../../authContext";

import "./Header.scss";
import logo from "./logo.png";

export default function Header() {
	const principal = usePrincipal();
	return (
		<header>
			<h1>
				<Link to="/">
					<img alt="" src={logo} />
					&nbsp;Resources
				</Link>
			</h1>
			<nav>
				<ul>
					<li>
						<NavLink to="/suggest">Suggest</NavLink>
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
