'use client';
import { Box, List, ListItem, ListItemText, ListItemIcon, TextField, Paper, MenuList, MenuItem } from '@mui/material';
import { useRef, useState } from 'react';
import { getUserBacklogItems, createNewBacklogItem, swapBacklogItemIndexes, deleteBacklogItem, updateBacklogItemDescription } from '@/services/tasks-service';
import { useAuth } from '@/context/auth-context';
import { BacklogTaskItem } from '@/types/tasks';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { Ellipsis, Trash2, PencilLine } from 'lucide-react';
import styles from './backlog.module.css';

export default function Backlog() {
  const currentUser = useAuth();
  const [backlogItems, setBacklogItems] = useState<Array<BacklogTaskItem>>([]);

  // Blocking this from dynamically updating to prevent double rendering after sorting items
  if (currentUser && backlogItems.length === 0) {
    // Display all items currently in the users backlog
    getUserBacklogItems(currentUser.accountId).then(function (_backlogItems) {
      setBacklogItems(_backlogItems);
    });
  }

  // For toggling show/hide options menu for a task item
  const [showOptions, setShowOptions] = useState<boolean>(false);
  // So we know which options menu to show/set to index of corresponding task item
  const [showOptionsIndex, setShowOptionsIndex] = useState<number>(-1);

  // For toggling edit mode
  const [editMode, setEditMode] = useState<boolean>(false);
  // So we know which item is being edited
  const [editModeIndex, setEditModeIndex] = useState<number>(-1);
  // Used to keep track of the text in the edit field.
  const editTextRef = useRef<HTMLInputElement | null>(null);

  // Render the backlog items in a sortable list
  function Sortable({ id, index }: { id: string; index: number }) {
    const [element, setElement] = useState<Element | null>(null);
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const { isDragging } = useSortable({ id, index, element, handle: handleRef });

    return (
      <ListItem ref={setElement} className={styles.item} data-shadow={isDragging || undefined}>
        {!editMode && <ListItemText>{id}</ListItemText>}
        {/* Only show edit mode for the selected item */}
        {editMode && editModeIndex === index && (
          <TextField
            defaultValue={backlogItems[index].description}
            inputRef={editTextRef}
            variant="standard"
            onKeyDown={handleEditTaskItem}
          />
        )}
        <button ref={handleRef} className={styles.handle} />
        <div>
          <button
            id={index.toString()}
            onClick={() => {
              setShowOptions(!showOptions);
              setShowOptionsIndex(index);
            }}
          >
            <Ellipsis />
          </button>
          {showOptions && showOptionsIndex === index && (
            <Paper sx={{ width: 275, maxWidth: '100%' }}>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    setEditMode(true);
                    setEditModeIndex(index);
                    setShowOptions(false);
                    setShowOptionsIndex(-1);
                  }}
                >
                  <ListItemIcon>
                    <PencilLine />
                  </ListItemIcon>
                  <ListItemText>Rename</ListItemText>
                </MenuItem>
                <MenuItem id={index.toString()} onClick={deleteTaskItem}>
                  <ListItemIcon>
                    <Trash2 />
                  </ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </MenuList>
            </Paper>
          )}
        </div>
      </ListItem>
    );
  }

  const handleEditTaskItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentUser) {
      const updatedDescription = editTextRef.current?.value ?? '';

      // Need to go ahead and update the state so that the new description displays automatically
      setBacklogItems((prevBacklogItems) =>
        prevBacklogItems.map((backlogItem) =>
          // Only updating the item that was edited
          backlogItem.index === editModeIndex ? {
              ...backlogItem,
              description: updatedDescription,
            }
          : backlogItem
        )
      );

      // Turn off/reset edit mode so the view swaps back to a list item
      setEditMode(false);
      setEditModeIndex(-1);
      // And update the database with the new description
      await updateBacklogItemDescription(currentUser.accountId, backlogItems[editModeIndex].id, updatedDescription);
    }
  };

  const [input, setInput] = useState<string>('');

  // Dynamically add new items to the backlog by just hitting enter in the input field
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentUser) {
        await createNewBacklogItem(currentUser.accountId, input);
        // Since I blocked dynamic updating, will need to refetch when a new item is added to show that dynamically
        getUserBacklogItems(currentUser.accountId).then(function (_backlogItems) {
            setBacklogItems(_backlogItems);
            // And clear out the text field to make life easier :)
            setInput('');
          }
        );
      }
    }
  };

  // Handle saving the new backlog list order after an item is moved
  function updateItemIndex(e: DragEndEvent) {
    if (e.canceled) {
      return;
    }
    const { source } = e.operation;

    if (isSortable(source) && currentUser) {
      const { initialIndex, index } = source;
      swapBacklogItemIndexes(currentUser.accountId, initialIndex, index);
    }
  }

  async function deleteTaskItem(e: React.MouseEvent<HTMLElement>) {
    // Close out the options menu since the button was clicked from inside of it
    setShowOptions(false);
    setShowOptionsIndex(-1);

    if (currentUser) {
      let index = Number(e.currentTarget.id);
      await deleteBacklogItem(currentUser.accountId, backlogItems[index].id);
      // Again since db updates won't trigger rerendering of the list, need to delete the item from the state array as well
      setBacklogItems((prevBacklogItems) =>
        prevBacklogItems.filter(
          (backlogItem) => backlogItem.id !== backlogItems[index].id
        )
      );
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
