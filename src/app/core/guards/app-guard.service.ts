import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { isEmpty } from 'lodash';
import { Observable, of } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';
import { WindowService, AppConfigService } from '../services';

const mobilePrefix = '/Mobile';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {
  constructor(
    private windowService: WindowService,
    private appConfigService: AppConfigService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const isMobileDevice = this.windowService.isMobileDevice();
    const lowerCaseUrl = state.url.toLowerCase();
    const isMobileUrl = lowerCaseUrl === mobilePrefix || lowerCaseUrl.startsWith('/mobile/');

    return this.appConfigService.appConfig$
      .pipe(
        take(1),
        switchMap(x => isEmpty(x) ? this.appConfigService.loadAppConfig() : of(x)),
        map(x => {
          if (isMobileDevice && !isMobileUrl) {
            this.router.navigateByUrl(`${mobilePrefix}${state.url}`);
            return false;
          } else if (!isMobileDevice && isMobileUrl) {
            this.router.navigateByUrl(state.url.substring(mobilePrefix.length));
            return false;
          }
          return true;
        })
      );
  }
}
