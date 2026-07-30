import { BacklogTaskItem } from '@/types/tasks';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp, DocumentData, deleteDoc } from 'firebase/firestore';
import _ from 'lodash';

export async function getUserBacklogItems(accountId: string): Promise<Array<BacklogTaskItem>> {
  // Fetch the users entire backlog
  let backlogSnapshot = await getDocs(
    collection(db, 'backlog', accountId, 'tasks')
  );

  // And convert into the return object array
  let backlogItems = backlogSnapshot.docs.map((doc) => ({
    ...(doc.data() as BacklogTaskItem),
  }));

  // Keep the list organized for display. Firestore auto sorts alphabetically by ID
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
    if(backlogSnapshot.data()) {
        let backlogData = backlogSnapshot.data();
        backlogTaskCount = backlogData?.taskCount;
    }

    return backlogTaskCount;
}

function updateBacklogTaskCount(accountId: string, newTaskCount: number) {
    updateDoc(doc(db, 'backlog', accountId), {
        taskCount: newTaskCount
    });
}

export async function swapBacklogItemIndexes(accountId: string, initialIndex: number, newIndex: number) {
  let backlogSnapshot = await getDocs(
    collection(db, 'backlog', accountId, 'tasks')
  );

  let backlogItems = backlogSnapshot.docs.map((doc) => ({
    ...doc.data()
  }));

  let itemsToMoveUp, itemsToMoveDown: Array<DocumentData> = [],
      draggedItem: DocumentData;

  draggedItem = _.filter(backlogItems, function(_backlogItem) {
    return _backlogItem.index === initialIndex;
  });


  if (initialIndex < newIndex) {
    itemsToMoveUp = _.filter(backlogItems, function(_backlogItem) {
      return _backlogItem.index > initialIndex && _backlogItem.index <= newIndex;
    });

    _.forEach(itemsToMoveUp, function(_item) {
      updateDoc(doc(db, 'backlog', accountId, 'tasks', _item.id), {
        index: _item.index - 1
      });
    });
  } else if (initialIndex > newIndex) {
    itemsToMoveDown = _.filter(backlogItems, function(_backlogItem) {
      return _backlogItem.index < initialIndex && _backlogItem.index >= newIndex;
    });

    _.forEach(itemsToMoveDown, function(_item) {
      updateDoc(doc(db, 'backlog', accountId, 'tasks', _item.id), {
        index: _item.index + 1
      })
    });
  }

  updateDoc(doc(db, 'backlog', accountId, 'tasks', draggedItem[0].id), {
    index: newIndex
  });
}

export async function deleteBacklogItem(accountId: string, itemId: string) {
  let backlogSnapshot = await getDocs(
    collection(db, 'backlog', accountId, 'tasks')
  );

  let backlogItems = backlogSnapshot.docs.map((doc) => ({
    ...doc.data()
  }));

  let taskCount = await getBacklogTaskCount(accountId);

  let itemsToMoveUp, itemsToMoveDown: Array<DocumentData> = [],
      itemToDelete: DocumentData;

  itemToDelete = _.filter(backlogItems, function(_backlogItem) {
    return _backlogItem.id === itemId;
  });


  if(itemToDelete[0].index !== taskCount - 1) {
    itemsToMoveUp = _.filter(backlogItems, function(_backlogItem) {
      return _backlogItem.index > itemToDelete[0].index;
    });

    _.forEach(itemsToMoveUp, function(_item) {
      updateDoc(doc(db, 'backlog', accountId, 'tasks', _item.id), {
        index: _item.index - 1
      });
    });
  }

  await deleteDoc(doc(db, 'backlog', accountId, 'tasks', itemId));
  updateBacklogTaskCount(accountId, taskCount - 1);
}
