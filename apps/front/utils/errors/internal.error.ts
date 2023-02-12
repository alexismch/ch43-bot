import { BaseError } from './base.error';

export class InternalError extends BaseError {
   static code = 500;

   static title = 'Internal error';

   constructor() {
      super(InternalError.title);
   }
}
