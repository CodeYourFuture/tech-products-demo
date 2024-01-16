import PropTypes from "prop-types";

import Label from "./Label";

export default function Select({
	defaultValue = "",
	label,
	name,
	options,
	placeholder,
	required,
	value,
	onChange = () => {},
}) {
	const handleChange = (event) => {
		const selectedValue = event.target.value;
		const selectedOption = options.find(
			(option) => option.id === selectedValue
		);
		onChange(selectedOption ? selectedOption.name : "");
	};

	return (
		<Label required={required} text={label}>
			<select
				defaultValue={defaultValue}
				value={value}
				disabled={options === undefined}
				name={name}
				required={required}
				onChange={handleChange}
			>
				<option disabled value="">
					{placeholder}
				</option>
				{options &&
					options.map(({ id, name }) => (
						<option key={id} value={id}>
							{name}
						</option>
					))}
			</select>
		</Label>
	);
}

Select.propTypes = {
	defaultValue: PropTypes.string,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
		})
	),
	placeholder: PropTypes.string.isRequired,
	required: PropTypes.bool,
	value: PropTypes.string,
	onChange: PropTypes.func,
};
