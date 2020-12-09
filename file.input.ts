import * as fs from 'fs';

import { IInput } from './interfaces';

export class FileInput implements IInput {
  private readonly data: string[];

  constructor(filename: string) {
    this.data = fs
      .readFileSync(filename, { encoding: 'utf-8' })
      .toString()
      .split('\n')
      .map((line) => line.replace('\r', ''));
  }

  parse(): string[][] {
    const countryStrings: string[][] = [];

    const lines = this.data;

    let lineIndex = 0;
    while (lineIndex < lines.length - 2) {
      const currentLine = lines[lineIndex];
      const countryNumber = parseInt(currentLine);
      if (countryNumber) {
        lineIndex += 1; // move to first country line
        const countries = [];
        for (
          let countryLineIndex = lineIndex;
          countryLineIndex < countryNumber + lineIndex;
          countryLineIndex++
        ) {
          countries.push(lines[countryLineIndex]);
        }
        lineIndex += countryNumber; // move to next number of countries
        countryStrings.push(countries);
      } else {
        throw new Error(
          `Error in input file at '${lines[lineIndex]}'. Expected a number of countries`,
        );
      }
    }

    if (lines[lines.length - 1] !== '0') {
      throw new Error("Input file must end with '0' line");
    }

    return countryStrings;
  }
}
