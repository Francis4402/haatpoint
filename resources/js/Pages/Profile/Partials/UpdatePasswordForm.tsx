import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FaLock, FaCheckCircle, FaExclamationTriangle, FaEyeSlash, FaEye } from 'react-icons/fa';

export default function UpdatePasswordForm() {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }
        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-marigold/10">
          <FaLock className="h-6 w-6 text-marigold-dark" />
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-ink">Update Password</h3>
          <p className="text-text-soft text-sm mt-1">Secure your account with a strong, unique password</p>
        </div>
      </div>

      <form onSubmit={updatePassword} className="space-y-6">
        {/* Current Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword.current ? "text" : "password"}
              ref={currentPasswordInput}
              value={data.current_password}
              onChange={(e) => setData('current_password', e.target.value)}
              className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 pr-12 group-hover:border-ink/30 text-sm font-body"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
              className="absolute right-3 top-2.5 text-text-soft/60 hover:text-ink transition-colors"
            >
              {showPassword.current ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.current_password && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-3.5 w-3.5" />
              {errors.current_password}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-ink mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 pr-12 group-hover:border-ink/30 text-sm font-body"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
              className="absolute right-3 top-2.5 text-text-soft/60 hover:text-ink transition-colors"
            >
              {showPassword.new ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-3.5 w-3.5" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="group">
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="w-full px-4 py-2.5 border border-line rounded-xl bg-paper text-ink focus:ring-2 focus:ring-marigold focus:border-transparent outline-none transition-all duration-200 pr-12 group-hover:border-ink/30 text-sm font-body"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
              className="absolute right-3 top-2.5 text-text-soft/60 hover:text-ink transition-colors"
            >
              {showPassword.confirm ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-3.5 w-3.5" />
              {errors.password_confirmation}
            </p>
          )}
        </div>

        {/* Password Strength Indicator */}
        <div className="bg-paper-dim border border-line rounded-2xl p-5">
          <p className="text-xs font-display font-bold uppercase tracking-wider text-ink mb-2">Password Requirements</p>
          <ul className="text-xs text-text-soft space-y-1.5">
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${data.password.length >= 8 ? 'bg-emerald-600' : 'bg-line'}`}></div>
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(data.password) ? 'bg-emerald-600' : 'bg-line'}`}></div>
              At least one uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(data.password) ? 'bg-emerald-600' : 'bg-line'}`}></div>
              At least one number
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-line">
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-ink hover:bg-ink/90 text-white font-body font-bold uppercase tracking-wider rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-marigold focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <FaCheckCircle className="h-4 w-4 text-marigold" />
                Update Password
              </>
            )}
          </button>

          {recentlySuccessful && (
            <span className="text-emerald-700 font-semibold flex items-center gap-2 text-xs bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <FaCheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              Password updated successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
