/**
 * Global Wine Cellar Atlas — Geographic & Viticultural Data
 * Projected offline-first SVG cartography for 14 wine countries & 85+ wine regions.
 */
(function (global) {
    'use strict';

    const ATLAS_DATA = {
  "worldViewBox": "0 0 1000 500",
  "wineBelts": {
    "n50": 95.6,
    "n30": 169.1,
    "eq": 279.4,
    "s30": 389.7,
    "s50": 463.2
  },
  "continents": {
    "north_america": "33.3,36.8 50.0,22.1 111.1,22.1 152.8,25.7 194.4,29.4 236.1,29.4 272.2,47.8 283.3,84.6 316.7,58.8 347.2,88.2 333.3,110.3 313.9,114.0 305.6,125.0 291.7,139.7 275.0,165.4 277.8,187.5 269.4,172.8 252.8,169.1 230.6,183.8 233.3,209.6 258.3,202.2 255.6,220.6 269.4,242.6 283.3,250.0 272.2,250.0 258.3,231.6 241.7,224.3 208.3,205.9 194.4,191.2 175.0,161.8 163.9,150.7 155.6,132.4 155.6,102.9 138.9,80.9 111.1,58.8 77.8,58.8 50.0,77.2 38.9,58.8",
    "greenland": "355.6,58.8 383.3,58.8 438.9,22.1 450.0,3.7 375.0,3.7 338.9,14.7 352.8,36.8",
    "south_america": "283.3,246.3 302.8,235.3 327.8,242.6 361.1,275.7 402.8,301.5 394.4,330.9 386.1,360.3 366.7,375.0 352.8,404.4 338.9,419.1 319.4,433.8 311.1,470.6 313.9,481.6 297.2,477.9 291.7,448.5 297.2,415.4 302.8,389.7 305.6,345.6 286.1,323.5 275.0,297.8 280.6,272.1",
    "europe": "475.0,143.4 475.0,121.3 494.4,121.3 486.1,102.9 505.6,91.9 522.2,80.9 527.8,66.2 513.9,55.1 530.6,44.1 552.8,22.1 583.3,22.1 611.1,36.8 652.8,29.4 666.7,58.8 661.1,91.9 633.3,110.3 611.1,117.6 597.2,110.3 580.6,128.7 572.2,132.4 563.9,143.4 555.6,136.0 550.0,125.0 538.9,114.0 533.3,117.6 544.4,132.4 550.0,132.4 544.4,139.7 536.1,128.7 525.0,117.6 513.9,121.3 508.3,125.0 500.0,139.7 486.1,147.1",
    "uk_ireland": "483.3,95.6 502.8,91.9 500.0,84.6 494.4,66.2 483.3,69.9 486.1,84.6",
    "africa": "452.8,224.3 463.9,176.5 483.3,147.1 527.8,143.4 533.3,158.1 569.4,161.8 591.7,165.4 619.4,235.3 641.7,235.3 613.9,286.8 611.1,334.6 597.2,371.3 577.8,400.7 550.0,404.4 541.7,375.0 533.3,338.2 525.0,294.1 525.0,264.7 505.6,257.4 477.8,261.0 455.6,239.0",
    "madagascar": "622.2,371.3 630.6,371.3 638.9,334.6 636.1,323.5 622.2,345.6",
    "asia": "575.0,128.7 600.0,143.4 600.0,165.4 619.4,231.6 652.8,198.5 663.9,187.5 686.1,187.5 700.0,205.9 713.9,250.0 725.0,220.6 747.2,198.5 772.2,220.6 786.1,275.7 802.8,235.3 800.0,202.2 825.0,191.2 838.9,165.4 833.3,139.7 858.3,150.7 863.9,125.0 891.7,110.3 894.4,80.9 938.9,88.2 966.7,51.5 986.1,33.1 888.9,14.7 791.7,7.4 700.0,14.7 666.7,29.4 661.1,91.9 633.3,110.3 611.1,121.3",
    "japan": "861.1,165.4 875.0,154.4 891.7,139.7 902.8,117.6 891.7,117.6 880.6,143.4 863.9,154.4",
    "indonesia_ph": "763.9,261.0 791.7,301.5 819.4,308.8 850.0,305.1 833.3,279.4 805.6,275.7 777.8,272.1",
    "australia": "816.7,360.3 838.9,345.6 863.9,323.5 877.8,323.5 891.7,341.9 897.2,319.9 913.9,352.9 925.0,382.4 916.7,415.4 891.7,419.1 877.8,408.1 858.3,397.1 819.4,404.4 813.9,375.0",
    "tasmania": "902.8,430.1 911.1,430.1 908.3,439.3 902.8,437.5",
    "nz_north": "980.6,408.1 994.4,419.1 986.1,432.0 983.3,422.8 979.2,411.8",
    "nz_south": "980.6,430.1 983.3,433.8 972.2,448.5 963.9,448.5 966.7,441.2 975.0,433.8"
  },
  "countries": [
    {
      "id": "FRANCE",
      "name": "France",
      "short": "France",
      "world": "Old World",
      "tagline": "The Benchmark of Terroir, Appellation & Classic Fine Wine",
      "isShowcaseGrid": false,
      "worldPoints": "486.7,101.5 506.9,91.9 522.8,99.3 520.8,110.3 521.1,118.7 508.9,123.5 495.0,119.9 495.6,109.2",
      "worldLx": 506.1,
      "worldLy": 108.1,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "91.8,165.5 179.9,156.7 186.0,108.3 301.5,51.2 368.4,82.0 487.0,139.1 468.7,205.0 420.1,262.2 450.5,315.0 468.7,367.7 401.8,394.1 335.0,429.2 183.0,385.3 201.2,288.6 161.7,213.8",
        "499.1,407.3 526.5,402.9 526.5,473.2 499.1,464.4"
      ],
      "regions": [
        {
          "id": "CHAMPAGNE",
          "name": "Champagne",
          "short": "Champagne",
          "points": "331.9,117.1 383.6,117.1 389.7,165.5 341.0,165.5",
          "lx": 359.3,
          "ly": 136.9,
          "climate": "Cool Continental",
          "soil": "Belemnite chalk & limestone",
          "grapes": "Chardonnay, Pinot Noir, Pinot Meunier",
          "summary": "Northernmost classic sparkling appellation; razor-sharp acidity, brioche complexity, and chalky minerality."
        },
        {
          "id": "ALSACE",
          "name": "Alsace",
          "short": "Alsace",
          "points": "450.5,139.1 483.9,143.5 468.7,200.7 447.4,196.3",
          "lx": 461.1,
          "ly": 174.3,
          "climate": "Dry Sunny Continental (Vosges rain shadow)",
          "soil": "Granite, schist, volcanic & limestone",
          "grapes": "Riesling, Gewürztraminer, Pinot Gris",
          "summary": "Aromatic single-varietal whites of crystalline purity crafted along the foothills of the Vosges Mountains."
        },
        {
          "id": "LOIRE VALLEY",
          "name": "Loire Valley",
          "short": "Loire",
          "points": "173.8,205.0 331.9,200.7 328.9,231.4 183.0,231.4",
          "lx": 243.8,
          "ly": 213.8,
          "climate": "Maritime to Cool Continental",
          "soil": "Tuffeau limestone, flint (silex) & schist",
          "grapes": "Sauvignon Blanc, Chenin Blanc, Cabernet Franc",
          "summary": "France's longest wine river — from Muscadet and Anjou Chenin to Chinon and flinty Sancerre."
        },
        {
          "id": "BURGUNDY",
          "name": "Burgundy",
          "short": "Burgundy",
          "points": "347.1,187.5 398.8,196.3 389.7,266.6 362.3,266.6",
          "lx": 380.6,
          "ly": 227.0,
          "climate": "Cool Continental",
          "soil": "Kimmeridgian marl & Jurassic limestone",
          "grapes": "Pinot Noir, Chardonnay, Gamay",
          "summary": "The spiritual home of single-vineyard climat expression from Chablis and Côte d'Or to Beaujolais."
        },
        {
          "id": "JURA & SAVOIE",
          "name": "Jura & Savoie",
          "short": "Jura",
          "points": "401.8,222.6 441.4,253.4 435.3,297.4 401.8,279.8",
          "lx": 417.0,
          "ly": 249.0,
          "climate": "Alpine Continental",
          "soil": "Blue marl, glacial moraine & limestone",
          "grapes": "Savagnin, Poulsard, Trousseau, Jacquère",
          "summary": "Mountainous eastern terroirs famed for oxidative Vin Jaune, crystalline alpine whites, and vibrant reds."
        },
        {
          "id": "BORDEAUX",
          "name": "Bordeaux",
          "short": "Bordeaux",
          "points": "198.2,288.6 243.8,301.8 240.7,345.7 198.2,341.3",
          "lx": 219.4,
          "ly": 321.5,
          "climate": "Moderate Maritime",
          "soil": "Left Bank gravel; Right Bank clay-limestone",
          "grapes": "Cabernet Sauvignon, Merlot, Sauvignon Blanc, Sémillon",
          "summary": "Iconic estate blends spanning Médoc, Graves, Pomerol, Saint-Émilion, and golden Sauternes."
        },
        {
          "id": "RHONE VALLEY",
          "name": "Rhône Valley",
          "short": "Rhône",
          "points": "374.5,288.6 398.8,293.0 398.8,367.7 371.4,363.3",
          "lx": 385.1,
          "ly": 334.7,
          "climate": "Continental (North) to Mediterranean (South)",
          "soil": "Steep granite terraces & galets roulés cobbles",
          "grapes": "Syrah, Grenache, Mourvèdre, Viognier",
          "summary": "Peppery Northern Syrah from Côte-Rôtie & Hermitage alongside sun-baked Châteauneuf-du-Pape blends."
        },
        {
          "id": "LANGUEDOC-ROUSSILLON",
          "name": "Languedoc-Roussillon",
          "short": "Languedoc",
          "points": "286.3,367.7 365.4,372.1 338.0,424.9 292.4,416.1",
          "lx": 322.8,
          "ly": 387.5,
          "climate": "Warm Mediterranean",
          "soil": "Garrigue limestone, schist & alluvial gravel",
          "grapes": "Grenache, Syrah, Carignan, Picpoul, Mourvèdre",
          "summary": "Sun-drenched Mediterranean amphitheater of wild herbs, old-vine reds, and crisp coastal whites."
        },
        {
          "id": "PROVENCE",
          "name": "Provence",
          "short": "Provence",
          "points": "386.6,363.3 459.6,367.7 447.4,402.9 389.7,398.5",
          "lx": 423.1,
          "ly": 383.1,
          "climate": "Sunny Mediterranean (Mistral wind)",
          "soil": "Crystalline schist & limestone",
          "grapes": "Grenache, Cinsault, Mourvèdre, Rolle (Vermentino)",
          "summary": "World benchmark for pale, bone-dry, saline rosé and structured Bandol reds."
        },
        {
          "id": "CORSICA",
          "name": "Corsica",
          "short": "Corsica",
          "points": "499.1,407.3 526.5,407.3 523.4,473.2 499.1,464.4",
          "lx": 512.8,
          "ly": 440.2,
          "climate": "Island Mediterranean",
          "soil": "Granite & coastal limestone",
          "grapes": "Niellucciu, Sciaccarellu, Vermentinu",
          "summary": "Mountainous island terroir producing fragrant Mediterranean reds and mineral coastal whites."
        }
      ]
    },
    {
      "id": "ITALY",
      "name": "Italy",
      "short": "Italy",
      "world": "Old World",
      "tagline": "Twenty Historic Regions & Over 500 Native Grape Varieties",
      "isShowcaseGrid": false,
      "worldPoints": "518.6,111.0 529.2,107.0 538.3,108.5 537.8,112.1 534.7,116.9 545.0,125.7 551.4,132.0 545.8,139.7 542.8,140.4 535.6,141.2 534.4,126.1 524.7,116.2",
      "worldLx": 535.0,
      "worldLy": 122.1,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "121.0,99.1 154.4,91.0 190.8,70.6 236.3,54.3 293.9,50.2 336.4,70.6 330.3,111.3 293.9,115.4 290.9,143.9 339.4,192.8 366.8,249.8 409.2,262.0 479.0,331.3 460.8,343.5 427.4,319.1 415.3,355.7 436.5,380.2 406.2,420.9 391.0,416.8 397.1,347.6 369.8,319.1 339.4,298.7 287.9,266.1 230.2,192.8 212.0,168.3 187.7,156.1 145.3,180.6 127.0,139.8",
        "293.9,425.0 391.0,408.7 375.9,469.8 324.3,445.3",
        "166.5,294.6 212.0,286.5 209.0,372.0 172.6,376.1"
      ],
      "regions": [
        {
          "id": "VALLE D'AOSTA",
          "name": "Valle d'Aosta",
          "short": "VDA",
          "points": "124.0,93.0 157.4,93.0 154.4,109.3 124.0,109.3",
          "lx": 139.2,
          "ly": 101.1,
          "climate": "High Alpine",
          "soil": "Moraine & granite slopes",
          "grapes": "Prié Blanc, Petit Rouge, Nebbiolo",
          "summary": "Europe's highest mountain vineyards yielding taut, aromatic alpine wines."
        },
        {
          "id": "PIEMONTE",
          "name": "Piemonte",
          "short": "Piemonte",
          "points": "124.0,109.3 184.7,86.9 190.8,148.0 148.3,168.3 124.0,143.9",
          "lx": 158.9,
          "ly": 137.8,
          "climate": "Continental Foothills",
          "soil": "Calcareous Tortonian & Helvetian marl",
          "grapes": "Nebbiolo, Barbera, Dolcetto, Cortese, Arneis",
          "summary": "Home to Barolo and Barbaresco — noble, age-worthy expressions of Nebbiolo framed by the Alps."
        },
        {
          "id": "LIGURIA",
          "name": "Liguria",
          "short": "Liguria",
          "points": "145.3,172.4 218.1,156.1 218.1,172.4 145.3,182.6",
          "lx": 184.7,
          "ly": 160.2,
          "climate": "Coastal Mediterranean",
          "soil": "Steep terraced slate & limestone",
          "grapes": "Vermentino, Pigato, Rossese",
          "summary": "Dramatic sea-cliff terraces producing saline, herbal coastal whites."
        },
        {
          "id": "LOMBARDIA",
          "name": "Lombardia",
          "short": "Lombardia",
          "points": "184.7,70.6 239.3,74.7 248.4,131.7 187.7,139.8",
          "lx": 215.0,
          "ly": 103.2,
          "climate": "Alpine Lakes & Continental",
          "soil": "Glacial moraine & terraced schist",
          "grapes": "Chardonnay, Pinot Nero, Nebbiolo (Chiavennasca), Turbiana",
          "summary": "Italy's classic-method Franciacorta capital alongside dramatic Valtellina mountain Nebbiolo."
        },
        {
          "id": "TRENTINO-ALTO ADIGE",
          "name": "Trentino-Alto Adige",
          "short": "Alto Adige",
          "points": "236.3,50.2 293.9,50.2 281.8,99.1 239.3,99.1",
          "lx": 262.1,
          "ly": 72.6,
          "climate": "Alpine Dolomite",
          "soil": "Dolomitic limestone & porphyry",
          "grapes": "Pinot Grigio, Gewürztraminer, Lagrein, Pinot Bianco",
          "summary": "Crisp, razor-clean mountain whites, traditional-method TrentoDOC, and velvety Lagrein reds."
        },
        {
          "id": "VENETO",
          "name": "Veneto",
          "short": "Veneto",
          "points": "242.3,74.7 309.1,70.6 303.0,135.8 245.4,131.7",
          "lx": 275.7,
          "ly": 109.3,
          "climate": "Sub-Alpine to Adriatic",
          "soil": "Volcanic basalt (Soave) & limestone hills",
          "grapes": "Corvina, Garganega, Glera",
          "summary": "From Valpolicella and Amarone to volcanic Soave Classico and Prosecco Superiore."
        },
        {
          "id": "FRIULI-VENEZIA GIULIA",
          "name": "Friuli-Venezia Giulia",
          "short": "Friuli",
          "points": "300.0,66.5 339.4,70.6 336.4,107.2 303.0,107.2",
          "lx": 321.2,
          "ly": 86.9,
          "climate": "Alpine-Adriatic Confluence",
          "soil": "Ponca marl & sandstone",
          "grapes": "Friulano, Ribolla Gialla, Pinot Grigio, Schioppettino",
          "summary": "Italy's benchmark for luminous white wines and pioneering amber/skin-contact macerations."
        },
        {
          "id": "EMILIA-ROMAGNA",
          "name": "Emilia-Romagna",
          "short": "Emilia",
          "points": "199.9,131.7 300.0,135.8 300.0,176.5 215.0,168.3",
          "lx": 254.5,
          "ly": 152.1,
          "climate": "Continental Plain & Apennine",
          "soil": "Alluvial clay & calcareous hills",
          "grapes": "Lambrusco, Sangiovese, Albana, Pignoletto",
          "summary": "Gastronomic heartland celebrated for dry artisanal Lambrusco and soulful Romagna Sangiovese."
        },
        {
          "id": "TOSCANA",
          "name": "Toscana",
          "short": "Toscana",
          "points": "221.1,164.3 287.9,176.5 278.8,241.7 227.2,225.4",
          "lx": 257.5,
          "ly": 198.9,
          "climate": "Mediterranean Hills & Coast",
          "soil": "Galestro schist, alberese limestone & coastal clay",
          "grapes": "Sangiovese, Cabernet Sauvignon, Vermentino, Vernaccia",
          "summary": "Iconic hills of Chianti Classico, Brunello di Montalcino, Vino Nobile, and coastal Bolgheri."
        },
        {
          "id": "UMBRIA",
          "name": "Umbria",
          "short": "Umbria",
          "points": "281.8,192.8 312.1,200.9 309.1,237.6 281.8,233.5",
          "lx": 293.9,
          "ly": 217.2,
          "climate": "Inland Continental-Mediterranean",
          "soil": "Volcanic tuff & limestone clay",
          "grapes": "Sagrantino, Grechetto, Sangiovese",
          "summary": "Italy's green heart — monumental Sagrantino di Montefalco and crisp Orvieto Classico."
        },
        {
          "id": "MARCHE",
          "name": "Marche",
          "short": "Marche",
          "points": "297.0,176.5 339.4,188.7 336.4,221.3 309.1,217.2",
          "lx": 321.2,
          "ly": 198.9,
          "climate": "Adriatic Maritime",
          "soil": "Calcareous clay & marine sediments",
          "grapes": "Verdicchio, Montepulciano, Lacrima",
          "summary": "Age-worthy Verdicchio dei Castelli di Jesi and structured Rosso Conero overlooking the Adriatic."
        },
        {
          "id": "LAZIO",
          "name": "Lazio",
          "short": "Lazio",
          "points": "266.6,229.4 333.4,241.7 336.4,286.5 278.8,274.3",
          "lx": 303.0,
          "ly": 258.0,
          "climate": "Warm Mediterranean",
          "soil": "Volcanic tufa & mineral ash",
          "grapes": "Malvasia, Trebbiano, Cesanese",
          "summary": "Volcanic hills surrounding Rome crafting crisp Frascati and refined red Cesanese del Piglio."
        },
        {
          "id": "ABRUZZO",
          "name": "Abruzzo",
          "short": "Abruzzo",
          "points": "315.2,217.2 363.7,233.5 363.7,266.1 324.3,266.1",
          "lx": 339.4,
          "ly": 245.7,
          "climate": "Mountain-to-Sea Mediterranean",
          "soil": "Limestone-clay hills between Gran Sasso & Adriatic",
          "grapes": "Montepulciano, Trebbiano d'Abruzzo, Pecorino",
          "summary": "Deep, savory Montepulciano d'Abruzzo, crisp Pecorino, and iconic Cerasuolo rosato."
        },
        {
          "id": "CAMPANIA",
          "name": "Campania",
          "short": "Campania",
          "points": "336.4,274.3 397.1,282.4 391.0,335.4 342.5,315.0",
          "lx": 366.8,
          "ly": 298.7,
          "climate": "Warm Volcanic Mediterranean",
          "soil": "Vesuvian & Irpinian volcanic ash, tuff & clay",
          "grapes": "Aglianico, Fiano, Greco, Falanghina",
          "summary": "Ancient volcanic terroirs producing Taurasi ('Barolo of the South'), Fiano di Avellino, and Greco di Tufo."
        },
        {
          "id": "PUGLIA",
          "name": "Puglia",
          "short": "Puglia",
          "points": "378.9,258.0 479.0,327.2 460.8,343.5 394.1,290.6",
          "lx": 430.5,
          "ly": 298.7,
          "climate": "Hot Sun-Drenched Mediterranean",
          "soil": "Iron-rich terra rossa over limestone",
          "grapes": "Primitivo, Negroamaro, Nero di Troia, Fiano",
          "summary": "Italy's sun-baked heel known for plush Primitivo di Manduria and savory Salento Negroamaro."
        },
        {
          "id": "BASILICATA",
          "name": "Basilicata",
          "short": "Basilicata",
          "points": "385.0,290.6 427.4,310.9 421.4,335.4 388.0,335.4",
          "lx": 400.1,
          "ly": 315.0,
          "climate": "High-Altitude Continental South",
          "soil": "Extinct Monte Vulture volcanic tuff",
          "grapes": "Aglianico del Vulture",
          "summary": "Dramatic volcanic slopes yielding smoky, age-worthy Aglianico del Vulture."
        },
        {
          "id": "CALABRIA",
          "name": "Calabria",
          "short": "Calabria",
          "points": "397.1,335.4 436.5,376.1 406.2,420.9 391.0,408.7",
          "lx": 412.3,
          "ly": 380.2,
          "climate": "Warm Coastal & Mountain",
          "soil": "Clay-limestone & granite",
          "grapes": "Gaglioppo, Magliocco, Greco Bianco",
          "summary": "Ancient Magna Graecia vineyards producing perfumed, earthy Cirò reds."
        },
        {
          "id": "SICILIA",
          "name": "Sicilia",
          "short": "Sicilia",
          "points": "293.9,420.9 391.0,408.7 375.9,469.8 312.1,449.4",
          "lx": 345.5,
          "ly": 435.2,
          "climate": "Mediterranean Island & High Volcano",
          "soil": "Black Mt. Etna lava, limestone & coastal sand",
          "grapes": "Nerello Mascalese, Carricante, Nero d'Avola, Grillo",
          "summary": "Renaissance island led by high-elevation Mt. Etna volcanic reds & whites and luminous Grillo."
        },
        {
          "id": "SARDEGNA",
          "name": "Sardegna",
          "short": "Sardegna",
          "points": "166.5,290.6 212.0,286.5 209.0,376.1 169.5,376.1",
          "lx": 190.8,
          "ly": 333.3,
          "climate": "Wind-Swept Mediterranean Island",
          "soil": "Weathered granite & coastal limestone",
          "grapes": "Cannonau, Vermentino, Carignano",
          "summary": "Granitic island terroir yielding vibrant Vermentino di Gallura and wild-herb Cannonau."
        }
      ]
    },
    {
      "id": "SPAIN",
      "name": "Spain",
      "short": "Spain",
      "world": "Old World",
      "tagline": "Old-Vine Garnacha, Noble Rioja, Atlantic Albariño & Fortified Sherry",
      "isShowcaseGrid": false,
      "worldPoints": "474.2,119.9 495.0,119.9 508.9,123.5 501.9,130.5 498.1,141.2 484.4,147.1 479.4,142.6 480.8,125.7 475.3,125.4",
      "worldLx": 489.4,
      "worldLy": 131.2,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "57.0,86.8 341.8,86.8 535.4,136.3 448.1,220.4 394.9,339.2 334.2,418.4 197.5,453.0 129.1,393.6 148.1,161.0 72.2,161.0"
      ],
      "regions": [
        {
          "id": "RIAS BAIXAS",
          "name": "Rías Baixas",
          "short": "Rías Baixas",
          "points": "57.0,96.7 102.6,101.6 102.6,161.0 64.6,161.0",
          "lx": 81.7,
          "ly": 136.3,
          "climate": "Cool Wet Atlantic",
          "soil": "Granitic sand & slate",
          "grapes": "Albariño",
          "summary": "Green Spain's coastal gem — crisp, peach-scented, sea-spray Albariño grown on granite pergolas."
        },
        {
          "id": "BIERZO",
          "name": "Bierzo",
          "short": "Bierzo",
          "points": "136.7,111.5 178.5,111.5 178.5,146.2 136.7,146.2",
          "lx": 155.7,
          "ly": 128.8,
          "climate": "Atlantic-Continental Transition",
          "soil": "Steep slate & quartzite",
          "grapes": "Mencía, Godello",
          "summary": "Old-vine mountain Mencía with floral perfume, red berry lift, and crushed-slate minerality."
        },
        {
          "id": "RIOJA",
          "name": "Rioja",
          "short": "Rioja",
          "points": "284.8,116.5 349.4,116.5 349.4,156.1 288.6,156.1",
          "lx": 315.2,
          "ly": 133.8,
          "climate": "Atlantic-Influenced Continental",
          "soil": "Calcareous clay, ferrous clay & alluvial",
          "grapes": "Tempranillo, Garnacha, Graciano, Viura",
          "summary": "Spain's flagship DOCa — silky Reserva and Gran Reserva Tempranillo alongside age-worthy white Rioja."
        },
        {
          "id": "RIBERA DEL DUERO",
          "name": "Ribera del Duero",
          "short": "Ribera",
          "points": "239.2,156.1 300.0,156.1 300.0,190.7 239.2,190.7",
          "lx": 269.6,
          "ly": 173.4,
          "climate": "High-Altitude Extreme Continental",
          "soil": "Limestone, chalk & sandy clay (800m+)",
          "grapes": "Tinto Fino (Tempranillo)",
          "summary": "High plateau intensity yielding dark-fruited, structured, deeply concentrated Tempranillo."
        },
        {
          "id": "RUEDA",
          "name": "Rueda",
          "short": "Rueda",
          "points": "205.1,173.4 239.2,173.4 239.2,205.6 205.1,205.6",
          "lx": 222.2,
          "ly": 188.2,
          "climate": "High Plateau Continental",
          "soil": "Pebbly alluvial gravel & limestone",
          "grapes": "Verdejo, Sauvignon Blanc",
          "summary": "Zesty, fennel-and-lime aromatic Verdejo from sun-drenched Castilian cobblestone vineyards."
        },
        {
          "id": "TORO",
          "name": "Toro",
          "short": "Toro",
          "points": "182.3,166.0 216.5,166.0 216.5,195.7 182.3,195.7",
          "lx": 201.3,
          "ly": 180.8,
          "climate": "Arid Continental",
          "soil": "Pre-phylloxera sand over clay",
          "grapes": "Tinta de Toro",
          "summary": "Ungrafted ancient bush vines creating bold, velvety, powerhouse reds."
        },
        {
          "id": "PRIORAT",
          "name": "Priorat",
          "short": "Priorat",
          "points": "425.3,180.8 453.8,183.3 451.9,208.0 427.2,205.6",
          "lx": 438.6,
          "ly": 195.7,
          "climate": "Warm Mountain Mediterranean",
          "soil": "Llicorella dark copper-quartz slate",
          "grapes": "Garnacha, Cariñena (Carignan)",
          "summary": "Dramatic steep llicorella terraces producing monumental, mineral-charged Catalan reds."
        },
        {
          "id": "PENEDES",
          "name": "Penedès & Cava",
          "short": "Penedès",
          "points": "457.6,170.9 499.3,170.9 495.6,198.1 457.6,198.1",
          "lx": 478.5,
          "ly": 185.8,
          "climate": "Mediterranean",
          "soil": "Limestone & clay hills",
          "grapes": "Xarel·lo, Macabeo, Parellada",
          "summary": "Heart of traditional-method Cava & Corpinnat sparkling wines and crisp Catalan whites."
        },
        {
          "id": "JEREZ",
          "name": "Jerez (Sherry)",
          "short": "Jerez",
          "points": "163.3,398.6 197.5,403.5 193.7,438.2 167.1,433.2",
          "lx": 178.5,
          "ly": 418.4,
          "climate": "Warm Coastal Atlantic",
          "soil": "Blinding white albariza chalk",
          "grapes": "Palomino Fino, Pedro Ximénez",
          "summary": "The Sherry Triangle — bone-dry flor-aged Fino & Manzanilla, nutty Amontillado, and opulent Oloroso."
        }
      ]
    },
    {
      "id": "USA",
      "name": "United States",
      "short": "USA / CA",
      "world": "New World",
      "tagline": "California Icon AVAs, Pacific Northwest Pinot & Cool-Climate Finger Lakes",
      "isShowcaseGrid": false,
      "worldPoints": "153.6,101.5 175.0,99.3 236.1,99.3 269.4,110.3 291.7,114.0 313.9,114.0 305.6,126.8 290.3,148.9 276.4,185.7 266.7,169.1 230.0,183.8 204.2,162.5 174.7,159.9 159.7,140.4 154.4,125.0",
      "worldLx": 216.7,
      "worldLy": 134.2,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "50.6,159.2 125.3,151.5 338.8,151.5 455.3,189.8 532.9,202.6 557.1,247.2 523.2,323.8 469.8,368.5 319.4,368.5 227.2,368.5 124.4,362.1 88.5,330.2 72.0,294.5 53.5,240.9"
      ],
      "regions": [
        {
          "id": "NAPA VALLEY",
          "name": "Napa Valley (CA)",
          "short": "Napa Valley",
          "points": "70.0,274.0 81.7,274.0 81.7,291.9 71.0,291.9",
          "lx": 73.9,
          "ly": 285.5,
          "climate": "Warm Mediterranean with San Pablo Bay fog",
          "soil": "Volcanic benches & alluvial valley floor",
          "grapes": "Cabernet Sauvignon, Chardonnay, Merlot, Sauvignon Blanc",
          "summary": "America's premier fine-wine valley — structured benchland Cabernet and opulent estate Chardonnay."
        },
        {
          "id": "SONOMA COUNTY",
          "name": "Sonoma County (CA)",
          "short": "Sonoma",
          "points": "55.5,272.8 70.0,272.8 71.0,291.9 58.4,291.9",
          "lx": 66.1,
          "ly": 283.0,
          "climate": "Cool Pacific Fog to Warm Inland",
          "soil": "Goldridge sandy loam & coastal sandstone",
          "grapes": "Pinot Noir, Chardonnay, Zinfandel, Cabernet Sauvignon",
          "summary": "Diverse coastal microclimates spanning Russian River Valley, Sonoma Coast, and Dry Creek old-vine Zinfandel."
        },
        {
          "id": "PASO ROBLES",
          "name": "Paso Robles (CA)",
          "short": "Paso Robles",
          "points": "80.7,309.8 101.1,309.8 101.1,327.6 83.6,327.6",
          "lx": 89.4,
          "ly": 321.9,
          "climate": "Wide Diurnal Mediterranean",
          "soil": "Calcareous marine limestone (Adelaida)",
          "grapes": "Cabernet Sauvignon, Syrah, Grenache, Mourvèdre",
          "summary": "Sun-drenched limestone hills famed for bold Rhône-style blends and plush Central Coast Cabernets."
        },
        {
          "id": "SANTA BARBARA",
          "name": "Santa Barbara & Central Coast (CA)",
          "short": "Santa Barbara",
          "points": "84.6,327.6 107.9,327.6 107.9,346.8 88.5,344.2",
          "lx": 95.3,
          "ly": 335.3,
          "climate": "Transverse Valley Cool Marine",
          "soil": "Diatomaceous earth & marine sand",
          "grapes": "Pinot Noir, Chardonnay, Syrah",
          "summary": "East-west coastal valleys funneling Pacific fog into Sta. Rita Hills for electric Pinot Noir & Chardonnay."
        },
        {
          "id": "WILLAMETTE VALLEY",
          "name": "Willamette Valley (OR)",
          "short": "Willamette OR",
          "points": "52.6,189.8 78.8,189.8 78.8,220.4 53.5,220.4",
          "lx": 66.1,
          "ly": 203.9,
          "climate": "Cool Marine Temperate",
          "soil": "Red volcanic Jory basalt & marine sediment",
          "grapes": "Pinot Noir, Chardonnay, Pinot Gris",
          "summary": "Burgundian-latitude Oregon hills celebrated for silky, earthy Pinot Noir and crystalline Chardonnay."
        },
        {
          "id": "COLUMBIA VALLEY",
          "name": "Columbia Valley (WA)",
          "short": "Columbia WA",
          "points": "81.7,160.5 123.4,160.5 123.4,194.9 81.7,194.9",
          "lx": 103.0,
          "ly": 182.2,
          "climate": "Dry Continental (Cascade rain shadow)",
          "soil": "Missoula Flood silt over fractured basalt",
          "grapes": "Cabernet Sauvignon, Syrah, Merlot, Riesling",
          "summary": "Long northern sunshine and cool desert nights crafting vibrant Walla Walla Syrah and poised Cabernet."
        },
        {
          "id": "FINGER LAKES",
          "name": "Finger Lakes (NY)",
          "short": "Finger Lakes NY",
          "points": "498.9,220.4 530.9,220.4 530.9,243.4 498.9,243.4",
          "lx": 515.4,
          "ly": 233.2,
          "climate": "Cool Continental moderated by glacial lakes",
          "soil": "Devonian shale, slate & glacial gravel",
          "grapes": "Riesling, Cabernet Franc, Gewürztraminer",
          "summary": "Deep glacial lake slopes producing world-class dry Riesling and aromatic cool-climate Cabernet Franc."
        }
      ]
    },
    {
      "id": "CHILE",
      "name": "Chile",
      "short": "Chile",
      "world": "New World",
      "tagline": "Between the Pacific Humboldt Current & High Andean Peaks",
      "isShowcaseGrid": false,
      "worldPoints": "304.2,345.6 313.3,360.3 306.9,389.7 305.6,411.8 301.4,441.2 309.7,477.9 294.4,479.8 290.3,448.5 295.8,415.4 300.6,386.0 302.2,352.9",
      "worldLx": 301.9,
      "worldLy": 402.6,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "288.9,45.7 346.0,45.7 339.7,192.4 330.1,289.0 301.6,404.8 282.6,474.3 215.9,474.3 222.3,366.2 250.8,289.0 285.7,192.4 288.9,95.9"
      ],
      "regions": [
        {
          "id": "LIMARI VALLEY",
          "name": "Limarí Valley",
          "short": "Limarí",
          "points": "287.3,76.6 330.1,76.6 330.1,126.8 288.9,126.8",
          "lx": 307.9,
          "ly": 101.7,
          "climate": "Arid Coastal (Camanchaca morning fog)",
          "soil": "Rare calcareous limestone & clay",
          "grapes": "Chardonnay, Pinot Noir, Syrah",
          "summary": "Northern desert edge cooled by ocean mist — Chile's benchmark for chalky, saline Chardonnay."
        },
        {
          "id": "ACONCAGUA VALLEY",
          "name": "Aconcagua Valley",
          "short": "Aconcagua",
          "points": "288.9,161.5 336.5,161.5 336.5,198.2 288.9,198.2",
          "lx": 311.1,
          "ly": 182.8,
          "climate": "Warm Inland to Cool Pacific Coast",
          "soil": "Rocky alluvial & granitic coastal slopes",
          "grapes": "Cabernet Sauvignon, Syrah, Carménère, Pinot Noir",
          "summary": "Shadowed by the Western Hemisphere's highest peak — refined reds and crisp coastal Aconcagua Costa."
        },
        {
          "id": "CASABLANCA VALLEY",
          "name": "Casablanca Valley",
          "short": "Casablanca",
          "points": "282.6,196.3 304.8,196.3 304.8,215.6 282.6,215.6",
          "lx": 293.7,
          "ly": 205.9,
          "climate": "Cool Maritime Fog",
          "soil": "Decomposed granite & coastal sand",
          "grapes": "Sauvignon Blanc, Chardonnay, Pinot Noir",
          "summary": "Pioneering cool-climate valley famed for zesty citrus Sauvignon Blanc and silky coastal Pinot Noir."
        },
        {
          "id": "MAIPO VALLEY",
          "name": "Maipo Valley",
          "short": "Maipo",
          "points": "304.8,204.0 339.7,204.0 339.7,234.9 304.8,234.9",
          "lx": 320.6,
          "ly": 219.5,
          "climate": "Warm Mediterranean with Andean night breezes",
          "soil": "Rocky alluvial Andean riverbeds (Alto Maipo)",
          "grapes": "Cabernet Sauvignon, Carménère, Syrah",
          "summary": "Chile's historic fine-wine cradle — mint-and-cassis Alto Maipo Cabernet Sauvignon of noble structure."
        },
        {
          "id": "LEYDA VALLEY",
          "name": "Leyda & San Antonio",
          "short": "Leyda",
          "points": "281.0,215.6 303.2,215.6 303.2,233.0 281.0,233.0",
          "lx": 290.5,
          "ly": 221.4,
          "climate": "Very Cool Coastal Maritime",
          "soil": "Coastal granite & clay",
          "grapes": "Sauvignon Blanc, Pinot Noir, Syrah",
          "summary": "Just miles from the cold Pacific — razor-sharp Sauvignon Blanc and peppery cool-climate Syrah."
        },
        {
          "id": "COLCHAGUA VALLEY",
          "name": "Colchagua Valley",
          "short": "Colchagua",
          "points": "276.2,236.8 327.0,236.8 327.0,275.4 273.0,275.4",
          "lx": 300.0,
          "ly": 256.1,
          "climate": "Warm Sunny Mediterranean",
          "soil": "Granitic Apalta amphitheater & alluvial clay",
          "grapes": "Carménère, Cabernet Sauvignon, Syrah, Malbec",
          "summary": "Iconic Apalta hillsides delivering plush, velvet-textured Carménère and world-class Bordeaux blends."
        },
        {
          "id": "MAULE VALLEY",
          "name": "Maule Valley",
          "short": "Maule",
          "points": "257.2,277.4 317.4,277.4 311.1,327.6 250.8,327.6",
          "lx": 287.3,
          "ly": 300.5,
          "climate": "Dry-Farmed Warm Continental-Coastal",
          "soil": "Ancient granite & volcanic clay",
          "grapes": "Carignan (VIGNO), País, Cabernet Sauvignon",
          "summary": "Centuries-old dry-farmed bush vines driving Chile's artisanal Carignan and heritage País renaissance."
        }
      ]
    },
    {
      "id": "ARGENTINA",
      "name": "Argentina",
      "short": "Argentina",
      "world": "New World",
      "tagline": "High-Altitude Andean Desert Terroirs & Velvety Mountain Malbec",
      "isShowcaseGrid": false,
      "worldPoints": "315.3,360.3 338.9,362.1 350.0,375.0 340.3,406.2 340.3,421.0 319.4,435.7 312.5,477.9 304.2,470.6 302.2,433.8 306.1,404.4 308.9,375.0",
      "worldLx": 319.4,
      "worldLy": 406.2,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "271.8,38.0 408.7,47.7 432.8,153.8 416.7,279.3 416.7,356.5 296.0,433.7 279.9,482.0 191.3,482.0 196.2,356.5 215.5,250.3 231.6,115.2"
      ],
      "regions": [
        {
          "id": "SALTA",
          "name": "Salta (Cafayate)",
          "short": "Salta",
          "points": "250.9,67.0 308.9,67.0 308.9,138.4 250.9,138.4",
          "lx": 281.5,
          "ly": 107.5,
          "climate": "Extreme High-Altitude Desert (1,700–3,000m)",
          "soil": "Sandy alluvial & mountain schist",
          "grapes": "Torrontés, Malbec, Cabernet Sauvignon",
          "summary": "Among the highest vineyards on Earth — intensely floral Torrontés and vibrant high-altitude Malbec."
        },
        {
          "id": "SAN JUAN",
          "name": "San Juan",
          "short": "San Juan",
          "points": "213.9,182.8 263.8,182.8 263.8,234.9 213.9,234.9",
          "lx": 238.0,
          "ly": 215.6,
          "climate": "Warm Arid Foothills",
          "soil": "Calcareous Pedernal mountain soils",
          "grapes": "Syrah, Malbec, Bonarda",
          "summary": "Sun-drenched valleys and cool high Pedernal limestone producing spicy Syrah and lifted Malbec."
        },
        {
          "id": "MENDOZA",
          "name": "Mendoza (Uco Valley & Luján)",
          "short": "Mendoza",
          "points": "212.3,236.8 267.0,236.8 260.6,304.4 210.7,304.4",
          "lx": 233.2,
          "ly": 261.9,
          "climate": "High-Altitude Sunny Desert (900–1,500m)",
          "soil": "Alluvial river stones coated in calcium carbonate",
          "grapes": "Malbec, Cabernet Franc, Chardonnay, Semillón",
          "summary": "Argentina's viticultural epicenter — from plush Luján de Cuyo to chalky, electric Uco Valley Malbec & Cabernet Franc."
        },
        {
          "id": "PATAGONIA",
          "name": "Patagonia (Río Negro & Neuquén)",
          "short": "Patagonia",
          "points": "202.6,343.0 312.1,343.0 304.0,424.1 199.4,424.1",
          "lx": 250.9,
          "ly": 375.8,
          "climate": "Cool Wind-Swept Southern Steppe",
          "soil": "Alluvial sand, gravel & limestone",
          "grapes": "Pinot Noir, Malbec, Merlot, Semillón",
          "summary": "Constant southern winds yield thick-skinned, fragrant Pinot Noir and fine-boned cool-climate Malbec."
        }
      ]
    },
    {
      "id": "PORTUGAL",
      "name": "Portugal",
      "short": "Portugal",
      "world": "Old World",
      "tagline": "Dramatic Schist Terraces, Indigenous Blends & Timeless Port",
      "isShowcaseGrid": false,
      "worldPoints": "473.6,125.4 481.9,125.4 480.8,139.7 479.4,143.4 475.0,143.4 473.6,136.8",
      "worldLx": 477.2,
      "worldLy": 133.8,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "246.8,76.3 406.3,76.3 365.0,206.4 335.4,374.8 335.4,443.7 246.8,451.4 211.4,313.6 246.8,160.5"
      ],
      "regions": [
        {
          "id": "VINHO VERDE",
          "name": "Vinho Verde",
          "short": "Vinho Verde",
          "points": "246.8,61.0 305.9,68.6 300.0,137.5 252.7,137.5",
          "lx": 276.4,
          "ly": 99.2,
          "climate": "Cool Lush Atlantic",
          "soil": "Granite",
          "grapes": "Alvarinho, Loureiro, Avesso",
          "summary": "Crisp, linear, citrus-and-sea-breeze Atlantic whites with remarkable aging potential in Monção e Melgaço."
        },
        {
          "id": "DOURO VALLEY",
          "name": "Douro Valley",
          "short": "Douro",
          "points": "305.9,99.2 394.5,99.2 382.7,160.5 305.9,160.5",
          "lx": 335.4,
          "ly": 129.9,
          "climate": "Warm Continental River Canyon",
          "soil": "Steep terraced vertical schist",
          "grapes": "Touriga Nacional, Touriga Franca, Tinta Roriz, Rabigato",
          "summary": "UNESCO terraced river valley crafting legendary Vintage & Tawny Port alongside monumental dry reds."
        },
        {
          "id": "DAO",
          "name": "Dão",
          "short": "Dão",
          "points": "288.2,160.5 341.3,160.5 335.4,206.4 288.2,206.4",
          "lx": 308.9,
          "ly": 183.4,
          "climate": "Mountain-Sheltered Temperate",
          "soil": "Decomposed granite",
          "grapes": "Touriga Nacional, Jaen, Encruzado",
          "summary": "Pine-scented granite hills producing Portugal's most Burgundian, silky reds and electric Encruzado whites."
        },
        {
          "id": "BAIRRADA",
          "name": "Bairrada",
          "short": "Bairrada",
          "points": "246.8,168.1 285.2,168.1 285.2,214.1 246.8,214.1",
          "lx": 267.5,
          "ly": 191.1,
          "climate": "Maritime Atlantic",
          "soil": "Calcareous clay-limestone",
          "grapes": "Baga, Maria Gomes, Bical",
          "summary": "Cool Atlantic limestone territory famed for age-worthy Baga reds and crisp traditional-method sparkling wines."
        },
        {
          "id": "ALENTEJO",
          "name": "Alentejo",
          "short": "Alentejo",
          "points": "264.6,267.7 359.1,275.3 341.3,420.8 258.7,413.1",
          "lx": 311.8,
          "ly": 344.2,
          "climate": "Warm Cork-Oak Mediterranean",
          "soil": "Granite, schist & marble",
          "grapes": "Aragonez, Trincadeira, Alicante Bouschet, Antão Vaz",
          "summary": "Rolling golden plains crafting generous, velvety reds and amphora-aged Vinho de Talha."
        }
      ]
    },
    {
      "id": "GERMANY",
      "name": "Germany",
      "short": "Germany",
      "world": "Old World",
      "tagline": "Steep Slate Rivers, Electric Riesling & Refined Spätburgunder",
      "isShowcaseGrid": false,
      "worldPoints": "516.7,91.9 523.6,77.9 539.4,81.2 541.7,91.5 538.3,101.1 528.3,105.5 520.8,104.4 517.2,97.4",
      "worldLx": 528.3,
      "worldLy": 91.9,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "144.5,262.8 232.9,49.2 434.3,99.8 462.5,257.2 420.1,403.3 292.9,470.8 197.5,453.9 151.6,347.1"
      ],
      "regions": [
        {
          "id": "MOSEL",
          "name": "Mosel",
          "short": "Mosel",
          "points": "155.1,296.5 201.1,296.5 197.5,347.1 155.1,347.1",
          "lx": 179.9,
          "ly": 319.0,
          "climate": "Cool Northern River Valley",
          "soil": "Steep blue & red Devonian slate",
          "grapes": "Riesling",
          "summary": "Gravity-defying slate cliffs producing ethereal, filigree Kabinett, Spätlese, and dry GG Riesling."
        },
        {
          "id": "RHEINGAU",
          "name": "Rheingau",
          "short": "Rheingau",
          "points": "204.6,302.2 232.9,302.2 232.9,324.6 204.6,324.6",
          "lx": 217.0,
          "ly": 316.2,
          "climate": "South-Facing Rhine Slope",
          "soil": "Quartzite, slate & loess",
          "grapes": "Riesling, Spätburgunder",
          "summary": "Historic aristocratic estates crafting structured, peach-and-mineral dry Riesling and Assmannshausen Pinot Noir."
        },
        {
          "id": "RHEINHESSEN",
          "name": "Rheinhessen",
          "short": "Rheinhessen",
          "points": "208.1,324.6 232.9,324.6 232.9,349.9 208.1,349.9",
          "lx": 222.3,
          "ly": 335.9,
          "climate": "Mild Dry Continental",
          "soil": "Red Rotliegend slate & limestone",
          "grapes": "Riesling, Silvaner, Spätburgunder",
          "summary": "Dynamic limestone hills behind Germany's celebrated dry Grosses Gewächs Riesling revolution."
        },
        {
          "id": "PFALZ",
          "name": "Pfalz",
          "short": "Pfalz",
          "points": "204.6,349.9 232.9,349.9 229.3,378.0 204.6,378.0",
          "lx": 220.5,
          "ly": 361.2,
          "climate": "Sunny Warm Haardt Foothills",
          "soil": "Sandstone, basalt & limestone",
          "grapes": "Riesling, Spätburgunder, Weissburgunder",
          "summary": "Ripe, textured dry Riesling and serious barrel-aged Spätburgunder along the German Wine Route."
        },
        {
          "id": "FRANKEN",
          "name": "Franken",
          "short": "Franken",
          "points": "261.1,307.8 314.1,307.8 314.1,347.1 261.1,347.1",
          "lx": 289.4,
          "ly": 327.4,
          "climate": "Continental Main River",
          "soil": "Muschelkalk shell limestone",
          "grapes": "Silvaner, Riesling",
          "summary": "Bone-dry, earthy, chalk-driven Silvaner bottled in the iconic Bocksbeutel flagon."
        },
        {
          "id": "BADEN",
          "name": "Baden",
          "short": "Baden",
          "points": "197.5,380.8 229.3,380.8 222.3,453.9 197.5,453.9",
          "lx": 211.7,
          "ly": 420.2,
          "climate": "Warmest German Region",
          "soil": "Volcanic Kaiserstuhl & loess",
          "grapes": "Spätburgunder, Grauburgunder, Weissburgunder",
          "summary": "Volcanic slopes along the Rhine yielding Germany's most Burgundian Pinot Noir and Pinot Gris."
        }
      ]
    },
    {
      "id": "AUSTRIA",
      "name": "Austria",
      "short": "Austria",
      "world": "Old World",
      "tagline": "Crystalline Danube Grüner Veltliner, Terraced Riesling & Blaufränkisch",
      "isShowcaseGrid": false,
      "worldPoints": "526.7,104.8 535.6,100.7 547.2,100.0 546.1,107.4 538.1,108.5 528.9,107.4",
      "worldLx": 540.0,
      "worldLy": 104.4,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "57.4,279.2 264.4,173.5 406.7,135.0 536.1,154.3 542.6,260.0 490.8,356.1 322.6,375.3 109.2,346.5"
      ],
      "regions": [
        {
          "id": "WACHAU",
          "name": "Wachau",
          "short": "Wachau",
          "points": "406.7,178.3 448.8,178.3 448.8,213.9 406.7,213.9",
          "lx": 432.6,
          "ly": 197.5,
          "climate": "Cool Alpine-Pannonian Confluence",
          "soil": "Steep primary gneiss & granite terraces",
          "grapes": "Grüner Veltliner, Riesling",
          "summary": "UNESCO Danube gorge producing razor-pure Smaragd & Federspiel whites of extraordinary longevity."
        },
        {
          "id": "KAMPTAL",
          "name": "Kamptal",
          "short": "Kamptal",
          "points": "442.3,162.0 468.2,162.0 468.2,194.6 442.3,194.6",
          "lx": 453.3,
          "ly": 181.2,
          "climate": "Cool Nights & Sunny Days",
          "soil": "Volcanic sandstone (Heiligenstein) & loess",
          "grapes": "Grüner Veltliner, Riesling",
          "summary": "Home to Zöbing's iconic Heiligenstein vineyard — spicy, mineral-drenched dry whites."
        },
        {
          "id": "KREMSTAL",
          "name": "Kremstal",
          "short": "Kremstal",
          "points": "442.3,194.6 474.7,194.6 474.7,223.5 442.3,223.5",
          "lx": 455.3,
          "ly": 207.1,
          "climate": "Danube River Valley",
          "soil": "Deep loess terraces & primary rock",
          "grapes": "Grüner Veltliner, Riesling",
          "summary": "Supple, white-pepper Grüner Veltliner and fragrant stone-fruit Riesling around historic Krems."
        },
        {
          "id": "BURGENLAND",
          "name": "Burgenland",
          "short": "Burgenland",
          "points": "481.1,216.7 542.6,221.6 526.4,327.3 481.1,308.1",
          "lx": 507.0,
          "ly": 255.2,
          "climate": "Warm Pannonian Lake",
          "soil": "Limestone, mica schist & slate",
          "grapes": "Blaufränkisch, Zweigelt, St. Laurent, Furmint",
          "summary": "Austria's red-wine powerhouse and sweet Ruster Ausbruch jewel along Lake Neusiedl."
        },
        {
          "id": "STYRIA",
          "name": "Styria (Steiermark)",
          "short": "Styria",
          "points": "387.3,312.9 474.7,312.9 471.4,365.7 393.8,365.7",
          "lx": 432.6,
          "ly": 346.5,
          "climate": "Steep Alpine-Mediterranean",
          "soil": "Opok marl, limestone & volcanic basalt",
          "grapes": "Sauvignon Blanc, Morillon (Chardonnay), Welschriesling",
          "summary": "Steep emerald hills crafting some of the world's finest, tautest cool-climate Sauvignon Blanc."
        }
      ]
    },
    {
      "id": "AUSTRALIA",
      "name": "Australia",
      "short": "Australia",
      "world": "New World",
      "tagline": "Centuries-Old Barossa Shiraz, Maritime Margaret River & Cool Tasmania",
      "isShowcaseGrid": false,
      "worldPoints": "816.7,360.3 838.9,343.8 863.9,323.5 879.2,325.4 897.2,319.9 915.3,354.8 926.4,382.4 916.7,417.3 901.4,438.2 886.1,417.3 863.9,397.1 819.4,406.2 813.9,375.0",
      "worldLx": 872.2,
      "worldLy": 371.3,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "68.9,185.1 163.7,124.9 270.4,51.4 335.6,58.1 412.6,38.0 489.6,165.0 537.0,265.3 495.6,392.4 388.9,401.8 329.6,359.0 246.7,318.8 80.7,352.3 57.0,238.6",
        "433.9,436.5 475.4,436.5 462.4,474.0 438.7,468.6"
      ],
      "regions": [
        {
          "id": "MARGARET RIVER",
          "name": "Margaret River (WA)",
          "short": "Margaret River",
          "points": "71.3,325.5 106.8,325.5 106.8,359.0 71.3,359.0",
          "lx": 83.1,
          "ly": 342.9,
          "climate": "Pristine Indian Ocean Maritime",
          "soil": "Ancient gravelly granite loam",
          "grapes": "Cabernet Sauvignon, Chardonnay, Sauvignon Blanc-Sémillon",
          "summary": "Surrounded on three sides by ocean — Bordeaux-class Cabernet and luminous Chardonnay."
        },
        {
          "id": "CLARE VALLEY",
          "name": "Clare Valley (SA)",
          "short": "Clare Valley",
          "points": "346.2,322.9 374.7,322.9 374.7,345.6 346.2,345.6",
          "lx": 360.4,
          "ly": 334.9,
          "climate": "Elevated Continental",
          "soil": "Slate (Polish Hill) & red terra rossa over limestone",
          "grapes": "Riesling, Shiraz, Cabernet Sauvignon",
          "summary": "World benchmark for bone-dry, lime-zest, age-worthy dry Australian Riesling."
        },
        {
          "id": "BAROSSA VALLEY",
          "name": "Barossa Valley (SA)",
          "short": "Barossa",
          "points": "355.7,345.6 383.0,345.6 383.0,359.0 355.7,359.0",
          "lx": 366.4,
          "ly": 352.3,
          "climate": "Warm Sunny Mediterranean",
          "soil": "Ancient red-brown clay & sandy loam",
          "grapes": "Shiraz, Grenache, Mataro",
          "summary": "Home to the world's oldest continuously producing ungrafted Shiraz vines — opulent, spiced, iconic."
        },
        {
          "id": "MCLAREN VALE",
          "name": "McLaren Vale (SA)",
          "short": "McLaren Vale",
          "points": "347.4,359.0 374.7,359.0 374.7,375.0 347.4,375.0",
          "lx": 359.3,
          "ly": 365.7,
          "climate": "Coastal Mediterranean",
          "soil": "40+ ancient geological formations",
          "grapes": "Shiraz, Grenache, Cabernet Sauvignon, Fiano",
          "summary": "Sea-breeze coastal vineyards leading Australia's biodynamic and old-vine Grenache movement."
        },
        {
          "id": "YARRA VALLEY",
          "name": "Yarra Valley (VIC)",
          "short": "Yarra Valley",
          "points": "426.8,379.0 462.4,379.0 462.4,405.8 426.8,405.8",
          "lx": 442.2,
          "ly": 392.4,
          "climate": "Cool Maritime-Influenced Foothills",
          "soil": "Red volcanic & grey sandy loam",
          "grapes": "Pinot Noir, Chardonnay, Syrah",
          "summary": "Elegant, restrained Victorian cool-climate Chardonnay, fragrant Pinot Noir, and peppery Syrah."
        },
        {
          "id": "HUNTER VALLEY",
          "name": "Hunter Valley (NSW)",
          "short": "Hunter Valley",
          "points": "493.2,312.2 528.7,312.2 528.7,342.9 493.2,342.9",
          "lx": 511.0,
          "ly": 328.2,
          "climate": "Warm Subtropical Maritime",
          "soil": "Sandy alluvial & volcanic clay",
          "grapes": "Sémillon, Shiraz",
          "summary": "Unique magic of low-alcohol, unoaked Hunter Sémillon that transforms into liquid toasted honey with age."
        },
        {
          "id": "TASMANIA",
          "name": "Tasmania",
          "short": "Tasmania",
          "points": "431.6,433.9 477.8,433.9 474.2,475.3 433.9,472.6",
          "lx": 455.3,
          "ly": 453.9,
          "climate": "Cool Southern Ocean Maritime",
          "soil": "Dolerite, basalt & sandstone",
          "grapes": "Chardonnay, Pinot Noir, Sparkling",
          "summary": "Australia's cool-climate jewel for vibrant traditional-method sparkling, crisp Chardonnay, and Pinot Noir."
        }
      ]
    },
    {
      "id": "NEW ZEALAND",
      "name": "New Zealand",
      "short": "New Zealand",
      "world": "New World",
      "tagline": "Electric Marlborough Sauvignon Blanc & Dramatic Central Otago Pinot Noir",
      "isShowcaseGrid": false,
      "worldPoints": "979.2,406.2 995.8,418.4 986.1,433.8 973.6,450.7 962.5,449.3 966.7,437.5 977.8,424.6",
      "worldLx": 979.2,
      "worldLy": 432.0,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "312.9,65.3 452.8,157.5 369.9,287.3 333.7,208.8 307.8,106.3",
        "312.9,263.4 346.6,294.2 248.2,458.1 147.2,447.8 178.3,372.7 266.3,297.6"
      ],
      "regions": [
        {
          "id": "HAWKES BAY",
          "name": "Hawke's Bay",
          "short": "Hawke's Bay",
          "points": "385.4,195.1 439.8,195.1 434.6,242.9 385.4,242.9",
          "lx": 411.3,
          "ly": 219.0,
          "climate": "Warm Sunny Maritime",
          "soil": "Gimblett Gravels free-draining river stones",
          "grapes": "Syrah, Cabernet Sauvignon, Merlot, Chardonnay",
          "summary": "North Island's warm gravel beds producing peppery, Côte-Rôtie-like Syrah and noble Bordeaux blends."
        },
        {
          "id": "MARTINBOROUGH",
          "name": "Martinborough (Wairarapa)",
          "short": "Martinborough",
          "points": "357.0,256.6 398.4,256.6 390.6,294.2 357.0,294.2",
          "lx": 376.4,
          "ly": 277.1,
          "climate": "Cool Dry Wind-Swept",
          "soil": "Ancient alluvial gravel terraces",
          "grapes": "Pinot Noir, Sauvignon Blanc",
          "summary": "Boutique family estates crafting savory, dark-fruited, structured Pinot Noir."
        },
        {
          "id": "MARLBOROUGH",
          "name": "Marlborough",
          "short": "Marlborough",
          "points": "305.2,270.2 349.2,277.1 344.0,311.2 305.2,307.8",
          "lx": 333.7,
          "ly": 290.7,
          "climate": "Sunny Cool Maritime (Wide diurnal shift)",
          "soil": "Wairau & Awatere stony riverbeds",
          "grapes": "Sauvignon Blanc, Pinot Noir, Chardonnay",
          "summary": "Global icon for electric passionfruit-and-lime Sauvignon Blanc and vibrant coastal Pinot Noir."
        },
        {
          "id": "CENTRAL OTAGO",
          "name": "Central Otago",
          "short": "Central Otago",
          "points": "178.3,383.0 253.4,383.0 248.2,434.2 178.3,434.2",
          "lx": 217.1,
          "ly": 406.9,
          "climate": "Southernmost Semi-Continental Alpine",
          "soil": "Mica schist & glacial loess",
          "grapes": "Pinot Noir, Riesling, Pinot Gris",
          "summary": "World's southernmost major wine region — intense, silky, wild-thyme Pinot Noir framed by snow peaks."
        }
      ]
    },
    {
      "id": "SOUTH AFRICA",
      "name": "South Africa",
      "short": "South Africa",
      "world": "New World",
      "tagline": "365+ Years of Cape Heritage, Old-Vine Chenin Blanc & Cool Coastal Syrah",
      "isShowcaseGrid": false,
      "worldPoints": "545.8,384.2 558.3,375.0 572.2,362.1 591.1,377.9 586.1,393.4 576.4,402.6 555.6,407.4 549.4,400.7",
      "worldLx": 566.7,
      "worldLy": 391.5,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "103.5,71.0 522.7,71.0 522.7,386.0 365.5,433.2 208.3,370.2 142.8,354.5 116.6,165.5"
      ],
      "regions": [
        {
          "id": "SWARTLAND",
          "name": "Swartland",
          "short": "Swartland",
          "points": "129.7,102.5 273.8,102.5 273.8,236.4 129.7,236.4",
          "lx": 201.8,
          "ly": 181.3,
          "climate": "Warm Dry Mediterranean",
          "soil": "Ancient granite (Paardeberg) & Malmesbury shale",
          "grapes": "Chenin Blanc, Syrah, Grenache, Cinsault",
          "summary": "Epicenter of South Africa's old-vine revolution — textured bush-vine Chenin and thrilling Rhône blends."
        },
        {
          "id": "STELLENBOSCH",
          "name": "Stellenbosch",
          "short": "Stellenbosch",
          "points": "182.1,263.1 241.1,263.1 241.1,326.1 182.1,326.1",
          "lx": 214.9,
          "ly": 294.6,
          "climate": "False Bay Maritime-Cooled",
          "soil": "Decomposed mountain granite & sandstone",
          "grapes": "Cabernet Sauvignon, Chenin Blanc, Pinotage, Syrah",
          "summary": "Historic university wine town crafting benchmark Cape Cabernet Sauvignon and noble Bordeaux blends."
        },
        {
          "id": "FRANSCHHOEK",
          "name": "Franschhoek",
          "short": "Franschhoek",
          "points": "241.1,263.1 306.6,263.1 306.6,319.8 241.1,319.8",
          "lx": 263.3,
          "ly": 291.5,
          "climate": "Sheltered Mountain Amphitheater",
          "soil": "Sandstone & granite",
          "grapes": "Sémillon, Cap Classique Sparkling, Cabernet Sauvignon",
          "summary": "Huguenot heritage valley renowned for century-old Sémillon and refined Cap Classique sparkling."
        },
        {
          "id": "CONSTANTIA",
          "name": "Constantia",
          "short": "Constantia",
          "points": "132.3,291.5 179.5,291.5 179.5,341.9 132.3,341.9",
          "lx": 158.5,
          "ly": 313.5,
          "climate": "Cool Ocean-Breeze Peninsula",
          "soil": "Table Mountain granite & sandstone",
          "grapes": "Sauvignon Blanc, Muscat de Frontignan",
          "summary": "The Cape's oldest wine estate valley (1685) — crisp Sauvignon Blanc and legendary Vin de Constance."
        },
        {
          "id": "WALKER BAY",
          "name": "Walker Bay (Hemel-en-Aarde)",
          "short": "Walker Bay",
          "points": "227.9,335.6 352.4,335.6 352.4,414.3 227.9,414.3",
          "lx": 280.4,
          "ly": 370.2,
          "climate": "Cool Atlantic Benguela Current",
          "soil": "Bokkeveld clay-shale & granite",
          "grapes": "Pinot Noir, Chardonnay",
          "summary": "Heaven-and-Earth Valley crafting South Africa's most Burgundian, mineral Chardonnay and Pinot Noir."
        }
      ]
    },
    {
      "id": "GREECE",
      "name": "Greece",
      "short": "Greece",
      "world": "Old World",
      "tagline": "Volcanic Island Assyrtiko, Mountain Xinomavro & Ancient Mediterranean Soul",
      "isShowcaseGrid": false,
      "worldPoints": "553.9,130.5 565.3,126.8 573.3,128.7 571.7,150.0 565.3,150.7 562.5,145.2 556.9,137.9",
      "worldLx": 562.5,
      "worldLy": 137.5,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "140.7,164.9 190.5,95.1 339.8,57.0 459.3,88.7 364.7,139.5 290.0,215.6 339.8,298.1 295.0,367.8 260.2,380.5 205.4,291.7 150.7,215.6",
        "314.9,437.6 454.3,450.3 439.4,475.7 319.9,463.0"
      ],
      "regions": [
        {
          "id": "NAOUSSA",
          "name": "Naoussa (Macedonia)",
          "short": "Naoussa",
          "points": "205.4,82.4 285.1,82.4 285.1,139.5 205.4,139.5",
          "lx": 242.8,
          "ly": 110.9,
          "climate": "Cool Mountain Continental",
          "soil": "Limestone & clay slopes of Mt. Vermio",
          "grapes": "Xinomavro",
          "summary": "Often likened to Barolo — savory, sun-dried tomato, rose-petal, and truffle-scented Xinomavro."
        },
        {
          "id": "NEMEA",
          "name": "Nemea (Peloponnese)",
          "short": "Nemea",
          "points": "235.3,260.0 310.0,260.0 310.0,323.4 235.3,323.4",
          "lx": 272.6,
          "ly": 291.7,
          "climate": "Elevated Mediterranean",
          "soil": "Limestone-clay mountain terraces",
          "grapes": "Agiorgitiko",
          "summary": "Mythic Peloponnese hills producing velvety, spiced dark-cherry Agiorgitiko reds."
        },
        {
          "id": "SANTORINI",
          "name": "Santorini",
          "short": "Santorini",
          "points": "379.6,352.0 441.9,352.0 441.9,409.1 379.6,409.1",
          "lx": 411.0,
          "ly": 380.5,
          "climate": "Wind-Whipped Arid Aegean Island",
          "soil": "Ungrafted volcanic pumice, ash & basalt",
          "grapes": "Assyrtiko, Aidani, Athiri",
          "summary": "Woven kouloura basket vines on volcanic caldera soil — electric, salty, bone-dry Assyrtiko."
        },
        {
          "id": "CRETE",
          "name": "Crete",
          "short": "Crete",
          "points": "314.9,431.3 454.3,434.4 444.4,475.7 314.9,472.5",
          "lx": 389.6,
          "ly": 453.5,
          "climate": "Warm Mountain-Cooled Island",
          "soil": "High-altitude limestone",
          "grapes": "Vidiano, Liatiko, Vilana",
          "summary": "Resurgent ancient island terroir celebrated for apricot-mineral Vidiano and ethereal Liatiko reds."
        }
      ]
    },
    {
      "id": "WORLD GEMS",
      "name": "World Gems",
      "short": "World Gems",
      "world": "Old & New World",
      "tagline": "8,000-Year Qvevri Georgia, Royal Tokaj, Uruguay Tannat, Canada & Bekaa Valley",
      "isShowcaseGrid": true,
      "worldPoints": "611.1,119.5 629.2,126.8 627.8,130.5 612.5,126.8",
      "worldLx": 620.8,
      "worldLy": 125.0,
      "mapViewBox": "0 0 600 520",
      "outlines": [
        "41.0,131.6 178.7,149.8 244.6,385.3 475.2,137.7 520.1,180.0 550.0,155.8"
      ],
      "regions": [
        {
          "id": "KAKHETI",
          "name": "Georgia — Kakheti",
          "short": "Georgia",
          "points": "514.1,198.1 556.0,198.1 556.0,143.7 514.1,143.7",
          "lx": 548.5,
          "ly": 156.4,
          "climate": "Caucasus Continental",
          "soil": "Calcareous alluvial Alazani Valley",
          "grapes": "Saperavi, Rkatsiteli, Kisi",
          "summary": "The 8,000-year cradle of wine — clay-amphora (qvevri) amber wines and inky Saperavi."
        },
        {
          "id": "TOKAJ",
          "name": "Hungary — Tokaj",
          "short": "Tokaj",
          "points": "454.2,180.0 496.1,180.0 496.1,131.6 454.2,131.6",
          "lx": 476.4,
          "ly": 137.1,
          "climate": "Continental River Mist",
          "soil": "Volcanic rhyolite tuff & clay",
          "grapes": "Furmint, Hárslevelű",
          "summary": "Volcanic hills crafting electrifying dry Furmint and legendary botrytized Tokaji Aszú."
        },
        {
          "id": "BEKAA VALLEY",
          "name": "Lebanon — Bekaa Valley",
          "short": "Lebanon",
          "points": "496.1,264.5 538.0,264.5 538.0,216.2 496.1,216.2",
          "lx": 520.1,
          "ly": 180.6,
          "climate": "High-Altitude Sunny Valley (1,000m)",
          "soil": "Limestone gravel & red clay",
          "grapes": "Cabernet Sauvignon, Cinsault, Carignan, Obaideh",
          "summary": "Ancient Phoenician wine country famous for soulful, cellar-worthy cedar-and-spice reds."
        },
        {
          "id": "CANELONES",
          "name": "Uruguay — Canelones & Maldonado",
          "short": "Uruguay",
          "points": "208.7,397.4 268.6,397.4 268.6,343.1 208.7,343.1",
          "lx": 244.6,
          "ly": 386.8,
          "climate": "Cool Atlantic Maritime",
          "soil": "Calcareous clay & granite",
          "grapes": "Tannat, Albariño",
          "summary": "Atlantic-cooled coastal vineyards transforming Tannat into plush, refined fine wine alongside crisp Albariño."
        },
        {
          "id": "OKANAGAN & NIAGARA",
          "name": "Canada — Okanagan & Niagara",
          "short": "Canada",
          "points": "47.0,180.0 184.7,180.0 184.7,131.6 47.0,131.6",
          "lx": 112.9,
          "ly": 143.7,
          "climate": "Cool Glacial Lake & Desert",
          "soil": "Glacial silt, limestone & granite",
          "grapes": "Riesling, Chardonnay, Pinot Noir, Cabernet Franc, Icewine",
          "summary": "Cool-climate North American gems delivering taut Niagara Chardonnay, Okanagan Syrah, and luminous Icewine."
        }
      ]
    }
  ]
};

    global.WorldAtlasData = ATLAS_DATA;
})(window);
