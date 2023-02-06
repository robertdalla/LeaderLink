import { createAction, props } from '@ngrx/store';
import { Notification } from 'src/app/core';
import { EmployeeItem } from '../services/employee-item';

export const set = createAction('Home/Employees/Set', props<{ items: Array<EmployeeItem> }>());

export const update = createAction('Home/Employees/Update', props<{ item: EmployeeItem }>());

export const error = createAction('Home/Employees/Error', props<{ error: Notification }>());

