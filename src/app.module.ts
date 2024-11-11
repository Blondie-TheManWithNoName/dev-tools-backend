import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnection } from './database';
import { ToolModule } from './tool/tool.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
import { ProcessModule } from './process/process.module';
import { KitModule } from './kit/kit.module';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return dbConnection.options;
      },
      dataSourceFactory: async (options: any) => {
        const source = dbConnection.initialize();
        return source;
      },
    }),
    ToolModule,
    TagModule,
    AuthModule,
    ProcessModule,
    KitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
