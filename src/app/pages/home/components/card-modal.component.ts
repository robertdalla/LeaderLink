import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-card-modal',
  template: `
    <div #modal *ngIf="opened" class="draggable_dialog" ngDraggable="true" ngResizable="true" [position]="position"
         [zIndex]="zIndex" [rzMinWidth]="minWidth" [rzMinHeight]="minHeight">
      <div class="container" [style.minWidth.px]="minWidth">
        <div class="card">
          <div class="card-header text-white d-flex flex-row justify-content-between" [ngClass]="headerClass">
            {{headerText}}
            <span><i class="fa fa-times clickable" (click)="onClose()" title="Close"></i></span>
          </div>
          <div class="card-body py-0">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CardModalComponent implements AfterViewInit {
  @Input() isMobileDevice: boolean;
  @Input() headerClass: string;
  @Input() headerText: string;
  @Input() opened: boolean;
  @Input() position: { x: number, y: number } = { x: 0, y: 0 };
  @Input() zIndex: string = '1040';
  @Input() minWidth: number = 500;
  @Input() minHeight: number = 0;
  // tslint:

  @Output() closeCard = new EventEmitter<any>();
  @ViewChildren('modal') cardDiv: QueryList<any>;

  ngAfterViewInit(): void {
    this.cardDiv.changes.subscribe(x => {
      if (x.first && x.first.nativeElement.offsetHeight > this.minHeight) {
        setTimeout(() => this.minHeight = x.first.nativeElement.offsetHeight);
      }
    });
  }

  onClose = () => {
    this.closeCard.emit();
  }
}
