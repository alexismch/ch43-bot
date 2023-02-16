import { BaseError } from './base.error';

export class NotFound extends BaseError {
   static code = 404;

   static title = 'Not found';

   static description = 'Sorry, we couldn’t find the page you’re looking for.';

   constructor() {
      super(NotFound.title);
   }
}
