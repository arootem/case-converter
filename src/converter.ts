export type CaseType = 'upper' | 'lower' | 'snake' | 'camel' | 'pascal' | 'kebab' | 'upperSnake';

function splitWords(text: string): string[] {
  const parts = text.split(/[^a-zA-Z0-9]+/).filter(p => p.length > 0);
  const result: string[] = [];
  for (const part of parts) {
    const words = part.match(/[A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g);
    if (words) {
      for (const w of words) {
        result.push(w);
      }
    }
  }
  return result;
}

function isAcronym(s: string): boolean {
  return /^[A-Z]{2,}$/.test(s);
}

function toUpper(words: string[]): string {
  return words.join('_').toUpperCase();
}

function toLower(words: string[]): string {
  return words.join('_').toLowerCase();
}

function toSnake(words: string[]): string {
  const out: string[] = [];
  for (const w of words) {
    out.push(isAcronym(w) ? w : w.toLowerCase());
  }
  return out.join('_');
}

function toUpperSnake(words: string[]): string {
  const out: string[] = [];
  for (const w of words) {
    out.push(w.toUpperCase());
  }
  return out.join('_');
}

function toKebab(words: string[]): string {
  const out: string[] = [];
  for (const w of words) {
    out.push(isAcronym(w) ? w : w.toLowerCase());
  }
  return out.join('-');
}

function toCamel(words: string[]): string {
  let result = '';
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (i === 0) {
      result += w.toLowerCase();
    } else if (isAcronym(w)) {
      result += w;
    } else {
      const low = w.toLowerCase();
      result += low.charAt(0).toUpperCase() + low.slice(1);
    }
  }
  return result;
}

function toPascal(words: string[]): string {
  let result = '';
  for (const w of words) {
    if (isAcronym(w)) {
      result += w;
    } else {
      const low = w.toLowerCase();
      result += low.charAt(0).toUpperCase() + low.slice(1);
    }
  }
  return result;
}

const CONVERTERS: Record<CaseType, (words: string[]) => string> = {
  upper: toUpper,
  lower: toLower,
  snake: toSnake,
  camel: toCamel,
  pascal: toPascal,
  kebab: toKebab,
  upperSnake: toUpperSnake,
};

export function convert(text: string, type: CaseType): string {
  const words = splitWords(text);
  if (words.length === 0) {
    return text;
  }
  return CONVERTERS[type](words);
}

export function detectCase(text: string): string {
  if (!text) {
    return 'unknown';
  }
  if (/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(text)) {
    return 'UPPER_SNAKE_CASE';
  }
  if (/^[a-z0-9]+(_[a-z0-9]+)+$/.test(text)) {
    return 'snake_case';
  }
  if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(text)) {
    return 'kebab-case';
  }
  if (/^[A-Z][a-zA-Z0-9]*$/.test(text) && /[a-z]/.test(text)) {
    return 'PascalCase';
  }
  if (/^[a-z][a-zA-Z0-9]*$/.test(text) && /[A-Z]/.test(text)) {
    return 'camelCase';
  }
  if (text === text.toUpperCase() && /[A-Z]/.test(text)) {
    return 'UPPER';
  }
  if (text === text.toLowerCase() && /[a-z]/.test(text)) {
    return 'lower';
  }
  return 'unknown';
}