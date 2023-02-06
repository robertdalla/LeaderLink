import { createAction, props } from '@ngrx/store';
import { AppConfigItem } from '../models';

export const set = createAction('AppConfig/Set', props<{ items: Array<AppConfigItem> }>());
