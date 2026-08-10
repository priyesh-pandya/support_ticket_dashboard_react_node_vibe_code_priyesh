import { HiOutlineLifebuoy, HiOutlineBell, HiOutlineUserCircle } from "react-icons/hi2";

export default function Header() {
  return (
    <header className="glass sticky top-0 z-40 border-b border-white/40 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm">
            <HiOutlineLifebuoy size={18} />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-800">
            Priyesh Support
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <a href="#" className="hidden transition hover:text-indigo-600 sm:inline">Dashboard</a>
          <a href="#" className="hidden transition hover:text-indigo-600 sm:inline">Docs</a>
          <button className="rounded-full p-2 text-slate-500 transition hover:bg-white/70 hover:text-indigo-600">
            <HiOutlineBell size={18} />
          </button>
          <button className="rounded-full p-2 text-slate-500 transition hover:bg-white/70 hover:text-indigo-600">
            <HiOutlineUserCircle size={20} />
          </button>
        </nav>
      </div>
    </header>
  );
}
