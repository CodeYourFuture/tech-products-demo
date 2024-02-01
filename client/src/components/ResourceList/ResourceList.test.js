import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { resourceStub } from "../../../setupTests";

import ResourceList from "./index";

describe("ResourceList", () => {
	it("shows the resource", () => {
		const resource = resourceStub({
			description:
				'Comprehensive guide to setting up the various types of inputs with React (a.k.a. "data binding")',
			title: "Data Binding in React",
			url: "https://www.joshwcomeau.com/react/data-binding/",
		});
		render(<ResourceList showMore={5} resources={[resource]} totalCount={1} />);
		expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
			resource.title
		);
		expect(
			screen.getByRole("link", { name: "joshwcomeau.com" })
		).toHaveAttribute("href", resource.url);
		expect(screen.getByText(/comprehensive guide/i)).toBeInTheDocument();
	});

	it("shows a message if no resources are available", () => {
		render(<ResourceList resources={[]} />);
		expect(screen.getByText(/no resources to show/i)).toBeInTheDocument();
	});

	it("shows a publish button on draft resource", async () => {
		const publish = jest.fn();
		const resource = resourceStub({ draft: true });
		const user = userEvent.setup();
		render(
			<ResourceList publish={publish} resources={[resource]} totalCount={1} />
		);
		expect(
			screen.getByRole("button", { name: /publish/i })
		).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: /publish/i }));
		expect(publish).toHaveBeenCalledWith(resource.id);
	});

	it("shows the topic if available", () => {
		const resource = resourceStub({ topic_name: "My Topic" });
		render(<ResourceList resources={[resource]} totalCount={1} />);
		expect(screen.getByText(resource.topic_name)).toBeInTheDocument();
	});

	it("shows the Draft badge if available", async () => {
		const resource = resourceStub({ draft: true });
		render(
			<ResourceList showBadge={true} resources={[resource]} totalCount={1} />
		);
		await expect(
			screen.getByRole("heading", { name: /☐ Draft/i })
		).toBeInTheDocument();
	});

	it("shows the Published badge if available", async () => {
		const resource = resourceStub({
			description:
				"If a resource is published, the badge is display within the accounts page",
			title: "Pulished Badge",
			url: "https://www.ematembu.com",
		});
		render(
			<ResourceList showBadge={true} resources={[resource]} totalCount={1} />
		);
		await expect(
			screen.getByRole("heading", { name: /☑ Published/i })
		).toBeInTheDocument();
	});

	it("shows the LoadMore button", async () => {
		const resource = [
			resourceStub({
				description:
					"If a resource is published, the badge is display within the accounts page",
				title: "Pulished Badge",
				url: "https://www.ematembu.com/",
			}),
			resourceStub({
				description:
					"If a resource is draft, the badge is display within the accounts page",
				title: "Draft Badge",
				url: "https://www.ematembu2.com/",
			}),
		];
		const loadMore = await jest.fn();
		const user = userEvent.setup();
		render(
			<ResourceList
				loadMore={loadMore}
				showMore={1}
				showBadge={true}
				resources={resource}
				totalCount={2}
			/>
		);
		expect(
			screen.getByRole("button", { name: /Load More/i })
		).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: /Load More/i }));
		expect(loadMore).toHaveBeenCalled();
	});

	it("shows the No More To Load button", async () => {
		const resource = [
			resourceStub({
				description:
					"If a resource is published, the badge is display within the accounts page",
				title: "Pulished Badge",
				url: "https://www.ematembu3.com/",
			}),
			resourceStub({
				description:
					"If a resource is suggested, the badge is display within the accounts page",
				title: "Draft Badge",
				url: "https://www.ematembu4.com/",
			}),
		];
		const loadMore = await jest.fn();
		render(
			<ResourceList
				loadMore={loadMore}
				showMore={2}
				showBadge={true}
				resources={resource}
				totalCount={2}
			/>
		);
		expect(
			screen.getByRole("button", { name: /No more to load/i })
		).toBeInTheDocument();
	});
});
