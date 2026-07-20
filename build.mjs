import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { GUIDES, LOCALES, SERVICES, SITE, SOURCE_LINKS, UI } from "./site-data.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const out = join(root, "dist");

const GA_MEASUREMENT_ID = "G-B7MZ6GM28X";
const GA_SNIPPET = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_MEASUREMENT_ID}');
</script>`;

const META_PIXEL_ID = "1273004129221570";
const META_PIXEL_SNIPPET = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->`;
const META_PIXEL_NOSCRIPT = `<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" alt="" /></noscript>`;

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
}[character]));
const json = (value) => JSON.stringify(value).replace(/</g, "\\u003c");
const siteNameHtml = escapeHtml(SITE.name);
const abs = (locale, slug = "") => `${SITE.origin}/${locale}/${slug}`.replace(/\/$/, slug ? "" : "/");
const href = (locale, slug = "") => `/${locale}/${slug}`.replace(/\/$/, slug ? "" : "/");
const link = (url, label, className = "") => `<a${className ? ` class="${className}"` : ""} href="${url}">${escapeHtml(label)}</a>`;
const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
const pageTitle = (title) => `${title} | ${SITE.name}`;
const titleFor = (item, locale) => item.title[locale];

function alternateLinks(slug = "") {
  const links = Object.keys(LOCALES).map((locale) => `<link rel="alternate" hreflang="${LOCALES[locale].html}" href="${abs(locale, slug)}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${abs("pl", slug)}">`);
  return links.join("\n  ");
}

function languageMenu(locale, slug) {
  return `<div class="lang-control">
    <button class="lang-toggle-btn" type="button" aria-label="${escapeHtml(UI[locale].language)}" aria-haspopup="true" aria-expanded="false" aria-controls="lang-menu"><span aria-hidden="true">◎</span><span>${LOCALES[locale].label}</span></button>
    <div class="lang-menu" id="lang-menu" role="menu" hidden>${Object.entries(LOCALES).map(([code, data]) => `<a class="lang-item${code === locale ? " active" : ""}" href="${href(code, slug)}" lang="${data.html}" hreflang="${data.html}" role="menuitem">${data.label} · ${escapeHtml(data.name)}</a>`).join("")}</div>
  </div>`;
}

function serviceMenu(locale) {
  const ui = UI[locale];
  const menuServices = SERVICES.filter(({ slug }) => !["dla-pracodawcow", "mos"].includes(slug)).slice(0, 8);
  return `<details class="nav-services">
    <summary>${escapeHtml(ui.services)}</summary>
    <div class="service-menu">${menuServices.map((service) => link(href(locale, service.slug), titleFor(service, locale))).join("")}</div>
  </details>`;
}

function header(locale, slug = "", active = "") {
  const ui = UI[locale];
  const navItems = [
    ["home", href(locale), ui.home],
    ["employers", href(locale, "dla-pracodawcow"), ui.employers],
    ["mos", href(locale, "mos"), "MOS"],
    ["guides", href(locale, "poradniki"), ui.guides],
    ["faq", href(locale, "faq"), ui.faq],
    ["contact", href(locale, "kontakt"), ui.contact]
  ];
  return `<a class="skip-link" href="#main">${escapeHtml(ui.skip)}</a>
  <header class="main-header"><div class="container nav-bar">
    <a class="brand-logo" href="${href(locale)}" aria-label="${escapeHtml(`${SITE.name} — ${ui.home}`)}"><img src="/assets/logo.svg" width="250" height="54" alt="${siteNameHtml}"></a>
    <nav class="main-nav" id="main-nav" aria-label="${escapeHtml(ui.nav)}">
      ${link(navItems[0][1], navItems[0][2], `nav-item-link${active === navItems[0][0] ? " active" : ""}`)}
      ${serviceMenu(locale)}
      ${navItems.slice(1).map(([key, url, label]) => link(url, label, `nav-item-link${active === key ? " active" : ""}`)).join("")}
    </nav>
    <div class="header-actions"><div class="header-phone-stack"><a class="header-phone" href="tel:${SITE.phoneHref}">${SITE.phone}</a><a class="header-phone header-phone-secondary" href="tel:${SITE.phoneAltHref}">${SITE.phoneAlt}</a></div><div class="header-social"><a href="${SITE.instagram}" target="_blank" rel="noopener noreferrer" class="header-social-icon" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a><a href="${SITE.facebook}" target="_blank" rel="noopener noreferrer" class="header-social-icon" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a></div>${languageMenu(locale, slug)}<button class="mobile-nav-toggle" type="button" aria-label="${escapeHtml(ui.openMenu)}" data-open-label="${escapeHtml(ui.openMenu)}" data-close-label="${escapeHtml(ui.closeMenu)}" aria-controls="main-nav" aria-expanded="false"><span></span><span></span><span></span></button></div>
  </div></header>`;
}

function footer(locale) {
  const ui = UI[locale];
  const serviceLinks = SERVICES.slice(0, 7).map((service) => link(href(locale, service.slug), titleFor(service, locale))).join("");
  return `<footer class="site-footer"><div class="container footer-grid">
    <div class="footer-brand"><img src="/assets/logo.svg" width="230" height="50" alt="${siteNameHtml}"><p>${escapeHtml(ui.footerLead)}</p><address>${link(`tel:${SITE.phoneHref}`, SITE.phone)}${link(`tel:${SITE.phoneAltHref}`, `${SITE.phoneAlt} · Viber / WhatsApp`)}${link(`mailto:${SITE.email}`, SITE.email)}<span>${SITE.address}</span></address><div class="footer-social-links"><a href="${SITE.instagram}" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg><span>Instagram</span></a><a href="${SITE.facebook}" target="_blank" rel="noopener noreferrer" class="footer-social-btn" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg><span>Facebook</span></a></div></div>
    <div><h2>${escapeHtml(ui.sitemap)}</h2><nav class="footer-links" aria-label="${escapeHtml(ui.sitemap)}">${serviceLinks}${link(href(locale, "dla-pracodawcow"), ui.employers)}${link(href(locale, "mos"), "MOS")}${link(href(locale, "karta-cukr"), titleFor(SERVICES.find(({ slug }) => slug === "karta-cukr"), locale))}</nav></div>
    <div><h2>${escapeHtml(ui.legal)}</h2><nav class="footer-links">${link(href(locale, "poradniki"), ui.guides)}${link(href(locale, "faq"), ui.faq)}${link(href(locale, "kontakt"), ui.contact)}${link(href(locale, "polityka-prywatnosci"), ui.privacy)}${link(href(locale, "regulamin"), ui.terms)}${link(href(locale, "cookies"), ui.cookies)}</nav></div>
    <p class="footer-bottom">© 2026 ${siteNameHtml} · ${escapeHtml(ui.updated)}: ${SITE.updated}</p>
  </div></footer>`;
}

