export type SeedReview = {
  author: string;
  rating: number;
  title: string;
  body: string;
  verified?: boolean;
  daysAgo: number;
};

export type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAt?: number;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  specs: { label: string; value: string }[];
  highlights: string[];
  images: { id: number; alt: string }[];
  reviews: SeedReview[];
};

export type SeedCategory = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  position: number;
};

const img = (id: number) => `/images/p/${id}.jpg`;

export const seedCategories: SeedCategory[] = [
  {
    slug: "ordinateurs-portables",
    name: "Ordinateurs portables",
    tagline: "La puissance, partout avec vous",
    description:
      "Ultrabooks fins pour les nomades, stations créatives pour les studios et machines gaming pour les joueurs exigeants.",
    image: img(7652541),
    position: 1,
  },
  {
    slug: "pc-et-composants",
    name: "PC & composants",
    tagline: "Assemblés et testés dans notre atelier",
    description:
      "Tours gaming, stations de travail certifiées et composants de dernière génération pour vos propres configurations.",
    image: img(33798627),
    position: 2,
  },
  {
    slug: "ecrans",
    name: "Écrans",
    tagline: "Chaque pixel compte",
    description: "Dalles IPS 4K calibrées, ultra-larges incurvées et moniteurs 240 Hz pour la compétition.",
    image: img(28955771),
    position: 3,
  },
  {
    slug: "peripheriques",
    name: "Périphériques",
    tagline: "Le toucher, le son, l'image",
    description: "Claviers mécaniques, souris de précision, casques à réduction de bruit et webcams 4K.",
    image: img(32755745),
    position: 4,
  },
  {
    slug: "stockage-et-reseau",
    name: "Stockage & réseau",
    tagline: "Rapide et fiable, au bureau comme à la maison",
    description: "SSD NVMe, disques portables chiffrés, Wi-Fi 7 maillé et stations d'accueil Thunderbolt.",
    image: img(28666524),
    position: 5,
  },
  {
    slug: "accessoires",
    name: "Accessoires",
    tagline: "Les essentiels du quotidien",
    description: "Sacs, chargeurs GaN, tapis de bureau, imprimantes et tablettes pour compléter votre espace.",
    image: img(12743405),
    position: 6,
  },
];

