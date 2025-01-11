import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: number, status: 'PENDING' | 'COMPLETED') => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onEdit,
  onStatusChange,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'success';
    }
  };

  return (
    <List>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          secondaryAction={
            <Box>
              <IconButton edge="end" onClick={() => onEdit(task)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => onDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          }
        >
          <Checkbox
            checked={task.status === 'COMPLETED'}
            onChange={() =>
              onStatusChange(
                task.id,
                task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
              )
            }
          />
          <ListItemText
            primary={
              <Typography
                style={{
                  textDecoration:
                    task.status === 'COMPLETED' ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </Typography>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">{task.description}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {task.dueDate && (
                    <Chip
                      label={new Date(task.dueDate).toLocaleDateString()}
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
