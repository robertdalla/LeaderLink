import { createAction, props } from '@ngrx/store';
import { Notification } from 'src/app/core';
import { TaskItem } from '../services/task-item';

export const set = createAction('Home/Tasks/Set', props<{ items: Array<TaskItem> }>());

export const update = createAction('Home/Tasks/Update', props<{ item: TaskItem }>());

export const error = createAction('Home/Tasks/Error', props<{ error: Notification }>());

