import clsx from "clsx";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSearchParams } from "../../hooks";

import "./Pagination.scss";

const DEFAULT_PAGINATION = { page: 1, perPage: 20 };

const mergeWithoutDefaults = (...objects) =>
	Object.entries(Object.assign({}, ...objects)).filter(
		([key, value]) => DEFAULT_PAGINATION[key] !== value
	);

/**
 * Based on {@link https://design-system.w3.org/components/pagination.html W3C design system}.
 * @param {number} lastPage
 */
export default function Pagination({ lastPage }) {
	const location = useLocation();
	const navigate = useNavigate();
	const searchParams = useSearchParams(DEFAULT_PAGINATION);

	const createRoute = useCallback(
		(update) => {
			return `${location.pathname}?${new URLSearchParams(
				mergeWithoutDefaults(searchParams, update)
			)}`;
		},
		[location, searchParams]
	);

	return (
		<nav aria-label="pagination">
			<ul>
				<li>
					{searchParams.page !== 1 ? (
						<Link to={createRoute({ page: searchParams.page - 1 })}>
							<span aria-hidden>&lt;</span>
							<span className="visuallyhidden">previous page</span>
						</Link>
					) : (
						<span aria-hidden>&lt;</span>
					)}
				</li>
				{[...new Array(lastPage)].map((_, index) => (
					<li key={index}>
						<PageLink
							currentPage={searchParams.page}
							page={index + 1}
							lastPage={lastPage}
							to={createRoute({ page: index + 1 })}
						/>
					</li>
				))}
				<li>
					{searchParams.page !== lastPage ? (
						<Link to={createRoute({ page: searchParams.page + 1 })}>
							<span aria-hidden>&gt;</span>
							<span className="visuallyhidden">Next page</span>
						</Link>
					) : (
						<span aria-hidden>&gt;</span>
					)}
				</li>
			</ul>
			<label>
				Items per page
				<select
					onChange={({ target: { value } }) =>
						navigate(createRoute({ page: 1, perPage: parseInt(value, 10) }))
					}
					value={searchParams.perPage}
				>
					{[10, 20, 50].map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
				</select>
			</label>
		</nav>
	);
}

Pagination.propTypes = {
	lastPage: PropTypes.number.isRequired,
};

function PageLink({ currentPage, lastPage, page, to }) {
	return (
		<Link
			aria-current={page === currentPage && "page"}
			className={clsx(page === currentPage && "active")}
			to={to}
		>
			<span className="visuallyhidden">Page </span>
			{page}
			{lastPage > 1 && page === 1 && (
				<span className="visuallyhidden">(first page)</span>
			)}
			{lastPage > 1 && page === lastPage && (
				<span className="visuallyhidden">(last page)</span>
			)}
		</Link>
	);
}

PageLink.propTypes = {
	currentPage: PropTypes.number.isRequired,
	lastPage: PropTypes.number.isRequired,
	page: PropTypes.number.isRequired,
	to: PropTypes.string.isRequired,
};
