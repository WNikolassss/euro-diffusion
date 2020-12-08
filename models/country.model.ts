import { City } from '.';

export interface CountryCoordinates {
  xl: number;
  yl: number;
  xh: number;
  yh: number;
}

export class Country {
  cities: City[];
  name: string;
  coordinates: CountryCoordinates;
  static MIN_COORDINATE = 1;
  static MAX_COORDINATE = 10;
  static NAME_MAX_LENGTH = 25;

  /**
   * Create a Country
   * @param {string} name - Name of country
   * @param {CountryCoordinates} coordinates - coordinates of country
   * @throws Will throw an error if country have invalid coordinates
   * @throws Will throw an error if name length is bigger then NAME_MAX_LENGTH
   */
  constructor(name: string, coordinates: CountryCoordinates) {
    if (!Country.areCoordinatesValid(coordinates)) {
      throw new Error('Coordinates are invalid');
    }
    if (name.length > Country.NAME_MAX_LENGTH) {
      throw new Error(
        `Name must be less than ${Country.NAME_MAX_LENGTH} characters`,
      );
    }
    this.cities = [];
    this.name = name;
    this.coordinates = coordinates;
  }

  /**
   * Checks if coordinates are valid
   * @param {CountryCoordinates}
   */
  static areCoordinatesValid({ xl, yl, xh, yh }: CountryCoordinates): boolean {
    const isCorrectLowHighRange = (low: number, high: number) => {
      return low <= high;
    };

    const isIntegerInBounds = (coordinate: number) => {
      return (
        Number.isInteger(coordinate) &&
        coordinate >= Country.MIN_COORDINATE &&
        coordinate <= Country.MAX_COORDINATE
      );
    };

    return [
      isIntegerInBounds(xl),
      isIntegerInBounds(yl),
      isIntegerInBounds(xh),
      isIntegerInBounds(yh),
      isCorrectLowHighRange(xl, xh),
      isCorrectLowHighRange(yl, yh),
    ].every(Boolean);
  }

  addCity(city: City): void {
    this.cities.push(city);
  }

  isCompleted(): boolean {
    return this.cities.every((city) => city.isCompleted());
  }

  static parseCountryString(countryString: string): Country {
    const [name, ...coordinates] = countryString.split(' ');
    const [xl, yl, xh, yh] = coordinates.map((coordinate) =>
      parseInt(coordinate),
    );
    return new Country(name, { xl, yl, xh, yh } as CountryCoordinates);
  }
}

export default Country;
