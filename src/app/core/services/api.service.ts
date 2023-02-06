import invariant from 'invariant';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isEmpty, get } from 'lodash';
import { LoggingService } from './logging.service';
import { NotificationService } from './notification.service';
import { Message, Notification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    protected http: HttpClient,
    protected loggingService: LoggingService,
    protected notificationService: NotificationService) { }

  get(url: string, params?: { [param: string]: string | string[]; }, headers?: HttpHeaders): Observable<any> {
    invariant(url, 'url is required.');
    const options = {
      params: new HttpParams({ fromObject: params }),
      headers: this.setHeaders(headers),
      withCredentials: true
    };
    this.loggingService.info(`ApiService/get(start) ${url}`, { url, ...options });
    return this.http.get(
      url,
      options
    ).pipe(
      tap(_ => this.loggingService.info(`ApiService/get(completed) ${url}`)),
      catchError(error => this.formatErrors(`ApiService/get(error) ${url}`, error))
    );
  }

  put(url: string, body: any, headers?: HttpHeaders): Observable<any> {
    invariant(url, 'url is required.');
    invariant(!isEmpty(body), 'body is required.');
    const options = {
      headers: this.setHeaders(headers),
      withCredentials: true
    };
    this.loggingService.info(`ApiService/put(start) ${url}`, { url, body, ...options });
    return this.http.put(
      url,
      JSON.stringify(body),
      options
    ).pipe(
      tap(_ => this.loggingService.info(`ApiService/put(completed) ${url}`)),
      catchError(error => this.formatErrors(`ApiService/put(error) ${url}`, error))
    );
  }

  post(url: string, body: any, headers?: HttpHeaders): Observable<any> {
    invariant(url, 'url is required.');
    const options = {
      headers: this.setHeaders(headers),
      withCredentials: true
    };
    this.loggingService.info(`ApiService/post(start) ${url}`, { url, body, ...options });
    return this.http.post(
      url,
      JSON.stringify(body),
      options
    ).pipe(
      tap(_ => this.loggingService.info(`ApiService/post(completed) ${url}`)),
      catchError(error => this.formatErrors(`ApiService/post(error) ${url}`, error))
    );
  }

  delete(url: string, headers?: HttpHeaders): Observable<any> {
    invariant(url, 'url is required.');
    const options = {
      headers: this.setHeaders(headers),
      withCredentials: true
    };
    this.loggingService.info(`ApiService/delete(start) ${url}`, { url, ...options });
    return this.http.delete(
      url,
      options
    ).pipe(
      tap(_ => this.loggingService.info(`ApiService/delete(completed) ${url}`)),
      catchError(error => this.formatErrors(`ApiService/delete(error) ${url}`, error))
    );
  }

  protected setHeaders(headers?: HttpHeaders): HttpHeaders {
    headers = (headers || new HttpHeaders());
    if (!headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  protected formatErrors = (method: string, errorResponse: HttpErrorResponse): Observable<never> => {
    const title = get(errorResponse, 'error.title') || errorResponse.statusText || 'An error occurred';
    const content = get(errorResponse, 'error.detail') || errorResponse.message || 'An unknown error occurred';
    const error = Notification.CreateError(title, content);
    this.loggingService.log(Message.CreateError(`${method} ${content}`));
    this.notificationService.push(error);
    return throwError(error);
  }
}
