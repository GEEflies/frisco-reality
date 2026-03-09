-- Backfill lang_data with English and German translations for all 12 active listings.
-- Translations produced manually; future listings will be auto-translated via DeepL Free API.

-- 1. Predáme chatku s pozemkom na Vinohradoch nad Váhom
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', 'Cottage with land for sale in Vinohrady nad Váhom',
    'description', E'We offer for sale a 60 m² cottage with a 541.25 m² plot of land. The cottage is in original but well-maintained condition, ready for immediate use. The ground floor features a kitchen, living room, and a small bathroom with WC; upstairs there is a large room. All utilities connected, septic tank. Furnishings (see photos) are included.\n\nAt the entrance there is a pantry. Located in a prime area with beautiful views where you will appreciate the peace and proximity to nature.\n\nOn the plot there is a vineyard with a cellared cottage.\n\nAvailable immediately! Mortgage financing possible.\n\nFor viewings, please contact us at +421 905 447 220.'
  ),
  'de', jsonb_build_object(
    'title', 'Ferienhaus mit Grundstück zum Verkauf in Vinohrady nad Váhom',
    'description', E'Wir bieten ein 60 m² großes Ferienhaus mit einem 541,25 m² großen Grundstück zum Verkauf an. Das Haus ist in originalem, aber gutem Zustand und sofort nutzbar. Im Erdgeschoss befinden sich Küche, Wohnzimmer sowie ein kleines Bad mit WC; im Obergeschoss ein großes Zimmer. Alle Versorgungsleitungen vorhanden, Senkgrube. Einrichtung (siehe Fotos) inklusive.\n\nAm Eingang befindet sich eine Speisekammer. In Top-Lage mit wunderschöner Aussicht, wo Sie die Ruhe und Naturnähe genießen werden.\n\nAuf dem Grundstück befindet sich ein Weinberg mit unterkellertem Häuschen.\n\nSofort verfügbar! Hypothekenfinanzierung möglich.\n\nBei Interesse an einer Besichtigung kontaktieren Sie uns unter +421 905 447 220.'
  )
) WHERE id = 'c723eea0-81b8-41b5-9264-890d1c37ab86';

-- 2. Predáme stavebný pozemok v obci Šoporňa
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', 'Building plot for sale in Šoporňa',
    'description', E'Exclusively with us — a 739 m² building plot with a valid building permit (effective since 13 May 2022). Located in the village of Šoporňa. Plot width: 19 m, length: 39 m.\n\nThe plot is fenced with all utilities connected (water, electricity, sewerage).\n\nSituated in a newly developed area near a primary school, kindergarten, grocery store and post office.\n\nFor inquiries, contact us at +421 905 447 220.'
  ),
  'de', jsonb_build_object(
    'title', 'Baugrundstück zum Verkauf in Šoporňa',
    'description', E'Exklusiv bei uns — ein 739 m² großes Baugrundstück mit gültiger Baugenehmigung (rechtskräftig seit 13.05.2022). Es befindet sich in der Gemeinde Šoporňa. Grundstücksbreite: 19 m, Länge: 39 m.\n\nDas Grundstück ist eingezäunt, alle Versorgungsleitungen vorhanden (Wasser, Strom, Kanalisation).\n\nIn einer neu errichteten Wohngegend nahe Grundschule, Kindergarten, Lebensmittelgeschäft und Post.\n\nBei Interesse kontaktieren Sie uns unter +421 905 447 220.'
  )
) WHERE id = 'ffe442aa-a753-47ce-b5a1-525d643bcf8f';

