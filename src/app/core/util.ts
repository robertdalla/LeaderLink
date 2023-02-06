import { uniqueId, isNil } from 'lodash';

export const uId = (): number => +uniqueId() * -1;

export const uName = (): string => `mss-${uniqueId()}`;

export const isUrl = (value: string, noDomain: boolean = false): boolean => {
  if (noDomain === true) {
    return /^(?:\w+:)?\/\/([^\s\]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(value);
  } else {
    return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(value);
  }
};

export const isNumber = (value: string): boolean => isFinite(parseFloat(value));

export const isEmpty = (value: string): boolean => isNil(value) || value.trim() === '';

export const parseFloatOrDefault = (value: any, defaultValue = 0): number => {
  const num = parseFloat(value);
  return isFinite(num) ? num : defaultValue;
};
