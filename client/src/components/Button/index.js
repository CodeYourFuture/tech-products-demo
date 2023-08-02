import clsx from "clsx";
import PropTypes from "prop-types";

import "./Button.scss";

export default function Button({ children, id, style, onClick }) {
	return (
		<button
			className={clsx("button", style)}
			id={id}
			type={onClick ? "button" : "submit"}
		>
			{children}
		</button>
	);
}

Button.propTypes = {
	children: PropTypes.node.isRequired,
	id: PropTypes.string,
	onClick: PropTypes.func,
	style: PropTypes.oneOf(["primary", "secondary"]).isRequired,
};