-- 3. Prenajmeme skladovo-výrobnú halu s kanceláriami a žeriavom v Seredi (rent)
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', 'Warehouse and production hall with offices and crane for rent in Sereď',
    'description', E'For rent: a hall with a portal crane and an administrative annex in Sereď, Galanta district. The hall measures 24.40 x 15.52 m, is single-storey with a gabled roof. It features a remote-controlled portal crane with a capacity of 6.3 tonnes. The building forms a single operational unit with a separate truck entrance from the front and a personnel entrance.\n\nThe annex includes administrative and social facilities, is two-storey, insulated with air conditioning, and fully furnished.\n\nLayout: ground floor — entrance hall, large office, kitchenette, separate bathroom with WC, and a utility room under the stairs with an electric boiler and water heater. Upper floor — hallway, 2 offices and a small storage room.\n\nThe hall with annex was approved for use in 2012. The property is situated on a 1,187 m² plot.'
  ),
  'de', jsonb_build_object(
    'title', 'Lager- und Produktionshalle mit Büros und Kran zur Miete in Sereď',
    'description', E'Zur Miete: eine Halle mit Portalkran und Verwaltungsanbau in Sereď, Bezirk Galanta. Die Halle hat eine Grundfläche von 24,40 x 15,52 m, ist eingeschossig mit Satteldach. In der Halle befindet sich ein ferngesteuerter Portalkran mit einer Tragfähigkeit von 6,3 Tonnen. Das Gebäude bildet eine zusammenhängende Betriebseinheit mit separater LKW-Einfahrt und Personeneingang.\n\nDer Anbau umfasst Verwaltungs- und Sozialräume, ist zweigeschossig, gedämmt und klimatisiert, komplett eingerichtet.\n\nAufteilung: Erdgeschoss — Eingangsflur, großes Büro, Küchenzeile, separates Bad mit WC, Technikraum unter der Treppe mit Elektrokessel und Warmwasserbereiter. Obergeschoss — Flur, 2 Büros und ein kleiner Lagerraum.\n\nDie Halle mit Anbau wurde 2012 genehmigt. Das Objekt befindet sich auf einem 1.187 m² großen Grundstück.'
  )
) WHERE id = 'bda5c150-bcae-4817-a97a-f55ed69b9f84';

-- 4. Predáme starší rodinný dom s veľkým pozemkom v obci Váhovce
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', 'Older family house with large plot for sale in Váhovce',
    'description', E'For sale: an older family house in Váhovce on a 1,543 m² plot. Built in 1925 but liveable! Layout includes a veranda, kitchen, 2 pantries, bathroom with a built-in shower, separate WC, and 4 connecting rooms. Heated with gas convectors.\n\nPlot dimensions: 103 m long, 15 m wide. All utilities on the plot — well water, electricity, gas, garage, and shed.\n\nOption to divide the plot into separate parcels for building family houses.\n\nFor viewings, contact us at +421 905 447 220.\nMortgage financing available — we handle everything in one place.'
  ),
  'de', jsonb_build_object(
    'title', 'Älteres Einfamilienhaus mit großem Grundstück zum Verkauf in Váhovce',
    'description', E'Zum Verkauf: ein älteres Einfamilienhaus in Váhovce auf einem 1.543 m² großen Grundstück. Baujahr 1925, aber bewohnbar! Aufteilung: Veranda, Küche, 2 Speisekammern, Bad mit gemauerter Dusche, separates WC und 4 Durchgangszimmer. Beheizung mit Gaskonvektoren.\n\nGrundstücksmaße: 103 m lang, 15 m breit. Alle Versorgungsleitungen vorhanden — Brunnenwasser, Strom, Gas, Garage und Schuppen.\n\nMöglichkeit der Teilung des Grundstücks in separate Bauparzellen.\n\nFür Besichtigungen kontaktieren Sie uns unter +421 905 447 220.\nHypothekenfinanzierung möglich — wir erledigen alles aus einer Hand.'
  )
) WHERE id = '714b9bad-2899-42d2-9155-c47ad1cde9ca';

-- 5. Predáme veľkú chatu s pozemkom v Seredi
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', 'Large cottage with land for sale in Sereď',
    'description', E'We offer for sale a 70 m² brick garden cottage on a 328 m² plot in Sereď. Layout: entrance hall, living room, kitchen with pantry, bedroom, and bathroom with WC.\n\nSuitable for year-round living. Solid fuel heating — wood-burning stove. Outside there is a seating area and barbecue.\n\nLocated in the garden colony area.\n\nFor inquiries, contact us at +421 905 447 220.'
  ),
  'de', jsonb_build_object(
    'title', 'Großes Ferienhaus mit Grundstück zum Verkauf in Sereď',
    'description', E'Wir bieten ein 70 m² großes gemauertes Gartenhaus auf einem 328 m² großen Grundstück in Sereď zum Verkauf an. Aufteilung: Eingangsflur, Wohnzimmer, Küche mit Speisekammer, Schlafzimmer sowie Bad mit WC.\n\nGeeignet für ganzjähriges Wohnen. Festbrennstoffheizung — Kaminofen. Draußen Sitzbereich und Grill.\n\nIn der Kleingartensiedlung gelegen.\n\nBei Interesse kontaktieren Sie uns unter +421 905 447 220.'
  )
) WHERE id = 'cb948597-3b4f-45e1-a860-1e001a25ab5d';

