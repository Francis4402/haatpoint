import { Head } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import { Tab } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import {
  FaUserCircle,
  FaKey,
  FaCog,
  FaCheckCircle,
  FaCalendarAlt,
  FaShieldAlt,
  FaTrash,
} from 'react-icons/fa';
import UpdateProfileInformation from './Partials/UpdateProfileInformationForm';
import DeleteUserForm from './Partials/DeleteUserForm';

interface PageProps {
  auth: {
    user: any
  };
  status?: string;
}

export default function Edit({ auth, status }: PageProps) {
  const [memberSince, setMemberSince] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  const [useStorage, setUseStorage] = useState(true);

  useEffect(() => {
    if (auth.user.created_at) {
      const date = new Date(auth.user.created_at);
      setMemberSince(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    }
  }, [auth.user.created_at]);

  const getProfileImageUrl = () => {
    if (useStorage && auth.user.images) return `/storage/${auth.user.images}`;
    return `https://github.com/shadcn.png`;
  };

  const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'superadmin';

  const tabs = [
    {
      name: 'Profile',
      icon: <FaUserCircle className="h-5 w-5" />,
      content: (
        <UpdateProfileInformation
          status={status}
          user={auth.user}
        />
      )
    },
    {
      name: 'Password',
      icon: <FaKey className="h-5 w-5" />,
      content: <UpdatePasswordForm />
    },
    // Only admins / superadmins can delete their account
    ...(isAdmin ? [{
      name: 'Delete Account',
      icon: <FaTrash className="h-5 w-5" />,
      content: <DeleteUserForm />
    }] : []),
  ];

  return (
    <DashboardLayout user={auth.user}>
      <Head title="Profile Settings" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="mt-2 text-gray-600">Manage your profile, security, and account preferences</p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <Tab.Group onChange={setActiveTab}>
              <div className="lg:grid lg:grid-cols-12">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-4 border-r border-gray-200 bg-gray-50/50">
                  <div className="p-6 lg:p-8">
                    {/* User Info Card */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative group">
                        <img
                          src={getProfileImageUrl()}
                          alt={auth.user.name}
                          className="w-16 h-16 rounded-full ring-4 ring-blue-100 object-cover"
                          onError={() => setUseStorage(false)}
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="animate-ping absolute inset-0 bg-green-400 rounded-full opacity-75"></span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-gray-900 truncate">{auth.user.name}</h2>
                        <p className="text-sm text-gray-500 truncate">{auth.user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {auth.user.role || 'User'}
                        </span>
                      </div>
                    </div>

                    {/* Tab Navigation */}
                    <Tab.List className="space-y-1">
                      {tabs.map((tab, index) => (
                        <Tab key={index} as={Fragment}>
                          {({ selected }) => (
                            <button
                              className={`${
                                selected
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
                                  : 'text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm border border-transparent'
                              } w-full flex items-center gap-3 px-4 py-3.5 text-left rounded-xl transition-all duration-200 group`}
                            >
                              <span className={`${selected ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`}>
                                {tab.icon}
                              </span>
                              <span className="font-medium flex-1">{tab.name}</span>
                              {selected && (
                                <FaCheckCircle className="h-4 w-4 text-white animate-pulse" />
                              )}
                            </button>
                          )}
                        </Tab>
                      ))}
                    </Tab.List>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCog className="h-4 w-4" />
                        <span>Last updated: {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-8">
                  <Tab.Panels className="h-full">
                    {tabs.map((tab, index) => (
                      <Tab.Panel key={index} className="h-full p-6 lg:p-8">
                        <div className="animate-fadeIn">
                          {tab.content}
                        </div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </div>
              </div>
            </Tab.Group>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <FaCalendarAlt className="inline" /> Member Since
                  </p>
                  <p className="text-2xl font-bold mt-1">{memberSince || 'Jan 2024'}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <FaUserCircle className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 flex items-center gap-1">
                    <FaShieldAlt className="inline" /> Account Status
                  </p>
                  <p className="text-2xl font-bold mt-1">Active</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <FaShieldAlt className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Banner */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <FaCog className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Account Security Tips</h3>
                <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                  <li>Use a strong password with mix of letters, numbers, and symbols</li>
                  <li>Enable two-factor authentication for extra security</li>
                  <li>Keep your profile information up to date</li>
                  <li>Regularly review your account activity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
}
