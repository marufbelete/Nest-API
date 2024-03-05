import { Global, Module } from '@nestjs/common';
import { SendgridEmailService } from './email.service';

@Global()
@Module({
  providers: [SendgridEmailService],
  exports:[SendgridEmailService]
})
export class EmailModule {}