-- 6. Predáme pozemok so stavebným povolením v Terchovej
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', 'Plot with building permit for sale in Terchová',
    'description', E'For sale: a plot with a project and building permit for a three-storey twin cottage. Located in the Jelenia Šípková Roveň area, near the Valchárovci bus stop — Jánošík''s House is a 20-minute walk along a forest path.\n\nSituated in a newly created area beyond the stream with 6 plots sharing a common access road. Each plot owner also owns 1/6 of the access road.\n\nThe plot is divided into: building land — 440 m² (already removed from agricultural fund) + 266 m² permanent grassland + 84.66 m² share of the access road.\n\nPublic water connection (water shaft included), active electricity connection (with meter).\n\nThe plot is on a slope (already reinforced by the seller), allowing a three-storey construction. Building permit valid until September 2026.\n\nReady for construction immediately.\n\nFor inquiries, contact us at +421 905 447 220 or +421 905 740 700.'
  ),
  'de', jsonb_build_object(
    'title', 'Grundstück mit Baugenehmigung zum Verkauf in Terchová',
    'description', E'Zum Verkauf: ein Grundstück mit Projekt und Baugenehmigung für ein dreigeschossiges Doppelferienhaus. Gelegen in der Lokalität Jelenia Šípková Roveň, nahe der Bushaltestelle Valchárovci — Jánošíks Haus ist 20 Gehminuten über einen Waldweg erreichbar.\n\nIn einer neu erschlossenen Lage hinter dem Bach mit 6 Grundstücken und gemeinsamer Zufahrtsstraße. Jeder Grundstückseigentümer besitzt auch 1/6 der Zufahrtsstraße.\n\nDas Grundstück ist aufgeteilt in: Bauland — 440 m² (bereits aus dem Bodenfonds herausgenommen) + 266 m² Dauergrünland + 84,66 m² Anteil an der Zufahrtsstraße.\n\nÖffentlicher Wasseranschluss (Wasserschacht im Preis inbegriffen), aktiver Stromanschluss (mit Zähler).\n\nDas Grundstück liegt am Hang (bereits vom Verkäufer befestigt), wodurch eine dreigeschossige Bebauung möglich ist. Baugenehmigung gültig bis September 2026.\n\nSofort bebaubar.\n\nBei Interesse kontaktieren Sie uns unter +421 905 447 220 oder +421 905 740 700.'
  )
) WHERE id = '66113066-dcb9-4a10-b48f-ab6981fd35c3';

-- 7. Predáme skladovo-výrobnú halu s kanceláriami a žeriavom v Seredi (sale)
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', 'Warehouse and production hall with offices and crane for sale in Sereď',
    'description', E'For sale: a hall with a portal crane and an administrative annex in Sereď, Galanta district. The hall measures 24.40 x 15.52 m, is single-storey with a gabled roof. It features a remote-controlled portal crane with a capacity of 6.3 tonnes. The building forms a single operational unit with a separate truck entrance from the front and a personnel entrance.\n\nThe annex includes administrative and social facilities, is two-storey, insulated with air conditioning, and fully furnished.\n\nLayout: ground floor — entrance hall, large office, kitchenette, separate bathroom with WC, and a utility room under the stairs with an electric boiler and water heater. Upper floor — hallway, 2 offices and a small storage room.\n\nThe hall with annex was approved for use in 2012. The property is situated on a 1,187 m² plot.\n\nReverse charge VAT applies — for VAT payers under § 69 para. 12.'
  ),
  'de', jsonb_build_object(
    'title', 'Lager- und Produktionshalle mit Büros und Kran zum Verkauf in Sereď',
    'description', E'Zum Verkauf: eine Halle mit Portalkran und Verwaltungsanbau in Sereď, Bezirk Galanta. Die Halle hat eine Grundfläche von 24,40 x 15,52 m, ist eingeschossig mit Satteldach. In der Halle befindet sich ein ferngesteuerter Portalkran mit einer Tragfähigkeit von 6,3 Tonnen. Das Gebäude bildet eine zusammenhängende Betriebseinheit mit separater LKW-Einfahrt und Personeneingang.\n\nDer Anbau umfasst Verwaltungs- und Sozialräume, ist zweigeschossig, gedämmt und klimatisiert, komplett eingerichtet.\n\nAufteilung: Erdgeschoss — Eingangsflur, großes Büro, Küchenzeile, separates Bad mit WC, Technikraum unter der Treppe mit Elektrokessel und Warmwasserbereiter. Obergeschoss — Flur, 2 Büros und ein kleiner Lagerraum.\n\nDie Halle mit Anbau wurde 2012 genehmigt. Das Objekt befindet sich auf einem 1.187 m² großen Grundstück.\n\nUmgekehrte Steuerschuldnerschaft — für USt-Pflichtige gem. § 69 Abs. 12.'
  )
) WHERE id = '6afc4add-ac5c-49cc-af4a-de68b58926fb';

