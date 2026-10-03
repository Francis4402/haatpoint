import { FaWhatsapp } from 'react-icons/fa';

/**
 * Floating WhatsApp entry point, mounted in the shared layouts so the same
 * contact route is reachable from every screen without hunting for a
 * "Contact us" link.
 */

/** Local 01319052507 in the international form wa.me expects. */
const WHATSAPP_NUMBER = '8801319052507';

const WHATSAPP_NAME = 'HaatPoint';

const DEFAULT_MESSAGE = `Hi ${WHATSAPP_NAME}! I have a question about your store.`;

type Props = {
    /** Overrides the prefilled chat text. */
    message?: string;
};

export default function WhatsAppChatButton({ message = DEFAULT_MESSAGE }: Props) {
    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    return (
        <div className="fixed bottom-5 right-5 z-[120] sm:bottom-6 sm:right-6">
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chat with ${WHATSAPP_NAME} on WhatsApp`}
                className="group flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
            >
                {/* Label stays on screen from sm up so the button reads as
                    "contact us" rather than a stray icon; on mobile it only
                    appears on hover/focus to stay out of the way. */}
                <span className="hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-white px-0 py-2 text-sm font-semibold text-ink opacity-0 shadow-hard-sm transition-all duration-300 group-hover:max-w-[14rem] group-hover:px-4 group-hover:opacity-100 group-focus-visible:max-w-[14rem] group-focus-visible:px-4 group-focus-visible:opacity-100 sm:block sm:max-w-[14rem] sm:px-4 sm:opacity-100">
                    Chat with {WHATSAPP_NAME}
                </span>

                <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-hard-sm transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                    <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
                </span>
            </a>
        </div>
    );
}