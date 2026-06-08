import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberDto } from './dto/subscriber.dto';

@Controller('subscriber')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Post()
  create(@Body() createSubscriberDto: SubscriberDto) {
    return this.subscriberService.create(createSubscriberDto);
  }

  @Get()
  findAll() {
    return this.subscriberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscriberDto: SubscriberDto) {
    return this.subscriberService.update(+id, updateSubscriberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscriberService.remove(+id);
  }
}
