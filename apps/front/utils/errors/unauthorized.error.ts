import { BaseError } from './base.error';

export class Unauthorized extends BaseError {
   static code = 401;

   static title = 'Unauthorized';

   constructor() {
      super(Unauthorized.title);
   }
}
