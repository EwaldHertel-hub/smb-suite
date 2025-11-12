export const currency = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);

export const quoteHtmlTemplate = (data: { number: string; items: any[]; totals: { net: number; vat: number; gross: number } }) => `
<!doctype html><html lang="de"><head>
<meta charset="utf-8">
<title>Angebot ${data.number}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 32px; color: #0b0d12; }
  h1 { margin: 0 0 8px; }
  .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { padding: 8px; border-bottom: 1px solid #eee; text-align: left; }
  tfoot td { font-weight: 600; }
</style>
</head><body>
  <h1>Angebot #${data.number}</h1>
  <div class="card">
    <table>
      <thead><tr><th>Position</th><th>Menge</th><th>Einzelpreis</th><th>Zwischensumme</th></tr></thead>
      <tbody>
        ${data.items.map((it: any) => `<tr><td>${it.title}</td><td>${it.qty} ${it.unit}</td><td>${currency(it.unitPrice)}</td><td>${currency(it.qty*it.unitPrice)}</td></tr>`).join('')}
      </tbody>
      <tfoot>
        <tr><td colspan="3">Netto</td><td>${currency(data.totals.net)}</td></tr>
        <tr><td colspan="3">USt</td><td>${currency(data.totals.vat)}</td></tr>
        <tr><td colspan="3">Gesamt</td><td>${currency(data.totals.gross)}</td></tr>
      </tfoot>
    </table>
  </div>
</body></html>
`;

export const invoiceHtmlTemplate = (data: { number: string; items: any[]; totals: { net: number; vat: number; gross: number } }) => `
<!doctype html><html lang="de"><head>
<meta charset="utf-8">
<title>Rechnung ${data.number}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 32px; color: #0b0d12; }
  h1 { margin: 0 0 8px; }
  .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 16px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th, td { padding: 8px; border-bottom: 1px solid #eee; text-align: left; }
  tfoot td { font-weight: 600; }
</style>
</head><body>
  <h1>Rechnung #${data.number}</h1>
  <div class="card">
    <table>
      <thead><tr><th>Position</th><th>Menge</th><th>Einzelpreis</th><th>Zwischensumme</th></tr></thead>
      <tbody>
        ${data.items.map((it: any) => `<tr><td>${it.title}</td><td>${it.qty} ${it.unit}</td><td>${currency(it.unitPrice)}</td><td>${currency(it.qty*it.unitPrice)}</td></tr>`).join('')}
      </tbody>
      <tfoot>
        <tr><td colspan="3">Netto</td><td>${currency(data.totals.net)}</td></tr>
        <tr><td colspan="3">USt</td><td>${currency(data.totals.vat)}</td></tr>
        <tr><td colspan="3">Gesamt</td><td>${currency(data.totals.gross)}</td></tr>
      </tfoot>
    </table>
  </div>
</body></html>
`;
