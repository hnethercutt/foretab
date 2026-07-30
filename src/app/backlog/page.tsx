'use client';
import { Box, List, ListItem, TextField } from '@mui/material';
import { useState } from 'react';
import { getUserBacklogItems, createNewBacklogItem } from '@/services/tasks-service';
import { useAuth } from '@/context/auth-context';
import { BacklogTaskItem } from '@/types/tasks';

export default function Backlog() {
  const currentUser = useAuth();
  const [backlogItems, setBacklogItems] = useState<Array<BacklogTaskItem>>([]);

  if (currentUser) {
    // Display all items currently in the users backlog
    getUserBacklogItems(currentUser.accountId).then(function (_backlogItems) {
      setBacklogItems(_backlogItems);
    });
  }

  const [input, setInput] = useState<string>('');

  // Dynamically add new items to the backlog by just hitting enter in the input field
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentUser) {
        createNewBacklogItem(currentUser.accountId, input);
      }
      setInput('');
    }
  };

  return (
    <div>
      <Box
        sx={{
          width: '100%',
          maxWidth: 360,
          border: '1px solid',
          borderColor: '#000',
        }}
      >
        <List>
          {backlogItems.map((item, index) => (
            <ListItem
              key={item.id}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              {item.description}
            </ListItem>
          ))}
        </List>
      </Box>
      <TextField
        variant="outlined"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setInput(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
