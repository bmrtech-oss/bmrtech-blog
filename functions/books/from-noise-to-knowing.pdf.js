const PDF_URL = 'https://bmrtech-oss.github.io/antinode-research/FromNoiseToKnowing.pdf';

export async function onRequestGet() {
  const pdfResponse = await fetch(PDF_URL);

  if (!pdfResponse.ok) {
    console.error(`PDF download source returned ${pdfResponse.status}`);
    return new Response('The PDF is temporarily unavailable.', {
      status: 502,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(pdfResponse.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="FromNoiseToKnowing.pdf"',
    },
  });
}
