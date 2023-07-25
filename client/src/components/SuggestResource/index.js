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
			description: { value: description },
			title: { value: title },
			url: { value: url },
		} = event.target.elements;
		createResource({ description, title, url }).then(() => {
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
					<span>
						<strong>Title</strong>*
					</span>
					<input name="title" required type="text" />
				</label>
				<label>
					<span>
						<strong>URL</strong>*
					</span>
					<input name="url" required type="url" />
				</label>
				<label>
					<span>
						<strong>Description</strong>
					</span>
					<textarea name="description" rows={5} />
				</label>
				<button className="primary" type="submit">
					Suggest
				</button>
			</form>
		</>
	);
}
