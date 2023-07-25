#!/usr/bin/env node
import app from "./app.mjs";

const port = process.env.PORT ?? 4212;

app.listen(port, () => console.log(`gitstub listening on: ${port}`));
