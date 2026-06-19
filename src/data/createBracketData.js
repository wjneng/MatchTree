import { sampleBracketData } from './sampleBracketData.js';

export function createBracketData(source = sampleBracketData) {
  return structuredClone(source);
}
