import Handlebars from "handlebars";
import { marked } from 'marked';
import { log } from "./Report.js";
import { Entry, Glossary, Output } from "./Glossary.js";
import path, { resolve } from "path";
import { glob } from "glob";
import fs from "fs";

export class Generator {
  private method: string;
  private scopedir: string;
  private inputGlob: string | null;
  private outputName: string;
  private glossary!: Glossary;
  private entries: Entry[];
  private htmlOutput!: string;
  private template: string;

  public constructor({
    method,
    scopedir,
    input,
    output,
    template,
  }: {
    method: any;
    scopedir: string;
    input: string;
    output: string;
    template: string;
  }) {
    this.entries = [];
    this.method = method;
    this.scopedir = scopedir;
    this.inputGlob = input;
    this.outputName = output;
    this.template = template;
    log.info(
      `Using ${this.method} method with MRG ${
        this.inputGlob ?? "(from SAF scope.mrgfile)"
      } generating to ${this.outputName} in scopedir ${this.scopedir}`
    );
  }

  async generate(): Promise<string> {
    try {
      this.createGlossary();
      await this.processGlossaryData();
      await this.generateHTML();
      await this.writeToFile();

      log.info("Generation completed successfully");
      return "Generation completed successfully";
    } catch (error) {
      log.error("Generation failed: ", error);
      throw new Error("Generation failed");
    }
  }

  private createGlossary(): void {
    this.glossary = new Glossary({
      scopedir: resolve(this.scopedir),
      input: this.inputGlob,
    });
  }

  private async processGlossaryData(): Promise<void> {
    let outputs = [];
    if (this.inputGlob) {
      const files = await glob(this.inputGlob);
      for (let i = 0; i < files.length; i++) {
        outputs.push(await this.glossary.initialize(files[0]));
      }
    } else {
      outputs.push(await this.glossary.initialize(null));
    }
    this.entries = outputs.flatMap((o) => {
      return o.entries;
    });
    log.info(`${this.entries.length} Entries`)
  }

  private async generateHTML(): Promise<void> {
    try {
      const templateFile = fs.readFileSync(this.template, "utf8");
      const template = Handlebars.compile(templateFile);
      this.htmlOutput = template({ entries: this.entries.map(e => ({...e, glossaryText: marked.parse(e.glossaryText) })) });
    } catch (error) {
      log.error("Failed to generate HTML", error);
    }
  }

  private async writeToFile(): Promise<void> {
    const name = `${this.outputName}.html`;
    try {
      await fs.promises.writeFile(
        path.join(this.scopedir, name),
        this.htmlOutput,
        "utf8"
      );
      log.info(`Data successfully written to ${name}`);
    } catch (error) {
      log.error(`Failed to write data to file at ${name}`, error);
      throw new Error("File write operation failed");
    }
  }
}
