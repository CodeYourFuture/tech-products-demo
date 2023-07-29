import { useCallback, useState } from "react";

import { useResourceService } from "../../services";

import "./Suggest.scss";

export default function Suggest() {
	const [suggested, setSuggested] = useState(false);
	const resourceService = useResourceService();

	const submitForm = useCallback(
		(/**React.FormEvent<HTMLFormElement>*/ event) => {
			event.preventDefault();
			const {
				description: { value: description },
				title: { value: title },
				url: { value: url },
			} = event.target.elements;
			resourceService
				.createResource({ description, title, url })
				.then(() => {
					setSuggested(true);
					event.target.reset();
				})
				.catch(() => {});
		},
		[resourceService]
	);

	return (
		<>
			<h2>Suggest a resource</h2>
			<p>Please use the form below to submit a suggestion.</p>
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
