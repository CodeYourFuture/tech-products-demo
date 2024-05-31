const admin = {
	email: "admin@codeyourfuture.io",
	github_id: 123,
	id: "fec2f199-f308-4111-b069-b0741cfc2dc5",
	is_admin: true,
	name: "Cyf Admin",
};

const user = {
	email: "shh@example.com",
	github_id: 456,
	id: "2a8e4bb3-6f9c-4602-b084-af343fcbe6f0",
	name: "discreet-volunteer",
};

const resources = [...Array(25)].map((_, index) => createResource(index));

it("shows the resources in pages", () => {
	cy.task("seed", { users: [admin, user], resources });
	cy.visit("/");

	cy.findAllByRole("link", { name: "example.com" }).should("have.length", 20);
	cy.findByRole("link", { name: /next/i }).click();
	cy.findAllByRole("link", { name: "example.com" }).should("have.length", 5);

	cy.findByRole("combobox", { name: /items per page/i }).select("50");
	cy.findAllByRole("link", { name: "example.com" }).should("have.length", 25);

	cy.findByRole("combobox", { name: /items per page/i }).select("10");
	cy.findByRole("link", { name: /page 3/i }).click();
	cy.findAllByRole("link", { name: "example.com" }).should("have.length", 5);
});

function createResource(index) {
	const id = crypto.randomUUID();
	const date = new Date();
	date.setDate(date.getDate() - index);
	date.setHours(12, 13, 14);
	const accession = new Date(date.getTime());
	date.setHours(14, 15, 16);
	const status_changed_date = new Date(date.getTime());
	return {
		accession,
		status: "published",
		status_changed_date,
		status_changed_by: admin.id,
		source: user.id,
		title: `Resource ${id}`,
		url: `https://example.com/resources/${id}`,
	};
}
