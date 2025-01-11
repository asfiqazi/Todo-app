import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Priority, Status } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: number, data: {
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: string | Date;
  }) {
    return this.prisma.task.create({
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
        userId,
      },
    });
  }

  async getTasks(userId: number, filters?: {
    status?: Status;
    priority?: Priority;
  }) {
    return this.prisma.task.findMany({
      where: {
        userId,
        ...filters,
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  async updateTask(userId: number, taskId: number, data: {
    title?: string;
    description?: string;
    priority?: Priority;
    status?: Status;
    dueDate?: string | Date;
  }) {
    return this.prisma.task.update({
      where: {
        id: taskId,
        userId,
      },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      },
    });
  }

  async deleteTask(userId: number, taskId: number) {
    return this.prisma.task.delete({
      where: {
        id: taskId,
        userId,
      },
    });
  }
}
