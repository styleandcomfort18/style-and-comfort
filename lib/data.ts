import { supabase } from "./supabase";

export async function getAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("is_active", true);
  if (error) throw error;
  return data;
}

export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("is_active", true)
    .eq("category", category);
  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function getDeliveryZones() {
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });
  if (error) throw error;
  return data;
}

export interface OrderPayload {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  delivery_zone: string;
  delivery_fee: number;
  payment_method: "COD" | "MMG";
  subtotal: number;
  total: number;
  items: {
    product_id: string;
    product_name: string;
    size: string;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];
}

export async function placeOrder(payload: OrderPayload) {
  const { items, ...orderFields } = payload;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderFields)
    .select()
    .single();
  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({ ...item, order_id: order.id }));
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemsError) throw itemsError;

  // Notify the store + delivery partner by email.
  // This calls a server route (see app/api/notify-order/route.ts)
  // so the email API key never reaches the browser.
  await fetch("/api/notify-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order, items }),
  }).catch(() => {
    // Order is already saved even if the email step fails —
    // never block a real order on a notification issue.
  });

  return order;
}
