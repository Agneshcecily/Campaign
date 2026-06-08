import { Injectable } from '@nestjs/common';
import { SubscriberDto } from './dto/subscriber.dto';

@Injectable()
export class SubscriberService {
  create(SubscriberDto: SubscriberDto) {
    return 'This action adds a new subscriber';
  }

  findAll() {
    return `This action returns all subscriber`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscriber`;
  }

  update(id: number, SubscriberDto: SubscriberDto) {
    return `This action updates a #${id} subscriber`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriber`;
  }
}
