import React, { useState } from 'react';
import { X, Sparkles, Loader2, Send } from 'lucide-react';
import { User, Wish } from '../types';

interface ModalBaseProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalBase: React.FC<ModalBaseProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1e293b] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Login Modal ---
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, contact: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && contact.trim()) {
      onLogin(name, contact);
      setName('');
      setContact('');
    }
  };

  return (
    <ModalBase title="进入神秘商店" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">你的代号</label>
          <input
            type="text"
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
            placeholder="例如：追风筝的人"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">社交联络方式</label>
          <input
            type="text"
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
            placeholder="例如：WeChat ID / Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500 mt-1">此信息仅对与你成功交换愿望的人可见。</p>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95"
        >
          开启旅程
        </button>
      </form>
    </ModalBase>
  );
};

// --- Create Wish Modal ---
interface CreateWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (description: string) => Promise<void>;
}

export const CreateWishModal: React.FC<CreateWishModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);
    try {
      await onCreate(description);
      setDescription('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase title="许下一个愿望" isOpen={isOpen} onClose={() => !isLoading && onClose()}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">描述你的愿望</label>
          <textarea
            className="w-full h-32 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
            placeholder="详细描述你心中的画面，魔法AI将为你绘制..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} /> 正在绘制梦境...
            </>
          ) : (
            <>
              <Sparkles size={20} /> 生成并发布
            </>
          )}
        </button>
      </form>
    </ModalBase>
  );
};

// --- Exchange Modal ---
interface ExchangeModalProps {
  isOpen: boolean;
  targetWish: Wish | null;
  onClose: () => void;
  onExchange: (exchangeDescription: string) => void;
  targetUserContact: string | null;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({ isOpen, targetWish, onClose, onExchange, targetUserContact }) => {
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setDescription('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    onExchange(description);
    setIsSuccess(true);
  };

  if (!targetWish) return null;

  return (
    <ModalBase title={isSuccess ? "交换成功！" : "交换愿望"} isOpen={isOpen} onClose={onClose}>
      {isSuccess ? (
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles size={32} />
          </div>
          <h4 className="text-xl font-bold text-white">契约已达成</h4>
          <p className="text-gray-300">
            你已经成功与 <span className="text-pink-400 font-semibold">{targetWish.userName}</span> 交换了秘密。
          </p>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
            <p className="text-sm text-gray-400 mb-1">对方的联络方式：</p>
            <p className="text-lg text-white font-mono select-all bg-black/20 p-2 rounded">
              {targetUserContact || "信息隐藏中..."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg"
          >
            关闭
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-500/20 mb-4">
            <p className="text-xs text-purple-300 mb-1">对方的愿望：</p>
            <p className="text-sm text-gray-200 italic">"{targetWish.description}"</p>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">你的回礼（你的愿望）</label>
            <textarea
              className="w-full h-24 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 transition-colors resize-none"
              placeholder="作为交换，写下你的愿望或故事..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <Send size={18} /> 确认交换
          </button>
        </form>
      )}
    </ModalBase>
  );
};