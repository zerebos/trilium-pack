#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const pack = require("../lib/pack");


const PROJECT_DIR = path.dirname(process.env.npm_package_json);
const JSON_PATH = path.join(PROJECT_DIR, "tpack.json");
const JS_PATH = path.join(PROJECT_DIR, "tpack.config.js");

const jsonExists = fs.existsSync(JSON_PATH);
const jsExists = fs.existsSync(JS_PATH);

if (!jsExists && !jsonExists) throw new Error(`Pack config (tpack.json/tpack.config.js) not found in project root ${PROJECT_DIR}.`);

let config;
if (jsExists) config = require(JS_PATH);
else if (jsonExists) config = require(JSON_PATH);

pack(config, {basePath: PROJECT_DIR});