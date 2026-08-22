const fs = require('fs');
const path = require('path');

function createPdf() {
  const streamContent = `BT
/F1 20 Tf
50 730 Td
(Anubhav Joshi) Tj
/F1 12 Tf
0 -20 Td
(Backend Engineer, AI Infrastructure | magicalfizz@gmail.com | github.com/anubhav-qt) Tj
0 -20 Td
(Jaipur, India | Portfolio: anubhavqt.vercel.app) Tj
0 -30 Td
/F1 14 Tf
(CORE THESIS & SPECIALIZATION) Tj
/F1 10 Tf
0 -18 Td
(Drawing a hard line between what must be provable and what is allowed to be generated.) Tj
0 -15 Td
(Production backend engineering in Python & TypeScript; asynchronous pipelines, PostgreSQL, pgvector.) Tj
0 -30 Td
/F1 14 Tf
(EDUCATION & ACADEMICS) Tj
/F1 10 Tf
0 -18 Td
(Manipal University Jaipur - B.Tech in Artificial Intelligence & Machine Learning) Tj
0 -15 Td
(CGPA: 9.28 / 10.0 | Academic Merit Scholarship) Tj
0 -30 Td
/F1 14 Tf
(ENGINEERING EXPERIENCE & SYSTEMS) Tj
/F1 11 Tf
0 -20 Td
(Anchorate - Co-Founder & CTO (Early-Stage)) Tj
/F1 10 Tf
0 -15 Td
(- Architected runtime policy interception layer between AI agents and external tools.) Tj
0 -15 Td
(- Built real-time PII redaction, prompt injection detection, and pgvector audit logging.) Tj
/F1 11 Tf
0 -25 Td
(Spoin - Flagship Generation Pipeline & Quota Governor (33 ADRs)) Tj
/F1 10 Tf
0 -15 Td
(- Built asynchronous LangGraph generation engine with CQRS isolation; sub-50ms feed read latency.) Tj
0 -15 Td
(- Designed 2D (key x model) QuotaGovernor across 40+ free-tier API keys, achieving 130+ cards/min.) Tj
0 -15 Td
(- Fixed critical burst rate-limit bugs via ADR-0040 per-cell mutex network serialization.) Tj
/F1 11 Tf
0 -25 Td
(Trotter - Deterministic Quantitative Equity Research Engine) Tj
/F1 10 Tf
0 -15 Td
(- Pure TypeScript financial math engine; Gemini 2.5 Flash strictly for qualitative narrative reasoning.) Tj
/F1 11 Tf
0 -25 Td
(Fraud Vote - Automated Electoral Roll PDF Biometric Audit) Tj
/F1 10 Tf
0 -15 Td
(- OpenCV contour segmentation, Google Cloud Vision OCR (98%+), and 128D deep face encodings.) Tj
/F1 11 Tf
0 -25 Td
(Paribelle - Multi-Tenant E-Commerce Platform (NestJS, TypeORM, Next.js 14)) Tj
/F1 10 Tf
0 -15 Td
(- Pessimistic row locking (SELECT FOR UPDATE) preventing inventory race conditions. 48 onboarded users.) Tj
ET`;

  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  let pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
`;

  // Compute xref
  const lines = pdf.split('\n');
  const offsets = [];
  let pos = 0;
  
  // Find byte offsets of objects
  const objMatches = [...pdf.matchAll(/(\d+ 0 obj)/g)];
  const objOffsets = objMatches.map(m => m.index);

  let xref = `xref
0 6
0000000000 65535 f \r
`;

  for (let i = 0; i < 5; i++) {
    const off = String(objOffsets[i]).padStart(10, '0');
    xref += `${off} 00000 n \r\n`;
  }

  const startxref = Buffer.byteLength(pdf, 'utf-8');
  pdf += `${xref}trailer
<< /Size 6 /Root 1 0 R >>
startxref
${startxref}
%%EOF`;

  const outPath = path.join(__dirname, '..', 'public', 'resume.pdf');
  fs.writeFileSync(outPath, pdf, 'utf-8');
  console.log('Successfully wrote', outPath);
}

createPdf();
