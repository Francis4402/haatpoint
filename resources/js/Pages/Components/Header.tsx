import { Link } from "@inertiajs/react";
import { IoIosSearch } from "react-icons/io";
import { MdShoppingCartCheckout } from "react-icons/md";


export default function Header() {
  return (
    <header className="sticky top-0 z-[100] bg-paper/90 backdrop-blur-md border-b border-line">
      <div className="max-w-[1240px] mx-auto flex items-center justify-between gap-6 px-8 py-3.5">
        <div className="flex items-center gap-2.5 shrink-0">
          <img src={'/MyLogo.png'} alt="Haatpoint logo" className="h-[34px] w-auto" />
          <span className="font-display font-extrabold text-[22px] tracking-[-0.01em] uppercase">
            Haatpoint
          </span>
        </div>

        <nav className="hidden md:flex gap-7 text-sm font-semibold">
          {[
            ["Categories", "#categories"],
            ["Featured", "#featured"],
            ["Trending", "#trending"],
            ["Today", "#discover"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="relative py-1 after:content-[''] after:block after:h-[2px] after:w-0 after:bg-marigold after:transition-[width] after:duration-200 hover:after:w-full hover:text-marigold-dark"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm rounded-sm px-3.5 py-2 bg-white border-[1.5px] border-ink">
          <IoIosSearch size={15} className="text-ink shrink-0" />
          <input
            type="text"
            placeholder="Search vendors, products, deals…"
            className="w-full outline-none text-sm bg-transparent font-body"
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <MdShoppingCartCheckout size={20} className="text-ink cursor-pointer" />
          <Link
            href="#sell"
            className="whitespace-nowrap rounded-sm px-[18px] py-2.5 text-sm font-bold bg-ink text-paper"
          >
            Sell on Haatpoint
          </Link>
        </div>
      </div>
    </header>
  );
}
