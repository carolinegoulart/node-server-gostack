import { getRepository } from 'typeorm';
import User from '../models/User';
import { hash } from 'bcryptjs';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const checkIfUserExists = await usersRepository.findOne({
      where: { email },
    });

    if (checkIfUserExists) {
      throw new Error('Email address is already used.');
    }

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;