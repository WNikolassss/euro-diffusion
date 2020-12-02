import { IProcessor, IInput } from './interfaces';

import { FileInput } from './file.input';
import { Processor } from './processor';

class Application {
  private processor: IProcessor;
  private input: IInput;

  constructor(filename: string) {
    this.input = new FileInput(filename);
    this.processor = new Processor();
  }

  exec() {
    const parsedData = this.input.parse();
    this.processor.processAndPrint(parsedData);
  }
}

const app = new Application('input.txt');
app.exec();
