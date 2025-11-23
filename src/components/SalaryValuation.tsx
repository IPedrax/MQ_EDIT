import { TrendingUp, LogIn } from 'lucide-react';
import { useStore } from '../lib/store';

interface SalaryValuationProps {
    valuation: number;
}

export function SalaryValuation({ valuation }: SalaryValuationProps) {
    const { isLoggedIn, login } = useStore();

    const handleLogin = () => {
        // Simulate Google Login
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
            'about:blank',
            'google_login',
            `width=${width},height=${height},top=${top},left=${left}`
        );

        if (popup) {
            popup.document.write(`
                <html>
                    <head><title>Google Login (Simulado)</title></head>
                    <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
                        <h2>Google Login</h2>
                        <p>Simulando autenticação...</p>
                        <script>
                            setTimeout(() => {
                                window.close();
                            }, 1500);
                        </script>
                    </body>
                </html>
            `);

            const timer = setInterval(() => {
                if (popup.closed) {
                    clearInterval(timer);
                    login(); // Set logged in state
                }
            }, 500);
        } else {
            // Fallback if popup blocked
            login();
        }
    };

    return (
        <div className="bg-gradient-to-br from-primary to-primary/90 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 opacity-90">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">Valoração de Mercado</span>
            </div>

            <div className="relative">
                <div className={`flex items-baseline gap-1 transition-all duration-500 ${!isLoggedIn ? 'blur-md select-none opacity-50' : ''}`}>
                    <span className="text-2xl font-light opacity-80">R$</span>
                    <span className="text-4xl font-bold tracking-tight">
                        {valuation.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>

                {!isLoggedIn && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <button
                            onClick={handleLogin}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors shadow-lg font-bold text-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            Entrar com Google para Ver
                        </button>
                    </div>
                )}
            </div>

            <p className="text-sm mt-4 opacity-80">
                Baseado na sua experiência e qualificações identificadas no currículo.
            </p>
        </div>
    );
}
