import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Notification } from '../models';
import { IAppStore } from '../store/app-store';
import * as actions from '../store/notification.actions';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly subject = new Subject<Notification>();
  readonly notifications$: Observable<Notification[]>;
  readonly push$ = this.subject.asObservable();

  constructor(private store: Store<IAppStore>) {
    this.notifications$ = this.store.pipe(
      select(x => x.notifications),
      map(x => x.map(Notification.FromObject))
    );
  }

  push(message: Notification): void {
    this.subject.next(message);
    this.store.dispatch(actions.push({ message }));
  }

  pushSuccess(title: string, content: string, actionUrl?: string): void {
    this.push(Notification.CreateSuccess(title, content, actionUrl));
  }

  pushInfo(title: string, content: string, actionUrl?: string): void {
    this.push(Notification.CreateInfo(title, content, actionUrl));
  }

  pushWarning(title: string, content: string, actionUrl?: string): void {
    this.push(Notification.CreateWarning(title, content, actionUrl));
  }

  pushError(title: string, content: string, actionUrl?: string): void {
    this.push(Notification.CreateError(title, content, actionUrl));
  }

  remove(message: Notification): void {
    this.store.dispatch(actions.remove({ message }));
  }

  clear(): void {
    this.store.dispatch(actions.clear());
  }
}
