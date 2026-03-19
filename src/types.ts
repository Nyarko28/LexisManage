export type ContractStatus = 'Draft' | 'Review' | 'Active' | 'Expired' | 'Terminated';
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: string;
}

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

export interface Contract {
  id: string;
  title: string;
  party: string;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  category: string;
  description: string;
  owner: string;
  lastModified: string;
  authorId: string;
}

export interface DashboardStats {
  totalContracts: number;
  activeValue: number;
  expiringSoon: number;
  pendingReview: number;
}
