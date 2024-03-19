import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";

import { FormControls } from "..";

export default function TopicSelector({ topics, setSelectedTopic }) {
	const navigate = useNavigate();
	const handleChange = (event) => {
		setSelectedTopic(event.target.value);
		navigate("/");
	};
	return (
		<div>
			<FormControls.Select
				label="Filter Topic"
				placeholder="Select a topic"
				name="filter topic"
				options={topics}
				onChange={handleChange}
				className="custom-select"
			/>
		</div>
	);
}
TopicSelector.propTypes = {
	topics: PropTypes.array.isRequired,
	setSelectedTopic: PropTypes.func.isRequired,
};
