import { Global, Module } from '@nestjs/common';
import { EventsGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  providers: [EventsGateway],
  imports:[AuthModule],
  exports:[EventsGateway]
})
export class SocketModule {}
