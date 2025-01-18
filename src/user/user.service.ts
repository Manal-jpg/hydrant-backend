import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Create a new user
  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData); // Prepare user instance
    return this.userRepository.save(newUser); // Save to database
  }

  // Find all users
  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Find a user by ID
  async findUserById(userId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ user_id: userId });
  }

  // Update a user's data
  async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, updateData);
    return this.userRepository.findOneBy({ user_id: userId });
  }

  // Delete a user
  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
