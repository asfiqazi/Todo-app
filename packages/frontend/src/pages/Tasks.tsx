import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';
import { tasks as tasksApi } from '../services/api';
import { Task } from '../types';
import { useNavigate } from 'react-router-dom';

export const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchTasks = async () => {
    try {
      const response = await tasksApi.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      if ((error as any)?.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (values: any) => {
    try {
      await tasksApi.create(values);
      fetchTasks();
      setOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (values: any) => {
    if (!editTask) return;
    try {
      await tasksApi.update(editTask.id, values);
      fetchTasks();
      setEditTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await tasksApi.delete(id);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusChange = async (id: number, status: 'PENDING' | 'COMPLETED') => {
    try {
      await tasksApi.update(id, { status });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'ALL' || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h4">Tasks</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
            >
              Add Task
            </Button>
          </Box>

          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TaskList
            tasks={filteredTasks}
            onDelete={handleDeleteTask}
            onEdit={setEditTask}
            onStatusChange={handleStatusChange}
          />
        </Paper>
      </Box>

      <Dialog
        open={open || Boolean(editTask)}
        onClose={() => {
          setOpen(false);
          setEditTask(null);
        }}
      >
        <DialogTitle>
          {editTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TaskForm
              onSubmit={editTask ? handleUpdateTask : handleCreateTask}
              initialValues={editTask}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};
