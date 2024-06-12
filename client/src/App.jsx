import { Route, Routes } from "react-router-dom";

import "./App.scss";
import { Header } from "./components";
import {
	About,
	Account,
	Authenticated,
	Drafts,
	Home,
	NotFound,
	Resource,
	Suggest,
} from "./pages";
import ResourceDetails from "./pages/ResourceDetails";

const App = () => (
	<>
		<Header />
		<main role="main">
			<article>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/account" element={<Account />} />
					<Route path="/drafts" element={<Authenticated adminOnly />}>
						<Route index element={<Drafts />} />
					</Route>
					<Route path="/resource/:id" element={<Resource />} />
					<Route path="/suggest" element={<Authenticated />}>
						<Route index element={<Suggest />} />
					</Route>
					<Route path="*" element={<NotFound />} />
					<Route path="/resdetails/:id" element={<ResourceDetails />} />
				</Routes>
			</article>
		</main>
	</>
);

export default App;
