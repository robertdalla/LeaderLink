import { Component, ViewEncapsulation } from '@angular/core';
import { sumBy } from 'lodash';
import { parseFloatOrDefault } from 'src/app/core';
import { LoadingService } from 'src/app/shared/services';
import { HomeService } from '../services/home.service';
import { HomeComponent } from './home.component';
import { ITasks } from '../store/home-store';
import { TaskItem } from '../services/task-item';

@Component({
  selector: 'app-mobile-home',
  templateUrl: './home-mobile.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MobileHomeComponent extends HomeComponent {
  tasksCount = 0;

  constructor(
    public homeService: HomeService,
    protected loadingService: LoadingService
  ) {
    super(homeService, loadingService);
    this.subscription.add(this.homeService.tasks$.subscribe(this.updateTasksCount));
  }

  private updateTasksCount = (state: ITasks): void => {
    this.tasksCount = sumBy(state.items, (x: TaskItem) => parseFloatOrDefault(x.staticValue));
  }
}
