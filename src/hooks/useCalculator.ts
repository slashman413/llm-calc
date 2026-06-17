import { useState, useMemo } from 'react';
import { calculate, type CalcInput, type CalcResult, type Quantization } from '../utils/calculator';

const DEFAULT: CalcInput = {
  paramsBillion: 7,
  quantization: 'Q4_K_M',
  contextKTokens: 8,
};

export function useCalculator() {
  const [input, setInput] = useState<CalcInput>(DEFAULT);

  const result: CalcResult = useMemo(() => calculate(input), [input]);

  function setParams(v: number) {
    setInput((p) => ({ ...p, paramsBillion: v }));
  }
  function setQuant(v: Quantization) {
    setInput((p) => ({ ...p, quantization: v }));
  }
  function setContext(v: number) {
    setInput((p) => ({ ...p, contextKTokens: v }));
  }

  return { input, result, setParams, setQuant, setContext };
}
