import { BacklogTaskItem } from '@/types/tasks';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
  backlogItems = _.orderBy(backlogItems, ['index'], ['desc']);

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
