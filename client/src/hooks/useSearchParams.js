import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const INTEGER = /^\d+$/;

/**
 * Expose the current URL search/query parameters as an object.
 * @param {Record<string, string | number>} defaults
 * @returns {Record<string, string | number>}
 */
export default function useSearchParams(defaults = {}) {
	const { search } = useLocation();
	const [initial] = useState(defaults);

	return useMemo(() => {
		const searchParams = new URLSearchParams(search);
		return {
			...initial,
			...Object.fromEntries(
				[...searchParams.entries()].map(([key, value]) => [
					key,
					INTEGER.test(value) ? parseInt(value, 10) : value,
				])
			),
		};
	}, [initial, search]);
}
