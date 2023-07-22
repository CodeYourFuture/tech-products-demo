import { useState } from "react";

import { createResource } from "../../services/resourceService";

import "./SuggestResource.scss";

export default function SuggestResource() {
	const [suggested, setSuggested] = useState(false);
	/**
	 * @param {React.FormEvent<HTMLFormElement>} event
	 */
	const submitForm = (event) => {
		event.preventDefault();
		const {
			title: { value: title },
			url: { value: url },
		} = event.target.elements;
		createResource({ title, url }).then(() => {
			setSuggested(true);
			event.target.reset();
		});
	};

	return (
		<>
			{suggested && (
				<p className="success">Thank you for suggesting a resource!</p>
			)}
			<form
				aria-label="Suggest resource"
				onChange={() => setSuggested(false)}
				onSubmit={submitForm}
			>
				<label>
					Title
					<input name="title" required type="text" />
				</label>
				<label>
					URL
					<input name="url" required type="url" />
				</label>
				<button type="submit">Suggest</button>
			</form>
		</>
	);
}
