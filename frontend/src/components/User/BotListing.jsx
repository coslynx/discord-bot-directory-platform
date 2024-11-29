import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Link } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';

const BotListing = ({ botId }) => {
  const { data: bot, isLoading, isError, error } = useQuery(['bot', botId], () => apiService.getBot(botId));

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><Typography>Loading...</Typography></Box>;
  }

  if (isError) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        height="140"
        image={bot.imageUrl || 'https://via.placeholder.com/150'} // Default image if none provided
        alt={bot.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {bot.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {bot.description}
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Prefix: {bot.prefix}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Guilds: {bot.guildCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Uptime: {bot.uptimePercentage}%
          </Typography>
          {bot.githubUrl && (
            <Link href={bot.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button size="small" variant="outlined">GitHub</Button>
            </Link>
          )}
          {bot.websiteUrl && (
            <Link href={bot.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Button size="small" variant="outlined">Website</Button>
            </Link>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BotListing;
```