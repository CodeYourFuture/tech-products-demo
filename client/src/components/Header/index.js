import { Link, NavLink } from "react-router-dom";

import "./Header.scss";

export default function Header() {
	return (
		<header>
			<h1>
				<Link to="/">Resources</Link>
			</h1>
			<nav>
				<ul>
					<li>
						<NavLink to="/about">About</NavLink>
					</li>
				</ul>
			</nav>
		</header>
	);
}
