import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { notificationReducer } from './store/notification.reducer';
import { appConfigReducer } from './store/app-config.reducer';
import { appUserReducer } from './store/app-user.reducer';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature('notifications', notificationReducer),
    StoreModule.forFeature('appConfig', appConfigReducer),
    StoreModule.forFeature('appUser', appUserReducer)
  ]
})
export class CoreModule { }
