# Stálá objednávka pro B2B zákazníky

| | |
|---|---|
| Projekt | Zrnovar, testovací obchod na Shopify |
| Autor | Milan Kocáb, Product Owner |
| Verze | 1.0, k připomínkám |
| Datum | 6. 10. 2026 |
| Čtenáři | vývoj, QA, obchod Zrnovaru |

## 1. Shrnutí

Kavárny objednávají u Zrnovaru každý týden skoro totéž. Dnes si objednávku pokaždé skládají znovu nebo hledají v historii, kterou objednávku zopakovat.

Navrhujeme **stálou objednávku**. Kavárna si jednou uloží, co obvykle bere, a pak ji objedná jedním kliknutím přímo z horní části stránky Objednávky. Každý týden jí v nastavený den přijde e-mail s odkazem, který ji na stálou objednávku dovede.

Většinu řešení pokryje Shopify v základu (B2B ceník, minimální odběr, platba na fakturu, upozornění pro obchodníka ve Flow). Vyvíjet je potřeba jen samotnou stálou objednávku v zákaznickém účtu. Před vývojem ověříme, jestli ji nesplní hotová aplikace.

## 2. Kontext a problém

Zrnovar prodává kávu kavárnám a kancelářím přes Shopify B2B. Kavárna Kavárna U Mostu objednává každé pondělí zhruba 12 kg espresso směsi, 2 kg filtrové kávy a čisticí tablety.

Dnes to vypadá takto.

1. Baristka nebo provozní se přihlásí do zákaznického účtu.
2. Buď prochází katalog a skládá košík ručně, nebo najde v historii minulou objednávku a použije tlačítko Buy again.
3. Často zapomene objednat včas, kávu pak doobjednává telefonem a obchodník Zrnovaru řeší expresní dodání.

Problémy, které chceme vyřešit.

- Opakovaná objednávka zabírá zbytečně čas a vyžaduje pamatovat si, co se bralo minule.
- Minulá objednávka nemusí být ta „správná“ (mohla obsahovat jednorázový nákup), takže Buy again vede k chybám.
- Kavárna zapomíná objednat. Zrnovar se o tom dozví pozdě, nebo vůbec, pokud kavárna mezitím nakoupí jinde.

## 3. Cíl a měření úspěchu

**Cíl pro kavárnu** je objednat obvyklé zboží co nejrychleji a bez chyb.

**Cíl pro Zrnovar** je pravidelnost B2B objednávek a včasné odhalení zákazníka, který přestal objednávat.

| Metrika | Jak měříme |
|---|---|
| Podíl B2B objednávek vytvořených ze stálé objednávky | štítek objednávky `standing-order` |
| Čas od přihlášení po odeslání objednávky | analytika zákaznického účtu, porovnání před a po |
| Podíl připomínek, po kterých do 48 hodin přišla objednávka | odeslané připomínky vs. objednávky se štítkem |
| Počet telefonických a expresních doobjednávek | evidence obchodníka |

Cílové hodnoty doplníme po prvním měsíci, až změříme výchozí stav.

## 4. Persony

**Baristka nebo provozní kavárny.** Objednává mezi směnami, často z mobilu. Chce mít objednávku hotovou do minuty a nechce přemýšlet nad ceníkem ani minimálním odběrem.

**Majitel nebo manažer kavárny.** Řeší náklady a dodavatele. Chce vědět, co se objednává, ale nechce schvalovat každou týdenní objednávku kávy.

**Obchodník Zrnovaru.** Stará se o B2B zákazníky. Potřebuje vědět, když kavárna neobjednala, aby mohl zavolat dřív, než přejde ke konkurenci.

## 5. Co už Shopify umí a proč to nestačí

| Funkce | Stav v Shopify | Proč nestačí |
|---|---|---|
| B2B ceník (katalog), minimální odběr, násobky, množstevní ceny | nativně | stačí, beze změn |
| Platba na fakturu se splatností 30 dnů | nativně | stačí, beze změn |
| Buy again v historii objednávek | nativně v nových zákaznických účtech | kopíruje konkrétní minulou objednávku, ne „obvyklou“, a je schované v historii |
| Uložený seznam nebo šablona objednávky | **neexistuje** | to je jádro požadavku |
| Upozornění pro obchodníka | Flow | stačí |
| Týdenní e-mail zákazníkovi | Flow ho poslat neumí (interní e-mail jde jen zaměstnancům na pevnou adresu) | řešíme marketingovou automatizací nebo aplikací |

