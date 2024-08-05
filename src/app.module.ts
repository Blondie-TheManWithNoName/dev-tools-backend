import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from 'typeorm';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return dbConnection.options;
      },
      dataSourceFactory: async (options: any) => {
        const source = dbConnection.initialize();
        return source;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
