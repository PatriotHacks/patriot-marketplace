//"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "marketplace-listing-draft";
const CHANGE_EVENT = "listing-draft-changed";

function subscribe(onChange: () => void) {
  // Updates from another browser tab.
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      onChange();
    }
  }

  window.addEventListener("storage", handleStorage);

  // Updates made in this tab through saveDraft().
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): null {
  return null;
}

export function saveDraft(draft: Record<string, string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useListingDraft() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}