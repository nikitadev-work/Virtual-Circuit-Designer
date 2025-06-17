import Link from 'next/link';

export default function MainPage() {
    return (
        <>
            <p className="w-[913px] h-[97px] absolute left-[504px] top-[362px] text-[80px] font-bold text-center text-[#262626]">
                <span className="bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5] bg-clip-text text-transparent inline-block">Visual Circuit</span> Designer
            </p>
            <p className="w-[700px] h-[72px] absolute left-[610px] top-[468px] text-2xl font-medium text-center text-[#808080]">
                Streamlined platform for designing and compiling digital circuits directly in the browser
            </p>

            <Link href="/login">
                <div
                    className="bg-gradient-to-r from-[#63CBFF] to-[#1C3BD5] text-white text-[26px] w-[242px] h-[57px]
                    font-bold rounded-xl shadow-md absolute left-[839px] top-[565px]
                    cursor-pointer hover:from-[#67B9FF] hover:to-[#67B9FF]
                    transition-colors duration-500 ease-in-out flex items-center justify-center"
                >
                    <span>Let’s design!</span>
                </div>
            </Link>

        </>
    );
}
