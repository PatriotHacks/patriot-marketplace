import { useSyncExternalStore } from "react";

const DRAFT_KEY = "marketplace-listing-draft";
const LISTINGS_KEY = "marketplace-listings";
const CHANGE_EVENT = "marketplace-storage-changed";

export type ListingDraft = {
  title: string;
  description: string;
  category_id: string;
  condition: string;
  price: string;
  status: string;
};

export type LocalListing = ListingDraft & {
  id: string;
};

function subscribe(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (
      event.key === null ||
      event.key === DRAFT_KEY ||
      event.key === LISTINGS_KEY
    ) {
      onChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function notifyChange() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getDraftSnapshot() {
  return readStorage(DRAFT_KEY);
}

function getListingsSnapshot() {
  return readStorage(LISTINGS_KEY);
}

function getServerSnapshot(): null {
  return null;
}

export function useListingDraft() {
  return useSyncExternalStore(
    subscribe,
    getDraftSnapshot,
    getServerSnapshot
  );
}

export function useLocalListings() {
  return useSyncExternalStore(
    subscribe,
    getListingsSnapshot,
    getServerSnapshot
  );
}

// Reads JSON and checks its structure before using it.
export function parseDraft(raw: string | null): ListingDraft | null {
  if (raw === null) return null;

  try {
    const value = JSON.parse(raw);

    if (
      value !== null &&
      typeof value === "object" &&
      typeof value.title === "string" &&
      typeof value.description === "string" &&
      typeof value.category_id === "string" &&
      typeof value.condition === "string" &&
      typeof value.price === "string" &&
      typeof value.status === "string"
    ) {
      return value;
    }
  } catch {
    // Invalid JSON is treated as a missing draft.
  }

  return null;
}

export function parseListings(raw: string | null): LocalListing[] {
  if (raw === null) return [];

  const values: unknown = JSON.parse(raw);

  if (!Array.isArray(values)) {
    throw new Error("Saved listings are invalid.");
  }

  return values.map((value) => {
    const draft = parseDraft(JSON.stringify(value));

    if (!draft || typeof value.id !== "string") {
      throw new Error("A saved listing is invalid.");
    }

    return { ...draft, id: value.id };
  });
}

export function saveDraft(draft: ListingDraft) {
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  notifyChange();
}

export function clearDraft() {
  window.localStorage.removeItem(DRAFT_KEY);
  notifyChange();
}

export function confirmDraft() {
  const draft = parseDraft(window.localStorage.getItem(DRAFT_KEY));

  if (!draft) {
    throw new Error("Save a draft before confirming.");
  }

  const listings = parseListings(
    window.localStorage.getItem(LISTINGS_KEY)
  );

  const listing: LocalListing = {
    ...draft,
    id: crypto.randomUUID(),
    status: "available",
  };

  window.localStorage.setItem(
    LISTINGS_KEY,
    JSON.stringify([...listings, listing])
  );

  // If clearing fails, roll back the new listing to avoid duplicates.
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    window.localStorage.setItem(
      LISTINGS_KEY,
      JSON.stringify(listings)
    );
    throw error;
  } finally {
    notifyChange();
  }
}

export function removeListing(id: string) {
  const listings = parseListings(
    window.localStorage.getItem(LISTINGS_KEY)
  );

  window.localStorage.setItem(
    LISTINGS_KEY,
    JSON.stringify(listings.filter((listing) => listing.id !== id))
  );

  notifyChange();
}