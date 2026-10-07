# Stálá objednávka pro B2B zákazníky

Zrnovar (testovací obchod na Shopify) · Milan Kocáb, Product Owner · verze 1.1 k připomínkám · 6. 10. 2026

## 1. Kontext a problém

Kavárny objednávají u Zrnovaru přes Shopify B2B každý týden skoro totéž. Kavárna U Mostu bere každé pondělí zhruba 12 kg espresso směsi, 2 kg filtrové kávy a čisticí tablety.

**Co dnes kavárnu i Zrnovar trápí:**

- **Objednávka zabere zbytečně čas.** Kavárna ji pokaždé skládá znovu z katalogu a musí si pamatovat, co brala minule.
- **Buy again není dostatečný.** Kopíruje konkrétní minulou objednávku, ale požadovaná objednávka může být někde v dávné minulosti.
- **Kavárna zapomíná objednat.** Kávu pak doobjednává telefonem a obchodník řeší expresní dodání. Zrnovar se o výpadku dozví pozdě, nebo vůbec, pokud kavárna mezitím nakoupí jinde.

**Navrhujeme stálou objednávku.** Kavárna si jednou uloží, co obvykle bere, a objedná to jedním kliknutím nahoře na stránce Objednávky. V nastavený den jí přijde připomínka s odkazem. Obchodník Zrnovaru dostane upozornění, když kavárna po připomínce neobjedná.

## 2. Cíle

- **Kavárna** objedná obvyklé zboží rychle a bez chyb.
- **Zrnovar** má pravidelné a předvídatelné B2B tržby, méně expresních dodání po zapomenuté objednávce a včas pozná zákazníka, který přestal objednávat, dřív než odejde ke konkurenci.

**Cíl (SMART).** Do 3 měsíců od spuštění bude alespoň 30 % B2B objednávek pocházet ze stálé objednávky (štítek `standing-order`). Hodnotu 30 % potvrdíme s klientem.

**Měření.**

- **Využití.** Objednávky ze stálé objednávky dostanou štítek `standing-order`. Jejich počet uvidíme v adminu filtrem objednávek podle štítku.
- **Úspěšnost připomínek.** Otevření a prokliky ukáže nástroj, který připomínky posílá (marketingová automatizace Shopify nebo Klaviyo). Lokace, které po připomínce neobjednaly, zachytí Flow pro upozornění obchodníka (kapitola 4.1).
- **Rychlost objednání** Shopify nezměří, proto ji v této fázi nesledujeme.

> **Otázka pro vývoj:** Jde v Shopify Analytics vytvořit report s podílem objednávek se štítkem `standing-order` na všech B2B objednávkách? Pokud ne, budeme podíl počítat ručně z filtru.

## 3. User stories

**Jak to bude fungovat:**

1. Provozní vybere libovolnou objednávku z historie lokace, uloží ji jako stálou objednávku a upraví množství. Pokud lokace objednává opakovaně stejné produkty, systém jí vytvoření stálé objednávky sám nabídne.
2. Stálá objednávka patří **k lokaci firmy, ne k uživateli**. Uživatel s rolí Ordering only vidí jen své objednávky, takže by jinak stálou objednávku založenou manažerem neviděl.
3. V nastavený den přijde kontaktům lokace e-mail s tlačítkem Zobrazit a objednat.
4. Baristka klikne Objednat, vytvoří se košík s aktuálními cenami katalogu a otevře se checkout.
5. Zrnovar vidí, které objednávky přišly ze stálé objednávky. Když kavárna po připomínce neobjedná, obchodník dostane upozornění.

**Kdo s tím pracuje:**

- **Baristka nebo provozní** objednává mezi směnami, často z mobilu. Chce mít hotovo do minuty.
- **Majitel nebo manažer** chce vědět, co se objednává, ale nechce schvalovat každou objednávku kávy.
- **Obchodník Zrnovaru** potřebuje vědět, když kavárna neobjednala, aby mohl zavolat včas.

**Priority (MoSCoW)** určují rozsah první verze, na kterém se domluvíme s klientem. **Must** je podmínka spuštění, bez ní funkci nenasadíme. **Should** patří do první verze, pokud to odhad dovolí. **Could** uděláme, jen když zbude kapacita, jinak jde do další fáze.

