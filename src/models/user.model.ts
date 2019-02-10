import { Typegoose, prop, staticMethod, ModelType, pre, instanceMethod } from 'typegoose';
import { hash, compare } from 'bcryptjs';

export enum Role {
  SU = 'SU',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@pre<User>('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 12);
  }
})
export class User extends Typegoose {
  @prop({
    required: true,
    unique: true,
  })
  username: string;

  @prop({
    required: [true, 'password is required'],
    minlength: 6,
  })
  password: string;

  @prop({
    enum: Role,
    required: [true, 'role must be USER/ADMIN'],
  })
  role: Role;

  @prop()
  fullname?: string;

  @prop()
  employeeId?: string;

  @staticMethod
  static async doesntExist(this: ModelType<User> & typeof User, options: any) {
    return (await this.where(options).countDocuments()) === 0;
  }

  @instanceMethod
  matchesPassword(passCandidate: string) {
    return compare(passCandidate, this.password);
  }
}

export const UserModel = new User().getModelForClass(User);
