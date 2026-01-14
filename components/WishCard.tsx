import React from 'react';
import { Wish, User } from '../types';
import { Heart, RefreshCw, Lock, Unlock } from 'lucide-react';

interface WishCardProps {
  wish: Wish;
  currentUser: User | null;
  onExchangeClick: (wish: Wish) => void;
  isOwner: boolean;
}

const WishCard: React.FC<WishCardProps> = ({ wish, currentUser, onExchangeClick, isOwner }) => {
  const hasExchanged = currentUser && wish.exchangedWith.includes(currentUser.id);
  
  return (
    <div className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
      
      {/* Image Container */}
      <div className="aspect-square w-full overflow-hidden relative">
        <img 
          src={wish.imageUrl} 
          alt={wish.description} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {hasExchanged ? (
            <span className="bg-green-500/20 text-green-300 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-green-500/30 flex items-center gap-1">
              <Unlock size={12} /> 已交换
            </span>
          ) : (
            <span className="bg-white/10 text-white/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1">
              <Lock size={12} /> 待交换
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
            {wish.userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-300 font-medium">{wish.userName}</span>
        </div>

        <p className="text-white text-lg font-light leading-relaxed line-clamp-2">
          {wish.description}
        </p>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {new Date(wish.createdAt).toLocaleDateString()}
          </div>
          
          {!isOwner && (
            <button
              onClick={() => onExchangeClick(wish)}
              disabled={!!hasExchanged}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                hasExchanged 
                  ? 'bg-gray-700/50 text-gray-400 cursor-default'
                  : 'bg-white text-black hover:bg-pink-500 hover:text-white transform hover:scale-105 active:scale-95'
              }`}
            >
              {hasExchanged ? (
                <>已查看信息</>
              ) : (
                <>
                  <RefreshCw size={14} /> 交换愿望
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishCard;