'use client';
import { Box, List, ListItem, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { getUserBacklogItems, createNewBacklogItem, swapBacklogItemIndexes, deleteBacklogItem } from '@/services/tasks-service';
import { useAuth } from '@/context/auth-context';
import { BacklogTaskItem } from '@/types/tasks';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { Trash2Icon } from 'lucide-react';
import styles from './backlog.module.css';

function Sortable({ id, index }: { id: string; index: number }) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
    const { isDragging } = useSortable({ id, index, element, handle: handleRef });

    return (
        <ListItem ref={setElement} className={styles.item} data-shadow={isDragging || undefined}>
          {id}
          <button ref={handleRef} className={styles.handle} />
        </ListItem>
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
      swapBacklogItemIndexes(currentUser.accountId, initialIndex, index);
    }
  }

  function deleteTaskItem(e: React.MouseEvent<HTMLButtonElement>) {
    if(currentUser) {
      deleteBacklogItem(currentUser.accountId, e.currentTarget.id);
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
          <List className={styles.list}>
            {backlogItems.map((item, index) => (
              <div key={item.id}>
                <Sortable id={item.description} index={index} />
                <button id={item.id} onClick={deleteTaskItem}><Trash2Icon /></button>
              </div>
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
