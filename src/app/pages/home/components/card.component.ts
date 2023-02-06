import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card" [ngClass]="{'border-0 rounded-0': isMobileDevice}">
      <div [ngClass]="cardHeaderClass()">
        {{headerText}}
        <span *ngIf="canExpand"><i class="fa fa-expand clickable" (click)="onExpand()" title="Expand"></i></span>
      </div>
      <div class="card-body py-0" [ngStyle]="cardBodyStyle()">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() isMobileDevice: boolean;
  @Input() headerClass: string;
  @Input() headerText: string;
  @Input() maxHeight: string;
  @Input() canExpand: boolean;
  @Output() expand = new EventEmitter();

  cardHeaderClass = (): string => {
    return `card-header text-white d-flex flex-row justify-content-between ${this.isMobileDevice ? 'rounded-0' : ''} ${this.headerClass ? this.headerClass : ''}`;
  }

  cardBodyStyle = (): object => {
    return this.maxHeight
      ? { maxHeight: this.maxHeight, overflow: 'auto' }
      : {};
  }

  onExpand = (): void => {
    this.expand.emit();
  }
}
