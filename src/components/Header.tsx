import { Coins } from 'lucide-react';

interface HeaderProps {
    tokens: number;
    onBuyTokens: () => void;
}

export function Header({ tokens, onBuyTokens }: HeaderProps) {
    return (
        <header className="w-full bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={`${import.meta.env.BASE_URL}logo.jpg`}
                        alt="Logo"
                        className="h-10 w-auto object-contain"
                        onError={(e) => {
                            // Fallback if logo fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onBuyTokens}
                        className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-full transition-colors font-medium"
                    >
                        <Coins className="w-5 h-5" />
                        <span>{tokens} Tokens</span>
                        <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full ml-1">+</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
