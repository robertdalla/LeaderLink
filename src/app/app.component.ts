import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/shared/services';
import { LoggingService, Message } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isMobileDevice: boolean;
  showLogMessages: boolean;
  messages: Message[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private loggingService: LoggingService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.route)
    ).subscribe(route => {
      this.showLogMessages = !!route.snapshot.queryParams.showLogMessages;
      if (this.showLogMessages) {
        this.loggingService.log$.subscribe(x => this.messages = x);
      }
    });
  }

  ngOnInit(): void {
    this.loadingService.show();
  }
}
