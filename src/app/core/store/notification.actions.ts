import { createAction, props } from '@ngrx/store';
import { Notification } from '../models';

export const push = createAction('Notification/Push', props<{message: Notification}>());

export const remove = createAction('Notification/Remove', props<{message: Notification}>());

export const clear = createAction('Notification/clear');
