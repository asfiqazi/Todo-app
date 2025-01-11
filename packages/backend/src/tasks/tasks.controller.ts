import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Priority, Status } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(
    @Request() req,
    @Body() data: {
      title: string;
      description?: string;
      priority?: Priority;
      dueDate?: Date;
    },
  ) {
    return this.tasksService.createTask(req.user.id, data);
  }

  @Get()
  getTasks(
    @Request() req,
    @Query('status') status?: Status,
    @Query('priority') priority?: Priority,
  ) {
    return this.tasksService.getTasks(req.user.id, { status, priority });
  }

  @Put(':id')
  updateTask(
    @Request() req,
    @Param('id') id: string,
    @Body() data: {
      title?: string;
      description?: string;
      priority?: Priority;
      status?: Status;
      dueDate?: Date;
    },
  ) {
    return this.tasksService.updateTask(req.user.id, +id, data);
  }

  @Delete(':id')
  deleteTask(@Request() req, @Param('id') id: string) {
    return this.tasksService.deleteTask(req.user.id, +id);
  }
}
