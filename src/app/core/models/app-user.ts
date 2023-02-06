import invariant from 'invariant';

export class AppUser {
  readonly user: string;
  readonly username: string;
  readonly authenticationType: string;

  constructor(
    user: string,
    username: string,
    authenticationType: string
  ) {
    invariant(user, 'user is required');
    invariant(username, 'username is required');
    invariant(authenticationType, 'authenticationType is required');
    this.user = user;
    this.username = username;
    this.authenticationType = authenticationType;
  }

  static FromObject({
    user,
    username,
    authenticationType
  }): AppUser {
    return new AppUser(
      user,
      username,
      authenticationType
    );
  }
}