### US-1 Objednat jedním kliknutím z horní části stránky Objednávky (Must)

Jako baristka chci hned po otevření Objednávek vidět naše stálé objednávky a jednu objednat, abych nemusela nic hledat ani skládat.

1. Nad seznamem objednávek je blok Stálé objednávky s názvem, počtem položek a orientační cenou podle aktuálního katalogu.
2. Objednat vytvoří košík v kontextu lokace a otevře checkout. Ceny, minima a platební podmínky odpovídají B2B nastavení lokace.
3. Objednávka je označená jako objednávka ze stálé objednávky (kvůli měření).
4. Pokud lokace stálou objednávku nemá, blok nabídne Vytvořit stálou objednávku.
5. Na mobilu je tlačítko Objednat vidět bez posouvání.

### US-2 Vytvořit stálou objednávku z historie objednávek (Must)

Jako provozní chci stálou objednávku vytvořit z kterékoli dřívější objednávky, abych ji nemusela skládat znovu, i když poslední objednávka byla jednorázová.

1. Tlačítko Vytvořit stálou objednávku (v bloku i na stránce Stálé objednávky) otevře seznam objednávek lokace s datem, počtem položek a cenou. Vyberu kteroukoli.
2. Stejnou akci Uložit jako stálou objednávku mám i v detailu objednávky.
3. Zadám název (předvyplněno „Týdenní objednávka“), upravím množství nebo položky odeberu.
4. Stálá objednávka patří k lokaci původní objednávky a vidí ji všechny kontakty lokace.
5. Položky, které už nejsou v katalogu lokace, se nepřenesou a uživatel o tom dostane zprávu.

### US-3 Upravit a smazat stálou objednávku (Must)

Jako provozní chci stálou objednávku upravit nebo smazat, abych ji udržela aktuální, když se změní naše spotřeba.

**Co lze upravit:**

- **Množství položky**, například z 12 kg na 18 kg, když kavárna začne prodávat víc kávy.
- **Odebrání položky**, například když kavárna přestane brát filtrovou kávu.
- **Název**, například „Pondělní káva“ místo „Týdenní objednávka“.

**Co upravit nelze:**

- **Přidat nový produkt.** K tomu je potřeba vyhledávání v katalogu, které je v US-7 (Could). Do té doby se nový produkt dostane do stálé objednávky vytvořením nové stálé objednávky z novější objednávky (US-2).
- **Změnit lokaci.** Stálá objednávka patří natrvalo k lokaci, ve které vznikla.
- **Nastavit připomínku.** To řeší US-4.

**Akceptační kritéria:**

1. Úpravy jsou na stránce Stálé objednávky v zákaznickém účtu, ve stejném formuláři jako při vytvoření (US-2).
2. Množství musí splnit pravidla katalogu, jinak uložení nejde a zobrazí se povolené množství.
3. Pokud se pravidla změní a položka je nesplňuje, zobrazí se „Minimum je nyní 12 kg, máte 6 kg“ a tlačítko Upravit na 12. Tlačítko změní uloženou stálou objednávku. Množství se nikdy nemění automaticky, protože jde o vyšší cenu. Dokud položka pravidla nesplní, stálou objednávku nejde objednat.
4. Odebrat nejde poslední položku. Stálá objednávka bez položek se místo toho smaže.
5. Je vidět, kdo a kdy naposledy upravoval. Při souběžné úpravě platí poslední uložení.
6. Smazání vyžaduje potvrzení. Lokace má nejvýše 5 stálých objednávek.

### US-4 Nastavit týdenní připomínku (Must)

Jako provozní chci zvolit den a čas připomínky, aby mi objednávka nevypadla z hlavy.

1. Připomínku zapnu, vypnu (např. na dovolenou) a zvolím den a čas. Výchozí je pondělí 8.00, Europe/Prague.
2. Připomínka přijde jen kontaktům lokace se souhlasem s e-mailovou komunikací.
3. E-mail obsahuje obecný text a tlačítko Zobrazit a objednat.
4. Název a položky stálé objednávky e-mail ukáže jen tehdy, pokud to zvolený způsob odesílání umí (ověří spike). Upozornění na nesplněné minimum nebo vyprodané zboží uživatel uvidí až po kliknutí na stálé objednávce (US-3, bod 3).

