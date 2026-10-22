"use client";

import { useState } from "react";
import {
  useLocalListings,
  parseListings,
  removeListing,
  type LocalListing,
} from "../sell/useListingDraft";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const categoryNames: Record<string, string> = {
  textbooks: "Textbooks",
  electronics: "Electronics",
  furniture: "Furniture",
  clothing: "Clothing",
  "school-supplies": "School supplies",
  other: "Other",
};

const conditionNames: Record<string, string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
};

export default function Page() {
  const savedListings = useLocalListings();
  const [message, setMessage] = useState("");

  let listings: LocalListing[] = [];
  let storageError = "";

  try {
    listings = parseListings(savedListings);
  } catch {
    storageError = "The saved listings could not be read.";
  }

  function handleRemove(id: string) {
    try {
      removeListing(id);
      setMessage("Listing removed.");
    } catch {
      setMessage("Could not remove the listing.");
    }
  }

  return (
    <section className="listings-page">
      <div className="section-heading">
        <p className="eyebrow">Browse the marketplace</p>
        <h1>Find your next good thing.</h1>
        <p>Prototype listings saved in this browser.</p>
      </div>

      <p role="status">{message}</p>

      {storageError ? (
        <p role="alert">{storageError}</p>
      ) : listings.length === 0 ? (
        <p>No listings yet. Save and confirm a draft on the Sell page.</p>
      ) : (
        <div className="grid">
          {listings.map((listing) => (
            <article className="card listing-card" key={listing.id}>
              <div className="listing-image-placeholder">
                Photo coming soon
              </div>

              <p className="owner">
                {categoryNames[listing.category_id] ?? listing.category_id}
              </p>

              <h2 className="listing-title">{listing.title}</h2>

              <p className="listing-price">
                {currencyFormatter.format(Number(listing.price))}
              </p>

              <p className="listing-condition">
                Condition:{" "}
                {conditionNames[listing.condition] ?? listing.condition}
              </p>

              <p>{listing.description}</p>

              <button
                className="button button-secondary"
                type="button"
                aria-label={`Remove ${listing.title}`}
                onClick={() => handleRemove(listing.id)}
              >
                Remove listing
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}