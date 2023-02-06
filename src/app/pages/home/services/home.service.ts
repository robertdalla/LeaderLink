import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { get, filter, map as lodashMap, isEmpty, find, sortBy, chain } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, take, debounceTime, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  WindowService, ApiService, SharePointService, AppConfigService,
  today, setYear, addDays, addYears
} from 'src/app/core';
import { IHomeStore, IEmployees, IRecruitment, ITasks, IWorkItems } from '../store/home-store';
import * as tasksActions from '../store/tasks.actions';
import * as employeesActions from '../store/employees.actions';
import * as recruitmentActions from '../store/recruitment.actions';
import * as workItemsActions from '../store/work-items.actions';
import { TaskItem } from './task-item';
import { EmployeeItem } from './employee-item';
import { FilterType } from './filter-type';
import { ReminderItem } from './reminder-item';
import { BirthdayAnniversaryItem } from './birthday-anniversary-item';
import { RecruitmentItem } from './recruitment-item';
import { WorkItem } from './work-item';

const probationKeyDateTaskType = '01 Expiry of Probation';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private readonly serviceCore: ServiceCore;
  private readonly searchTerm = new BehaviorSubject<string>('');
  private readonly filterType = new BehaviorSubject<FilterType>(FilterType.All);
  private readonly birthdaysAndAnniversaries = new BehaviorSubject<BirthdayAnniversaryItem[]>([]);
  private readonly leaves = new BehaviorSubject<ReminderItem[]>([]);
  private readonly filteredLeaves = new BehaviorSubject<ReminderItem[]>([]);
  private readonly reminders = new BehaviorSubject<ReminderItem[]>([]);
  private readonly filteredReminders = new BehaviorSubject<ReminderItem[]>([]);
  private readonly filteredEmployees = new BehaviorSubject<EmployeeItem[]>([]);

  readonly searchTerm$ = this.searchTerm.pipe(debounceTime(500));
  readonly filterType$ = this.filterType.asObservable();
  readonly employees$: Observable<IEmployees>;
  readonly tasks$: Observable<ITasks>;
  readonly recruitment$: Observable<IRecruitment>;
  readonly workItems$: Observable<IWorkItems>;
  readonly filteredEmployees$ = this.filteredEmployees.asObservable();
  readonly birthdaysAndAnniversaries$ = this.birthdaysAndAnniversaries.asObservable();
  readonly leaves$ = this.leaves.asObservable();
  readonly filteredLeaves$ = this.filteredLeaves.asObservable();
  readonly reminders$ = this.reminders.asObservable();
  readonly filteredReminders$ = this.filteredReminders.asObservable();

  searchValue = '';
  filterValue = FilterType.Direct;

  constructor(
    protected store: Store<IHomeStore>,
    protected windowService: WindowService,
    protected sharePointService: SharePointService,
    protected apiService: ApiService,
    protected appConfigService: AppConfigService
  ) {
    this.serviceCore = !!environment.useAppConfigAsMockServer
      ? new AppConfigMockServiceCore(store, windowService, sharePointService, apiService, appConfigService)
      : new ServiceCore(store, windowService, sharePointService, apiService, appConfigService);

    this.employees$ = this.store.pipe(select(x => x.home.employees));
    this.tasks$ = this.store.pipe(select(x => x.home.tasks));
    this.recruitment$ = this.store.pipe(select(x => x.home.recruitment));
    this.workItems$ = this.store.pipe(select(x => x.home.workItems));

    this.employees$.subscribe(this.onEmployeesChange);
    this.searchTerm$.subscribe(this.onSearchChange);
    this.filterType$.subscribe(this.onFilterChange);
  }

  onSearch(value: string): void {
    this.searchTerm.next(value);
    this.searchValue = value;
  }

  onFilter(value: FilterType): void {
    this.filterType.next(value);
    this.filterValue = value;
  }

  loadTasks(): Observable<TaskItem[]> {
    return this.serviceCore.loadTasks();
  }

  loadEmployees(): Observable<EmployeeItem[]> {
    return this.serviceCore.loadEmployees();
  }

  loadRecruitment(): Observable<RecruitmentItem[]> {
    return this.serviceCore.loadRecruitment();
  }

  loadWorkItems(): Observable<WorkItem[]> {
    return this.serviceCore.loadWorkItems();
  }

  private onEmployeesChange = (state: IEmployees): void => {
    this.updateBirthdaysAndAnniversaries(state.items);
    this.updateLeaves(state.items);
    this.updateReminders(state.items);
    this.filterLeaves(this.searchValue, this.filterValue);
    this.filterReminders(this.searchValue, this.filterValue);
    this.filterEmployees(this.searchValue, this.filterValue);
  }

  private onSearchChange = (state: string): void => {
    this.filterLeaves(state, this.filterValue);
    this.filterReminders(state, this.filterValue);
    this.filterEmployees(state, this.filterValue);
  }

  private onFilterChange = (state: FilterType): void => {
    this.filterLeaves(this.searchValue, state);
    this.filterEmployees(this.searchValue, state);
    this.filterReminders(this.searchValue, state);
  }

  private updateBirthdaysAndAnniversaries = (state: EmployeeItem[]): void => {
    const now = today();
    const birthdaysAndAnniversaries = new Array<BirthdayAnniversaryItem>();
    state.map(x => {
      if (x.hierarchyLevel <= 2 && x.dateOfBirth && x.powerlinkStartDate) {
        const year = now.getFullYear();
        const startYear = x.powerlinkStartDate.getFullYear();
        birthdaysAndAnniversaries.push(BirthdayAnniversaryItem.FromObject({
          fullName: x.fullName,
          birthday: setYear(x.dateOfBirth, year),
          anniversary: setYear(x.powerlinkStartDate, startYear < year ? year : year + 1),
          powerlinkStartDate: x.powerlinkStartDate
        }));
      }
    });
    this.birthdaysAndAnniversaries.next(sortBy(birthdaysAndAnniversaries, 'birthday'));
  }

  private updateLeaves = (state: EmployeeItem[]): void => {
    const dateRange = +this.appConfigService.getValue('Home.DateRangeFilter');
    const now = today();
    const end = addDays(now, dateRange);
    const leaves = new Array<ReminderItem>();
    state.map(x => {
      if (!isEmpty(x.leaves)) {
        x.leaves.map(y => {
          if (y.leaveStartDate <= end && y.leaveEndDate >= now) {
            leaves.push(ReminderItem.FromObject({
              type: y.leaveCategory,
              typeDescription: y.leaveType,
              content: x.fullName,
              start: y.leaveStartDate,
              end: y.leaveEndDate,
              filterType: x.filterType
            }));
          }
        });
      }
    });
    this.leaves.next(sortBy(leaves, 'start'));
  }

  private updateReminders = (state: EmployeeItem[]): void => {
    const dateRange = +this.appConfigService.getValue('Home.DateRangeFilter');
    const now = today();
    const end = addDays(now, dateRange);
    const year = now.getFullYear();
    const otherKeyDatesTaskTypes = this.appConfigService.getObject('RemindersCard.ReminderCategories', []);
    const reminders = new Array<ReminderItem>();
    state.map(x => {
      const probationKeyDate = find(x.keyDates, ['taskType', probationKeyDateTaskType]);
      if (probationKeyDate) {
        reminders.push(ReminderItem.FromObject({
          type: 'Probation',
          content: x.fullName,
          start: probationKeyDate.taskDate,
          filterType: x.filterType
        }));
      }

      otherKeyDatesTaskTypes.map(y => {
        const keyDate = find(x.keyDates, ['taskType', y.Name]);
        if (keyDate) {
          reminders.push(ReminderItem.FromObject({
            type: keyDate.taskType,
            typeDescription: keyDate.taskDescription,
            content: x.fullName,
            start: keyDate.taskDate,
            filterType: x.filterType
          }));
        }
      });

      x.assignments.map(y => {
        reminders.push(ReminderItem.FromObject({
          type: 'Assignment',
          typeDescription: 'Secondment/temporary assignment end',
          content: x.fullName,
          start: y.employmentEndDate,
          filterType: x.filterType
        }));
      });

      if (x.dateOfBirth) {
        reminders.push(ReminderItem.FromObject({
          type: 'Birthday',
          content: x.fullName,
          start: setYear(x.dateOfBirth, year),
          filterType: x.filterType
        }));
      }

      if (x.powerlinkStartDate) {
        const anniversaryDate = setYear(x.powerlinkStartDate, year);
        const yearCount = year - x.powerlinkStartDate.getFullYear();
        if (yearCount > 0) {
          reminders.push(ReminderItem.FromObject({
            type: 'Anniversary',
            typeDescription: `PQ anniversary: ${yearCount} year${yearCount > 1 ? 's' : ''}`,
            content: x.fullName,
            start: anniversaryDate,
            filterType: x.filterType
          }));
        }
      }
    });
    this.reminders.next(
      chain(reminders)
        .filter(x => x.start >= now && x.start <= end)
        .sortBy('start')
        .value()
    );
  }

  private isFilterMatch = (filterType: FilterType, filterValue: FilterType): boolean => {
    return filterValue === FilterType.All || filterValue === filterType;
  }

  private isSearchMatch = (content: string, searchValue: string): boolean => {
    return content.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  }

  private filterEmployees = (searchValue: string, filterValue: FilterType): void => {
    const skipSearch = isEmpty(searchValue) || searchValue.length < 3;
    this.employees$.pipe(take(1)).subscribe(
      x => this.filteredEmployees.next(skipSearch
        ? filter(x.items, (xf: EmployeeItem) => this.isFilterMatch(xf.filterType, filterValue))
        : filter(x.items, (xf: EmployeeItem) => this.isFilterMatch(xf.filterType, filterValue) && this.isSearchMatch(xf.fullName, searchValue))));
  }

  private filterLeaves = (searchValue: string, filterValue: FilterType): void => {
    const skipSearch = isEmpty(searchValue) || searchValue.length < 3;
    this.leaves.pipe(take(1)).subscribe(
      x => this.filteredLeaves.next(skipSearch
        ? filter(x, (xf: ReminderItem) => this.isFilterMatch(xf.filterType, filterValue))
        : filter(x, (xf: ReminderItem) => this.isFilterMatch(xf.filterType, filterValue) && this.isSearchMatch(xf.content, searchValue))));
  }

  private filterReminders = (searchValue: string, filterValue: FilterType): void => {
    const skipSearch = isEmpty(searchValue) || searchValue.length < 3;
    this.reminders.pipe(take(1)).subscribe(
      x => this.filteredReminders.next(skipSearch
        ? filter(x, (xf: ReminderItem) => this.isFilterMatch(xf.filterType, filterValue))
        : filter(x, (xf: ReminderItem) => this.isFilterMatch(xf.filterType, filterValue) && this.isSearchMatch(xf.content, searchValue))));
  }
}

