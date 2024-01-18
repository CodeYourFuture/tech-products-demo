import PropTypes from "prop-types";

import Label from "./Label";

export default function Input({
	defaultValue = "",
	label,
	name,
	placeholder,
	required,
	type = "text",
}) {
	return (
		<Label required={required} text={label}>
			<input
				defaultValue={defaultValue}
				name={name}
				placeholder={placeholder}
				required={required}
				type={type}
			/>
		</Label>
	);
}

Input.propTypes = {
	defaultValue: PropTypes.string,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	type: PropTypes.oneOf(["email", "password", "tel", "text", "url"]),
};
