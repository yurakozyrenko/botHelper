import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

import { User } from '../entity/users.entity';

export class UserDto {
  @IsInt()
  id: User['id'];

  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(1000)
  @Max(999999999999999)
  chatId: User['chatId'];
}
