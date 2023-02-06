import { createReducer, on, Action } from '@ngrx/store';
import { reject, filter } from 'lodash';
import { push, remove, clear } from './notification.actions';
import { Notification } from '../models';

const initialState: Notification[] = [];

const reducer = createReducer(
    initialState,
    on(push, (state, {message}) => [message, ...state]),
    on(remove, (state, {message}) => reject(state, ['id', message.id])),
    on(clear, (state) => filter(state, 'actionUrl'))
);

export function notificationReducer(state: Notification[] | undefined, action: Action) {
    return reducer(state, action);
}
