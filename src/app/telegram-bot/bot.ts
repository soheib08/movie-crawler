import { Injectable } from '@nestjs/common';
import { Telegraf,Markup } from 'telegraf';

@Injectable()
export class BotService {
  private bot: Telegraf;

  constructor() {
    this.bot = new Telegraf('6403421446:AAEv069dxMZG9JgUFfio_rYClBnRHEDQcpc')
    this.bot.start((ctx) => ctx.reply('Welcome to the bot!'));
    this.bot.help((ctx) => ctx.reply('This is the help message'));
    this.bot.command('start', (ctx) => ctx.reply('This is the start command'));
    this.bot.command('help', (ctx) => ctx.reply('This is the help command'));


    this.bot.on('text', (ctx) => {
      const query = ctx.message.text;
      // Perform search and display results as clickable buttons in an inline keyboard
      const searchResults = [
        { id: 1, name: 'Item 1', description: 'Description of Item 1' },
        { id: 2, name: 'Item 2', description: 'Description of Item 2' },
        { id: 3, name: 'Item 3', description: 'Description of Item 3' },
      ];

      const keyboard = searchResults.map((result) => [
        Markup.button.callback(result.name, `item_${result.id}`),
      ]);

      ctx.reply('Search results:', Markup.inlineKeyboard(keyboard));
    });
    

    this.bot.action(/item_(\d+)/, (ctx) => {
      const itemId = ctx.match[1];
      // Fetch item details based on the clicked button's data
      const itemDetails = {
        id: itemId,
        name: `Item ${itemId}`,
        description: `Description of Item ${itemId}`,
      };
      ctx.reply(`Item details: ${JSON.stringify(itemDetails)}`);
    });

    this.startBot()
  }

  startBot(): void {
    this.bot.launch().then(() => {
      console.log('Bot started');
    });
  }
}