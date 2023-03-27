import { Controller, Get, Param } from '@nestjs/common';

@Controller('hashtags')
export class HashtagsController {
  @Get('/')
  async getHashtags() {
    return 'all top hashtags';
  }

  @Get('/:tag/all')
  async allTags(@Param() param: string) {
    return 'all tags';
  }
}
