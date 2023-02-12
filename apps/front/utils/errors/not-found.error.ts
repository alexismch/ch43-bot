import { BaseError } from './base.error';

export class NotFound extends BaseError {
   static code = 404;

   static title = 'Not found';

   constructor() {
      super(NotFound.title);
   }
}
