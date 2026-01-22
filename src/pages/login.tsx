import { useState } from "react";

export default function App() {
  const [show, setShow] = useState(false);

  return (
    <div className="min-h-screen bg-[#00FFD1] flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-[520px] rounded-2xl bg-white shadow-xl px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex items-center justify-center mb-10">
          <img
            src="/starleaf.png"
            alt="Logo StarLeaf"
            className="w-[240px] sm:w-[260px] h-auto"
            draggable={false}
          />
        </div>

        <form className="space-y-5">
          <input
            className="w-full rounded-full bg-gray-100 px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-teal-300"
            placeholder="Username"
            autoComplete="username"
          />

          <div className="relative">
            <input
              className="w-full rounded-full bg-gray-100 px-6 py-4 pr-24 text-sm outline-none focus:ring-2 focus:ring-teal-300"
              placeholder="Password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
            />

            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600 hover:text-gray-800"
              aria-label="toggle password"
              title="Tampilkan / Sembunyikan"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" defaultChecked className="h-4 w-4" />
            Remember Me!
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-[#00FFD1] py-4 text-lg font-extrabold text-white hover:bg-teal-400 transition active:scale-[0.99]"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 flex justify-end text-sm font-bold leading-4">
          <span className="text-green-600">Star</span>
          <span className="ml-1 text-[#00FFD1]">Leaf</span>
        </div>
      </div>
    </div>
  );
}
