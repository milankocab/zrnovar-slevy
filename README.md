# Zrnovar – sleva „Ochutnej nový původ“

Shopify aplikace se slevovou funkcí ([Shopify Functions](https://shopify.dev/docs/apps/build/functions), Discount API) pro e-shop fiktivní pražírny Zrnovar.

## Co sleva dělá

Sleva odměňuje zákazníky, kteří si do košíku dají **alespoň dvě různé jednodruhové kávy**:

- Do pravidla se počítají jen produkty s typem **„Zrnková káva“**, které **nemají štítek „směs“**.
- Musí jít o **2 a více různých produktů**. Několik kusů nebo variant (250 g / 1 kg, různé mletí) téže kávy se počítá jako jeden produkt.
- Sleva je **10 % na řádek košíku s nejlevnější z těchto káv** (podle ceny za kus).
- **B2B zákazníci** (košík s `buyerIdentity.purchasingCompany`) slevu nedostanou, protože mají vlastní ceník.
- V košíku se zobrazí jako **„Ochutnej nový původ −10 %“**.
- Jde jen o produktovou slevu. Na objednávku ani na dopravu se nevztahuje.

**Příklad:** Brazílie Santos (249 Kč) + Etiopie Yirgacheffe (329 Kč) → Brazílie stojí 224,10 Kč. Tři balení Brazílie nebo Brazílie + Espresso směs → bez slevy.

## Proč to nejde nativními slevami Shopify

Vestavěné slevy Shopify (částka/procento z produktů, „Kup X, získej Y“) pracují s **počtem kusů** nebo s hodnotou košíku z vybraných produktů či kolekcí. Neumí podmínku „alespoň 2 **různé** produkty“, takže by slevu dostal i zákazník se třemi balíčky stejné kávy. Pravidlo navíc kombinuje několik věcí, které by se v nativní slevě musely obcházet:

- výběr podle typu produktu a zároveň **vyloučení** podle štítku „směs“,
- sleva jen na **jeden řádek** (nejlevnější kávu podle ceny za kus), ne na všechny odpovídající položky,
- vyloučení B2B zákazníků podle firmy, ke které zákazník nakupuje.

Shopify Function dostane celý košík a pravidlo vyhodnotí přesně podle zadání při každé změně košíku.

## Původní zadání

```text
V tomto projektu je Shopify aplikace se slevovou funkcí v extensions/ochutnej-puvod. Uprav ji podle tohoto zadání.

Název slevy: Ochutnej nový původ

Pravidlo:

Sleva se uplatní, když košík obsahuje alespoň 2 různé produkty, které mají typ produktu „Zrnková káva“ a nemají štítek „směs“.
Sleva je 10 % na řádek košíku s nejlevnější z těchto káv (podle ceny za kus).
Pokud nakupuje B2B zákazník (košík má buyerIdentity.purchasingCompany), sleva se neuplatní, protože B2B má vlastní ceník.
Text slevy v košíku: „Ochutnej nový původ −10 %“.
Funkce vrací jen produktovou slevu, objednávkovou a dopravní ne.

Technicky:

Uprav GraphQL vstupní dotaz i JS logiku pro target cart.lines.discounts.generate.run. Funkci pro dopravu nech vracet prázdné operace.
Do shopify.app.toml přidej scope write_discounts.
Napiš k funkci testy podle šablony, která v projektu je, pro tyto případy: dvě různé kávy, jedna káva ve více kusech, káva a směs, B2B košík. Spusť je a ověř, že projdou.
Na konci mi česky shrň, co jsi změnil.
```

## Jak je řešení postavené

Projekt vychází ze šablony Shopify aplikace (extension-only, bez vlastního serveru). Podstatná je funkce v `extensions/ochutnej-puvod/`:

| Soubor | Co dělá |
|---|---|
| `src/cart_lines_discounts_generate_run.graphql` | Vstupní dotaz: firma B2B zákazníka, řádky košíku (cena za kus, množství) a u produktu ID, typ a štítek „směs“ (`hasAnyTag`). |
| `src/cart_lines_discounts_generate_run.js` | Logika slevy: vyřadí B2B, vyfiltruje kávy bez štítku „směs“, spočítá různé produkty podle ID a na nejlevnější řádek vrátí `productDiscountsAdd` s 10 %. |
| `src/cart_delivery_options_discounts_generate_run.js` | Dopravní target, vždy vrací prázdné operace. |
| `tests/` | Integrační testy podle šablony Shopify: každý JSON ve `fixtures/` je jeden scénář (vstup a očekávaný výstup). |
| `shopify.extension.toml` | Registrace obou targetů funkce. |

Aplikace má v `shopify.app.toml` scope `write_discounts`. Samotná automatická sleva se v obchodě vytváří mutací `discountAutomaticAppCreate` s `functionHandle: "ochutnej-puvod"` a `discountClasses: [PRODUCT]`.

## Jak spustit testy

Potřebuješ Node.js, [pnpm 10](https://pnpm.io/) a [Shopify CLI](https://shopify.dev/docs/apps/tools/cli). Testy přes něj funkci kompilují do WebAssembly.

```bash
pnpm install
cd extensions/ochutnej-puvod
pnpm exec vitest run
```

Testované scénáře:

- dvě různé kávy → sleva na levnější z nich (levnější příslušenství se nepočítá),
- jedna káva ve více kusech → bez slevy,
- káva a směs → bez slevy,
- B2B košík → bez slevy,
- a okrajové případy: prázdný košík, sleva bez produktové třídy a dopravní target.

## Nasazení

```bash
shopify app deploy
```

Po prvním nasazení vytvoř v obchodě automatickou slevu (např. v GraphiQL):

```graphql
mutation {
  discountAutomaticAppCreate(automaticAppDiscount: {
    title: "Ochutnej nový původ"
    functionHandle: "ochutnej-puvod"
    discountClasses: [PRODUCT]
    startsAt: "2026-10-06T00:00:00Z"
  }) {
    automaticAppDiscount { discountId status }
    userErrors { field message }
  }
}
```

Slevu vytvářej, až když neběží `shopify app dev`. Sleva vytvořená během dev preview se navíže na vývojovou verzi funkce a `shopify app dev clean` ji smaže.

## Autorství

Kód napsal [Claude Code](https://claude.com/claude-code) podle mého zadání. Já jsem ho otestoval na testovacím obchodě Shopify: ověřil jsem slevu v košíku.
