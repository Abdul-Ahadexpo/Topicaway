import { database } from '../config/firebase';
import { ref, push, get, set, remove, query, orderByKey, update, orderByChild, equalTo } from 'firebase/database';
import { Giveaway, GiveawayEntry, Winner, IPRestriction } from '../types';

// Helper function to get user's IP address
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    // Fallback to a random identifier if IP service fails
    return `fallback-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Check if user can enter a giveaway based on IP restrictions
export const canUserEnterGiveaway = async (giveawayId: string, ipAddress: string): Promise<{ canEnter: boolean; reason?: string }> => {
  try {
    // Check if user has already entered this specific giveaway
    const giveawayEntriesRef = ref(database, `entries/${giveawayId}`);
    const giveawayEntriesSnapshot = await get(giveawayEntriesRef);
    
    if (giveawayEntriesSnapshot.exists()) {
      const entries = giveawayEntriesSnapshot.val();
      const hasEnteredThisGiveaway = Object.values(entries).some((entry: any) => entry.ipAddress === ipAddress);
      
      if (hasEnteredThisGiveaway) {
        return { canEnter: false, reason: 'You have already entered this giveaway.' };
      }
    }

    // Check IP restrictions for 4-day cooldown
    const ipRestrictionsRef = ref(database, 'ipRestrictions');
    const ipQuery = query(ipRestrictionsRef, orderByChild('ipAddress'), equalTo(ipAddress));
    const ipSnapshot = await get(ipQuery);
    
    if (ipSnapshot.exists()) {
      const restrictions = ipSnapshot.val();
      const now = new Date();
      
      for (const restrictionId in restrictions) {
        const restriction = restrictions[restrictionId];
        
        // Check if IP is blocked by admin
        if (restriction.isBlocked) {
          return { canEnter: false, reason: 'Your access has been restricted by an administrator.' };
        }
        
        // Check 4-day cooldown
        const lastEntryDate = new Date(restriction.lastEntryDate);
        const daysSinceLastEntry = (now.getTime() - lastEntryDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastEntry < 4) {
          const remainingDays = Math.ceil(4 - daysSinceLastEntry);
          return { canEnter: false, reason: `You can enter another giveaway in ${remainingDays} day(s).` };
        }
      }
    }
    
    return { canEnter: true };
  } catch (error) {
    console.error('Error checking user eligibility:', error);
    return { canEnter: true }; // Allow entry if check fails
  }
};

// Update IP restriction after successful entry
export const updateIPRestriction = async (ipAddress: string, giveawayId: string) => {
  try {
    const ipRestrictionsRef = ref(database, 'ipRestrictions');
    const newRestrictionRef = push(ipRestrictionsRef);
    
    await set(newRestrictionRef, {
      ipAddress,
      giveawayId,
      lastEntryDate: new Date().toISOString(),
      isBlocked: false
    });
  } catch (error) {
    console.error('Error updating IP restriction:', error);
  }
};

// Admin function to get all IP restrictions
export const getIPRestrictions = async (): Promise<IPRestriction[]> => {
  try {
    const ipRestrictionsRef = ref(database, 'ipRestrictions');
    const snapshot = await get(ipRestrictionsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching IP restrictions:', error);
    return [];
  }
};

// Admin function to unblock/remove IP restriction
export const removeIPRestriction = async (restrictionId: string) => {
  try {
    const restrictionRef = ref(database, `ipRestrictions/${restrictionId}`);
    await remove(restrictionRef);
  } catch (error) {
    console.error('Error removing IP restriction:', error);
    throw error;
  }
};

// Admin function to block an IP address
export const blockIPAddress = async (ipAddress: string) => {
  try {
    const ipRestrictionsRef = ref(database, 'ipRestrictions');
    const newRestrictionRef = push(ipRestrictionsRef);
    
    await set(newRestrictionRef, {
      ipAddress,
      giveawayId: 'admin-block',
      lastEntryDate: new Date().toISOString(),
      isBlocked: true
    });
  } catch (error) {
    console.error('Error blocking IP address:', error);
    throw error;
  }
};

// Giveaway operations
export const createGiveaway = async (giveaway: Omit<Giveaway, 'id'>) => {
  const giveawaysRef = ref(database, 'giveaways');
  const newGiveawayRef = push(giveawaysRef);
  await set(newGiveawayRef, giveaway);
  return newGiveawayRef.key;
};

export const getGiveaways = async (): Promise<Giveaway[]> => {
  const giveawaysRef = ref(database, 'giveaways');
  const snapshot = await get(giveawaysRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  return [];
};

export const getGiveaway = async (id: string): Promise<Giveaway | null> => {
  const giveawayRef = ref(database, `giveaways/${id}`);
  const snapshot = await get(giveawayRef);
  
  if (snapshot.exists()) {
    return {
      id,
      ...snapshot.val()
    };
  }
  return null;
};

export const updateGiveaway = async (id: string, updates: Partial<Omit<Giveaway, 'id'>>) => {
  const giveawayRef = ref(database, `giveaways/${id}`);
  await update(giveawayRef, updates);
};

export const deleteGiveaway = async (id: string) => {
  // Delete the giveaway
  const giveawayRef = ref(database, `giveaways/${id}`);
  await remove(giveawayRef);
  
  // Also delete all entries for this giveaway
  const entriesRef = ref(database, `entries/${id}`);
  await remove(entriesRef);
};

// Giveaway entry operations
export const createGiveawayEntry = async (entry: Omit<GiveawayEntry, 'id'>) => {
  const entriesRef = ref(database, `entries/${entry.giveawayId}`);
  const newEntryRef = push(entriesRef);
  await set(newEntryRef, entry);
  
  // Update IP restriction
  await updateIPRestriction(entry.ipAddress, entry.giveawayId);
  
  return newEntryRef.key;
};

export const getGiveawayEntries = async (giveawayId: string): Promise<GiveawayEntry[]> => {
  const entriesRef = ref(database, `entries/${giveawayId}`);
  const snapshot = await get(entriesRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    }));
  }
  return [];
};

export const getAllEntries = async (): Promise<{ [giveawayId: string]: GiveawayEntry[] }> => {
  const entriesRef = ref(database, 'entries');
  const snapshot = await get(entriesRef);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    const result: { [giveawayId: string]: GiveawayEntry[] } = {};
    
    Object.keys(data).forEach(giveawayId => {
      result[giveawayId] = Object.keys(data[giveawayId]).map(entryId => ({
        id: entryId,
        ...data[giveawayId][entryId]
      }));
    });
    
    return result;
  }
  return {};
};

export const deleteGiveawayEntry = async (giveawayId: string, entryId: string) => {
  const entryRef = ref(database, `entries/${giveawayId}/${entryId}`);
  await remove(entryRef);
};

// Winner operations
export const createWinner = async (winner: Omit<Winner, 'id'>) => {
  const winnersRef = ref(database, 'winners');
  const newWinnerRef = push(winnersRef);
  await set(newWinnerRef, winner);
  return newWinnerRef.key;
};

export const getWinners = async (): Promise<Winner[]> => {
  const winnersRef = ref(database, 'winners');
  const winnersQuery = query(winnersRef, orderByKey());
  const snapshot = await get(winnersQuery);
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({
      id: key,
      ...data[key]
    })).reverse(); // Show newest first
  }
  return [];
};

export const updateWinner = async (id: string, updates: Partial<Omit<Winner, 'id'>>) => {
  const winnerRef = ref(database, `winners/${id}`);
  await update(winnerRef, updates);
};

export const deleteWinner = async (id: string) => {
  const winnerRef = ref(database, `winners/${id}`);
  await remove(winnerRef);
};