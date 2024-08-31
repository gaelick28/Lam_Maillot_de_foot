import { useState } from "react";

export default function Index() {
    const [count, setCount] = useState(0);
    
    function handleClick() {
        setCount(count + 1);
    }

    return (
        <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
            <div className="relative min-h-screen flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <main>
                        <h1 className="text-xl font-semibold text-black dark:text-white">Hello world</h1>
                        <p className="mt-4 text-sm/relaxed">This is an inertia page</p>
                        <button className="rounded-md bg-gray-50 text-black p-2 mt-4 hover:bg-gray-200" onClick={handleClick}>
                            Clicked {count} times
                        </button>
                    </main>
                </div>
            </div>        
        </div>
    );
}
