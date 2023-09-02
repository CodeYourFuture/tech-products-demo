import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ResourceService, MemberService, useService } from "../../services";

const style = {
	secondary: "#bc2a2a",
};

const initialUserDetails = {
	email: "UNK Email",
	github_id: "UNK github ID",
	id: "UNK ID",
	is_admin: "UNK",
	name: "NA Name",
};

function DraftDetails() {
	const navigate = useNavigate();
	const { draftId } = useParams();
	const memberService = useService(MemberService);
	const resourceService = useService(ResourceService);
	const [userDetails, setUserDetails] = useState(initialUserDetails);

	useEffect(() => {
		const getUserDetails = async () => {
			const resource = await resourceService.getDraftById(draftId);
			if (resource?.data?.recommender) {
				const result = await memberService.getUserById(
					resource.data.recommender
				);

				setUserDetails(result.data);
			}
		};

		getUserDetails();
	}, [draftId, resourceService, memberService]);

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
				<h2>Recommender Details</h2>
			</div>

			<div>
				<img
					alt="user"
					src="/a79342f2f7bf2dee2c6861b2b9a76f94.png"
					width="200px"
					height="200px"
					style={{
						border: `1px solid ${style.secondary}`,
						borderRadius: "50%",
						margin: "20px",
						float: "left",
						shapeOutside: "circle(50%)",
						objectFit: "contain",
					}}
				/>
				<Info label="Name" content={userDetails.name} />
				<Info label="Email" content={userDetails.email} />
				<Info label="Github ID" content={userDetails.github_id} />
				<Info label="Admin" content={userDetails.is_admin ? "Yes" : "No"} />
			</div>
		</section>
	);
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
