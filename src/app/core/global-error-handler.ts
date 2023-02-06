import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LoggingService } from './services';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) { }

    handleError(error: any): void {
        const logger = this.injector.get(LoggingService);
        logger.error(error);
        throw error;
    }
}
