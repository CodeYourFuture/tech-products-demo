import PropTypes from "prop-types";

import Label from "./Label";

export default function Select({
	defaultValue = "",
	label,
	name,
	options,
	placeholder,
	required,
	onChange = () => {},
	className,
}) {
	return (
		<Label required={required} text={label}>
			<select
				defaultValue={defaultValue}
				disabled={options === undefined}
				name={name}
				required={required}
				onChange={onChange}
				className={className}
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
	className: PropTypes.string,
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
	onChange: PropTypes.func,
};
