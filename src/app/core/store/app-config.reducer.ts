import { createReducer, on, Action } from '@ngrx/store';
import { set } from './app-config.actions';
import { AppConfigItem } from '../models';

const initialState: AppConfigItem[] = [];

const reducer = createReducer(
  initialState,
  on(set, (state, { items }) => items)
);

export function appConfigReducer(state: AppConfigItem[] | undefined, action: Action) {
  return reducer(state, action);
}

