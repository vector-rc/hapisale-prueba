import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product/product.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    
    ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
      type: 'postgres',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			logging: process.env.TYPE_ORM_LOGS === 'true',
			entities: [
				Product
			]
		}),ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
