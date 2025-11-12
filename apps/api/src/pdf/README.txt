Include PdfModule in AppModule and call registerPdfWorker in main.ts after app creation.
Endpoints:
POST /pdf/quote/:id   body: { html?: string, emailTo?: string }
POST /pdf/invoice/:id body: { html?: string, emailTo?: string }
Outputs written to ./storage/pdfs