## 6. Rozhodnutí core, Flow, aplikace, nebo vývoj

| Požadavek | Řešení | Zdůvodnění |
|---|---|---|
| Velkoobchodní ceny kavárny | **core**, B2B katalog | už nastaveno |
| Minimální odběr a balení po 6 kg | **core**, pravidla množství v katalogu | checkout je vynutí i u stálé objednávky |
| Platba na fakturu | **core**, platební podmínky Net 30 | už nastaveno |
| Případná kontrola objednávky obchodníkem | **core**, odeslání objednávky jako koncept u lokace | funguje i pro stálé objednávky, nic nevyvíjíme |
| Uložení stálé objednávky a objednání jedním klikem nahoře na stránce Objednávky | **aplikace, nebo vývoj** | nativně neexistuje, nejdřív prověříme App Store (viz 6.1) |
| Týdenní připomínka zákazníkovi s odkazem | **core marketingová automatizace**, záložně aplikace | Flow neumí poslat e-mail zákazníkovi |
| Upozornění obchodníka, že kavárna po připomínce neobjednala | **Flow** | interní e-mail, bez vývoje |
| Označení objednávek ze stálé objednávky | **Flow** | štítek podle atributu objednávky, kvůli měření |

### 6.1 Aplikace, nebo vlastní vývoj

V App Store existují aplikace na opakované objednávky a seznamy pro B2B. Vývoj schválíme, jen pokud žádná nesplní tato kritéria.

1. Funguje v **nových zákaznických účtech** a umí se zobrazit **nahoře na stránce Objednávky**.
2. Seznam je **sdílený pro celou lokaci firmy**, ne jen pro jednoho uživatele.
3. Ceny bere z **B2B katalogu** lokace a respektuje pravidla množství.
4. Umí **týdenní připomínku** s odkazem, nebo nám dá data, abychom ji poslali sami.
5. Rozumná měsíční cena a podpora češtiny.

Prověření aplikací je první úkol (odhad 0,5 MD). Zbytek dokumentu popisuje variantu s vlastním vývojem, aby bylo jasné, co od aplikace chceme.

## 7. Zvažované varianty, které jsme zamítli

### 7.1 Schvalování objednávek manažerem podle rolí

Uvažovali jsme, že objednávat může kdokoli z kavárny, ale objednávku schválí manažer. Případně by manažer schvaloval jen to, která objednávka se smí opakovat.

Zamítli jsme to ze tří důvodů.

- **Neřeší reálný problém.** Týdenní objednávka kávy je rutinní nákup se stálou hodnotou. Schvalování by jen přidalo krok a zpomalilo přesně to, co chceme zrychlit.
- **Šlo by obejít.** Kdyby manažer schvaloval jen stálé objednávky, baristka může stejnou objednávku naklikat ručně. Kontrola, kterou jde obejít, je jen administrativa navíc.
- **Shopify to nativně nepodporuje.** Role v B2B (Ordering only a Location admin) řídí přístup k objednávkám, ne schvalování. Řetězec „zaměstnanec, pak manažer“ by znamenal další vývoj.

Pokud by kavárna kontrolu přece jen potřebovala, Shopify umí u lokace nastavit, že objednávky chodí jako koncept ke kontrole obchodníkovi. To je core funkce a stálá objednávka ji automaticky respektuje.

**Co si z rolí bereme.** Role ovlivňují viditelnost. Uživatel s oprávněním Ordering only vidí jen své vlastní objednávky. Proto stálou objednávku ukládáme **k lokaci firmy, ne k uživateli**. Kdyby ji založil manažer, baristka ji jinak neuvidí.

### 7.2 Tlačítko „Objednat znovu“

Původní požadavek. Shopify ho má nativně jako Buy again, proto ho nevyvíjíme. Stálá objednávka řeší, co Buy again neumí (viz kapitola 5).

### 7.3 Plně automatická objednávka každý týden

Odložena do další fáze. Přináší rizika s platbou, zásobami a stornem (kavárna má zavřeno, změnila spotřebu). Připomínka s objednáním na jedno kliknutí dává 90 % užitku bez těchto rizik.

## 8. Konfigurace bez vývoje

Tohle se nastavuje v administraci a nepíší se k tomu user stories.

