import { useMemo, useState } from "react";

type MenuKey = "home" | "catalog" | "cart";
type TxType = "Masuk" | "Keluar";

type Transaction = {
  id: string;
  date: string;
  type: TxType;
  item: string;
  qty: number;
  price: number;
  discountPercent: number;
  note?: string;
};

export default function App() {
  const [active, setActive] = useState<MenuKey>("home");
  const [q, setQ] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title = useMemo(() => {
    if (active === "home") return "Home";
    if (active === "catalog") return "Catalog";
    return "Cart";
  }, [active]);

  return (
    <div className="h-screen bg-white text-gray-800 overflow-hidden">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b">
        <button
          onClick={() => setSidebarOpen(true)}
          className="px-3 py-2 rounded-lg border text-sm"
          type="button"
        >
          Menu
        </button>
        <div className="font-semibold">{title}</div>
        <div className="w-[72px]" />
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <aside
          className={[
            "w-[280px] border-r bg-white flex flex-col",
            "fixed lg:static inset-y-0 left-0 z-40",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0 transition-transform duration-200",
          ].join(" ")}
        >
          <div className="p-4 border-b">
            <div className="h-[92px] w-full rounded-xl flex items-center justify-center bg-white">
              <img
                src="/starleaf.png"
                alt="StarLeaf Logo"
                className="max-h-[70px] w-auto"
                draggable={false}
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-10">
            <MenuItem
              label="Home"
              active={active === "home"}
              onClick={() => {
                setActive("home");
                setSidebarOpen(false);
              }}
            />
            <MenuItem
              label="Catalog"
              active={active === "catalog"}
              onClick={() => {
                setActive("catalog");
                setSidebarOpen(false);
              }}
            />
            <MenuItem
              label="Cart"
              active={active === "cart"}
              onClick={() => {
                setActive("cart");
                setSidebarOpen(false);
              }}
            />
          </nav>

          <div className="border-t p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-10 w-10 rounded-full border flex items-center justify-center text-gray-500">
                👤
              </div>
              <div className="min-w-0">
                <div className="text-sm text-gray-600 font-semibold">Admin</div>
                <div className="text-xs text-gray-400">(bukan super admin)</div>
              </div>
            </div>

            <button
              type="button"
              className="text-red-500 hover:text-red-600 font-semibold text-sm inline-flex items-center gap-2"
              onClick={() => alert("Logout (contoh).")}
            >
              Logout <span className="text-lg leading-none">⎋</span>
            </button>
          </div>
        </aside>

        {/* Backdrop mobile */}
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Main */}
        <main className="flex-1 h-full overflow-y-auto">
          {/* Desktop topbar */}
          <div className="hidden lg:flex items-center justify-between px-10 py-6">
            <div className="text-gray-700 font-semibold">{title}</div>

            <div className="relative w-[320px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-full rounded-full border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-10 pb-10">
            <div className="h-px bg-gray-100 mb-8" />

            {active === "home" && <HomeKoperasiAdmin />}

            {active === "catalog" && (
              <div>
                <div className="text-gray-700 font-bold mb-4">Catalog</div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border rounded-2xl p-4">
                      <div className="h-24 bg-gray-50 rounded-xl mb-3" />
                      <div className="font-semibold">Item {i + 1}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Deskripsi singkat produk.
                      </div>
                      <button className="mt-3 text-sm font-semibold text-teal-600 hover:text-teal-700">
                        Add to cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "cart" && (
              <div>
                <div className="text-gray-700 font-bold mb-4">Cart</div>
                <div className="border rounded-2xl p-4">
                  <div className="text-sm text-gray-500">
                    Cart masih kosong (contoh).
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function MenuItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="w-full text-left py-5">
      <div
        className={[
          "text-center text-base font-medium",
          active ? "text-teal-500" : "text-gray-600",
        ].join(" ")}
      >
        {label}
      </div>
      <div
        className={[
          "h-px mt-3 w-full",
          active ? "bg-teal-300" : "bg-gray-200",
        ].join(" ")}
      />
    </button>
  );
}

function HomeKoperasiAdmin() {
  const [modalOpen, setModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TX-0001",
      date: "2026-01-22",
      type: "Masuk",
      item: "Beras 5kg",
      qty: 10,
      price: 68000,
      discountPercent: 0,
      note: "Restock",
    },
    {
      id: "TX-0002",
      date: "2026-01-22",
      type: "Keluar",
      item: "Mie Instan",
      qty: 24,
      price: 3500,
      discountPercent: 10,
      note: "Promo",
    },
    {
      id: "TX-0003",
      date: "2026-01-21",
      type: "Keluar",
      item: "Gula 1kg",
      qty: 5,
      price: 16000,
      discountPercent: 0,
      note: "Penjualan",
    },
  ]);

  const totalMasuk = transactions
    .filter((t) => t.type === "Masuk")
    .reduce((acc, t) => acc + calcTotal(t.qty, t.price, t.discountPercent), 0);

  const totalKeluar = transactions
    .filter((t) => t.type === "Keluar")
    .reduce((acc, t) => acc + calcTotal(t.qty, t.price, t.discountPercent), 0);

  function addTransaction(tx: Omit<Transaction, "id">) {
    const nextId = `TX-${String(transactions.length + 1).padStart(4, "0")}`;
    setTransactions([{ id: nextId, ...tx }, ...transactions]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold text-gray-800">
            Dashboard Koperasi Barang
          </div>
          <div className="text-sm text-gray-500">
            Admin bisa input transaksi & diskon. Total otomatis dihitung.
          </div>
        </div>

        <button
          type="button"
          className="rounded-full bg-teal-400 px-4 py-2 text-sm font-extrabold text-white hover:bg-teal-500"
          onClick={() => setModalOpen(true)}
        >
          + Tambah Transaksi
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Masuk" value={formatIDR(totalMasuk)} note="Barang masuk" />
        <StatCard title="Total Keluar" value={formatIDR(totalKeluar)} note="Keluar (setelah diskon)" />
        <StatCard title="Saldo" value={formatIDR(totalKeluar - totalMasuk)} note="Keluar - Masuk" />
      </div>

      <div className="border rounded-2xl p-5">
        <div className="font-bold text-gray-800">Transaksi Terbaru</div>
        <div className="text-sm text-gray-500 mt-1">
          Total sudah memperhitungkan diskon.
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2 pr-3">ID</th>
                <th className="py-2 pr-3">Tanggal</th>
                <th className="py-2 pr-3">Tipe</th>
                <th className="py-2 pr-3">Barang</th>
                <th className="py-2 pr-3">Qty</th>
                <th className="py-2 pr-3">Harga</th>
                <th className="py-2 pr-3">Diskon</th>
                <th className="py-2 pr-3">Total</th>
                <th className="py-2">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const total = calcTotal(t.qty, t.price, t.discountPercent);
                const badge =
                  t.type === "Masuk"
                    ? "bg-teal-100 text-teal-700"
                    : "bg-rose-100 text-rose-700";

                return (
                  <tr key={t.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-3 font-semibold text-gray-800">{t.id}</td>
                    <td className="py-3 pr-3 text-gray-600">{t.date}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-gray-800">{t.item}</td>
                    <td className="py-3 pr-3 text-gray-600">{t.qty}</td>
                    <td className="py-3 pr-3 text-gray-600">{formatIDR(t.price)}</td>
                    <td className="py-3 pr-3 text-gray-600">
                      {t.discountPercent > 0 ? `${t.discountPercent}%` : "-"}
                    </td>
                    <td className="py-3 pr-3 font-semibold text-gray-800">{formatIDR(total)}</td>
                    <td className="py-3 text-gray-600">{t.note ?? "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <TxModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={(tx) => {
          addTransaction(tx);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

function StatCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="border rounded-2xl p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-xl sm:text-2xl font-extrabold text-gray-800">{value}</div>
      <div className="mt-2 text-xs text-gray-500">{note}</div>
    </div>
  );
}

function TxModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (tx: Omit<Transaction, "id">) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState<string>(today);
  const [type, setType] = useState<TxType>("Keluar");
  const [item, setItem] = useState<string>("");
  const [qty, setQty] = useState<string>("1");
  const [price, setPrice] = useState<string>("0");
  const [discountPercent, setDiscountPercent] = useState<string>("0");
  const [note, setNote] = useState<string>("");

  if (!open) return null;

  const qtyNum = clampInt(qty, 1, 1_000_000);
  const priceNum = clampInt(price, 0, 1_000_000_000);
  const discNum = clampInt(discountPercent, 0, 100);

  // Admin: batasi diskon (contoh 30%). Super admin nanti bisa lebih.
  const adminMaxDiscount = 30;
  const discAdmin = Math.min(discNum, adminMaxDiscount);

  const subtotal = qtyNum * priceNum;
  const total = calcTotal(qtyNum, priceNum, discAdmin);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        type="button"
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-gray-800">Tambah Transaksi</div>
            <div className="text-sm text-gray-500">
              Diskon admin maksimal {adminMaxDiscount}%.
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Tanggal" value={date} onChange={setDate} type="date" />
          <Select
            label="Tipe"
            value={type}
            onChange={(v) => setType(v as TxType)}
            options={["Masuk", "Keluar"]}
          />
          <Input label="Nama Barang" value={item} onChange={setItem} placeholder="Contoh: Beras 5kg" />
          <Input label="Qty" value={qty} onChange={setQty} type="number" />
          <Input label="Harga/Item" value={price} onChange={setPrice} type="number" />
          <Input label="Diskon (%)" value={discountPercent} onChange={setDiscountPercent} type="number" />
          <Input label="Catatan" value={note} onChange={setNote} placeholder="Opsional" />
        </div>

        {discNum > adminMaxDiscount ? (
          <div className="mt-3 text-xs text-amber-700 bg-amber-100 border border-amber-200 rounded-xl px-3 py-2">
            Diskon kamu {discNum}% melebihi batas admin. Dipakai {adminMaxDiscount}%.
          </div>
        ) : null}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Subtotal: <span className="font-extrabold text-gray-800">{formatIDR(subtotal)}</span>
            <span className="mx-2 text-gray-400">•</span>
            Diskon: <span className="font-extrabold text-gray-800">{discAdmin}%</span>
            <span className="mx-2 text-gray-400">•</span>
            Total: <span className="font-extrabold text-gray-800">{formatIDR(total)}</span>
          </div>

          <button
            type="button"
            className="rounded-full bg-teal-400 px-5 py-2 text-sm font-extrabold text-white hover:bg-teal-500 disabled:opacity-60"
            disabled={!item.trim()}
            onClick={() =>
              onSubmit({
                date,
                type,
                item: item.trim(),
                qty: qtyNum,
                price: priceNum,
                discountPercent: discAdmin,
                note: note.trim() || undefined,
              })
            }
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-gray-600 mb-1">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-gray-600 mb-1">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function calcTotal(qty: number, price: number, discountPercent: number) {
  const subtotal = qty * price;
  const disc = Math.max(0, Math.min(100, discountPercent));
  return Math.round(subtotal * (1 - disc / 100));
}

function clampInt(v: string, min: number, max: number) {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  const i = Math.trunc(n);
  return Math.max(min, Math.min(max, i));
}

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}
