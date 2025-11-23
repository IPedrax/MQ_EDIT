import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface CarouselProps<T> {
    title: string;
    icon?: ReactNode;
    items: T[];
    renderItem: (item: T) => ReactNode;
}

export function Carousel<T>({ title, icon, items, renderItem }: CarouselProps<T>) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    if (!items.length) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prev}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                        disabled={items.length <= 1}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                        disabled={items.length <= 1}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="p-6 relative min-h-[200px] flex items-center justify-center">
                <div className="w-full transition-all duration-300 ease-in-out">
                    {renderItem(items[currentIndex])}
                </div>
            </div>

            <div className="p-2 flex justify-center gap-1.5 bg-gray-50 border-t border-gray-100">
                {items.map((_, idx) => (
                    <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-300'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
