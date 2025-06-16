import { database } from '../config/firebase';
import { ref, push, get, set, remove, query, orderByKey, update } from 'firebase/database';
import { Giveaway, GiveawayEntry, Winner } from '../types';

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