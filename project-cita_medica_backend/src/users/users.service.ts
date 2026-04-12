import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password_hash: await bcrypt.hash(dto.password, 10),
        rol: dto.rol,
        activo: dto.activo ?? true,
      },
      select: {
        id: true,
        username: true,
        rol: true,
        activo: true,
        created_at: true,
      },
    });

    // ✅ CONVERSIÓN BigInt → string
    return {
      ...user,
      id: user.id.toString(),
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        rol: true,
        activo: true,
        created_at: true,
        last_login_at: true,
      },
    });

    // ✅ CONVERSIÓN BigInt → string
    return users.map((u) => ({
      ...u,
      id: u.id.toString(),
    }));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        username: true,
        rol: true,
        activo: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // ✅ CONVERSIÓN BigInt → string
    return {
      ...user,
      id: user.id.toString(),
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: BigInt(id) },
      data: {
        username: dto.username,
        rol: dto.rol,
        activo: dto.activo,
        password_hash: dto.password
          ? await bcrypt.hash(dto.password, 10)
          : undefined,
      },
      select: {
        id: true,
        username: true,
        rol: true,
        activo: true,
      },
    });

    // ✅ CONVERSIÓN BigInt → string
    return {
      ...user,
      id: user.id.toString(),
    };
  }
}