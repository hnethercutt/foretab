import { BacklogTaskItem } from '@/types/tasks';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';

export async function getUserBacklogItems(accountId: string): Promise<Array<BacklogTaskItem>> {
  // Fetch the users entire backlog
  let backlogSnapshot = await getDocs(
    collection(db, 'backlog', accountId, 'tasks')
  );

  // And convert into the return object array
  let backlogItems = backlogSnapshot.docs.map((doc) => ({
    ...(doc.data() as BacklogTaskItem),
  }));

  return backlogItems;
}

// Will modify param and return object when I add in the tagging feature
export async function createNewBacklogItem(accountId: string, newItemDescription: string) {
  // Doing this one separately so I can grab the generated id
  let newDocRef = doc(collection(db, 'backlog', accountId, 'tasks'));

  await setDoc(newDocRef, {
    dateAdded: serverTimestamp(),
    description: newItemDescription,
    id: newDocRef.id,
    tag: '',
  });
}
