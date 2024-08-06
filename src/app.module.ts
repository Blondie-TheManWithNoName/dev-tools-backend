import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConnection } from './database';
import { ToolModule } from './tool/tool.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
