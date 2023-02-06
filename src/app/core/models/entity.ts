import invariant from 'invariant';
import { isNil } from 'lodash';

export class Entity<T> {
  readonly id: T;

  protected constructor(id: T) {
    invariant(!isNil(id), 'Id is required');
    this.id = id;
  }

  equals(other: Entity<T>): boolean {
    return this === other || this.id === other.id;
  }
}
