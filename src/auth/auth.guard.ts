import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

import { jwtConstants } from "./constants";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";



@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService:JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean | null |any>   {
        const request=context.switchToHttp().getRequest();
        const token=this.extractTokenFromHeader(request);

        if(!token){
            throw new UnauthorizedException();
        }
        try{
            const payload=await this.jwtService.verifyAsync(token,
                {
                    secret:jwtConstants.secret
                }
            );

            request['user']=payload;
        }
        catch {
            throw new UnauthorizedException();
        }
        return true;
    }
    private extractTokenFromHeader(request:Request):string | any{
        const [type,token]=request.headers.authorization?.split(' ')?? [];
        return type==='Bearer' ? token:undefined;

    }
}