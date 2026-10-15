#!/usr/bin/env node
/**
 * SEO structure check — crawls the site the way a crawler sees the raw HTML
 * and fails on anything an SEO audit would flag.
 *
 * Usage:
 *   npm run build && npm run start -- -p 3457   (in another terminal)
 *   npm run seo:check                            (defaults to http://localhost:3457)
 *   npm run seo:check -- https://www.frisco.sk   (check production)
 *
 * Exit code 1 when any ERROR is found; WARNs are printed but don't fail.
 */

const SITE_URL = 'https://www.frisco.sk'; // must match src/config/seo.ts
const BASE = (process.argv[2] || 'http://localhost:3457').replace(/\/$/, '');
const LANGS = ['sk', 'en', 'de'];
const TITLE_MAX = 65;
const DESC_MIN = 70;
const DESC_MAX = 170;

const issues = [];
const err = (url, msg) => issues.push({ level: 'ERROR', url, msg });
const warn = (url, msg) => issues.push({ level: 'WARN', url, msg });

const toLocal = (prodUrl) => prodUrl.replace(SITE_URL, BASE);
const toProd = (path) => `${SITE_URL}${path === '/' ? '' : path}`;
// Root with or without trailing slash is the same URL.
const norm = (u) => u.replace(/\/$/, '').replace(/#.*$/, '');
const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`, 'i'));
  return m ? decode(m[2] ?? m[3]) : null;
};
const tags = (html, name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) || [];
const metaContent = (html, key, keyAttr = 'name') =>
  tags(html, 'meta').map((t) => (attr(t, keyAttr) === key ? attr(t, 'content') : null)).find((v) => v != null) ?? null;
const linkRels = (html, rel) => tags(html, 'link').filter((t) => (attr(t, 'rel') || '').toLowerCase() === rel);

const fetchCache = new Map();
async function get(url) {
  if (fetchCache.has(url)) return fetchCache.get(url);
  const p = fetch(url, { redirect: 'manual', headers: { 'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } })
    .then(async (r) => ({ status: r.status, location: r.headers.get('location'), body: r.status === 200 ? await r.text() : '' }))
    .catch((e) => ({ status: 0, location: null, body: '', error: e.message }));
  fetchCache.set(url, p);
  return p;
}

// ---------- robots.txt ----------
async function checkRobots() {
  const r = await get(`${BASE}/robots.txt`);
  if (r.status !== 200) return err('/robots.txt', `status ${r.status}`);
  if (/^disallow:\s*\/\s*$/im.test(r.body)) err('/robots.txt', 'Disallow: / blocks the whole site');
  const sm = r.body.match(/^sitemap:\s*(\S+)/im);
  if (!sm) err('/robots.txt', 'no Sitemap: line');
  else if (sm[1] !== `${SITE_URL}/sitemap.xml`) err('/robots.txt', `Sitemap points to ${sm[1]}, expected ${SITE_URL}/sitemap.xml`);
}

// ---------- sitemap ----------
async function readSitemap() {
  const r = await get(`${BASE}/sitemap.xml`);
  if (r.status !== 200) {
    err('/sitemap.xml', `status ${r.status}`);
    return [];
  }
  const entries = [...r.body.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const loc = decode(m[1].match(/<loc>([^<]+)<\/loc>/)?.[1] || '');
    const alts = Object.fromEntries(
      [...m[1].matchAll(/<xhtml:link\b[^>]*>/g)].map((x) => [attr(x[0], 'hreflang'), attr(x[0], 'href')]),
    );
    return { loc, alts };
  });
  const seen = new Set();
  for (const { loc, alts } of entries) {
    if (!loc.startsWith(SITE_URL)) err('/sitemap.xml', `<loc> on wrong host: ${loc}`);
    if (seen.has(norm(loc))) err('/sitemap.xml', `duplicate <loc>: ${loc}`);
    seen.add(norm(loc));
    for (const l of LANGS) if (!alts[l]) err('/sitemap.xml', `${loc} missing xhtml:link hreflang="${l}"`);
    if (alts.sk && norm(alts.sk) !== norm(loc)) err('/sitemap.xml', `${loc} sk alternate (${alts.sk}) is not the <loc> itself`);
  }
  if (!entries.some((e) => e.loc.includes('/nehnutelnost/'))) err('/sitemap.xml', 'no /nehnutelnost/ listing pages in sitemap');
  return entries;
}

// ---------- per-page ----------
const pages = new Map(); // prodUrl -> parsed
async function checkPage(prodUrl, expectLang, fromSitemap) {
  const key = norm(prodUrl);
  if (pages.has(key)) return pages.get(key);
  const r = await get(toLocal(prodUrl));
  const info = { prodUrl, status: r.status };
  pages.set(key, info);
  if (r.status !== 200) {
    err(prodUrl, `status ${r.status}${r.location ? ` → ${r.location}` : ''}${fromSitemap ? ' (listed in sitemap)' : ''}`);
    return info;
  }
  const html = r.body;
  const head = html.split(/<\/head>/i)[0];

  const robots = metaContent(head, 'robots') || '';
  info.noindex = /noindex/i.test(robots);
  if (info.noindex && fromSitemap) err(prodUrl, 'noindex page is listed in the sitemap');

  const htmlLang = attr(tags(html, 'html')[0] || '', 'lang');
  if (!htmlLang) err(prodUrl, '<html> has no lang attribute');
  else if (expectLang && !htmlLang.toLowerCase().startsWith(expectLang)) err(prodUrl, `<html lang="${htmlLang}"> but page is the ${expectLang} version`);

  const titles = head.match(/<title[^>]*>([\s\S]*?)<\/title>/gi) || [];
  if (titles.length !== 1) err(prodUrl, `${titles.length} <title> tags`);
  info.title = decode((titles[0] || '').replace(/<[^>]+>/g, '').trim());
  if (!info.title) err(prodUrl, 'empty <title>');
  else {
    if (info.title.length > TITLE_MAX) warn(prodUrl, `title is ${info.title.length} chars (>${TITLE_MAX}, truncated in SERP): "${info.title}"`);
    if (/FRISCO Reality.*\|\s*FRISCO Reality/i.test(info.title)) err(prodUrl, `brand repeated in title: "${info.title}"`);
  }

  info.desc = metaContent(head, 'description');
  if (!info.desc) err(prodUrl, 'missing meta description');
  else if (info.desc.length < DESC_MIN || info.desc.length > DESC_MAX) warn(prodUrl, `meta description is ${info.desc.length} chars (aim ${DESC_MIN}–${DESC_MAX})`);

  const canon = linkRels(head, 'canonical');
  if (canon.length !== 1) err(prodUrl, `${canon.length} canonical tags`);
  info.canonical = canon[0] ? attr(canon[0], 'href') : null;
  if (info.canonical && !info.noindex && norm(info.canonical) !== norm(prodUrl))
    err(prodUrl, `canonical points elsewhere: ${info.canonical}`);

  info.hreflang = Object.fromEntries(
    linkRels(head, 'alternate').filter((t) => attr(t, 'hreflang')).map((t) => [attr(t, 'hreflang'), attr(t, 'href')]),
  );
  if (!info.noindex) {
    for (const l of [...LANGS, 'x-default']) if (!info.hreflang[l]) err(prodUrl, `missing hreflang="${l}"`);
    if (!Object.values(info.hreflang).some((h) => norm(h) === norm(prodUrl))) err(prodUrl, 'hreflang set does not include the page itself');
    for (const h of Object.values(info.hreflang)) if (!h.startsWith(SITE_URL)) err(prodUrl, `hreflang on wrong host: ${h}`);
  }

  const ogUrl = metaContent(head, 'og:url', 'property');
  if (!metaContent(head, 'og:title', 'property')) warn(prodUrl, 'missing og:title');
  if (!metaContent(head, 'og:image', 'property')) warn(prodUrl, 'missing og:image');
  if (ogUrl && info.canonical && norm(ogUrl) !== norm(info.canonical)) warn(prodUrl, `og:url (${ogUrl}) ≠ canonical (${info.canonical})`);

  // Image URLs we hand to Google/social must resolve.
  info.imageUrls = [metaContent(head, 'og:image', 'property'), metaContent(head, 'twitter:image')].filter(Boolean);
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = (n) => {
        if (!n || typeof n !== 'object') return;
        for (const [k, v] of Object.entries(n)) {
          if ((k === 'image' || k === 'logo') && typeof v === 'string') info.imageUrls.push(v);
          else if ((k === 'image' || k === 'logo') && Array.isArray(v)) v.forEach((x) => typeof x === 'string' ? info.imageUrls.push(x) : walk(x));
          else walk(v);
        }
      };
      walk(JSON.parse(m[1]));
    } catch { /* reported below */ }
  }

  const h1s = tags(html, 'h1').length;
  if (h1s !== 1) err(prodUrl, `${h1s} <h1> in server HTML (want exactly 1)`);

  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      for (const node of [].concat(j['@graph'] || j)) if (!node['@type']) err(prodUrl, 'JSON-LD node without @type');
      const s = JSON.stringify(j);
      const wrongHost = s.match(/https?:\/\/(?!www\.)frisco\.sk[^"]*/);
      if (wrongHost) err(prodUrl, `JSON-LD uses non-canonical host: ${wrongHost[0]}`);
    } catch {
      err(prodUrl, 'invalid JSON-LD');
    }
  }

  const noAlt = tags(html, 'img').filter((t) => attr(t, 'alt') == null).length;
  if (noAlt) err(prodUrl, `${noAlt} <img> without alt attribute`);

  info.links = new Set(
    tags(html, 'a')
      .map((t) => attr(t, 'href'))
      .filter((h) => h && (h.startsWith('/') || h.startsWith(SITE_URL) || h.startsWith(BASE)) && !h.startsWith('//'))
      .map((h) => norm(h.replace(SITE_URL, '').replace(BASE, '')) || '/'),
  );
  return info;
}

async function main() {
  console.log(`SEO check against ${BASE} (canonical host ${SITE_URL})\n`);
  await checkRobots();
  const entries = await readSitemap();

  // Every sitemap URL in every language.
  const queue = [];
  for (const { loc, alts } of entries) {
    queue.push([loc, 'sk', true]);
    for (const l of ['en', 'de']) if (alts[l]) queue.push([alts[l], l, true]);
  }
  for (let i = 0; i < queue.length; i += 8) await Promise.all(queue.slice(i, i + 8).map((q) => checkPage(...q)));

  // Hreflang reciprocity: every alternate must point back.
  for (const p of pages.values()) {
    if (!p.hreflang || p.noindex) continue;
    for (const [l, target] of Object.entries(p.hreflang)) {
      const t = pages.get(norm(target)) || (await checkPage(target, l === 'x-default' ? 'sk' : l, false));
      if (t.status === 200 && t.hreflang && !Object.values(t.hreflang).some((h) => norm(h) === norm(p.prodUrl)))
        err(p.prodUrl, `hreflang ${l} → ${target} does not link back (no return tag)`);
    }
  }

  // Duplicate titles / descriptions across indexable pages.
  const dupes = (field) => {
    const by = new Map();
    for (const p of pages.values()) if (p.status === 200 && !p.noindex && p[field]) by.set(p[field], [...(by.get(p[field]) || []), p.prodUrl]);
    for (const [v, urls] of by) if (urls.length > 1) err(urls.join(', '), `duplicate ${field}: "${v.slice(0, 80)}"`);
  };
  dupes('title');
  dupes('desc');

  // Internal links: must resolve 200 directly (no redirects, no 404s).
  const linkSources = new Map();
  for (const p of pages.values()) for (const l of p.links || []) linkSources.set(l, [...(linkSources.get(l) || []), p.prodUrl]);
  await Promise.all(
    [...linkSources.keys()].map(async (path) => {
      const r = await get(`${BASE}${path}`);
      if (r.status !== 200)
        err(path, `internal link returns ${r.status}${r.location ? ` → ${r.location}` : ''} (linked from ${linkSources.get(path).length} page(s), e.g. ${linkSources.get(path)[0]})`);
    }),
  );

  // og:image / JSON-LD image and logo URLs on our own host must return 200.
  const imgSources = new Map();
  for (const p of pages.values()) for (const u of p.imageUrls || []) if (u.startsWith(SITE_URL)) imgSources.set(u, [...(imgSources.get(u) || []), p.prodUrl]);
  await Promise.all(
    [...imgSources.keys()].map(async (u) => {
      const r = await get(toLocal(u));
      if (r.status !== 200) err(u, `image URL used in og:image/JSON-LD returns ${r.status} (on ${imgSources.get(u).length} page(s), e.g. ${imgSources.get(u)[0]})`);
    }),
  );

  // Orphans: sitemap pages that nothing in the server HTML links to.
  const linked = new Set(linkSources.keys());
  for (const { loc } of entries) {
    const path = norm(loc.replace(SITE_URL, '')) || '/';
    if (path !== '/' && !path.startsWith('/nehnutelnost/') && !linked.has(path)) err(loc, 'orphan: no internal <a href> points to this page');
  }

  // ---------- report ----------
  const errors = issues.filter((i) => i.level === 'ERROR');
  const warns = issues.filter((i) => i.level === 'WARN');
  // Group messages that only differ by URL, quoted text or numbers.
  const groupKey = (msg) => msg.replace(/https?:\/\/\S+|\/[\w\-/.#]+/g, '<url>').replace(/"[^"]*"/g, '"…"').replace(/\d+/g, 'N');
  const group = (list) => {
    const by = new Map();
    for (const i of list) by.set(groupKey(i.msg), [...(by.get(groupKey(i.msg)) || []), i]);
    return by;
  };
  const verbose = process.env.SEO_VERBOSE === '1';
  for (const [label, list] of [['ERROR', errors], ['WARN', warns]]) {
    for (const [, items] of group(list)) {
      const shown = verbose ? items : items.slice(0, 3);
      for (const i of shown) console.log(`${label}  ${i.url}\n       ${i.msg}`);
      if (items.length > shown.length) console.log(`       … and ${items.length - shown.length} more like this (SEO_VERBOSE=1 to list all)`);
    }
  }
  console.log(`\nChecked ${pages.size} pages, ${linkSources.size} internal link targets. ${errors.length} errors, ${warns.length} warnings.`);
  process.exit(errors.length ? 1 : 0);
}

main();