**B2B (hotovo v testovacím obchodě)**
- [x] Firma Kavárna U Mostu s.r.o., lokace Kavárna U Mostu
- [x] Katalog Velkoobchod Gastro, ceny −15 %
- [x] Pravidla množství u espresso směsí (minimum 6, násobky 6) a množstevní ceny
- [x] Platební podmínky Net 30

**Flow**
- [ ] Workflow `Tag standing order`. Trigger Order created. Pokud má objednávka atribut `standing_order_id`, přidá štítek `standing-order`.
- [ ] Workflow `Standing order not placed`. Trigger Scheduled time, denně v 15.00. Najde stálé objednávky, u kterých byla připomínka odeslána před více než 48 hodinami a od té doby nepřišla objednávka. Pošle interní e-mail obchodníkovi s názvem firmy a kontaktem. Přesné čtení dat z metaobjektů ve Flow ověří vývoj ve spiku (viz 11.4).

**Připomínka zákazníkovi**
- [ ] Ověřit, zda marketingová automatizace Shopify umí odeslat e-mail kontaktům B2B lokace v nastavený den v týdnu. Pokud ano, šablona e-mailu obsahuje název stálé objednávky a tlačítko vedoucí na stránku stálých objednávek.
- [ ] Pokud ne, rozhodnout mezi e-mailovou aplikací (např. Klaviyo) a odesíláním z vlastní aplikace. Rozhodnutí patří do spiku.

## 9. Vývoj, user stories a akceptační kritéria

Priority podle MoSCoW (Must, Should, Could).

### SO-1 Objednat stálou objednávku z horní části stránky Objednávky (Must)

**Jako** baristka **chci** hned po otevření Objednávek vidět naše stálé objednávky a objednat jednu jedním kliknutím, **abych** nemusela nic hledat ani skládat.

**Akceptační kritéria**

1. **Za předpokladu, že** lokace má alespoň jednu stálou objednávku, **když** otevřu stránku Objednávky, **pak** nad seznamem objednávek vidím blok Stálé objednávky s názvem, počtem položek a orientační cenou podle aktuálního katalogu.
2. **Když** kliknu na Objednat, **pak** se vytvoří košík s položkami stálé objednávky v kontextu mé lokace a otevře se checkout.
3. **Pak** ceny, minimální odběry a platební podmínky odpovídají B2B nastavení lokace (zajišťuje core).
4. **Pak** objednávka nese atribut `standing_order_id`, podle kterého ji Flow označí.
5. **Za předpokladu, že** lokace nemá stálou objednávku, **pak** blok zobrazí krátké vysvětlení a tlačítko Vytvořit stálou objednávku.
6. Blok je použitelný na mobilu (tlačítko Objednat je vidět bez posouvání).

### SO-2 Vytvořit stálou objednávku z minulé objednávky (Must)

**Jako** provozní **chci** z objednávky, která se povedla, udělat stálou objednávku, **abych** ji nemusela skládat znovu.

**Akceptační kritéria**

1. **Když** otevřu detail objednávky, **pak** v akcích objednávky vidím Uložit jako stálou objednávku.
2. **Když** akci použiji, **pak** zadám název (předvyplněno „Týdenní objednávka“) a vidím položky, u kterých mohu změnit množství nebo je odebrat.
3. **Když** uložím, **pak** stálá objednávka patří k lokaci, ke které patřila původní objednávka, a vidí ji všichni kontakty této lokace.
4. Položky, které už nejsou v katalogu lokace, se nepřenesou a uživatel o tom dostane zprávu.

### SO-3 Upravit a smazat stálou objednávku (Must)

**Jako** provozní **chci** upravit množství, odebrat položku, přejmenovat nebo smazat stálou objednávku, **abych** ji udržela aktuální.

**Akceptační kritéria**

1. Úpravy dělám na stránce Stálé objednávky v zákaznickém účtu.
2. Množství kontroluje pravidla množství z katalogu. Pokud nesplňuje minimum nebo násobek, uložení není možné a zobrazí se, jaké množství je povolené.
3. U stálé objednávky je vidět, kdo a kdy ji naposledy upravil.
4. Smazání vyžaduje potvrzení.
5. Lokace může mít nejvýše 5 stálých objednávek.

### SO-4 Přidat produkt do stálé objednávky (Should)

