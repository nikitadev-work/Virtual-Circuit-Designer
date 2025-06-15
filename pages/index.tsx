import Link from 'next/link';

export default function MainPage() {
    return (
        <>
            <p className="w-[913px] h-[97px] absolute left-[504px] top-[362px] text-[80px] font-extrabold text-center text-[#262626]">
                <span className="bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5] bg-clip-text text-transparent inline-block">Visual Circuit</span> Designer
            </p>
            <p className="w-[769px] h-[72px] absolute left-[576px] top-[468px] text-3xl font-semibold text-center text-[#808080]">
                Streamlined platform for designing and compiling digital circuits directly in the browser
            </p>

            <Link href="/login" className="inline-block">
                <button
                    className="bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5] text-white text-[26px] w-[242px] h-[57px]
                    font-bold rounded-2xl shadow-md absolute left-[839px] top-[605px]
                    cursor-pointer hover:from-blue-400 hover:to-blue-400
                    transition-colors duration-500 ease-in-out">
                    Let’s design!
                </button>
            </Link>

        </>
    );
}
