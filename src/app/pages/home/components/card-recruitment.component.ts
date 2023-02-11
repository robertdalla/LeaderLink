import { Component, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { isEmpty, get, chain } from 'lodash';
import { WindowService, Notification, AppConfigService, NavItem } from 'src/app/core';
import { IRecruitment } from '../store/home-store';
import { HomeService } from '../services/home.service';
import { RecruitmentItem } from '../services/recruitment-item';

@Component({
  selector: 'app-card-recruitment',
  templateUrl: './card-recruitment.component.html',
  styleUrls: ['./card-recruitment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardRecruitmentComponent implements OnDestroy {
  private subscription = new Subscription();
  recruitment: Array<RecruitmentItem> = [];
  notifications: Array<Notification> = [];
  noDataMessage: string;
  links: Array<NavItem> = [];
  hasRecruitment: boolean;
  isMobileDevice: boolean;
  isExpanded: boolean;

  constructor(
    private windowService: WindowService,
    private appConfigService: AppConfigService,
    private homeService: HomeService
  ) {
    this.isMobileDevice = this.windowService.isMobileDevice();
    this.subscription.add(this.appConfigService.appConfig$.subscribe(this.setAppConfig));
    this.subscription.add(this.homeService.recruitment$.subscribe(this.setRecruitment));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setRecruitment = (state: IRecruitment): void => {
    this.recruitment = chain(state.items)
      .filter((x: RecruitmentItem) => x.hiringManager.email.indexOf(this.appConfigService.appUser.username) > -1)
      .sortBy('id')
      .value();
    this.notifications = state.errors;
    this.hasRecruitment = !isEmpty(this.recruitment);
  }

  setAppConfig = (): void => {
    const messages = this.appConfigService.getObject('RecruitmentCard.Messages');
    const links = this.isMobileDevice
      ? this.appConfigService.getObject('RecruitmentCard.Mobile.Links')
      : this.appConfigService.getObject('RecruitmentCard.Links');
    this.noDataMessage = get(messages, 'NoData', 'No data available.');
    this.links = chain(links)
      .filter('Enable')
      .map(x => new NavItem(x.Text, x.Url, false, '_blank'))
      .value();
  }

  toggleExpand = (): void => {
    this.isExpanded = !this.isExpanded;
  }

  expandClosed = (): void => {
    this.isExpanded = false;
  }
}
