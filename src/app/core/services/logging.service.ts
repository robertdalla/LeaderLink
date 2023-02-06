import { Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import * as StackTrace from 'stacktrace-js';
import { Message } from '../models'

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly logMessages: Message[] = [];
  private readonly logSubject = new BehaviorSubject<Message[]>(this.logMessages);

  readonly log$ = this.logSubject.asObservable();

  constructor(private injector: Injector) { }

  log(message: Message) {
    this.logMessages.push(message);
    this.logSubject.next(this.logMessages);
    console.log(message);
  }

  verbose(content: string, data?: any, location?: string): void {
    this.log(Message.CreateVerbose(content, data, location));
  }

  debug(content: string, data?: any, location?: string): void {
    this.log(Message.CreateDebug(content, data, location));
  }

  info(content: string, data?: any, location?: string): void {
    this.log(Message.CreateInfo(content, data, location));
  }

  warning(content: string, data?: any, location?: string): void {
    this.log(Message.CreateWarning(content, data, location));
  }

  error(error: Error, content?: string, data?: any): void {
    this.logException(error, content, data, Message.CreateError);
  }

  fatal(error: Error, content?: string, data?: any): void {
    this.logException(error, content, data, Message.CreateFatal);
  }

  private logException(
    error: Error,
    content: string,
    data: any,
    createMessage: (content: string, data?: any, location?: string, stackTrace?: string) => Message): void {
    const location = this.injector.get<LocationStrategy>(LocationStrategy as any);
    const message = content ? content : error.message ? error.message : error.toString();
    const url = location instanceof PathLocationStrategy ? location.path() : '';

    // Grab the last 10 stacks from the stack trace.
    StackTrace.fromError(error).then((sfs: Array<any>) => {
      const stackString = sfs.splice(0, 10).map((x: any) => x.toString).join('\n');
      this.log(createMessage(message, data, url, stackString));
    });
  }
}
