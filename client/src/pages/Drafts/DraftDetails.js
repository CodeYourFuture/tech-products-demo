import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ResourceService, MemberService, useService } from "../../services";

const style = {
	secondary: "#bc2a2a",
};

function DraftDetails() {
	const navigate = useNavigate();
	const { draftId } = useParams();
	const memberService = useService(MemberService);
	const resourceService = useService(ResourceService);
	const [error, setError] = useState(false);
	const [userDetails, setUserDetails] = useState(undefined);

	useEffect(() => {
		const getUserDetails = async () => {
			const resource = await resourceService.getDraftById(draftId);
			if (resource.data?.source) {
				const result = await memberService.getUserById(resource.data.source);
				setError(false);
				setUserDetails(result.data);
			}
			if (resource.error) {
				setError(true);
			}
		};

		getUserDetails();
	}, [draftId, resourceService, memberService]);

	if (error) {
		return <div>Resource Not Found!</div>;
	}

	if (userDetails) {
		return (
			<section>
				<div style={{ display: "flex" }}>
					<button
						aria-label="back"
						style={{
							background: "white",
							border: 0,
							color: style.secondary,
							fontSize: "35px",
							cursor: "pointer",
						}}
						onClick={() => navigate(-1)}
					>
						&#x261C;
					</button>
					<h2>Source Details</h2>
				</div>

				<div>
					<Info label="Name" content={userDetails.name} />
					<Info label="Email" content={userDetails.email} />
				</div>
			</section>
		);
	}

	return <></>;
}

function Info({ label, content }) {
	return (
		<div style={{ marginTop: "5%" }}>
			<span
				style={{
					padding: "2%",
					margin: "0% 2% 0 0",
					background: `${style.secondary}80`,
					borderRadius: "10% 50% 50% 10%",
					minWidth: "2%",
				}}
			>
				{label}
			</span>
			<span aria-label={label}>{content}</span>
		</div>
	);
}

Info.propTypes = {
	label: PropTypes.string.isRequired,
	content: PropTypes.string.isRequired,
};

export default DraftDetails;
