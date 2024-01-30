import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';


@Module({
  imports:[AuthService]
})
export class FileModule {}
