/**
 * Formata uma string de dígitos como moeda BRL.
 * Ex: "12221333" → "R$ 122.213,33"
 */
export function formatCurrencyInput(digits: string): string {
  const onlyDigits = digits.replace(/\D/g, '');
  if (!onlyDigits) return '';
  const num = parseInt(onlyDigits, 10);
  return (num / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Converte um valor numérico para a string formatada usada no input.
 * Ex: 122.13 → "R$ 122,13"
 */
export function numberToCurrencyInput(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Extrai o número float de uma string formatada.
 * Ex: "R$ 122.213,33" → 122213.33
 */
export function parseCurrencyInput(formatted: string): number {
  const digits = formatted.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10) / 100;
}
