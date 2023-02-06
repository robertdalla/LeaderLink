import invariant from 'invariant';
import { Entity, uId } from 'src/app/core';
import { FilterType } from './filter-type';

export class ReminderItem extends Entity<number> {
  readonly type: string;
  readonly typeDescription: string;
  readonly content: string;
  readonly start: Date;
  readonly end?: Date;
  readonly filterType: FilterType;

  constructor(
    type: string,
    typeDescription: string,
    content: string,
    start: Date,
    end?: Date,
    filterType?: FilterType
  ) {
    invariant(type, 'type is required');
    invariant(content, 'content is required');
    invariant(start, 'start is required');
    super(uId());
    this.type = type;
    this.typeDescription = typeDescription || type;
    this.content = content;
    this.start = start;
    this.end = end;
    this.filterType = filterType || FilterType.All;
  }

  static FromObject(data: {
    type: string;
    typeDescription?: string;
    content: string;
    start: Date;
    end?: Date;
    filterType?: FilterType;
  }): ReminderItem {
    return new ReminderItem(
      data.type,
      data.typeDescription,
      data.content,
      data.start,
      data.end,
      data.filterType
    );
  }
}
