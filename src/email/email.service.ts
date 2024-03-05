import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired } from '@sendgrid/mail';
import  * as sgMail from '@sendgrid/mail';

abstract class EmailService {
abstract sendEmail(mailOptions: MailDataRequired): void;
}

@Injectable()
export class SendgridEmailService extends EmailService {
    logger=new Logger(SendgridEmailService.name)
    constructor(
     private configService: ConfigService
    ){
        super()
        sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));

    }
   async sendEmail(mailOptions: MailDataRequired) {
        try {
            await sgMail.send(mailOptions)  
        } catch (error) {
            this.logger.log(error)
            console.log(error.response.body)
            throw new BadRequestException(error.response.body)
        }
     
    }
}
