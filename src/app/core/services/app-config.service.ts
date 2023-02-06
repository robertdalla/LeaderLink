import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map as lodashMap, find, trimStart, trimEnd, isString } from 'lodash';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { WindowService } from './window.service';
import { ApiService } from './api.service';
import { SharePointService } from './share-point.service';
import * as appConfigActions from '../store/app-config.actions';
import * as appUserActions from '../store/app-user.actions';
import { AppConfigItem, AppUser } from '../models';
import { IAppStore } from '../store/app-store';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: Array<AppConfigItem> = [];
  readonly appConfig$: Observable<Array<AppConfigItem>>;
  readonly appUser$: Observable<AppUser>;
  appUser: AppUser;

  constructor(
    private store: Store<IAppStore>,
    private loggingService: LoggingService,
    private apiService: ApiService,
    private sharePointService: SharePointService,
    private windowService: WindowService
  ) {
    this.appConfig$ = this.store.pipe(select(x => x.appConfig));
    this.appUser$ = this.store.pipe(select(x => x.appUser));
  }

  getAppTitle(): string {
    return this.windowService.isMobileDevice() ? this.getValue('App.Mobile.Title') : this.getValue('App.Title');
  }

  getApiUrl(path: string): string {
    return `${trimEnd(this.getValue('App.ApiBaseUrl'), '/')}/${trimStart(path, '/')}`;
  }

  getValue(name: string | ((value: AppConfigItem) => boolean), defaultValue: string = null): string {
    let found: AppConfigItem;
    if (isString(name)) {
      found = find(this.appConfig, ['name', name]);
    } else {
      found = find(this.appConfig, name);
    }
    return found ? found.value : defaultValue;
  }

  getObject(name: string | ((value: AppConfigItem) => boolean), defaultValue: any = null): any {
    let found: AppConfigItem;
    if (isString(name)) {
      found = find(this.appConfig, ['name', name]);
    } else {
      found = find(this.appConfig, name);
    }
    try {
      return found ? JSON.parse(found.value) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  loadAppConfig(): Observable<Array<AppConfigItem>> {
    this.loggingService.info('AppConfigService/loadAppConfig(start)');
    return this.sharePointService.getListItems('AppConfig', { $select: 'Title,Value' })
      .pipe(
        map(x => lodashMap(x, AppConfigItem.FromObject)),
        tap(x => {
          this.appConfig = x;
          this.windowService.setAppTitle(this.getAppTitle());
          this.store.dispatch(appConfigActions.set({ items: x }));
        }),
        switchMap(x => this.windowService.preloadApiUrl(this.getApiUrl('users/me'))),
        switchMap(x => this.apiService.get(this.getApiUrl('users/me'))),
        map(AppUser.FromObject),
        tap(x => {
          this.appUser = x;
          this.store.dispatch(appUserActions.set({ item: x }));
        }),
        map(x => {
          this.loggingService.info('AppConfigService/loadAppConfig(completed)');
          return this.appConfig;
        }),
        catchError(error => {
          this.loggingService.error(error, 'AppConfigService/loadAppConfig(error)', error);
          return of([]);
        })
      );
  }
}