-- 8. Prenajmeme 3-izbový byt v Seredi
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', '3-bedroom apartment for rent in Sereď',
    'description', E'We offer for rent a 3-room apartment in Sereď on Námestie Slobody. Located on the ground floor of an apartment building. The apartment is 64 m² and fully furnished.\n\nAvailable immediately!\n\nUpon signing the lease: deposit €600, one month''s rent in advance €600, and a one-time agency fee of €100.\n\nMaximum occupancy: 2 adults and a child.\n\nFor inquiries, contact us at +421 905 740 700.'
  ),
  'de', jsonb_build_object(
    'title', '3-Zimmer-Wohnung zur Miete in Sereď',
    'description', E'Wir bieten eine 3-Zimmer-Wohnung zur Miete in Sereď am Námestie Slobody an. Sie befindet sich im Erdgeschoss eines Wohnhauses. Die Wohnung hat 64 m² und ist komplett möbliert.\n\nSofort verfügbar!\n\nBei Vertragsunterzeichnung: Kaution 600 €, eine Monatsmiete im Voraus 600 € und eine einmalige Agenturgebühr von 100 €.\n\nMaximale Belegung: 2 Erwachsene und ein Kind.\n\nBei Interesse kontaktieren Sie uns unter +421 905 740 700.'
  )
) WHERE id = '1d4fa3aa-c2fa-43e6-b9a8-5669c185472b';

-- 9. Predáme 1-izb. byt prerobený na 2-izb. v Seredi
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', '1-bedroom apartment converted to 2-bedroom for sale in Sereď',
    'description', E'Exclusively with us — a 1-bedroom apartment converted to a 2-bedroom in Sereď on Dolnomajerská street. Fully renovated and furnished. Area: 37 m², 4th floor of 5. Northeast-facing.\n\nJust steps from a primary school, kindergarten and art school. City centre within easy reach.\n\nFor viewings, contact us at +421 905 447 220.\n\nAVAILABLE IMMEDIATELY!'
  ),
  'de', jsonb_build_object(
    'title', '1-Zimmer-Wohnung umgebaut zur 2-Zimmer-Wohnung zum Verkauf in Sereď',
    'description', E'Exklusiv bei uns — eine 1-Zimmer-Wohnung, umgebaut zur 2-Zimmer-Wohnung in Sereď in der Dolnomajerská-Straße. Komplett renoviert und möbliert. Fläche: 37 m², 4. OG von 5. Nordost-Ausrichtung.\n\nNur wenige Meter von Grundschule, Kindergarten und Kunstschule entfernt. Stadtzentrum in unmittelbarer Nähe.\n\nFür Besichtigungen kontaktieren Sie uns unter +421 905 447 220.\n\nSOFORT VERFÜGBAR!'
  )
) WHERE id = '354176ab-cf3f-4500-a2ce-a2a467445a08';

-- 10. Prenajmeme 4-izb. rodinný dom v Seredi
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', '4-bedroom family house for rent in Sereď',
    'description', E'For rent: a fully furnished 4-room family house in Sereď on Dolnočepeňská street.\n\nUpon signing the lease: deposit €1,100, a one-time agency fee of €100, and one month''s rent in advance.\n\nFor inquiries, contact us at +421 905 740 700.'
  ),
  'de', jsonb_build_object(
    'title', '4-Zimmer-Einfamilienhaus zur Miete in Sereď',
    'description', E'Zur Miete: ein komplett eingerichtetes 4-Zimmer-Einfamilienhaus in Sereď in der Dolnočepeňská-Straße.\n\nBei Vertragsunterzeichnung: Kaution 1.100 €, einmalige Agenturgebühr 100 € und eine Monatsmiete im Voraus.\n\nBei Interesse kontaktieren Sie uns unter +421 905 740 700.'
  )
) WHERE id = 'f0067056-59d5-43e0-ba07-ed2f6eea2202';

