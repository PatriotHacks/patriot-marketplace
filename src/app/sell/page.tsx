import { FeaturePlaceholder } from "@/components/feature-placeholder";
import ListingForm from "./listingForm";

export default function Page() {
    
    
    return (
        <main>
            <FeaturePlaceholder 
            title="Give it a second chapter." 
            owner="Richard" 
            description="Build the listing form here: photos, title, description, category, condition, and price."/>
            <div>
                <ListingForm />
            </div>
        </main>
    );
    
}
