import { createAction, props } from '@ngrx/store';
import { AppUser } from '../models';

export const set = createAction('User/Set', props<{ item: AppUser }>());
