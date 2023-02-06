import * as moment from 'moment';
import { environment } from 'src/environments/environment';

export const now = (): Date => (environment.mockClock ? moment(environment.mockClock) : moment()).toDate();

export const today = (): Date => (environment.mockClock ? moment(environment.mockClock) : moment()).startOf('day').toDate();

export const parseDate = (value: string, defaultValue: Date = undefined): Date => {
  const date = moment(value);
  return date.isValid() ? date.startOf('day').toDate() : defaultValue;
};

export const parseDateTime = (value: string, defaultValue: Date = undefined): Date => {
  const date = moment(value);
  return date.isValid() ? date.toDate() : defaultValue;
};

export const addYears = (value: Date, adds: number): Date => {
  const date = moment(value);
  return date.isValid() ? date.add(adds, 'years').toDate() : undefined;
};

export const addMonths = (value: Date, adds: number): Date => {
  const date = moment(value);
  return date.isValid() ? date.add(adds, 'months').toDate() : undefined;
};

export const addWeeks = (value: Date, adds: number): Date => {
  const date = moment(value);
  return date.isValid() ? date.add(adds, 'weeks').toDate() : undefined;
};

export const addDays = (value: Date, adds: number): Date => {
  const date = moment(value);
  return date.isValid() ? date.add(adds, 'days').toDate() : undefined;
};

export const setYear = (value: Date, year: number): Date => {
  const date = moment(value);
  return date.isValid() ? date.year(year).toDate() : undefined;
};

export const startOfWeek = (value: Date): Date => {
  const date = moment(value);
  return date.isValid() ? date.startOf('week').toDate() : undefined;
};

export const endOfWeek = (value: Date): Date => {
  const date = moment(value);
  return date.isValid() ? date.endOf('week').toDate() : undefined;
};

export const comingMonday = (value: Date, week: number = 1): Date => {
  const date = moment(value);
  return date.isValid() ? date.day('monday').add(week * 7, 'day').toDate() : undefined;
};
