import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { UserService } from '../../../../RatingAPI/src/modules/user/user.service';

export interface TelegramOptions {
  token: string;
  chatId: string;
}

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf;

  constructor(
    @Inject('TELEGRAM_CONFIG') private readonly config: TelegramOptions,
    private readonly userService: UserService,
  ) {
    this.bot = new Telegraf(config.token);
    this.bot.launch();
  }

  async send(telegramId: number | string, message: string) {
    await this.bot.telegram.sendMessage(telegramId, message);
  }

  async sendMarkdown(telegramId: number | string, message: string) {
    await this.bot.telegram.sendMessage(telegramId, message, {
      parse_mode: 'MarkdownV2',
    });
  }

  async sendHtml(telegramId: number | string, message: string) {
    await this.bot.telegram.sendMessage(telegramId, message, {
      parse_mode: 'HTML',
    });
  }
}
