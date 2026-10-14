import { Link } from '@inertiajs/react'
import {
    FiCheckCircle,
    FiCircle,
    FiArrowRight,
    FiUser,
    FiPackage,
    FiTrendingUp,
} from 'react-icons/fi'
import { FaStore } from 'react-icons/fa'

interface AgentOnboardingChecklistProps {
    vendorProfileComplete: boolean
    hasStore: boolean
    productsCount: number
}

interface Step {
    key: string
    title: string
    hint: string
    done: boolean
    href: string
    cta: string
    icon: React.ReactNode
}

/**
 * A pointing, step-by-step checklist that walks a new agent from sign-up to
 * their first sale. It stays visible on the dashboard until every step is
 * complete so a vendor always knows the single next thing to do.
 */
export default function AgentOnboardingChecklist({
    vendorProfileComplete,
    hasStore,
    productsCount,
}: AgentOnboardingChecklistProps) {
    const hasProduct = productsCount > 0

    const steps: Step[] = [
        {
            key: 'profile',
            title: 'Complete your business details',
            hint: 'Name, mobile, National ID and address. These fill your store form automatically.',
            done: vendorProfileComplete,
            href: route('vendor.profile.edit'),
            cta: 'Complete profile',
            icon: <FiUser className="h-5 w-5" />,
        },
        {
            key: 'store',
            title: 'Create your store',
            hint: 'Pick a name, store type and the city you ship from so delivery prices are correct.',
            done: hasStore,
            href: route('dashboard.createstore'),
            cta: 'Create store',
            icon: <FaStore className="h-5 w-5" />,
        },
        {
            key: 'product',
            title: 'Upload your first product',
            hint: 'Add photos, a price and stock — publishing a product is how customers find you.',
            done: hasProduct,
            href: route('dashboard.createproduct'),
            cta: 'Upload product',
            icon: <FiPackage className="h-5 w-5" />,
        },
        {
            key: 'sell',
            title: 'You are ready to sell!',
            hint: 'Share your store and keep orders moving from your dashboard.',
            done: hasStore && hasProduct,
            href: route('dashboard.store'),
            cta: 'Go to my store',
            icon: <FiTrendingUp className="h-5 w-5" />,
        },
    ]

    const completed = steps.filter((s) => s.done).length
    const total = steps.length
    const percent = Math.round((completed / total) * 100)
    const allDone = completed === total

    // Everything is done — show a short confirmation instead of the checklist.
    if (allDone) {
        return (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-hard-sm flex flex-wrap items-center gap-3">
                <FiCheckCircle className="h-6 w-6 shrink-0 text-emerald-600" />
                <div className="min-w-0 flex-1">
                    <p className="font-display font-bold text-ink">Your shop is up and running</p>
                    <p className="text-sm text-text-soft">
                        Profile, store and products are all set. Add more products any time to grow your sales.
                    </p>
                </div>
                <Link
                    href={route('dashboard.createproduct')}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                    Add another product
                    <FiArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-hard-sm border border-line overflow-hidden">
            <div className="px-6 py-5 border-b border-line">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">
                            Get started
                        </h3>
                        <p className="mt-1 text-sm text-text-soft">
                            Follow these steps to start selling. You are {completed} of {total} done.
                        </p>
                    </div>
                    <span className="text-sm font-mono font-bold text-marigold">{percent}%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-paper-dim">
                    <div
                        className="h-full rounded-full bg-marigold transition-all duration-500"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            <ul className="divide-y divide-line">
                {steps.map((step, index) => (
                    <li
                        key={step.key}
                        className={`flex items-start gap-4 px-6 py-4 ${step.done ? 'opacity-60' : ''}`}
                    >
                        <div className="mt-0.5 shrink-0">
                            {step.done ? (
                                <FiCheckCircle className="h-5 w-5 text-emerald-500" />
                            ) : (
                                <FiCircle className="h-5 w-5 text-text-soft" />
                            )}
                        </div>
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                            <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                    step.done ? 'bg-emerald-50 text-emerald-600' : 'bg-marigold/10 text-marigold'
                                }`}
                            >
                                {step.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`font-semibold text-ink ${step.done ? 'line-through decoration-1' : ''}`}>
                                    <span className="mr-1.5 text-text-soft">{index + 1}.</span>
                                    {step.title}
                                </p>
                                <p className="text-sm text-text-soft">{step.hint}</p>
                            </div>
                        </div>
                        {!step.done && (
                            <Link
                                href={step.href}
                                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-marigold px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-marigold-dark"
                            >
                                {step.cta}
                                <FiArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
