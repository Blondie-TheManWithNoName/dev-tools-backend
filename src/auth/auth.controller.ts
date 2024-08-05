import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { SignInDTO } from './dtos/sign-in';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Post('signin')
    async signIn(@Req() req: Request, @Res() res: Response, @Body() postData: SignInDTO) {
        const response = await this.auth.signIn(postData.email, postData.password);
        return res.status(response.httpStatus).send(response);
    }
}
