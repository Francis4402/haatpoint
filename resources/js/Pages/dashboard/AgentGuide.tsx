import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, Link } from '@inertiajs/react'
import {
    FiCheckCircle,
    FiChevronRight,
    FiClock,
    FiInfo,
    FiShoppingBag,
} from 'react-icons/fi'
import { FaBoxOpen, FaStore } from 'react-icons/fa'

interface agentGuideProps {
    auth: {
        user: any;
    };
    hasStore: boolean;
    stores: {
        id: string;
        name: string;
        slug?: string;
    }[];
    productsCount: number;
}

const StoreGuideCard = ({ step, title, done, optional, children }: {
    step: number;
    title: string;
    done: boolean;
    optional: boolean;
    children: React.ReactNode;
}) => (
    <div className={`relative bg-white rounded-2xl border p-6 md:p-8 shadow-hard-sm transition-all duration-300 ${done ? 'border-marigold' : 'border-line'}`}>
        {done && (
            <div className="absolute -top-3 -right-3 bg-marigold text-white rounded-full p-2 shadow-hard-sm">
                <FiCheckCircle className="h-5 w-5" />
            </div>
        )}
        <div className="flex items-start gap-4">
            <div className={`flex items-center justify-center h-12 w-12 rounded-2xl shrink-0 font-display font-extrabold text-lg ${done ? 'bg-marigold text-white' : 'bg-marigold/10 text-marigold'}`}>
                {step}
            </div>
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-display font-bold text-ink">{title}</h2>
                    {done ? (
                        <span className="text-xs font-mono uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                    ) : (
                        <span className={`text-xs font-mono uppercase tracking-wide px-2 py-0.5 rounded-full ${optional ? 'text-text-soft bg-neutral-100' : 'text-rose-600 bg-rose-50'}`}>
                            {optional ? 'Optional — you can skip' : 'Required — cannot skip'}
                        </span>
                    )}
                </div>
                <p className="text-sm text-text-soft mt-2">{children}</p>
            </div>
        </div>
    </div>
)

