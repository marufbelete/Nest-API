import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { FileModule } from 'src/file/file.module';

@Module({
  providers: [PostService],
  imports:[FileModule]
})
export class PostModule {}
