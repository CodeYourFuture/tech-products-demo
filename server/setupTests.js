import "dotenv/config";

import { disconnectDb } from "./db";

afterAll(() => disconnectDb());
