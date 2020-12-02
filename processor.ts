import { MapGrid, Country } from './models';
import { IProcessor } from './interfaces';

export class Processor {
  process(countriesStrings: string[]) {
    try {
      const countries: Country[] = [];
      countriesStrings.forEach((countryString) => {
        countries.push(Country.parseCountryString(countryString));
      });
      const result = new MapGrid(countries).startDiffusionEmulation();
      for (const [countryName, days] of result.entries()) {
        console.log(countryName, days);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }

  processAndPrint(countryStrings: string[][]): void {
    countryStrings.forEach((caseCountries: string[], caseNumber) => {
      console.log(`Case Number ${caseNumber + 1}`);
      this.process(caseCountries);
    });
  }
}
