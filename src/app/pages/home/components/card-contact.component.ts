import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isEmpty, get } from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WindowService, Notification, AppConfigService } from 'src/app/core';
import { IEmployees } from '../store/home-store';
import { EmployeeItem } from '../services/employee-item';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-card-contact',
  templateUrl: './card-contact.component.html',
  styleUrls: ['./card-contact.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardContactComponent implements OnDestroy {
  private subscription = new Subscription();
  filteredEmployees: Array<EmployeeItem> = [];
  notifications: Array<Notification> = [];
  noDataMessage: string;
  filterNoHitsMessage: string;
  hasEmployees: boolean;
  hasFilteredEmployees: boolean;
  isMobileDevice: boolean;
  isExpanded: boolean;
  phoneLink: string;

  constructor(
    private windowService: WindowService,
    private appConfigService: AppConfigService,
    private homeService: HomeService,
    private modalService: NgbModal) {
    this.isMobileDevice = this.windowService.isMobileDevice();
    this.subscription.add(this.appConfigService.appConfig$.subscribe(this.setMessages));
    this.subscription.add(this.homeService.employees$.subscribe(this.setNotifications));
    this.subscription.add(this.homeService.filteredEmployees$.subscribe(this.setFilteredEmployees));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setNotifications = (state: IEmployees): void => {
    this.notifications = state.errors;
    this.hasEmployees = !isEmpty(state.items);
  }

  setFilteredEmployees = (state: EmployeeItem[]): void => {
    this.filteredEmployees = state;
    this.hasFilteredEmployees = !isEmpty(state);
  }

  setMessages = (): void => {
    const messages = this.appConfigService.getValue('ContactCard.Messages');
    this.noDataMessage = get(messages, 'NoData', 'No data available.');
    this.filterNoHitsMessage = get(messages, 'FilterNoHits', 'No data matches your current search or filter.');
    this.phoneLink = this.appConfigService.getValue(this.isMobileDevice ? 'App.Mobile.PhoneLink' : 'App.Desktop.PhoneLink');
  }

  sanitizePhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/[^\d+ ]/g, '');
  }

  openModal = (content): void => {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true
    });
  }

  toggleExpand = (): void => {
    this.isExpanded = !this.isExpanded;
  }
}