function baseSchema(locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": ["Organization", "LocalBusiness", "LegalService"], "@id": `${SITE.origin}/#organization`, name: SITE.name, url: SITE.origin, email: SITE.email, telephone: SITE.phoneHref, sameAs: [SITE.instagram, SITE.facebook], address: { "@type": "PostalAddress", streetAddress: "Gimnazjalna 2A/213", postalCode: "85-007", addressLocality: "Bydgoszcz", addressRegion: "kujawsko-pomorskie", addressCountry: "PL" }, areaServed: { "@type": "Country", name: "Poland" }, availableLanguage: ["pl", "uk", "ru", "en"] },
      { "@type": "WebSite", "@id": `${SITE.origin}/#website`, url: SITE.origin, name: SITE.name, inLanguage: LOCALES[locale].html, publisher: { "@id": `${SITE.origin}/#organization` } }
    ]
  };
}

function layout({ locale, slug = "", title, description, active, main, schema = [], robots = "index,follow" }) {
  const canonical = abs(locale, slug);
  const graph = baseSchema(locale)["@graph"].concat(schema);
  return `<!doctype html>
<html lang="${LOCALES[locale].html}">
<head>
  ${GA_SNIPPET}
  ${META_PIXEL_SNIPPET}
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(pageTitle(title))}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${robots}">
  <meta name="theme-color" content="#140d08">
  <link rel="canonical" href="${canonical}">
  ${alternateLinks(slug)}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${siteNameHtml}">
  <meta property="og:title" content="${escapeHtml(pageTitle(title))}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${LOCALES[locale].og}">
  <meta property="og:image" content="${SITE.origin}/assets/social-card.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(pageTitle(title))}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SITE.origin}/assets/social-card.svg">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": graph })}</script>
  <script src="/script.js" defer></script>
</head>
<body data-locale="${locale}">${META_PIXEL_NOSCRIPT}${header(locale, slug, active)}<main id="main">${main}</main>${footer(locale)}</body>
</html>`;
}

function breadcrumb(locale, items) {
  const ui = UI[locale];
  const all = [[ui.home, href(locale)], ...items];
  return {
    html: `<nav class="breadcrumbs container" aria-label="${escapeHtml(ui.breadcrumbs)}"><ol>${all.map(([label, url], index) => `<li>${index === all.length - 1 ? `<span aria-current="page">${escapeHtml(label)}</span>` : link(url, label)}</li>`).join("")}</ol></nav>`,
    schema: { "@type": "BreadcrumbList", itemListElement: all.map(([label, url], index) => ({ "@type": "ListItem", position: index + 1, name: label, item: `${SITE.origin}${url}` })) }
  };
}

function faqData(locale, service) {
  const title = titleFor(service, locale);
  const subject = title.startsWith("MOS") || title.startsWith("CUKR") ? title : `${title.charAt(0).toLowerCase()}${title.slice(1)}`;
  const questions = {
    pl: [[`Czy ${subject} jest odpowiednią procedurą w mojej sytuacji?`, `To zależy od obywatelstwa, obecnego tytułu pobytowego i udokumentowanych okoliczności. Przed wyborem procedury porównujemy dostępne podstawy.`], ["Czy mogę złożyć niekompletny wniosek i uzupełnić go później?", "Niektóre braki można uzupełnić po wezwaniu, ale braki formalne mogą prowadzić do pozostawienia wniosku bez rozpoznania. Bezpieczniej skontrolować komplet przed złożeniem."], ["Czy pełnomocnik może wykonać wszystkie czynności za mnie?", "Nie. Podpis wnioskodawcy, odciski palców, okazanie dokumentu podróży lub inne czynności osobiste mogą wymagać obecności klienta."], ["Ile trwa postępowanie?", "Nie podajemy gwarantowanego terminu. Czas zależy od kompletności akt, rodzaju sprawy i obciążenia właściwego organu."], ["Czy poprawne dokumenty gwarantują zezwolenie?", "Nie. Organ indywidualnie ocenia fakty i dowody. Dobra dokumentacja ogranicza ryzyko formalne, ale nie przesądza decyzji."], ["Co zrobić po otrzymaniu pisma z urzędu?", "Zapisz datę doręczenia, przeczytaj pouczenie i nie odkładaj odpowiedzi. Termin oraz zakres wezwania trzeba ocenić na podstawie konkretnego pisma."]],
    ua: [[`Чи підходить процедура «${title}» у моїй ситуації?`, "Це залежить від громадянства, поточного статусу та підтверджених обставин. Перед вибором процедури порівнюємо доступні підстави."], ["Чи можна подати неповну заяву й доповнити її пізніше?", "Деякі недоліки можна усунути після вимоги, але формальні недоліки можуть залишити заяву без розгляду. Безпечніше перевірити комплект до подання."], ["Чи може представник виконати всі дії за мене?", "Ні. Підпис заявника, відбитки пальців, пред’явлення паспорта та інші особисті дії можуть вимагати присутності клієнта."], ["Скільки триває розгляд?", "Ми не гарантуємо строк. Він залежить від повноти матеріалів, виду справи та завантаження органу."], ["Чи правильні документи гарантують дозвіл?", "Ні. Орган індивідуально оцінює факти й докази. Якісна підготовка зменшує формальні ризики, але не визначає рішення."], ["Що робити після отримання листа з управління?", "Запишіть дату вручення, прочитайте роз’яснення та не відкладайте відповідь. Строк і зміст треба оцінювати за конкретним листом."]],
    ru: [[`Подходит ли процедура «${title}» в моей ситуации?`, "Это зависит от гражданства, текущего статуса и подтверждённых обстоятельств. До выбора процедуры сравниваем доступные основания."], ["Можно ли подать неполное заявление и дополнить позже?", "Некоторые недостатки устраняются после требования, но формальные пробелы могут оставить заявление без рассмотрения. Комплект лучше проверить заранее."], ["Может ли представитель выполнить все действия за меня?", "Нет. Подпись заявителя, отпечатки пальцев, предъявление паспорта и другие личные действия могут требовать присутствия клиента."], ["Сколько длится рассмотрение?", "Мы не гарантируем срок. Он зависит от полноты дела, типа процедуры и нагрузки органа."], ["Правильные документы гарантируют разрешение?", "Нет. Орган индивидуально оценивает факты и доказательства. Подготовка снижает формальные риски, но не определяет решение."], ["Что делать после письма из управления?", "Запишите дату вручения, прочитайте разъяснение и не откладывайте ответ. Срок и объём нужно оценивать по конкретному письму."]],
    en: [[`Is ${subject} the right procedure for me?`, "It depends on nationality, current status and documented circumstances. We compare the available legal routes before choosing one."], ["Can I file an incomplete application and supplement it later?", "Some gaps can be cured after a request, but formal deficiencies may leave the application unexamined. A pre-filing review is safer."], ["Can a representative do everything for me?", "No. The applicant's signature, fingerprints, travel-document presentation and other personal acts may require the client."], ["How long does the procedure take?", "We do not guarantee a timeframe. Duration depends on completeness, case type and the authority's workload."], ["Do correct documents guarantee a permit?", "No. The authority assesses facts and evidence individually. Careful preparation reduces formal risk but does not determine the outcome."], ["What should I do after receiving an authority letter?", "Record the service date, read the instructions and do not delay. The deadline and scope must be assessed from the actual letter."]]
  };
  return questions[locale];
}

