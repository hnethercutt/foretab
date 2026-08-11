import { Timestamp } from 'firebase/firestore';

export type BacklogTaskItem = {
  dateAdded: Timestamp;
  description: string;
  id: string;
  index: number;
  tag: string | null;
};

export type ForetabTaskItem = {
  dateAdded: Timestamp;
  description: string;
  id: string;
  index: number;
  isComplete: boolean;
  status: string;
  tag: string | null;
};
