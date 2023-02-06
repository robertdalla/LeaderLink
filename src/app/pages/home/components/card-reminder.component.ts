import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isEmpty, filter, sortBy, get, find } from 'lodash';
import { WindowService, Notification, AppConfigService } from 'src/app/core';
import { IEmployees } from '../store/home-store';
import { ReminderItem } from '../services/reminder-item';
import { HomeService } from '../services/home.service';
import { BirthdayAnniversaryItem } from '../services/birthday-anniversary-item';

enum SortColumn {
  Name = 'fullName',
  Birthday = 'birthday',
  Anniversary = 'powerlinkStartDate'
}

@Component({
  selector: 'app-card-reminder',
  templateUrl: './card-reminder.component.html',
  styleUrls: ['./card-reminder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardReminderComponent implements OnDestroy {
  private subscription = new Subscription();
  private reminderCategories = [];
  birthdaysAndAnniversaries: Array<BirthdayAnniversaryItem> = [];
  filteredOtherKeyDays: Array<ReminderItem> = [];
  filteredBirthdaysAnniversaries: Array<ReminderItem> = [];
  notifications: Array<Notification> = [];
  noDataMessage: string;
  filterNoHitsMessage: string;
  anniversaryTooltip: string;
  hasReminders: boolean;
  hasOtherKeyDays: boolean;
  hasBirthdaysAnniversaries: boolean;
  hasFullList: boolean;
  isMobileDevice: boolean;
  isExpanded: boolean;
  isFullListExpanded: boolean;
  sortColumn = SortColumn;
  sortingDesc: boolean;
  sortingColumn = SortColumn.Birthday;

  constructor(
    private windowService: WindowService,
    private appConfigService: AppConfigService,
    private homeService: HomeService
  ) {
    this.isMobileDevice = this.windowService.isMobileDevice();
    this.subscription.add(this.appConfigService.appConfig$.subscribe(this.setAppConfig));
    this.subscription.add(this.homeService.employees$.subscribe(this.setNotifications));
    this.subscription.add(this.homeService.birthdaysAndAnniversaries$.subscribe(this.setBirthdaysAndAnniversaries));
    this.subscription.add(this.homeService.reminders$.subscribe(this.setReminders));
    this.subscription.add(this.homeService.filteredReminders$.subscribe(this.setFilteredReminders));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setNotifications = (state: IEmployees): void => {
    this.notifications = state.errors;
  }

  setBirthdaysAndAnniversaries = (state: BirthdayAnniversaryItem[]): void => {
    this.birthdaysAndAnniversaries = state;
    this.hasFullList = !isEmpty(state);
  }

  setReminders = (state: ReminderItem[]): void => {
    this.hasReminders = !isEmpty(state);
  }

  setFilteredReminders = (state: ReminderItem[]): void => {
    this.filteredOtherKeyDays = filter(state, (x: ReminderItem) => x.type !== 'Birthday' && x.type !== 'Anniversary');
    this.filteredBirthdaysAnniversaries = filter(state, (x: ReminderItem) => x.type === 'Birthday' || x.type === 'Anniversary');
    this.hasOtherKeyDays = !isEmpty(this.filteredOtherKeyDays);
    this.hasBirthdaysAnniversaries = !isEmpty(this.filteredBirthdaysAnniversaries);
  }

  setAppConfig = (): void => {
    const messages = this.appConfigService.getObject('RemindersCard.Messages');
    this.noDataMessage = get(messages, 'NoData', 'No data available.');
    this.filterNoHitsMessage = get(messages, 'FilterNoHits', 'No data matches your current search or filter.');
    this.anniversaryTooltip = get(messages, 'AnniversaryTooltip', 'Anniversaries do not necessarily indicate continuity of service.');
    this.reminderCategories = this.appConfigService.getObject('RemindersCard.ReminderCategories', []);
  }

  toggleExpand = (): void => {
    this.isExpanded = !this.isExpanded;
  }

  toggleFullListExpand = (): void => {
    this.isFullListExpanded = !this.isFullListExpanded;
  }

  toggleNameSort = (): void => {
    this.sortingDesc = this.sortingColumn === SortColumn.Name ? !this.sortingDesc : false;
    this.sortingColumn = SortColumn.Name;
    const birthdaysAndAnniversaries = sortBy(this.birthdaysAndAnniversaries, this.sortingColumn);
    this.birthdaysAndAnniversaries = this.sortingDesc ? birthdaysAndAnniversaries.reverse() : birthdaysAndAnniversaries;
  }

  toggleBirthdaySort = (): void => {
    this.sortingDesc = this.sortingColumn === SortColumn.Birthday ? !this.sortingDesc : false;
    this.sortingColumn = SortColumn.Birthday;
    const birthdaysAndAnniversaries = sortBy(this.birthdaysAndAnniversaries, this.sortingColumn);
    this.birthdaysAndAnniversaries = this.sortingDesc ? birthdaysAndAnniversaries.reverse() : birthdaysAndAnniversaries;
  }

  toggleAnniversarySort = (): void => {
    this.sortingDesc = this.sortingColumn === SortColumn.Anniversary ? !this.sortingDesc : false;
    this.sortingColumn = SortColumn.Anniversary;
    const birthdaysAndAnniversaries = sortBy(this.birthdaysAndAnniversaries, this.sortingColumn);
    this.birthdaysAndAnniversaries = this.sortingDesc ? birthdaysAndAnniversaries.reverse() : birthdaysAndAnniversaries;
  }

  getIcon = (item: ReminderItem): string => {
    const category = find(this.reminderCategories, ['Name', item.type]);
    return category ? category.Icon : 'fa fa-bookmark-o';
  }
}
