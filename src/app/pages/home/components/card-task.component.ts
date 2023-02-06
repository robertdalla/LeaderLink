import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowService, Notification } from 'src/app/core';
import { TaskItem } from '../services/task-item';
import { ITasks } from '../store/home-store';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-card-task',
  templateUrl: './card-task.component.html',
  styleUrls: ['./card-task.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardTaskComponent implements OnDestroy {
  private subscription = new Subscription();
  tasks: Array<TaskItem> = [];
  notifications: Array<Notification> = [];
  isMobileDevice: boolean;

  constructor(
    private windowService: WindowService,
    private homeService: HomeService
  ) {
    this.isMobileDevice = this.windowService.isMobileDevice();
    this.subscription.add(this.homeService.tasks$.subscribe(this.setTasks));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setTasks = (state: ITasks): void => {
    this.tasks = state.items;
    this.notifications = state.errors;
  }
}
