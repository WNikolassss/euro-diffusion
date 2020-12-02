export interface IProcessor {
  process: (...args: any[]) => void;
  processAndPrint: (...args: any[]) => void;
}
