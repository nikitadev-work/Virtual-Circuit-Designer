import { Button } from "bim/components/ui/button"
import Link from "next/link";
import '../styles/global.css';

export default function MainPage() {
    return (
        <>
            <div className="">
                Visual Circuit Designer
            </div>
            <div className="flex flex-wrap items-center gap-2 md:flex-row">
                <Link href="/login" passHref>
                    <Button>Login</Button>
                </Link>
            </div>
        </>
    )
}
