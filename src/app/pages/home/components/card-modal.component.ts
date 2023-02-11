import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-card-modal',
  template: `
    <div #customModal class="draggable_dialog" ngDraggable="true" ngResizable="true"
         [position]="position" [zIndex]="zIndex" [rzMinWidth]="minWidth" [rzMinHeight]="minHeight">
      <div class="container" [style.minWidth.px]="minWidth">
        <div class="card">
          <div [ngClass]="cardHeaderClass()">
            {{headerText}}
            <span (click)="closeModal()"><i class="fa fa-times clickable" title="Close"></i></span>
          </div>
          <div class="card-body py-0" [ngStyle]="cardBodyStyle()">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default
})
export class CardModalComponent implements AfterViewInit {
  @Input() isMobileDevice: boolean;
  @Input() headerClass: string;
  @Input() headerText: string;
  @Input() position: { x: number, y: number } = { x: 20, y: 30 };
  @Input() zIndex: string = '1040';
  @Input() minWidth: number = 500;
  @Input() minHeight: number = 0;
  @Input() maxHeight: string;
  @Output() onClose = new EventEmitter();
  @ViewChildren('customModal') cardDiv: QueryList<any>;

  constructor(
  )
  {
  }

  ngAfterViewInit(): void {
    this.cardDiv.changes.subscribe(x => {
      if (x.first && x.first.nativeElement.offsetHeight > this.minHeight) {
        setTimeout(() => this.minHeight = x.first.nativeElement.offsetHeight);
      }
    });
  }

  cardHeaderClass = (): string => {
    return `card-header text-white d-flex flex-row justify-content-between ${this.isMobileDevice ? 'rounded-0' : ''} ${this.headerClass ? this.headerClass : ''}`;
  }

  cardBodyStyle = (): object => {
    return this.maxHeight
      ? { maxHeight: this.maxHeight, overflow: 'auto' }
      : {};
  }

  closeModal() {
    console.log('clicked closeModal');
    this.onClose.emit();
  }
}
