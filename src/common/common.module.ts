import { Global, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports:[
    JwtModule.register({}),
  ],
  providers:[CommonService],
  exports:[CommonService]
})
export class CommonModule {}
