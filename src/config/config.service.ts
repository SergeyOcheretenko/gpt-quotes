import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IsNotEmpty, IsString, validateSync, IsEnum } from 'class-validator';
import { plainToClass, Transform } from 'class-transformer';

export enum Environment {
  TEST = 'test',
  DEV = 'dev',
  PROD = 'prod',
}

export class EnvironmentVariables {
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  @IsNotEmpty()
  TELEGRAM_TOKEN: string;

  @IsString()
  @IsNotEmpty()
  TELEGRAM_CHAT_ID: string;
}

@Injectable()
export class ConfigService implements OnModuleInit {
  constructor(@Inject('ENV') private env: EnvironmentVariables) {}

  async onModuleInit() {
    this.env = this.validateConfig();
  }

  public getEnvironment() {
    return this.env.NODE_ENV;
  }

  public getTelegramConfig() {
    return {
      token: this.env.TELEGRAM_TOKEN,
      chatId: this.env.TELEGRAM_CHAT_ID,
    };
  }

  private validateConfig() {
    const validatedConfig = plainToClass(EnvironmentVariables, this.env, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }
}
