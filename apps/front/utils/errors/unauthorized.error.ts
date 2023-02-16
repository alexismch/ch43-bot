import { BaseError } from './base.error';

export class Unauthorized extends BaseError {
   static code = 401;

   static title = 'Unauthorized';

   static description = "You aren't authorized to see this.";

   constructor() {
      super(Unauthorized.title);
   }
}
