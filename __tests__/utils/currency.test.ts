import { formatCurrencyInput, numberToCurrencyInput, parseCurrencyInput } from '@/src/utils/currency';

describe('formatCurrencyInput', () => {
  it('formata dígitos como BRL (ex: "12221333" → "R$ 122.213,33")', () => {
    const result = formatCurrencyInput('12221333');
    expect(result).toContain('122.213');
    expect(result).toContain('33');
  });

  it('retorna string vazia quando não há dígitos', () => {
    expect(formatCurrencyInput('')).toBe('');
    expect(formatCurrencyInput('abc')).toBe('');
  });

  it('remove caracteres não numéricos antes de processar', () => {
    const withChars = formatCurrencyInput('R$ 1.000,00');
    const withDigits = formatCurrencyInput('100000');
    expect(withChars).toBe(withDigits);
  });

  it('formata valor pequeno corretamente', () => {
    const result = formatCurrencyInput('100');
    expect(result).toContain('1');
    expect(result).toContain('00');
  });
});

describe('numberToCurrencyInput', () => {
  it('formata número para BRL', () => {
    const result = numberToCurrencyInput(122.13);
    expect(result).toContain('122');
    expect(result).toContain('13');
  });

  it('formata zero', () => {
    const result = numberToCurrencyInput(0);
    expect(result).toContain('0');
  });

  it('formata valor grande', () => {
    const result = numberToCurrencyInput(1000000);
    expect(result).toContain('1');
    expect(result).toContain('000');
  });
});

describe('parseCurrencyInput', () => {
  it('extrai float de string formatada', () => {
    expect(parseCurrencyInput('R$ 122.213,33')).toBeCloseTo(122213.33, 2);
  });

  it('retorna 0 para string sem dígitos', () => {
    expect(parseCurrencyInput('')).toBe(0);
    expect(parseCurrencyInput('R$')).toBe(0);
  });

  it('é o inverso de formatCurrencyInput', () => {
    const digits = '5050';
    const formatted = formatCurrencyInput(digits);
    const parsed = parseCurrencyInput(formatted);
    expect(parsed).toBeCloseTo(50.5, 2);
  });
});
