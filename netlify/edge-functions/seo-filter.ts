import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const path = url.pathname;

  // Evita di intercettare file statici (immagini, JS, CSS, ecc.) velocizzando l'esecuzione
  if (path.includes(".") && !path.endsWith(".html")) {
    return;
  }

  // Esegui la richiesta originale per ottenere l'HTML di base (dist/browser/index.html)
  const response = await context.next();
  
  // Modifica solo le risposte di tipo HTML
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();

  // Dizionario SEO per iniezione dinamica lato server (Edge)
  const metaConfig: Record<string, { title: string; description: string; keywords: string; image?: string }> = {
    "/": {
      title: "BOCCONI Srl | Soccorso Stradale, Lavaggio Industriale & Noleggio Massafra",
      description: "BOCCONI COMMERCIO e METALMECCANICA SRL a Massafra (Taranto): leader nei servizi di soccorso stradale 24/7, lavaggio industriale ed igienizzazione veicoli, noleggio auto, furgoni e mezzi da lavoro professionali.",
      keywords: "soccorso stradale massafra, carroattrezzi massafra, lavaggio industriale taranto, noleggio furgoni, noleggio piattaforme aeree, noleggio escavatori, vendita auto, taranto, puglia",
    },
    "/home": {
      title: "BOCCONI Srl | Soccorso Stradale, Lavaggio Industriale & Noleggio Massafra",
      description: "BOCCONI COMMERCIO e METALMECCANICA SRL a Massafra (Taranto): leader nei servizi di soccorso stradale 24/7, lavaggio industriale ed igienizzazione veicoli, noleggio auto, furgoni e mezzi da lavoro professionali.",
      keywords: "soccorso stradale massafra, carroattrezzi massafra, lavaggio industriale taranto, noleggio furgoni, noleggio piattaforme aeree, noleggio escavatori, vendita auto, taranto, puglia",
    },
    "/about": {
      title: "Chi Siamo | BOCCONI COMMERCIO e METALMECCANICA SRL",
      description: "La storia e la missione di Bocconi Srl a Massafra: offriamo competenza tecnica, rapidità e affidabilità nei servizi di soccorso stradale, lavaggio ed igienizzazione interni e noleggio flotta commerciale.",
      keywords: "bocconi srl massafra, chi siamo bocconi, carrozzeria metalmeccanica massafra, vendita auto usate taranto",
    },
    "/services": {
      title: "I Nostri Servizi Professionali | Bocconi Srl Massafra",
      description: "Scopri la gamma completa di attività di Bocconi Srl a Massafra: soccorso stradale h24 rapido, lavaggio auto e mezzi pesanti, noleggio auto, furgoni cargo e veicoli speciali d'opera.",
      keywords: "servizi bocconi srl, soccorso stradale 24 ore, lavaggio camion taranto, noleggio mezzi d'opera massafra",
    },
    "/services/soccorso-stradale": {
      title: "Soccorso Stradale Massafra 24 ore su 24 (Taranto) | Bocconi Srl",
      description: "Carroattrezzi e soccorso stradale h24 rapido e sicuro a Massafra, Taranto e provincia. Intervento immediato per auto, furgoni, camper e veicoli pesanti industriali. Chiamaci subito!",
      keywords: "soccorso stradale massafra, carroattrezzi massafra, assistenza stradale h24, taranto soccorso stradale, recupero veicoli industriali, carroattrezzi taranto",
      image: "assets/images/soccorsoStradale.jpeg"
    },
    "/services/lavaggio": {
      title: "Lavaggio Industriale, Sanificazione & Pulizia Interni | Bocconi Srl",
      description: "Servizio professionale di lavaggio esterni, igienizzazione interni e sanificazione profonda per auto, furgoni e veicoli pesanti industriali a Massafra (Taranto). Risultati impeccabili.",
      keywords: "lavaggio industriale massafra, sanificazione interni auto, lavaggio camion taranto, igienizzazione interni furgoni, pulizia sedili massafra, lavaggio camper",
      image: "assets/images/lavaggio.jpeg"
    },
    "/services/noleggio": {
      title: "Noleggio Auto, Furgoni 9 Posti & Mezzi da Lavoro Massafra | Bocconi Srl",
      description: "Noleggio a breve e lungo termine di auto, furgoni merci, furgoni passeggeri 9 posti, gru, piattaforme aeree, escavatori e muletti a Massafra (Taranto) con pacchetti all-inclusive.",
      keywords: "noleggio furgoni massafra, noleggio auto taranto, furgone 9 posti noleggio, noleggio piattaforme aeree, noleggio gru, noleggio escavatori massafra, noleggio attrezzature",
      image: "assets/images/noleggio.jpeg"
    },
    "/contact": {
      title: "Contatti & Preventivo Gratuito | Bocconi Srl",
      description: "Contatta Bocconi Srl a Massafra per un preventivo di noleggio furgoni o mezzi d'opera, prenotare un lavaggio industriale o richiedere un intervento di soccorso stradale immediato.",
      keywords: "contatti bocconi srl, telefono carroattrezzi massafra, preventivo noleggio furgoni, massafra contatti, email bocconi srl",
    },
    "/annunci": {
      title: "Vendita & Noleggio Veicoli - Catalogo Annunci | Bocconi Srl",
      description: "Sfoglia il catalogo completo degli annunci di Bocconi Srl a Massafra (Taranto) per la vendita o il noleggio di auto, furgoni, veicoli commerciali ed attrezzature industriali d'opera.",
      keywords: "vendita auto usate massafra, furgoni usati taranto, vendita attrezzature industriali, catalogo annunci bocconi, compravendita auto massafra",
    }
  };

  const config = metaConfig[path];
  if (config) {
    const { title, description, keywords, image } = config;
    
    // Costruisci gli URL assoluti
    const imageUrl = image 
      ? `https://bocconicommet.com/${image}` 
      : "https://bocconicommet.com/assets/images/aziendaBocconi.jpeg";

    const canonicalUrl = `https://bocconicommet.com${path === "/" ? "" : path}`;

    // Sostituzione dei meta tag e del titolo tramite Regex precise
    html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${description}">`);
    html = html.replace(/<meta\s+name="keywords"\s+content=".*?"\s*\/?>/i, `<meta name="keywords" content="${keywords}">`);
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}">`);

    // Sostituzione dei tag Open Graph (Social)
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}">`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${description}">`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}">`);
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i, `<meta property="og:image" content="${imageUrl}">`);

    // Sostituzione dei tag Twitter
    html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${title}">`);
    html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${description}">`);
    html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:image" content="${imageUrl}">`);
    html = html.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${canonicalUrl}">`);
  }

  return new Response(html, {
    headers: response.headers,
    status: response.status,
    statusText: response.statusText,
  });
};
