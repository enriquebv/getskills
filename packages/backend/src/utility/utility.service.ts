import axios from 'axios';
import { Injectable } from '@nestjs/common';
import ContactDto from './dto/contact.dto';

@Injectable()
export class UtilityService {
  async sendContactMesage(contact: ContactDto) {
    await axios.post(process.env.DISCORD_CONTACT_WEBHOOK, {
      content: [
        `@everyone`,
        `E-mail: \`${contact.email}\``,
        `\`\`\`${contact.message}\`\`\``,
      ].join('\n'),
      allowed_mentions: {
        parse: ['everyone'],
      },
    });
  }
}