**Jako** provozní **chci** do stálé objednávky přidat produkt z našeho katalogu, **abych** nemusela kvůli jedné položce vytvářet novou objednávku.

**Akceptační kritéria**

1. Na stránce úprav mohu vyhledat produkt podle názvu nebo SKU.
2. Nabídnou se jen produkty a varianty z katalogu mé lokace.
3. Přidaná položka respektuje pravidla množství (SO-3, bod 2).

### SO-5 Nastavit týdenní připomínku (Must)

**Jako** provozní **chci** zvolit den a čas připomínky, **aby** mi objednávka nevypadla z hlavy.

**Akceptační kritéria**

1. U každé stálé objednávky mohu připomínku zapnout, vypnout a vybrat den v týdnu a čas (výchozí pondělí 8.00, časové pásmo Europe/Prague).
2. Připomínka přijde kontaktům lokace, kteří mají souhlas s e-mailovou komunikací (viz otevřené otázky).
3. E-mail obsahuje název stálé objednávky, seznam položek a tlačítko Zobrazit a objednat.
4. Uložení připomínky se zapíše do stálé objednávky (`reminder_enabled`, `reminder_weekday`, `reminder_time`).

### SO-6 Odkaz z připomínky vede rovnou na stálou objednávku (Must)

**Jako** baristka **chci** z e-mailu kliknout a hned objednat, **abych** to zvládla mezi dvěma zákazníky.

**Akceptační kritéria**

1. **Když** kliknu na tlačítko v e-mailu a jsem přihlášená, **pak** se otevře stránka Stálé objednávky s danou objednávkou nahoře.
2. **Když** přihlášená nejsem, **pak** se po přihlášení vrátím na stejné místo.
3. Odkaz neobsahuje žádné citlivé údaje a bez přihlášení nic neukáže.

### SO-7 Obchodník vidí stálé objednávky zákazníka (Could)

**Jako** obchodník Zrnovaru **chci** v administraci vidět stálé objednávky firmy, **abych** věděl, co a jak často zákazník bere.

**Akceptační kritéria**

1. Stálé objednávky jsou uložené jako metaobjekty a obchodník je vidí v adminu bez další aplikace.
2. U firmy nebo lokace je vidět odkaz na její stálé objednávky.

## 10. Okrajové případy

| Situace | Chování |
|---|---|
| Položka je vyprodaná | Blok i stránka ji označí. Po kliknutí na Objednat se košík vytvoří bez ní a uživatel dostane zprávu, co chybí. |
| Produkt byl odebrán z katalogu lokace nebo smazán | Položka se zobrazí jako nedostupná a nabídne se její odebrání. Do košíku se nepřidá. |
| Změnila se cena | Stálá objednávka ceny neukládá. Vždy se zobrazí a účtuje aktuální cena z katalogu. |
| Změnila se pravidla množství | Položka s neplatným množstvím se označí a uživatel ji musí upravit. Checkout pravidla vynutí v každém případě. |
| Firma má víc lokací | Stálé objednávky patří k lokaci. Uživatel vidí ty, které patří k lokaci, za kterou právě nakupuje. |
| Uživatel nemá přístup k lokaci | Stálé objednávky této lokace nevidí a odkaz z e-mailu mu je neukáže. |
| Lokace má odesílání objednávek jako koncept | Objednávka ze stálé objednávky se také odešle jako koncept. Nic dalšího se neřeší. |
| Dva lidé upravují stejnou stálou objednávku | Platí poslední uložení. U stálé objednávky je vidět, kdo ji upravil naposledy. |
| Stálá objednávka nemá žádnou dostupnou položku | Tlačítko Objednat je neaktivní s vysvětlením. |
| Kavárna má dovolenou | Uživatel připomínku dočasně vypne (SO-5). |

## 11. Technické poznámky pro vývoj

Doporučení, ne závazné řešení. Finální podobu potvrdí spike.

### 11.1 Datový model

Metaobjekt `standing_order` s odkazem na lokaci firmy.

| Pole | Typ | Popis |
|---|---|---|
| `name` | single_line_text | název zobrazený zákazníkovi |
| `company_location` | company_location reference | vlastník stálé objednávky |
| `lines` | json | pole `{ "variant_id": "gid://shopify/ProductVariant/…", "quantity": 12 }` |
| `reminder_enabled` | boolean | připomínka zapnuta |
| `reminder_weekday` | number_integer | 1 až 7, pondělí = 1 |
| `reminder_time` | single_line_text | `HH:MM`, časové pásmo Europe/Prague |
| `last_reminder_sent_at` | date_time | kvůli upozornění obchodníka |
| `last_ordered_at` | date_time | aktualizuje se po objednávce s `standing_order_id` |
| `updated_by` | customer reference | kdo naposledy upravil |

