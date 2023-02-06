import { Notification, AppConfigItem, AppUser } from '../models';

export const localStorageSyncKeys = [
  'notifications',
  'appConfigs'
];

export interface IAppStore {
  router: any;
  notifications: Notification[];
  appConfig: Array<AppConfigItem>;
  appUser: AppUser;
}
