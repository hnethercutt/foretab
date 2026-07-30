'use client';
import { Box, List, ListItem, TextField } from '@mui/material';
import { useState } from 'react';
import { getUserBacklogItems, createNewBacklogItem, swapBacklogItemIndexes } from '@/services/tasks-service';
import { useAuth } from '@/context/auth-context';
import { BacklogTaskItem } from '@/types/tasks';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';

function Sortable({ id, index }: { id: string; index: number }) {
    const { ref } = useSortable({ id, index });

    return (
        <ListItem ref={ref}>{id}</ListItem>
    )
}

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

  function updateItemIndex(e: DragEndEvent) {
    if(e.canceled) { return };
    const {source} = e.operation;

    if(isSortable(source) && currentUser) {
      const {initialIndex, index} = source;

      if (initialIndex !== index) {
        setBacklogItems((backlogItems) => {
          const newBacklogItems = [...backlogItems];
          const [removed] = newBacklogItems.splice(initialIndex, 1);
          newBacklogItems.splice(index, 0, removed);
          return newBacklogItems;
        });

        swapBacklogItemIndexes(currentUser.accountId, initialIndex, index);
      }
    }
  }

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
        <DragDropProvider onDragEnd={updateItemIndex}>
          <List>
            {backlogItems.map((item, index) => (
              <Sortable key={item.id} id={item.description} index={index} />
            ))}
          </List>
        </DragDropProvider>
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