### US-5 Odkaz z připomínky vede rovnou na stálou objednávku (Must)

Jako baristka chci z e-mailu kliknout a hned objednat.

1. Přihlášenému se otevře stránka Stálé objednávky s danou objednávkou nahoře. Nepřihlášený se po přihlášení vrátí na stejné místo.
2. Odkaz neobsahuje citlivé údaje a bez přihlášení a přístupu k lokaci nic neukáže.

### US-6 Nabídnout stálou objednávku při opakované objednávce (Should)

Jako provozní chci, aby mi systém sám nabídl uložení objednávky, kterou dělám pravidelně, abych na to nemusela myslet.

1. Nabídka se zobrazí, pokud má lokace aspoň 2 objednávky se stejnou sadou produktů. Množství se neporovnává, jednorázová položka navíc shodu ruší.
2. Nezobrazí se, pokud lokace už má stálou objednávku se stejnými produkty.
3. Tlačítko otevře vytvoření stálé objednávky předvyplněné z aktuální objednávky.
4. Kde se nabídka zobrazí, rozhodneme podle odpovědi vývoje (kapitola 4.2).

### US-7 Přidat produkt a vytvořit stálou objednávku od nuly (Could)

Jako provozní chci do stálé objednávky přidat nový produkt nebo ji založit bez minulé objednávky.

1. Vyhledám produkt podle názvu nebo SKU. Nabídnou se jen varianty z katalogu lokace.
2. Platí pravidla množství jako v US-3.
3. Dokud tato story není hotová, nový produkt do stálé objednávky dostanu tak, že ji vytvořím znovu z novější objednávky (US-2).

### US-8 Obchodník vidí stálé objednávky zákazníka (Could)

Jako obchodník chci u firmy v adminu vidět její stálé objednávky, abych věděl, co a jak často bere.

### Okrajové případy (platí pro všechny stories)

| Situace | Chování |
|---|---|
| Položka není skladem | Označí se, uživatel zvolí Objednat bez ní. Stálá objednávka se nemění, příště se položka objedná znovu. Neplatí, pokud Zrnovar povolí prodej bez zásob. |
| Skladem je jen část (chce 12 kg, je 6 kg) | Nabídne se dostupné množství, pokud splňuje minimum. Jinak jako řádek výš. |
| Položka mimo katalog nebo smazaná | Označí se jako nedostupná, do košíku se nepřidá a nabídne se odebrání ze stálé objednávky. |
| Žádná položka není dostupná | Tlačítko Objednat je neaktivní s vysvětlením. |
| Změna ceny | Ceny se neukládají, vždy platí aktuální katalog. |
| Změna pravidel množství | Viz US-3, bod 3. |
| Firma má víc lokací | Uživatel vidí stálé objednávky lokace, za kterou právě nakupuje. |

## 4. Řešení

### 4.1 Co Shopify umí a jak to využijeme

Bez vývoje, jen nastavením:

| Potřeba | Řešení v Shopify | Stav |
|---|---|---|
| Velkoobchodní ceny | B2B katalog Velkoobchod Gastro (−15 %) | hotovo |
| Minimální odběr 6 kg, množstevní ceny od 12 a 24 kg | pravidla množství v katalogu, checkout je vynutí | hotovo |
| Platba na fakturu | platební podmínky Net 30 | hotovo |
| Kontrola objednávky obchodníkem (pokud ji klient bude chtít) | objednávky lokace chodí jako koncept | dle potřeby |
| Označení objednávek ze stálé objednávky | Flow: Order created → má atribut `source: standing-order` → štítek `standing-order` | nastavit |
| Upozornění obchodníka, že kavárna neobjednala | Flow: denně v 15.00 najde lokace, kterým před 48 h odešla připomínka a od té doby nepřišla žádná objednávka (ani ruční), a pošle interní e-mail | nastavit, ověřit čtení metaobjektů |
| Týdenní připomínka zákazníkovi | marketingová automatizace Shopify (Flow e-mail zákazníkovi poslat neumí) | ověřit, záložně Klaviyo nebo vlastní aplikace |
| Upozornění na docházející zboží | Flow: e-mail při poklesu zásob na 10 ks | hotovo |
| Prodej i bez zásob (vyprodání se kavárny netýká, dodá se později) | u produktu povolit „pokračovat v prodeji, když není skladem“ | rozhodne Zrnovar (otázka 5) |

