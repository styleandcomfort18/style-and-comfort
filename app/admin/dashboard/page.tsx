"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CATEGORY_LABELS } from "@/lib/seed-products";

const fmt = (n: number) => `$${n.toLocaleString()} GYD`;

interface Product {
  id: string;
  name: string;
  category: string;
  sub: string;
  description: string;
  images: string[];
  retail_price: number;
  wholesale_price: number;
  reseller_price: number;
  is_active: boolean;
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  delivery_zone: string;
  payment_method: string;
  total: number;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/admin/login");
      } else {
        setCheckingAuth(false);
        loadProducts();
        loadOrders();
      }
    });
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  const loadOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleSave = async (product: Partial<Product>, id?: string) => {
    setMessage("");
    if (id) {
      const { error } = await supabase.from("products").update(product).eq("id", id);
      if (error) { setMessage("Error saving: " + error.message); return; }
    } else {
      const { error } = await supabase.from("products").insert(product);
      if (error) { setMessage("Error adding: " + error.message); return; }
    }
    setMessage("Saved.");
    setEditing(null);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    loadOrders();
  };

  if (checkingAuth) {
    return <div className="p-10 text-center text-brand-text/60">Checking login...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display font-bold text-2xl text-brand-dark">Store Admin</h1>
        <button onClick={handleLogout} className="text-sm text-brand-text/60 hover:text-brand-text">
          Log out
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded-card font-medium ${tab === "products" ? "bg-brand-primary text-white" : "bg-brand-light"}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded-card font-medium ${tab === "orders" ? "bg-brand-primary text-white" : "bg-brand-light"}`}
        >
          Orders
        </button>
      </div>

      {message && <p className="text-brand-primary text-sm mb-4">{message}</p>}

      {tab === "products" && (
        <div>
          <button
            onClick={() => setEditing({
              id: "", name: "", category: "men", sub: "", description: "",
              images: [], retail_price: 0, wholesale_price: 0, reseller_price: 0, is_active: true,
            })}
            className="mb-4 bg-brand-primary text-white px-4 py-2 rounded-card font-medium"
          >
            + Add product
          </button>

          {editing && (
            <ProductForm
              product={editing}
              onCancel={() => setEditing(null)}
              onSave={(p) => handleSave(p, editing.id || undefined)}
            />
          )}

          <div className="space-y-2 mt-4">
            {products.map((p) => (
              <div key={p.id} className="flex justify-between items-center border border-brand-border rounded-card p-3">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-brand-text/60">
                    {CATEGORY_LABELS[p.category] || p.category} · {p.sub} · {fmt(p.retail_price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(p)} className="text-sm text-brand-primary font-medium">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-sm text-brand-accent font-medium">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="space-y-2">
          {orders.length === 0 && <p className="text-brand-text/60">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="border border-brand-border rounded-card p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{o.customer_name} — {o.customer_phone}</p>
                  <p className="text-xs text-brand-text/60">
                    {o.delivery_zone} · {o.payment_method} · {fmt(o.total)} · {new Date(o.created_at).toLocaleString()}
                  </p>
                </div>
                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                  className="text-sm border border-brand-border rounded-card p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="out_for_delivery">Out for delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductForm({ product, onCancel, onSave }: {
  product: Product;
  onCancel: () => void;
  onSave: (p: Partial<Product>) => void;
}) {
  const [form, setForm] = useState(product);

  return (
    <div className="border border-brand-border rounded-card p-4 mb-4 space-y-3 bg-brand-light">
      <input
        placeholder="Product name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full border border-brand-border rounded-card p-2"
      />
      <div className="grid grid-cols-2 gap-2">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-brand-border rounded-card p-2"
        >
          {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
            <option key={slug} value={slug}>{label}</option>
          ))}
        </select>
        <input
          placeholder="Sub-category (e.g. Jeans)"
          value={form.sub}
          onChange={(e) => setForm({ ...form, sub: e.target.value })}
          className="border border-brand-border rounded-card p-2"
        />
      </div>
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border border-brand-border rounded-card p-2"
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-brand-text/60">Retail price</label>
          <input
            type="number"
            value={form.retail_price}
            onChange={(e) => setForm({ ...form, retail_price: Number(e.target.value) })}
            className="w-full border border-brand-border rounded-card p-2"
          />
        </div>
        <div>
          <label className="text-xs text-brand-text/60">Wholesale price</label>
          <input
            type="number"
            value={form.wholesale_price}
            onChange={(e) => setForm({ ...form, wholesale_price: Number(e.target.value) })}
            className="w-full border border-brand-border rounded-card p-2"
          />
        </div>
        <div>
          <label className="text-xs text-brand-text/60">Reseller price</label>
          <input
            type="number"
            value={form.reseller_price}
            onChange={(e) => setForm({ ...form, reseller_price: Number(e.target.value) })}
            className="w-full border border-brand-border rounded-card p-2"
          />
        </div>
      </div>
      <input
        placeholder="Image URL (paste a link to a photo)"
        value={form.images[0] || ""}
        onChange={(e) => setForm({ ...form, images: [e.target.value] })}
        className="w-full border border-brand-border rounded-card p-2"
      />
      <div className="flex gap-2">
        <button onClick={() => onSave(form)} className="bg-brand-primary text-white px-4 py-2 rounded-card font-medium">
          Save
        </button>
        <button onClick={onCancel} className="px-4 py-2 rounded-card font-medium border border-brand-border">
          Cancel
        </button>
      </div>
    </div>
  );
}
