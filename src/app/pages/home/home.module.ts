import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule, Store } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { homeReducer } from './store/home.reducer';
import { HomeComponent } from './components/home.component';
import { MobileHomeComponent } from './components/home-mobile.component';
import { CardTeamComponent } from './components/card-team.component';
import { CardTaskComponent } from './components/card-task.component';
import { CardReminderComponent } from './components/card-reminder.component';
import { CardContactComponent } from './components/card-contact.component';
import { CardLeaveComponent } from './components/card-leave.component';
import { CardComponent } from './components/card.component';
import { CardModalComponent } from './components/card-modal.component';
import { CardRecruitmentComponent } from './components/card-recruitment.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    StoreModule.forFeature('home', homeReducer)
  ],
  declarations: [
    HomeComponent,
    MobileHomeComponent,
    CardTeamComponent,
    CardTaskComponent,
    CardReminderComponent,
    CardContactComponent,
    CardLeaveComponent,
    CardComponent,
    CardModalComponent,
    CardRecruitmentComponent
  ],
  providers: [],
  exports: [
    HomeComponent,
    MobileHomeComponent,
    CardTeamComponent,
    CardTaskComponent,
    CardReminderComponent,
    CardContactComponent,
    CardLeaveComponent,
    CardRecruitmentComponent
  ]
})
export class HomeModule { }