const AgentGuide = ({ auth, hasStore, stores, productsCount }: agentGuideProps) => {
    const storeDone = hasStore;
    const productDone = productsCount > 0;

    return (
        <DashboardLayout user={auth.user}>
            <Head title='Agent Guide'>
                <meta name="description" content="Step-by-step guide for agents on creating a store and uploading products on HaatPoint." />
                <meta name="keywords" content="agent, guide, store, product, tutorial" />
            </Head>

            <div className="space-y-6">
                {/* Welcome banner */}
                <div className="bg-gradient-to-r from-marigold to-marigold-dark rounded-2xl shadow-hard-sm p-6 md:p-8 text-white border border-line/20">
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-display font-extrabold uppercase tracking-[-0.01em]">
                                Welcome to HaatPoint, {auth.user.name}!
                            </h1>
                            <p className="opacity-90 text-sm md:text-base max-w-2xl">
                                You're almost ready to start selling. Follow the two steps below to set up
                                your store and publish your first product.
                            </p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                            <FaStore className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                            <span className="text-xs font-mono uppercase tracking-wide">Getting started</span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 bg-white/20 rounded-full h-2.5 overflow-hidden border border-white/20">
                        <div
                            className="bg-white h-full transition-all duration-500"
                            style={{ width: `${(storeDone ? 50 : 0) + (productDone ? 50 : 0)}%` }}
                        />
                    </div>
                    <div className="mt-2 flex justify-between text-xs font-mono uppercase tracking-wide opacity-90">
                        <span>Step 1: Create your store</span>
                        <span>Step 2: Upload your first product</span>
                    </div>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StoreGuideCard step={1} title="Create Your Store" done={storeDone} optional={!storeDone && false}>
                        Every agent needs at least one store before they can start selling.
                        You will not be able to open your dashboard until your first store is created.
                    </StoreGuideCard>

                    {!storeDone ? (
                        <div className="bg-white rounded-2xl border border-line p-6 md:p-8 shadow-hard-sm flex flex-col items-start gap-4 justify-center">
                            <div>
                                <h3 className="font-display font-bold text-ink text-lg">Ready to start?</h3>
                                <p className="text-sm text-text-soft mt-1">
                                    Creating a store takes about a minute. You'll add your store name,
                                    address, mobile number and a logo.
                                </p>
                            </div>
                            <Link
                                href={route('dashboard.createstore')}
                                className="inline-flex items-center gap-2 bg-marigold hover:bg-marigold-dark text-white font-bold rounded-xl px-6 py-3 shadow-hard-sm transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <FaStore className="h-5 w-5" />
                                Create Your Store
                                <FiChevronRight className="h-5 w-5" />
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-marigold p-6 md:p-8 shadow-hard-sm">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold mb-3">
                                <FiCheckCircle className="h-5 w-5" />
                                Store created
                            </div>
                            {stores.length > 0 && (
                                <ul className="space-y-1 text-sm text-text-soft">
                                    {stores.map((store) => (
                                        <li key={store.id} className="flex items-center gap-2">
                                            <FiChevronRight className="text-marigold h-4 w-4" />
                                            {store.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <p className="text-sm text-text-soft mt-3">
                                Ready to show off your shop. Now let's add your first product.
                            </p>
                        </div>
                    )}

                    <StoreGuideCard step={2} title="Upload Your First Product" done={productDone} optional={!productDone && true}>
                        List an item your store sells — add photos, a category, a brand, sizes/colors,
                        a price and your stock quantity. This step is optional and can be skipped for now.
                    </StoreGuideCard>

                    {!productDone ? (
                        <div className="bg-white rounded-2xl border border-line p-6 md:p-8 shadow-hard-sm flex flex-col items-start gap-4 justify-center">
                            <div>
                                <h3 className="font-display font-bold text-ink text-lg">Add your first product</h3>
                                <p className="text-sm text-text-soft mt-1">
                                    The fastest way to start selling. You can publish more products
                                    any time from your dashboard.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={route('dashboard.createproduct')}
                                    className={`inline-flex items-center gap-2 font-bold rounded-xl px-6 py-3 shadow-hard-sm transition-all duration-300 hover:-translate-y-0.5 ${storeDone ? 'bg-marigold hover:bg-marigold-dark text-white' : 'bg-neutral-200 text-neutral-400 pointer-events-none'}`}
                                >
                                    <FaBoxOpen className="h-5 w-5" />
                                    Upload Your First Product
                                </Link>
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center gap-2 bg-white border border-line text-ink font-bold rounded-xl px-6 py-3 shadow-hard-sm transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    <FiClock className="h-5 w-5" />
                                    Skip for Now
                                </Link>
                            </div>
                            {!storeDone && (
                                <p className="text-xs text-text-soft flex items-center gap-1.5">
                                    <FiInfo className="h-4 w-4 text-marigold" />
                                    You need a store first. Create your store above to unlock product uploads.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-marigold p-6 md:p-8 shadow-hard-sm flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                <FiCheckCircle className="h-5 w-5" />
                                You're all set!
                            </div>
                            <p className="text-sm text-text-soft">
                                Your first product is live. Keep adding products and watch your orders grow.
                            </p>
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center justify-center gap-2 bg-marigold hover:bg-marigold-dark text-white font-bold rounded-xl px-6 py-3 shadow-hard-sm transition-all duration-300 hover:-translate-y-0.5 w-fit"
                            >
                                <FiShoppingBag className="h-5 w-5" />
                                Go to Dashboard
                            </Link>
                        </div>
                    )}
                </div>

                {/* Illustrated guide */}
                <div className="bg-white rounded-2xl border border-line shadow-hard-sm p-6 md:p-8">
                    <h2 className="text-lg md:text-xl font-display font-bold text-ink mb-6 flex items-center gap-2">
                        <FiInfo className="text-marigold" />
                        How to Create a Store & Upload Products
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-display font-bold text-ink mb-4 flex items-center gap-2">
                                <span className="bg-marigold/10 text-marigold rounded-lg h-7 w-7 flex items-center justify-center text-sm font-bold">1</span>
                                Creating your store
                            </h3>
                            <ol className="space-y-3 text-sm text-text-soft list-decimal list-inside">
                                <li>Click <strong className="text-ink">Create Your Store</strong> from the guide.</li>
                                <li>Choose a <strong className="text-ink">store type</strong> that matches what you sell.</li>
                                <li>Enter a unique <strong className="text-ink">store name</strong> and your
                                    <strong className="text-ink"> address</strong>.</li>
                                <li>Add your <strong className="text-ink">mobile number</strong> (11 digits, starts with 01) and your
                                    <strong className="text-ink"> National ID</strong>.</li>
                                <li>Enter your <strong className="text-ink">trade license</strong> if you have one (optional).</li>
                                <li>Upload a <strong className="text-ink">store logo</strong> and hit save. You're done!</li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="font-display font-bold text-ink mb-4 flex items-center gap-2">
                                <span className="bg-marigold/10 text-marigold rounded-lg h-7 w-7 flex items-center justify-center text-sm font-bold">2</span>
                                Uploading a product
                            </h3>
                            <ol className="space-y-3 text-sm text-text-soft list-decimal list-inside">
                                <li>Go to <strong className="text-ink">Upload Your First Product</strong>.</li>
                                <li>Pick which <strong className="text-ink">store</strong> the product belongs to.</li>
                                <li>Fill in the <strong className="text-ink">name</strong> and a clear
                                    <strong className="text-ink"> description</strong>.</li>
                                <li>Choose a <strong className="text-ink">category</strong>, then a
                                    <strong className="text-ink"> subcategory</strong>, and a
                                    <strong className="text-ink"> brand</strong>.</li>
                                <li>Set the available <strong className="text-ink">sizes</strong> and
                                    <strong className="text-ink"> colors</strong>, plus
                                    <strong className="text-ink"> weight</strong> if needed.</li>
                                <li>Add the <strong className="text-ink">price</strong>, your
                                    <strong className="text-ink"> stock quantity</strong>, and
                                    <strong className="text-ink"> product photos</strong>, then publish.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default AgentGuide