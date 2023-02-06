import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { trimEnd } from 'lodash';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

const headers: HttpHeaders = new HttpHeaders({
  'Content-Type': 'application/json; odata=verbose',
  Accept: 'application/json; odata=verbose',
  'X-HTTP-Method': 'GET',
  'X-Service-Timeout': environment.apiCallTimeout.toString()
});

@Injectable({
  providedIn: 'root'
})
export class SharePointService {
  constructor(private apiService: ApiService) { }

  getListItems(listName: string, params: { [param: string]: string | string[]; }): Observable<Array<any>> {
    return this.apiService.get(
      this.getApiUrl(listName),
      params,
      headers
    ).pipe(
      retry(3),
      map(x => x.d.results)
    );
  }

  private getApiUrl(listName: string) {
    return `${trimEnd(environment.spApiUrl, '/')}/web/lists/GetByTitle('${listName}')/items`;
  }
}
