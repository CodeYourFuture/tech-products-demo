import clsx from "clsx";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSearchParams } from "../../hooks";

import "./Pagination.scss";

const DEFAULT_PAGINATION = { page: 1, perPage: 20 };

const a11yText = (page, lastPage) => {
	if (page === 1) {
		return "page 1 (first page)";
	}
	if (page === lastPage) {
		return `page ${lastPage} (last page)`;
	}
	return `page ${page}`;
};

const mergeWithoutDefaults = (...objects) =>
	Object.entries(Object.assign({}, ...objects)).filter(
		([key, value]) => DEFAULT_PAGINATION[key] !== value
	);

const pages = (currentPage, lastPage) => {
	const allPages = [...Array(lastPage)]
		.map((_, index) => index + 1)
		.map((page) => {
			if (
				page === 1 ||
				page === lastPage ||
				(currentPage - 2 <= page && page <= currentPage + 2)
			) {
				return page;
			}
			return "...";
		});
	return [
		{
			a11y: "previous page",
			active: false,
			display: "<",
			enabled: currentPage > 1,
			page: currentPage - 1,
		},
		...allPages
			.filter((page, index) => page !== "..." || allPages[index + 1] !== "...")
			.map((page) => ({
				a11y: a11yText(page, lastPage),
				active: page === currentPage,
				display: page,
				enabled: page !== "...",
				page,
			})),
		{
			a11y: "next page",
			active: false,
			display: ">",
			enabled: currentPage < lastPage,
			page: currentPage + 1,
		},
	];
};

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
				{pages(searchParams.page, lastPage).map(
					({ a11y, active, display, enabled, page }, index) => (
						<li key={index}>
							{enabled ? (
								<Link
									aria-current={page === searchParams.page && "page"}
									className={clsx(active && "active")}
									to={createRoute({ page })}
								>
									<span aria-hidden>{display}</span>
									<span className="visuallyhidden">{a11y}</span>
								</Link>
							) : (
								<span aria-hidden>{display}</span>
							)}
						</li>
					)
				)}
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