function faqBlock(locale, faqs) {
  return `<div class="faq-list">${faqs.map(([question, answer], index) => `<article class="faq-item"><h3><button type="button" aria-expanded="false" aria-controls="faq-${index}"><span>${escapeHtml(question)}</span><span aria-hidden="true">+</span></button></h3><div class="faq-panel" id="faq-${index}" aria-hidden="true"><div class="faq-panel-inner"><p>${escapeHtml(answer)}</p></div></div></article>`).join("")}</div>`;
}

function contactForm(locale) {
  const ui = UI[locale];
  return `<form class="contact-form" action="${SITE.formEndpoint}" method="post" data-contact-form novalidate>
    <h2>${escapeHtml(ui.formTitle)}</h2><div class="form-grid">
      <input type="hidden" name="access_key" value="29f59de7-c4a0-4fb7-b22f-3964574dfa44">
      <input type="checkbox" name="botcheck" class="hidden" style="display: none;">
      <label><span>${escapeHtml(ui.name)} *</span><input name="name" autocomplete="name" minlength="2" required></label>
      <label><span>${escapeHtml(ui.phone)} *</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel" minlength="7" required></label>
      <label><span>${escapeHtml(ui.email)} *</span><input type="email" name="email" autocomplete="email" required></label>
      <label><span>${escapeHtml(ui.service)} *</span><select name="service" required><option value="" selected disabled>${escapeHtml(ui.choose)}</option>${SERVICES.map((service) => `<option value="${service.slug}">${escapeHtml(titleFor(service, locale))}</option>`).join("")}</select></label>
      <label><span>${escapeHtml(ui.preferredLanguage)} *</span><select name="preferred_language" autocomplete="language" required>${Object.entries(LOCALES).map(([code, data]) => `<option value="${code}"${code === locale ? " selected" : ""}>${escapeHtml(data.name)}</option>`).join("")}</select></label>
    </div>
    <label><span>${escapeHtml(ui.message)} *</span><textarea name="message" rows="5" minlength="20" required></textarea></label>
    <input type="hidden" name="page" value="${href(locale, "kontakt")}">
    <label class="check-row"><input type="checkbox" name="privacy_acknowledgement" required><span>${escapeHtml(ui.consent)}</span></label>
    <button class="btn-primary" type="submit" data-idle-label="${escapeHtml(ui.submit)}" data-sending-label="${escapeHtml(ui.sending)}">${escapeHtml(ui.submit)}</button>
    <p class="form-status" data-form-status data-required="${escapeHtml(ui.required)}" data-success="${escapeHtml(ui.success)}" data-error="${escapeHtml(ui.error)}" role="status" aria-live="polite"></p>
    <small>${escapeHtml(ui.formNotice)}</small>
  </form>`;
}

