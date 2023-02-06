import invariant from 'invariant';
import { Entity } from './entity';
import { NotificationType } from './notification-type';
import { uId } from '../util';

export class Notification extends Entity<number> {
  readonly type: NotificationType;
  readonly title: string;
  readonly content: string;
  readonly actionUrl: string;
  readonly timestamp: Date;

  constructor(
    id: number,
    type: NotificationType,
    title: string,
    content: string,
    actionUrl?: string,
    timestamp?: Date) {
    invariant(type, 'Type is required');
    invariant(title, 'Title is required');
    invariant(content, 'Content is required');
    super(id);
    this.type = type;
    this.title = title;
    this.content = content;
    this.actionUrl = actionUrl;
    this.timestamp = timestamp || new Date();
  }

  static FromObject({
    id,
    type,
    title,
    content,
    actionUrl,
    timestamp
  }): Notification {
    return new Notification(
      id || uId(),
      type || NotificationType.Info,
      title,
      content,
      actionUrl,
      timestamp);
  }

  static CreateSuccess(title: string, content: string, actionUrl?: string): Notification {
    return new Notification(uId(), NotificationType.Success, title, content, actionUrl);
  }

  static CreateInfo(title: string, content: string, actionUrl?: string): Notification {
    return new Notification(uId(), NotificationType.Info, title, content, actionUrl);
  }

  static CreateWarning(title: string, content: string, actionUrl?: string): Notification {
    return new Notification(uId(), NotificationType.Warning, title, content, actionUrl);
  }

  static CreateError(title: string, content: string, actionUrl?: string): Notification {
    return new Notification(uId(), NotificationType.Error, title, content, actionUrl);
  }

  get alertClass(): string {
    let cssClass = '';
    switch (this.type) {
      case NotificationType.Success:
        cssClass = 'success';
        break;
      case NotificationType.Info:
        cssClass = 'info';
        break;
      case NotificationType.Warning:
        cssClass = 'warning';
        break;
      case NotificationType.Error:
        cssClass = 'danger';
        break;
    }
    return cssClass;
  }

  get textClass(): string {
    let cssClass = '';
    switch (this.type) {
      case NotificationType.Success:
        cssClass = 'text-success';
        break;
      case NotificationType.Info:
        cssClass = 'text-info';
        break;
      case NotificationType.Warning:
        cssClass = 'text-warning';
        break;
      case NotificationType.Error:
        cssClass = 'text-danger';
        break;
    }
    return cssClass;
  }

  get iconClass(): string {
    let cssClass = '';
    switch (this.type) {
      case NotificationType.Success:
        cssClass = 'fa fa-check-circle';
        break;
      case NotificationType.Info:
        cssClass = 'fa fa-info-circle';
        break;
      case NotificationType.Warning:
        cssClass = 'fa fa-exclamation-circle';
        break;
      case NotificationType.Error:
        cssClass = 'fa fa-times-circle';
        break;
    }
    return cssClass;
  }
}