class ServiceCore {
  private readonly isMobileDevice: boolean;

  constructor(
    protected store: Store<IHomeStore>,
    protected windowService: WindowService,
    protected sharePointService: SharePointService,
    protected apiService: ApiService,
    protected appConfigService: AppConfigService) {
    this.isMobileDevice = this.windowService.isMobileDevice();
  }

  loadTasks(): Observable<TaskItem[]> {
    const now = today();
    const getListItems$ = this.sharePointService.getListItems(
      'Tasks',
      {
        $select: 'Mode,TaskType,TaskText,StaticValue,ClickOrTouchAction,ClickOrTouchURL,DynamicValueEndpoint,DynamicValueResponseElement,CurrentFrom,CurrentTo',
        $filter: `CurrentFrom le datetime'${now.toISOString()}' and CurrentTo ge datetime'${now.toISOString()}'`,
        $orderby: 'DisplayOrder asc'
      });

    return getListItems$.pipe(
      map(x => lodashMap(x, TaskItem.FromObject)),
      tap(
        items => {
          const tasks = filter(items, x => x.canDisplay(this.isMobileDevice));
          this.store.dispatch(tasksActions.set({ items: tasks }));
          tasks.forEach(this.loadDynamicTask);
        },
        error => this.store.dispatch(tasksActions.error({ error }))
      )
    );
  }

