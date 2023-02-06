import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../services';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {
  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.hide();
  }
}
