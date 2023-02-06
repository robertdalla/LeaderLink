import invariant from 'invariant';
import { Entity, uId } from 'src/app/core';

export class BirthdayAnniversaryItem extends Entity<number> {
  readonly fullName: string;
  readonly birthday: Date;
  readonly anniversary?: Date;
  readonly powerlinkStartDate?: Date;

  constructor(
    fullName: string,
    birthday: Date,
    anniversary?: Date,
    powerlinkStartDate?: Date
  ) {
    invariant(fullName, 'fullName is required');
    invariant(birthday, 'birthday is required');
    super(uId());
    this.fullName = fullName;
    this.birthday = birthday;
    this.anniversary = anniversary;
    this.powerlinkStartDate = powerlinkStartDate;
  }

  static FromObject(data: {
    fullName: string;
    birthday: Date;
    anniversary?: Date;
    powerlinkStartDate?: Date;
  }): BirthdayAnniversaryItem {
    return new BirthdayAnniversaryItem(
      data.fullName,
      data.birthday,
      data.anniversary,
      data.powerlinkStartDate
    );
  }
}
