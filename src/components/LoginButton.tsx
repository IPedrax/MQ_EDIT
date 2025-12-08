import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useStore } from '../lib/store';

export function LoginButton() {
    const { login, logout, isLoggedIn, user } = useStore();

    const handleSuccess = (credentialResponse: any) => {
        const decoded: any = jwtDecode(credentialResponse.credential);
        login({
            name: decoded.name,
            email: decoded.email,
            picture: decoded.picture,
        });
    };

    const handleError = () => {
        console.error('Login Failed');
    };

    if (isLoggedIn && user) {
        return (
            <div className="flex items-center gap-3">
                <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-gray-200"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name}
                </span>
                <button
                    onClick={logout}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                    Sair
                </button>
            </div>
        );
    }

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="pill"
        />
    );
}
