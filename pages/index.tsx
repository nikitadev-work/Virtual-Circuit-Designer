import { Button } from "bim/components/ui/button"
import Link from "next/link";
import Head from "next/head";

export default function MainPage() {
    return (
        <>
            <Head>
                <meta charSet="UTF-8" />
                <title>VCD | Playground</title>
                {/* connection CSS file */}
                <link rel="stylesheet" href="/styles/main.css" />
            </Head>

            <body className="bg-black min-h-screen">
                <div className="text-black font-black text-6xl flex items-center justify-center h-20 mt-100">
                    Visual Circuit Designer
                </div>
                <div className="flex items-center justify-center">
                    <Link href="/login" passHref>
                        <Button className="bg-blue-700 text-white text-2xl mt-5 hover:bg-blue-100 cursor-pointer">Login</Button>
                    </Link>
                </div>
            </body>
        </>
    );
}
