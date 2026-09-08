'use client';
import { Box, List, ListItem, ListItemText, ListItemIcon, TextField, Paper, MenuList, MenuItem } from '@mui/material';
import { useRef, useState } from 'react';
import { fetchUserForetabItems, createNewBacklogItem, swapBacklogItemIndexes, deleteBacklogItem, updateBacklogItemDescription, moveBacklogItemToForetab } from '@/services/tasks-service';
import { useAuth } from '@/context/auth-context';
import { BacklogTaskItem } from '@/types/tasks';
import { useSortable, isSortable } from '@dnd-kit/react/sortable';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { Ellipsis, Trash2, PencilLine, SmilePlus } from 'lucide-react';

export default function Foretab() {
  const currentUser = useAuth();
  const [foretabItems, setForetabItems] = useState<Array<BacklogTaskItem>>([]);

  if (currentUser && foretabItems.length === 0) {
    fetchUserForetabItems(currentUser.accountId).then(function (_foretabItems) {
      setForetabItems(_foretabItems);
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
      <ListItem
        ref={setElement}
        data-shadow={isDragging || undefined}
      >
        {!editMode && <ListItemText>{id}</ListItemText>}
        {/* Only show edit mode for the selected item */}
        {editMode && editModeIndex === index && (
          <TextField
            defaultValue={foretabItems[index].description}
            inputRef={editTextRef}
            variant="standard"
            onKeyDown={handleEditTaskItem}
          />
        )}
        <button ref={handleRef} />
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
                  onClick={async (e: React.MouseEvent<HTMLElement>) => {
                    if (currentUser) {
                      // Move the selected item from the backlog to the foretab
                      await moveBacklogItemToForetab(currentUser.accountId, foretabItems[index].id, foretabItems[index].description);
                      await deleteBacklogItem(currentUser.accountId, foretabItems[index].id);
                      setForetabItems((prevForetabItems) =>
                        prevForetabItems.filter(
                          (foretabItem) =>
                            foretabItem.id !== foretabItems[index].id
                        )
                      );
                    }
                  }}
                >
                  <ListItemIcon>
                    <SmilePlus />
                  </ListItemIcon>
                  <ListItemText>Add to your Foretab</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    // Enabled editing for the selected item
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
                {/* Delete the selected item from the backlog */}
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
      setForetabItems((prevForetabItems) =>
        prevForetabItems.map((foretabItem) =>
          // Only updating the item that was edited
          foretabItem.index === editModeIndex? {
            ...foretabItem,
            description: updatedDescription,
          } : foretabItem
        )
      );

      // Turn off/reset edit mode so the view swaps back to a list item
      setEditMode(false);
      setEditModeIndex(-1);
      // And update the database with the new description
      await updateBacklogItemDescription(currentUser.accountId, foretabItems[editModeIndex].id, updatedDescription);
    }
  };

  const [input, setInput] = useState<string>('');

  // Dynamically add new items to the backlog by just hitting enter in the input field
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentUser) {
        await createNewBacklogItem(currentUser.accountId, input);
        // Since I blocked dynamic updating, will need to refetch when a new item is added to show that dynamically
        fetchUserForetabItems(currentUser.accountId).then(
          function (_foretabItems) {
            setForetabItems(_foretabItems);
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
      await deleteBacklogItem(currentUser.accountId, foretabItems[index].id);
      // Again since db updates won't trigger rerendering of the list, need to delete the item from the state array as well
      setForetabItems((prevForetabItems) =>
        prevForetabItems.filter(
          (foretabItem) => foretabItem.id !== foretabItems[index].id
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
          <List>
            {foretabItems.map((item, index) => (
              <Sortable key={item.id} id={item.description} index={index} />
            ))}
          </List>
        </DragDropProvider>
      </Box>
    </div>
  );
}
