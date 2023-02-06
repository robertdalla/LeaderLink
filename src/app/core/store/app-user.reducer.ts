import { createReducer, on, Action } from '@ngrx/store';
import { set } from './app-user.actions';
import { AppUser } from '../models';

const initialState: AppUser = undefined;

const reducer = createReducer(
  initialState,
  on(set, (state, { item }) => item)
);

export function appUserReducer(state: AppUser | undefined, action: Action) {
  return reducer(state, action);
}

