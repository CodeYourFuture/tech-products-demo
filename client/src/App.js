import { Route, Routes } from "react-router-dom";

import "./App.scss";
import { Header } from "./components";
import { About, Account, Home, NotFound, Suggest } from "./pages";

const App = () => (
	<>
		<Header />
		<main role="main">
			<section>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/account" element={<Account />} />
					<Route path="/suggest" element={<Suggest />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</section>
		</main>
	</>
);

export default App;
