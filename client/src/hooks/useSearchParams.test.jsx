import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { useSearchParams } from "./index";

describe("useSearchParams", () => {
	it("exposes current location query parameters as an object", () => {
		const { current } = renderOnRoute("/page?foo=bar&baz=qux");
		expect(current).toEqual({ foo: "bar", baz: "qux" });
	});

	it("parses numerical values", () => {
		const { current } = renderOnRoute("/page?foo=123&baz=456");
		expect(current).toEqual({ foo: 123, baz: 456 });
	});

	it("includes the specified defaults", () => {
		const { current } = renderOnRoute("/page?bar=456&baz=used", () =>
			useSearchParams({ foo: 123, baz: "overridden" })
		);
		expect(current).toEqual({ foo: 123, bar: 456, baz: "used" });
	});
});

function renderOnRoute(route, hook = useSearchParams) {
	const { result } = renderHook(hook, {
		wrapper: ({ children }) => (
			<MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
		),
	});
	return result;
}
