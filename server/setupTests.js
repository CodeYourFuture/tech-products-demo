import "dotenv-expand/config";

import { disconnectDb } from "./db";

afterAll(() => disconnectDb());
