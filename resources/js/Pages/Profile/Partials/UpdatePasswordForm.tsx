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
        <div className="p-3 rounded-lg bg-green-100">
          <FaLock className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Update Password</h3>
          <p className="text-gray-600 mt-1">Secure your account with a new password</p>
        </div>
      </div>

      <form onSubmit={updatePassword} className="space-y-6">
        {/* Current Password */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showPassword.current ? "text" : "password"}
              ref={currentPasswordInput}
              value={data.current_password}
              onChange={(e) => setData('current_password', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 pr-12 group-hover:border-gray-400"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword.current ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.current_password && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-4 w-4" />
              {errors.current_password}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 pr-12 group-hover:border-gray-400"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword.new ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-4 w-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 pr-12 group-hover:border-gray-400"
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword.confirm ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <FaExclamationTriangle className="h-4 w-4" />
              {errors.password_confirmation}
            </p>
          )}
        </div>

        {/* Password Strength Indicator */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${data.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              At least 8 characters
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(data.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              At least one uppercase letter
            </li>
            <li className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(data.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              At least one number
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <FaCheckCircle className="h-5 w-5" />
                Update Password
              </>
            )}
          </button>

          {recentlySuccessful && (
            <span className="text-green-600 font-medium flex items-center gap-2">
              <FaCheckCircle className="h-5 w-5" />
              Password updated successfully
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
