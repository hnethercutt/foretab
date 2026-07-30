import { Timestamp } from 'firebase/firestore';

export type BacklogTaskItem = {
    dateAdded: Timestamp,
    description: string,
    id: string,
    tag: string | null
};