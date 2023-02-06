import invariant from 'invariant';
import { isNil } from 'lodash';
import { Entity, uId, parseDate } from 'src/app/core';
import { FilterType } from './filter-type';

export class EmployeeItem extends Entity<string> {
  readonly fullName: string;
  readonly dateOfBirth: Date;
  readonly emailAddress: string;
  readonly officePhone?: string;
  readonly mobilePhone?: string;
  readonly otherMobilePhone?: string;
  readonly emergencyContactName?: string;
  readonly emergencyContactPhoneNumber?: string;
  readonly emergencyContactPhoneNumber2?: string;
  readonly powerlinkStartDate?: Date;
  readonly position?: string;
  readonly group?: string;
  readonly division?: string;
  readonly hierarchyLevel?: number;
  readonly employeeGroup?: string;
  readonly employeeSubGroup?: string;
  readonly workContract?: string;
  readonly leaves: Array<LeaveItem>;
  readonly keyDates: Array<KeyDateItem>;
  readonly assignments: Array<AssignmentItem>;

  constructor(
    id: string,
    fullName: string,
    dateOfBirth: Date,
    emailAddress: string,
    officePhone: string,
    mobilePhone: string,
    otherMobilePhone: string,
    emergencyContactName: string,
    emergencyContactPhoneNumber: string,
    emergencyContactPhoneNumber2: string,
    powerlinkStartDate: Date,
    position: string,
    group: string,
    division: string,
    hierarchyLevel: number,
    employeeGroup: string,
    employeeSubGroup: string,
    workContract: string,
    leaves: Array<LeaveItem> = [],
    keyDates: Array<KeyDateItem> = [],
    assignments: Array<AssignmentItem> = []
  ) {
    invariant(fullName, 'fullName is required');
    invariant(dateOfBirth, 'dateOfBirth is required');
    invariant(emailAddress, 'emailAddress is required');
    super(id);
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.emailAddress = emailAddress;
    this.officePhone = officePhone;
    this.mobilePhone = mobilePhone;
    this.otherMobilePhone = otherMobilePhone;
    this.otherMobilePhone = otherMobilePhone;
    this.emergencyContactName = emergencyContactName;
    this.emergencyContactPhoneNumber = emergencyContactPhoneNumber;
    this.emergencyContactPhoneNumber2 = emergencyContactPhoneNumber2;
    this.powerlinkStartDate = powerlinkStartDate;
    this.position = position;
    this.group = group;
    this.division = division;
    this.hierarchyLevel = hierarchyLevel;
    this.employeeGroup = employeeGroup;
    this.employeeSubGroup = employeeSubGroup;
    this.workContract = workContract;
    this.leaves = isNil(leaves) ? [] : leaves;
    this.keyDates = isNil(keyDates) ? [] : keyDates;
    this.assignments = isNil(assignments) ? [] : assignments;
  }

  get filterType(): FilterType {
    if (this.hierarchyLevel <= 2) {
      return FilterType.Direct;
    }

    if (this.hierarchyLevel > 2) {
      return FilterType.Indirect;
    }

    return FilterType.All;
  }

  static FromObject({
    employeeNumber,
    fullName,
    dateOfBirth,
    emailAddress,
    officePhone,
    mobilePhone,
    otherMobile,
    emergencyContactName,
    emergencyContactPhoneNumber,
    emergencyContactPhoneNumber2,
    powerlinkStartDate,
    positionName,
    group_name,
    division_name,
    hierarchyLevel,
    employeeGroup,
    employeeSubGroup,
    workContract,
    leave,
    keyDates,
    temporaryAssignments
  }): EmployeeItem {
    return new EmployeeItem(
      employeeNumber,
      fullName,
      parseDate(dateOfBirth),
      emailAddress,
      officePhone,
      mobilePhone,
      otherMobile,
      emergencyContactName,
      emergencyContactPhoneNumber,
      emergencyContactPhoneNumber2,
      parseDate(powerlinkStartDate),
      positionName,
      group_name,
      division_name,
      hierarchyLevel,
      employeeGroup,
      employeeSubGroup,
      workContract,
      isNil(leave) ? [] : leave.map(LeaveItem.FromObject),
      isNil(keyDates) ? [] : keyDates.map(KeyDateItem.FromObject),
      isNil(temporaryAssignments) ? [] : temporaryAssignments.map(AssignmentItem.FromObject)
    );
  }
}

