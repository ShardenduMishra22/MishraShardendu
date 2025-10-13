import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
}

function createToastStore() {
  const { subscribe, update } = writable<ToastStore>({ toasts: [] });

  return {
    subscribe,
    
    add: (type: ToastType, message: string, duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: Toast = { id, type, message, duration };

      update(state => ({
        toasts: [...state.toasts, toast]
      }));

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          update(state => ({
            toasts: state.toasts.filter(t => t.id !== id)
          }));
        }, duration);
      }

      return id;
    },

    remove: (id: string) => {
      update(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    },

    success: (message: string, duration?: number) => {
      return createToastStore().add('success', message, duration);
    },

    error: (message: string, duration?: number) => {
      return createToastStore().add('error', message, duration);
    },

    warning: (message: string, duration?: number) => {
      return createToastStore().add('warning', message, duration);
    },

    info: (message: string, duration?: number) => {
      return createToastStore().add('info', message, duration);
    },

    clear: () => {
      update(() => ({ toasts: [] }));
    }
  };
}

export const toastStore = createToastStore();

// Convenience functions
export const toast = {
  success: (message: string, duration?: number) => toastStore.add('success', message, duration),
  error: (message: string, duration?: number) => toastStore.add('error', message, duration),
  warning: (message: string, duration?: number) => toastStore.add('warning', message, duration),
  info: (message: string, duration?: number) => toastStore.add('info', message, duration),
};