### 4.2 Co vytvoříme

Shopify nemá uloženou šablonu objednávky. Buy again umí objednávku zopakovat, ale zákazník ji musí nejdřív dohledat v historii, a na to často nemá čas ani chuť. Stálá objednávka mu dá na jednom místě přehled o tom, co pravidelně objednává. Hotová aplikace z App Store naše požadavky nesplňuje, proto stálou objednávku vyvineme jako vlastní aplikaci.

**Návrh technického řešení** (finální podobu určí vývoj):

- Data: metaobjekt `standing_order` s odkazem na `company_location`, položkami (`variant_id`, `quantity`), nastavením připomínky, `last_reminder_sent_at` a `updated_by`. Obchodník ho vidí v adminu bez další aplikace.
- UI: Customer Account UI Extensions. Blok na stránce Objednávky (`customer-account.order-index.block.render`), akce v detailu objednávky (`customer-account.order.action.*`), stránka Stálé objednávky (`customer-account.page.render`).
- Košík: Storefront API `cartCreate` s `buyerIdentity.companyLocationId` a atributem `source: standing-order`, záložně cart permalink.

> **Otázka pro vývoj (US-6):** Klient si představuje, že nabídku „Uložit jako stálou objednávku“ dostane v e-mailu s potvrzením objednávky, pokud lokace už má v historii objednávku se stejnou sadou produktů. Vidí šablona potvrzení historii objednávek lokace v okamžiku odeslání? Pokud ne, navrhneme klientovi jednu z variant:
>
> - **A) Samostatný e-mail po objednávce** (marketingová automatizace nebo Klaviyo) s tlačítkem na předvyplněnou stálou objednávku.
> - **B) Nabídka v bloku na stránce Objednávky:** „Tuhle objednávku jste udělali už 2×. Uložit jako stálou?“ Blok historii vidí, takže je to jistě proveditelné.
>
> Která varianta je proveditelná a levnější? A jde nabídku ukázat i na stránce potvrzení objednávky (Thank you page) hned po checkoutu?

## 5. Mimo rozsah a nápady na další fáze

- **Plně automatická objednávka bez kliknutí.** Rizika s platbou, zásobami a stornem (zavřeno, jiná spotřeba). Připomínka dá většinu užitku bez nich.
- **Schvalování manažerem.** Zpomaluje rutinní nákup a šlo by obejít ruční objednávkou. Pokud kontrolu klient chce, použije koncepty objednávek (kapitola 4.1).
- Založení stálé objednávky obchodníkem za zákazníka.
- Sdílení stálé objednávky mezi lokacemi, synchronizace s ERP, B2C zákazníci.

## 6. Navrhovaný postup a odhad

Postup navrhuji jako Product Owner. Je potřeba doplnit odhady od vývoje.

| Krok | Obsah | Připomínky vývoje | Odhad (MD) |
|---|---|---|---|
| 1 | Spike: zápis metaobjektu z rozšíření, B2B košík pro lokaci, čtení metaobjektů ve Flow, odeslání připomínky kontaktům lokace a zda e-mail může zobrazit název a položky stálé objednávky | | |
| 2 | Nastavení v adminu a Flow (kapitola 4.1) | | |
| 3 | US-1, US-2, US-3, US-5 | | |
| 4 | US-4 a připomínka | | |
| 5 | US-6 | | |
| 6 | US-7, US-8 | | |
| 7 | Testování a akceptace s klientem | | |

## 7. Otevřené otázky pro klienta

1. **Souhlas s e-maily.** Potřebuje týdenní připomínka souhlas s obchodními sděleními, nebo stačí možnost odhlášení? Potvrdí právník klienta.
2. **Upozornění obchodníka.** Je 48 hodin správná doba? Chodí jednomu obchodníkovi, nebo tomu přiřazenému k firmě?
3. **Limit.** Stačí 5 stálých objednávek na lokaci?
4. **Jazyk.** Jen čeština, nebo i angličtina?
5. **Prodej bez zásob.** Chce Zrnovar u kávy povolit prodej, i když není skladem, a dodat později? Kavárna pak stálou objednávku objedná vždy celou.
