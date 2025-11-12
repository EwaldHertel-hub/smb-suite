import { api } from "@/lib/api";

export async function fetchInvoices() {
  const { data } = await api.get("/invoices");
  return data as any[];
}

export async function fetchQuotes() {
  const { data } = await api.get("/quotes");
  return data as any[];
}

export async function fetchRevenueSeries(): Promise<
  { month: string; revenue: number }[]
> {
  // If you create a dedicated endpoint, replace this with /reports/revenue?from&to
  const invoices = await fetchInvoices();
  const byMonth: Record<string, number> = {};
  invoices
    .filter((i) => i.status === "PAID")
    .forEach((i) => {
      const d = new Date(i.issueDate ?? i.createdAt ?? Date.now());
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      byMonth[key] = (byMonth[key] ?? 0) + Number(i.total ?? 0);
    });
  return Object.entries(byMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([k, v]) => {
      const [y, m] = k.split("-");
      return { month: `${m}.${y.slice(2)}`, revenue: v };
    });
}

export async function fetchOpenSeries(): Promise<
  { month: string; open: number }[]
> {
  const invoices = await fetchInvoices();
  const byMonth: Record<string, number> = {};
  invoices.forEach((i) => {
    const d = new Date(i.dueDate ?? i.issueDate ?? i.createdAt ?? Date.now());
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const open = Number(i.total ?? 0) - Number(i.paidAmount ?? 0);
    if (open > 0) byMonth[key] = (byMonth[key] ?? 0) + open;
  });
  return Object.entries(byMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([k, v]) => {
      const [y, m] = k.split("-");
      return { month: `${m}.${y.slice(2)}`, open: v };
    });
}

export async function fetchTopClients(): Promise<
  { name: string; value: number }[]
> {
  const invoices = await fetchInvoices();
  const byClient: Record<string, number> = {};
  invoices
    .filter((i) => i.status === "PAID")
    .forEach((i) => {
      byClient[i.clientId] = (byClient[i.clientId] ?? 0) + Number(i.total ?? 0);
    });
  // This example returns top 5 by value; the name lookup would require /clients; simplified here:
  return Object.entries(byClient)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, v], i) => ({ name: `Kunde ${i + 1}`, value: v }));
}
