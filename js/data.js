/* Halloween costume - options, presets, method steps and products.
   Steps are either a string (uses the item's applyOrder) or [order, string].
   Order: 10 prep and safety, 20 base, 30 contour, 40 under-eyes, 50 face paint,
   60 wounds, 70 eye makeup, 80 lips, 86-88 setting and blood, 90 lenses,
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

  // One wig style, long with a side-swept fringe and loose curly ends. Choosing a wig replaces the hairstyle.
  wigs: [
    { id: 'none', label: 'No wig' },
    { id: 'blue', label: 'Blue wig', hex: '#3a5ab8', brow: '#2e1e14', namePart: 'sapphire' },
    { id: 'purple', label: 'Purple wig', hex: '#6a3a8a', brow: '#2e1e14', namePart: 'violet' },
    { id: 'silver', label: 'Silver wig', hex: '#c8ccd4', brow: '#6a6e76', namePart: 'silvered' },
    { id: 'white', label: 'White wig', hex: '#f0ece4', brow: '#8a8680', namePart: 'snowy' },
    { id: 'black', label: 'Black wig', hex: '#1a1719', brow: '#151214', namePart: 'inky-haired' },
    { id: 'pink', label: 'Pink wig', hex: '#e07aa8', brow: '#5a2a16', namePart: 'candied' },
    { id: 'red', label: 'Red wig', hex: '#b81e24', brow: '#5a1a16', namePart: 'scarlet-haired' }
  ],

  hairStyles: [
    { id: 'bob', label: 'Wavy bob', namePart: 'marcelled', wig: 'wavy bob wig' },
    { id: 'long', label: 'Long with fringe', namePart: 'sleek', wig: 'long straight wig with fringe' },
    { id: 'longCentre', label: 'Long, centre parting', namePart: 'lank', wig: 'long straight centre parting wig' },
    { id: 'longWavy', label: 'Long and wavy', namePart: 'flowing', wig: 'long wavy wig' },
    { id: 'crop', label: 'Tousled crop', namePart: 'tousled', wig: 'short messy wig' },
    { id: 'slick', label: 'Slicked-back wave', namePart: 'slick', wig: 'slicked back short wig' },
    { id: 'bun', label: 'High bun', namePart: 'prim', wig: 'high bun wig' },
    { id: 'ponytail', label: 'Ponytail', namePart: 'swinging', wig: 'high ponytail wig' },
    { id: 'witch', label: 'Wild witch hair', namePart: 'tangled', wig: 'long messy witch wig' },
    { id: 'bunches', label: 'Bunches', namePart: 'pigtailed', wig: 'pigtail wig with fringe' },
    { id: 'curls50s', label: '1950s curls', namePart: 'pin-curled', wig: '1950s pin curl wig' },
    { id: 'tousledCurls', label: 'Long tousled curls', namePart: 'ringleted', wig: 'long curly wig' },
    { id: 'sidePart', label: 'Classic side parting', namePart: 'dapper', wig: 'short side parting wig' },
    { id: 'quiff', label: 'Swept-back quiff', namePart: 'quiffed', wig: 'quiff wig' },
    { id: 'curlyCrop', label: 'Short curly crop', namePart: 'curly', wig: 'short curly wig' },
    { id: 'undercut', label: 'Undercut', namePart: 'undercut', wig: 'undercut wig' },
    { id: 'shaved', label: 'Shaved', namePart: 'shorn', wig: 'bald cap' }
  ],

  // Natural colours for hairstyles; fantasy colours are wigs.
  hairColours: [
    { id: 'black', label: 'Black', hex: '#1f1c1e', brow: '#151214', namePart: 'raven' },
    { id: 'darkBrown', label: 'Dark brown', hex: '#4a3020', brow: '#2e1e14', namePart: 'dusky' },
    { id: 'auburn', label: 'Auburn', hex: '#8a3a1a', brow: '#5a2a16', namePart: 'russet' },
    { id: 'blonde', label: 'Blonde', hex: '#d8b25a', brow: '#8a6a34', namePart: 'golden' },
    { id: 'silver', label: 'Grey', hex: '#a8acb4', brow: '#5e6268', namePart: 'grizzled' },
    { id: 'white', label: 'White', hex: '#e8e4dc', brow: '#8a8680', namePart: 'ashen' }
  ],

  // The basic kit. Items list the keys they need, so the shopping list stays short.
  kit: {
    latex: { name: 'Liquid latex', asin: 'B0B6FWCG5D', note: 'I\'ve bought this exact one.' },
    toiletPaper: { name: 'Toilet paper' },
    freshBlood: { name: 'Fake blood', asin: 'B0BSXW7GT9', note: 'I\'ve ordered this one before. Honestly, any fake blood works.', shopNote: null },
    paleFoundation: { name: 'Foundation', asin: 'B008BEQFAQ', note: 'This is what I use for costume makeup. Match your skin tone if you can, but it\'s not essential - you\'ll add blue and purple around it anyway.', shopNote: null },
    whitePaint: { name: 'Snazaroo white face paint', asin: 'B0027IVU5C', note: 'I only use Snazaroo. I\'ve used this exact one, just not bought through Amazon.' },
    primer: { name: 'Eyeshadow primer', asin: 'B01DEYPNPU', note: 'I\'ve used this exact primer for eye makeup.', shopNote: null },
    palette: { name: 'Eyeshadow palette', asin: 'B081D95GMC', note: 'I\'ve got this exact one - it\'s what I use for my signature dead look.' },
    redLipstick: { name: 'Red lipstick', asin: 'B005W1BDI0' },
    pinkLipstick: { name: 'Bright pink lipstick', q: 'bright pink lipstick' },
    blackLiner: { name: 'Black eyeliner', asin: 'B086FXJ2MV' },
    redLiner: { name: 'Red liquid eyeliner', q: 'red liquid eyeliner' },
    whitePencil: { name: 'White eyeliner', asin: 'B094928BTR', note: 'I used this exact one for my Mad Hatter in 2019.' },
    whiteMascara: { name: 'White mascara', asin: 'B0D66C76TH', note: 'Honestly I get the effect by running white eyeliner over my lashes.' },
    colourPaints: { name: 'Bright face paint palette', q: 'face paint palette bright colours' },
    orangePaint: { name: 'Snazaroo orange face paint', asin: 'B000H6OYSQ' },
    redPaint: { name: 'Snazaroo red face paint', asin: 'B000LWGI1M' },
    bluePaint: { name: 'Snazaroo blue face paint', asin: 'B000H6W2H6' },
    crackedPaint: { name: 'Cracked doll face paint', asin: 'B0HCVMWPGR' },
    dollBlush: { name: 'Pink doll blush', asin: 'B0GH8T5R9W' },
    sponges: { name: 'Makeup sponges', asin: 'B0CMCKBBRJ', note: 'These look better than mine, to be fair.', shopNote: null },
    brushes: { name: 'Makeup brushes', asin: 'B07FTB6NKV', note: 'I\'ve bought these exact ones. Just a good-to-have.' },
    tweezers: { name: 'Tweezers', asin: 'B01N5A69RV' },
    wipes: { name: 'Makeup remover wipes', asin: 'B01IAFEGCO', note: 'These are the exact ones I use.', shopNote: null },
    lashes: { name: 'White false eyelashes', asin: 'B0CHFH9CS1', note: 'I\'ve ordered these before.' },
    blackLashes: { name: 'Black false eyelashes', asin: 'B0BNPLJLM1' },
    lashGlue: { name: 'Eyelash glue', asin: 'B085L61X9R' },
    fangs: { name: 'Vampire fangs', asin: 'B0H2JR1NDX', note: 'These are the same type I use - you heat the beads and mould them to your own teeth. They look the best, but be careful eating with them in so you don\'t swallow one by accident.', shopNote: 'These are definitively the best type of fangs to get, just make sure you don\'t accidentally swallow one (a.k.a. take them out when eating).' },
    zip: { name: 'Zip', asin: 'B0FL19L6D5' },
    baldCap: { name: 'Latex bald cap', q: 'latex bald cap' },
    wig: { asin: 'B09QKPCL8T', note: 'I\'ve ordered this exact one before. I think these wigs are great - I have this one in several shades.' }
  },

  // The base layer when no full-face paint is chosen.
  foundationBase: { cover: 'your normal foundation', product: 'paleFoundation' },

  // The shared method for latex wounds; each selected wound adds its own line to the first and second steps.
  // The base layer goes between building and ripping.
  latexWoundSteps: [
    'Rip toilet paper into rough shapes with no hard edges and peel the plies apart. Paint a layer of liquid latex where each wound will go, press a ply of tissue over it and let it dry. Add another layer of latex and more tissue, and repeat a few times. Finish with a layer of liquid latex and let it dry.',
    'Use tweezers to rip holes in the latex.',
    'Fill the inside of every wound with red lipstick. Dab blue and purple eyeshadow onto the ripped skin around it so it looks more damaged. For extra depth, line the inside corners of each wound with a darker eyeshadow like black or brown.',
    'Add fake blood over the whole thing and dab a little inside each wound. Don\'t overdo it.'
  ],

  // Shown below the method whenever there's makeup on the skin.
  endNote: 'At the end of the night, peel any latex away slowly and remove the rest of the makeup with wipes. I\'d also recommend a shower and a gentle cleanser, as the wipes almost certainly won\'t get it all (but they\'re a strong starting point!)',
  // Shown once under the lens in the shopping list.
  lensNotes: [
    'I\'ve ordered from here several times before - I love this place because they do prescription crazy lenses, which is incredibly rare (and I\'m blind as a bat!)',
    'Coloured lenses aren\'t great for your eyes, so use them sparingly and don\'t wear them for long. Wash your hands and dry them on kitchen roll, not a towel, before putting them in. Never wear them more than once, even if they\'re technically monthly.'
  ],
  essentials: {
    intro: 'The things I always have in the drawer for Halloween.',
    // kit keys, optionally with a different name or note for the kit; a bare name is shown as plain text
    products: [
      { key: 'palette', name: 'Big makeup palette' },
      'primer',
      'latex',
      { key: 'toiletPaper', note: 'I\'m concerned if you don\'t have this already' },
      'freshBlood',
      { key: 'redLipstick', note: 'For the inside of wounds.' },
      { key: 'paleFoundation', note: 'This is the one I use for costume makeup.' },
      'tweezers',
      'wipes',
      'brushes',
      { name: 'Any makeup you normally use' }
    ]
  },
  setting: { steps: [], products: ['wipes'] },
  wig: { steps: [[100, 'Pin your hair flat, then pull the wig on from front to back and fix it with grips.']], products: [] },
  baldCap: { steps: [[100, 'Slick your hair down under a bald cap, stick the edges down with liquid latex and blend foundation over the join.']], products: ['baldCap', 'latex', 'paleFoundation'], patch: true },

  makeup: {
    contour: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 30, steps: [], products: [] },
      {
        id: 'bruised', label: 'Bruised hollows', namePart: 'bruised', applyOrder: 30,
        steps: ['Add blue and purple eyeshadow in the hollows of your cheeks and at the corners of your mouth, blending the edges out softly.'],
        products: ['palette']
      },
      {
        id: 'darkHollows', label: 'Dark hollows', namePart: 'haunted', applyOrder: 30,
        steps: ['Blend black and deep red eyeshadow into the hollows of your cheeks and your temples, softening the edges right out.'],
        products: ['palette', 'brushes']
      },
      {
        id: 'sunken', label: 'Sunken cheeks', namePart: 'gaunt', applyOrder: 30,
        steps: ['Brush grey-brown eyeshadow under your cheekbones and into your temples, and blend until there\'s no hard line.'],
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
        id: 'bruised', label: 'Bruised', namePart: 'battered', applyOrder: 40,
        steps: ['Pat blue and purple eyeshadow under your eyes with a brush and blend the edges out softly.'],
        products: ['palette', 'sponges']
      },
      {
        id: 'redRims', label: 'Reddened eye rims', namePart: 'sleepless', applyOrder: 40,
        steps: ['Smudge red eyeshadow along your lower lashes and into the inner corners so your eyes look sore.'],
        products: ['palette']
      },
      {
        id: 'hollows', label: 'Dead hollows', namePart: 'hollow', applyOrder: 40,
        steps: ['Pat purple and grey eyeshadow under your eyes and into the inner corners, blending it down towards your cheeks.'],
        products: ['palette']
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

    // Eye makeup: one eyeshadow and one eyeliner at a time; details layer freely. The art layers it in a fixed order.
    eyes: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 70, steps: [], products: [] },
      {
        id: 'smoky', type: 'eyeshadow', label: 'Smoky black', namePart: 'smouldering', applyOrder: 70,
        steps: ['Pack black eyeshadow over your lids and smudge it out and under your lower lashes.'],
        products: ['palette', 'brushes']
      },
      {
        id: 'heavyGlam', type: 'eyeshadow', label: 'Heavy glam', namePart: 'sultry', applyOrder: 71,
        steps: ['Blend a deep brown-black shadow into your creases, draw a sharp black wing, then glue on false lashes.'],
        products: ['palette', 'blackLiner', 'lashes', 'lashGlue']
      },
      {
        id: 'redSmoky', type: 'eyeshadow', label: 'Red smoky eyes', namePart: 'feverish', applyOrder: 70,
        steps: ['Smudge deep red eyeshadow all over your lids and under your lower lashes, with a little black in the outer corners.'],
        products: ['palette', 'brushes']
      },
      {
        id: 'glamWitch', type: 'eyeshadow', label: 'Glam witch', namePart: 'bewitching', applyOrder: 71,
        steps: ['Pack deep purple eyeshadow over your lids and draw a sharp black wing.'],
        products: ['palette', 'blackLiner', 'lashes', 'lashGlue']
      },
      {
        id: 'sockets', type: 'detail', label: 'Blackened sockets', namePart: 'hollow-eyed', applyOrder: 69,
        steps: ['Blend black eyeshadow right round each eye socket, from the brow bone to the top of the cheek, softening the edges.'],
        products: ['palette', 'brushes']
      },
      {
        id: 'glitter', type: 'detail', label: 'Glitter', namePart: 'glittering', applyOrder: 70,
        steps: ['Use a primer on your lids (or foundation if you don\'t have one), then pat on a glittery eyeshadow.'],
        products: ['palette']
      },
      {
        id: 'devilBrows', type: 'detail', label: 'Devil brows', namePart: 'wicked', applyOrder: 72,
        steps: ['Draw sharp, high-arched brows with black eyeliner, flicking them up at the ends.'],
        products: ['blackLiner']
      },
      {
        id: 'redLiner', type: 'eyeliner', label: 'Blood-red liner', namePart: 'weeping', applyOrder: 72,
        steps: ['Draw a thick winged line in red, then let one drop run down from the outer corner.'],
        products: ['redLiner']
      },
      {
        id: 'spiderweb', type: 'detail', label: 'Spiderweb', namePart: 'webbed', applyOrder: 72,
        steps: ['Draw a web out from the corner of one eye onto your temple with black eyeliner - the straight lines first, then the curved ones between them.'],
        products: ['blackLiner']
      },
      {
        id: 'whiteLashes', type: 'detail', label: 'White lashes and brows', namePart: 'frosted', applyOrder: 72,
        steps: ['Sweep pink-red eyeshadow over your lids, then run white eyeliner over your lashes and brows.'],
        products: ['palette', 'whitePencil', 'whiteMascara']
      },
      {
        id: 'diamonds', type: 'detail', label: 'Clown diamonds', namePart: 'harlequin', applyOrder: 71,
        steps: ['Draw a tall diamond through each eye with eyeliner and fill it in with blue eyeshadow.'],
        products: ['blackLiner', 'palette']
      }
    ],

    // Pale base, ghostly white and bruised blue are skin bases; the art treats them as skin.
    // A full-face paint is the base layer (base: what covers the face, and its product);
    // its own steps only cover the details on top. Without one, the base is your normal foundation.
    facePaint: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 50, steps: [], products: [] },
      {
        id: 'paleBase', label: 'Pale base', namePart: 'pallid', applyOrder: 20,
        base: { cover: 'your normal foundation, skipping any bronzer', product: 'paleFoundation' },
        steps: [],
        products: ['sponges']
      },
      {
        id: 'ghostly', label: 'Ghostly white', namePart: 'spectral', applyOrder: 20,
        base: { cover: 'white face paint, thinly, right down your neck and over your ears', product: 'whitePaint' },
        steps: [],
        products: ['sponges']
      },
      {
        id: 'bruisedBlue', label: 'Bruised blue', namePart: 'drowned', applyOrder: 20,
        base: { cover: 'blue face paint, thinly, right down your neck', product: 'bluePaint' },
        steps: ['Pat a little grey-blue eyeshadow over the blue so you look cold and waterlogged.'],
        products: ['palette', 'sponges']
      },
      {
        id: 'clown', label: 'Clown', namePart: 'grinning', applyOrder: 50,
        base: { cover: 'white face paint', product: 'whitePaint' },
        steps: [
          'Draw high arched brows in black.',
          'Paint the tip of your nose red with lipstick.'
        ],
        products: ['blackLiner', 'redLipstick', 'sponges', 'brushes', 'blackLashes', 'lashGlue']
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
        base: { cover: 'white face paint', product: 'whitePaint' },
        steps: [
          'Fill big sockets round your eyes with black eyeliner and a little navy eyeshadow.',
          'Fill in your nose with eyeliner and draw a stitched smile right across your cheeks.'
        ],
        products: ['blackLiner', 'palette', 'brushes', 'sponges']
      },
      {
        id: 'pumpkin', label: 'Pumpkin', namePart: 'carved', applyOrder: 50,
        base: { cover: 'orange face paint', product: 'orangePaint' },
        steps: [
          'Shade a few curved lines down your face with a darker orange or brown eyeshadow.',
          'Fill in black triangles over your eyes and nose and a jagged grin over your mouth with black eyeliner.'
        ],
        products: ['palette', 'blackLiner', 'sponges', 'brushes']
      },
      {
        id: 'redPaint', label: 'Red face paint', namePart: 'infernal', applyOrder: 50,
        base: { cover: 'red face paint, right down your neck', product: 'redPaint' },
        steps: [],
        products: ['sponges']
      },
      {
        id: 'cracked', label: 'Cracked porcelain', namePart: 'cracked', applyOrder: 50,
        base: { cover: 'the cracked doll face paint and let it dry so it cracks', product: 'crackedPaint' },
        steps: [
          'Draw a few bigger cracks from your hairline down across one cheek with black eyeliner, with a fine line of white eyeliner beside each one.'
        ],
        products: ['sponges', 'blackLiner', 'whitePencil', 'brushes']
      }
    ],

    // Effects can be combined.
    effects: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 60, steps: [], products: [] },
      { id: 'clawRip', label: 'Claw rip', namePart: 'mauled', applyOrder: 10, patch: true, latexWound: { place: 'Claw rip: three long, thin strips running diagonally across the bridge of your nose and both cheeks, between your eyes and mouth.', open: 'Claw rip: three long parallel tears, one along each strip.' }, steps: [], products: ['latex', 'toiletPaper', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes'] },
      { id: 'cheekGash', label: 'Cheek gash', namePart: 'gashed', applyOrder: 10, patch: true, latexWound: { place: 'Cheek gash: a big rough patch on one cheek.', open: 'Cheek gash: tear it wide so the edges are really ragged.' }, steps: [], products: ['latex', 'toiletPaper', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes'] },
      { id: 'slicedCheeks', label: 'Sliced cheeks', namePart: 'sliced', applyOrder: 10, patch: true, latexWound: { place: 'Sliced cheeks: a thin strip down each cheekbone, straight down from your eyes.', open: 'Sliced cheeks: one long slit down the middle of each strip.' }, steps: [], products: ['latex', 'toiletPaper', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes'] },
      { id: 'tornCorners', label: 'Sliced mouth corners', namePart: 'slashed', applyOrder: 10, patch: true, latexWound: { place: 'Sliced mouth corners: a thin, curved strip from each corner of your mouth up towards your cheeks.', open: 'Sliced mouth corners: open each one along the curve, starting at the corner of your mouth.' }, steps: [], products: ['latex', 'toiletPaper', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes'] },
      { id: 'teethGash', label: 'Cheek gash with teeth', namePart: 'gaping', applyOrder: 10, patch: true, latexWound: { place: 'Cheek gash with teeth: a big rough patch on one cheek.', open: 'Cheek gash with teeth: tear it wide open so there\'s room for the teeth inside.', colour: 'For the teeth, draw them inside the wound with white eyeliner and outline the gaps between them with black eyeliner.' }, steps: [], products: ['latex', 'toiletPaper', 'redLipstick', 'palette', 'whitePencil', 'blackLiner', 'freshBlood'] },
      { id: 'templePeel', label: 'Temple peel', namePart: 'peeling', applyOrder: 10, patch: true, latexWound: { place: 'Temple peel: a long strip from your lower forehead down through one eye to your upper cheek, keeping clear of the eye itself.', open: 'Temple peel: start small above and below the eye and keep tearing until it opens fully round the eye.' }, steps: [], products: ['latex', 'toiletPaper', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes'] },
      { id: 'foreheadGash', label: 'Forehead gash', namePart: 'slain', applyOrder: 10, patch: true, latexWound: { place: 'Forehead gash: a long strip across your forehead.', open: 'Forehead gash: rip it open along its length.' }, steps: [], products: ['latex', 'toiletPaper', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes'] },
      // Zip face has its own method and can't be combined with other wounds.
      { id: 'zipFace', label: 'Zip face', namePart: 'unzipped', applyOrder: 61, patch: true, exclusive: true, latexBase: true, steps: [[9, 'Put liquid latex on your face, press the zip into it, then add more latex over the top. If the edges look rough, layer the thinnest possible plies of toilet paper over them so you can\'t see the hard edge of the zip, finishing with latex, and let it dry.'], [9.1, 'Colour in the skin inside the zip with red lipstick or red face paint, then cover with fake blood.']], products: ['zip', 'latex', 'toiletPaper', 'redLipstick', 'freshBlood'] },
      { id: 'bulletWound', label: 'Forehead bullet wound', namePart: 'shot', applyOrder: 10, patch: true, latexWound: { place: 'Forehead bullet wound: a small round patch in the middle of your forehead.', open: 'Forehead bullet wound: one small round hole.' }, steps: [], products: ['latex', 'toiletPaper', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes'] },
      { id: 'throatBite', label: 'Throat bite', namePart: 'bitten', applyOrder: 10, patch: true, latexWound: { place: 'Throat bite: a small patch on the side of your neck.', open: 'Throat bite: two small holes side by side like fang marks.' }, steps: [], products: ['latex', 'toiletPaper', 'tweezers', 'redLipstick', 'palette', 'freshBlood', 'brushes'] },
      {
        id: 'stitchedSmile', label: 'Stitched smile', namePart: 'stitched', applyOrder: 60,
        steps: ['Draw a line from each corner of your mouth up towards your ears, then add little black stitches across it.'],
        products: ['blackLiner', 'redLipstick', 'brushes']
      },
      {
        id: 'scar', label: 'Stitched cheek scar', namePart: 'scarred', applyOrder: 60,
        steps: ['Draw a scar down one cheek with red lipstick, blend it a little, then add black stitches across it with eyeliner.'],
        products: ['redLipstick', 'blackLiner', 'brushes']
      }
    ],

    lips: [
      { id: 'none', label: 'Natural', namePart: '', applyOrder: 80, steps: [], products: [] },
      { id: 'black', label: 'Black', namePart: 'inky', applyOrder: 80, steps: ['Press eyeshadow from the palette onto your lips with a brush.'], products: ['palette'] },
      { id: 'blood', clears: { effects: 'tornCorners' }, label: 'Blood red', namePart: 'scarlet', applyOrder: 80, steps: ['Line and fill your lips with red lipstick, blot, then add a second coat.'], withClown: ['Line and fill your lips with red lipstick, blot, then add a second coat. Over clown paint, take it out past your lips into a wide smile.'], products: ['redLipstick'] },
      { id: 'berry', label: 'Berry', namePart: 'berry-stained', applyOrder: 80, steps: ['Press eyeshadow from the palette onto your lips with a brush.'], products: ['palette'] },
      { id: 'blue', label: 'Blue-dead', namePart: 'breathless', applyOrder: 80, steps: ['Press eyeshadow from the palette onto your lips with a brush.'], products: ['palette'] },
      { id: 'stitched', label: 'Stitched', namePart: 'silenced', applyOrder: 80, steps: ['Dab foundation over your lips, then draw black stitches across them with eyeliner.'], products: ['paleFoundation', 'blackLiner'] }
    ],

    // Shown on the lips tab and combines with any lip option.
    fangs: [
      { id: 'none', label: 'No fangs', namePart: '', applyOrder: 95, steps: [], products: [] },
      {
        id: 'fangs', label: 'Fangs', namePart: 'fanged', applyOrder: 95,
        steps: ['Warm the fitting beads in hot water, press them into the fangs and onto your teeth, then hold until set.'],
        products: ['fangs']
      }
    ],

    // Blood can be combined.
    blood: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 88, steps: [], products: [] },
      {
        id: 'elegantDrips', label: 'Elegant drips', namePart: 'dripping', applyOrder: 88,
        steps: ['Dot fake blood at both corners of your mouth and let it run down in thin lines.'],
        products: ['freshBlood']
      },
      {
        id: 'messyFeed', label: 'Messy feed', namePart: 'gorged', applyOrder: 88,
        steps: ['Dab fake blood all along your bottom lip and let lots of little drips run down, some right off your chin.'],
        products: ['freshBlood', 'brushes']
      },
      {
        id: 'trickle', label: 'Single trickle', namePart: 'trickling', applyOrder: 88,
        steps: ['Dot fake blood at one corner of your mouth and let a single line run down your chin.'],
        products: ['freshBlood']
      },
      {
        id: 'bloodEyes', label: 'Blood from the eyes', namePart: 'bleeding', applyOrder: 88,
        steps: ['Dot fake blood on your lower lash line and let it run down your cheeks.'],
        products: ['freshBlood', 'brushes']
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
      id: 'sheet', label: 'Ghost', namePart: 'draped', applyOrder: 98,
      steps: ['Drape an old white sheet over your head, mark where your eyes are with a pencil, then take it off and cut two small holes.'],
      products: [{ name: 'Ghost', asin: 'B000JFM8NI' }]
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
    { id: 'cloak', label: 'Brown cloak', noun: 'wanderer', applyOrder: 110, steps: [], products: ['cloak'] },
    { id: 'redCape', label: 'Red cape', noun: 'wanderer', applyOrder: 110, steps: [], products: [] },
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
    { id: 'nightgown', label: 'Victorian nightgown', noun: 'sleepwalker', applyOrder: 110, steps: [], products: ['nightgown'] },
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
    { id: 'topHat', label: 'Top hat', applyOrder: 115, steps: [], products: ['greenTopHat'] },
    { id: 'ramHorns', label: 'Ram horns', applyOrder: 115, steps: [], products: ['ramHorns'] },
    { id: 'horns', label: 'Red horns', applyOrder: 115, steps: [], products: ['redHorns'] },
    { id: 'redHood', label: 'Red hood', applyOrder: 115, steps: [], products: [] },
    { id: 'brownHood', label: 'Brown hood', applyOrder: 115, steps: [], products: [] },
    { id: 'blackHood', label: 'Black hood', applyOrder: 115, steps: [], products: [] },
    { id: 'nurseCap', label: 'Nurse cap', applyOrder: 115, steps: [], products: [] },
    { id: 'veil', label: 'Veil and wilted crown', applyOrder: 115, steps: ['Pin the veil in at the crown.'], products: ['veil'] },
    { id: 'bow', label: 'Big hair bow', applyOrder: 115, steps: [], products: ['bow'] },
    { id: 'stalk', label: 'Pumpkin headband', applyOrder: 115, steps: [], products: ['pumpkinHeadband'] }
  ],

  accessories: [
    { id: 'none', label: 'None', applyOrder: 120, steps: [], products: [] },
    { id: 'choker', label: 'Black choker', applyOrder: 120, steps: [], products: [{ name: 'Black velvet choker', q: 'black velvet choker' }] },
    { id: 'tulleRuff', label: 'Red and black ruff', applyOrder: 120, steps: [], products: [] },
    { id: 'whiteRuff', label: 'White ruff', applyOrder: 120, steps: [], products: [] },
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
    greenTopHat: { name: 'Green top hat', asin: 'B00JAB0UBO', note: 'The olive green is divine, and it\'s a proper hat rather than a costume replica, but it depends whether you think you\'ll wear this on a regular night out or not.', alts: [{ label: 'a cheaper option', asin: 'B0BZW6JQV3' }] },
    clock: { name: 'Inflatable clock', asin: 'B06XGTXTS3', note: 'I got this for my Alice in Wonderland party.' },
    flamingo: { name: 'Inflatable flamingo', asin: 'B001ASG90G' },
    hedgehog: { name: 'Soft toy hedgehog', asin: 'B00U1GS7TY' },
    ramHorns: { name: 'Realistic ram horns', asin: 'B0C89V8FTY' },
    redHorns: { name: 'Red horns headband', asin: 'B0CBLTTRXQ' }
  },

  // Presets have versions; each version is tagged scary, sexy or glam.
  // set lists everything that differs from the neutral default. byFeatures adds to set for each features setting.
  // name, if given, replaces the generated look name for that version.
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
          set: { facePaint: 'paleBase', underEyes: 'redRims', fangs: 'fangs', blood: ['elegantDrips'], clothing: 'tuxedo', hairStyle: 'slick', hairColour: 'black' }, products: ['ruffle', 'lashes', 'lashGlue'],
          byFeatures: {
            masculine: { lips: 'none', eyes: [] },
            feminine: { lips: 'blood', eyes: ['heavyGlam'] },
            androgynous: { lips: 'berry', eyes: ['smoky'] }
          }
        },
        {
          id: 'messyFeed', label: 'Messy feed', tag: 'scary',
          set: { facePaint: 'paleBase', fangs: 'fangs', blood: ['messyFeed'], effects: ['throatBite'], clothing: 'shirtTie', hairStyle: 'slick', hairColour: 'black' }
        },
        {
          id: 'velvet', label: 'Velvet vampire', tag: 'sexy',
          set: { facePaint: 'paleBase', clothing: 'velvetCorset', lips: 'berry', eyes: ['redSmoky'], effects: ['throatBite'], hairStyle: 'long', hairColour: 'black' }
        }
      ]
    },
    {
      id: 'hag', label: 'Hag',
      nouns: { feminine: 'hag', masculine: 'warlock', androgynous: 'witch' },
      versions: [
        {
          id: 'hagMask', label: 'Hag mask', tag: 'scary',
          set: { mask: 'hag', hairStyle: 'longCentre', hairColour: 'white', clothing: 'cloak', headwear: 'brownHood', accessory: 'lantern' },
          products: ['gloves', 'creepyCloth'],
          steps: [[110, 'Layer the creepy cloth round your shoulders like a shawl, over the cloak.']]
        }
      ]
    },
    {
      id: 'zombie', label: 'Zombie',
      nouns: { feminine: 'zombie', masculine: 'zombie', androgynous: 'revenant' },
      versions: [
        { id: 'oneEyed', label: 'One-eyed', tag: 'scary', wardrobe: ['You can wear literally anything with this, but if you want to go all-out you can snip holes in an old jumper, pull a few stitches loose and rub in brown eyeshadow for dirt.'], set: { facePaint: 'paleBase', lenses: 'whiteoutOne', effects: ['templePeel', 'cheekGash'], contour: 'bruised', underEyes: 'bruised', clothing: 'tornJumper' } },
        { id: 'mauled', label: 'Mauled', tag: 'scary', steps: [[200, 'Pair with a red hood for that classic I\'ve-just-been-killed-by-a-wolf fairytale look.']], wardrobe: ['You can wear literally anything with this, but if you want to go all-out you can snip holes in an old jumper, pull a few stitches loose and rub in brown eyeshadow for dirt.'], set: { facePaint: 'paleBase', effects: ['clawRip'], contour: 'bruised', underEyes: 'bruised', clothing: 'redCape', headwear: 'redHood' } },
        { id: 'unzipped', label: 'Unzipped', tag: 'scary', steps: [[200, 'Grab an old white T-shirt and cover the entire neckline with fake blood, letting it drip down.']], wardrobe: ['You can wear literally anything with this, but if you want to go all-out you can snip holes in an old jumper, pull a few stitches loose and rub in brown eyeshadow for dirt.'], set: { facePaint: 'paleBase', effects: ['zipFace'], clothing: 'bloodTee' } },
        {
          id: 'nurse', label: 'Zombie nurse', tag: 'sexy',
          steps: [[200, 'Pair with a sexy zombie nurse costume to look 10/10 hot.']],
          wardrobe: ['Literally anything - regular clothes, the more dishevelled the better.'],
          nouns: { feminine: 'nurse', masculine: 'nurse', androgynous: 'nurse' },
          set: { facePaint: 'paleBase', lenses: 'whiteout', effects: ['tornCorners'], contour: 'bruised', underEyes: 'bruised', clothing: 'nurseDress', headwear: 'nurseCap', hairStyle: 'bob' }
        }
      ]
    },
    {
      id: 'clown', label: 'Scary clown',
      nouns: { feminine: 'clown', masculine: 'clown', androgynous: 'clown' },
      products: [{ byFeatures: { feminine: 'harlequin', masculine: 'clownCostume', androgynous: 'harlequinOrClown' } }],
      versions: [
        {
          id: 'tornCheeks', label: 'Sliced cheeks', tag: 'scary',
          set: { facePaint: 'clown', eyes: [], underEyes: 'bruised', effects: ['slicedCheeks'], lips: 'blood', clothing: 'harlequin', accessory: 'tulleRuff', hairStyle: 'bunches', hairColour: 'black' }, products: ['blackLashes', 'lashGlue']
        },
        {
          id: 'bloodTears', label: 'Blood tears', tag: 'scary',
          set: { facePaint: 'clown', underEyes: 'bruised', blood: ['bloodEyes'], effects: ['tornCorners'], clothing: 'harlequin', accessory: 'tulleRuff', hairStyle: 'ponytail', hairColour: 'black' }, products: ['blackLashes', 'lashGlue']
        },
        {
          id: 'glam', label: 'Glam clown', tag: 'glam',
          set: { facePaint: 'clown', eyes: ['diamonds'], lips: 'blood', clothing: 'harlequin', accessory: 'whiteRuff', wig: 'red' }, products: ['blackLashes', 'lashGlue']
        }
      ]
    },
    {
      id: 'bride', label: 'Corpse bride',
      nouns: { feminine: 'bride', masculine: 'groom', androgynous: 'betrothed' },
      wardrobe: ['An old white or cream dress.'],
      versions: [
        {
          id: 'dead', label: 'Blue bride', tag: 'scary', name: 'The blue bride',
          set: { facePaint: 'bruisedBlue', effects: ['teethGash'], contour: 'bruised', underEyes: 'hollows', lips: 'blue', clothing: 'bride', headwear: 'veil', hairStyle: 'long', hairColour: 'auburn' }
        },
        {
          id: 'faded', label: 'Faded bride', tag: 'glam',
          set: { facePaint: 'paleBase', eyes: ['smoky'], clothing: 'bride', headwear: 'veil', hairStyle: 'bun', hairColour: 'auburn' }, products: ['lashes', 'lashGlue']
        }
      ]
    },
    {
      id: 'skeleton', label: 'Skeleton',
      nouns: { feminine: 'skeleton', masculine: 'skeleton', androgynous: 'skeleton' },
      versions: [
        { id: 'skullFace', label: 'Skull face', tag: 'scary', set: { facePaint: 'skeletonFull', clothing: 'blazer', hairStyle: 'slick', hairColour: 'black' } },
        { id: 'mask', label: 'Skeleton mask', tag: 'scary', set: { mask: 'skeleton', clothing: 'hoodie', headwear: 'blackHood', hairColour: 'black' } }
      ]
    },
    {
      id: 'doll', label: 'Cursed doll',
      nouns: { feminine: 'doll', masculine: 'puppet', androgynous: 'marionette' },
      wardrobe: ['A cutesy dress you already have.'],
      versions: [
        {
          id: 'cracked', label: 'Cracked doll', tag: 'scary',
          set: { facePaint: 'cracked', contour: 'dollBlush', underEyes: 'hollows', clothing: 'doll', headwear: 'bow', accessory: 'key', hairStyle: 'bunches', hairColour: 'blonde' }, products: ['blackLashes', 'lashGlue']
        },
        {
          id: 'porcelain', label: 'Porcelain doll', tag: 'glam',
          set: { facePaint: 'paleBase', contour: 'dollBlush', lips: 'blood', clothing: 'doll', headwear: 'bow', accessory: 'key', hairStyle: 'bunches', hairColour: 'blonde' }, products: ['blackLashes', 'lashGlue']
        }
      ]
    },
    {
      id: 'ghost', label: 'Ghost',
      nouns: { feminine: 'widow', masculine: 'widower', androgynous: 'spectre' },
      versions: [
        { id: 'sheet', label: 'Ghost', tag: 'scary', nouns: { feminine: 'spook', masculine: 'spook', androgynous: 'spook' }, set: { mask: 'sheet' } },
        {
          id: 'victorian', label: 'Victorian ghost', tag: 'scary',
          set: { contour: 'bruised', underEyes: 'bruised', lenses: 'whiteout', clothing: 'nightgown', accessory: 'candlestick', hairStyle: 'bun', hairColour: 'silver' },
          products: ['nightgown']
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
          set: { facePaint: 'paleBase', clothing: 'redDress', effects: ['bulletWound'], blood: ['bloodEyes', 'elegantDrips'], lenses: 'whiteout', hairStyle: 'bun', hairColour: 'black' }
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
          set: { eyes: ['glamWitch'], lips: 'blood', clothing: 'tulleGown', headwear: 'veilHat', accessory: 'webCape', hairStyle: 'long', hairColour: 'black' }, products: ['lashes', 'lashGlue']
        },
        { id: 'web', label: 'Web witch', tag: 'sexy', set: { eyes: ['spiderweb'], lips: 'blood', clothing: 'laceTop', headwear: 'veilHat', accessory: 'webCape', hairStyle: 'witch', hairColour: 'black' } },
        { id: 'velvet', label: 'Velvet witch', tag: 'glam', set: { eyes: ['redSmoky'], lips: 'berry', clothing: 'velvetTop', headwear: 'veilHat', accessory: 'webCape', hairStyle: 'bob', hairColour: 'black' }, details: ['falseLashes'], steps: [[55, 'Glue on black false lashes.']], products: ['blackLashes', 'lashGlue'] }
      ]
    },
    {
      id: 'hatter', label: 'Mad Hatter',
      nouns: { feminine: 'hatter', masculine: 'hatter', androgynous: 'hatter' },
      wardrobe: ['A white ruffled shirt or blouse and a burgundy or patterned jacket.'],
      versions: [
        {
          id: 'hatter', label: 'Hatter', tag: 'glam',
          set: { wig: 'silver', headwear: 'topHat', lenses: 'galaxy', eyes: ['whiteLashes'], lips: 'blood', clothing: 'hatterJacket' },
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
          set: { contour: 'darkHollows', eyes: ['redSmoky', 'sockets', 'devilBrows'], lips: 'black', lenses: 'blackout', headwear: 'ramHorns', clothing: 'highCollar', hairStyle: 'slick', hairColour: 'black' }
        },
        {
          id: 'sexy', label: 'Sexy devil', tag: 'sexy',
          set: { eyes: ['heavyGlam'], lips: 'blood', headwear: 'horns', clothing: 'redDress', hairStyle: 'long', hairColour: 'black' }
        },
        {
          id: 'comic', label: 'Campy devil', tag: 'glam',
          set: { facePaint: 'redPaint', eyes: ['heavyGlam', 'glitter', 'devilBrows'], headwear: 'horns', clothing: 'highCollar', hairStyle: 'slick', hairColour: 'black' }
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
    ['facePaint:skull', 'eyes:diamonds'],
    ['facePaint:skeletonFull', 'eyes:diamonds'],
    ['lenses:blackout', 'underEyes:sockets'],
    ['effects:clawRip', 'effects:cheekGash']
  ],

  defaults: {
    shape: 'oval', features: 'androgynous', skinTone: 'peach', hairStyle: 'crop', hairColour: 'darkBrown',
    wig: 'none', contour: 'none', underEyes: 'none', lenses: 'none', eyes: [], facePaint: 'none', effects: [], lips: 'none', fangs: 'none', blood: [],
    mask: 'none', clothing: 'plain', headwear: 'none', accessory: 'none', preset: null, version: null
  },

  nameFallbacks: { first: 'perfectly', second: 'ordinary', solo: 'restless' }
};
