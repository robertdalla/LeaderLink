import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isEmpty, find, get } from 'lodash';
import { WindowService, Notification, AppConfigService } from 'src/app/core';
import { IEmployees } from '../store/home-store';
import { ReminderItem } from '../services/reminder-item';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-card-team',
  templateUrl: './card-team.component.html',
  styleUrls: ['./card-team.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardTeamComponent implements OnDestroy {
  private subscription = new Subscription();
  private leaveCategories = [];
  filteredLeaves: Array<ReminderItem> = [];
  notifications: Array<Notification> = [];
  noDataMessage: string;
  filterNoHitsMessage: string;
  hasLeaves: boolean;
  hasFilteredLeaves: boolean;
  isMobileDevice: boolean;

  constructor(
    private windowService: WindowService,
    private appConfigService: AppConfigService,
    private homeService: HomeService
  ) {
    this.isMobileDevice = this.windowService.isMobileDevice();
    this.subscription.add(this.appConfigService.appConfig$.subscribe(this.setAppConfig));
    this.subscription.add(this.homeService.employees$.subscribe(this.setNotifications));
    this.subscription.add(this.homeService.leaves$.subscribe(this.setLeaves));
    this.subscription.add(this.homeService.filteredLeaves$.subscribe(this.setFilteredLeaves));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setNotifications = (state: IEmployees): void => {
    this.notifications = state.errors;
  }

  setLeaves = (state: ReminderItem[]): void => {
    this.hasLeaves = !isEmpty(state);
  }

  setFilteredLeaves = (state: ReminderItem[]): void => {
    this.filteredLeaves = state;
    this.hasFilteredLeaves = !isEmpty(this.filteredLeaves);
  }

  setAppConfig = (): void => {
    const messages = this.appConfigService.getObject('RemindersCard.Messages');
    this.noDataMessage = get(messages, 'NoData', 'No data available.');
    this.filterNoHitsMessage = get(messages, 'FilterNoHits', 'No data matches your current search or filter.');
    this.leaveCategories = this.appConfigService.getObject('LeaveCard.LeaveCategories', []);
  }

  getIcon = (item: ReminderItem): string => {
    const icon = 'fa fa-suitcase';
    const category = find(this.leaveCategories, ['Name', item.type]);
    return category ? category.Icon : icon;
  }
}
