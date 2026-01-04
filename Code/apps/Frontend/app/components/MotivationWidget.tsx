import {
    Quote
} from 'lucide-react';

export const MotivationWidget = () => (
    <div className="h-full flex flex-col justify-center relative">
        <Quote className="absolute top-0 left-0 text-white/5 w-12 h-12" />
        <p className="text-lg font-medium text-gray-200 italic leading-relaxed relative z-10 pl-4">
            "Talk is cheap. Show me the code."
        </p>
        <div className="mt-4 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-[10px] font-bold text-black">LT</div>
            <span className="text-xs text-gray-500 font-mono">- Linus Torvalds</span>
        </div>
    </div>
);