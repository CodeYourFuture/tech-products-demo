import { resourceStub } from "../../setupTests";

import UserService from "./userService";

describe("UserService", () => {
	const service = new UserService();
	const user = {
		id: "ef87091b-0d08-4a18-81a1-3df0d6e663d1",
		email: "ematembu2@gmail.com",
		github_id: 50827537,
		name: "Matembu Emmanuel Dominic",
		is_admin: true,
	};

	describe("getByUser", () => {
		it("returns user resources on success", async () => {
			const getByUser = (UserService.prototype.getByUser = jest.fn());
			getByUser.mockReturnValue({
				user,
				resources: resourceStub,
				totalCount: resourceStub.length,
			});
			const resource = service.getByUser(
				"ef87091b-0d08-4a18-81a1-3df0d6e663d1"
			);
			expect(resource.resources).toEqual(resourceStub);
			expect(service.getByUser).toHaveBeenCalledTimes(1);
		});
	});
});
