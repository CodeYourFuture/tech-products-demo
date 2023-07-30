import clsx from "clsx";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";

import { useResourceService } from "../../services";

import "./Suggest.scss";

export default function Suggest() {
	const [message, setMessage] = useState(undefined);
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
				.suggest({ description, title, url })
				.then(() => {
					setMessage({
						success: true,
						text: "Thank you for suggesting a resource!",
					});
					event.target.reset();
				})
				.catch((err) => {
					setMessage({
						success: false,
						text: `Resource suggestion failed: ${err.message}.`,
					});
				});
		},
		[resourceService]
	);

	return (
		<>
			<h2>Suggest a resource</h2>
			<p>
				Please use the form below to submit a suggestion. Note that it will not
				appear on the home page immediately, as it needs to be reviewed by an
				administrator.
			</p>
			{message && <Message {...message} />}
			<form
				aria-label="Suggest resource"
				onChange={() => setMessage(undefined)}
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

function Message({ success, text }) {
	return (
		<p className={clsx("message", success ? "success" : "failure")}>{text}</p>
	);
}

Message.propTypes = {
	success: PropTypes.bool.isRequired,
	text: PropTypes.string.isRequired,
};
