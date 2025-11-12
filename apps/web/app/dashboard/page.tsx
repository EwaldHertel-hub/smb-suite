'use client';
import { useEffect, useState } from 'react';
import KPI from '@/components/KPI';
import SimpleCard from '@/components/SimpleCard';
import RevenueLine from '@/components/charts/RevenueLine';
import OpenAmountBar from '@/components/charts/OpenAmountBar';
import CategoryPie from '@/components/charts/CategoryPie';
import Protected from '@/components/Protected';
import { fetchInvoices, fetchQuotes, fetchRevenueSeries, fetchOpenSeries, fetchTopClients } from '@/lib/dashboard';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ revenue: 0, open: 0, quotes: 0 });
  const [revenueSeries, setRevenueSeries] = useState<{month:string; revenue:number}[]>([]);
  const [openSeries, setOpenSeries] = useState<{month:string; open:number}[]>([]);
  const [topClients, setTopClients] = useState<{name:string; value:number}[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [invoices, quotes, rev, open, top] = await Promise.all([
        fetchInvoices().catch(()=>[]),
        fetchQuotes().catch(()=>[]),
        fetchRevenueSeries().catch(()=>[]),
        fetchOpenSeries().catch(()=>[]),
        fetchTopClients().catch(()=>[]),
      ]);
      const revenue = invoices.filter((i:any)=>i.status==='PAID').reduce((a:number,b:any)=>a+Number(b.total??0),0);
      const openAmt = invoices.reduce((a:number,b:any)=>a+(Number(b.total??0)-Number(b.paidAmount??0)),0);
      setKpis({ revenue, open: openAmt, quotes: (quotes as any[]).length });
      setRevenueSeries(rev);
      setOpenSeries(open);
      setTopClients(top);
      setLoading(false);
    })();
  }, []);

  return (
    <Protected>
      <main className="grid">
        <h1>Dashboard</h1>
        <div className="row">
          <KPI label="Umsatz (bezahlt)" value={`${kpis.revenue.toFixed(2)} €`} />
          <KPI label="Offene Posten" value={`${kpis.open.toFixed(2)} €`} />
          <KPI label="Angebote" value={`${kpis.quotes}`} />
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <SimpleCard title="Umsatz (6 Monate)">
            <RevenueLine data={revenueSeries} />
          </SimpleCard>
          <SimpleCard title="Offene Posten (6 Monate)">
            <OpenAmountBar data={openSeries} />
          </SimpleCard>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <SimpleCard title="Top Kunden (bezahlt)">
            <CategoryPie data={topClients} />
          </SimpleCard>
          <SimpleCard title="Letzte Aktivitäten">
            <ul style={{ margin:0, paddingLeft: 16 }}>
              <li>Rechnung #123 bezahlt</li>
              <li>Angebot #98 gesendet</li>
              <li>Kunde „Acme GmbH“ angelegt</li>
            </ul>
          </SimpleCard>
        </div>
        {loading && <div className="card">Laden…</div>}
      </main>
    </Protected>
  );
}