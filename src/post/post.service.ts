import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileService } from 'src/file/file.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
constructor(  
    private prisma: PrismaService,
    private configService: ConfigService,
    private fileService: FileService
    ){
  
}

// async newPost(){
// await this.prisma.post.create({
// data:{
//     title:,
//     description:,
//     user:{
//         connect:{
//         id:userId
//         }
//     }
    
// }
// })
// }
async updatePost(){

}
async getPost(){

}
async getPosts(){

}
async deletePost(){

}
    
}