function homePage(locale) {
  const ui = UI[locale];
  const featured = SERVICES.slice(0, 6);
  const temporaryService = SERVICES.find(({ slug }) => slug === "pobyt-czasowy-i-praca");
  const residentService = SERVICES.find(({ slug }) => slug === "rezydent-dlugoterminowy-ue");
  const appealService = SERVICES.find(({ slug }) => slug === "odwolanie-od-decyzji");
  const homeFaq = faqData(locale, SERVICES[0]).slice(0, 4);
  const schemaFaq = { "@type": "FAQPage", mainEntity: homeFaq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  const main = `<section class="hero-wrapper"><div class="container hero-layout"><div><p class="eyebrow">${escapeHtml(ui.heroTag)}</p><h1 class="hero-main-title">${escapeHtml(ui.heroTitle)}<strong>${escapeHtml(ui.heroAccent)}</strong></h1><p class="hero-lead-text">${escapeHtml(ui.heroText)}</p><div class="hero-buttons">${link(href(locale, "kontakt"), ui.consult, "btn-primary")}${link("#services", ui.seeServices, "btn-secondary")}</div><ul class="benefit-list">${ui.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join("")}</ul></div>
    <aside class="qualification-card"><p class="eyebrow">${escapeHtml(ui.checkTag)}</p><h2>${escapeHtml(ui.checkTitle)}</h2><label for="calc-goal">${escapeHtml(ui.matter)}</label><select id="calc-goal"><option value="temporary">${escapeHtml(titleFor(temporaryService, locale))}</option><option value="resident">${escapeHtml(titleFor(residentService, locale))}</option><option value="appeal">${escapeHtml(titleFor(appealService, locale))}</option></select><label for="calc-years">${escapeHtml(ui.stayYears)}: <output id="calc-years-value">3</output></label><input id="calc-years" type="range" min="0" max="10" value="3"><label class="check-row"><input id="calc-b1" type="checkbox"><span>${escapeHtml(ui.b1)}</span></label><div class="qualification-result"><strong>${escapeHtml(ui.result)}</strong><span id="qualification-result"></span></div><small>${escapeHtml(ui.checkDisclaimer)}</small></aside></div></section>
    <section class="section-padding" id="services"><div class="container"><header class="section-header-center"><p class="eyebrow">${escapeHtml(ui.sectionServices)}</p><h2>${escapeHtml(ui.servicesTitle)}</h2><p>${escapeHtml(ui.servicesLead)}</p></header><div class="services-grid">${featured.map((service, index) => `<article class="service-card"><span class="card-number">${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(titleFor(service, locale))}</h3><p>${escapeHtml(service.summary[locale])}</p>${link(href(locale, service.slug), ui.learnMore)}</article>`).join("")}</div></div></section>
    <section class="section-padding section-bordered"><div class="container split-feature"><div><p class="eyebrow">${escapeHtml(ui.sectionEmployers)}</p><h2>${escapeHtml(ui.employersTitle)}</h2><p>${escapeHtml(ui.employersText)}</p>${link(href(locale, "dla-pracodawcow"), ui.learnMore, "btn-secondary")}</div><div><p class="eyebrow">B2B</p>${list(SERVICES.find(({ slug }) => slug === "dla-pracodawcow").extra[locale].split(". ").filter(Boolean))}</div></div></section>
    <section class="section-padding"><div class="container split-feature"><div><p class="eyebrow">${escapeHtml(ui.whyTag)}</p><h2>${escapeHtml(ui.whyTitle)}</h2></div><ul class="check-list">${ui.why.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div></section>
    <section class="section-padding"><div class="container"><header class="section-header-center"><p class="eyebrow">${escapeHtml(ui.processTag)}</p><h2>${escapeHtml(ui.processTitle)}</h2></header><ol class="process-grid">${ui.steps.map(([name, text], index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><h3>${escapeHtml(name)}</h3><p>${escapeHtml(text)}</p></li>`).join("")}</ol></div></section>
    <section class="section-padding section-bordered"><div class="container"><header class="section-header-center"><p class="eyebrow">${escapeHtml(ui.teamTag)}</p><h2>${escapeHtml(ui.teamTitle)}</h2><p>${escapeHtml(ui.teamText)}</p></header><div class="founders-grid"><article class="founder-card"><span class="founder-avatar">VB</span><div><h3>Bereza Vladyslav</h3><p class="founder-role">${escapeHtml(ui.founder1)}</p></div></article><article class="founder-card"><span class="founder-avatar">IB</span><div><h3>Bigun Ievgenii</h3><p class="founder-role">${escapeHtml(ui.founder2)}</p></div></article></div></div></section>
    <section class="section-padding"><div class="container"><div class="section-heading-row"><h2>${escapeHtml(ui.popularGuides)}</h2>${link(href(locale, "poradniki"), ui.viewAll)}</div><div class="guide-grid">${GUIDES.slice(0, 3).map((guide) => `<article class="guide-card"><h3>${escapeHtml(titleFor(guide, locale))}</h3>${link(href(locale, `poradniki/${guide.slug}`), ui.learnMore)}</article>`).join("")}</div></div></section>
    <section class="section-padding section-bordered"><div class="container faq-container"><header class="section-header-center"><h2>${escapeHtml(ui.faqTitle)}</h2></header>${faqBlock(locale, homeFaq)}<p class="center-action">${link(href(locale, "faq"), ui.faq, "btn-secondary")}</p></div></section>
    <section class="section-padding"><div class="container contact-layout"><div class="contact-card"><p class="eyebrow">${escapeHtml(ui.contact)}</p><h2>${escapeHtml(ui.contactTitle)}</h2><p>${escapeHtml(ui.contactLead)}</p><address>${link(`tel:${SITE.phoneHref}`, SITE.phone)}${link(`tel:${SITE.phoneAltHref}`, `${SITE.phoneAlt} · Viber / WhatsApp`)}${link(`mailto:${SITE.email}`, SITE.email)}<span>${SITE.address}</span></address></div>${contactForm(locale)}</div></section>`;
  const description = locale === "pl" ? "Legalizacja pobytu i pracy w Polsce. Pomoc dla cudzoziemców i pracodawców w Bydgoszczy i całej Polsce — dokumenty, MOS, odwołania." : ui.heroText;
  return layout({ locale, title: ui.heroTitle, description, active: "home", main, schema: [schemaFaq] });
}

function specialisedServiceContent(locale, slug) {
  const content = {
    "dla-pracodawcow": {
      pl: ["Analiza dokumentów wpływających na możliwość legalnego wykonywania pracy", "Dokumenty pobytowe pracownika i terminy ich ważności", "Wsparcie przy pobycie czasowym i pracy", "Kontrola umów, wynagrodzenia i spójności dokumentów", "Obowiązki informacyjne i archiwizacja dokumentów", "Audyty teczek cudzoziemców i plan naprawczy", "Korespondencja oraz reprezentacja w granicach pełnomocnictwa", "Zarządzanie ryzykiem przy zmianie stanowiska, wymiaru czasu lub pracodawcy"],
      ua: ["Аналіз документів, що впливають на можливість легальної праці", "Документи на перебування й строки їх чинності", "Підтримка у справах тимчасового перебування та праці", "Перевірка договорів, оплати й узгодженості документів", "Інформаційні обов’язки та архівування документів", "Аудит особових справ іноземців і план виправлень", "Листування та представництво в межах довіреності", "Управління ризиком при зміні посади, часу праці чи роботодавця"],
      ru: ["Анализ документов, влияющих на возможность легальной работы", "Документы на пребывание и сроки их действия", "Поддержка по временному пребыванию и работе", "Проверка договоров, оплаты и согласованности документов", "Уведомительные обязанности и хранение документов", "Аудит дел иностранных сотрудников и план исправлений", "Переписка и представительство в пределах доверенности", "Управление рисками при смене должности, времени работы или работодателя"],
      en: ["Review of documents affecting the right to work lawfully", "Residence documents and expiry-date controls", "Temporary residence and work support", "Checks of contracts, pay and document consistency", "Notification duties and document retention", "Foreign-employee file audits and remediation plans", "Correspondence and representation within a power of attorney", "Risk management for changes in role, hours or employer"]
    },
    mos: {
      pl: ["Utworzenie i uwierzytelnienie indywidualnego konta", "Wypełnienie formularza i dołączenie dokumentów w MOS", "Kontrola podpisu elektronicznego, jeżeli jest wymagany", "Osobiste stawiennictwo przy odciskach palców i innych czynnościach osobistych", "Sprawdzenie, czy elektroniczne wysłanie kończy wymagany etap w konkretnej procedurze"],
      ua: ["Створення й автентифікація особистого облікового запису", "Заповнення формуляра та додавання документів у MOS", "Перевірка електронного підпису, якщо він потрібен", "Особиста присутність для відбитків пальців та інших особистих дій", "Перевірка, чи онлайн-відправлення завершує потрібний етап конкретної процедури"],
      ru: ["Создание и аутентификация личного аккаунта", "Заполнение формуляра и добавление документов в MOS", "Проверка электронной подписи, если она нужна", "Личное присутствие для отпечатков пальцев и других личных действий", "Проверка, завершает ли онлайн-отправка нужный этап конкретной процедуры"],
      en: ["Create and authenticate an individual account", "Complete the form and add documents in MOS", "Check the electronic signature where required", "Attend personally for fingerprints and other personal acts", "Confirm whether electronic sending completes the required step in the specific procedure"]
    },
    "karta-cukr": {
      pl: ["Weryfikacja tożsamości i aktualnego statusu PESEL UKR", "Sprawdzenie ciągłości wymaganego statusu", "Kontrola aktualnego sposobu złożenia w MOS", "Przygotowanie dokumentów i danych przed wysłaniem", "Monitorowanie oficjalnych komunikatów, ponieważ procedura jest nowa"],
      ua: ["Перевірка особи й актуального статусу PESEL UKR", "Перевірка безперервності потрібного статусу", "Перевірка актуального способу подання в MOS", "Підготовка документів і даних до відправлення", "Моніторинг офіційних повідомлень, оскільки процедура нова"],
      ru: ["Проверка личности и актуального статуса PESEL UKR", "Проверка непрерывности требуемого статуса", "Проверка актуального способа подачи в MOS", "Подготовка документов и данных до отправки", "Мониторинг официальных сообщений, поскольку процедура новая"],
      en: ["Verify identity and current PESEL UKR status", "Check continuity of the required status", "Confirm the current MOS filing method", "Prepare documents and data before sending", "Monitor official notices because this is a new procedure"]
    }
  }[slug];
  return content ? list(content[locale]) : "";
}

function servicePage(locale, service) {
  const ui = UI[locale];
  const title = titleFor(service, locale);
  const crumbs = breadcrumb(locale, [[ui.services, `${href(locale)}#services`], [title, href(locale, service.slug)]]);
  const faqs = faqData(locale, service);
  const source = SOURCE_LINKS[service.source] || SOURCE_LINKS.mos;
  const related = SERVICES.filter((item) => item.slug !== service.slug).slice(0, 3);
  const main = `${crumbs.html}<article><header class="page-hero"><div class="container narrow"><p class="eyebrow">${escapeHtml(ui.sectionServices)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(service.summary[locale])}</p><div class="hero-buttons">${link(href(locale, "kontakt"), ui.consult, "btn-primary")}${link(`tel:${SITE.phoneHref}`, SITE.phone, "btn-secondary")}</div></div></header>
    <div class="container article-layout"><div class="article-content">
      <section><h2>${escapeHtml(ui.serviceSections.audience)}</h2><p>${escapeHtml(service.audience[locale])}</p></section>
      <section><h2>${escapeHtml(ui.serviceSections.conditions)}</h2>${list(ui.commonConditions)}</section>
      <section><h2>${escapeHtml(ui.serviceSections.documents)}</h2>${list(ui.commonDocuments)}</section>
      <section><h2>${escapeHtml(ui.serviceSections.steps)}</h2><ol>${ui.commonSteps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section>
      <section><h2>${escapeHtml(ui.serviceSections.mistakes)}</h2>${list(ui.commonMistakes)}</section>
      <section><h2>${escapeHtml(ui.serviceSections.timing)}</h2><p>${escapeHtml(ui.timingText)}</p><aside class="notice">${escapeHtml(ui.noGuarantee)}</aside></section>
      <section><h2>${escapeHtml(ui.serviceSections.extra)}</h2><p>${escapeHtml(service.extra[locale])}</p>${specialisedServiceContent(locale, service.slug)}</section>
      <section><h2>${escapeHtml(ui.serviceSections.faq)}</h2>${faqBlock(locale, faqs)}</section>
      <section class="sources"><h2>${escapeHtml(ui.sources)}</h2><p>${link(source[1], source[0])}</p><p class="update-line">${escapeHtml(ui.updated)}: ${SITE.updated}</p><p>${escapeHtml(ui.disclaimer)}</p></section>
    </div><aside class="article-aside"><div class="sticky-card"><h2>${escapeHtml(ui.related)}</h2>${related.map((item) => link(href(locale, item.slug), titleFor(item, locale))).join("")}${link(href(locale, "kontakt"), ui.consult, "btn-primary")}</div></aside></div></article>`;
  const serviceSchema = { "@type": "Service", name: title, description: service.summary[locale], provider: { "@id": `${SITE.origin}/#organization` }, areaServed: "Poland", url: abs(locale, service.slug) };
  const faqSchema = { "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  return layout({ locale, slug: service.slug, title, description: service.summary[locale], active: service.slug === "dla-pracodawcow" ? "employers" : service.slug === "mos" ? "mos" : "services", main, schema: [crumbs.schema, serviceSchema, faqSchema] });
}

