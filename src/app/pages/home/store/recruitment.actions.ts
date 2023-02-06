import { createAction, props } from '@ngrx/store';
import { Notification } from 'src/app/core';
import { RecruitmentItem } from '../services/recruitment-item';

export const set = createAction('Home/Recruitment/Set', props<{ items: Array<RecruitmentItem> }>());

export const update = createAction('Home/Recruitment/Update', props<{ item: RecruitmentItem }>());

export const error = createAction('Home/Recruitment/Error', props<{ error: Notification }>());

