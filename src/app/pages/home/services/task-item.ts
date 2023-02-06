import invariant from 'invariant';
import { Entity, uId, isNumber, isEmpty, isUrl, Notification } from 'src/app/core';

export class TaskItem extends Entity<number> {
  readonly mode: string;
  readonly taskType: string;
  readonly taskText: string;
  readonly staticValue?: string;
  readonly clickOrTouchAction?: string;
  readonly clickOrTouchUrl?: string;
  readonly dynamicValueEndpoint?: string;
  readonly dynamicValueResponseElement?: string;
  private errorMessage?: Notification;

  constructor(
    id: number,
    mode: string,
    taskType: string,
    taskText: string,
    staticValue: string,
    clickOrTouchAction: string,
    clickOrTouchUrl: string,
    dynamicValueEndpoint: string,
    dynamicValueResponseElement: string
  ) {
    invariant(mode, 'mode is required');
    invariant(taskType, 'taskType is required');
    invariant(taskText, 'taskText is required');
    super(id);
    this.mode = mode;
    this.taskType = taskType;
    this.taskText = taskText;
    this.staticValue = staticValue;
    this.clickOrTouchAction = clickOrTouchAction;
    this.clickOrTouchUrl = clickOrTouchUrl;
    this.dynamicValueEndpoint = dynamicValueEndpoint;
    this.dynamicValueResponseElement = dynamicValueResponseElement;
  }

  static FromObject({
    Mode,
    TaskType,
    TaskText,
    StaticValue,
    ClickOrTouchAction,
    ClickOrTouchURL,
    DynamicValueEndpoint,
    DynamicValueResponseElement
  }): TaskItem {
    return new TaskItem(
      uId(),
      Mode,
      TaskType,
      TaskText,
      StaticValue,
      ClickOrTouchAction,
      ClickOrTouchURL,
      DynamicValueEndpoint,
      DynamicValueResponseElement
    );
  }

  get isDynamic(): boolean {
    return this.taskType === 'DYNAMIC'
      && isEmpty(this.staticValue)
      && !isEmpty(this.dynamicValueEndpoint)
      && !isEmpty(this.dynamicValueResponseElement);
  }

  get href(): string {
    return isUrl(this.clickOrTouchUrl, true)
      || this.clickOrTouchAction === 'TARGETBLANK'
      || this.clickOrTouchAction === 'TARGETSELF'
      ? this.clickOrTouchUrl : null;
  }

  get target(): string {
    return this.clickOrTouchAction === 'TARGETBLANK' ? '_blank' : '';
  }

  get isClickable(): boolean {
    return !isEmpty(this.clickOrTouchUrl)
      && !isEmpty(this.clickOrTouchAction);
  }

  get renderType(): string {
    let type;
    if (this.errorMessage) {
      type = 'Error';
    } else if (isNumber(this.staticValue)) {
      type = 'Badge';
    } else if (this.taskType === 'DYNAMIC') {
      type = 'Spinner';
    } else {
      type = 'Icon';
    }
    return type;
  }

  get renderIcon(): boolean {
    return this.taskType !== '' && !isNumber(this.staticValue);
  }

  get error(): Notification {
    return this.errorMessage;
  }

  updateStaticValue(staticValue: string | number): TaskItem {
    return new TaskItem(
      this.id,
      this.mode,
      this.taskType,
      this.taskText,
      staticValue.toString(),
      this.clickOrTouchAction,
      this.clickOrTouchUrl,
      this.dynamicValueEndpoint,
      this.dynamicValueResponseElement);
  }

  updateErrorMessage(errorMessage: Notification): TaskItem {
    const item = new TaskItem(
      this.id,
      this.mode,
      this.taskType,
      this.taskText,
      this.staticValue,
      this.clickOrTouchAction,
      this.clickOrTouchUrl,
      this.dynamicValueEndpoint,
      this.dynamicValueResponseElement);
    item.errorMessage = errorMessage;
    return item;
  }

  canDisplay(isMobileDevice: boolean): boolean {
    return this.mode === 'ANY'
      || (this.mode === 'MOBILE' && isMobileDevice)
      || (this.mode === 'DESKTOP' && !isMobileDevice);
  }
}