function guidesIndex(locale) {
  const ui = UI[locale];
  const title = ui.guides;
  const crumbs = breadcrumb(locale, [[title, href(locale, "poradniki")]]);
  const intro = { pl: "Praktyczne materiały o pobycie, pracy i postępowaniu administracyjnym. Każdy artykuł wskazuje ryzyka i oficjalne źródła.", ua: "Практичні матеріали про перебування, працю та адміністративні процедури. Кожна стаття вказує ризики й офіційні джерела.", ru: "Практические материалы о пребывании, работе и административных процедурах. В каждой статье указаны риски и официальные источники.", en: "Practical materials on residence, work and administrative proceedings, with risks and official sources." }[locale];
  const main = `${crumbs.html}<header class="page-hero"><div class="container narrow"><p class="eyebrow">${escapeHtml(ui.guides)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(intro)}</p></div></header><section class="section-padding"><div class="container guide-grid">${GUIDES.map((guide) => `<article class="guide-card"><p class="eyebrow">${SITE.updated}</p><h2>${escapeHtml(titleFor(guide, locale))}</h2><p>${escapeHtml(ui.disclaimer)}</p>${link(href(locale, `poradniki/${guide.slug}`), ui.learnMore)}</article>`).join("")}</div></section>`;
  return layout({ locale, slug: "poradniki", title, description: intro, active: "guides", main, schema: [crumbs.schema] });
}

