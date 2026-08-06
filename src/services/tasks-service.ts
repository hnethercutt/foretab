import { BacklogTaskItem } from '@/types/tasks';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp, DocumentData, deleteDoc } from 'firebase/firestore';
import _ from 'lodash';

export async function getUserBacklogItems(accountId: string): Promise<Array<BacklogTaskItem>> {
  // Fetch the users entire backlog
  let backlogSnapshot = await getDocs(collection(db, 'backlog', accountId, 'tasks'));

  // And convert into the return object array
  let backlogItems = backlogSnapshot.docs.map((doc) => ({
    ...(doc.data() as BacklogTaskItem),
  }));

  // Keep the list organized for display. Firestore auto sorts alphabetically by ID
  // Default is 'custom order' they're auto added in date added order, but index changes when users manually reorder the items
  backlogItems = _.filter(backlogItems, function(_backlogItem) {
    return _backlogItem.index >= 0;
  });
  backlogItems = _.orderBy(backlogItems, ['index'], ['asc']);

  return backlogItems;
}

// Will modify param and return object when I add in the tagging feature
export async function createNewBacklogItem(accountId: string, newItemDescription: string) {
  // Doing this one separately so I can grab the generated id
  let newDocRef = doc(collection(db, 'backlog', accountId, 'tasks'));
  let taskCount = await getBacklogTaskCount(accountId);

  await setDoc(newDocRef, {
    dateAdded: serverTimestamp(),
    description: newItemDescription,
    id: newDocRef.id,
    index: taskCount,
    tag: '',
  });

  // Need to increase the task count now that we have added a new one
  updateBacklogTaskCount(accountId, taskCount + 1);
}

async function getBacklogTaskCount(accountId: string): Promise<number> {
  let backlogTaskCount = -1;
  let backlogSnapshot = await getDoc(doc(db, 'backlog', accountId));
  if (backlogSnapshot.data()) {
    let backlogData = backlogSnapshot.data();
    backlogTaskCount = backlogData?.taskCount;
  }

  return backlogTaskCount;
}

function updateBacklogTaskCount(accountId: string, newTaskCount: number) {
  updateDoc(doc(db, 'backlog', accountId), {
    taskCount: newTaskCount,
  });
}

export async function updateBacklogItemDescription(accountId: string, itemId: string, newDescription: string) {
  await updateDoc(doc(db, 'backlog', accountId, 'tasks', itemId), {
    description: newDescription
  });
}

// For handling user sorting items
export async function swapBacklogItemIndexes(accountId: string, initialIndex: number, newIndex: number) {
  let backlogSnapshot = await getDocs(
    collection(db, 'backlog', accountId, 'tasks')
  );

  let backlogItems = backlogSnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));

  let itemsToMoveUp, itemsToMoveDown: Array<DocumentData> = [],
      draggedItem: DocumentData;

  // The item the user moved
  draggedItem = _.filter(backlogItems, function (_backlogItem) {
    return _backlogItem.index === initialIndex;
  });

  // The item is moving farther up the list, which means the index is decreasing
  if (initialIndex < newIndex) {
    itemsToMoveUp = _.filter(backlogItems, function (_backlogItem) {
      return _backlogItem.index > initialIndex && _backlogItem.index <= newIndex;
    });

    // Want to make sure any items that are moved as a result of moving the dragged one are updated
    _.forEach(itemsToMoveUp, function (_item) {
      updateDoc(doc(db, 'backlog', accountId, 'tasks', _item.id), {
        index: _item.index - 1,
      });
    });
  // The item is moving farther down/index increasing
  } else if (initialIndex > newIndex) {
    itemsToMoveDown = _.filter(backlogItems, function (_backlogItem) {
      return _backlogItem.index < initialIndex && _backlogItem.index >= newIndex;
    });

    _.forEach(itemsToMoveDown, function (_item) {
      updateDoc(doc(db, 'backlog', accountId, 'tasks', _item.id), {
        index: _item.index + 1,
      });
    });
  }

  // Finally update the index of the dragged item, so now the index order in the db matches the view
  updateDoc(doc(db, 'backlog', accountId, 'tasks', draggedItem[0].id), {
    index: newIndex,
  });
}

export async function deleteBacklogItem(accountId: string, itemId: string) {
  let backlogSnapshot = await getDocs(
    collection(db, 'backlog', accountId, 'tasks')
  );

  let backlogItems = backlogSnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));

  let taskCount = await getBacklogTaskCount(accountId);

  let itemsToMoveUp: Array<DocumentData> = [],
      itemToDelete: DocumentData;

  itemToDelete = _.filter(backlogItems, function (_backlogItem) {
    return _backlogItem.id === itemId;
  });

  // No need to check and update other items if the one being deleted was the only one on the account
  if (itemToDelete[0].index !== taskCount - 1) {
    // Any item below the deleted one must be updated
    itemsToMoveUp = _.filter(backlogItems, function (_backlogItem) {
      return _backlogItem.index > itemToDelete[0].index;
    });

    _.forEach(itemsToMoveUp, function (_item) {
      updateDoc(doc(db, 'backlog', accountId, 'tasks', _item.id), {
        index: _item.index - 1,
      });
    });
  }

  // Finally delete the item and update the count
  await deleteDoc(doc(db, 'backlog', accountId, 'tasks', itemId));
  updateBacklogTaskCount(accountId, taskCount - 1);
}

export async function moveBacklogItemToForetab(accountId: string, itemId: string, description: string) {
  let taskCount = await getForetabTaskCount(accountId);
  let newDocRef = doc(collection(db, 'foretab', accountId, 'tasks'));

  await setDoc(newDocRef, {
    dateAdded: serverTimestamp(),
    description: description,
    id: itemId,
    index: 0,
    isComplete: false,
    status: "open",
    tag: ""
  });

  updateForetabTaskCount(accountId, taskCount + 1);
}


async function getForetabTaskCount(accountId: string): Promise<number> {
  let foretabTaskCount = -1;
  let foretabSnapshot = await getDoc(doc(db, 'foretab', accountId));
  if (foretabSnapshot.data()) {
    let foretabData = foretabSnapshot.data();
    foretabTaskCount = foretabData?.taskCount;
  }

  return foretabTaskCount;
}

function updateForetabTaskCount(accountId: string, newTaskCount: number) {
  updateDoc(doc(db, 'foretab', accountId), {
    taskCount: newTaskCount,
  });
}