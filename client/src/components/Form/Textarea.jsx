import PropTypes from "prop-types";

import Label from "./Label";

export default function Textarea({
	defaultValue,
	label,
	name,
	placeholder,
	required,
	rows = 5,
}) {
	return (
		<Label required={required} text={label}>
			<textarea
				defaultValue={defaultValue}
				name={name}
				placeholder={placeholder}
				required={required}
				rows={rows}
			/>
		</Label>
	);
}

Textarea.propTypes = {
	defaultValue: PropTypes.string,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	rows: PropTypes.number,
};
