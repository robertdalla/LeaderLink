import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

const options: any = {
  type: (function() {
    const spinners = ['ball-8bits', 'ball-climbing-dot', 'ball-newton-cradle', 'ball-running-dots', 'pacman', 'timer'];
    return spinners[Math.floor(Math.random() * spinners.length)];
  })(),
  size: 'medium',
  bdColor: 'rgba(100,149,237, 0)',
  color: 'rgb(52,152,204)',
  fullScreen: true,
};

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor(private spinner: NgxSpinnerService) { }

  show = (name?: string): void => {
    this.spinner.show(name, options);
  }

  hide = (name?: string): void => {
    this.spinner.hide(name);
  }
}
