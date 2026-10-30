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
    if (useStorage && auth.user.images) {
      return auth.user.images.startsWith('http')
        ? auth.user.images
        : `/storage/${auth.user.images}`;
    }
    return '/placeholder.png';
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

      <div className="min-h-screen bg-paper py-8 px-4 sm:px-6 lg:px-8 font-body">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">
              Account Settings
            </h1>
            <p className="mt-1 text-sm text-text-soft">
              Manage your personal profile, security credentials, and preferences
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
            <Tab.Group onChange={setActiveTab}>
              <div className="lg:grid lg:grid-cols-12">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-4 border-r border-line bg-paper-dim/40">
                  <div className="p-6 lg:p-8">
                    {/* User Info Card */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative group">
                        <img
                          src={getProfileImageUrl()}
                          alt={auth.user.name}
                          className="w-16 h-16 rounded-full ring-4 ring-marigold/20 border-2 border-line object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-display font-bold text-ink truncate">{auth.user.name}</h2>
                        <p className="text-xs text-text-soft truncate">{auth.user.email}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-marigold/10 text-marigold-dark rounded-full border border-marigold/20">
                          {auth.user.role || 'User'}
                        </span>
                      </div>
                    </div>

                    {/* Tab Navigation */}
                    <Tab.List className="space-y-1.5">
                      {tabs.map((tab, index) => (
                        <Tab key={index} as={Fragment}>
                          {({ selected }) => (
                            <button
                              className={`${
                                selected
                                  ? 'bg-ink text-white shadow-sm'
                                  : 'text-text-soft hover:bg-paper-dim hover:text-ink border border-transparent'
                              } w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 group text-sm font-semibold`}
                            >
                              <span className={`${selected ? 'text-marigold' : 'text-text-soft/70 group-hover:text-ink'}`}>
                                {tab.icon}
                              </span>
                              <span className="flex-1">{tab.name}</span>
                              {selected && (
                                <FaCheckCircle className="h-4 w-4 text-marigold" />
                              )}
                            </button>
                          )}
                        </Tab>
                      ))}
                    </Tab.List>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-line">
                      <div className="flex items-center gap-2 text-xs text-text-soft">
                        <FaCog className="h-3.5 w-3.5 text-text-soft/60" />
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
                <div className="lg:col-span-8 bg-white">
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
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-ink text-white rounded-2xl p-6 border border-line shadow-hard-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-1.5 font-mono">
                    <FaCalendarAlt className="inline text-marigold" /> Member Since
                  </p>
                  <p className="text-2xl font-display font-extrabold mt-1 text-white">{memberSince || 'Active Member'}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-marigold">
                  <FaUserCircle className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-marigold to-marigold-dark text-white rounded-2xl p-6 border border-marigold/40 shadow-hard-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/80 flex items-center gap-1.5 font-mono">
                    <FaShieldAlt className="inline text-white" /> Account Status
                  </p>
                  <p className="text-2xl font-display font-extrabold mt-1 text-white">Active & Verified</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <FaShieldAlt className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Banner */}
          <div className="mt-6 bg-paper-dim border border-line rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-marigold/10 text-marigold-dark shrink-0">
                <FaCog className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-ink">Account Security Recommendations</h3>
                <ul className="mt-2 text-xs text-text-soft list-disc list-inside space-y-1">
                  <li>Use a strong, unique password with letters, numbers, and symbols</li>
                  <li>Ensure your email address and delivery addresses are kept up to date</li>
                  <li>Review your active sessions periodically to protect your account</li>
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
