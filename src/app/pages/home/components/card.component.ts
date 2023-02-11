import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="card" [ngClass]="{'border-0 rounded-0': isMobileDevice}">
      <div [ngClass]="cardHeaderClass()">
        {{headerText}}
        <span *ngIf="canExpand" (click)="onExpand()"><i class="fa fa-expand clickable" title="Expand"></i></span>
      </div>
      <div class="card-body py-0" [ngStyle]="cardBodyStyle()">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardComponent {
  @Input() isMobileDevice: boolean;
  @Input() headerClass: string;
  @Input() headerText: string;
  @Input() maxHeight: string;
  @Input() canExpand: boolean;
  @Output() expand = new EventEmitter();

  constructor(
  )
  {
  }

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
