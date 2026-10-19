export type LetterNetwork = 'TMO' | 'INFRA &FM' | 'SYSTEM' | 'MMMP';

export type LetterDirection = 'IN' | 'OUT';

export type LetterStatus = 'OPEN' | 'UNDER_REVIEW' | 'CLOSED';

export type LetterPriority = 'NORMAL' | 'HIGH' | 'URGENT';

export type LetterCategory = 'LETTER' | 'MEMO' | 'CIRCULAR' | 'CONTRACT' | 'TECHNICAL';

export interface Letter {
  id: string;
  refNumber: string;
  date: string;
  network: LetterNetwork;
  direction: LetterDirection;
  category?: LetterCategory;
  sender: string;
  recipient: string;
  subject: string;
  status: LetterStatus;
  requiresReply: boolean;
  replyDeadline?: string;
  isEscalated?: boolean;
  escalationReason?: string;
  notes?: string;
  attachmentsCount?: number;
  priority: LetterPriority;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  quickTab: 'TOTAL' | 'IN' | 'OUT' | 'OPEN' | 'CLOSED' | 'NEED_REPLY' | 'ESCALATED';
  network: string;
  direction: string;
  status: string;
  requiresReply: string;
  isEscalated: string;
  priority: string;
}
