import { Country, City } from '.';

type Coordinates = { x: number; y: number };

class GridDictionary {
  private map = new Map<string, City>();

  static key(coords: Coordinates) {
    return `${coords.x}-${coords.y}`;
  }

  set(coords: Coordinates, value: City) {
    const key = GridDictionary.key(coords);
    this.map.set(key, value);
  }

  get(coords: Coordinates) {
    const key = GridDictionary.key(coords);
    return this.map.get(key);
  }
}

export class MapGrid {
  countries: Country[];
  countriesGrid = new GridDictionary();

  minX: number = 0;
  minY: number = 0;
  maxX: number = 0;
  maxY: number = 0;

  /**
   * Create a MapGrid
   * @param {Country[]} countries - Array of countries to set in MapGrid
   */
  constructor(countries: Country[]) {
    this.countries = countries;

    // find max/min coords
    countries.forEach((country) => {
      this.minX = Math.min(this.minX, country.coordinates.xl);
      this.minY = Math.min(this.minY, country.coordinates.yl);
      this.maxX = Math.max(this.maxX, country.coordinates.xh);
      this.maxY = Math.max(this.maxY, country.coordinates.yh);
    });

    this.addCitiesToCountries();
    this.addNeighborsToCities();
  }

  /**
   * Checks if all cities have coins of each motif
   * @returns {boolean} Flag that shows is diffusion completed
   */
  isCompleted(): boolean {
    return this.countries.every((country) => country.isCompleted());
  }

  /**
   * Create and set cities to countries
   */
  addCitiesToCountries(): void {
    const coinTypes = this.countries.map((country) => country.name);
    this.countries.forEach((country, countryIndex) => {
      for (
        let x = country.coordinates.xl;
        x <= country.coordinates.xh;
        x += 1
      ) {
        for (
          let y = country.coordinates.yl;
          y <= country.coordinates.yh;
          y += 1
        ) {
          const city = new City(coinTypes, country.name);
          this.countriesGrid.set({ x, y }, city);
          this.countries[countryIndex].addCity(city);
        }
      }
    });
  }

  addNeighborsToCities(): void {
    for (let x = this.minX; x <= this.maxX; x += 1) {
      for (let y = this.minY; y <= this.maxY; y += 1) {
        const city = this.countriesGrid.get({ x, y });
        if (!city) {
          continue;
        }

        const neighbors: City[] = [];

        const addNeighbor = (x: number, y: number) => {
          const neighborCity = this.countriesGrid.get({ x, y });
          if (neighborCity) {
            neighbors.push(neighborCity);
          }
        };

        if (x < this.maxX) {
          addNeighbor(x + 1, y);
        }
        if (x > this.minY) {
          addNeighbor(x - 1, y);
        }
        if (y < this.maxY) {
          addNeighbor(x, y + 1);
        }
        if (y > this.minY) {
          addNeighbor(x, y - 1);
        }

        if (this.countries.length > 1 && !neighbors.length) {
          throw new Error(`City in ${city.countryName} has no neighbors`);
        }

        city.neighbors = neighbors;
      }
    }
  }

  startDiffusionEmulation(): Map<string, number> {
    this.countriesGrid = new GridDictionary();
    const result = new Map<string, number>();
    let currentDay = 0;

    do {
      this.countries.forEach((country) => {
        country.cities.forEach((city) => {
          city.transportCoinsToNeighbors();
        });

        if (country.isCompleted()) {
          if (!result.has(country.name)) {
            result.set(country.name, currentDay);
          }
        }
      });

      this.countries.forEach((country) => {
        country.cities.forEach((city) => {
          city.updateCoins();
        });
      });
      currentDay += 1;
    } while (!this.isCompleted());

    // check if result have all countries
    this.countries.forEach((country) => {
      if (!result.has(country.name)) {
        result.set(country.name, currentDay);
      }
    });

    return result;
  }
}
