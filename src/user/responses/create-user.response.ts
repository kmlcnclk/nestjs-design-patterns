import { User } from '../schemas/user.schema';

export class CreateUserResponse {
  readonly name: string;
  readonly email: string;

  constructor(data: User) {
    this.name = data.name;
    this.email = data.email;
  }

  static fromUser(data: User): CreateUserResponse {
    return new CreateUserResponse(data);
  }
}
