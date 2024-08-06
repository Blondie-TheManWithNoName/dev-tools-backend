import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_USERS_TOKEN,
      signOptions: {
        algorithm: 'HS384',
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, JwtModule],
})
export class AuthModule {}
