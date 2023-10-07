#!/usr/bin/env node

import { Generator } from "./Generator.js";
import { Glossary } from "./Glossary.js";
import { Command } from "commander";
import { readFileSync } from "fs";
import { resolve } from "path";
import { report, log } from "./Report.js";
import { fileURLToPath } from "url";

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import chalk from "chalk";
import figlet from "figlet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "package.json"), "utf8")
);
const version = packageJson.version;

export let generator: Generator;
export let glossary: Glossary;
const program = new Command();

program
  .name("tev2-hrgt")
  .version(version)
  .usage(
    "[ <paramlist> ] [ <globpattern> ]\n" +
      "- <paramlist> (optional) is a list of key-value pairs\n" +
      "- <globpattern> (optional) specifies a set of (input) files that are to be processed"
  )
  .description("The CLI for the Term Reference Resolution Tool")
  .option(
    "-c, --config <path>",
    "Path (including the filename) of the tool's (YAML) configuration file"
  )
  .option(
    "-o, --output <dir>",
    "(Root) directory for output files to be written"
  )
  .option(
    "-s, --scopedir <path>",
    "Path of the scope directory where the SAF is located"
  )
  .option(
    "-t, --termselcriteria",
    "List of term selection criteria that are used to generate"
  )
  .option(
    "-te, --template",
    "Path (including the filename) of the mustache template file"
  )
  .option(
    "-m, --method",
    "The method that is used to create the output (default HTML)"
  )
  .option("-l, --license", "File that contains the licensing conditions")
  .option("-f, --force", "Allow overwriting of existing files")
  .parse(process.argv);

program.parse();

async function main(): Promise<void> {
  // Parse command line parameters
  var options = program.opts();
  if (program.args[0]) {
    options.input = program.args[0];
  }

  console.log(
    chalk.red(
      figlet.textSync(`TEv2 HRGT v${version}`, { horizontalLayout: "full" })
    )
  );

  if (options.config) {
    try {
      const config = yaml.load(
        readFileSync(resolve(options.config), "utf8")
      ) as yaml.Schema;

      // Merge config options with command line options
      options = { ...config, ...options };
    } catch (err) {
      log.error(
        `E011 Failed to read or parse the config file '${options.config}':`,
        err
      );
      process.exit(1);
    }
  }

  // Create a Generator with the provided options
  generator = new Generator({
    method: options.method ?? "html",
    scopedir: options.scopedir ?? ".",
    input: options.input,
    output: options.output ?? "index",
    template: options.template ?? "template.mustache",
  });

  // Resolve terms
  try {
    await generator.generate();
    log.info("Generation complete...");
    report.print();
    process.exit(0);
  } catch (err) {
    log.error(
      "E012 Something unexpected went wrong while generating HRG:",
      err
    );
    process.exit(1);
  }
}

main();
