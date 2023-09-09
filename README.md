# Grafer

## Allmänt

- Ett problem med flera av ramverken (ApexCharts, Recharts) är att när man uppdaterar serien med en ny punkt så återställs t.ex. inzoomning i grafen, som att state återställs helt och hållet. Antagligen finns ett bättre sätt att skicka in nya punkter än att göra en ny kopia av hela arrayen?
- Antagligen av samma skäl så droppar alla ramverken frames när man lägger till nya punkter.

## [ApexCharts](https://apexcharts.com/)

### Pros

- Batteries included, det mesta finns färdigt om man hittar rätt option
- Helt okej defaults
- Ganska bra dokumentation

### Cons

- Aningen knepigt API, gigantiskt options-objekt där man måste leta för att hitta rätt
- Inte "React-igt", om man ska customiza något måste man göra det via strängar innehållande HTML eller CSS

### Övrigt

- Lite svårt att få in köp- och säljpluppar i tooltippen. Försökte fejka det genom att göra en serie av transaktionerna men det blir inte helt lyckat pga. [denna bugg](https://github.com/apexcharts/apexcharts.js/issues/420)

## [Recharts](https://recharts.org/en-US/)

### Pros

- Byggt för React, customization sker via React-komponenter

### Cons

- Kräver lite mer customizations (t.ex. behöver candlesticks vara custom)

## [Highcharts](https://www.highcharts.com/)

### Pros

- Batteries included, det mesta finns färdigt om man hittar rätt option
- Mycket dokumentation och lätt att googla på

### Cons

- Licensavgift
- Inte "React-igt", om man ska customiza något måste man göra det via strängar innehållande HTML eller CSS
- Behövs mycket customization för att inte se "generiskt" ut

## [TradingView lightweight charts](https://tradingview.github.io/lightweight-charts/)

Notera att TradingView har två andra typer av grafer med mer features som man behöver kontakta dem för att använda: https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/. Det här libbet känns mer som ett demo för deras andra produkter snarare än något som kan användas för mer avancerade case.

### Pros

- Ser krispigt ut out of the box
- Trevligt API

### Cons

- Inget inbyggt stöd för annoteringar / "händelser"
- Inget inbyggt stöd för tooltip
- Ingen officiell React-wrapper, nuvarande implementationen med ref orsakar en del buggar (bör gå att lösa)

## [CanvasJS](https://canvasjs.com/)

### Pros

- Många exmepel i dokumentationen
- Bra prestanda när man lägger till punkter. Använder Canvas istället för SVG som de andra använder så har inte problem med att DOMen växer med grafen.

### Cons

- Licensavgift
- Saknar TypeScript-definitioner? Blir rätt meckigt att jobba med utan autocomplete
- Lite stökigt API. Liknar ApexCharts/Highcharts i att man behöver skicka in ett stort options-objekt men det känns mindre organiserat här
- Verkar saknas stöd för gradients på area-charts: https://canvasjs.com/forums/topic/gradients/
- React-wrappern "@canvasjs/react-charts" känns som att den är av ganska låg kvalitet

## [amCharts](https://www.amcharts.com/)

### Pros

- Bra TypeScript-typning
- Inbyggd TA-funktionalitet där libbet räknar ut indikatorerna

### Cons

- Licensavgift
- Lite udda API och knepig dokumentation. Känns som en hög tröskel för att komma igång
- Ingen officiell React-wrapper
- Eventuellt lite dåligt stöd för "shared-tooltips", dokumentationen hänvisar till det här exemplet https://codepen.io/team/amcharts/pen/jOwzwXB

# Omvärldsspaning

- Avanza: Highcharts
- Börsdata: Highcharts på vanliga webben, TradingView i terminalen
- Coinbase: Custombyggt(?) på vanliga webben, TradingView i terminalen
- DI: Highcharts
- Nordnet: Highcharts
- Safello: Highcharts