function guidePage(locale, guide, index) {
  const ui = UI[locale];
  const title = titleFor(guide, locale);
  const slug = `poradniki/${guide.slug}`;
  const crumbs = breadcrumb(locale, [[ui.guides, href(locale, "poradniki")], [title, href(locale, slug)]]);
  const relatedSlug = ["mos", "pobyt-czasowy-i-praca", "pobyt-czasowy-i-praca", "rezydent-dlugoterminowy-ue", "wezwanie-z-urzedu", "pobyt-staly", "legalizacja-zatrudnienia", "karta-pobytu-bydgoszcz"][index];
  const relatedService = SERVICES.find(({ slug: serviceSlug }) => serviceSlug === relatedSlug);
  const meta = {
    pl: { contents: "Spis treści", facts: "Najważniejszy kontekst", author: "Autor", reviewer: "Weryfikacja redakcyjna" },
    ua: { contents: "Зміст", facts: "Найважливіший контекст", author: "Автор", reviewer: "Редакційна перевірка" },
    ru: { contents: "Содержание", facts: "Ключевой контекст", author: "Автор", reviewer: "Редакционная проверка" },
    en: { contents: "Contents", facts: "Key context", author: "Author", reviewer: "Editorial review" }
  }[locale];
  const intros = {
    pl: `Ten poradnik porządkuje temat „${title}”: dokumenty, terminy, typowe ryzyka i działania, które warto sprawdzić przed kontaktem z urzędem.`,
    ua: `Цей порадник упорядковує тему «${title}»: документи, строки, типові ризики й дії, які варто перевірити до контакту з управлінням.`,
    ru: `Это руководство систематизирует тему «${title}»: документы, сроки, типичные риски и действия до обращения в управление.`,
    en: `This guide organises the topic “${title}”: documents, deadlines, common risks and checks to make before contacting the authority.`
  };
  const sections = {
    pl: [["Najpierw ustal podstawę", "Nie zaczynaj od formularza. Najpierw sprawdź status pobytowy, cel działania, właściwy organ i termin."], ["Przygotuj spójne dowody", "Dane w formularzu, paszporcie, umowie, załącznikach i wcześniejszej korespondencji powinny być zgodne oraz aktualne."], ["Kontroluj doręczenia", "Zachowuj potwierdzenia nadania i odbioru. Data skutecznego doręczenia często rozpoczyna bieg terminu."], ["Sprawdź po złożeniu", "Monitoruj korespondencję, odpowiadaj na wezwania i aktualizuj organ, jeżeli przepisy nakładają taki obowiązek."]],
    ua: [["Спочатку визначте підставу", "Не починайте з формуляра. Спершу перевірте статус, мету, компетентний орган і строк."], ["Підготуйте узгоджені докази", "Дані у формулярі, паспорті, договорі, додатках і попередньому листуванні мають бути актуальними та несуперечливими."], ["Контролюйте вручення", "Зберігайте підтвердження відправлення й отримання. Дата належного вручення часто запускає строк."], ["Перевіряйте справу після подання", "Слідкуйте за листуванням, відповідайте на вимоги та повідомляйте орган, якщо закон цього вимагає."]],
    ru: [["Сначала определите основание", "Не начинайте с формуляра. Сначала проверьте статус, цель, компетентный орган и срок."], ["Подготовьте согласованные доказательства", "Данные в формуляре, паспорте, договоре, приложениях и переписке должны быть актуальными и непротиворечивыми."], ["Контролируйте вручение", "Храните подтверждения отправки и получения. Дата надлежащего вручения часто запускает срок."], ["Проверяйте дело после подачи", "Следите за перепиской, отвечайте на требования и уведомляйте орган, если это обязательно."]],
    en: [["Establish the legal basis first", "Do not begin with the form. First check current status, objective, competent authority and deadline."], ["Prepare consistent evidence", "Details in the form, passport, contract, attachments and previous correspondence should be current and consistent."], ["Track service", "Keep posting and receipt evidence. Valid service often starts a procedural deadline."], ["Follow up after filing", "Monitor correspondence, answer requests and notify the authority where the law requires it."]]
  };
  const guideFaqs = faqData(locale, relatedService).slice(0, 3);
  const toc = [["context", meta.facts], ...sections[locale].map(([heading], sectionIndex) => [`step-${sectionIndex}`, heading]), ["guide-faq", ui.serviceSections.faq]];
  const main = `${crumbs.html}<article><header class="page-hero"><div class="container narrow"><p class="eyebrow">${escapeHtml(ui.guides)}</p><h1>${escapeHtml(title)}</h1><p>${escapeHtml(intros[locale])}</p><p class="article-meta">${escapeHtml(meta.author)}: ${siteNameHtml} · ${escapeHtml(meta.reviewer)}: ${siteNameHtml} · ${escapeHtml(ui.updated)}: ${SITE.updated}</p></div></header><div class="container article-layout"><div class="article-content"><nav class="article-toc" aria-label="${escapeHtml(meta.contents)}"><h2>${escapeHtml(meta.contents)}</h2><ol>${toc.map(([id, label]) => `<li>${link(`#${id}`, label)}</li>`).join("")}</ol></nav><aside class="notice">${escapeHtml(ui.disclaimer)}</aside><section id="context"><h2>${escapeHtml(meta.facts)}</h2><p>${escapeHtml(relatedService.summary[locale])}</p><p>${escapeHtml(relatedService.extra[locale])}</p></section>${sections[locale].map(([heading, text], sectionIndex) => `<section id="step-${sectionIndex}"><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></section>`).join("")}<section id="guide-faq"><h2>${escapeHtml(ui.serviceSections.faq)}</h2>${faqBlock(locale, guideFaqs)}</section><section><h2>${escapeHtml(ui.sources)}</h2><p>${link((SOURCE_LINKS[relatedService.source] || SOURCE_LINKS.mos)[1], (SOURCE_LINKS[relatedService.source] || SOURCE_LINKS.mos)[0])}</p><p class="update-line">${escapeHtml(ui.updated)}: ${SITE.updated}</p></section></div><aside class="article-aside"><div class="sticky-card"><h2>${escapeHtml(ui.related)}</h2>${link(href(locale, relatedService.slug), titleFor(relatedService, locale))}${link(href(locale, "kontakt"), ui.consult, "btn-primary")}</div></aside></div></article>`;
  const articleSchema = { "@type": "Article", headline: title, datePublished: SITE.updated, dateModified: SITE.updated, inLanguage: LOCALES[locale].html, author: { "@id": `${SITE.origin}/#organization` }, reviewedBy: { "@id": `${SITE.origin}/#organization` }, publisher: { "@id": `${SITE.origin}/#organization` }, mainEntityOfPage: abs(locale, slug) };
  const faqSchema = { "@type": "FAQPage", mainEntity: guideFaqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
  return layout({ locale, slug, title, description: intros[locale], active: "guides", main, schema: [crumbs.schema, articleSchema, faqSchema] });
}

function simplePage(locale, type) {
  const ui = UI[locale];
  const map = {
    about: { slug: "o-nas", title: ui.about, active: "about" }, faq: { slug: "faq", title: ui.faqTitle, active: "faq" }, contact: { slug: "kontakt", title: ui.contactTitle, active: "contact" },
    privacy: { slug: "polityka-prywatnosci", title: ui.privacy }, terms: { slug: "regulamin", title: ui.terms }, cookies: { slug: "cookies", title: ui.cookies }
  }[type];
  const descriptions = {
    about: ui.teamText, faq: ui.servicesLead, contact: ui.contactLead,
    privacy: { pl: "Zasady przetwarzania danych osobowych w B&B Legal Advisory.", ua: "Правила обробки персональних даних у B&B Legal Advisory.", ru: "Правила обработки персональных данных в B&B Legal Advisory.", en: "Personal data processing rules at B&B Legal Advisory." }[locale],
    terms: { pl: "Podstawowe zasady świadczenia usług i kontaktu z B&B Legal Advisory.", ua: "Основні правила надання послуг і контакту з B&B Legal Advisory.", ru: "Основные правила оказания услуг и контакта с B&B Legal Advisory.", en: "Basic terms for services and contact with B&B Legal Advisory." }[locale],
    cookies: { pl: "Informacja o technicznych plikach cookies używanych przez stronę.", ua: "Інформація про технічні cookies, які використовує сайт.", ru: "Информация о технических cookies сайта.", en: "Information about technical cookies used by this website." }[locale]
  };
  const crumbs = breadcrumb(locale, [[map.title, href(locale, map.slug)]]);
  let body = "";
  let schema = [crumbs.schema];
  if (type === "about") body = `<section class="section-padding"><div class="container narrow"><p>${escapeHtml(ui.teamText)}</p><div class="founders-grid"><article class="founder-card"><span class="founder-avatar">VB</span><div><h2>Bereza Vladyslav</h2><p class="founder-role">${escapeHtml(ui.founder1)}</p></div></article><article class="founder-card"><span class="founder-avatar">IB</span><div><h2>Bigun Ievgenii</h2><p class="founder-role">${escapeHtml(ui.founder2)}</p></div></article></div><div class="notice">${escapeHtml(ui.footerLead)} ${escapeHtml(ui.disclaimer)}</div></div></section>`;
  if (type === "faq") { const faqs = faqData(locale, SERVICES[0]); body = `<section class="section-padding"><div class="container faq-container">${faqBlock(locale, faqs)}</div></section>`; schema.push({ "@type": "FAQPage", mainEntity: faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }); }
  if (type === "contact") body = `<section class="section-padding"><div class="container contact-layout"><div class="contact-card"><p class="eyebrow">${escapeHtml(ui.contact)}</p><h2>${siteNameHtml}</h2><address>${link(`tel:${SITE.phoneHref}`, SITE.phone)}${link(`tel:${SITE.phoneAltHref}`, `${SITE.phoneAlt} · Viber / WhatsApp`)}${link(`mailto:${SITE.email}`, SITE.email)}<span>${SITE.address}</span></address></div>${contactForm(locale)}</div></section>`;
  if (["privacy", "terms", "cookies"].includes(type)) {
    const policy = {
      pl: {
        privacy: [["Administrator", `${SITE.name}, ${SITE.address}. Kontakt: ${SITE.email}.`], ["Cel i podstawa", "Dane z formularza służą odpowiedzi na zapytanie, działaniom przed zawarciem umowy i — po uzgodnieniu — realizacji usługi."], ["Zakres i odbiorcy", "Przetwarzamy dane podane dobrowolnie. Formularz obsługuje Web3Forms; dane mogą też przetwarzać dostawcy hostingu i poczty na podstawie odpowiednich umów."], ["Okres i prawa", "Dane przechowujemy przez czas potrzebny do odpowiedzi, realizacji usługi i obowiązków prawnych. Możesz żądać dostępu, sprostowania, usunięcia, ograniczenia lub wnieść sprzeciw — zależnie od podstawy."], ["Skarga", "Przysługuje prawo skargi do Prezesa Urzędu Ochrony Danych Osobowych."]],
        terms: [["Charakter informacji", ui.disclaimer], ["Nawiązanie współpracy", ui.formNotice], ["Zakres usługi", "Zakres, wynagrodzenie, terminy i odpowiedzialność ustalamy indywidualnie przed rozpoczęciem płatnej usługi."], ["Decyzja organu", ui.noGuarantee]],
        cookies: [["Zakres", "Strona nie używa reklamowych ani analitycznych cookies. Może używać wyłącznie technicznych mechanizmów hostingu i zabezpieczeń."], ["Ustawienia", "Możesz ograniczyć cookies w przeglądarce; może to wpłynąć na działanie funkcji."], ["Usługi zewnętrzne", "Wysłanie formularza powoduje połączenie z Web3Forms zgodnie z zasadami tej usługi."]]
      },
      ua: {
        privacy: [["Контролер даних", `${SITE.name}, ${SITE.address}. Контакт: ${SITE.email}.`], ["Мета й підстава", "Дані з форми використовуються для відповіді, дій до укладення договору та, після погодження, надання послуги."], ["Обсяг і одержувачі", "Ми обробляємо добровільно надані дані. Форму технічно обслуговує Web3Forms; дані також можуть обробляти постачальники хостингу й пошти на підставі відповідних договорів."], ["Строк і права", "Дані зберігаються протягом часу, потрібного для відповіді, послуги та правових обов’язків. Залежно від підстави ви можете вимагати доступу, виправлення, видалення, обмеження або заперечити."], ["Скарга", "Ви можете подати скаргу Голові Управління захисту персональних даних Польщі."]],
        terms: [["Характер інформації", ui.disclaimer], ["Початок співпраці", ui.formNotice], ["Обсяг послуги", "Обсяг, оплату, строки й відповідальність погоджуємо індивідуально до початку платної послуги."], ["Рішення органу", ui.noGuarantee]],
        cookies: [["Обсяг", "Сайт не використовує рекламні чи аналітичні cookies. Можливі лише технічні механізми хостингу та безпеки."], ["Налаштування", "Ви можете обмежити cookies у браузері; це може вплинути на окремі функції."], ["Зовнішні послуги", "Надсилання форми створює з’єднання з Formspree відповідно до правил цієї послуги."]]
      },
      ru: {
        privacy: [["Контролёр данных", `${SITE.name}, ${SITE.address}. Контакт: ${SITE.email}.`], ["Цель и основание", "Данные формы используются для ответа, действий до заключения договора и, после согласования, оказания услуги."], ["Объём и получатели", "Мы обрабатываем добровольно предоставленные данные. Форму технически обслуживает Formspree; данные также могут обрабатывать провайдеры хостинга и почты на основании договоров."], ["Срок и права", "Данные хранятся на время ответа, услуги и правовых обязанностей. В зависимости от основания можно запросить доступ, исправление, удаление, ограничение или возразить."], ["Жалоба", "Можно подать жалобу Председателю Управления защиты персональных данных Польши."]],
        terms: [["Характер информации", ui.disclaimer], ["Начало сотрудничества", ui.formNotice], ["Объём услуги", "Объём, оплату, сроки и ответственность согласуем индивидуально до начала платной услуги."], ["Решение органа", ui.noGuarantee]],
        cookies: [["Объём", "Сайт не использует рекламные или аналитические cookies. Возможны только технические механизмы хостинга и безопасности."], ["Настройки", "Cookies можно ограничить в браузере; это может повлиять на отдельные функции."], ["Внешние услуги", "Отправка формы создаёт соединение с Formspree по правилам этого сервиса."]]
      },
      en: {
        privacy: [["Data controller", `${SITE.name}, ${SITE.address}. Contact: ${SITE.email}.`], ["Purpose and legal basis", "Form data is used to answer an enquiry, take pre-contract steps and, once agreed, provide the service."], ["Data and recipients", "We process data supplied voluntarily. Formspree technically handles the form; hosting and email providers may also process data under appropriate agreements."], ["Retention and rights", "Data is kept as needed for the reply, service and legal duties. Depending on the legal basis, you may request access, correction, deletion or restriction, or object."], ["Complaint", "You may complain to the President of the Polish Personal Data Protection Office."],],
        terms: [["Nature of information", ui.disclaimer], ["Starting cooperation", ui.formNotice], ["Service scope", "Scope, fees, timing and responsibility are agreed individually before paid work begins."], ["Authority decision", ui.noGuarantee]],
        cookies: [["Scope", "The site does not use advertising or analytics cookies. Only technical hosting and security mechanisms may be used."], ["Settings", "You can restrict cookies in your browser; this may affect some functions."], ["External services", "Submitting the form connects to Formspree under that service's terms."]]
      }
    }[locale][type];
    body = `<section class="section-padding"><div class="container article-content standalone">${policy.map(([heading, text]) => `<section><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(text)}</p></section>`).join("")}<p class="update-line">${escapeHtml(ui.updated)}: ${SITE.updated}</p></div></section>`;
  }
  const main = `${crumbs.html}<header class="page-hero compact"><div class="container narrow"><h1>${escapeHtml(map.title)}</h1><p>${escapeHtml(descriptions[type])}</p></div></header>${body}`;
  return layout({ locale, slug: map.slug, title: map.title, description: descriptions[type], active: map.active, main, schema });
}

