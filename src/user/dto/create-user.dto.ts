import { createUserSchema } from '../zodSchemas/create-user.zod';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;

  constructor(data: { name: string; email: string; password: string }) {
    const validatedData = createUserSchema.parse(data);
    console.log(validatedData);
    this.name = validatedData.name;
    this.email = validatedData.email;
    this.password = validatedData.password;
  }
}
