import React, { useState, useEffect } from 'react';
import { User, Wish, INITIAL_WISHES, MOCK_USERS } from './types';
import { generateWishImage } from './services/geminiService';
import WishCard from './components/WishCard';
import { LoginModal, CreateWishModal, ExchangeModal } from './components/Modals';
import { Stars, Sparkles, LogIn, LogOut, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  
  // Modals State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  
  // Exchange Flow State
  const [selectedExchangeWish, setSelectedExchangeWish] = useState<Wish | null>(null);
  const [targetContact, setTargetContact] = useState<string | null>(null);

  // Initialize from local storage or mock
  useEffect(() => {
    // In a real app, check session here
  }, []);

  // --- Handlers ---

  const handleLogin = (name: string, contactInfo: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      contactInfo,
      avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`
    };
    setUser(newUser);
    setIsLoginOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleCreateWish = async (description: string) => {
    if (!user) return;

    try {
      // 1. Generate Image
      const imageUrl = await generateWishImage(description);

      // 2. Create Wish Object
      const newWish: Wish = {
        id: `wish_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        description,
        imageUrl,
        createdAt: Date.now(),
        exchangedWith: [],
      };

      // 3. Update State
      setWishes(prev => [newWish, ...prev]);
    } catch (error) {
      console.error("Failed to create wish", error);
      alert("生成愿望失败，请稍后再试。");
    }
  };

  const openExchangeModal = (wish: Wish) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    
    // Check if already exchanged
    if (wish.exchangedWith.includes(user.id)) {
      // If already exchanged, just show the contact info directly (simulated by opening modal in success state logic)
      const targetUser = MOCK_USERS[wish.userId] || { contactInfo: 'Hidden Info' };
      setTargetContact(targetUser.contactInfo);
      setSelectedExchangeWish(wish);
      setIsExchangeOpen(true);
      // NOTE: In a real app, we'd handle "view only" differently, 
      // but here the modal logic handles success state display.
    } else {
      setTargetContact(null); // Will be revealed after submit
      setSelectedExchangeWish(wish);
      setIsExchangeOpen(true);
    }
  };

  const handleConfirmExchange = (myWishDescription: string) => {
    if (!user || !selectedExchangeWish) return;

    // Simulate "Backend" Logic:
    // 1. Find the target wish owner's real contact info
    // (In this mock, we check MOCK_USERS. For new users, we'd look them up in a user list)
    // Since this is a SPA without a real DB, let's pretend we can find users created in this session or mocks.
    
    // Simple mock logic: if it's a mock user, get from MOCK_USERS. 
    // If it was created by 'current session user', getting contact info is weird (self-exchange), but let's handle it.
    
    let contact = "Contact Info Unavailable in Mock";
    if (MOCK_USERS[selectedExchangeWish.userId]) {
      contact = MOCK_USERS[selectedExchangeWish.userId].contactInfo;
    } else {
      // For demo purposes, if we can't find the user in mocks, generate a fake one or assume 
      // the data would come from the backend response.
      contact = "Email: dreamer@wishshop.demo"; 
    }
    
    setTargetContact(contact);

    // 2. Update the wish to record the exchange
    const updatedWishes = wishes.map(w => {
      if (w.id === selectedExchangeWish.id) {
        return {
          ...w,
          exchangedWith: [...w.exchangedWith, user.id]
        };
      }
      return w;
    });

    setWishes(updatedWishes);
    // Note: The modal stays open to show success state
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Stars className="text-purple-400" />
              <span className="font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                愿望商店
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all border border-white/5 text-sm font-medium"
                  >
                    <PlusCircle size={16} /> 许愿
                  </button>
                  <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <span className="text-sm text-gray-300 hidden sm:block">{user.name}</span>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105"
                >
                  <LogIn size={16} /> 登录 / 注册
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="pt-32 pb-12 px-4 text-center relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
          <span className="block text-white mb-2">交换你的</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
             梦境与愿望
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8 leading-relaxed">
          在这里，每一个愿望都会化作一幅画。找到那个与你灵魂共鸣的愿望，
          交换彼此的故事，开启一段奇妙的邂逅。
        </p>
        
        {/* Mobile FAB for creating wish */}
        <div className="md:hidden fixed bottom-6 right-6 z-30">
          <button 
            onClick={() => user ? setIsCreateOpen(true) : setIsLoginOpen(true)}
            className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 active:scale-90 transition-transform"
          >
            <Sparkles className="text-white" size={24} />
          </button>
        </div>
      </header>

      {/* --- Wish Grid --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {wishes.map((wish) => (
            <WishCard
              key={wish.id}
              wish={wish}
              currentUser={user}
              isOwner={user?.id === wish.userId}
              onExchangeClick={openExchangeModal}
            />
          ))}
        </div>
        
        {wishes.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>还没有人许愿... 成为第一个吧！</p>
          </div>
        )}
      </main>

      {/* --- Footer --- */}
      <footer className="mt-20 border-t border-white/5 py-8 text-center text-gray-600 text-sm">
        <p>© 2024 Wish Exchange Shop. Powered by Gemini.</p>
      </footer>

      {/* --- Modals --- */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={handleLogin} 
      />
      
      <CreateWishModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onCreate={handleCreateWish} 
      />

      <ExchangeModal
        isOpen={isExchangeOpen}
        targetWish={selectedExchangeWish}
        onClose={() => setIsExchangeOpen(false)}
        onExchange={handleConfirmExchange}
        targetUserContact={targetContact}
      />

    </div>
  );
};

export default App;