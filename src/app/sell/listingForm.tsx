"use client";

import { useState, type SubmitEvent } from "react";
import {
  saveDraft,
  useListingDraft,
  confirmDraft,
  clearDraft,
} from "./useListingDraft";

export default function ListingForm() {
    const [message, setMessage] = useState("");
    const savedDraft = useListingDraft();

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const draft = {
            title: String(formData.get("title") ?? ""),
            description: String(formData.get("description") ?? ""),
            category_id: String(formData.get("category_id") ?? ""),
            condition: String(formData.get("condition") ?? ""),
            price: String(formData.get("price") ?? ""),
            status: "draft",
        };

        try {
            saveDraft(draft);
            setMessage("Draft saved in this browser.");
        } catch {
            setMessage("Could not save the draft. Browser storage may be unavailable or full.");
        }
    }

    function handleConfirm() {
        try {
            confirmDraft();
            setMessage("Listing confirmed! Open the listings page to see it.");
        }
        catch (error) {
            setMessage(
                error instanceof Error
                ? error.message
                : "Could not confirm the listing."
            );
        }
    }

    function handleClearDraft() {
        try {
            clearDraft();
            setMessage("Saved draft cleared.");
        } 
        catch {
            setMessage("Could not clear the saved draft.");
        }
    }

    return (
        <form className="card listing-form" onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Example: Biology textbook"
                    minLength={3}
                    maxLength={120}
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    maxLength={5000}
                    placeholder="Describe the item and any wear or damage."
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category_id" defaultValue="" required>
                    <option value="" disabled>Choose a category</option>
                    <option value="textbooks">Textbooks</option>
                    <option value="electronics">Electronics</option>
                    <option value="furniture">Furniture</option>
                    <option value="clothing">Clothing</option>
                    <option value="school-supplies">School supplies</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="condition">Condition</label>
                <select id="condition" name="condition" defaultValue="" required>
                    <option value="" disabled>Choose a condition</option>
                    <option value="new">New</option>
                    <option value="like_new">Like new</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="price">Price (USD)</label>
                <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="10.00"
                    required
                />
            </div>

            <div className="form-field">
                <label htmlFor="photos">Photos</label>
                <input
                    id="photos"
                    name="photos"
                    type="file"
                    accept="image/*"
                    multiple
                />
            </div>

            <button className="button" type="submit">Save draft</button>

            <p className="form-message" role="status">{message}</p>

            {savedDraft !== null && (
            <section className="draft-preview">
                <h2>Saved draft</h2>
                <pre>{savedDraft}</pre>

                <p>Confirm listing publishes the saved version shown above.</p>

                <div className="form-actions">
                <button
                    className="button"
                    type="button"
                    onClick={handleConfirm}>
                    Confirm listing
                </button>

                <button
                    className="button button-secondary"
                    type="button"
                    onClick={handleClearDraft}
                >
                    Clear saved draft
                </button>
                </div>
            </section>
            )}
        </form>
    );
}