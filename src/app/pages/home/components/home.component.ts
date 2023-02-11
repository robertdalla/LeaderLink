import {Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/services';
import { HomeService } from '../services/home.service';
import { FilterType } from '../services/filter-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();
  filterType = FilterType;

  constructor(
    public homeService: HomeService,
    protected loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.homeService.loadTasks().pipe(catchError(x => of(undefined))),
      this.homeService.loadEmployees().pipe(catchError(x => of(undefined))),
      this.homeService.loadRecruitment().pipe(catchError(x => of(undefined))),
      this.homeService.loadWorkItems().pipe(catchError(x => of(undefined)))
    ]).subscribe({
      complete: () => {
        this.loadingService.hide();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
