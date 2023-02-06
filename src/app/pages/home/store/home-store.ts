import { Notification, AppConfigItem } from 'src/app/core';
import { TaskItem } from '../services/task-item';
import { EmployeeItem } from '../services/employee-item';
import { RecruitmentItem } from '../services/recruitment-item';
import { WorkItem } from '../services/work-item';

export interface IHomeStore {
  appConfig: Array<AppConfigItem>;
  home: IHomeState;
}

export interface IHomeState {
  tasks: ITasks;
  employees: IEmployees;
  recruitment: IRecruitment;
  workItems: IWorkItems;
}

export interface ITasks {
  items: Array<TaskItem>;
  errors: Array<Notification>;
}

export interface IEmployees {
  items: Array<EmployeeItem>;
  errors: Array<Notification>;
}

export interface IRecruitment {
  items: Array<RecruitmentItem>;
  errors: Array<Notification>;
}

export interface IWorkItems {
  items: Array<WorkItem>;
  errors: Array<Notification>;
}