  loadEmployees(): Observable<EmployeeItem[]> {
    return this.apiService.get(this.appConfigService.getApiUrl('bidw/employees'))
      .pipe(
        map(x => lodashMap(x, EmployeeItem.FromObject)),
        tap(
          items => this.store.dispatch(employeesActions.set({ items })),
          error => this.store.dispatch(employeesActions.error({ error }))
        ));
  }

  loadRecruitment(): Observable<RecruitmentItem[]> {
    return this.apiService.get(this.appConfigService.getApiUrl('successFactors/jobRequisitions/me'))
      .pipe(
        map(x => lodashMap(x, RecruitmentItem.FromObject)),
        tap(
          items => this.store.dispatch(recruitmentActions.set({ items })),
          error => this.store.dispatch(recruitmentActions.error({ error }))
        ));
  }

  loadWorkItems(): Observable<WorkItem[]> {
    return this.apiService.get(this.appConfigService.getApiUrl('sap/workItems'))
      .pipe(
        map(x => lodashMap(x, WorkItem.FromObject)),
        tap(
          items => this.store.dispatch(workItemsActions.set({ items })),
          error => this.store.dispatch(workItemsActions.error({ error }))
        ));
  }

  protected loadDynamicTask = (task: TaskItem): void => {
    if (task.isDynamic) {
      if (task.dynamicValueEndpoint === 'successFactors/jobRequisitions/me' && task.dynamicValueResponseElement === 'count') {
        this.store.pipe(select(x => x.home.recruitment))
          .subscribe(
            data => this.store.dispatch(tasksActions.update({ item: this.updateJobRequisitionsTask(task, data.items) })),
            error => this.store.dispatch(tasksActions.update({ item: task.updateErrorMessage(error) }))
          );
      } else if (task.dynamicValueEndpoint === 'sap/workItems') {
        this.store.pipe(select(x => x.home.workItems))
          .subscribe(
            data => this.store.dispatch(tasksActions.update({ item: this.updateWorkItemsTask(task, data.items) })),
            error => this.store.dispatch(tasksActions.update({ item: task.updateErrorMessage(error) }))
          );
      } else {
        this.apiService.get(this.appConfigService.getApiUrl(task.dynamicValueEndpoint))
          .subscribe(
            data => this.store.dispatch(tasksActions.update({ item: this.updateTask(task, data) })),
            error => this.store.dispatch(tasksActions.update({ item: task.updateErrorMessage(error) }))
          );
      }
    }
  }

