import PropTypes from "prop-types";

export default function Label({ children, text, required }) {
	return (
		<label>
			<span>
				<strong>{text}</strong>
				{required && <span aria-hidden>*</span>}
			</span>
			{children}
		</label>
	);
}

Label.propTypes = {
	children: PropTypes.node.isRequired,
	required: PropTypes.bool,
	text: PropTypes.string.isRequired,
};
