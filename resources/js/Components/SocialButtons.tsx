import { FaGoogle } from 'react-icons/fa';

type Destination = 'user' | 'superadmin' | 'admin' | 'agent';

const PROVIDERS = [
  { id: 'google', label: 'Google', icon: FaGoogle, iconColor: 'text-red-500' },
] as const;

export default function SocialButtons({ destination = 'user' }: { destination?: Destination }) {
  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-ink/40 font-body">or continue with</span>
        </div>
      </div>

      <div className="space-y-3">
        {PROVIDERS.map(({ id, label, icon: Icon, iconColor }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              window.location.href = route('auth.redirect', { provider: id, destination });
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-ink/20 rounded-lg shadow-sm text-sm font-body font-semibold text-ink bg-white hover:bg-paper transition-colors"
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
            Continue with {label}
          </button>
        ))}
      </div>
    </>
  );
}