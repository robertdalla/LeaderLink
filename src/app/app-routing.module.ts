import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppGuard } from './core/guards';
import {
  HomeComponent, MobileHomeComponent,
  CardLeaveComponent, CardTaskComponent,
  CardReminderComponent, CardContactComponent,
  CardRecruitmentComponent
} from './pages/home';
import { NotFoundComponent } from './shared/components';

// Angular routes are case sensitive
const routes: Routes = [
  {
    path: '', canActivate: [AppGuard], children: [
      { path: '', redirectTo: 'Home', pathMatch: 'full' },
      {
        path: 'Home', children: [
          { path: '', pathMatch: 'full', component: HomeComponent },
          { path: '**', redirectTo: '' }
        ]
      },
      {
        path: 'Mobile', children: [
          { path: '', redirectTo: 'Home', pathMatch: 'full' },
          {
            path: 'Home', component: MobileHomeComponent, children: [
              { path: '', redirectTo: 'Tasks', pathMatch: 'full' },
              { path: 'Leave', component: CardLeaveComponent },
              { path: 'Tasks', component: CardTaskComponent },
              { path: 'Reminders', component: CardReminderComponent },
              { path: 'Contacts', component: CardContactComponent },
              { path: 'Recruitment', component: CardRecruitmentComponent }
            ]
          }
        ]
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
