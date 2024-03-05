import { MailDataRequired } from "@sendgrid/mail";


export class EmailTemplate{
    static accountConfirmationEmail(from:string,to:string|string[], name:string):MailDataRequired{
        return {
          from: from,
          to: to,
          templateId:"d-e7b1ea4bbb9f45e3889ede68ce3d4b16",
          dynamicTemplateData:{
            name:"Maruf"
          }
        };
    };

}
