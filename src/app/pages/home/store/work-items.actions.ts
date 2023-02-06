import { createAction, props } from '@ngrx/store';
import { Notification } from 'src/app/core';
import { WorkItem } from '../services/work-item';

export const set = createAction('Home/WorkItems/Set', props<{ items: Array<WorkItem> }>());

export const update = createAction('Home/WorkItems/Update', props<{ item: WorkItem }>());

export const error = createAction('Home/WorkItems/Error', props<{ error: Notification }>());

