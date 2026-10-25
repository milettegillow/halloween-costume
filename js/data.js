/* Halloween costume - options, presets, method steps and products.
   Steps are either a string (uses the item's applyOrder) or [order, string].
   Order: 10 prep and safety, 20 base, 30 contour, 40 under-eyes, 50 face paint,
   60 effects, 70 eye makeup, 80 lips, 86-88 setting and blood, 90 lenses,
   95 fangs, 98 mask, 100 wig, 110 costume, 115 headwear, 120 props, 130 removal.
   Products are kit keys (see kit below) or { name, q } for a search or { name, asin } for one product. */

const AMAZON_TAG = 'milettegillow-21';

const DATA = {
  faceShapes: [
    { id: 'pointed', label: 'Pointed' },
    { id: 'oval', label: 'Oval' },
    { id: 'square', label: 'Square' }
  ],

  features: [
    { id: 'feminine', label: 'Feminine', noun: 'damsel' },
    { id: 'androgynous', label: 'Androgynous', noun: 'stranger' },
    { id: 'masculine', label: 'Masculine', noun: 'gentleman' }
  ],

  skinTones: [
    { id: 'fair', label: 'Fair', hex: '#f6d9c6' },
    { id: 'peach', label: 'Warm peach', hex: '#eebc9c' },
    { id: 'tan', label: 'Light tan', hex: '#d9a27c' },
    { id: 'golden', label: 'Golden', hex: '#c08259' },
    { id: 'brown', label: 'Brown', hex: '#8d5a3b' },
    { id: 'deep', label: 'Deep brown', hex: '#5e3a26' }
  ],

  hairStyles: [
    { id: 'bob', label: 'Wavy bob', namePart: 'marcelled', wig: 'wavy bob wig' },
    { id: 'long', label: 'Long with fringe', namePart: 'sleek', wig: 'long straight wig with fringe' },
    { id: 'longWavy', label: 'Long and wavy', namePart: 'flowing', wig: 'long wavy wig' },
    { id: 'crop', label: 'Tousled crop', namePart: 'tousled', wig: 'short messy wig' },
    { id: 'slick', label: 'Slicked-back wave', namePart: 'slick', wig: 'slicked back short wig' },
    { id: 'bun', label: 'High bun', namePart: 'prim', wig: 'high bun wig' },
    { id: 'ponytail', label: 'Ponytail', namePart: 'swinging', wig: 'high ponytail wig' },
    { id: 'witch', label: 'Wild witch hair', namePart: 'tangled', wig: 'long messy witch wig' },
    { id: 'bunches', label: 'Bunches', namePart: 'pigtailed', wig: 'pigtail wig with fringe' },
    { id: 'shaved', label: 'Shaved', namePart: 'shorn', wig: 'bald cap' }
  ],

  hairColours: [
    { id: 'black', label: 'Black', hex: '#1f1c1e', brow: '#151214', namePart: 'raven' },
    { id: 'darkBrown', label: 'Dark brown', hex: '#4a3020', brow: '#2e1e14', namePart: 'dusky' },
    { id: 'auburn', label: 'Auburn', hex: '#8a3a1a', brow: '#5a2a16', namePart: 'russet' },
    { id: 'blonde', label: 'Blonde', hex: '#d8b25a', brow: '#8a6a34', namePart: 'golden' },
    { id: 'silver', label: 'Silver', hex: '#b8bcc4', brow: '#6a6e76', namePart: 'silvered' },
    { id: 'white', label: 'White', hex: '#e8e4dc', brow: '#8a8680', namePart: 'ashen' },
    { id: 'green', label: 'Green', hex: '#3f7a3a', brow: '#2e1e14', namePart: 'mossy' },
    { id: 'purple', label: 'Purple', hex: '#5a2a6a', brow: '#2e1e14', namePart: 'violet' },
    { id: 'orange', label: 'Orange', hex: '#d9661c', brow: '#5a2a16', namePart: 'ember' }
  ],

  // The basic kit. Items list the keys they need, so the shopping list stays short.
  kit: {
    latex: { name: 'Liquid latex', asin: 'B0B6FWCG5D', note: 'I\'ve bought this exact one.' },
    toiletPaper: { name: 'Toilet paper' },
    freshBlood: { name: 'Fake blood', asin: 'B0BSXW7GT9', note: 'I\'ve ordered this one before. Honestly, any fake blood works.' },
    paleFoundation: { name: 'Foundation', asin: 'B008BEQFAQ', note: 'This is what I use for costume makeup. Match your skin tone if you can, but it\'s not essential - you\'ll add blue and purple around it anyway.' },
    whitePaint: { name: 'Snazaroo white face paint', asin: 'B0027IVU5C', note: 'I only use Snazaroo. I\'ve used this exact one, just not bought through Amazon.' },
    palette: { name: 'Eyeshadow palette', asin: 'B081D95GMC', note: 'I\'ve got this exact one - it\'s what I use for my signature dead look.' },
    redLipstick: { name: 'Red lipstick', asin: 'B005W1BDI0' },
    pinkLipstick: { name: 'Bright pink lipstick', q: 'bright pink lipstick' },
    blackLiner: { name: 'Black eyeliner', asin: 'B086FXJ2MV' },
    redLiner: { name: 'Red liquid eyeliner', q: 'red liquid eyeliner' },
    whitePencil: { name: 'White eyeliner', asin: 'B094928BTR', note: 'I used this for my Mad Hatter.' },
    whiteMascara: { name: 'White mascara', asin: 'B0D66C76TH', note: 'Honestly I get the effect by running white eyeliner over my lashes.' },
    glitter: { name: 'Cosmetic glitter and glitter glue', q: 'cosmetic glitter with glitter glue' },
    colourPaints: { name: 'Bright face paint palette', q: 'face paint palette bright colours' },
    orangePaint: { name: 'Snazaroo orange face paint', asin: 'B000H6OYSQ' },
    redPaint: { name: 'Snazaroo red face paint', asin: 'B000LWGI1M' },
    bluePaint: { name: 'Snazaroo blue face paint', asin: 'B000H6W2H6' },
    crackedPaint: { name: 'Cracked doll face paint', asin: 'B0HCVMWPGR' },
    dollBlush: { name: 'Pink doll blush', asin: 'B0GH8T5R9W' },
    powder: { name: 'Setting powder', asin: 'B09N2YW2T6' },
    sponges: { name: 'Makeup sponges', asin: 'B0CMCKBBRJ', note: 'These look better than mine, to be fair.' },
    brushes: { name: 'Makeup brushes', asin: 'B07FTB6NKV', note: 'I\'ve bought these exact ones. Just a good-to-have.' },
    tweezers: { name: 'Tweezers', asin: 'B01N5A69RV' },
    wipes: { name: 'Makeup remover wipes', asin: 'B01IAFEGCO', note: 'These are the exact ones I use.' },
    lashes: { name: 'False eyelashes', asin: 'B0CHFH9CS1', note: 'I\'ve ordered these before.' },
    blackLashes: { name: 'Black false eyelashes', asin: 'B0BNPLJLM1' },
    lashGlue: { name: 'Eyelash glue', asin: 'B085L61X9R' },
    fangs: { name: 'Vampire fangs', asin: 'B0H2JR1NDX', note: 'These are the same type I use - you heat the beads and mould them to your own teeth. They look the best, but be careful eating with them in so you don\'t swallow one by accident.' },
    zip: { name: 'Metal zip, about 20cm', q: 'metal zip 20cm' },
    wigCap: { name: 'Wig cap', q: 'wig cap' },
    baldCap: { name: 'Latex bald cap', q: 'latex bald cap' },
    wig: { asin: 'B09QKPCL8T', note: 'I\'ve ordered this exact one before. I think these wigs are great - I have this one in several shades.' }
  },

  // Each of these appears once at most.
  prep: { steps: [[10, 'Start with clean, moisturised skin so everything goes on smoothly.']], products: [] },
  patchTest: { steps: [[10, 'Patch-test liquid latex on your inner arm the day before, and skip it if you\'re allergic.']], products: [] },
  // Shared by every latex wound; each wound adds its own placement line first.
  woundMethod: {
    steps: [[62, 'Rip toilet paper into a rough shape so there are no hard edges, then peel the plies apart. Paint on a layer of liquid latex, lay a ply on top, and keep alternating, finishing with latex. Once it\'s dry, cover it with foundation. Use tweezers to pinch a small hole, rip it open and fill the inside with red lipstick. Shade the outside and inner edges with blue and purple from the palette, then finish with fake blood.']],
    products: ['latex', 'toiletPaper', 'paleFoundation', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes', 'sponges']
  },
  // Shown once under the lens in the shopping list.
  lensNotes: [
    'I\'ve ordered from here before. I don\'t get any commission on these, but they come in prescription, which is a godsend for a blind bat like me.',
    'Coloured lenses aren\'t great for your eyes, so use them sparingly and don\'t wear them for long. Wash your hands and dry them on kitchen roll, not a towel, before putting them in. Never wear them more than once, even if they\'re technically monthly.'
  ],
  essentials: {
    intro: 'The things I always have in the drawer for Halloween.',
    products: ['latex', 'whitePaint', 'palette', 'blackLiner', 'paleFoundation', 'redLipstick', 'powder', 'sponges', 'brushes', 'freshBlood', 'tweezers', 'wipes']
  },
  setting: {
    steps: [
      [86, 'Dust setting powder over everything so it lasts the night.'],
      [130, 'At the end of the night, take it all off with a cleansing balm and peel any latex away slowly.']
    ],
    products: ['powder', 'wipes']
  },
  wig: { steps: [[100, 'Pin your hair flat under a wig cap, then pull the wig on from front to back and fix it with grips.']], products: ['wigCap'] },
  baldCap: { steps: [[100, 'Slick your hair down under a bald cap, stick the edges down with liquid latex and blend foundation over the join.']], products: ['baldCap', 'latex', 'paleFoundation'], patch: true },

  makeup: {
    skin: [
      { id: 'none', label: 'Natural', namePart: '', applyOrder: 20, steps: [], products: [] },
      {
        id: 'corpse', label: 'Pale base', namePart: 'pallid', applyOrder: 20,
        steps: ['Sponge on a foundation a shade or two paler than your skin, right down your neck.'],
        products: ['paleFoundation', 'sponges']
      },
      {
        id: 'zombie', label: 'Zombie grey-green', namePart: 'rotting', applyOrder: 20,
        steps: ['Mix a little green and grey eyeshadow into a pale foundation and sponge it over your face and neck.'],
        products: ['paleFoundation', 'palette', 'sponges']
      },
      {
        id: 'ghostly', label: 'Ghostly white', namePart: 'spectral', applyOrder: 20,
        steps: ['Sponge white face paint thinly over your face, neck and ears.'],
        products: ['whitePaint', 'sponges']
      },
      {
        id: 'bruised', label: 'Bruised blue', namePart: 'drowned', applyOrder: 20,
        steps: ['Sponge blue face paint thinly over your face and neck, then pat purple eyeshadow on top so you look cold and waterlogged.'],
        products: ['bluePaint', 'palette', 'sponges']
      }
    ],

    contour: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 30, steps: [], products: [] },
      {
        id: 'bruised', label: 'Bruised hollows', namePart: 'bruised', applyOrder: 30,
        steps: ['Add blue and purple eyeshadow under your eyes, in the hollows of your cheeks and at the corners of your mouth.'],
        products: ['palette']
      },
      {
        id: 'sunken', label: 'Sunken cheeks', namePart: 'gaunt', applyOrder: 30,
        steps: ['Brush grey-brown eyeshadow under your cheekbones and into your temples, and blend until there\'s no hard line.'],
        products: ['palette']
      },
      {
        id: 'redRims', label: 'Reddened eye rims', namePart: 'sleepless', applyOrder: 30,
        steps: ['Smudge red eyeshadow along your lower lashes and into the inner corners so your eyes look sore.'],
        products: ['palette']
      },
      {
        id: 'dollBlush', label: 'Doll blush', namePart: 'rosy', applyOrder: 30,
        steps: ['Dab pink doll blush in neat round circles on the apples of your cheeks.'],
        products: ['dollBlush', 'brushes']
      }
    ],

    underEyes: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 40, steps: [], products: [] },
      {
        id: 'hollows', label: 'Dead hollows', namePart: 'hollow', applyOrder: 40,
        steps: ['Pat purple and grey eyeshadow under your eyes and into the inner corners, blending it down towards your cheeks.'],
        products: ['palette']
      },
      {
        id: 'bruised', label: 'Bruised', namePart: 'battered', applyOrder: 40,
        steps: ['Dab blue and purple eyeshadow all round your eyes with a sponge, keeping it patchy.'],
        products: ['palette', 'sponges']
      },
      {
        id: 'kohl', label: 'Smudged kohl', namePart: 'smudged', applyOrder: 40,
        steps: ['Scribble black eyeliner along your lower lashes, then smudge it down with your finger as if it\'s run.'],
        products: ['blackLiner']
      },
      {
        id: 'sockets', label: 'Sunken skull sockets', namePart: 'sunken', applyOrder: 40,
        steps: ['Fill a big circle round each eye with black eyeliner, from brow to cheekbone, and soften the edge with grey eyeshadow.'],
        products: ['blackLiner', 'palette', 'brushes']
      }
    ],

    lenses: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 90, steps: [], products: [] },
      { id: 'whiteout', label: 'Whiteout', namePart: 'blind', applyOrder: 90, steps: [], products: [{ name: 'Whiteout lenses', url: 'https://www.colouredcontacts.com/en_GB/products/white-out-coloured-prescription-contact-lenses-30-day', lens: true }] },
      { id: 'whiteoutOne', label: 'Whiteout, one eye', namePart: 'one-eyed', applyOrder: 90, steps: [], products: [{ name: 'Whiteout lenses', url: 'https://www.colouredcontacts.com/en_GB/products/white-out-coloured-prescription-contact-lenses-30-day', lens: true }] },
      { id: 'whiteRing', label: 'White ring', namePart: 'moonstruck', applyOrder: 90, steps: [], products: [{ name: 'White ring lenses', url: 'https://www.colouredcontacts.com/en_GB/products/white-lunar-coloured-prescription-contact-lenses-30-day', lens: true }] },
      { id: 'vampireRed', label: 'Vampire red', namePart: 'bloodthirsty', applyOrder: 90, steps: [], products: [{ name: 'Vampire red lenses', url: 'https://www.colouredcontacts.com/en_GB/products/red-angelic-vampire-prescription', lens: true }] },
      { id: 'brightRed', label: 'Bright red', namePart: 'serpentine', applyOrder: 90, steps: [], products: [{ name: 'Bright red lenses', url: 'https://www.colouredcontacts.com/en_GB/products/voldemort-prescription-contact-lenses', lens: true }] },
      { id: 'werewolf', label: 'Green werewolf', namePart: 'feral', applyOrder: 90, steps: [], products: [{ name: 'Green werewolf lenses', url: 'https://www.colouredcontacts.com/en_GB/products/green-werewolf-coloured-prescription-contact-lenses-30-day', lens: true }] },
      { id: 'redClown', label: 'Red clown', namePart: 'manic', applyOrder: 90, steps: [], products: [{ name: 'Red clown lenses', url: 'https://www.colouredcontacts.com/en_GB/products/red-crazy-clown-30-day-p', lens: true }] },
      { id: 'galaxy', label: 'Galaxy', namePart: 'starry', applyOrder: 90, steps: [], products: [{ name: 'Galaxy lenses', url: 'https://www.colouredcontacts.com/en_GB/products/galaxy-coloured-cosplay-lenses-90-day', lens: true }] },
      { id: 'enchantedPink', label: 'Enchanted pink', namePart: 'enchanted', applyOrder: 90, steps: [], products: [{ name: 'Enchanted pink lenses', url: 'https://www.colouredcontacts.com/en_GB/products/enchanted-pink-coloured-contact-lenses-30-day', lens: true }] },
      { id: 'blackout', label: 'Blackout', namePart: 'soulless', applyOrder: 90, steps: [], products: [{ name: 'Blackout lenses', url: 'https://www.colouredcontacts.com/en_GB/section/prescription-halloween', lens: true }] },
      { id: 'cat', label: 'Cat-eye yellow', namePart: 'feline', applyOrder: 90, steps: [], products: [{ name: 'Cat-eye yellow lenses', url: 'https://www.colouredcontacts.com/en_GB/section/prescription-halloween', lens: true }] }
    ],

    eyes: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 70, steps: [], products: [] },
      {
        id: 'smoky', label: 'Smoky black', namePart: 'smouldering', applyOrder: 70,
        steps: ['Pack black eyeshadow over your lids and smudge it out and under your lower lashes.'],
        products: ['palette', 'blackLiner', 'lashes', 'lashGlue']
      },
      {
        id: 'softSmoky', label: 'Soft smoky', namePart: 'hazy', applyOrder: 70,
        steps: ['Sweep charcoal and plum eyeshadow over your lids and blend the edges out softly.'],
        products: ['palette', 'lashes', 'lashGlue']
      },
      {
        id: 'redPink', label: 'Smudged red-pink', namePart: 'feverish', applyOrder: 70,
        steps: ['Smudge red and pink eyeshadow all round your eyes and blend it out messily.'],
        products: ['palette', 'lashes', 'lashGlue']
      },
      {
        id: 'berry', label: 'Smudged berry', namePart: 'sultry', applyOrder: 70,
        steps: ['Smudge berry and plum eyeshadow round your eyes, keeping the edges soft.'],
        products: ['palette', 'lashes', 'lashGlue']
      },
      {
        id: 'redLiner', label: 'Blood-red liner', namePart: 'weeping', applyOrder: 70,
        steps: ['Draw a thick winged line in red, then let one drop run down from the outer corner.'],
        products: ['redLiner', 'lashes', 'lashGlue']
      },
      {
        id: 'glitter', label: 'Glitter', namePart: 'glittering', applyOrder: 70,
        steps: ['Dab glitter glue on your lids and press loose glitter on top.'],
        products: ['glitter', 'lashes', 'lashGlue']
      },
      {
        id: 'diamonds', label: 'Clown diamonds', namePart: 'harlequin', applyOrder: 70,
        steps: ['Draw a tall diamond through each eye with eyeliner and fill it in with blue eyeshadow.'],
        products: ['blackLiner', 'palette']
      },
      {
        id: 'spiderweb', label: 'Spiderweb', namePart: 'webbed', applyOrder: 70,
        steps: ['Draw a web out from the corner of one eye onto your temple with black eyeliner - the straight lines first, then the curved ones between them.'],
        products: ['blackLiner']
      },
      {
        id: 'whiteLashes', label: 'White lashes and brows', namePart: 'frosted', applyOrder: 70,
        steps: ['Sweep pink-red eyeshadow over your lids, then coat your lashes and brows in white mascara.'],
        products: ['palette', 'whiteMascara', 'lashGlue']
      }
    ],

    facePaint: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 50, steps: [], products: [] },
      {
        id: 'clown', label: 'Clown, red nose', namePart: 'grinning', applyOrder: 50,
        steps: [
          'Cover your face in white face paint and set it with powder.',
          'Draw high arched brows in black, then paint on a red nose and a wide red smile.'
        ],
        products: ['whitePaint', 'powder', 'blackLiner', 'redLipstick', 'sponges', 'brushes', 'blackLashes', 'lashGlue']
      },
      {
        id: 'clownPink', label: 'Clown, pink nose', namePart: 'giggling', applyOrder: 50,
        steps: [
          'Cover your face in white face paint and set it with powder.',
          'Draw high arched brows in black, then paint on a pink nose and a wide red smile.'
        ],
        products: ['whitePaint', 'powder', 'blackLiner', 'pinkLipstick', 'redLipstick', 'sponges', 'brushes', 'blackLashes', 'lashGlue']
      },
      {
        id: 'skull', label: 'Skull, half face', namePart: 'skeletal', applyOrder: 50,
        steps: [
          'Paint half your face white, then fill the eye socket, nostril and cheek hollow on that side with black eyeliner.',
          'Draw teeth over your lips with eyeliner.'
        ],
        products: ['whitePaint', 'blackLiner', 'brushes', 'sponges']
      },
      {
        id: 'skeletonFull', label: 'Full skeleton', namePart: 'bony', applyOrder: 50,
        steps: [
          'Paint your whole face white, then fill big sockets round your eyes with black eyeliner and a little navy eyeshadow.',
          'Fill in your nose with eyeliner and draw a stitched smile right across your cheeks.'
        ],
        products: ['whitePaint', 'blackLiner', 'palette', 'brushes', 'sponges']
      },
      {
        id: 'sugarSkull', label: 'Sugar skull', namePart: 'marigold', applyOrder: 50,
        steps: [
          'Paint your face white, ring each eye with a colourful flower and paint a black heart on your nose.',
          'Finish with stitched teeth across your mouth and dots on your chin.'
        ],
        products: ['whitePaint', 'colourPaints', 'brushes', 'sponges', 'blackLiner']
      },
      {
        id: 'pumpkin', label: 'Pumpkin', namePart: 'carved', applyOrder: 50,
        steps: [
          'Sponge orange face paint all over, with darker orange lines curving down your face.',
          'Fill in black triangles over your eyes and nose and a jagged grin over your mouth with black eyeliner.'
        ],
        products: ['orangePaint', 'blackLiner', 'sponges', 'brushes']
      },
      {
        id: 'glamWitch', label: 'Glam witch', namePart: 'bewitching', applyOrder: 50,
        steps: [
          'Pack deep purple eyeshadow over your lids and draw a sharp black wing.',
          'Finish with a bold red lip.'
        ],
        products: ['palette', 'blackLiner', 'redLipstick', 'sponges', 'brushes', 'lashes', 'lashGlue']
      },
      {
        id: 'devil', label: 'Scary devil', namePart: 'infernal', applyOrder: 50,
        steps: [
          'Sponge red face paint all over, then shade your cheek hollows, temples and eye sockets with black eyeshadow, and draw sharp brows and lines with black eyeliner.',
          'Press black eyeshadow from the palette onto your lips with a brush.'
        ],
        products: ['redPaint', 'palette', 'blackLiner', 'sponges', 'brushes']
      },
      {
        id: 'comicDevil', label: 'Comic devil', namePart: 'impish', applyOrder: 50,
        steps: [
          'Sponge red face paint over your whole face and neck.',
          'Draw pointed brows, a curled moustache and a little goatee with black eyeliner.'
        ],
        products: ['redPaint', 'blackLiner', 'sponges', 'brushes']
      }
    ],

    // Effects can be combined.
    effects: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 60, steps: [], products: [] },
      { id: 'clawRip', label: 'Claw rip', namePart: 'mauled', applyOrder: 61, wound: true, patch: true, steps: ['For the claw rip, mark out three diagonal strips across the middle of your face, over your nose and cheeks.'], products: [] },
      { id: 'tornCheeks', label: 'Torn cheeks', namePart: 'torn', applyOrder: 61, wound: true, patch: true, steps: ['For torn cheeks, place a wound on the apple of each cheek.'], products: [] },
      { id: 'tornCorners', label: 'Torn mouth corners', namePart: 'ragged', applyOrder: 61, wound: true, patch: true, steps: ['For torn mouth corners, place a small wound at each corner of your mouth, ripping it outwards.'], products: [] },
      { id: 'templePeel', label: 'Temple peel', namePart: 'peeling', applyOrder: 61, wound: true, patch: true, steps: ['For the temple peel, place a wound from your temple round the outside of one eye.'], products: [] },
      { id: 'foreheadGash', label: 'Forehead gash', namePart: 'slain', applyOrder: 61, wound: true, patch: true, steps: ['For the forehead gash, place a long wound across your forehead.'], products: [] },
      { id: 'zipFace', label: 'Zip face', namePart: 'unzipped', applyOrder: 61, wound: true, patch: true, steps: ['For the zip face, press a zip into the first layer of latex down one side of your face and build the wound round it.'], products: ['zip'] },
      { id: 'throatBite', label: 'Throat bite', namePart: 'bitten', applyOrder: 61, wound: true, patch: true, steps: ['For the throat bite, place a small wound on the side of your neck and pinch two holes instead of one rip.'], products: [] },
      {
        id: 'bloodTears', label: 'Blood tears', namePart: 'bleeding', applyOrder: 60,
        steps: ['Dot fake blood on your lower lash line and let it run down your cheeks.'],
        products: ['freshBlood', 'brushes']
      },
      {
        id: 'stitchedSmile', label: 'Stitched smile', namePart: 'stitched', applyOrder: 60,
        steps: ['Draw a line from each corner of your mouth up towards your ears, then add little black stitches across it.'],
        products: ['blackLiner', 'redLipstick', 'brushes']
      },
      {
        id: 'scar', label: 'Stitched cheek scar', namePart: 'scarred', applyOrder: 60,
        steps: ['Draw a scar down one cheek with red lipstick, blend it a little, then add black stitches across it with eyeliner.'],
        products: ['redLipstick', 'blackLiner', 'brushes']
      },
      {
        id: 'cracked', label: 'Cracked porcelain', namePart: 'cracked', applyOrder: 60,
        steps: [
          'Sponge the cracked doll face paint over your face and let it dry so it cracks.',
          'Draw a few bigger cracks from your hairline down across one cheek with black eyeliner, with a fine line of white eyeliner beside each one.'
        ],
        products: ['crackedPaint', 'sponges', 'blackLiner', 'whitePencil', 'brushes']
      },
      {
        id: 'veins', label: 'Veins', namePart: 'veined', applyOrder: 60,
        steps: ['Draw thin branching lines in purple and blue eyeshadow with a fine brush, starting at your temples and under your eyes.'],
        products: ['palette', 'brushes']
      }
    ],

    lips: [
      { id: 'none', label: 'Natural', namePart: '', applyOrder: 80, steps: [], products: [] },
      { id: 'black', label: 'Black', namePart: 'inky', applyOrder: 80, steps: ['Press eyeshadow from the palette onto your lips with a brush.'], products: ['palette'] },
      { id: 'blood', label: 'Blood red', namePart: 'scarlet', applyOrder: 80, steps: ['Line and fill your lips with red lipstick, blot, then add a second coat.'], products: ['redLipstick'] },
      { id: 'berry', label: 'Berry', namePart: 'berry-stained', applyOrder: 80, steps: ['Press eyeshadow from the palette onto your lips with a brush.'], products: ['palette'] },
      { id: 'blue', label: 'Blue-dead', namePart: 'breathless', applyOrder: 80, steps: ['Press eyeshadow from the palette onto your lips with a brush.'], products: ['palette'] },
      { id: 'stitched', label: 'Stitched', namePart: 'silenced', applyOrder: 80, steps: ['Dab foundation over your lips, then draw black stitches across them with eyeliner.'], products: ['paleFoundation', 'blackLiner'] }
    ],

    // Extras can be combined.
    extras: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 60, steps: [], products: [] },
      {
        id: 'fangs', label: 'Fangs', namePart: 'fanged', applyOrder: 95,
        steps: ['Warm the fitting beads in hot water, press them into the fangs and onto your teeth, then hold until set.'],
        products: ['fangs']
      },
      {
        id: 'elegantDrips', label: 'Elegant drips', namePart: 'dripping', applyOrder: 88,
        steps: ['Dot fake blood at both corners of your mouth and let it run down in thin lines.'],
        products: ['freshBlood']
      },
      {
        id: 'messyFeed', label: 'Messy feed', namePart: 'gorged', applyOrder: 88,
        steps: ['Smear fake blood round your mouth and chin with your fingers, then let a few drips run down.'],
        products: ['freshBlood']
      },
      {
        id: 'trickle', label: 'Single trickle', namePart: 'trickling', applyOrder: 88,
        steps: ['Dot fake blood at one corner of your mouth and let a single line run down your chin.'],
        products: ['freshBlood']
      }
    ]
  },

  masks: [
    { id: 'none', label: 'None', namePart: '', applyOrder: 98, steps: [], products: [] },
    {
      id: 'hag', label: 'Hag mask', namePart: 'gnarled', applyOrder: 98,
      steps: ['Pull the mask on and line up the eye holes before your wig and hood go on.'],
      products: [{ name: 'Hag mask', asin: 'B0H2GVKBQG', note: 'I\'ve bought this exact one.' }]
    },
    {
      id: 'sheet', label: 'Sheet ghost', namePart: 'draped', applyOrder: 98,
      steps: ['Drape an old white sheet over your head, mark where your eyes are with a pencil, then take it off and cut two small holes.'],
      products: [{ name: 'White flat sheet', q: 'white flat sheet single' }]
    },
    {
      id: 'skeleton', label: 'Skeleton mask', namePart: 'grinning', applyOrder: 98,
      steps: ['Put the mask on first so the strap sits under your hair or hood.'],
      products: ['skeletonMask']
    }
  ],

  // Clothing is mostly from your wardrobe; only a few bought finishing touches have products.
  clothing: [
    { id: 'plain', label: 'Plain dark top', noun: '', applyOrder: 110, steps: [], products: [] },
    { id: 'tuxedo', label: 'Tuxedo and bow tie', noun: 'aristocrat', applyOrder: 110, steps: [], products: [] },
    { id: 'shirtTie', label: 'White shirt and tie', noun: 'clerk', applyOrder: 110, steps: [], products: [] },
    {
      id: 'vampire', label: 'High-collared cape', noun: 'aristocrat', applyOrder: 110,
      steps: ['Pin the cape collar to your shoulders so it stands up and frames your face.'],
      products: ['cape']
    },
    { id: 'velvetCorset', label: 'Velvet corset and capelet', noun: 'temptress', applyOrder: 110, steps: [], products: ['corset'] },
    { id: 'cloak', label: 'Brown hooded cloak', noun: 'wanderer', applyOrder: 110, steps: [], products: ['cloak'] },
    { id: 'redCape', label: 'Red hooded cape', noun: 'wanderer', applyOrder: 110, steps: [], products: [] },
    {
      id: 'shawl', label: 'Tattered shawl', noun: 'crone', applyOrder: 110,
      steps: ['Layer the creepy cloth round your shoulders like a shawl.'],
      products: ['creepyCloth']
    },
    {
      id: 'zombie', label: 'Torn shirt', noun: 'shambler', applyOrder: 110,
      steps: ['Rip an old shirt at the seams, rub in brown eyeshadow and splash a little fake blood round the collar.'],
      products: ['freshBlood', 'palette']
    },
    {
      id: 'tornJumper', label: 'Torn jumper', noun: 'shambler', applyOrder: 110,
      steps: ['Snip holes in an old jumper, pull a few stitches loose and rub in brown eyeshadow for dirt.'],
      products: ['palette']
    },
    {
      id: 'bloodTee', label: 'Bloodied T-shirt', noun: 'shambler', applyOrder: 110,
      steps: ['Flick fake blood over a white T-shirt with an old toothbrush and let it dry before you put it on.'],
      products: ['freshBlood']
    },
    { id: 'vestTop', label: 'Black vest top', noun: 'shambler', applyOrder: 110, steps: [], products: [] },
    {
      id: 'nurseDress', label: 'Torn nurse dress', noun: 'nurse', applyOrder: 110,
      steps: ['Rip the hem and sleeves of the nurse dress and splatter it with fake blood.'],
      products: ['nurseCostume', 'freshBlood']
    },
    { id: 'clown', label: 'Ruff and stripes', noun: 'jester', applyOrder: 110, steps: [], products: [] },
    { id: 'harlequin', label: 'Harlequin satin top', noun: 'jester', applyOrder: 110, steps: [], products: [{ byFeatures: { feminine: 'harlequin', masculine: 'clownCostume', androgynous: 'harlequinOrClown' } }] },
    {
      id: 'bride', label: 'Ragged lace bodice', noun: 'bride', applyOrder: 110,
      steps: ['Tear the edges of an old dress and rub grey eyeshadow into the folds so it looks grave-worn.'],
      products: []
    },
    { id: 'hoodie', label: 'Bone-print hoodie', noun: 'skeleton', applyOrder: 110, steps: [], products: [] },
    { id: 'blazer', label: 'Blazer and feathers', noun: 'dandy', applyOrder: 110, steps: ['Tuck a bunch of black feathers under one shoulder of your jacket.'], products: ['feathers'] },
    { id: 'doll', label: 'Doll dress', noun: 'doll', applyOrder: 110, steps: [], products: [] },
    {
      id: 'mourning', label: 'Mourning gown', noun: 'mourner', applyOrder: 110,
      steps: ['Brush white powder over the shoulders and folds so the fabric looks faded and dusty.'],
      products: []
    },
    { id: 'pumpkin', label: 'Pumpkin top', noun: 'pumpkin', applyOrder: 110, steps: [], products: [] },
    { id: 'redDress', label: 'Red dress', noun: 'socialite', applyOrder: 110, steps: [], products: [] },
    { id: 'tulleGown', label: 'Purple tulle gown', noun: 'enchantress', applyOrder: 110, steps: [], products: [] },
    { id: 'laceTop', label: 'Black lace top', noun: 'enchantress', applyOrder: 110, steps: [], products: [] },
    { id: 'velvetTop', label: 'Black velvet top', noun: 'enchantress', applyOrder: 110, steps: [], products: [] },
    { id: 'hatterJacket', label: 'Burgundy jacket and jabot', noun: 'eccentric', applyOrder: 110, steps: [], products: [] },
    { id: 'highCollar', label: 'High-collared black top', noun: 'fiend', applyOrder: 110, steps: [], products: [] }
  ],

  headwear: [
    { id: 'none', label: 'None', applyOrder: 115, steps: [], products: [] },
    { id: 'witchHat', label: 'Crooked witch hat', applyOrder: 115, steps: [], products: [] },
    { id: 'veilHat', label: 'Witch hat with veil', applyOrder: 115, steps: [], products: ['witchHatVeil'] },
    { id: 'topHat', label: 'Black top hat', applyOrder: 115, steps: [], products: ['blackTopHat', 'oliveTopHat'] },
    { id: 'ramHorns', label: 'Ram horns', applyOrder: 115, steps: [], products: ['ramHorns'] },
    { id: 'horns', label: 'Red horns', applyOrder: 115, steps: [], products: ['redHorns'] },
    { id: 'redHood', label: 'Red hood', applyOrder: 115, steps: [], products: [] },
    { id: 'brownHood', label: 'Brown hood', applyOrder: 115, steps: [], products: [] },
    { id: 'nurseCap', label: 'Nurse cap', applyOrder: 115, steps: [], products: [] },
    {
      id: 'cone', label: 'Little cone hat', applyOrder: 115,
      steps: ['Angle the cone hat to one side and tuck the elastic under your hair.'],
      products: [{ name: 'Mini clown cone hat', q: 'mini clown party hat pompom' }]
    },
    { id: 'veil', label: 'Veil and wilted crown', applyOrder: 115, steps: ['Pin the veil in at the crown.'], products: ['veil'] },
    { id: 'bow', label: 'Big hair bow', applyOrder: 115, steps: [], products: ['bow'] },
    { id: 'stalk', label: 'Pumpkin headband', applyOrder: 115, steps: [], products: ['pumpkinHeadband'] }
  ],

  accessories: [
    { id: 'none', label: 'None', applyOrder: 120, steps: [], products: [] },
    { id: 'choker', label: 'Black choker', applyOrder: 120, steps: [], products: [{ name: 'Black velvet choker', q: 'black velvet choker' }] },
    { id: 'tulleRuff', label: 'Red and black ruff', applyOrder: 120, steps: [], products: [] },
    { id: 'amulet', label: 'Blood amulet', applyOrder: 120, steps: [], products: [{ name: 'Gothic red gem pendant', q: 'gothic red gem pendant necklace' }] },
    { id: 'bones', label: 'Bone charms', applyOrder: 120, steps: [], products: [{ name: 'Bone charm necklace', q: 'bone charm necklace' }] },
    { id: 'locket', label: 'Pearls and locket', applyOrder: 120, steps: [], products: [{ name: 'Pearl necklace with locket', q: 'pearl necklace heart locket' }] },
    { id: 'cameo', label: 'Victorian brooch', applyOrder: 120, steps: [], products: ['brooch'] },
    { id: 'key', label: 'Key on a ribbon', applyOrder: 120, steps: [], products: [{ name: 'Skeleton key necklace', q: 'skeleton key necklace ribbon' }] },
    {
      id: 'pompoms', label: 'Pompoms', applyOrder: 120,
      steps: ['Safety-pin two big pompoms down the front of your top.'],
      products: [{ name: 'Large red pompoms', q: 'large red craft pompoms' }]
    },
    { id: 'lantern', label: 'Green glass lantern', applyOrder: 120, steps: [], products: [] },
    { id: 'candlestick', label: 'Candle holder', applyOrder: 120, steps: [], products: ['candleHolder', 'candles'] },
    { id: 'cauldron', label: 'Cauldron', applyOrder: 120, steps: [], products: [] },
    { id: 'goblet', label: 'Goblet', applyOrder: 120, steps: [], products: [] },
    { id: 'teapot', label: 'Teapot', applyOrder: 120, steps: [], products: [] },
    { id: 'webCape', label: 'Spider web cape', applyOrder: 120, steps: [], products: ['webCape'] }
  ],

  // Bought costume pieces. alts are shown as "or" options in the same row.
  // An item's products can also hold { byFeatures: { feminine, masculine, androgynous } } to pick by the Features setting.
  costume: {
    cape: { name: 'Vampire cape', asin: 'B0B4BB199N', alts: [{ label: 'Slightly darker', asin: 'B0H6HD3SD4' }] },
    brooch: { name: 'Victorian brooch', asin: 'B0CL6T41WT' },
    corset: { name: 'Overbust corset top', asin: 'B09W4S2ZX7' },
    ruffle: { name: 'Ruffle collar and cuffs', asin: 'B0F8VBTYT1' },
    cloak: { name: 'Hooded cloak', asin: 'B0CJHTVSP8', note: 'I got mine from a LARP shop, which was pricier. This is the closest I\'d recommend.', alts: [{ label: 'Cheaper polyester option', asin: 'B0GXYR8N9G' }] },
    gloves: { name: 'Black gloves with long nails', asin: 'B0H9XZM4W9', note: 'I got these and they were fine.' },
    creepyCloth: { name: 'Creepy cloth', asin: 'B0D31BZCXK', note: 'I just layered this as a shawl and it worked super well.' },
    nurseCostume: { name: 'Zombie nurse costume', asin: 'B003DRUG7O', note: 'I\'m fairly sure this is the exact one I wore.' },
    harlequin: { name: 'Harlequin costume', asin: 'B07JKMRJYK' },
    clownCostume: { name: 'Clown costume', asin: 'B0DGTC3LCY' },
    witchHatVeil: { name: 'Witch hat with veil and feathers', asin: 'B08CF1NXGQ' },
    webCape: { name: 'Spider web lace cape', asin: 'B00F9IPFK8' },
    harlequinOrClown: { name: 'Harlequin costume', asin: 'B07JKMRJYK', alts: [{ label: 'Clown costume', asin: 'B0DGTC3LCY' }] },
    veil: { name: 'Veil', asin: 'B071F7GR8L' },
    skeletonMask: { name: 'Skeleton mask', asin: 'B0B78GWXGJ' },
    feathers: { name: 'Black feathers', asin: 'B072KVR5KW', note: 'The ones I bought.' },
    bow: { name: 'Hair bow', asin: 'B0BK7Z15H9' },
    nightgown: { name: 'Victorian nightgown', asin: 'B08Q7NVXYQ', note: 'Proper 100% cotton.', alts: [{ label: 'Cheaper option', asin: 'B08FB5LFVF' }] },
    candleHolder: { name: 'Candle holder', asin: 'B0FQJTDFGV' },
    candles: { name: 'Candles', asin: 'B09NBZCYMQ', note: 'These should fit the holder.' },
    pumpkinHeadband: { name: 'Pumpkin headband', asin: 'B09BVQTWV5' },
    blackTopHat: { name: 'Black top hat', asin: 'B00FFY3HF6', note: 'This one\'s pricey, but it\'s a proper hat rather than a costume replica, and real hats are actually quite cool.', alts: [{ label: 'Cheaper option - not sure how good it is', asin: 'B0BZW6JQV3' }] },
    oliveTopHat: { name: 'Olive green top hat', asin: 'B00JAB0UBO', note: 'The olive green is divine.' },
    clock: { name: 'Inflatable clock', asin: 'B06XGTXTS3', note: 'I got this for my Alice in Wonderland party.' },
    flamingo: { name: 'Inflatable flamingo', asin: 'B001ASG90G' },
    hedgehog: { name: 'Soft toy hedgehog', asin: 'B00U1GS7TY' },
    ramHorns: { name: 'Realistic ram horns', asin: 'B0C89V8FTY' },
    redHorns: { name: 'Red horns headband', asin: 'B0CBLTTRXQ' }
  },

  // Presets have versions; each version is tagged scary, sexy or glam.
  // set lists everything that differs from the neutral default. byFeatures adds to set for each features setting.
  // wardrobe and products on a preset apply to all its versions; a version can add its own.
  presets: [
    {
      id: 'vampire', label: 'Vampire',
      nouns: { feminine: 'countess', masculine: 'count', androgynous: 'noble' },
      wardrobe: ['A white shirt', 'A black or red velvet jacket', 'A black or red corset', 'Anything black lace'],
      products: ['cape', 'brooch'],
      versions: [
        {
          id: 'count', label: 'Count', tag: 'glam',
          set: { skin: 'corpse', contour: 'redRims', extras: ['fangs', 'elegantDrips'], clothing: 'tuxedo', hairStyle: 'slick', hairColour: 'black' }, products: ['ruffle', 'lashes', 'lashGlue'],
          byFeatures: {
            masculine: { lips: 'none', eyes: 'none' },
            feminine: { lips: 'blood', eyes: 'smoky' },
            androgynous: { lips: 'berry', eyes: 'softSmoky' }
          }
        },
        {
          id: 'messyFeed', label: 'Messy feed', tag: 'scary',
          set: { skin: 'corpse', extras: ['fangs', 'messyFeed'], effects: ['throatBite'], clothing: 'shirtTie', hairStyle: 'slick', hairColour: 'black' }
        },
        {
          id: 'velvet', label: 'Velvet vampire', tag: 'sexy',
          set: { skin: 'corpse', clothing: 'velvetCorset', lips: 'berry', eyes: 'redPink', hairStyle: 'long', hairColour: 'black' }
        }
      ]
    },
    {
      id: 'hag', label: 'Hag',
      nouns: { feminine: 'hag', masculine: 'warlock', androgynous: 'witch' },
      versions: [
        {
          id: 'hagMask', label: 'Hag mask', tag: 'scary',
          set: { mask: 'hag', hairStyle: 'long', hairColour: 'silver', clothing: 'cloak', headwear: 'brownHood', accessory: 'lantern' },
          products: ['gloves', 'creepyCloth'],
          steps: [[110, 'Layer the creepy cloth round your shoulders like a shawl, over the cloak.']]
        }
      ]
    },
    {
      id: 'zombie', label: 'Zombie',
      nouns: { feminine: 'zombie', masculine: 'zombie', androgynous: 'revenant' },
      wardrobe: ['Literally anything - regular clothes, the more dishevelled the better.'],
      versions: [
        { id: 'oneEyed', label: 'One-eyed', tag: 'scary', set: { skin: 'corpse', lenses: 'whiteoutOne', effects: ['templePeel', 'tornCheeks'], contour: 'bruised', clothing: 'tornJumper' } },
        { id: 'mauled', label: 'Mauled', tag: 'scary', wardrobe: ['A red hoodie or hooded cape'], set: { skin: 'corpse', effects: ['clawRip'], contour: 'bruised', clothing: 'redCape', headwear: 'redHood' } },
        { id: 'bitten', label: 'Bitten', tag: 'scary', set: { skin: 'corpse', effects: ['throatBite'], extras: ['messyFeed'], contour: 'bruised', clothing: 'vestTop' } },
        { id: 'unzipped', label: 'Unzipped', tag: 'scary', set: { skin: 'corpse', effects: ['zipFace'], clothing: 'bloodTee' } },
        {
          id: 'nurse', label: 'Zombie nurse', tag: 'sexy',
          nouns: { feminine: 'nurse', masculine: 'nurse', androgynous: 'nurse' },
          set: { skin: 'corpse', lenses: 'whiteout', effects: ['tornCorners'], contour: 'bruised', clothing: 'nurseDress', headwear: 'nurseCap', hairStyle: 'bob' }
        }
      ]
    },
    {
      id: 'clown', label: 'Scary clown',
      nouns: { feminine: 'clown', masculine: 'clown', androgynous: 'clown' },
      products: [{ byFeatures: { feminine: 'harlequin', masculine: 'clownCostume', androgynous: 'harlequinOrClown' } }],
      versions: [
        {
          id: 'tornCheeks', label: 'Torn cheeks', tag: 'scary',
          set: { facePaint: 'clown', underEyes: 'bruised', effects: ['tornCheeks', 'tornCorners'], lips: 'blood', clothing: 'harlequin', accessory: 'tulleRuff', hairStyle: 'bunches', hairColour: 'black' }, products: ['blackLashes', 'lashGlue']
        },
        {
          id: 'bloodTears', label: 'Blood tears', tag: 'scary',
          set: { facePaint: 'clownPink', underEyes: 'bruised', effects: ['bloodTears'], lips: 'blood', clothing: 'harlequin', accessory: 'tulleRuff', hairStyle: 'ponytail', hairColour: 'black' }, products: ['blackLashes', 'lashGlue']
        },
        {
          id: 'glam', label: 'Glam clown', tag: 'glam',
          set: { facePaint: 'clown', lips: 'blood', clothing: 'clown', headwear: 'cone', accessory: 'pompoms', hairStyle: 'witch', hairColour: 'orange' }, products: ['blackLashes', 'lashGlue']
        }
      ]
    },
    {
      id: 'bride', label: 'Corpse bride',
      nouns: { feminine: 'bride', masculine: 'groom', androgynous: 'betrothed' },
      wardrobe: ['An old white or cream dress.'],
      versions: [
        {
          id: 'dead', label: 'Dead bride', tag: 'scary',
          set: { skin: 'bruised', contour: 'bruised', underEyes: 'hollows', lips: 'blue', clothing: 'bride', headwear: 'veil', accessory: 'locket', hairStyle: 'long', hairColour: 'auburn' }
        },
        {
          id: 'faded', label: 'Faded bride', tag: 'glam',
          set: { skin: 'corpse', eyes: 'softSmoky', clothing: 'bride', headwear: 'veil', accessory: 'locket', hairStyle: 'bun', hairColour: 'auburn' }, products: ['lashes', 'lashGlue']
        }
      ]
    },
    {
      id: 'skeleton', label: 'Skeleton',
      nouns: { feminine: 'skeleton', masculine: 'skeleton', androgynous: 'skeleton' },
      versions: [
        { id: 'skullFace', label: 'Skull face', tag: 'scary', set: { facePaint: 'skeletonFull', clothing: 'blazer', hairStyle: 'slick', hairColour: 'black' } },
        { id: 'mask', label: 'Skeleton mask', tag: 'scary', set: { mask: 'skeleton', clothing: 'hoodie', hairColour: 'black' } }
      ]
    },
    {
      id: 'doll', label: 'Cursed doll',
      nouns: { feminine: 'doll', masculine: 'puppet', androgynous: 'marionette' },
      wardrobe: ['A cutesy dress you already have.'],
      versions: [
        {
          id: 'cracked', label: 'Cracked doll', tag: 'scary',
          set: { effects: ['cracked'], contour: 'dollBlush', underEyes: 'hollows', clothing: 'doll', headwear: 'bow', accessory: 'key', hairStyle: 'bunches', hairColour: 'blonde' }, products: ['blackLashes', 'lashGlue']
        },
        {
          id: 'porcelain', label: 'Porcelain doll', tag: 'glam',
          set: { skin: 'corpse', contour: 'dollBlush', lips: 'blood', clothing: 'doll', headwear: 'bow', accessory: 'key', hairStyle: 'bunches', hairColour: 'blonde' }, products: ['blackLashes', 'lashGlue']
        }
      ]
    },
    {
      id: 'ghost', label: 'Victorian ghost',
      nouns: { feminine: 'widow', masculine: 'widower', androgynous: 'spectre' },
      versions: [
        { id: 'sheet', label: 'Sheet ghost', tag: 'scary', nouns: { feminine: 'spook', masculine: 'spook', androgynous: 'spook' }, set: { mask: 'sheet' } },
        {
          id: 'greyLady', label: 'Grey lady', tag: 'glam',
          set: { skin: 'ghostly', lenses: 'whiteRing', clothing: 'mourning', accessory: 'candlestick', hairStyle: 'bun', hairColour: 'silver' },
          products: ['nightgown', 'lashes', 'lashGlue']
        }
      ]
    },
    {
      id: 'pumpkin', label: 'Pumpkin',
      nouns: { feminine: 'lantern', masculine: 'lantern', androgynous: 'gourd' },
      wardrobe: ['Orange clothes.'],
      versions: [
        { id: 'jack', label: 'Jack-o\'-lantern', tag: 'glam', set: { facePaint: 'pumpkin', lenses: 'cat', clothing: 'pumpkin', headwear: 'stalk', hairStyle: 'crop', hairColour: 'black' }, products: ['lashes', 'lashGlue'] }
      ]
    },
    {
      id: 'victim', label: 'Murder victim',
      nouns: { feminine: 'victim', masculine: 'victim', androgynous: 'victim' },
      wardrobe: ['Literally anything.'],
      versions: [
        {
          id: 'cluedo', label: 'Murder victim', tag: 'scary',
          set: { skin: 'corpse', clothing: 'redDress', effects: ['foreheadGash', 'bloodTears'], extras: ['elegantDrips'], lenses: 'whiteout', hairStyle: 'bun', hairColour: 'black' }
        },
        {
          id: 'elegant', label: 'Elegant corpse', tag: 'glam',
          nouns: { feminine: 'corpse', masculine: 'corpse', androgynous: 'corpse' },
          set: { clothing: 'redDress', effects: ['foreheadGash'], lips: 'blood', hairStyle: 'bun', hairColour: 'black' }, products: ['lashes', 'lashGlue']
        }
      ]
    },
    {
      id: 'witch', label: 'Glam witch',
      nouns: { feminine: 'enchantress', masculine: 'sorcerer', androgynous: 'witch' },
      wardrobe: ['Your most dramatic dress - tulle, velvet or lace.'],
      products: ['witchHatVeil', 'webCape'],
      versions: [
        {
          id: 'purple', label: 'Purple witch', tag: 'glam',
          set: { facePaint: 'glamWitch', lips: 'blood', clothing: 'tulleGown', headwear: 'veilHat', accessory: 'webCape', hairStyle: 'long', hairColour: 'black' }, products: ['lashes', 'lashGlue']
        },
        { id: 'web', label: 'Web witch', tag: 'sexy', set: { eyes: 'spiderweb', lips: 'blood', clothing: 'laceTop', headwear: 'veilHat', accessory: 'webCape', hairStyle: 'long', hairColour: 'black' } },
        { id: 'velvet', label: 'Velvet witch', tag: 'glam', set: { eyes: 'berry', lips: 'berry', clothing: 'velvetTop', headwear: 'veilHat', accessory: 'webCape', hairStyle: 'bob', hairColour: 'black' }, products: ['lashes', 'lashGlue'] }
      ]
    },
    {
      id: 'hatter', label: 'Mad Hatter',
      nouns: { feminine: 'hatter', masculine: 'hatter', androgynous: 'hatter' },
      wardrobe: ['A white ruffled shirt or blouse and a burgundy or patterned jacket.'],
      versions: [
        {
          id: 'hatter', label: 'Hatter', tag: 'glam',
          set: { hairStyle: 'longWavy', hairColour: 'silver', headwear: 'topHat', lenses: 'galaxy', eyes: 'whiteLashes', lips: 'blood', clothing: 'hatterJacket' },
          products: ['lashes', 'lashGlue', 'clock', 'flamingo', 'hedgehog'],
          steps: [[120, 'Props are optional, but a clock, a flamingo or a hedgehog to carry finishes the look.']]
        }
      ]
    },
    {
      id: 'devil', label: 'Devil',
      nouns: { feminine: 'devil', masculine: 'devil', androgynous: 'devil' },
      wardrobe: ['Something black and/or red.'],
      versions: [
        {
          id: 'scary', label: 'Scary devil', tag: 'scary',
          set: { facePaint: 'devil', headwear: 'ramHorns', lenses: 'blackout', effects: ['veins'], clothing: 'highCollar', hairStyle: 'slick', hairColour: 'black' }
        },
        {
          id: 'sexy', label: 'Sexy devil', tag: 'sexy',
          set: { eyes: 'smoky', lips: 'blood', headwear: 'horns', clothing: 'redDress', hairStyle: 'long', hairColour: 'black' }
        },
        {
          id: 'comic', label: 'Comic devil', tag: 'glam',
          set: { facePaint: 'comicDevil', headwear: 'horns', clothing: 'highCollar', hairStyle: 'slick', hairColour: 'black' }
        }
      ]
    }
  ],

  filters: [
    { id: 'all', label: 'All' },
    { id: 'scary', label: 'Scary' },
    { id: 'sexy', label: 'Sexy' },
    { id: 'glam', label: 'Glam' }
  ],

  // Pairs that should never come out of Randomise together.
  incompatible: [
    ['lips:stitched', 'effects:stitchedSmile'],
    ['facePaint:pumpkin', 'eyes:diamonds'],
    ['facePaint:sugarSkull', 'eyes:diamonds'],
    ['facePaint:skull', 'eyes:diamonds'],
    ['facePaint:skeletonFull', 'eyes:diamonds'],
    ['facePaint:devil', 'eyes:diamonds'],
    ['facePaint:glamWitch', 'eyes:diamonds'],
    ['facePaint:clown', 'skin:zombie'],
    ['lenses:blackout', 'underEyes:sockets'],
    ['facePaint:pumpkin', 'effects:cracked'],
    ['facePaint:sugarSkull', 'effects:cracked'],
    ['effects:zipFace', 'effects:templePeel'],
    ['effects:clawRip', 'effects:tornCheeks']
  ],

  defaults: {
    shape: 'oval', features: 'androgynous', skinTone: 'peach', hairStyle: 'crop', hairColour: 'darkBrown',
    skin: 'none', contour: 'none', underEyes: 'none', lenses: 'none', eyes: 'none', facePaint: 'none', effects: [], lips: 'none', extras: [],
    mask: 'none', clothing: 'plain', headwear: 'none', accessory: 'none', preset: null, version: null
  },

  nameFallbacks: { first: 'perfectly', second: 'ordinary', solo: 'restless' }
};
