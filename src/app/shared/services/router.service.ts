import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Route, PRIMARY_OUTLET } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { flatMap, union, concat, assign, omit } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  readonly flattenedConfig: Array<Route>;
  readonly navigationEnd$: Observable<ActivatedRoute>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.flattenedConfig = this.flattener(this.router.config, null);
    this.navigationEnd$ = this.router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter((route: ActivatedRoute) => route.outlet === PRIMARY_OUTLET)
    );
  }

  private flattener(children: Array<Route>, path: Array<string>) {
    return flatMap(children, x => {
      const newPath = x.path ? union(path, [x.path]) : union(path);
      return concat([
        assign({
          flattenedPath: newPath.join('/')
        }, omit(x, 'children'))
      ], this.flattener(x.children, newPath));
    });
  }
}
