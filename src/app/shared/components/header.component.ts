import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowService, IPosition, NavItem } from 'src/app/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  useDarkHeaderClass: boolean;
  useBackgroundClass: boolean;
  isMobileDevice: boolean;
  links: Array<NavItem>;

  constructor(private windowService: WindowService) {
    this.useBackgroundClass = true; // TODO: Check current route with RouterService
    this.links = []; // TODO: Retrieve from RouterService
    this.isMobileDevice = this.windowService.isMobileDevice();
    this.onScroll(this.windowService.getScrollPosition());
  }

  ngOnInit(): void {
    this.subscription = this.windowService.scroll$.subscribe(this.onScroll);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onScroll = (position: IPosition): void => {
    this.useDarkHeaderClass = position.y >= 60;
  }
}
