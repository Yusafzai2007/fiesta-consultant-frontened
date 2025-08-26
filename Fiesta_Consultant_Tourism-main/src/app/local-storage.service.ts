import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Stores a value in localStorage
   * @param key The key to store the value under
   * @param value The value to store (will be stringified)
   */
  setItem(key: string, value: any): void {
    try {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  /**
   * Retrieves a value from localStorage
   * @param key The key to retrieve
   * @returns The stored value or null if not found
   */
  getItem(key: string): any {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return null;
      }

      // Try to parse as JSON, if fails return raw value
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error('Error getting from localStorage', error);
      return null;
    }
  }

  /**
   * Removes an item from localStorage
   * @param key The key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  }

  /**
   * Clears all items from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }

  /**
   * Checks if a key exists in localStorage
   * @param key The key to check
   * @returns True if the key exists
   */
  hasItem(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking localStorage', error);
      return false;
    }
  }

  /**
   * Gets all keys from localStorage
   * @returns Array of keys
   */
  getKeys(): string[] {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      return [];
    }
  }

  /**
   * @returns The number of items stored
   */
  getLength(): number {
    try {
      return localStorage.length;
    } catch (error) {
      return 0;
    }
  }
}