-- 11. Predáme RD s väčším pozemkom vo Veľkých Úľanoch
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', 'Family house with large plot for sale in Veľké Úľany',
    'description', E'We offer for sale not only a family house but also a building formerly used as a pizzeria and a garage, all on a 1,072 m² plot. The pizzeria has one larger room and a bathroom with WC (can be used as a separate residential unit).\n\nThe house was renovated — new roof in 2018, plastic windows and interior refurbished. Ground floor has new electrical wiring and fuse box.\n\nLayout: ground floor — entrance hall, hallway, 2 bedrooms, living room, bathroom, WC, kitchen, dining room.\n\n1st floor — 2 large mirrored rooms with smaller rooms (usable as rooms or walk-in closets), 1 unfinished attic room. Access to a balcony with a garden view from one of the rooms.\n\nThe house is partially cellared with 2 basement rooms.\n\nBehind the house is the former pizzeria, which was renovated with new electrical wiring. The same applies to the garage.\n\nAll utilities connected, well on the plot, and septic tank. The house is not connected to the sewer but connection is available nearby.\n\nThe village has full amenities — kindergarten, Slovak and Hungarian primary schools, doctor, pharmacy, grocery store, public swimming pool — all within a 10-minute walk from the centre.\n\nFor viewings, contact us at +421 905 447 220.'
  ),
  'de', jsonb_build_object(
    'title', 'Einfamilienhaus mit großem Grundstück zum Verkauf in Veľké Úľany',
    'description', E'Wir bieten zum Verkauf nicht nur ein Einfamilienhaus, sondern auch ein Gebäude, das als Pizzeria genutzt wurde, sowie eine Garage auf einem 1.072 m² großen Grundstück. Die Pizzeria hat einen größeren Raum und ein Bad mit WC (als separate Wohneinheit nutzbar).\n\nDas Haus wurde renoviert — neues Dach 2018, Kunststofffenster und Innenausbau erneuert. Im Erdgeschoss neue Elektrik mit Sicherungskasten.\n\nAufteilung: Erdgeschoss — Eingangsflur, Flur, 2 Schlafzimmer, Wohnzimmer, Bad, WC, Küche, Esszimmer.\n\n1. OG — 2 große Spiegelzimmer mit kleineren Räumen (als Zimmer oder begehbare Kleiderschränke nutzbar), 1 unvollendetes Dachzimmer. Zugang zum Balkon mit Gartenblick.\n\nDas Haus ist teilweise unterkellert mit 2 Kellerräumen.\n\nHinter dem Haus befindet sich die ehemalige Pizzeria, die renoviert wurde, ebenso die Garage — jeweils mit neuer Elektrik.\n\nAlle Versorgungsleitungen vorhanden, Brunnen auf dem Grundstück, Senkgrube. Das Haus ist nicht an die Kanalisation angeschlossen, ein Anschluss ist aber in der Nähe möglich.\n\nDie Gemeinde verfügt über vollständige Infrastruktur — Kindergarten, slowakische und ungarische Grundschule, Arzt, Apotheke, Lebensmittelgeschäft, Freibad — alles 10 Gehminuten vom Zentrum.\n\nFür Besichtigungen kontaktieren Sie uns unter +421 905 447 220.'
  )
) WHERE id = 'cc8007d6-8063-4e25-b35d-1f3046962c4d';

-- 12. Predáme 4-izb. rodinný dom s garážou v Seredi
UPDATE listings SET lang_data = jsonb_build_object(
  'en', jsonb_build_object(
    'title', '4-bedroom family house with garage for sale in Sereď',
    'description', E'For sale: a 4-bedroom family house in Sereď (Dolný Čepeň) on Sládkovičova street, on a 494 m² plot. The house has two above-ground floors and a basement with a garage, boiler room and workshop.\n\nLayout: entrance hall, hallway leading to the kitchen, living room, separate WC, and stairs to either the basement or upper floor. Upstairs: 3 separate rooms (2 with balconies) and a bathroom with bathtub.\n\nNotably quiet neighbourhood.\n\nFor viewings, contact us at +421 905 740 700.\n\nWe provide a full-service package — legal services, purchase agreements, property appraisals, and mortgage consulting to find you the best rate on the market.'
  ),
  'de', jsonb_build_object(
    'title', '4-Zimmer-Einfamilienhaus mit Garage zum Verkauf in Sereď',
    'description', E'Zum Verkauf: ein 4-Zimmer-Einfamilienhaus in Sereď (Dolný Čepeň) in der Sládkovičova-Straße auf einem 494 m² großen Grundstück. Das Haus verfügt über zwei Obergeschosse und einen Keller mit Garage, Heizraum und Werkstatt.\n\nAufteilung: Eingangsflur, Flur mit Zugang zur Küche, Wohnzimmer, separates WC sowie Treppen zum Keller oder Obergeschoss. Im Obergeschoss: 3 separate Zimmer (2 mit Balkon) und ein Badezimmer mit Badewanne.\n\nBesonders ruhige Wohnlage.\n\nFür Besichtigungen kontaktieren Sie uns unter +421 905 740 700.\n\nBei uns erhalten Sie alles aus einer Hand — Rechtsberatung, Kaufverträge, Sachverständigengutachten und Hypothekenberatung, um den besten Zinssatz auf dem Markt zu finden.'
  )
) WHERE id = '510fec01-75d9-4c00-882d-c7a76c4fef6c';
