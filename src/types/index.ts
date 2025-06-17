export interface Giveaway {
  id: string;
  title: string;
  description: string;
  maxParticipants: number;
  endDate: string;
  createdAt: string;
  isActive: boolean;
}

export interface GiveawayEntry {
  id: string;
  giveawayId: string;
  name: string;
  location: string;
  phoneNumber: string;
  email: string;
  submittedAt: string;
}

export interface Winner {
  id: string;
  name: string;
  giveawayTitle: string;
  dateWon: string;
  imageUrl: string;
}