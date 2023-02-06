import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularDraggableModule } from 'angular2-draggable';
import { NgbPopoverModule, NgbAlertModule, NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SafeUrlPipe } from './safeUrl.pipe';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component';
import { NotFoundComponent } from './components/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    SafeUrlPipe,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent
  ],
  entryComponents: [],
  exports: [
    SafeUrlPipe,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    AngularDraggableModule,
    NgbPopoverModule,
    NgbAlertModule,
    NgbModalModule,
    NgbDropdownModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
