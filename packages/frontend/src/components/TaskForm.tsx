import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string(),
  priority: yup.string().oneOf(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: yup.date(),
});

interface TaskFormProps {
  onSubmit: (values: any) => void;
  initialValues?: any;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialValues }) => {
  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      description: '',
      priority: 'LOW',
      dueDate: '',
    },
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />

        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          multiline
          rows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
        />

        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select
            id="priority"
            name="priority"
            value={formik.values.priority}
            onChange={formik.handleChange}
            label="Priority"
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          id="dueDate"
          name="dueDate"
          label="Due Date"
          type="datetime-local"
          value={formik.values.dueDate}
          onChange={formik.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Button color="primary" variant="contained" fullWidth type="submit">
          {initialValues ? 'Update Task' : 'Create Task'}
        </Button>
      </Box>
    </form>
  );
};
