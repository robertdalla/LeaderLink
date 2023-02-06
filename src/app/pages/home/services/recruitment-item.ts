import invariant from 'invariant';
import { Entity, parseDate } from 'src/app/core';

export class RecruitmentItem extends Entity<number> {
  readonly jobTitle: string;
  readonly internalStatus?: string;
  readonly lastModifiedDateTime?: Date;
  readonly closedDateTime?: Date;
  readonly externalStatus?: string;
  readonly currentOwner?: UserItem;
  readonly hiringManager?: UserItem;

  constructor(
    id: number,
    jobTitle: string,
    internalStatus: string,
    lastModifiedDateTime: Date,
    closedDateTime: Date,
    externalStatus: string,
    currentOwner: UserItem,
    hiringManager: UserItem
  ) {
    super(id);
    this.jobTitle = jobTitle;
    this.internalStatus = internalStatus;
    this.lastModifiedDateTime = lastModifiedDateTime;
    this.closedDateTime = closedDateTime;
    this.externalStatus = externalStatus;
    this.currentOwner = currentOwner;
    this.hiringManager = hiringManager;
  }

  static FromObject({
    jobReqId,
    jobTitle,
    internalStatus,
    lastModifiedDateTime,
    closedDateTime,
    externalStatus,
    currentOwner,
    hiringManager
  }): RecruitmentItem {
    return new RecruitmentItem(
      jobReqId,
      jobTitle,
      internalStatus,
      parseDate(lastModifiedDateTime),
      parseDate(closedDateTime),
      externalStatus,
      currentOwner && UserItem.FromObject(currentOwner),
      hiringManager && UserItem.FromObject(hiringManager)
    );
  }
}

export class UserItem extends Entity<string>{
  readonly username: string;
  readonly email: string;

  constructor(
    username: string,
    email: string
  ) {
    invariant(username, 'username is required');
    invariant(email, 'email is required');
    super(username);
    this.username = username;
    this.email = email;
  }

  static FromObject({
    username,
    email
  }): UserItem {
    return new UserItem(
      username,
      email
    );
  }
}
