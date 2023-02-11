import { Component, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isEmpty, find, get, chain } from 'lodash';
import { WindowService, Notification, AppConfigService, NavItem } from 'src/app/core';
import { IEmployees } from '../store/home-store';
import { ReminderItem } from '../services/reminder-item';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-card-leave',
  templateUrl: './card-leave.component.html',
  styleUrls: ['./card-leave.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardLeaveComponent implements OnDestroy {
  private subscription = new Subscription();
  private leaveCategories = [];
  filteredLeaves: Array<ReminderItem> = [];
  notifications: Array<Notification> = [];
  noDataMessage: string;
  filterNoHitsMessage: string;
  links: Array<NavItem> = [];
  hasLeaves: boolean;
  hasFilteredLeaves: boolean;
  isMobileDevice: boolean;
  isExpanded: boolean;

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
    const messages = this.appConfigService.getObject('LeaveCard.Messages');
    const links = this.appConfigService.getObject('LeaveCard.Links');
    this.noDataMessage = get(messages, 'NoData', 'No data available.');
    this.filterNoHitsMessage = get(messages, 'FilterNoHits', 'No data matches your current search or filter.');
    this.leaveCategories = this.appConfigService.getObject('LeaveCard.LeaveCategories', []);
    this.links = chain(links)
      .filter('Enable')
      .map(x => new NavItem(x.Text, x.Url, false, '_blank'))
      .value();
  }

  getIcon = (item: ReminderItem): string => {
    const category = find(this.leaveCategories, ['Name', item.type]);
    return category ? category.Icon : 'fa fa-suitcase';
  }

  toggleExpand = (): void => {
    this.isExpanded = !this.isExpanded;
  }

  expandClosed = (): void => {
    this.isExpanded = false;
  }
}
