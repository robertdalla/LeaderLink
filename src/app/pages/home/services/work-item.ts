import invariant from 'invariant';
import { isNil } from 'lodash';
import { Entity, uId } from 'src/app/core';

export class WorkItem extends Entity<string> {
  readonly description: string;
  readonly count: number;

  constructor(
    id: string,
    description: string,
    count: number,
  ) {
    invariant(description, 'description is required');
    invariant(!isNil(count), 'count is required');
    super(id);
    this.description = description;
    this.count = count;
  }

  static FromObject({
    id,
    description,
    count
  }): WorkItem {
    return new WorkItem(
      id || uId(),
      description,
      count
    );
  }
}
