import {MasonButton} from "@/components/mason-login-button";
import {MasonLoginFields} from "@/components/mason-login-fields";
import {Divider} from "@/components/Divider";

export default function Page() { 
    return (
        <div>
            <h2>Login</h2>
            <MasonButton />
            <Divider />
            <MasonLoginFields/>
        </div>
    ); 
}
