import { PropsWithChildren, ReactNode } from 'react';

import { User } from '@/types';
import Navbar from '@/Pages/Components/Navbar';


export default function AppLayout({ user, children, wishlist }: PropsWithChildren<{ user?: User, header?: ReactNode, wishlist?: any }>) {

  return (
    <div>
      <Navbar user={user} wishlist={wishlist} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
