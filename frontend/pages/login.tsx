import Image from 'next/image';

import { LoginForm } from "../src/components/login-form"

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <img src="/Icons/Logos/Logo.svg" width={20} height={20} alt="Logo"/>
                    Visual Circuit Designer
                </a>
                <LoginForm />
            </div>
        </div>
    )
}