export const seedProducts: SeedProduct[] = [
  // ─── Ordinateurs portables ──────────────────────────────────────────────
  {
    slug: "aurelion-aether-14",
    name: "Aether Ultrabook 14",
    brand: "Aurelion",
    category: "ordinateurs-portables",
    shortDescription: "Ultrabook 14\" OLED 2.8K, 1,19 kg, 18 h d'autonomie.",
    description:
      "L'Aether 14 condense le meilleur d'Aurelion dans un châssis en aluminium usiné de seulement 14,9 mm. Sa dalle OLED 2.8K 120 Hz couvre 100 % du DCI-P3 pour des couleurs d'une justesse remarquable, tandis que le processeur Intel Core Ultra 7 et ses 32 Go de mémoire LPDDR5x assurent une réactivité constante, sur batterie comme sur secteur. Pensé pour celles et ceux qui travaillent partout : clavier rétroéclairé silencieux, pavé tactile haptique en verre, Wi-Fi 7 et une autonomie réelle de 18 heures.",
    price: 849000,
    compareAt: 950000,
    stock: 14,
    featured: true,
    isNew: true,
    specs: [
      { label: "Processeur", value: "Intel Core Ultra 7 155H (16 cœurs)" },
      { label: "Mémoire", value: "32 Go LPDDR5x 7467 MT/s" },
      { label: "Stockage", value: "SSD NVMe 1 To PCIe 4.0" },
      { label: "Écran", value: "14\" OLED 2880 × 1800, 120 Hz, 100 % DCI-P3" },
      { label: "Autonomie", value: "Jusqu'à 18 h (75 Wh)" },
      { label: "Connectique", value: "2 × Thunderbolt 4, USB-A, HDMI 2.1, jack" },
      { label: "Poids", value: "1,19 kg" },
      { label: "Garantie", value: "3 ans sur site" },
    ],
    highlights: ["Dalle OLED 2.8K 120 Hz", "1,19 kg seulement", "Charge rapide 50 % en 30 min", "Windows 11 Pro inclus"],
    images: [
      { id: 249535, alt: "Aether Ultrabook 14 entrouvert sur une table blanche" },
      { id: 8534093, alt: "Aether Ultrabook 14 vu de face, écran éteint" },
      { id: 5942722, alt: "Aether Ultrabook 14 sur un bureau minimaliste avec un café" },
    ],
    reviews: [
      { author: "Camille D.", rating: 5, title: "Le portable parfait pour le télétravail", body: "Je l'utilise depuis deux mois entre la maison et le bureau. L'écran OLED est sublime, l'autonomie tient vraiment la journée et le clavier est très agréable. Livraison en 24 h, emballage soigné.", verified: true, daysAgo: 12 },
      { author: "Thomas L.", rating: 5, title: "Silencieux et rapide", body: "Aucun bruit de ventilation en bureautique, et il encaisse Lightroom sans broncher. Le conseiller UORAHAL m'a aidé à choisir la bonne config par téléphone.", verified: true, daysAgo: 31 },
      { author: "Inès M.", rating: 4, title: "Excellent, un port de plus aurait été bienvenu", body: "Très bel objet, finition irréprochable. Je retire une étoile pour le nombre de ports USB-A limité, mais le hub Nexus règle le problème.", verified: true, daysAgo: 58 },
    ],
  },
  {
    slug: "aurelion-nova-pro-16",
    name: "Nova Pro 16 Créateur",
    brand: "Aurelion",
    category: "ordinateurs-portables",
    shortDescription: "Station créative 16\" Mini-LED, RTX 4070, 64 Go, calibrée en usine.",
    description:
      "Conçu avec des monteurs, photographes et architectes, le Nova Pro 16 est une station de travail que l'on glisse dans un sac. Écran Mini-LED 16\" 4K 1000 nits certifié Pantone, GPU RTX 4070 Studio, 64 Go de mémoire et deux emplacements SSD. Le système de refroidissement à chambre à vapeur maintient les performances dans la durée, sans souffler comme un sèche-cheveux.",
    price: 1449000,
    stock: 7,
    featured: true,
    specs: [
      { label: "Processeur", value: "Intel Core i9-14900HX (24 cœurs)" },
      { label: "Carte graphique", value: "NVIDIA GeForce RTX 4070 Laptop 8 Go, pilotes Studio" },
      { label: "Mémoire", value: "64 Go DDR5 5600 MHz (2 × 32 Go)" },
      { label: "Stockage", value: "SSD NVMe 2 To PCIe 4.0 + 1 emplacement libre" },
      { label: "Écran", value: "16\" Mini-LED 3840 × 2400, 1000 nits, Pantone Validated" },
      { label: "Connectique", value: "Thunderbolt 4, 3 × USB-A, HDMI 2.1, SD UHS-II, RJ45" },
      { label: "Poids", value: "2,3 kg" },
      { label: "Garantie", value: "3 ans sur site" },
    ],
    highlights: ["Mini-LED 4K 1000 nits", "RTX 4070 pilotes Studio", "64 Go de RAM", "Lecteur SD UHS-II"],
    images: [
      { id: 7652541, alt: "Nova Pro 16 sur un bureau gris avec fauteuil en cuir" },
      { id: 8092461, alt: "Nova Pro 16 ouvert sur une table en bois" },
      { id: 8092469, alt: "Nova Pro 16 sur un bureau blanc organisé" },
    ],
    reviews: [
      { author: "Julien R.", rating: 5, title: "Mon studio mobile", body: "Export 4K DaVinci deux fois plus rapide que mon ancienne tour. L'écran Mini-LED est le meilleur que j'ai eu sur un portable, calibration d'usine nickel.", verified: true, daysAgo: 9 },
      { author: "Sophie B.", rating: 5, title: "Architecte conquise", body: "Revit, Enscape et Twinmotion tournent sans accroc. Lourd, mais c'est le prix de la puissance. Le SAV UORAHAL a répondu en 10 minutes à ma question sur la RAM.", verified: true, daysAgo: 44 },
      { author: "Karim A.", rating: 4, title: "Puissant mais chargeur imposant", body: "Rien à redire sur les perfs. Le bloc d'alimentation de 280 W est un peu encombrant pour voyager.", daysAgo: 73 },
    ],
  },
  {
    slug: "vektor-vortex-15-rtx",
    name: "Vortex Gaming 15 RTX",
    brand: "Vektor",
    category: "ordinateurs-portables",
    shortDescription: "15,6\" QHD 240 Hz, RTX 4070, clavier RGB par touche.",
    description:
      "Le Vortex 15 est taillé pour la compétition : dalle QHD 240 Hz 3 ms, RTX 4070 à 140 W, processeur Ryzen 9 et clavier mécanique à profil bas rétroéclairé par touche. Le mode MUX dédié envoie directement le signal du GPU à l'écran pour un maximum d'images par seconde, et le double ventilateur à ailettes liquides reste discret même en pleine partie.",
    price: 1179000,
    compareAt: 1310000,
    stock: 11,
    featured: true,
    specs: [
      { label: "Processeur", value: "AMD Ryzen 9 8945HS (8 cœurs / 16 threads)" },
      { label: "Carte graphique", value: "NVIDIA GeForce RTX 4070 Laptop 8 Go (140 W)" },
      { label: "Mémoire", value: "32 Go DDR5 5600 MHz" },
      { label: "Stockage", value: "SSD NVMe 1 To PCIe 4.0" },
      { label: "Écran", value: "15,6\" IPS 2560 × 1440, 240 Hz, 3 ms, G-Sync" },
      { label: "Clavier", value: "Mécanique profil bas, RGB par touche" },
      { label: "Poids", value: "2,1 kg" },
      { label: "Garantie", value: "2 ans" },
    ],
    highlights: ["240 Hz QHD G-Sync", "RTX 4070 140 W", "Commutateur MUX", "Wi-Fi 6E + 2.5 GbE"],
    images: [
      { id: 19012045, alt: "Vortex Gaming 15 avec clavier RGB allumé" },
      { id: 30459254, alt: "Gros plan sur le clavier rétroéclairé du Vortex 15" },
      { id: 19012049, alt: "Vortex Gaming 15 en pleine partie" },
    ],
    reviews: [
      { author: "Hugo F.", rating: 5, title: "Un monstre", body: "Cyberpunk en ultra à 90 fps avec DLSS, l'écran 240 Hz est d'une fluidité folle. Le RGB est configurable finement.", verified: true, daysAgo: 6 },
      { author: "Léa P.", rating: 4, title: "Très bon rapport qualité/prix", body: "Performances au rendez-vous. L'autonomie hors jeu est correcte (5-6 h). Les ventilos s'entendent en mode Turbo, normal pour un gaming.", verified: true, daysAgo: 27 },
      { author: "Nicolas G.", rating: 5, title: "Acheté pour le travail et le jeu", body: "Compilation rapide, rendus Blender impeccables, et le soir Valorant à 240 fps. Le combo idéal.", daysAgo: 51 },
      { author: "Amina S.", rating: 4, title: "Cadeau réussi", body: "Offert à mon fils pour ses études en design. Il ne le quitte plus. Livraison express tenue.", verified: true, daysAgo: 88 },
    ],
  },
  {
    slug: "aurelion-essentiel-book-15",
    name: "Essentiel Book 15",
    brand: "Aurelion",
    category: "ordinateurs-portables",
    shortDescription: "15,6\" Full HD, Ryzen 5, 16 Go, 512 Go : l'essentiel bien fait.",
    description:
      "Pour les études, la bureautique et le quotidien de la famille, l'Essentiel Book 15 offre tout ce qu'il faut sans superflu : un écran mat antireflet, un clavier avec pavé numérique, 16 Go de mémoire, un SSD rapide de 512 Go et une autonomie de 11 heures. Son châssis en aluminium recyclé à 60 % est léger et robuste.",
    price: 359000,
    compareAt: 425000,
    stock: 32,
    specs: [
      { label: "Processeur", value: "AMD Ryzen 5 7530U (6 cœurs)" },
      { label: "Mémoire", value: "16 Go DDR4 3200 MHz" },
      { label: "Stockage", value: "SSD NVMe 512 Go" },
      { label: "Écran", value: "15,6\" IPS Full HD 1920 × 1080 mat" },
      { label: "Autonomie", value: "Jusqu'à 11 h" },
      { label: "Connectique", value: "USB-C, 2 × USB-A, HDMI, lecteur microSD" },
      { label: "Poids", value: "1,65 kg" },
      { label: "Garantie", value: "2 ans" },
    ],
    highlights: ["Écran mat antireflet", "Pavé numérique", "Webcam avec obturateur", "Aluminium recyclé"],
    images: [
      { id: 8532637, alt: "Essentiel Book 15 sur une table blanche en lumière naturelle" },
      { id: 8092459, alt: "Essentiel Book 15 devant un mur de briques" },
    ],
    reviews: [
      { author: "Marie-Claire V.", rating: 5, title: "Parfait pour la fac", body: "Léger, rapide au démarrage, et la batterie tient mes journées de cours. Le prix est imbattable pour 16 Go.", verified: true, daysAgo: 15 },
      { author: "Antoine T.", rating: 4, title: "Bon PC familial", body: "Idéal pour les devoirs et Netflix. L'écran n'est pas le plus lumineux mais le mat est appréciable près d'une fenêtre.", verified: true, daysAgo: 40 },
      { author: "Chloé N.", rating: 4, title: "Sérieux", body: "Rien d'extravagant mais tout fonctionne bien. Service client réactif pour une question de facture.", daysAgo: 97 },
    ],
  },

  // ─── PC & composants ────────────────────────────────────────────────────
  {
    slug: "aurelion-titan-workstation",
    name: "Titan Workstation Pro",
    brand: "Aurelion",
    category: "pc-et-composants",
    shortDescription: "Station de travail certifiée ISV : Ryzen 9, RTX 4080, 64 Go ECC.",
    description:
      "Assemblée dans notre atelier et validée par un test de stabilité de 24 heures, la Titan Workstation Pro s'adresse aux bureaux d'études, studios 3D et équipes data. Mémoire ECC, alimentation 80+ Platinum, refroidissement liquide 360 mm, et un boîtier insonorisé à façade en aluminium. Livrée avec Windows 11 Pro et un support prioritaire de 3 ans.",
    price: 1899000,
    stock: 5,
    featured: true,
    specs: [
      { label: "Processeur", value: "AMD Ryzen 9 7950X (16 cœurs / 32 threads)" },
      { label: "Carte graphique", value: "NVIDIA GeForce RTX 4080 Super 16 Go" },
      { label: "Mémoire", value: "64 Go DDR5 ECC 5200 MHz (extensible à 192 Go)" },
      { label: "Stockage", value: "SSD NVMe 2 To Gen4 + HDD 4 To" },
      { label: "Refroidissement", value: "AIO 360 mm, ventilateurs PWM silencieux" },
      { label: "Alimentation", value: "1000 W 80+ Platinum, modulaire" },
      { label: "Connectique", value: "2,5 GbE, Wi-Fi 6E, USB4, 8 × USB-A" },
      { label: "Garantie", value: "3 ans pièces et main-d'œuvre, intervention J+1" },
    ],
    highlights: ["Test de stabilité 24 h", "Mémoire ECC", "Boîtier insonorisé", "Support prioritaire 3 ans"],
    images: [
      { id: 7859348, alt: "Technicien installant le panneau vitré de la Titan Workstation" },
      { id: 7858767, alt: "Gros plan sur le refroidissement de la Titan Workstation" },
      { id: 424436, alt: "Intérieur de la Titan Workstation avec watercooling" },
    ],
    reviews: [
      { author: "Yanis K.", rating: 5, title: "Trois commandées pour notre bureau d'études", body: "Configurations identiques, câblage impeccable, silence impressionnant pour la puissance délivrée. L'équipe pro a géré la facturation et la livraison sur palette.", verified: true, daysAgo: 20 },
      { author: "Élodie R.", rating: 5, title: "Rendus 3D divisés par trois", body: "Passée d'un vieux Xeon à la Titan : rendu Blender 3 fois plus rapide. Les 24 h de burn-in rassurent.", verified: true, daysAgo: 63 },
    ],
  },
  {
    slug: "vektor-pulse-tower-rtx",
    name: "Pulse Gaming Tower RTX 4070 Ti",
    brand: "Vektor",
    category: "pc-et-composants",
    shortDescription: "Tour gaming Ryzen 7 7800X3D, RTX 4070 Ti Super, 32 Go DDR5.",
    description:
      "La Pulse combine le processeur gaming le plus efficace du moment, le Ryzen 7 7800X3D, et une RTX 4070 Ti Super pour jouer en 1440p ultra à plus de 144 fps. Boîtier en verre trempé à flux d'air optimisé, éclairage ARGB synchronisé, câblage soigné et BIOS pré-réglé par notre atelier. Prête à jouer dès le déballage.",
    price: 1575000,
    compareAt: 1705000,
    stock: 8,
    featured: true,
    isNew: true,
    specs: [
      { label: "Processeur", value: "AMD Ryzen 7 7800X3D (8 cœurs, 3D V-Cache)" },
      { label: "Carte graphique", value: "NVIDIA GeForce RTX 4070 Ti Super 16 Go" },
      { label: "Mémoire", value: "32 Go DDR5 6000 MHz CL30" },
      { label: "Stockage", value: "SSD NVMe 2 To PCIe 4.0" },
      { label: "Carte mère", value: "B650 Wi-Fi 6E, Bluetooth 5.3" },
      { label: "Refroidissement", value: "AIO 240 mm ARGB" },
      { label: "Alimentation", value: "850 W 80+ Gold" },
      { label: "Garantie", value: "3 ans" },
    ],
    highlights: ["Ryzen 7 7800X3D", "RTX 4070 Ti Super 16 Go", "BIOS optimisé en atelier", "ARGB synchronisé"],
    images: [
      { id: 33798627, alt: "Pulse Gaming Tower avec éclairage bleu" },
      { id: 15109454, alt: "Intérieur de la Pulse Gaming Tower éclairé en RGB" },
      { id: 34301929, alt: "Barrettes mémoire RGB de la Pulse Gaming Tower" },
    ],
    reviews: [
      { author: "Mathieu C.", rating: 5, title: "Montage d'orfèvre", body: "Câblage caché, pas une vis qui dépasse, et les températures sont excellentes. Je recommande les yeux fermés.", verified: true, daysAgo: 4 },
      { author: "Nadia B.", rating: 5, title: "Elle envoie du lourd", body: "1440p 165 Hz saturé sur tous mes jeux. Le silence en idle est surprenant.", verified: true, daysAgo: 35 },
      { author: "Pierre-Louis M.", rating: 4, title: "Superbe, livraison un peu longue", body: "PC excellent mais 6 jours d'attente car assemblage sur commande. Prévenu dès le départ, donc pas de surprise.", daysAgo: 70 },
    ],
  },
  {
    slug: "helix-rtx-4070-super",
    name: "Carte graphique Helix RTX 4070 Super 12 Go",
    brand: "Helix",
    category: "pc-et-composants",
    shortDescription: "Triple ventilateur, 12 Go GDDR6X, overclock d'usine.",
    description:
      "La Helix RTX 4070 Super offre le ray tracing et DLSS 3.5 avec un refroidissement triple ventilateur à roulements à double billes, une plaque arrière en métal et un mode semi-passif en dessous de 55 °C. Overclockée en usine à 2 580 MHz et garantie 4 ans.",
    price: 425000,
    stock: 19,
    specs: [
      { label: "GPU", value: "NVIDIA GeForce RTX 4070 Super, 7168 cœurs CUDA" },
      { label: "Mémoire", value: "12 Go GDDR6X 192 bits" },
      { label: "Fréquence boost", value: "2 580 MHz (OC d'usine)" },
      { label: "Sorties", value: "3 × DisplayPort 1.4a, 1 × HDMI 2.1" },
      { label: "Alimentation", value: "1 × 16 broches (adaptateur inclus), 650 W recommandés" },
      { label: "Dimensions", value: "308 × 120 × 50 mm (2,5 slots)" },
      { label: "Garantie", value: "4 ans" },
    ],
    highlights: ["DLSS 3.5 & ray tracing", "Mode semi-passif", "Backplate métal", "Garantie 4 ans"],
    images: [
      { id: 7859350, alt: "Carte graphique Helix RTX 4070 Super vue de face" },
      { id: 20391486, alt: "Carte graphique Helix posée sur un bureau" },
      { id: 34552811, alt: "Ventilateurs de la Helix RTX 4070 Super en fonctionnement" },
    ],
    reviews: [
      { author: "Sarah O.", rating: 5, title: "Upgrade parfait", body: "Remplace une 2070. Silence total en bureautique, et les jeux en 1440p sont transformés. Installation en 10 minutes.", verified: true, daysAgo: 18 },
      { author: "Bastien H.", rating: 4, title: "Très bien mais longue", body: "Vérifiez bien la longueur avant d'acheter : 308 mm, ça passe juste dans mon boîtier. Sinon, performances au top.", verified: true, daysAgo: 46 },
    ],
  },
  {
    slug: "flux-ddr5-32go-6000",
    name: "Kit mémoire Flux DDR5 32 Go 6000 MHz",
    brand: "Flux",
    category: "pc-et-composants",
    shortDescription: "2 × 16 Go CL30, profil EXPO & XMP, dissipateur aluminium.",
    description:
      "Le kit Flux DDR5-6000 CL30 est le point idéal pour les plateformes AMD AM5 et Intel : latence basse, profils EXPO et XMP 3.0 pour une activation en un clic et dissipateurs en aluminium à faible hauteur compatibles avec les gros ventirads.",
    price: 84500,
    compareAt: 97500,
    stock: 45,
    specs: [
      { label: "Capacité", value: "32 Go (2 × 16 Go)" },
      { label: "Fréquence", value: "6000 MT/s" },
      { label: "Latences", value: "CL30-38-38-96" },
      { label: "Tension", value: "1,35 V" },
      { label: "Profils", value: "AMD EXPO, Intel XMP 3.0" },
      { label: "Hauteur", value: "34 mm" },
      { label: "Garantie", value: "À vie" },
    ],
    highlights: ["CL30 basse latence", "EXPO & XMP 3.0", "Profil bas 34 mm", "Garantie à vie"],
    images: [
      { id: 31993524, alt: "Kit mémoire Flux DDR5 sur fond jaune" },
      { id: 33792054, alt: "Barrette Flux DDR5 installée sur une carte mère" },
      { id: 37113175, alt: "Barrettes de mémoire Flux et processeur" },
    ],
    reviews: [
      { author: "Romain P.", rating: 5, title: "EXPO activé, stable direct", body: "Aucun réglage manuel nécessaire sur ma B650. Memtest 8 h sans erreur.", verified: true, daysAgo: 22 },
      { author: "Fatou D.", rating: 5, title: "Rapport qualité/prix excellent", body: "Moins chère que la concurrence pour les mêmes timings. Expédition le jour même.", verified: true, daysAgo: 55 },
    ],
  },

  // ─── Écrans ─────────────────────────────────────────────────────────────
  {
    slug: "lumina-27-4k-ips",
    name: "Écran Lumina 27\" 4K IPS",
    brand: "Lumina",
    category: "ecrans",
    shortDescription: "4K UHD, 99 % sRGB, USB-C 90 W, pied ergonomique.",
    description:
      "Le Lumina 27 4K est l'écran de bureau idéal : dalle IPS 4K calibrée en usine (Delta E < 2), un port USB-C délivrant 90 W pour alimenter votre portable avec un seul câble, un hub USB intégré et un pied réglable en hauteur, inclinaison et pivot. Bords ultra-fins pour les configurations multi-écrans.",
    price: 295000,
    stock: 23,
    featured: true,
    specs: [
      { label: "Dalle", value: "27\" IPS 3840 × 2160, 60 Hz" },
      { label: "Couleurs", value: "99 % sRGB, 95 % DCI-P3, Delta E < 2" },
      { label: "Luminosité", value: "400 nits, HDR400" },
      { label: "Connectique", value: "USB-C 90 W, 2 × HDMI 2.0, DisplayPort 1.4, hub 3 × USB-A" },
      { label: "Ergonomie", value: "Hauteur 150 mm, pivot, inclinaison, rotation, VESA 100" },
      { label: "Garantie", value: "3 ans, zéro pixel mort" },
    ],
    highlights: ["Calibré en usine", "USB-C 90 W un seul câble", "Pied ergonomique complet", "Garantie zéro pixel mort"],
    images: [
      { id: 5366225, alt: "Écran Lumina 27 pouces sur un bureau minimaliste" },
      { id: 5618615, alt: "Configuration double écran Lumina" },
      { id: 115655, alt: "Écran Lumina sur un bureau clair avec lampe" },
    ],
    reviews: [
      { author: "Clara J.", rating: 5, title: "Netteté incroyable", body: "Le texte est d'une finesse parfaite pour coder toute la journée. Un seul câble USB-C vers mon portable, le rêve.", verified: true, daysAgo: 11 },
      { author: "Mehdi Z.", rating: 5, title: "Couleurs fidèles", body: "Je retouche des photos : la calibration d'usine est sérieuse, j'ai vérifié à la sonde. Très bon pied.", verified: true, daysAgo: 39 },
      { author: "Océane L.", rating: 4, title: "Très bien, haut-parleurs anecdotiques", body: "Image superbe. Les haut-parleurs intégrés dépannent sans plus, mais qui achète un écran pour ça ?", daysAgo: 82 },
    ],
  },
  {
    slug: "lumina-horizon-34-ultrawide",
    name: "Écran incurvé Horizon 34\" UltraWide",
    brand: "Lumina",
    category: "ecrans",
    shortDescription: "34\" UWQHD 144 Hz incurvé 1500R, USB-C, KVM intégré.",
    description:
      "Remplacez deux écrans par un seul : le Horizon 34 offre une surface 21:9 incurvée 1500R qui enveloppe votre champ de vision. 144 Hz et 1 ms pour le jeu, KVM intégré pour basculer entre deux ordinateurs avec un seul clavier et une seule souris, et mode Picture-by-Picture pour le multitâche.",
    price: 459000,
    compareAt: 525000,
    stock: 9,
    featured: true,
    isNew: true,
    specs: [
      { label: "Dalle", value: "34\" VA incurvée 1500R, 3440 × 1440" },
      { label: "Fréquence", value: "144 Hz, 1 ms MPRT, FreeSync Premium" },
      { label: "Couleurs", value: "95 % DCI-P3, HDR400" },
      { label: "Connectique", value: "USB-C 65 W, 2 × HDMI 2.0, DisplayPort 1.4, KVM" },
      { label: "Ergonomie", value: "Hauteur 120 mm, inclinaison, VESA 100" },
      { label: "Garantie", value: "3 ans" },
    ],
    highlights: ["21:9 incurvé 1500R", "144 Hz FreeSync Premium", "KVM intégré", "Picture-by-Picture"],
    images: [
      { id: 28955771, alt: "Écran Horizon 34 UltraWide sur un bureau soigné" },
      { id: 28955773, alt: "Horizon 34 utilisé pour le montage vidéo" },
      { id: 7031696, alt: "Horizon 34 UltraWide avec clavier compact" },
      { id: 19304048, alt: "Horizon 34 dans un bureau à domicile lumineux" },
    ],
    reviews: [
      { author: "Camille D.", rating: 5, title: "Adieu le double écran", body: "Deux fenêtres côte à côte sans bordure au milieu. Le KVM entre mon PC perso et mon portable pro est une tuerie.", verified: true, daysAgo: 8 },
      { author: "Hugo F.", rating: 5, title: "Immersif en jeu", body: "Les courses en 21:9 à 144 Hz, c'est une autre expérience. Aucun ghosting notable.", verified: true, daysAgo: 29 },
      { author: "Antoine T.", rating: 4, title: "Il faut de la place", body: "Magnifique, mais mesurez votre bureau : 81 cm de large. Le pied est stable.", daysAgo: 66 },
    ],
  },
  {
    slug: "vektor-strike-27-240hz",
    name: "Écran Gaming Strike 27\" 240 Hz",
    brand: "Vektor",
    category: "ecrans",
    shortDescription: "QHD Fast IPS 240 Hz, 0,5 ms, G-Sync Compatible.",
    description:
      "Le Strike 27 est pensé pour la compétition : dalle Fast IPS QHD à 240 Hz avec un temps de réponse de 0,5 ms, overdrive adaptatif, compatibilité G-Sync et FreeSync Premium Pro. Viseur dynamique, compteur de fps et profils par genre accessibles via le joystick arrière.",
    price: 249000,
    stock: 17,
    specs: [
      { label: "Dalle", value: "27\" Fast IPS 2560 × 1440" },
      { label: "Fréquence", value: "240 Hz, 0,5 ms GtG" },
      { label: "Synchronisation", value: "G-Sync Compatible, FreeSync Premium Pro" },
      { label: "Couleurs", value: "98 % DCI-P3, HDR400" },
      { label: "Connectique", value: "2 × HDMI 2.1, DisplayPort 1.4, hub USB" },
      { label: "Garantie", value: "3 ans" },
    ],
    highlights: ["240 Hz 0,5 ms", "Fast IPS QHD", "HDMI 2.1 consoles", "Pied réglable en hauteur"],
    images: [
      { id: 16416872, alt: "Écran Strike 27 240 Hz dans un setup sombre" },
      { id: 17112932, alt: "Setup gaming avec écrans Strike et clavier RGB" },
      { id: 16027815, alt: "Gros plan sur la dalle de l'écran Strike" },
    ],
    reviews: [
      { author: "Nicolas G.", rating: 5, title: "Réactivité de folie", body: "Passé de 144 à 240 Hz : la différence est nette sur les FPS. Aucun pixel mort.", verified: true, daysAgo: 14 },
      { author: "Léa P.", rating: 4, title: "Très bon écran e-sport", body: "Image rapide et propre. Le menu OSD pourrait être plus intuitif.", verified: true, daysAgo: 49 },
    ],
  },

  // ─── Périphériques ──────────────────────────────────────────────────────
  {
    slug: "keystone-75-mecanique",
    name: "Clavier mécanique Keystone 75 %",
    brand: "Keystone",
    category: "peripheriques",
    shortDescription: "Switchs linéaires pré-lubrifiés, montage joint, sans fil tri-mode.",
    description:
      "Le Keystone 75 % est un clavier mécanique premium en aluminium CNC avec montage sur joint pour une frappe souple et un son profond. Switchs linéaires pré-lubrifiés remplaçables à chaud, keycaps PBT double-shot, molette multimédia et connexion tri-mode (2,4 GHz, Bluetooth 5.1, USB-C). Disponible en français AZERTY.",
    price: 97500,
    stock: 38,
    featured: true,
    specs: [
      { label: "Format", value: "75 % (82 touches), AZERTY" },
      { label: "Switchs", value: "Linéaires 45 g, pré-lubrifiés, hot-swap" },
      { label: "Keycaps", value: "PBT double-shot, profil Cherry" },
      { label: "Connexion", value: "2,4 GHz, Bluetooth 5.1 (3 appareils), USB-C" },
      { label: "Autonomie", value: "Jusqu'à 180 h (RGB éteint)" },
      { label: "Châssis", value: "Aluminium CNC, montage sur joint" },
      { label: "Poids", value: "980 g" },
    ],
    highlights: ["Aluminium CNC", "Switchs hot-swap", "Tri-mode sans fil", "AZERTY français"],
    images: [
      { id: 35471658, alt: "Clavier mécanique Keystone 75 % sur un bureau" },
      { id: 32755757, alt: "Détail des keycaps du Keystone 75 %" },
      { id: 32755745, alt: "Keystone 75 % avec souris blanche" },
    ],
    reviews: [
      { author: "Julien R.", rating: 5, title: "Le son, la sensation… parfait", body: "Frappe feutrée, aucune résonance. Je l'utilise 8 h par jour et mes poignets me remercient.", verified: true, daysAgo: 10 },
      { author: "Inès M.", rating: 5, title: "Enfin un vrai AZERTY premium", body: "Difficile de trouver des claviers custom en AZERTY, celui-ci est irréprochable.", verified: true, daysAgo: 33 },
      { author: "Yanis K.", rating: 4, title: "Lourd, dans le bon sens", body: "Il ne bouge pas d'un millimètre. Le logiciel de configuration pourrait être plus complet.", daysAgo: 61 },
      { author: "Sophie B.", rating: 5, title: "Une belle pièce", body: "Aussi beau qu'agréable. La molette est un petit plus génial.", verified: true, daysAgo: 95 },
    ],
  },
  {
    slug: "keystone-glide-pro-souris",
    name: "Souris sans fil Glide Pro",
    brand: "Keystone",
    category: "peripheriques",
    shortDescription: "Ergonomique, capteur 8 000 DPI, molette MagSpeed, multi-appareils.",
    description:
      "Conçue pour les longues journées, la Glide Pro épouse la main avec une inclinaison de 20°, une molette électromagnétique silencieuse ultra-rapide et 7 boutons programmables. Elle se connecte à trois appareils et passe de l'un à l'autre d'un simple geste. 70 jours d'autonomie et recharge USB-C.",
    price: 58500,
    compareAt: 71500,
    stock: 54,
    featured: true,
    specs: [
      { label: "Capteur", value: "Optique 8 000 DPI, fonctionne sur verre" },
      { label: "Boutons", value: "7 programmables, molette latérale" },
      { label: "Connexion", value: "Bluetooth, récepteur USB-C 2,4 GHz, 3 appareils" },
      { label: "Autonomie", value: "70 jours, recharge USB-C" },
      { label: "Poids", value: "141 g" },
      { label: "Compatibilité", value: "Windows, macOS, Linux, iPadOS" },
    ],
    highlights: ["Molette MagSpeed silencieuse", "Flux entre 3 appareils", "Fonctionne sur verre", "Clics silencieux"],
    images: [
      { id: 13870518, alt: "Souris Glide Pro sur fond sombre" },
      { id: 13870517, alt: "Détail de la forme ergonomique de la Glide Pro" },
      { id: 9161032, alt: "Souris Glide Pro en version claire" },
    ],
    reviews: [
      { author: "Thomas L.", rating: 5, title: "Confort absolu", body: "Finies les douleurs au poignet. La molette libre pour défiler des tableurs géants est magique.", verified: true, daysAgo: 7 },
      { author: "Amina S.", rating: 5, title: "Passe du Mac au PC instantanément", body: "Un bouton et je bascule d'appareil. Clics vraiment silencieux, appréciés en open space.", verified: true, daysAgo: 41 },
      { author: "Bastien H.", rating: 4, title: "Grande main recommandée", body: "Très bonne souris, mais plutôt pour des mains moyennes à grandes.", daysAgo: 78 },
    ],
  },
  {
    slug: "resonance-anc-casque",
    name: "Casque sans fil Resonance ANC",
    brand: "Resonance",
    category: "peripheriques",
    shortDescription: "Réduction de bruit adaptative, 40 h d'autonomie, multipoint.",
    description:
      "Le Resonance ANC isole du bruit de l'open space comme de la cabine d'avion grâce à huit microphones et un traitement adaptatif. Transducteurs 40 mm accordés par des ingénieurs du son, codec LDAC, connexion multipoint pour visioconférences et musique sans jamais réappairer, et 40 heures d'autonomie.",
    price: 163000,
    compareAt: 196000,
    stock: 26,
    featured: true,
    specs: [
      { label: "Réduction de bruit", value: "Hybride adaptative, 8 microphones" },
      { label: "Transducteurs", value: "40 mm, 4 Hz – 40 kHz" },
      { label: "Codecs", value: "LDAC, AAC, SBC — Bluetooth 5.3 multipoint" },
      { label: "Autonomie", value: "40 h ANC activé, 3 min de charge = 3 h" },
      { label: "Microphone", value: "Beamforming, réduction du bruit de fond en appel" },
      { label: "Poids", value: "250 g" },
    ],
    highlights: ["ANC adaptative", "40 h d'autonomie", "Multipoint", "Mode transparence"],
    images: [
      { id: 815494, alt: "Casque Resonance ANC sur un bureau blanc" },
      { id: 18254091, alt: "Casque Resonance ANC sur une surface métallique" },
      { id: 35560619, alt: "Casque Resonance ANC vu de profil" },
    ],
    reviews: [
      { author: "Élodie R.", rating: 5, title: "Mon bureau est devenu silencieux", body: "L'ANC est bluffante, et en visio mes collègues disent que ma voix est très claire. Confortable sur une journée entière.", verified: true, daysAgo: 5 },
      { author: "Karim A.", rating: 4, title: "Très bon son, étui un peu gros", body: "Basses précises, aigus doux. L'étui rigide protège bien mais prend de la place.", verified: true, daysAgo: 36 },
      { author: "Clara J.", rating: 5, title: "Multipoint parfait", body: "Téléphone + PC connectés en permanence sans aucune coupure. C'est exactement ce que je cherchais.", daysAgo: 69 },
    ],
  },
  {
    slug: "clarity-webcam-4k",
    name: "Webcam Clarity 4K",
    brand: "Clarity",
    category: "peripheriques",
    shortDescription: "Capteur 4K HDR, cadrage automatique IA, obturateur de confidentialité.",
    description:
      "Soyez net en visio : la Clarity 4K combine un capteur Sony 4K HDR, un objectif en verre à mise au point automatique et un cadrage intelligent qui vous suit. Deux micros à réduction de bruit, obturateur physique, fixation moniteur et pas de vis trépied.",
    price: 84500,
    stock: 41,
    specs: [
      { label: "Capteur", value: "Sony 4K HDR, 8,3 MP" },
      { label: "Résolutions", value: "4K 30 fps, 1080p 60 fps" },
      { label: "Objectif", value: "Verre, champ 90°, autofocus" },
      { label: "Audio", value: "2 micros omnidirectionnels à réduction de bruit" },
      { label: "Connexion", value: "USB-C (câble 1,5 m)" },
      { label: "Compatibilité", value: "Teams, Zoom, Meet, OBS — Windows et macOS" },
    ],
    highlights: ["4K HDR", "Cadrage automatique", "Obturateur physique", "Plug & play"],
    images: [
      { id: 7172701, alt: "Webcam Clarity 4K fixée sur un ordinateur portable" },
      { id: 7172687, alt: "Webcam Clarity 4K sur un bureau de télétravail" },
    ],
    reviews: [
      { author: "Marie-Claire V.", rating: 5, title: "Image pro en visio", body: "Différence flagrante avec la webcam intégrée de mon portable. Le cadrage auto est discret et efficace.", verified: true, daysAgo: 16 },
      { author: "Romain P.", rating: 4, title: "Très bonne, logiciel optionnel", body: "Fonctionne sans rien installer. Le logiciel permet d'ajuster l'exposition si besoin.", verified: true, daysAgo: 52 },
    ],
  },
  {
    slug: "keystone-nuit-retroeclaire",
    name: "Clavier rétroéclairé Nuit",
    brand: "Keystone",
    category: "peripheriques",
    shortDescription: "Clavier fin à membrane, rétroéclairage bleu, repose-poignets.",
    description:
      "Le Nuit est un clavier filaire silencieux à frappe courte, idéal pour la bureautique en soirée : rétroéclairage bleu réglable, touches multimédias dédiées, repose-poignets intégré et résistance aux éclaboussures.",
    price: 25500,
    stock: 72,
    specs: [
      { label: "Format", value: "Complet avec pavé numérique, AZERTY" },
      { label: "Technologie", value: "Membrane à frappe courte, silencieuse" },
      { label: "Rétroéclairage", value: "Bleu, 3 niveaux" },
      { label: "Connexion", value: "USB-A filaire, câble 1,8 m" },
      { label: "Extras", value: "Repose-poignets, touches multimédias, anti-éclaboussures" },
    ],
    highlights: ["Rétroéclairé", "Silencieux", "Repose-poignets", "Prix doux"],
    images: [
      { id: 6053283, alt: "Clavier Nuit avec rétroéclairage bleu" },
      { id: 5380584, alt: "Mains sur le clavier Nuit dans la pénombre" },
      { id: 19708913, alt: "Détail du rétroéclairage du clavier Nuit" },
    ],
    reviews: [
      { author: "Pierre-Louis M.", rating: 4, title: "Fait le job", body: "Bon clavier pour le prix, le rétroéclairage est pratique le soir.", verified: true, daysAgo: 25 },
      { author: "Océane L.", rating: 5, title: "Acheté pour mes parents", body: "Touches bien lisibles, silencieux, simple. Ils sont ravis.", verified: true, daysAgo: 84 },
    ],
  },

  // ─── Stockage & réseau ──────────────────────────────────────────────────
  {
    slug: "velocity-nvme-2to-gen4",
    name: "SSD NVMe Velocity 2 To Gen4",
    brand: "Velocity",
    category: "stockage-et-reseau",
    shortDescription: "7 400 Mo/s en lecture, DRAM, dissipateur graphène, 5 ans.",
    description:
      "Le Velocity Gen4 atteint 7 400 Mo/s en lecture et 6 800 Mo/s en écriture grâce à un contrôleur 8 canaux avec cache DRAM. Endurance de 1 200 TBW, dissipateur en graphène compatible PS5 et portables, garantie 5 ans.",
    price: 117500,
    compareAt: 137000,
    stock: 60,
    featured: true,
    specs: [
      { label: "Capacité", value: "2 To" },
      { label: "Interface", value: "PCIe 4.0 ×4, NVMe 2.0, M.2 2280" },
      { label: "Lecture / écriture", value: "7 400 / 6 800 Mo/s" },
      { label: "Endurance", value: "1 200 TBW" },
      { label: "Cache", value: "DRAM 2 Go" },
      { label: "Garantie", value: "5 ans" },
    ],
    highlights: ["7 400 Mo/s", "Cache DRAM", "Compatible PS5", "Garantie 5 ans"],
    images: [
      { id: 28666524, alt: "SSD NVMe Velocity 2 To sur fond gris" },
      { id: 11216304, alt: "SSD Velocity en gros plan" },
      { id: 35147150, alt: "SSD Velocity à côté d'anciens supports de stockage" },
    ],
    reviews: [
      { author: "Mehdi Z.", rating: 5, title: "Vitesse annoncée atteinte", body: "7 350 Mo/s mesurés sous CrystalDiskMark. Installé dans ma PS5 en 5 minutes.", verified: true, daysAgo: 13 },
      { author: "Chloé N.", rating: 5, title: "Mon portable a retrouvé une jeunesse", body: "Clonage facile avec l'outil fourni. Démarrage en 8 secondes.", verified: true, daysAgo: 47 },
      { author: "Nadia B.", rating: 4, title: "Chauffe un peu sans flux d'air", body: "Excellent SSD. Dans un boîtier mal ventilé il monte à 65 °C en charge longue, rien d'alarmant.", daysAgo: 90 },
    ],
  },
  {
    slug: "velocity-vault-portable-4to",
    name: "SSD portable Vault 4 To",
    brand: "Velocity",
    category: "stockage-et-reseau",
    shortDescription: "USB-C 20 Gb/s, chiffrement matériel AES-256, IP65.",
    description:
      "Le Vault protège vos données partout : chiffrement matériel AES-256 avec déverrouillage par empreinte, coque en aluminium résistante aux chutes de 3 m, indice IP65 et débits de 2 000 Mo/s via USB 3.2 Gen 2×2. Câbles USB-C et USB-A inclus.",
    price: 143500,
    stock: 28,
    isNew: true,
    specs: [
      { label: "Capacité", value: "4 To" },
      { label: "Interface", value: "USB-C 3.2 Gen 2×2 (20 Gb/s)" },
      { label: "Débit", value: "Jusqu'à 2 000 Mo/s" },
      { label: "Sécurité", value: "AES-256 matériel, lecteur d'empreinte" },
      { label: "Résistance", value: "IP65, chutes de 3 m" },
      { label: "Dimensions", value: "95 × 55 × 10 mm, 58 g" },
    ],
    highlights: ["Empreinte digitale", "2 000 Mo/s", "IP65 anti-chocs", "4 To dans la poche"],
    images: [
      { id: 30758128, alt: "SSD portable Vault sur fond orange" },
      { id: 13595075, alt: "SSD Vault connecté sur un bureau en bois" },
      { id: 13595070, alt: "SSD Vault avec accessoires de bureau" },
      { id: 2148221, alt: "SSD Vault à côté d'un ordinateur portable" },
    ],
    reviews: [
      { author: "Sarah O.", rating: 5, title: "Indispensable pour mes tournages", body: "Je décharge mes cartes directement dessus, le débit est constant. L'empreinte rassure quand on voyage.", verified: true, daysAgo: 19 },
      { author: "Antoine T.", rating: 4, title: "Solide", body: "Tombé de mon bureau deux fois, aucune trace. Un peu cher mais justifié.", verified: true, daysAgo: 57 },
    ],
  },
  {
    slug: "signal-mesh-wifi7-pack2",
    name: "Routeur Mesh Wi-Fi 7 Signal (pack de 2)",
    brand: "Signal",
    category: "stockage-et-reseau",
    shortDescription: "Tri-bande BE11000, couverture 400 m², ports 2,5 GbE.",
    description:
      "Le système maillé Signal couvre une maison de 400 m² en Wi-Fi 7 tri-bande avec agrégation de liens pour des débits jusqu'à 11 Gb/s. Chaque satellite dispose de deux ports 2,5 GbE, et l'application permet de créer un réseau invité, de prioriser la visio et de filtrer les contenus pour les enfants.",
    price: 262000,
    compareAt: 295000,
    stock: 15,
    isNew: true,
    specs: [
      { label: "Norme", value: "Wi-Fi 7 (802.11be) tri-bande BE11000" },
      { label: "Couverture", value: "Jusqu'à 400 m² (2 satellites)" },
      { label: "Ports", value: "2 × 2,5 GbE par satellite" },
      { label: "Appareils", value: "Jusqu'à 200 simultanés" },
      { label: "Sécurité", value: "WPA3, réseau invité, contrôle parental" },
      { label: "Garantie", value: "2 ans" },
    ],
    highlights: ["Wi-Fi 7 tri-bande", "400 m² couverts", "Ports 2,5 GbE", "Contrôle parental"],
    images: [
      { id: 4218546, alt: "Routeur Signal Wi-Fi 7 sur fond jaune" },
      { id: 18071864, alt: "Satellite Signal installé dans un salon" },
      { id: 2881224, alt: "Câbles réseau branchés sur un commutateur" },
    ],
    reviews: [
      { author: "Fatou D.", rating: 5, title: "Plus aucune zone blanche", body: "Maison sur 3 niveaux, murs épais : Wi-Fi plein partout, même au fond du jardin. Installation en 10 minutes via l'app.", verified: true, daysAgo: 21 },
      { author: "Mathieu C.", rating: 4, title: "Rapide et stable", body: "1,4 Gb/s en Wi-Fi 7 sur mon portable compatible. Le prix reste élevé mais c'est de l'investissement.", verified: true, daysAgo: 64 },
    ],
  },
  {
    slug: "nexus-dock-thunderbolt-4",
    name: "Station d'accueil Nexus Thunderbolt 4",
    brand: "Nexus",
    category: "stockage-et-reseau",
    shortDescription: "12 ports, double 4K 60 Hz, charge 96 W, un seul câble.",
    description:
      "Un seul câble pour tout brancher : la Nexus TB4 alimente votre portable à 96 W et offre 12 ports dont deux sorties 4K 60 Hz, 2,5 GbE, lecteur SD UHS-II et audio. Compatible Thunderbolt 4/3 et USB4 sur Windows et macOS. Châssis en aluminium, câble Thunderbolt 0,8 m inclus.",
    price: 150000,
    stock: 22,
    featured: true,
    specs: [
      { label: "Hôte", value: "Thunderbolt 4 / USB4, 96 W Power Delivery" },
      { label: "Vidéo", value: "2 × écrans 4K 60 Hz (HDMI 2.1, DisplayPort 1.4) ou 1 × 8K" },
      { label: "USB", value: "3 × USB-A 10 Gb/s, 2 × USB-C 10 Gb/s, 1 × Thunderbolt 4 aval" },
      { label: "Réseau", value: "Ethernet 2,5 GbE" },
      { label: "Autres", value: "Lecteur SD UHS-II, jack 3,5 mm, verrou Kensington" },
      { label: "Garantie", value: "3 ans" },
    ],
    highlights: ["12 ports", "Charge 96 W", "Double 4K 60 Hz", "Aluminium"],
    images: [
      { id: 4195404, alt: "Station d'accueil Nexus connectée à un portable" },
      { id: 4195408, alt: "Nexus Thunderbolt 4 vue de dessus" },
      { id: 30708285, alt: "Ports de la station Nexus sur une surface sombre" },
      { id: 4195398, alt: "Nexus avec câble connecté sur table en bois" },
    ],
    reviews: [
      { author: "Camille D.", rating: 5, title: "Le bureau en un câble", body: "Deux écrans, clavier, souris, réseau et charge : je pose le portable, je branche un câble, c'est parti.", verified: true, daysAgo: 3 },
      { author: "Yanis K.", rating: 5, title: "Déployée sur 15 postes", body: "Nous équipons nos salariés en flex office : aucun souci de compatibilité Mac/PC.", verified: true, daysAgo: 42 },
      { author: "Léa P.", rating: 4, title: "Chauffe légèrement", body: "Fonctionne parfaitement, tiède au toucher en charge. Le câble fourni est court.", daysAgo: 76 },
    ],
  },

  // ─── Accessoires ────────────────────────────────────────────────────────
  {
    slug: "urbain-sac-a-dos-16",
    name: "Sac à dos Urbain 16\"",
    brand: "Urbain",
    category: "accessoires",
    shortDescription: "Toile recyclée déperlante, compartiment molletonné 16\", 22 L.",
    description:
      "L'Urbain 16 accompagne vos trajets quotidiens : compartiment matelassé pour un portable jusqu'à 16\", poche tablette, organisation des câbles, passant pour valise et dos respirant. Toile en polyester recyclé déperlant et fermetures YKK.",
    price: 52000,
    stock: 48,
    specs: [
      { label: "Capacité", value: "22 L" },
      { label: "Compartiment", value: "Portable 16\" + tablette 11\"" },
      { label: "Matière", value: "Polyester recyclé 900D déperlant, zips YKK" },
      { label: "Confort", value: "Dos respirant, bretelles ergonomiques, passant valise" },
      { label: "Poids", value: "890 g" },
    ],
    highlights: ["Jusqu'à 16\"", "Toile recyclée", "Passant valise", "Zips YKK"],
    images: [
      { id: 12743405, alt: "Sac à dos Urbain avec portable, smartphone et écouteurs" },
      { id: 14976127, alt: "Sac à dos Urbain posé sur une chaise de café" },
      { id: 26649012, alt: "Sac à dos Urbain porté en ville" },
    ],
    reviews: [
      { author: "Hugo F.", rating: 5, title: "Bien pensé", body: "Chaque chose à sa place, et il reste fin même rempli. Le passant pour valise est pratique en déplacement.", verified: true, daysAgo: 24 },
      { author: "Inès M.", rating: 4, title: "Joli et pratique", body: "Finitions soignées. Un peu juste pour une journée de sport en plus de l'ordi.", verified: true, daysAgo: 71 },
    ],
  },
  {
    slug: "imprimo-multifonction-wifi",
    name: "Imprimante multifonction Imprimo Wi-Fi",
    brand: "Imprimo",
    category: "accessoires",
    shortDescription: "Jet d'encre à réservoirs, recto-verso auto, scanner, 3 ans d'encre.",
    description:
      "Fini les cartouches : l'Imprimo utilise des réservoirs rechargeables qui impriment jusqu'à 7 500 pages noir et blanc avec les flacons fournis. Recto-verso automatique, chargeur de documents 35 feuilles, Wi-Fi et impression depuis smartphone.",
    price: 130500,
    compareAt: 150000,
    stock: 13,
    specs: [
      { label: "Technologie", value: "Jet d'encre à réservoirs (EcoTank)" },
      { label: "Fonctions", value: "Impression, copie, scan, chargeur 35 feuilles" },
      { label: "Vitesse", value: "15 ppm noir, 8 ppm couleur, recto-verso auto" },
      { label: "Rendement", value: "7 500 pages noir / 6 000 couleur avec les flacons inclus" },
      { label: "Connexion", value: "Wi-Fi, Wi-Fi Direct, USB, AirPrint, Mopria" },
      { label: "Garantie", value: "3 ans" },
    ],
    highlights: ["3 ans d'encre inclus", "Recto-verso auto", "Impression mobile", "Chargeur automatique"],
    images: [
      { id: 4792283, alt: "Imprimante Imprimo dans un bureau épuré" },
      { id: 11833899, alt: "Imprimante Imprimo sur un bureau minimaliste" },
      { id: 8297818, alt: "Impression d'un document avec l'Imprimo" },
    ],
    reviews: [
      { author: "Marie-Claire V.", rating: 5, title: "Coût par page dérisoire", body: "Deux ans d'impressions scolaires et je n'ai toujours pas racheté d'encre. Installation Wi-Fi simple.", verified: true, daysAgo: 30 },
      { author: "Bastien H.", rating: 4, title: "Bonne imprimante familiale", body: "Un peu lente en couleur, mais la qualité est là et le silence appréciable.", verified: true, daysAgo: 85 },
    ],
  },
  {
    slug: "slate-tablette-11-stylet",
    name: "Tablette Slate 11\" + stylet",
    brand: "Slate",
    category: "accessoires",
    shortDescription: "Écran 120 Hz 2.5K, 8 Go / 256 Go, stylet à 4 096 niveaux inclus.",
    description:
      "La Slate 11 est faite pour prendre des notes, dessiner et lire : écran 2.5K 120 Hz laminé avec traitement antireflet, stylet à faible latence inclus, quatre haut-parleurs et 12 heures d'autonomie. Compatible avec le clavier-étui Slate (vendu séparément).",
    price: 327500,
    stock: 20,
    isNew: true,
    specs: [
      { label: "Écran", value: "11\" LCD 2560 × 1600, 120 Hz, antireflet" },
      { label: "Processeur", value: "Octa-core 3,2 GHz" },
      { label: "Mémoire / stockage", value: "8 Go / 256 Go, extensible microSD" },
      { label: "Stylet", value: "4 096 niveaux de pression, recharge magnétique (inclus)" },
      { label: "Autonomie", value: "Jusqu'à 12 h, charge 45 W" },
      { label: "Audio", value: "4 haut-parleurs Dolby Atmos" },
    ],
    highlights: ["Stylet inclus", "120 Hz antireflet", "12 h d'autonomie", "4 haut-parleurs"],
    images: [
      { id: 17890502, alt: "Tablette Slate 11 avec stylet sur une surface blanche" },
      { id: 3944397, alt: "Tablette Slate 11 dans un bureau à domicile" },
      { id: 37401978, alt: "Dessin sur la tablette Slate 11 avec le stylet" },
      { id: 28461044, alt: "Tablette Slate 11 entourée de plantes" },
    ],
    reviews: [
      { author: "Clara J.", rating: 5, title: "Carnet de notes ultime", body: "Le stylet est précis et sans latence perceptible, l'écran mat donne une sensation papier. Autonomie conforme.", verified: true, daysAgo: 17 },
      { author: "Romain P.", rating: 4, title: "Très bonne tablette", body: "Excellent écran et son surprenant. Le clavier-étui aurait pu être inclus à ce prix.", verified: true, daysAgo: 53 },
    ],
  },
  {
    slug: "nexus-chargeur-gan-100w",
    name: "Chargeur GaN 100 W Nexus",
    brand: "Nexus",
    category: "accessoires",
    shortDescription: "3 × USB-C + 1 × USB-A, charge portable + téléphone + écouteurs.",
    description:
      "Un seul chargeur pour tout : le Nexus GaN 100 W alimente un portable à pleine puissance sur un port, ou répartit intelligemment entre quatre appareils. Technologie GaN pour un format 40 % plus compact, prise repliable et câble USB-C 100 W de 2 m inclus.",
    price: 38500,
    stock: 85,
    specs: [
      { label: "Puissance", value: "100 W total (USB-C1 100 W seul)" },
      { label: "Ports", value: "3 × USB-C PD 3.0 / PPS, 1 × USB-A 22,5 W" },
      { label: "Technologie", value: "GaN III, protection surchauffe et surtension" },
      { label: "Dimensions", value: "66 × 66 × 32 mm, 205 g" },
      { label: "Inclus", value: "Câble USB-C vers USB-C 100 W, 2 m" },
    ],
    highlights: ["100 W GaN", "4 ports", "Prise repliable", "Câble 2 m inclus"],
    images: [
      { id: 5208826, alt: "Chargeur Nexus GaN avec câbles et appareils" },
      { id: 4219863, alt: "Connecteur USB-C du câble Nexus" },
      { id: 1202575, alt: "Smartphone en charge sur une table en bois" },
    ],
    reviews: [
      { author: "Nicolas G.", rating: 5, title: "Remplace trois chargeurs", body: "Portable, téléphone et casque chargent ensemble. Compact dans le sac, parfait en voyage.", verified: true, daysAgo: 28 },
      { author: "Sophie B.", rating: 5, title: "Tout simplement pratique", body: "Chauffe peu, câble de 2 m bienvenu. Rien à redire.", verified: true, daysAgo: 62 },
      { author: "Amina S.", rating: 4, title: "Bon produit", body: "Le port USB-A est limité à 22 W, prévoyez l'USB-C pour les appareils gourmands.", daysAgo: 99 },
    ],
  },
  {
    slug: "terrain-tapis-bureau-xl",
    name: "Tapis de bureau Terrain XL",
    brand: "Terrain",
    category: "accessoires",
    shortDescription: "90 × 40 cm, feutre de laine et liège, antidérapant.",
    description:
      "Le Terrain XL habille votre bureau et adoucit la frappe : surface en feutre de laine mérinos sur base en liège antidérapant, bords cousus et dimensions généreuses pour clavier et souris. Compatible avec tous les capteurs optiques.",
    price: 22500,
    stock: 110,
    specs: [
      { label: "Dimensions", value: "900 × 400 × 4 mm" },
      { label: "Surface", value: "Feutre de laine mérinos" },
      { label: "Base", value: "Liège naturel antidérapant" },
      { label: "Entretien", value: "Brosse douce, nettoyage à sec" },
      { label: "Coloris", value: "Anthracite, Sable, Olive" },
    ],
    highlights: ["Feutre de laine", "Base en liège", "90 × 40 cm", "Bords cousus"],
    images: [
      { id: 18155963, alt: "Tapis de bureau Terrain XL avec clavier mécanique" },
      { id: 36363140, alt: "Souris posée sur le tapis Terrain en feutre" },
      { id: 27559521, alt: "Tapis Terrain sur un bureau moderne" },
    ],
    reviews: [
      { author: "Océane L.", rating: 5, title: "Chic et confortable", body: "Mon bureau a changé d'allure. La souris glisse bien et le clavier ne résonne plus.", verified: true, daysAgo: 23 },
      { author: "Mehdi Z.", rating: 4, title: "Belle matière", body: "Le feutre attire un peu les poussières, un coup de brosse et c'est réglé.", verified: true, daysAgo: 67 },
    ],
  },
  {
    slug: "vektor-featherlight-souris-gaming",
    name: "Souris gaming Featherlight sans fil",
    brand: "Vektor",
    category: "peripheriques",
    shortDescription: "49 g, capteur 30K, 2,4 GHz 4 000 Hz, switchs optiques.",
    description:
      "À seulement 49 grammes sans trou dans la coque, la Featherlight est faite pour la précision : capteur optique 30 000 DPI, polling 4 000 Hz avec le récepteur inclus, switchs optiques sans double clic et patins en PTFE pur. 90 heures d'autonomie.",
    price: 78000,
    stock: 34,
    isNew: true,
    specs: [
      { label: "Poids", value: "49 g" },
      { label: "Capteur", value: "Optique 30 000 DPI, 750 IPS, 50 G" },
      { label: "Polling", value: "4 000 Hz sans fil (récepteur inclus)" },
      { label: "Switchs", value: "Optiques, 100 M de clics" },
      { label: "Autonomie", value: "90 h à 1 000 Hz" },
      { label: "Patins", value: "PTFE pur, jeu de rechange inclus" },
    ],
    highlights: ["49 g", "4 000 Hz", "Switchs optiques", "90 h d'autonomie"],
    images: [
      { id: 33303045, alt: "Souris gaming Featherlight avec son emballage" },
      { id: 7240349, alt: "Souris Featherlight dans sa boîte" },
    ],
    reviews: [
      { author: "Hugo F.", rating: 5, title: "Précision chirurgicale", body: "Le poids plume change tout sur les flicks. Aucune latence perçue en 4 000 Hz.", verified: true, daysAgo: 2 },
      { author: "Thomas L.", rating: 4, title: "Excellente, forme à essayer", body: "Capteur parfait. La forme symétrique conviendra surtout aux prises claw et fingertip.", daysAgo: 38 },
    ],
  },
];
