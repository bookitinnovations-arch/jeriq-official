import React, { createContext, useContext, useState, useEffect } from 'react';

type Mood = 'morning' | 'afternoon' | 'night' | '3am';
type UserRank = 'Guest' | 'East Soldier' | 'Street General' | 'Cartel OG';

interface AppContextType {
  mood: Mood;
  isLoyal: boolean;
  setLoyal: (loyal: boolean) => void;
  userRank: UserRank;
  setUserRank: (rank: UserRank) => void;
  hasSeenLoader: boolean;
  setHasSeenLoader: (seen: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  isAudioEnabled: boolean;
  setIsAudioEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMood] = useState<Mood>('afternoon');
  const [isLoyal, setIsLoyal] = useState(() => localStorage.getItem('cartel_loyalty') === 'true');
  const [userRank, setUserRank] = useState<UserRank>(() => (localStorage.getItem('cartel_rank') as UserRank) || 'Guest');
  const [hasSeenLoader, setHasSeenLoader] = useState(false);
  const [userName, setUserName] = useState(() => localStorage.getItem('cartel_user_name') || '');
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  // Mood Engine Logic
  useEffect(() => {
    const updateMood = () => {
      const hour = new Date().getHours();
      let currentMood: Mood = 'afternoon';
      
      if (hour >= 6 && hour < 12) currentMood = 'morning';
      else if (hour >= 12 && hour < 18) currentMood = 'afternoon';
      else if (hour >= 18 && hour < 24) currentMood = 'night';
      else currentMood = '3am';

      setMood(currentMood);
      document.body.setAttribute('data-mood', currentMood);
    };

    updateMood();
    const interval = setInterval(updateMood, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Persist values
  useEffect(() => {
    localStorage.setItem('cartel_loyalty', isLoyal.toString());
    localStorage.setItem('cartel_rank', userRank);
    localStorage.setItem('cartel_user_name', userName);
  }, [isLoyal, userRank, userName]);

  return (
    <AppContext.Provider value={{ 
      mood, 
      isLoyal, 
      setLoyal: setIsLoyal, 
      userRank, 
      setUserRank,
      hasSeenLoader,
      setHasSeenLoader,
      userName,
      setUserName,
      isAudioEnabled,
      setIsAudioEnabled
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
