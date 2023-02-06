import invariant from 'invariant';

export class AppConfigItem {
  readonly name: string;
  readonly value: string;

  constructor(name: string, value: string) {
    invariant(name, 'name is required');
    this.name = name;
    this.value = value;
  }

  static FromObject({ Title, Value }): AppConfigItem {
    return new AppConfigItem(Title, Value);
  }
}
