import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { expect } from 'chai';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

describe('Run HRGT on provided test files', () => {
  it('should create HRG', (done) => {
    const hrgtPath = path.resolve(__dirname, '../lib/Run.js');
    const contentPath = path.resolve(__dirname, 'content');
    const configFile = path.resolve(contentPath, 'config.yaml');
    const outputFile = path.resolve(__dirname, 'output/__tests__/content');

    const hrgtProcess = spawn('node', [hrgtPath, '-c', configFile]);
    
    let output = '';
    let consoleOutput = '';

    hrgtProcess.stdout.on('data', (data) => {
      output += data;
      consoleOutput += data.toString();
    });

    hrgtProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    hrgtProcess.on('close', (code) => {
      console.log(consoleOutput)

      expect(code).to.equal(0);

      const termRegex = /(?:(?<=[^`\\])|^)\[(?=[^@\]]+\]\([#a-z0-9_-]*@[:a-z0-9_-]*\))(?<showtext>[^\n\]@]+)\]\((?:(?<id>[a-z0-9_-]*)?(?:#(?<trait>[a-z0-9_-]+))?)?@(?<scopetag>[a-z0-9_-]*)(?::(?<vsntag>[a-z0-9_-]+))?\)/g;

      // fs.readFile(inputFile, 'utf8', (_err, fileContent) => {
      //   const termMatches = fileContent.match(termRegex);
      //   const termCount = termMatches ? termMatches.length : 0;
      //   expect(consoleOutput).to.contain(`Number of terms converted: ${termCount}`);

        fs.readFile(outputFile, 'utf8', (_err, fileContent) => {
          // expect(fileContent).to.contain(`<a href="`);
          done();
        });
      // });
    });
  });
});
