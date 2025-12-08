import { Coins, CreditCard } from 'lucide-react';
import { useStore } from '../lib/store';
import { LoginButton } from './LoginButton';

interface HeaderProps {
    onBuyTokens: () => void;
}

export function Header({ onBuyTokens }: HeaderProps) {
    const tokens = useStore((state) => state.tokens);

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
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                        <Coins className="w-4 h-4 text-primary" />
                        <span className="font-bold text-primary">{tokens} Tokens</span>
                    </div>

                    <button
                        onClick={onBuyTokens}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Recarregar via Netcred</span>
                    </button>

                    <LoginButton />
                </div>
            </div>
        </header>
    );
}
