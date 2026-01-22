import { useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";

type Role = "admin" | "super_admin";
type TxType = "Masuk" | "Keluar";

type Transaction = {
  id: string;
  date: string;
  type: TxType;
  item: string;
  qty: number;
  price: number;
  discountPercent: number; // 0-100
  note?: string;
};

type UserRole = "operator" | "admin" | "super_admin";

type UserRow = {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  active: boolean;
};

export default function DashboardPage() {
  // TODO: nanti ambil dari Laravel (/api/me)
  const [role, setRole] = useState<Role>("admin"); // ganti ke "super_admin" untuk test

  return (
    <DashboardLayout role={role} setRole={setRole}>
      <Routes>
        <Route path="home" element={<HomeKoperasi role={role} />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="cart" element={<Cart />} />
        {role === "super_admin" && <Route path="users" element={<Users />} />}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </DashboardLayout>
  );
}

function DashboardLayout({
  children,
  role,
  setRole,
}: {
  children: React.ReactNode;
  role: Role;
  setRole: (r: Role) => void;
}) {
  const [q, setQ] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;
  const activeKey: "home" | "catalog" | "cart" | "users" =
    path.includes("/users") ? "users" : path.includes("/catalog") ? "catalog" : path.includes("/cart") ? "cart" : "home";

  const title = useMemo(() => {
    if (activeKey === "home") return "Home";
    if (activeKey === "catalog") return "Catalog";
    if (activeKey === "cart") return "Cart";
    return "Users";
  }, [activeKey]);

  const menus = [
    { key: "home", label: "Home", to: "../home" },
    { key: "catalog", label: "Catalog", to: "../catalog" },
    { key: "cart", label: "Cart", to: "../cart" },
    ...(role === "super_admin" ? [{ key: "users", label: "Users", to: "../users" }] : []),
  ] as const;

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
              <img src="/starleaf.png" alt="StarLeaf Logo" className="max-h-[70px] w-auto" draggable={false} />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-10">
            {menus.map((m) => (
              <MenuItem
                key={m.key}
                label={m.label}
                active={activeKey === m.key}
                onClick={() => {
                  navigate(m.to);
                  setSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          {/* Footer user */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-10 w-10 rounded-full border flex items-center justify-center text-gray-500">
                  👤
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-gray-700 font-semibold">
                    {role === "super_admin" ? "Super Admin" : "Admin"}
                  </div>
                  <div className="text-xs text-gray-400 leading-tight">
                    {role === "super_admin"
                      ? "Akses penuh (kelola user & diskon)"
                      : "Diskon terbatas, tanpa kelola user"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="text-red-500 hover:text-red-600 font-semibold text-sm inline-flex items-center gap-2"
                onClick={() => alert("Logout (contoh). Nanti sambungkan ke Laravel.)")}
              >
                Logout <span className="text-lg leading-none">⎋</span>
              </button>
            </div>

            {/* Toggle role (HANYA untuk demo). Hapus kalau sudah ambil dari backend */}
            <div className="mt-3 flex items-center justify-between gap-2 text-xs">
              <span className="text-gray-400">Demo role switch:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full border ${role === "admin" ? "bg-gray-50 font-bold" : ""}`}
                  onClick={() => setRole("admin")}
                >
                  admin
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded-full border ${role === "super_admin" ? "bg-gray-50 font-bold" : ""}`}
                  onClick={() => setRole("super_admin")}
                >
                  super_admin
                </button>
              </div>
            </div>
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
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</div>
            </div>
          </div>

          <div className="px-6 lg:px-10 pb-10">
            <div className="h-px bg-gray-100 mb-8" />
            {children}
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
      <div className={["text-center text-base font-medium", active ? "text-teal-500" : "text-gray-600"].join(" ")}>
        {label}
      </div>
      <div className={["h-px mt-3 w-full", active ? "bg-teal-300" : "bg-gray-200"].join(" ")} />
    </button>
  );
}

/* ===================== HOME (Transaksi + Diskon) ===================== */

function HomeKoperasi({ role }: { role: Role }) {
  const [modalOpen, setModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "TX-0001", date: "2026-01-22", type: "Masuk", item: "Beras 5kg", qty: 10, price: 68000, discountPercent: 0, note: "Restock" },
    { id: "TX-0002", date: "2026-01-22", type: "Keluar", item: "Mie Instan", qty: 24, price: 3500, discountPercent: 10, note: "Promo" },
    { id: "TX-0003", date: "2026-01-21", type: "Keluar", item: "Gula 1kg", qty: 5, price: 16000, discountPercent: 0, note: "Penjualan" },
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
          <div className="text-xl font-bold text-gray-800">Dashboard Koperasi Barang</div>
          <div className="text-sm text-gray-500">
            {role === "super_admin"
              ? "Super Admin: diskon sampai 100% dan akses penuh."
              : "Admin: diskon dibatasi (contoh max 30%)."}
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
        <div className="text-sm text-gray-500 mt-1">Total sudah memperhitungkan diskon.</div>

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
                const badge = t.type === "Masuk" ? "bg-teal-100 text-teal-700" : "bg-rose-100 text-rose-700";
                return (
                  <tr key={t.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-3 font-semibold text-gray-800">{t.id}</td>
                    <td className="py-3 pr-3 text-gray-600">{t.date}</td>
                    <td className="py-3 pr-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge}`}>{t.type}</span>
                    </td>
                    <td className="py-3 pr-3 text-gray-800">{t.item}</td>
                    <td className="py-3 pr-3 text-gray-600">{t.qty}</td>
                    <td className="py-3 pr-3 text-gray-600">{formatIDR(t.price)}</td>
                    <td className="py-3 pr-3 text-gray-600">{t.discountPercent > 0 ? `${t.discountPercent}%` : "-"}</td>
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
        role={role}
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
  role,
  onClose,
  onSubmit,
}: {
  open: boolean;
  role: Role;
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
  const discNumRaw = clampInt(discountPercent, 0, 100);

  const adminMaxDiscount = 30;
  const disc = role === "super_admin" ? discNumRaw : Math.min(discNumRaw, adminMaxDiscount);

  const subtotal = qtyNum * priceNum;
  const total = calcTotal(qtyNum, priceNum, disc);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} type="button" aria-label="Close modal" />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-gray-800">Tambah Transaksi</div>
            <div className="text-sm text-gray-500">
              {role === "super_admin" ? "Diskon sampai 100%." : `Diskon admin maksimal ${adminMaxDiscount}%.`}
            </div>
          </div>
          <button type="button" className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50" onClick={onClose}>
            Tutup
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Tanggal" value={date} onChange={setDate} type="date" />
          <Select label="Tipe" value={type} onChange={(v) => setType(v as TxType)} options={["Masuk", "Keluar"]} />
          <Input label="Nama Barang" value={item} onChange={setItem} placeholder="Contoh: Beras 5kg" />
          <Input label="Qty" value={qty} onChange={setQty} type="number" />
          <Input label="Harga/Item" value={price} onChange={setPrice} type="number" />
          <Input label="Diskon (%)" value={discountPercent} onChange={setDiscountPercent} type="number" />
          <Input label="Catatan" value={note} onChange={setNote} placeholder="Opsional" />
        </div>

        {role !== "super_admin" && discNumRaw > adminMaxDiscount ? (
          <div className="mt-3 text-xs text-amber-700 bg-amber-100 border border-amber-200 rounded-xl px-3 py-2">
            Diskon {discNumRaw}% melebihi batas admin. Dipakai {adminMaxDiscount}%.
          </div>
        ) : null}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            Subtotal: <span className="font-extrabold text-gray-800">{formatIDR(subtotal)}</span>
            <span className="mx-2 text-gray-400">•</span>
            Diskon: <span className="font-extrabold text-gray-800">{disc}%</span>
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
                discountPercent: disc,
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

/* ===================== USERS (Super Admin only) ===================== */

function Users() {
  const [open, setOpen] = useState(false);

  const [users, setUsers] = useState<UserRow[]>([
    { id: "U-0001", name: "Super Admin", username: "superadmin", role: "super_admin", active: true },
    { id: "U-0002", name: "Admin 1", username: "admin1", role: "admin", active: true },
    { id: "U-0003", name: "Operator 1", username: "operator1", role: "operator", active: true },
  ]);

  function addUser(u: Omit<UserRow, "id" | "active">) {
    const nextId = `U-${String(users.length + 1).padStart(4, "0")}`;
    setUsers([{ id: nextId, ...u, active: true }, ...users]);
  }

  function toggleActive(id: string) {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  }

  function setUserRole(id: string, role: UserRole) {
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xl font-bold text-gray-800">Kelola User</div>
          <div className="text-sm text-gray-500">
            Super Admin bisa kelola admin & operator (aktif/nonaktif & ubah role).
          </div>
        </div>

        <button
          type="button"
          className="rounded-full bg-teal-400 px-4 py-2 text-sm font-extrabold text-white hover:bg-teal-500"
          onClick={() => setOpen(true)}
        >
          + Tambah User
        </button>
      </div>

      <div className="border rounded-2xl p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-3">ID</th>
              <th className="py-2 pr-3">Nama</th>
              <th className="py-2 pr-3">Username</th>
              <th className="py-2 pr-3">Role</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const statusClass = u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600";
              return (
                <tr key={u.id} className="border-b last:border-b-0">
                  <td className="py-3 pr-3 font-semibold text-gray-800">{u.id}</td>
                  <td className="py-3 pr-3 text-gray-700">{u.name}</td>
                  <td className="py-3 pr-3 text-gray-600">{u.username}</td>
                  <td className="py-3 pr-3">
                    <select
                      value={u.role}
                      onChange={(e) => setUserRole(u.id, e.target.value as UserRole)}
                      className="rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-300 bg-white"
                      disabled={u.role === "super_admin"} // contoh: super admin role tidak diubah
                      title={u.role === "super_admin" ? "Super admin tidak bisa diubah (contoh)" : "Ubah role"}
                    >
                      <option value="operator">operator</option>
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                  </td>
                  <td className="py-3 pr-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusClass}`}>
                      {u.active ? "ACTIVE" : "DISABLED"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      className="rounded-full border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
                      onClick={() => toggleActive(u.id)}
                      disabled={u.role === "super_admin"} // contoh: tidak bisa disable super admin
                      title={u.role === "super_admin" ? "Tidak bisa menonaktifkan super admin (contoh)" : "Aktif/nonaktif"}
                    >
                      {u.active ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AddUserModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(u) => {
          addUser(u);
          setOpen(false);
        }}
      />
    </div>
  );
}

function AddUserModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (u: { name: string; username: string; role: UserRole }) => void;
}) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<UserRole>("operator");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} type="button" aria-label="Close modal" />
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-bold text-gray-800">Tambah User</div>
            <div className="text-sm text-gray-500">Buat admin/operator baru.</div>
          </div>
          <button type="button" className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50" onClick={onClose}>
            Tutup
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input label="Nama" value={name} onChange={setName} placeholder="Contoh: Admin 2" />
          <Input label="Username" value={username} onChange={setUsername} placeholder="Contoh: admin2" />
          <Select label="Role" value={role} onChange={(v) => setRole(v as UserRole)} options={["operator", "admin", "super_admin"]} />
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button type="button" className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-50" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="rounded-full bg-teal-400 px-5 py-2 text-sm font-extrabold text-white hover:bg-teal-500 disabled:opacity-60"
            disabled={!name.trim() || !username.trim()}
            onClick={() => onSubmit({ name: name.trim(), username: username.trim(), role })}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== SIMPLE PAGES ===================== */

function Catalog() {
  return (
    <div>
      <div className="text-gray-700 font-bold mb-4">Catalog</div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border rounded-2xl p-4">
            <div className="h-24 bg-gray-50 rounded-xl mb-3" />
            <div className="font-semibold">Item {i + 1}</div>
            <div className="text-sm text-gray-500 mt-1">Deskripsi singkat produk.</div>
            <button className="mt-3 text-sm font-semibold text-teal-600 hover:text-teal-700">Add to cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart() {
  return (
    <div>
      <div className="text-gray-700 font-bold mb-4">Cart</div>
      <div className="border rounded-2xl p-4 text-sm text-gray-500">Cart masih kosong (contoh).</div>
    </div>
  );
}

/* ===================== UI HELPERS ===================== */

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