### 11.2 Rozšíření zákaznického účtu (Customer Account UI Extensions)

| Část | Target |
|---|---|
| Blok nahoře na stránce Objednávky (SO-1) | `customer-account.order-index.block.render` |
| Akce Uložit jako stálou objednávku v detailu objednávky (SO-2) | `customer-account.order.action.menu-item.render` a `customer-account.order.action.render` |
| Stránka Stálé objednávky pro úpravy (SO-3, SO-4, SO-6) | `customer-account.page.render` |

### 11.3 Vytvoření košíku

Preferovaná cesta je Storefront API `cartCreate` s `buyerIdentity.companyLocationId`, atributem `standing_order_id` a přesměrováním na `checkoutUrl`. Záložní cesta je cart permalink. Spike ověří, že ceny a pravidla množství odpovídají katalogu lokace.

### 11.4 Spike (odhad 1 až 2 MD)

1. Zápis metaobjektu z rozšíření zákaznického účtu (Customer Account API, oprávnění).
2. Vytvoření B2B košíku pro konkrétní lokaci z rozšíření.
3. Čtení metaobjektů ve Flow pro workflow `Standing order not placed`.
4. Odeslání týdenní připomínky marketingovou automatizací Shopify kontaktům B2B lokace, případně výběr náhradního řešení.

## 12. Mimo rozsah

- Plně automatické objednávky bez kliknutí (zvážit ve fázi 2)
- Schvalování objednávek manažerem kavárny (zdůvodnění v 7.1)
- Synchronizace stálých objednávek s ERP
- Stálé objednávky pro B2C zákazníky
- Sdílení jedné stálé objednávky mezi více lokacemi
- Založení stálé objednávky obchodníkem za zákazníka (kandidát na fázi 2)

## 13. Otevřené otázky pro klienta

1. **Souhlas s e-maily.** Je týdenní připomínka obchodní sdělení, ke kterému potřebujeme souhlas, nebo ji lze posílat stávajícím zákazníkům s možností odhlášení? Potvrdí právník klienta.
2. **Upozornění obchodníka.** Je 48 hodin po připomínce správná doba? Komu upozornění chodí, jednomu obchodníkovi, nebo obchodníkovi přiřazenému k firmě?
3. **Limit stálých objednávek.** Stačí 5 na lokaci?
4. **Jazyk.** Jen čeština, nebo i angličtina pro zahraniční zákazníky?

## 14. Slovník pojmů

| Pojem | Anglicky ve vývoji | Význam |
|---|---|---|
| Stálá objednávka | `standing_order` | uložená šablona položek a množství, kterou lokace opakovaně objednává |
| Objednávka | `order` | skutečně odeslaná objednávka v Shopify |
| Košík | `cart` | dočasný výběr před checkoutem |
| Firma | `company` | B2B zákazník, např. Kavárna U Mostu s.r.o. |
| Lokace | `company_location` | konkrétní provozovna firmy, nese katalog, platební podmínky a stálé objednávky |
| Kontakt | `company_contact` | člověk, který za lokaci nakupuje |
| Katalog | `catalog` | ceník a sortiment přiřazený lokaci |
| Připomínka | `reminder` | týdenní e-mail kontaktům lokace |

## 15. Plán a orientační odhad

| Fáze | Obsah | Odhad |
|---|---|---|
| 0 | Prověření aplikací z App Store (6.1) | 0,5 MD |
| 1 | Spike (11.4) | 1 až 2 MD |
| 2 | SO-1, SO-2, SO-3, SO-6 | 5 až 7 MD |
| 3 | SO-5 a připomínka, Flow workflow | 2 až 3 MD |
| 4 | SO-4, SO-7 | 1 až 2 MD |
| 5 | Testování a akceptace s klientem | 2 MD |

Odhad je orientační, potvrdí ho vývoj po spiku. Pokud fáze 0 najde vhodnou aplikaci, fáze 1 až 4 se nahradí jejím nastavením (odhad 1 až 2 MD).
