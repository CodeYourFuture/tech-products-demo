import { Link } from "react-router-dom";

import { ResourceList, SuggestResource } from "../components";

export function Home() {
	return (
		<main role="main">
			<h1>Resources</h1>
			<SuggestResource />
			<ResourceList />
			<Link to="/about/this/site">About</Link>
		</main>
	);
}

export default Home;
