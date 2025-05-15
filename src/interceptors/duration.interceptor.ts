import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class DurationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dateIn = Date.now();
    console.log("request create at: ", dateIn)
    return next.handle().pipe(
      tap(
        () => {
          const dateOut = Date.now();
          console.log("request end at: ", dateOut)
          console.log(`Request duration:  ${dateOut-dateIn} ms`)
        }
      )
    );
  }
}
