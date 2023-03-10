import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, VerifyCallback} from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        config:ConfigService
    ) {
        super({
            clientID: config.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile']
        })
    }

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const userInfo = {
            first_name: profile?._json?.given_name,
            last_name: profile?._json?.family_name,
            email: profile?._json?.email,
            googleId: profile?._json?.sub,
            isEmailConfirmed: profile?._json?.email_verified,
          };
        done(null, userInfo);
    }
}