  protected updateJobRequisitionsTask = (task: TaskItem, items: Array<RecruitmentItem>): TaskItem => {
    const filteredItems = filter(items, (x: RecruitmentItem) => x.currentOwner && x.currentOwner.email.indexOf(this.appConfigService.appUser.username) > -1);
    return task.updateStaticValue(filteredItems.length);
  }

  protected updateWorkItemsTask = (task: TaskItem, items: Array<WorkItem>): TaskItem => {
    const workItem = find(items, ['id', task.dynamicValueResponseElement]);
    return task.updateStaticValue(workItem ? workItem.count : 0);
  }

  protected updateTask = (task: TaskItem, data: any): TaskItem => {
    const value = get(data, task.dynamicValueResponseElement);
    return task.updateStaticValue(value);
  }
}

class AppConfigMockServiceCore extends ServiceCore {
  constructor(
    protected store: Store<IHomeStore>,
    protected windowService: WindowService,
    protected sharePointService: SharePointService,
    protected apiService: ApiService,
    protected appConfigService: AppConfigService) {
    super(store, windowService, sharePointService, apiService, appConfigService);
  }

  loadEmployees(): Observable<EmployeeItem[]> {
    return this.appConfigService.appConfig$.pipe(
      take(1),
      map(() => this.appConfigService.getObject('bidw/employees', [])),
      map(x => lodashMap(x, EmployeeItem.FromObject)),
      tap(
        items => this.store.dispatch(employeesActions.set({ items })),
        error => this.store.dispatch(employeesActions.error({ error }))
      )
    );
  }

  loadRecruitment(): Observable<RecruitmentItem[]> {
    return this.appConfigService.appConfig$.pipe(
      take(1),
      map(() => this.appConfigService.getObject('successFactors/jobRequisitions/me', [])),
      map(x => lodashMap(x, RecruitmentItem.FromObject)),
      tap(
        items => this.store.dispatch(recruitmentActions.set({ items })),
        error => this.store.dispatch(recruitmentActions.error({ error }))
      )
    );
  }

  loadWorkItems(): Observable<WorkItem[]> {
    return this.appConfigService.appConfig$.pipe(
      take(1),
      map(() => this.appConfigService.getObject('sap/workItems', [])),
      map(x => lodashMap(x, WorkItem.FromObject)),
      tap(
        items => this.store.dispatch(workItemsActions.set({ items })),
        error => this.store.dispatch(workItemsActions.error({ error }))
      )
    );
  }

  protected loadDynamicTask = (task: TaskItem): void => {
    if (task.isDynamic) {
      if (task.dynamicValueEndpoint === 'successFactors/jobRequisitions/me' && task.dynamicValueResponseElement === 'count') {
        this.store.pipe(select(x => x.home.recruitment))
          .subscribe(
            data => this.store.dispatch(tasksActions.update({ item: this.updateJobRequisitionsTask(task, data.items) })),
            error => this.store.dispatch(tasksActions.update({ item: task.updateErrorMessage(error) }))
          );
      } else if (task.dynamicValueEndpoint === 'sap/workItems') {
        this.store.pipe(select(x => x.home.workItems))
          .subscribe(
            data => this.store.dispatch(tasksActions.update({ item: this.updateWorkItemsTask(task, data.items) })),
            error => this.store.dispatch(tasksActions.update({ item: task.updateErrorMessage(error) }))
          );
      } else {
        this.appConfigService.appConfig$.pipe(
          take(1),
          map(() => this.appConfigService.getObject(y => y.name.startsWith(task.dynamicValueEndpoint), {})),
          tap(
            data => this.store.dispatch(tasksActions.update({ item: this.updateTask(task, data) })),
            error => this.store.dispatch(tasksActions.update({ item: task.updateErrorMessage(error) }))
          )
        );
      }
    }
  }
}
