import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import ContactDto from './dto/contact.dto';
import { UtilityService } from './utility.service';

@Controller('/api/utility')
@UseInterceptors(ClassSerializerInterceptor)
export class UtilityController {
  constructor(private utilityService: UtilityService) {}

  @Post('contact')
  async contact(@Body() body: ContactDto) {
    await this.utilityService.sendContactMesage(body);
  }
}
