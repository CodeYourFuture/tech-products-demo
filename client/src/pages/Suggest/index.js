import clsx from "clsx";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

import { Button } from "../../components";
import { useResourceService, useTopicService } from "../../services";

import "./Suggest.scss";

export default function Suggest() {
	const [message, setMessage] = useState(undefined);
	const [topics, setTopics] = useState(undefined);
	const resourceService = useResourceService();
	const topicService = useTopicService();

	useEffect(() => {
		topicService.getTopics().then(setTopics);
	}, [topicService]);

	const submitForm = useCallback(
		(/**React.FormEvent<HTMLFormElement>*/ event) => {
			event.preventDefault();
			const suggestion = Object.fromEntries(
				[...new FormData(event.target)].filter(([, value]) => value !== "")
			);
			resourceService
				.suggest(suggestion)
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
				className="form"
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
				<label>
					<span>
						<strong>Topic</strong>
					</span>
					<select defaultValue="" disabled={topics === undefined} name="topic">
						<option disabled value="">
							Select a topic
						</option>
						{topics &&
							topics.map(({ id, name }) => (
								<option key={id} value={id}>
									{name}
								</option>
							))}
					</select>
				</label>
				<div>
					<Button style="secondary" type="reset">
						Clear
					</Button>
					<Button style="primary">Suggest</Button>
				</div>
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
