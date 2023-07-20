import { disconnectDb } from "./db";

afterAll(() => disconnectDb());