async function emit(relative, content) {
  const filename = join(out, relative, "index.html");
  await mkdir(join(filename, ".."), { recursive: true });
  await writeFile(filename, content);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, "assets"), join(out, "assets"), { recursive: true });
await Promise.all(["styles.css", "script.js"].map(async (filename) => writeFile(join(out, filename), await readFile(join(root, filename)))));

const urls = [];
for (const locale of Object.keys(LOCALES)) {
  await emit(locale, homePage(locale)); urls.push(abs(locale));
  for (const service of SERVICES) { await emit(`${locale}/${service.slug}`, servicePage(locale, service)); urls.push(abs(locale, service.slug)); }
  await emit(`${locale}/poradniki`, guidesIndex(locale)); urls.push(abs(locale, "poradniki"));
  for (const [index, guide] of GUIDES.entries()) { const slug = `poradniki/${guide.slug}`; await emit(`${locale}/${slug}`, guidePage(locale, guide, index)); urls.push(abs(locale, slug)); }
  for (const type of ["about", "faq", "contact", "privacy", "terms", "cookies"]) { const slug = { about: "o-nas", faq: "faq", contact: "kontakt", privacy: "polityka-prywatnosci", terms: "regulamin", cookies: "cookies" }[type]; await emit(`${locale}/${slug}`, simplePage(locale, type)); urls.push(abs(locale, slug)); }
}

