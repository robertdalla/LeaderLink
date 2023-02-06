import { createReducer, on, Action } from '@ngrx/store';
import * as tasksActions from './tasks.actions';
import * as employeesActions from './employees.actions';
import * as recruitmentActions from './recruitment.actions';
import * as workItemsActions from './work-items.actions';
import { IHomeState } from './home-store';

const initialState: IHomeState = {
  tasks: { items: [], errors: [] },
  employees: { items: [], errors: [] },
  recruitment: { items: [], errors: [] },
  workItems: { items: [], errors: [] }
};

const reducer = createReducer(
  initialState,
  on(tasksActions.set, (state, { items }) => ({ ...state, tasks: { items, errors: state.tasks.errors } })),
  on(tasksActions.update, (state, { item }) => ({ ...state, tasks: { items: replace(state.tasks.items, item, x => x.id === item.id), errors: state.tasks.errors } })),
  on(tasksActions.error, (state, { error }) => ({ ...state, tasks: { items: state.tasks.items, errors: [...state.tasks.errors, error] } })),

  on(employeesActions.set, (state, { items }) => ({ ...state, employees: { items, errors: state.employees.errors } })),
  on(employeesActions.update, (state, { item }) => ({ ...state, employees: { items: replace(state.employees.items, item, x => x.id === item.id), errors: state.employees.errors } })),
  on(employeesActions.error, (state, { error }) => ({ ...state, employees: { items: state.employees.items, errors: [...state.employees.errors, error] } })),

  on(recruitmentActions.set, (state, { items }) => ({ ...state, recruitment: { items, errors: state.recruitment.errors } })),
  on(recruitmentActions.update, (state, { item }) => ({ ...state, recruitment: { items: replace(state.recruitment.items, item, x => x.id === item.id), errors: state.recruitment.errors } })),
  on(recruitmentActions.error, (state, { error }) => ({ ...state, recruitment: { items: state.recruitment.items, errors: [...state.recruitment.errors, error] } })),

  on(workItemsActions.set, (state, { items }) => ({ ...state, workItems: { items, errors: state.workItems.errors } })),
  on(workItemsActions.update, (state, { item }) => ({ ...state, workItems: { items: replace(state.workItems.items, item, x => x.id === item.id), errors: state.workItems.errors } })),
  on(workItemsActions.error, (state, { error }) => ({ ...state, workItems: { items: state.workItems.items, errors: [...state.workItems.errors, error] } })),
);

export function homeReducer(state: IHomeState | undefined, action: Action) {
  return reducer(state, action);
}

function replace<T>(items: Array<T>, item: T, predicate: (value: T) => boolean) {
  const index = items.findIndex(predicate);
  if (index > -1) {
    const ret = items.slice(0);
    ret[index] = item;
    return ret;
  }
  return items;
}

