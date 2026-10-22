//import { FeaturePlaceholder } from "@/components/feature-placeholder";
import ListingForm from "./listingForm";

export default function Page() {
    
    return (
        <section className="feature">
            <p className="eyebrow">Sell on Patriot Marketplace</p>
            <h1>Create a listing</h1>
            <p>Describe your item and save a draft.</p>
            <ListingForm />
        </section>
    );
}
