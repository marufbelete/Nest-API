
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { payload } from "../types";
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy,'jwt-access'){
    constructor(config:ConfigService){
        super( { 
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req) => {
                  if (req && req.cookies) {
                    return req.cookies.access_token;
                  }
                  return null;
                },
              ]), 
            secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET'),
            
    })
    }
    
    validate(payload:payload){
        return payload
    }
}