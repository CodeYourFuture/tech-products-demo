import PropTypes from "prop-types";

const BookmarkFlag = ({ color, stroke, onClick }) => {
	return (
		// Use a button for accessibility
		<button
			onClick={onClick}
			style={{
				background: "none",
				border: "none",
				padding: 0,
				cursor: "pointer",
			}}
			// Add keyboard accessibility
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					onClick();
				}
			}}
			// Ensure the button is focusable
			tabIndex={0}
			aria-label="Bookmark"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 30 30"
				width="30px"
				height="30px"
				style={{ fill: color, stroke }}
			>
				<path d="M23,27l-8-7l-8,7V5c0-1.105,0.895-2,2-2h12c1.105,0,2,0.895,2,2V27z" />
			</svg>
		</button>
	);
};

BookmarkFlag.propTypes = {
	color: PropTypes.string,
	stroke: PropTypes.string,
	onClick: PropTypes.func.isRequired,
};

export default BookmarkFlag;
