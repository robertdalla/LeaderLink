import invariant from 'invariant';

export class NavItem {
  text: string;
  url: string;
  active: boolean;
  target?: string;

  constructor(
    text: string,
    url: string,
    active: boolean,
    target?: string
  ) {
    invariant(text, 'text is required');
    invariant(url, 'url is required');
    this.text = text;
    this.url = url;
    this.active = !!active;
    this.target = target;
  }
}
