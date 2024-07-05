import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongoDB');
        const uri = configService.get<string>('MONGO_URI');

        logger.log('Attempting to connect to MongoDB...');

        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.log('Successfully connected to MongoDB');
            });

            connection.on('error', (err) => {
              logger.error(`Error connecting to MongoDB: ${err.message}`);
            });

            connection.on('disconnected', () => {
              logger.warn('Disconnected from MongoDB');
            });

            connection.on('reconnected', () => {
              logger.log('Reconnected to MongoDB');
            });

            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
  ],
})
export class AppModule {}
