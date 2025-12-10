#!/usr/bin/env node
'use strict'

// eslint-disable-next-line regexp/no-unused-capturing-group
const isWindows = process && (process.platform === "win32" || /^(msys|cygwin)$/.test(process.env["OSTYPE"] ?? ""));

process.exit(isWindows ? 0 : 1)
