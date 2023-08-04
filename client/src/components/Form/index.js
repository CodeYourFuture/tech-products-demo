import PropTypes from "prop-types";
import { useCallback } from "react";

import { Button } from "../index";

import "./Form.scss";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";

export default function Form({
	children,
	resetButton,
	label,
	onChange,
	onSubmit,
	submitButton,
}) {
	const formSubmit = useCallback(
		(/**React.FormEvent<HTMLFormElement>*/ event) => {
			event.preventDefault();
			const formData = Object.fromEntries([...new FormData(event.target)]);
			Promise.resolve(onSubmit(formData))
				.then(() => event.target.reset())
				.catch(() => {});
		},
		[onSubmit]
	);
	return (
		<form
			aria-label={label}
			className="form"
			onChange={onChange}
			onSubmit={formSubmit}
		>
			{children}
			<div className="buttons">
				{resetButton && (
					<Button style="secondary" type="reset">
						{resetButton}
					</Button>
				)}
				<Button style="primary">{submitButton}</Button>
			</div>
		</form>
	);
}

Form.propTypes = {
	children: PropTypes.node.isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	resetButton: PropTypes.string,
	submitButton: PropTypes.string.isRequired,
};

export const FormControls = { Input, Select, Textarea };
