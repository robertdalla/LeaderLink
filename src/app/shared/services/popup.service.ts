import { Injectable, ElementRef } from '@angular/core';
import { isNil } from 'lodash';
import { Subscription, BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { WindowService } from 'src/app/core';
import { RouterService } from '../services/router.service';

export const anchorAlign: { left: any, right: any } = {
  left: { horizontal: 'left', vertical: 'bottom' },
  right: { horizontal: 'right', vertical: 'bottom' }
};

export const popupAlign: { left: any, right: any } = {
  left: { horizontal: 'left', vertical: 'top' },
  right: { horizontal: 'right', vertical: 'top' }
};

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private readonly subject = new BehaviorSubject(false);
  private subscription: Subscription;
  private routerSubscription: Subscription;
  private getAnchorRef: () => ElementRef;
  private getPopupRef: () => ElementRef;

  readonly show$ = this.subject.asObservable();

  constructor(
    private windowService: WindowService,
    private routerService: RouterService
  ) { }

  init = (
    getAnchorRef: () => ElementRef,
    getPopupRef: () => ElementRef
  ) => {
    this.getAnchorRef = getAnchorRef;
    this.getPopupRef = getPopupRef;
    this.routerSubscription = this.routerService.navigationEnd$.subscribe(this.onNavigate);
  }

  destroy(): void {
    this.subject.complete();
    this.getAnchorRef = null;
    this.getPopupRef = null;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggle(flag?: boolean): void {
    const current = this.subject.getValue();

    if (flag === current) {
      return;
    }

    const show = isNil(flag) ? !current : flag;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (show) {
      this.subscription = this.windowService.click$
        .pipe(skip(1))
        .subscribe(this.onClick);
    }

    this.subject.next(show);
  }

  private onClick(event: any): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }

  private onNavigate(): void {
    this.toggle(false);
  }

  private contains(target: any): boolean {
    const anchor = this.getAnchorRef();
    const popup = this.getPopupRef();

    return anchor.nativeElement.contains(target)
      || (popup ? popup.nativeElement.contains(target) : false);
  }
}
