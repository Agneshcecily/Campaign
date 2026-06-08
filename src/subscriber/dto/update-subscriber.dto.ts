import { PartialType } from '@nestjs/mapped-types';
import { SubscriberDto } from './subscriber.dto';


export class UpdateSubscriberDto extends PartialType(SubscriberDto) {}
