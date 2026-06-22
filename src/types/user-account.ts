import { Timestamp } from 'firebase/firestore';

export interface UserAccount {
    accountId: string;
    dateCreated: Timestamp;
    displayName: string | null;
    email: string | null;
}