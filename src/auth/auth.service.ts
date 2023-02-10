import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { TID } from 'src/room/interfaces/hotel.room.interfaces';
import { User } from 'src/users/schemas/user.schemas';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO) {
    try {
      const user = await this.validateUser(loginDTO);
      if (user) return this.generateToken(user);
      throw new UnauthorizedException();
    } catch (error) {
      return error;
    }
  }

  async validateUser(loginDTO: LoginDTO) {
    try {
      const user = await this.userService.findByEmail(loginDTO.email);
      if (user) {
        const id = (user as User & { _id: TID })._id;
        const updateUserDeauth = await this.userService.updateDeauth(id, false);
        return updateUserDeauth;
      }

      return null;
    } catch (error) {
      return error;
    }
  }

  private async generateToken(user: any) {
    const payload = {
      email: user.email,
      id: user.id,
      roles: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async registration(userDTO: CreateUserDTO) {
    if (!userDTO) {
      throw {
        message: 'Данные должны быть заполненны',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    const candidate = await this.userService.findByEmail(userDTO.email);
    if (candidate) {
      throw {
        message: 'Пользователь с таким email уже существует',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    const hashPassword = await bcrypt.hash(userDTO.password, 5);

    return await this.userService.create({
      ...userDTO,
      password: hashPassword,
    });
  }

  async logout(id: TID) {
    return await this.userService.updateDeauth(id, true);
  }
}
