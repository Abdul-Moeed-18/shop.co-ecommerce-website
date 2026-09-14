import { Bell, Search, Menu } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-200">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            <Menu size={22} />
          </button>

          <div className="hidden sm:flex items-center w-72 bg-slate-100 rounded-xl px-4 py-2.5">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none border-none ml-2 w-full text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl hover:bg-slate-100">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              A
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Admin
              </p>
              <p className="text-xs text-slate-400">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}