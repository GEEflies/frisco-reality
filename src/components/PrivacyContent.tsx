'use client';

import { Footer } from '@/components/Footer';
import { useLanguage } from '@/i18n/LanguageProvider';
import { LocaleLink } from './LocaleLink';
import {
  Building2,
  Database,
  Scale,
  Users,
  Globe,
  Clock,
  Cookie,
  Bot,
  ShieldCheck,
  AlertTriangle,
  Lock,
  FileText,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Lang = 'sk' | 'en' | 'de';

interface Section {
  id: string;
  heading: string;
  content: string;
}

interface PrivacyCopy {
  title: string;
  subtitle: string;
  lastUpdated: string;
  tocTitle: string;
  back: string;
  sections: Section[];
}

/* ------------------------------------------------------------------ */
/*  Copy — SK                                                          */
/* ------------------------------------------------------------------ */

const SK_SECTIONS: Section[] = [
  {
    id: 'prevadzkovatel',
    heading: '1. Prevádzkovateľ osobných údajov',
    content: `Prevádzkovateľom osobných údajov podľa nariadenia Európskeho parlamentu a Rady (EÚ) 2016/679 o ochrane fyzických osôb pri spracúvaní osobných údajov (ďalej len „GDPR") a zákona č. 18/2018 Z. z. o ochrane osobných údajov je:

FRISCO, s.r.o.
Námestie Slobody 1185/30, 926 01 Sereď
IČO: 43 850 553 | DIČ: 2022486895
Obchodný register Okresného súdu Trnava, Oddiel: Sro, Vložka č.: 21013/T

E-mail: info@frisco.sk
Telefón: +421 905 447 220, +421 905 740 700

(ďalej len „prevádzkovateľ" alebo „my")

Prevádzkovateľ nemá povinnosť ustanoviť zodpovednú osobu (DPO) podľa čl. 37 GDPR. Vo veciach ochrany osobných údajov nás kontaktujte na vyššie uvedenom e-maile.`,
  },
  {
    id: 'rozsah',
    heading: '2. Rozsah spracúvaných osobných údajov',
    content: `Spracúvame len tie osobné údaje, ktoré nám poskytnete dobrovoľne alebo ktoré vzniknú v rámci používania našej webovej stránky:

a) Osobné údaje poskytnuté priamo vami:
• meno a priezvisko
• e-mailová adresa
• telefónne číslo
• údaje o nehnuteľnosti (adresa, parametre, fotografie — ak nám ich poskytnete v rámci spolupráce)
• obsah správ zaslaných cez kontaktný formulár

b) Údaje spracúvané automaticky:
• anonymizované údaje o návštevnosti (bez IP adresy, bez cookies — prostredníctvom Vercel Analytics)
• zvolený jazyk stránky (uložený lokálne vo vašom prehliadači)`,
  },
  {
    id: 'ucely',
    heading: '3. Účely a právne základy spracúvania',
    content: `a) Sprostredkovanie predaja, kúpy alebo prenájmu nehnuteľností
Pokiaľ s nami spolupracujete na predaji, kúpe alebo prenájme nehnuteľnosti, spracúvame vaše údaje na účely plnenia zmluvy o sprostredkovaní alebo na vykonanie opatrení pred jej uzatvorením.
Právny základ: čl. 6 ods. 1 písm. b) GDPR

b) Vybavenie dopytu cez kontaktný formulár
Keď nám pošlete správu cez kontaktný formulár, spracúvame vaše meno, e-mail, telefónne číslo a obsah správy, aby sme vám mohli odpovedať.
Právny základ: čl. 6 ods. 1 písm. f) GDPR (oprávnený záujem — vybavenie dopytu potenciálneho klienta)

c) Plnenie zákonných povinností
Vaše údaje uchovávame v rozsahu nevyhnutnom na splnenie povinností vyplývajúcich zo zákonov SR, najmä:
• zákon č. 431/2002 Z. z. o účtovníctve
• zákon č. 595/2003 Z. z. o dani z príjmov
• zákon č. 297/2008 Z. z. o ochrane pred legalizáciou príjmov z trestnej činnosti (AML)
Právny základ: čl. 6 ods. 1 písm. c) GDPR

d) Zasielanie obchodných ponúk a noviniek
Len s vaším výslovným súhlasom vás informujeme o nových nehnuteľnostiach v ponuke a ďalších novinkách. Súhlas môžete kedykoľvek odvolať.
Právny základ: čl. 6 ods. 1 písm. a) GDPR`,
  },
  {
    id: 'prijemcovia',
    heading: '4. Príjemcovia osobných údajov',
    content: `Vaše osobné údaje môžeme v nevyhnutnom rozsahu sprístupniť nasledujúcim kategóriám príjemcov:

• Portál Nehnuteľnosti.sk — pri inzercii nehnuteľnosti
• Právni poradcovia a notári — pri realizácii kúpnopredajnej transakcie
• Kataster nehnuteľností SR — pri návrhu na vklad vlastníckeho práva
• Poskytovatelia IT služieb — Vercel, Inc. (hosting webovej stránky), Supabase, Inc. (správa obsahu)
• Orgány verejnej moci — len ak to vyžaduje zákon (daňový úrad, súdy a pod.)

Vaše údaje nepredávame tretím stranám na marketingové účely.`,
  },
  {
    id: 'prenos',
    heading: '5. Prenos osobných údajov do tretích krajín',
    content: `Hosting webovej stránky (Vercel) a správa obsahu (Supabase) môžu zahŕňať spracúvanie údajov na serveroch v USA. Tento prenos je zabezpečený na základe:

• EU-US Data Privacy Framework (rozhodnutie Európskej komisie o primeranosti)
• štandardných zmluvných doložiek podľa čl. 46 ods. 2 písm. c) GDPR

Google Maps sa na stránke načíta výlučne po vašom výslovnom súhlase — pred kliknutím na „Zobraziť mapu" nedochádza k žiadnemu prenosu údajov na Google.`,
  },
  {
    id: 'doba',
    heading: '6. Doba uchovávania osobných údajov',
    content: `Osobné údaje uchovávame výhradne po dobu nevyhnutnú na splnenie účelu spracúvania:

• Údaje z kontaktného formulára: 12 mesiacov od poslednej komunikácie
• Zmluvné údaje (sprostredkovanie): 5 rokov od ukončenia zmluvného vzťahu
• Účtovné a daňové doklady: 10 rokov (zákon č. 431/2002 Z. z.)
• AML dokumentácia: 5 rokov (zákon č. 297/2008 Z. z.)
• Marketingový súhlas: do jeho odvolania
• Analytické údaje (Vercel Analytics): výhradne anonymizované, neobsahujú osobné údaje

Po uplynutí doby uchovávania sú údaje bezpečne vymazané alebo anonymizované.`,
  },
  {
    id: 'cookies',
    heading: '7. Technológie webovej stránky',
    content: `a) Analytika (Vercel Web Analytics)
Na meranie návštevnosti využívame službu Vercel Web Analytics. Táto služba nepoužíva cookies, nezbiera IP adresy ani iné osobné údaje. Všetky údaje sú plne anonymizované a agregované.

b) Uloženie jazyka
Zvolený jazyk stránky je uložený v lokálnom úložisku prehliadača (localStorage). Ide o technicky nevyhnutné uloženie, ktoré sa neprenáša na žiadny server.

c) Google Maps
Interaktívna mapa sa načíta až po vašom výslovnom súhlase kliknutím na príslušné tlačidlo. Pred udelením súhlasu sa zobrazuje len statický náhľad mapy (OpenStreetMap), ktorý nezakladá žiadne cookies. Po udelení súhlasu môže Google spracúvať údaje podľa vlastných Zásad ochrany súkromia (policies.google.com/privacy). Váš súhlas si zapamätáme v localStorage, aby sme vás nepýtali opakovane.

d) Typografia
Všetky písma (fonty) používané na stránke sú stiahnuté a hostované priamo na našom serveri. Nedochádza k žiadnemu prepojeniu na externé služby (napr. Google Fonts).

e) Supabase
Systém na správu obsahu nehnuteľností. Funguje výhradne na strane servera a nezbiera žiadne údaje od návštevníkov stránky.

Stránka nepoužíva vlastné sledovacie cookies (tracking cookies) ani reklamné technológie.`,
  },
  {
    id: 'automatizovane',
    heading: '8. Automatizované rozhodovanie a profilovanie',
    content: `Vaše osobné údaje nepoužívame na automatizované individuálne rozhodovanie ani profilovanie v zmysle čl. 22 GDPR.`,
  },
  {
    id: 'prava',
    heading: '9. Vaše práva',
    content: `V súlade s GDPR a zákonom č. 18/2018 Z. z. máte nasledujúce práva:

a) Právo na prístup — máte právo získať potvrdenie o tom, či spracúvame vaše osobné údaje, a ak áno, získať kópiu týchto údajov (čl. 15 GDPR).

b) Právo na opravu — máte právo požiadať o opravu nepresných alebo doplnenie neúplných osobných údajov (čl. 16 GDPR).

c) Právo na vymazanie — máte právo požiadať o vymazanie vašich osobných údajov, ak zanikol účel ich spracúvania alebo ak ste odvolali súhlas (čl. 17 GDPR).

d) Právo na obmedzenie spracúvania — máte právo požiadať o obmedzenie spracúvania vašich údajov v prípadoch stanovených v čl. 18 GDPR.

e) Právo na prenosnosť údajov — máte právo získať vaše osobné údaje v bežne používanom a strojovo čitateľnom formáte a právo preniesť ich inému prevádzkovateľovi (čl. 20 GDPR).

f) Právo namietať — máte právo namietať proti spracúvaniu založenému na oprávnenom záujme prevádzkovateľa (čl. 21 GDPR).

g) Právo odvolať súhlas — ak spracúvame vaše údaje na základe súhlasu, máte právo súhlas kedykoľvek odvolať bez toho, aby to malo vplyv na zákonnosť predchádzajúceho spracúvania.

Pre uplatnenie svojich práv nás kontaktujte na:
E-mail: info@frisco.sk
Písomne: FRISCO, s.r.o., Námestie Slobody 1185/30, 926 01 Sereď

Na vašu žiadosť odpovieme bezplatne v lehote 30 dní. V odôvodnených prípadoch sa táto lehota môže predĺžiť o ďalšie dva mesiace.`,
  },
  {
    id: 'staznost',
    heading: '10. Právo podať sťažnosť',
    content: `Ak sa domnievate, že spracúvanie vašich osobných údajov je v rozpore s GDPR alebo zákonom č. 18/2018 Z. z., máte právo podať návrh na začatie konania dozornému orgánu:

Úrad na ochranu osobných údajov Slovenskej republiky
Hraničná 12, 820 07 Bratislava 27
Tel.: +421 2 3231 3214
E-mail: statny.dozor@pdp.gov.sk
Web: www.dataprotection.gov.sk`,
  },
  {
    id: 'bezpecnost',
    heading: '11. Bezpečnosť údajov',
    content: `Prijali sme primerané technické a organizačné opatrenia na ochranu vašich osobných údajov, vrátane:

• šifrovania prenosu údajov (HTTPS/TLS)
• obmedzenia prístupu k osobným údajom len na oprávnené osoby
• bezpečného hostingu s automatickými bezpečnostnými záplatami
• pravidelného hodnotenia a aktualizácie bezpečnostných opatrení`,
  },
  {
    id: 'zaverecne',
    heading: '12. Záverečné ustanovenia',
    content: `Tieto zásady ochrany osobných údajov sú platné a účinné od 1. marca 2026. Vyhradzujeme si právo tieto zásady kedykoľvek aktualizovať. O podstatných zmenách budeme informovať na tejto stránke s uvedením dátumu poslednej aktualizácie.`,
  },
];

/* ------------------------------------------------------------------ */
/*  Copy — EN                                                          */
/* ------------------------------------------------------------------ */

const EN_SECTIONS: Section[] = [
  {
    id: 'controller',
    heading: '1. Data Controller',
    content: `The controller of personal data pursuant to Regulation (EU) 2016/679 of the European Parliament and of the Council (hereinafter "GDPR") and Slovak Act No. 18/2018 Coll. on Personal Data Protection is:

FRISCO, s.r.o.
Námestie Slobody 1185/30, 926 01 Sereď, Slovakia
Company ID (IČO): 43 850 553 | Tax ID (DIČ): 2022486895
Commercial Register of the District Court Trnava, Section: Sro, Insert No.: 21013/T

Email: info@frisco.sk
Phone: +421 905 447 220, +421 905 740 700

(hereinafter "controller" or "we")

The controller is not required to appoint a Data Protection Officer (DPO) under Art. 37 GDPR. For data protection matters, please contact us at the email address above.`,
  },
  {
    id: 'scope',
    heading: '2. Scope of Personal Data Processed',
    content: `We only process personal data that you provide voluntarily or that arise from your use of our website:

a) Data provided directly by you:
• first and last name
• email address
• phone number
• property details (address, parameters, photographs — if provided as part of our collaboration)
• content of messages sent through the contact form

b) Data processed automatically:
• anonymised traffic data (no IP address, no cookies — via Vercel Analytics)
• selected website language (stored locally in your browser)`,
  },
  {
    id: 'purposes',
    heading: '3. Purposes and Legal Bases',
    content: `a) Property brokerage services
When you engage us for the sale, purchase, or rental of real estate, we process your data for the performance of a brokerage agreement or pre-contractual steps.
Legal basis: Art. 6(1)(b) GDPR

b) Responding to contact form inquiries
When you send us a message through the contact form, we process your name, email, phone number, and message content to respond to your inquiry.
Legal basis: Art. 6(1)(f) GDPR (legitimate interest — handling a prospective client's inquiry)

c) Compliance with legal obligations
We retain your data to the extent necessary to fulfil obligations under Slovak law, including:
• Act No. 431/2002 Coll. on Accounting
• Act No. 595/2003 Coll. on Income Tax
• Act No. 297/2008 Coll. on the Prevention of Money Laundering (AML)
Legal basis: Art. 6(1)(c) GDPR

d) Marketing communications
Only with your explicit consent do we send information about new listings and other updates. You may withdraw consent at any time.
Legal basis: Art. 6(1)(a) GDPR`,
  },
  {
    id: 'recipients',
    heading: '4. Data Recipients',
    content: `We may share your personal data, to the extent necessary, with the following categories of recipients:

• Portal Nehnuteľnosti.sk — for property advertising
• Legal advisors and notaries — during purchase/sale transactions
• Slovak Land Registry (Kataster) — for title transfer submissions
• IT service providers — Vercel, Inc. (website hosting), Supabase, Inc. (content management)
• Public authorities — only where required by law (tax authorities, courts, etc.)

We do not sell your data to third parties for marketing purposes.`,
  },
  {
    id: 'transfers',
    heading: '5. International Data Transfers',
    content: `Website hosting (Vercel) and content management (Supabase) may involve processing data on servers in the USA. These transfers are safeguarded by:

• EU-US Data Privacy Framework (European Commission adequacy decision)
• Standard Contractual Clauses pursuant to Art. 46(2)(c) GDPR

Google Maps is loaded on our site only after your explicit consent — no data is transmitted to Google before you click "Show map".`,
  },
  {
    id: 'retention',
    heading: '6. Data Retention',
    content: `We retain personal data only for as long as necessary to fulfil the processing purpose:

• Contact form data: 12 months from last communication
• Contractual data (brokerage): 5 years from the end of the contractual relationship
• Accounting and tax documents: 10 years (Act No. 431/2002 Coll.)
• AML documentation: 5 years (Act No. 297/2008 Coll.)
• Marketing consent: until withdrawn
• Analytics data (Vercel Analytics): fully anonymised, no personal data

After the retention period expires, data is securely deleted or anonymised.`,
  },
  {
    id: 'cookies',
    heading: '7. Website Technologies',
    content: `a) Analytics (Vercel Web Analytics)
We use Vercel Web Analytics for traffic measurement. This service does not use cookies, does not collect IP addresses or any other personal data. All data is fully anonymised and aggregated.

b) Language storage
Your chosen site language is stored in your browser's local storage (localStorage). This is a technically necessary setting that is not transmitted to any server.

c) Google Maps
The interactive map loads only after your explicit consent by clicking the corresponding button. Before consent, only a static map preview (OpenStreetMap) is shown, which does not set any cookies. After consent, Google may process data according to its own Privacy Policy (policies.google.com/privacy). Your consent is remembered in localStorage so we do not ask repeatedly.

d) Typography
All fonts used on the site are downloaded and self-hosted on our server. No connection to external services (e.g. Google Fonts) is established.

e) Supabase
A content management system for property listings. It operates exclusively server-side and does not collect any data from site visitors.

This website does not use tracking cookies or advertising technologies.`,
  },
  {
    id: 'automated',
    heading: '8. Automated Decision-Making and Profiling',
    content: `We do not use your personal data for automated individual decision-making or profiling within the meaning of Art. 22 GDPR.`,
  },
  {
    id: 'rights',
    heading: '9. Your Rights',
    content: `Under GDPR and Slovak Act No. 18/2018 Coll., you have the following rights:

a) Right of access — you have the right to obtain confirmation of whether we process your personal data and, if so, to receive a copy of such data (Art. 15 GDPR).

b) Right to rectification — you have the right to request correction of inaccurate or completion of incomplete personal data (Art. 16 GDPR).

c) Right to erasure — you have the right to request erasure of your personal data when the purpose of processing has ceased or when you have withdrawn consent (Art. 17 GDPR).

d) Right to restriction — you have the right to request restriction of data processing in cases specified in Art. 18 GDPR.

e) Right to data portability — you have the right to receive your personal data in a commonly used, machine-readable format and to transmit it to another controller (Art. 20 GDPR).

f) Right to object — you have the right to object to processing based on the controller's legitimate interest (Art. 21 GDPR).

g) Right to withdraw consent — where processing is based on consent, you have the right to withdraw it at any time without affecting the lawfulness of prior processing.

To exercise your rights, contact us at:
Email: info@frisco.sk
Mail: FRISCO, s.r.o., Námestie Slobody 1185/30, 926 01 Sereď, Slovakia

We will respond to your request free of charge within 30 days. In justified cases, this period may be extended by a further two months.`,
  },
  {
    id: 'complaint',
    heading: '10. Right to Lodge a Complaint',
    content: `If you believe the processing of your personal data violates GDPR or Slovak Act No. 18/2018 Coll., you have the right to lodge a complaint with the supervisory authority:

Office for Personal Data Protection of the Slovak Republic
Hraničná 12, 820 07 Bratislava 27, Slovakia
Tel.: +421 2 3231 3214
Email: statny.dozor@pdp.gov.sk
Web: www.dataprotection.gov.sk`,
  },
  {
    id: 'security',
    heading: '11. Data Security',
    content: `We have implemented appropriate technical and organisational measures to protect your personal data, including:

• encryption of data in transit (HTTPS/TLS)
• access to personal data restricted to authorised personnel only
• secure hosting with automated security patches
• regular assessment and update of security measures`,
  },
  {
    id: 'final',
    heading: '12. Final Provisions',
    content: `This Privacy Policy is valid and effective as of 1 March 2026. We reserve the right to update this policy at any time. Material changes will be communicated on this page with the date of the latest update.`,
  },
];

/* ------------------------------------------------------------------ */
/*  Copy — DE                                                          */
/* ------------------------------------------------------------------ */

const DE_SECTIONS: Section[] = [
  {
    id: 'verantwortlicher',
    heading: '1. Verantwortlicher',
    content: `Verantwortlicher für die Verarbeitung personenbezogener Daten gemäß der Verordnung (EU) 2016/679 (Datenschutz-Grundverordnung, nachfolgend „DSGVO") und dem slowakischen Gesetz Nr. 18/2018 Slg. über den Schutz personenbezogener Daten ist:

FRISCO, s.r.o.
Námestie Slobody 1185/30, 926 01 Sereď, Slowakei
IČO: 43 850 553 | DIČ: 2022486895
Handelsregister des Bezirksgerichts Trnava, Abteilung: Sro, Einlage Nr.: 21013/T

E-Mail: info@frisco.sk
Telefon: +421 905 447 220, +421 905 740 700

(nachfolgend „Verantwortlicher" oder „wir")

Der Verantwortliche ist nicht verpflichtet, einen Datenschutzbeauftragten (DSB) gemäß Art. 37 DSGVO zu bestellen. In Datenschutzangelegenheiten kontaktieren Sie uns bitte unter der oben genannten E-Mail-Adresse.`,
  },
  {
    id: 'umfang',
    heading: '2. Umfang der verarbeiteten personenbezogenen Daten',
    content: `Wir verarbeiten nur personenbezogene Daten, die Sie uns freiwillig mitteilen oder die durch die Nutzung unserer Website entstehen:

a) Von Ihnen direkt bereitgestellte Daten:
• Vor- und Nachname
• E-Mail-Adresse
• Telefonnummer
• Immobiliendaten (Adresse, Parameter, Fotos — falls im Rahmen der Zusammenarbeit bereitgestellt)
• Inhalt der über das Kontaktformular gesendeten Nachrichten

b) Automatisch verarbeitete Daten:
• anonymisierte Besucherdaten (ohne IP-Adresse, ohne Cookies — über Vercel Analytics)
• gewählte Sprache der Website (lokal in Ihrem Browser gespeichert)`,
  },
  {
    id: 'zwecke',
    heading: '3. Zwecke und Rechtsgrundlagen der Verarbeitung',
    content: `a) Immobilienvermittlung
Wenn Sie uns mit dem Verkauf, Kauf oder der Vermietung einer Immobilie beauftragen, verarbeiten wir Ihre Daten zur Erfüllung des Vermittlungsvertrags oder zur Durchführung vorvertraglicher Maßnahmen.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO

b) Bearbeitung von Kontaktanfragen
Wenn Sie uns eine Nachricht über das Kontaktformular senden, verarbeiten wir Ihren Namen, Ihre E-Mail, Telefonnummer und den Nachrichteninhalt, um Ihre Anfrage zu beantworten.
Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse — Beantwortung einer Anfrage eines potenziellen Kunden)

c) Erfüllung gesetzlicher Pflichten
Wir bewahren Ihre Daten im erforderlichen Umfang auf, um Pflichten nach slowakischem Recht zu erfüllen, insbesondere:
• Gesetz Nr. 431/2002 Slg. über die Buchführung
• Gesetz Nr. 595/2003 Slg. über die Einkommensteuer
• Gesetz Nr. 297/2008 Slg. über die Verhinderung von Geldwäsche (AML)
Rechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO

d) Marketingkommunikation
Nur mit Ihrer ausdrücklichen Einwilligung informieren wir Sie über neue Immobilienangebote und andere Neuigkeiten. Die Einwilligung können Sie jederzeit widerrufen.
Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO`,
  },
  {
    id: 'empfaenger',
    heading: '4. Empfänger personenbezogener Daten',
    content: `Wir können Ihre personenbezogenen Daten im erforderlichen Umfang folgenden Empfängerkategorien zugänglich machen:

• Portal Nehnuteľnosti.sk — für Immobilienanzeigen
• Rechtsberater und Notare — bei Kauf-/Verkaufstransaktionen
• Slowakisches Katasteramt — bei Anträgen auf Eigentumsübertragung
• IT-Dienstleister — Vercel, Inc. (Website-Hosting), Supabase, Inc. (Inhaltsverwaltung)
• Behörden — nur wenn gesetzlich vorgeschrieben (Finanzamt, Gerichte u. Ä.)

Wir verkaufen Ihre Daten nicht an Dritte zu Marketingzwecken.`,
  },
  {
    id: 'uebermittlung',
    heading: '5. Übermittlung personenbezogener Daten in Drittländer',
    content: `Das Website-Hosting (Vercel) und die Inhaltsverwaltung (Supabase) können eine Datenverarbeitung auf Servern in den USA umfassen. Diese Übermittlung ist abgesichert durch:

• EU-US Data Privacy Framework (Angemessenheitsbeschluss der Europäischen Kommission)
• Standardvertragsklauseln gemäß Art. 46 Abs. 2 lit. c DSGVO

Google Maps wird auf unserer Website ausschließlich nach Ihrer ausdrücklichen Einwilligung geladen — vor dem Klick auf „Karte anzeigen" werden keine Daten an Google übermittelt.`,
  },
  {
    id: 'speicherdauer',
    heading: '6. Speicherdauer',
    content: `Wir speichern personenbezogene Daten nur so lange, wie es für den Verarbeitungszweck erforderlich ist:

• Kontaktformulardaten: 12 Monate ab der letzten Kommunikation
• Vertragsdaten (Vermittlung): 5 Jahre nach Ende des Vertragsverhältnisses
• Buchhaltungs- und Steuerunterlagen: 10 Jahre (Gesetz Nr. 431/2002 Slg.)
• AML-Dokumentation: 5 Jahre (Gesetz Nr. 297/2008 Slg.)
• Marketingeinwilligung: bis zum Widerruf
• Analytische Daten (Vercel Analytics): vollständig anonymisiert, keine personenbezogenen Daten

Nach Ablauf der Speicherdauer werden die Daten sicher gelöscht oder anonymisiert.`,
  },
  {
    id: 'cookies',
    heading: '7. Website-Technologien',
    content: `a) Analytik (Vercel Web Analytics)
Wir verwenden Vercel Web Analytics zur Verkehrsmessung. Dieser Dienst setzt keine Cookies, erhebt keine IP-Adressen und verarbeitet keine personenbezogenen Daten. Alle Daten sind vollständig anonymisiert und aggregiert.

b) Sprachspeicherung
Die gewählte Sprache der Website wird im lokalen Speicher Ihres Browsers (localStorage) gespeichert. Dies ist eine technisch notwendige Einstellung, die an keinen Server übermittelt wird.

c) Google Maps
Die interaktive Karte wird erst nach Ihrer ausdrücklichen Einwilligung durch Klick auf die entsprechende Schaltfläche geladen. Vor der Einwilligung wird nur eine statische Kartenvorschau (OpenStreetMap) angezeigt, die keine Cookies setzt. Nach der Einwilligung kann Google Daten gemäß den eigenen Datenschutzrichtlinien verarbeiten (policies.google.com/privacy). Ihre Einwilligung wird in localStorage gespeichert, damit wir Sie nicht wiederholt fragen.

d) Typografie
Alle auf der Website verwendeten Schriftarten werden heruntergeladen und auf unserem Server gehostet. Es besteht keine Verbindung zu externen Diensten (z. B. Google Fonts).

e) Supabase
Ein Content-Management-System für Immobilieneinträge. Es arbeitet ausschließlich serverseitig und erhebt keine Daten von Website-Besuchern.

Diese Website verwendet keine Tracking-Cookies oder Werbetechnologien.`,
  },
  {
    id: 'automatisiert',
    heading: '8. Automatisierte Entscheidungsfindung und Profiling',
    content: `Wir verwenden Ihre personenbezogenen Daten nicht für automatisierte Einzelentscheidungen oder Profiling im Sinne von Art. 22 DSGVO.`,
  },
  {
    id: 'rechte',
    heading: '9. Ihre Rechte',
    content: `Gemäß DSGVO und dem slowakischen Gesetz Nr. 18/2018 Slg. haben Sie folgende Rechte:

a) Recht auf Auskunft — Sie haben das Recht, eine Bestätigung darüber zu erhalten, ob wir Ihre personenbezogenen Daten verarbeiten, und gegebenenfalls eine Kopie dieser Daten zu erhalten (Art. 15 DSGVO).

b) Recht auf Berichtigung — Sie haben das Recht, die Berichtigung unrichtiger oder die Vervollständigung unvollständiger personenbezogener Daten zu verlangen (Art. 16 DSGVO).

c) Recht auf Löschung — Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu verlangen, wenn der Verarbeitungszweck entfallen ist oder Sie Ihre Einwilligung widerrufen haben (Art. 17 DSGVO).

d) Recht auf Einschränkung der Verarbeitung — Sie haben das Recht, die Einschränkung der Verarbeitung in den in Art. 18 DSGVO genannten Fällen zu verlangen.

e) Recht auf Datenübertragbarkeit — Sie haben das Recht, Ihre personenbezogenen Daten in einem gängigen, maschinenlesbaren Format zu erhalten und an einen anderen Verantwortlichen zu übermitteln (Art. 20 DSGVO).

f) Widerspruchsrecht — Sie haben das Recht, der Verarbeitung aufgrund berechtigter Interessen des Verantwortlichen zu widersprechen (Art. 21 DSGVO).

g) Recht auf Widerruf der Einwilligung — sofern die Verarbeitung auf einer Einwilligung beruht, haben Sie das Recht, diese jederzeit zu widerrufen, ohne dass die Rechtmäßigkeit der bisherigen Verarbeitung berührt wird.

Um Ihre Rechte auszuüben, kontaktieren Sie uns unter:
E-Mail: info@frisco.sk
Schriftlich: FRISCO, s.r.o., Námestie Slobody 1185/30, 926 01 Sereď, Slowakei

Wir werden Ihre Anfrage kostenlos innerhalb von 30 Tagen beantworten. In begründeten Fällen kann diese Frist um weitere zwei Monate verlängert werden.`,
  },
  {
    id: 'beschwerde',
    heading: '10. Beschwerderecht',
    content: `Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO oder das slowakische Gesetz Nr. 18/2018 Slg. verstößt, haben Sie das Recht, eine Beschwerde bei der Aufsichtsbehörde einzureichen:

Amt für den Schutz personenbezogener Daten der Slowakischen Republik
Hraničná 12, 820 07 Bratislava 27, Slowakei
Tel.: +421 2 3231 3214
E-Mail: statny.dozor@pdp.gov.sk
Web: www.dataprotection.gov.sk`,
  },
  {
    id: 'sicherheit',
    heading: '11. Datensicherheit',
    content: `Wir haben geeignete technische und organisatorische Maßnahmen zum Schutz Ihrer personenbezogenen Daten ergriffen, darunter:

• Verschlüsselung der Datenübertragung (HTTPS/TLS)
• Zugang zu personenbezogenen Daten nur für befugte Personen
• sicheres Hosting mit automatischen Sicherheitsupdates
• regelmäßige Bewertung und Aktualisierung der Sicherheitsmaßnahmen`,
  },
  {
    id: 'schlussbestimmungen',
    heading: '12. Schlussbestimmungen',
    content: `Diese Datenschutzerklärung ist gültig und wirksam ab dem 1. März 2026. Wir behalten uns das Recht vor, diese Erklärung jederzeit zu aktualisieren. Wesentliche Änderungen werden auf dieser Seite mit dem Datum der letzten Aktualisierung bekannt gegeben.`,
  },
];

/* ------------------------------------------------------------------ */
/*  Assembled copy map                                                 */
/* ------------------------------------------------------------------ */

const PRIVACY_COPY: Record<Lang, PrivacyCopy> = {
  sk: {
    title: 'Ochrana osobných údajov',
    subtitle: 'Zásady spracúvania osobných údajov spoločnosti FRISCO, s.r.o.',
    lastUpdated: 'Posledná aktualizácia: 1. marca 2026',
    tocTitle: 'Obsah dokumentu',
    back: 'Domov',
    sections: SK_SECTIONS,
  },
  en: {
    title: 'Privacy Policy',
    subtitle: 'Personal data processing policy of FRISCO, s.r.o.',
    lastUpdated: 'Last updated: 1 March 2026',
    tocTitle: 'Table of contents',
    back: 'Home',
    sections: EN_SECTIONS,
  },
  de: {
    title: 'Datenschutzerklärung',
    subtitle: 'Datenschutzrichtlinie der FRISCO, s.r.o.',
    lastUpdated: 'Letzte Aktualisierung: 1. März 2026',
    tocTitle: 'Inhaltsverzeichnis',
    back: 'Startseite',
    sections: DE_SECTIONS,
  },
};

/* ------------------------------------------------------------------ */
/*  Section icon map                                                   */
/* ------------------------------------------------------------------ */

const SECTION_ICONS: Record<string, React.ElementType> = {
  prevadzkovatel: Building2, controller: Building2, verantwortlicher: Building2,
  rozsah: Database, scope: Database, umfang: Database,
  ucely: Scale, purposes: Scale, zwecke: Scale,
  prijemcovia: Users, recipients: Users, empfaenger: Users,
  prenos: Globe, transfers: Globe, uebermittlung: Globe,
  doba: Clock, retention: Clock, speicherdauer: Clock,
  cookies: Cookie,
  automatizovane: Bot, automated: Bot, automatisiert: Bot,
  prava: ShieldCheck, rights: ShieldCheck, rechte: ShieldCheck,
  staznost: AlertTriangle, complaint: AlertTriangle, beschwerde: AlertTriangle,
  bezpecnost: Lock, security: Lock, sicherheit: Lock,
  zaverecne: FileText, final: FileText, schlussbestimmungen: FileText,
};

/* Sections that get a special "card" treatment */
const CARD_SECTIONS = new Set([
  'prevadzkovatel', 'controller', 'verantwortlicher',
  'staznost', 'complaint', 'beschwerde',
]);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PrivacyContent() {
  const { language } = useLanguage();
  const copy = PRIVACY_COPY[language];

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="max-w-3xl mb-10 story-rise stagger-1">
            <LocaleLink
              href="/"
              className="text-accent-red text-sm font-mono tracking-widest uppercase hover:text-charcoal transition-colors mb-6 inline-block"
            >
              ← {copy.back}
            </LocaleLink>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal tracking-tight leading-[1.1] mb-3">
              {copy.title}
            </h1>
            <p className="text-charcoal/70 text-lg md:text-xl leading-relaxed mb-2">
              {copy.subtitle}
            </p>
            <p className="text-charcoal/45 text-sm font-mono tracking-wide">
              {copy.lastUpdated}
            </p>
          </div>

          <nav className="mb-10 rounded-2xl border border-charcoal/10 bg-white p-5 md:p-6 story-soft stagger-2">
            <h2 className="text-[11px] font-bold text-charcoal/55 uppercase tracking-[0.2em] mb-4">
              {copy.tocTitle}
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
              {copy.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-charcoal/70 hover:text-accent-red text-sm transition-colors leading-snug"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-7 md:space-y-8 story-soft stagger-3 max-w-4xl">
            {copy.sections.map((section) => {
              const Icon = SECTION_ICONS[section.id];
              const isCard = CARD_SECTIONS.has(section.id);

              return (
                <article
                  key={section.id}
                  id={section.id}
                  className={`scroll-mt-28 rounded-2xl border p-5 md:p-7 ${isCard ? 'border-accent-red/25 bg-accent-red/[0.03]' : 'border-charcoal/10 bg-white'}`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {Icon && (
                      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-accent-red/10 text-accent-red flex items-center justify-center mt-0.5">
                        <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                      </div>
                    )}
                    <h2 className="text-lg md:text-xl font-bold text-charcoal leading-snug pt-1">
                      {section.heading}
                    </h2>
                  </div>

                  <div className="text-charcoal/80 text-[15px] md:text-base leading-[1.75] whitespace-pre-line">
                    {section.content}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-12 pt-6 border-t border-charcoal/10 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-charcoal/50 hover:text-accent-red text-sm font-mono tracking-widest uppercase transition-colors"
            >
              ↑ {copy.back}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
