export interface User {
  id: string;
  name: string;
  contactInfo: string; // WeChat ID, Email, etc.
  avatarUrl?: string;
}

export interface Wish {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  exchangedWith: string[]; // List of user IDs who have exchanged
}

// Helper for initial mock data
export const INITIAL_WISHES: Wish[] = [
  {
    id: '1',
    userId: 'mock_user_1',
    userName: 'StarGazer',
    description: '我希望能在极光下露营，看着绿色的光带舞动。',
    imageUrl: 'https://picsum.photos/seed/aurora/600/600',
    createdAt: Date.now() - 100000,
    exchangedWith: [],
  },
  {
    id: '2',
    userId: 'mock_user_2',
    userName: 'CoffeeLover',
    description: '我想在巴黎的街头开一家充满了花香的咖啡馆。',
    imageUrl: 'https://picsum.photos/seed/coffee/600/600',
    createdAt: Date.now() - 200000,
    exchangedWith: [],
  },
  {
    id: '3',
    userId: 'mock_user_3',
    userName: 'CyberPunk',
    description: '希望拥有一只能够听懂我心事的机械猫。',
    imageUrl: 'https://picsum.photos/seed/robotcat/600/600',
    createdAt: Date.now() - 300000,
    exchangedWith: [],
  }
];

export const MOCK_USERS: Record<string, User> = {
  'mock_user_1': { id: 'mock_user_1', name: 'StarGazer', contactInfo: 'WeChat: star_gazer_99' },
  'mock_user_2': { id: 'mock_user_2', name: 'CoffeeLover', contactInfo: 'Email: coffee@paris.dream' },
  'mock_user_3': { id: 'mock_user_3', name: 'CyberPunk', contactInfo: 'TG: @cyber_kitty' },
};