import  as React from 'react';
import { Box, Grid, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Button, TextField, IconButton, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


const UserManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedRole, setEditedRole] = useState('');


  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users', searchQuery, selectedRole],
    queryFn: () => apiService.getUsers(searchQuery, selectedRole),
  });

  const updateUserMutation = useMutation(
    (userData) => apiService.updateUser(userData.id, userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        setEditingUser(null);
        setEditedUsername('');
        setEditedRole('');
      },
    }
  );

  const deleteUserMutation = useMutation(
    (userId) => apiService.deleteUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
      },
    }
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditedUsername(user.username);
    setEditedRole(user.role);
  };

  const handleSaveClick = () => {
    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        username: editedUsername,
        role: editedRole,
      });
    }
  };

  const handleCancelClick = () => {
    setEditingUser(null);
    setEditedUsername('');
    setEditedRole('');
  };


  const handleDeleteClick = (userId) => {
    deleteUserMutation.mutate(userId);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search by Username"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>Search</IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Filter by Role</InputLabel>
            <Select value={selectedRole} onChange={handleRoleChange}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editingUser?.id === user.id ? (
                    <TextField value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} />
                  ) : (
                    user.username
                  )}
                </TableCell>
                <TableCell>
                  {editingUser?.id === user.id ? (
                    <FormControl fullWidth>
                      <Select value={editedRole} onChange={(e) => setEditedRole(e.target.value)}>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    user.role
                  )}
                </TableCell>
                <TableCell>
                  {editingUser?.id === user.id ? (
                    <>
                      <Button variant="contained" color="primary" onClick={handleSaveClick}>Save</Button>
                      <Button onClick={handleCancelClick}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEditClick(user)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(user.id)}><DeleteIcon /></IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
```