await writeFile(join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}/sitemap.xml\n`);
await writeFile(join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${SITE.updated}</lastmod></url>`).join("\n")}\n</urlset>\n`);
await writeFile(join(out, "manifest.webmanifest"), JSON.stringify({ name: SITE.name, short_name: "B&B Legal", start_url: "/pl/", display: "standalone", background_color: "#140d08", theme_color: "#140d08", icons: [{ src: "/assets/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any maskable" }] }, null, 2));

const notFound = Object.fromEntries(Object.keys(LOCALES).map((locale) => [locale, { title: UI[locale].notFound, text: UI[locale].notFoundText, action: UI[locale].backHome }]));
await writeFile(join(out, "404.html"), `<!doctype html><html lang="pl"><head>${GA_SNIPPET}${META_PIXEL_SNIPPET}<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 | ${siteNameHtml}</title><link rel="icon" href="/assets/favicon.svg"><link rel="stylesheet" href="/styles.css"><script>document.addEventListener('DOMContentLoaded',()=>{const l=location.pathname.split('/')[1];const d=${json(notFound)}[l]||${json(notFound)}.pl;document.documentElement.lang=l==='ua'?'uk':l||'pl';document.querySelector('h1').textContent=d.title;document.querySelector('p').textContent=d.text;const a=document.querySelector('a');a.textContent=d.action;a.href='/'+(d===${json(notFound)}.pl?'pl':l)+'/';});</script></head><body>${META_PIXEL_NOSCRIPT}<main class="error-page"><img src="/assets/logo.svg" width="250" height="54" alt="${siteNameHtml}"><p class="error-code">404</p><h1>Nie znaleziono strony</h1><p>Adres mógł się zmienić.</p><a class="btn-primary" href="/pl/">Strona główna</a></main></body></html>`);
await writeFile(join(out, "index.html"), `<!doctype html><html lang="pl"><head>${GA_SNIPPET}${META_PIXEL_SNIPPET}<meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=/pl/"><link rel="canonical" href="${abs("pl")}"><title>${siteNameHtml}</title></head><body>${META_PIXEL_NOSCRIPT}<a href="/pl/">${siteNameHtml}</a></body></html>`);

console.log(`Built ${urls.length} indexed pages in ${out}`);