export class LeaveItem extends Entity<number>{
  readonly leaveBookingDate: Date;
  readonly leaveStartDate: Date;
  readonly leaveEndDate: Date;
  readonly leaveType: string;
  readonly leaveCategory: string;
  readonly absenceDays: number;
  readonly absenceHours: number;

  constructor(
    id: number,
    leaveBookingDate: Date,
    leaveStartDate: Date,
    leaveEndDate: Date,
    leaveType: string,
    leaveCategory: string,
    absenceDays: number,
    absenceHours: number
  ) {
    invariant(leaveBookingDate, 'leaveBookingDate is required');
    invariant(leaveStartDate, 'leaveStartDate is required');
    invariant(leaveEndDate, 'leaveEndDate is required');
    invariant(leaveType, 'leaveType is required');
    invariant(leaveCategory, 'leaveCategory is required');
    invariant(!isNil(absenceDays), 'absenceDays is required');
    invariant(!isNil(absenceHours), 'absenceHours is required');
    super(id);
    this.leaveBookingDate = leaveBookingDate;
    this.leaveStartDate = leaveStartDate;
    this.leaveEndDate = leaveEndDate;
    this.leaveType = leaveType;
    this.leaveCategory = leaveCategory;
    this.absenceDays = absenceDays;
    this.absenceHours = absenceHours;
  }

  static FromObject({
    leaveBookingDate,
    leaveStartDate,
    leaveEndDate,
    leaveType,
    leaveCategory,
    absenceDays,
    absenceHours
  }): LeaveItem {
    return new LeaveItem(
      uId(),
      parseDate(leaveBookingDate),
      parseDate(leaveStartDate),
      parseDate(leaveEndDate),
      leaveType,
      leaveCategory,
      absenceDays,
      absenceHours
    );
  }
}

export class KeyDateItem extends Entity<number>{
  readonly taskDate: Date;
  readonly taskType: string;
  readonly taskDescription: string;
  readonly processingIndicator: string;

  constructor(
    id: number,
    taskDate: Date,
    taskType: string,
    taskDescription: string,
    processingIndicator: string
  ) {
    invariant(taskDate, 'taskDate is required');
    invariant(taskType, 'taskType is required');
    invariant(taskDescription, 'taskDescription is required');
    invariant(processingIndicator, 'processingIndicator is required');
    super(id);
    this.taskDate = taskDate;
    this.taskType = taskType;
    this.taskDescription = taskDescription;
    this.processingIndicator = processingIndicator;
  }

  static FromObject({
    dateOfTask,
    taskType,
    taskDescription,
    processingIndicator
  }): KeyDateItem {
    return new KeyDateItem(
      uId(),
      parseDate(dateOfTask),
      taskType,
      taskDescription,
      processingIndicator
    );
  }
}

export class AssignmentItem extends Entity<string>{
  readonly description: string;
  readonly state: string;
  readonly startDate: Date;
  readonly employmentEndDate?: Date;
  readonly parent?: string;
  readonly position?: string;
  readonly manager?: string;
  readonly category?: string;

  constructor(
    id: string,
    description: string,
    state: string,
    startDate: Date,
    employmentEndDate: Date,
    parent: string,
    position: string,
    manager: string,
    category: string
  ) {
    invariant(description, 'description is required');
    invariant(state, 'state is required');
    invariant(startDate, 'startDate is required');
    super(id);
    this.description = description;
    this.state = state;
    this.startDate = startDate;
    this.employmentEndDate = employmentEndDate;
    this.parent = parent;
    this.position = position;
    this.manager = manager;
    this.category = category;
  }

  static FromObject({
    // tslint:disable-next-line:variable-name
    number,
    shortDescription,
    state,
    startDate,
    employmentEndDate,
    parent,
    positionName,
    manager,
    subCategory
  }): AssignmentItem {
    return new AssignmentItem(
      number,
      shortDescription,
      state,
      parseDate(startDate),
      parseDate(employmentEndDate),
      parent,
      positionName,
      manager,
      subCategory
    );
  }
}
