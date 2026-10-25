/* Halloween costume - options, presets, method steps and products.
   Steps are either a string (uses the item's applyOrder) or [order, string].
   Order: 10 prep and safety, 20 base, 30 contour, 40 under-eyes, 50 face paint,
   60 effects, 70 eye makeup, 80 lips, 86-88 setting and blood, 90 lenses,
   95 fangs, 100 wig, 105 mask, 110 costume, 115 headwear, 120 props, 130 removal.
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
    latex: { name: 'Liquid latex', q: 'liquid latex sfx makeup' },
    tissue: { name: 'Tissue paper', q: 'single ply white tissue paper' },
    scabBlood: { name: 'Scab blood', q: 'scab blood sfx makeup' },
    freshBlood: { name: 'Fresh fake blood (mouth-safe)', q: 'mouth safe fake blood' },
    paleFoundation: { name: 'Foundation a shade or two paler than you', q: 'pale foundation fair' },
    whitePaint: { name: 'White face paint', q: 'white face paint' },
    blackPaint: { name: 'Black face paint', q: 'black face paint' },
    palette: { name: 'Eyeshadow palette with reds, purples, blues and black', q: 'eyeshadow palette red purple blue black' },
    redLipstick: { name: 'Red lipstick', q: 'red lipstick long lasting' },
    berryLipstick: { name: 'Berry lipstick', q: 'berry lipstick dark' },
    blackLipstick: { name: 'Black lipstick', q: 'black lipstick matte' },
    pinkLipstick: { name: 'Bright pink lipstick', q: 'bright pink lipstick' },
    blackLiner: { name: 'Black eyeliner', q: 'black liquid eyeliner' },
    redLiner: { name: 'Red liquid eyeliner', q: 'red liquid eyeliner' },
    whitePencil: { name: 'White eyeliner pencil', q: 'white eyeliner pencil' },
    whiteMascara: { name: 'White mascara', q: 'white mascara' },
    glitter: { name: 'Cosmetic glitter and glitter glue', q: 'cosmetic glitter with glitter glue' },
    colourPaints: { name: 'Bright face paint palette', q: 'face paint palette bright colours' },
    orangePaint: { name: 'Orange face paint', q: 'orange face paint' },
    redPaint: { name: 'Dark red face paint', q: 'dark red face paint' },
    powder: { name: 'Setting powder', q: 'translucent setting powder' },
    sponges: { name: 'Makeup sponges', q: 'makeup sponges' },
    brushes: { name: 'Fine face paint brushes', q: 'fine face paint brushes' },
    spiritGum: { name: 'Spirit gum and remover', q: 'spirit gum and remover' },
    modellingWax: { name: 'Modelling wax', q: 'modelling wax sfx' },
    witchNose: { name: 'Crooked witch nose prosthetic', q: 'witch nose prosthetic latex' },
    fangs: { name: 'Custom-fit vampire fangs', q: 'vampire fangs custom fit' },
    zip: { name: 'Metal zip, about 20cm', q: 'metal zip 20cm' },
    wigCap: { name: 'Wig cap', q: 'wig cap' },
    baldCap: { name: 'Latex bald cap', q: 'latex bald cap' },
    lensCase: { name: 'Contact lens solution and case', q: 'contact lens solution with case' }
  },

  // Each of these appears once at most.
  prep: { steps: [[10, 'Start with clean, moisturised skin so everything goes on smoothly.']], products: [] },
  patchTest: { steps: [[10, 'Patch-test latex and spirit gum on your inner arm the day before, and skip them if you\'re allergic.']], products: [] },
  lensSafety: { steps: [[90, 'Only buy lenses from a UK seller supervised by an optician, and put them in with clean hands once your makeup\'s done.']], products: ['lensCase'] },
  setting: {
    steps: [
      [86, 'Dust setting powder over everything so it lasts the night.'],
      [130, 'At the end of the night, take it all off with a cleansing balm and peel any latex away slowly.']
    ],
    products: ['powder']
  },
  wig: { steps: [[100, 'Pin your hair flat under a wig cap, then pull the wig on from front to back and fix it with grips.']], products: ['wigCap'] },
  baldCap: { steps: [[100, 'Slick your hair down under a bald cap, glue the edges with spirit gum and blend foundation over the join.']], products: ['baldCap', 'spiritGum', 'paleFoundation'], patch: true },

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
        steps: ['Sponge on a pale foundation, then pat blue and purple eyeshadow over it so you look cold and waterlogged.'],
        products: ['paleFoundation', 'palette', 'sponges']
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
        steps: ['Paint a big circle of black face paint around each eye, from brow to cheekbone, and soften the edge with grey eyeshadow.'],
        products: ['blackPaint', 'palette']
      }
    ],

    lenses: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 90, steps: [], products: [] },
      { id: 'whiteout', label: 'Whiteout', namePart: 'blind', applyOrder: 90, steps: [], products: [{ name: 'Whiteout contact lenses', q: 'white out halloween contact lenses' }] },
      { id: 'whiteoutOne', label: 'Whiteout, one eye', namePart: 'one-eyed', applyOrder: 90, steps: [], products: [{ name: 'Whiteout contact lenses', q: 'white out halloween contact lenses' }] },
      { id: 'blackout', label: 'Blackout', namePart: 'soulless', applyOrder: 90, steps: [], products: [{ name: 'Blackout contact lenses', q: 'blackout halloween contact lenses' }] },
      { id: 'red', label: 'Red', namePart: 'bloodthirsty', applyOrder: 90, steps: [], products: [{ name: 'Red contact lenses', q: 'red vampire contact lenses' }] },
      { id: 'cat', label: 'Cat-eye yellow', namePart: 'feline', applyOrder: 90, steps: [], products: [{ name: 'Yellow cat-eye contact lenses', q: 'yellow cat eye contact lenses' }] },
      { id: 'swirl', label: 'Swirl', namePart: 'spellbound', applyOrder: 90, steps: [], products: [{ name: 'Swirl contact lenses', q: 'swirl hypnotic contact lenses' }] },
      { id: 'iceMesh', label: 'Ice blue mesh', namePart: 'frozen', applyOrder: 90, steps: [], products: [{ name: 'Ice blue mesh contact lenses', q: 'ice blue mesh contact lenses' }] }
    ],

    eyes: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 70, steps: [], products: [] },
      {
        id: 'smoky', label: 'Smoky black', namePart: 'smouldering', applyOrder: 70,
        steps: ['Pack black eyeshadow over your lids and smudge it out and under your lower lashes.'],
        products: ['palette', 'blackLiner']
      },
      {
        id: 'softSmoky', label: 'Soft smoky', namePart: 'hazy', applyOrder: 70,
        steps: ['Sweep charcoal and plum eyeshadow over your lids and blend the edges out softly.'],
        products: ['palette']
      },
      {
        id: 'redPink', label: 'Smudged red-pink', namePart: 'feverish', applyOrder: 70,
        steps: ['Smudge red and pink eyeshadow all round your eyes and blend it out messily.'],
        products: ['palette']
      },
      {
        id: 'berry', label: 'Smudged berry', namePart: 'sultry', applyOrder: 70,
        steps: ['Smudge berry and plum eyeshadow round your eyes, keeping the edges soft.'],
        products: ['palette']
      },
      {
        id: 'redLiner', label: 'Blood-red liner', namePart: 'weeping', applyOrder: 70,
        steps: ['Draw a thick winged line in red, then let one drop run down from the outer corner.'],
        products: ['redLiner']
      },
      {
        id: 'glitter', label: 'Glitter', namePart: 'glittering', applyOrder: 70,
        steps: ['Dab glitter glue on your lids and press loose glitter on top.'],
        products: ['glitter']
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
        products: ['palette', 'whiteMascara']
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
        products: ['whitePaint', 'powder', 'blackLiner', 'redLipstick', 'sponges']
      },
      {
        id: 'clownPink', label: 'Clown, pink nose', namePart: 'giggling', applyOrder: 50,
        steps: [
          'Cover your face in white face paint and set it with powder.',
          'Draw high arched brows in black, then paint on a pink nose and a wide red smile.'
        ],
        products: ['whitePaint', 'powder', 'blackLiner', 'pinkLipstick', 'redLipstick', 'sponges']
      },
      {
        id: 'skull', label: 'Skull, half face', namePart: 'skeletal', applyOrder: 50,
        steps: [
          'Paint half your face white, then fill the eye socket, nostril and cheek hollow on that side with black.',
          'Draw teeth over your lips with eyeliner.'
        ],
        products: ['whitePaint', 'blackPaint', 'blackLiner', 'brushes']
      },
      {
        id: 'skeletonFull', label: 'Full skeleton', namePart: 'bony', applyOrder: 50,
        steps: [
          'Paint your whole face white, then fill big sockets round your eyes with black and a little navy.',
          'Paint your nose black and draw a stitched smile right across your cheeks.'
        ],
        products: ['whitePaint', 'blackPaint', 'palette', 'blackLiner', 'brushes']
      },
      {
        id: 'sugarSkull', label: 'Sugar skull', namePart: 'marigold', applyOrder: 50,
        steps: [
          'Paint your face white, ring each eye with a colourful flower and paint a black heart on your nose.',
          'Finish with stitched teeth across your mouth and dots on your chin.'
        ],
        products: ['whitePaint', 'colourPaints', 'brushes']
      },
      {
        id: 'pumpkin', label: 'Pumpkin', namePart: 'carved', applyOrder: 50,
        steps: [
          'Sponge orange face paint all over, with darker orange lines curving down your face.',
          'Paint black triangles over your eyes and nose and a jagged grin over your mouth.'
        ],
        products: ['orangePaint', 'blackPaint', 'sponges', 'brushes']
      },
      {
        id: 'glamWitch', label: 'Glam witch', namePart: 'bewitching', applyOrder: 50,
        steps: [
          'Pack deep purple eyeshadow over your lids and draw a sharp black wing.',
          'Finish with a bold red lip.'
        ],
        products: ['palette', 'blackLiner', 'redLipstick']
      },
      {
        id: 'devil', label: 'Scary devil', namePart: 'infernal', applyOrder: 50,
        steps: [
          'Sponge dark red face paint all over, then shade your cheek hollows, temples and eye sockets with black.',
          'Paint your lips black.'
        ],
        products: ['redPaint', 'blackPaint', 'blackLipstick', 'sponges']
      }
    ],

    // Effects can be combined.
    effects: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 60, steps: [], products: [] },
      {
        id: 'clawRip', label: 'Claw rip', namePart: 'mauled', applyOrder: 60, patch: true,
        steps: ['Paint three diagonal strips of liquid latex across your face, pressing tissue between the layers. Once dry, tear each one open and fill with red lipstick and fake blood.'],
        products: ['latex', 'tissue', 'redLipstick', 'scabBlood', 'freshBlood']
      },
      {
        id: 'tornCheeks', label: 'Torn cheeks', namePart: 'torn', applyOrder: 60, patch: true,
        steps: ['Paint a few layers of liquid latex on each cheek, pressing tissue between layers. Once dry, tear it open and fill the gap with red lipstick and fake blood.'],
        products: ['latex', 'tissue', 'redLipstick', 'scabBlood', 'freshBlood']
      },
      {
        id: 'tornCorners', label: 'Torn mouth corners', namePart: 'ragged', applyOrder: 60, patch: true,
        steps: ['Build up latex and tissue at the corners of your mouth, then tear it outwards once dry and fill with red lipstick and fake blood.'],
        products: ['latex', 'tissue', 'redLipstick', 'freshBlood']
      },
      {
        id: 'templePeel', label: 'Temple peel', namePart: 'peeling', applyOrder: 60, patch: true,
        steps: ['Layer latex and tissue from your temple round the outside of one eye. Tear it open, peel the edges back and fill with red lipstick and scab blood.'],
        products: ['latex', 'tissue', 'redLipstick', 'scabBlood']
      },
      {
        id: 'foreheadGash', label: 'Forehead gash', namePart: 'slain', applyOrder: 60, patch: true,
        steps: ['Paint a strip of latex and tissue across your forehead, tear it open once dry and fill with scab blood, letting a little run down.'],
        products: ['latex', 'tissue', 'scabBlood', 'freshBlood']
      },
      {
        id: 'throatBite', label: 'Throat bite', namePart: 'bitten', applyOrder: 60, patch: true,
        steps: ['Dab a small patch of latex on the side of your neck, poke two holes in it and fill them with scab blood. Smudge purple eyeshadow round it.'],
        products: ['latex', 'scabBlood', 'palette']
      },
      {
        id: 'bloodTears', label: 'Blood tears', namePart: 'bleeding', applyOrder: 60,
        steps: ['Dot fake blood on your lower lash line and let it run down your cheeks.'],
        products: ['freshBlood']
      },
      {
        id: 'zipFace', label: 'Zip face', namePart: 'unzipped', applyOrder: 60, patch: true,
        steps: ['Stick a zip down one side of your face with latex, then cover the edges with tissue and more latex. Paint the gap red and fill it with scab blood.'],
        products: ['zip', 'latex', 'tissue', 'redLipstick', 'scabBlood']
      },
      {
        id: 'stitchedSmile', label: 'Stitched smile', namePart: 'stitched', applyOrder: 60,
        steps: ['Draw a line from each corner of your mouth up towards your ears, then add little black stitches across it.'],
        products: ['blackLiner', 'redLipstick']
      },
      {
        id: 'scar', label: 'Stitched cheek scar', namePart: 'scarred', applyOrder: 60,
        steps: ['Draw a scar down one cheek with red lipstick, blend it a little, then add black stitches across it with eyeliner.'],
        products: ['redLipstick', 'blackLiner']
      },
      {
        id: 'cracked', label: 'Cracked porcelain', namePart: 'cracked', applyOrder: 60,
        steps: [
          'Sponge on a pale foundation and dab on round pink cheeks.',
          'Draw thin branching cracks with black eyeliner, with a fine white line next to each one.'
        ],
        products: ['paleFoundation', 'sponges', 'blackLiner', 'whitePencil']
      },
      {
        id: 'veins', label: 'Veins', namePart: 'veined', applyOrder: 60,
        steps: ['Draw thin branching lines in purple and blue eyeshadow with a fine brush, starting at your temples and under your eyes.'],
        products: ['palette', 'brushes']
      }
    ],

    lips: [
      { id: 'none', label: 'Natural', namePart: '', applyOrder: 80, steps: [], products: [] },
      { id: 'black', label: 'Black', namePart: 'inky', applyOrder: 80, steps: ['Line and fill your lips with black lipstick.'], products: ['blackLipstick'] },
      { id: 'blood', label: 'Blood red', namePart: 'scarlet', applyOrder: 80, steps: ['Line and fill your lips with red lipstick, blot, then add a second coat.'], products: ['redLipstick'] },
      { id: 'berry', label: 'Berry', namePart: 'berry-stained', applyOrder: 80, steps: ['Press berry lipstick into your lips with a fingertip for a soft stain.'], products: ['berryLipstick'] },
      { id: 'blue', label: 'Blue-dead', namePart: 'breathless', applyOrder: 80, steps: ['Dab foundation over your lips, then press blue eyeshadow on top.'], products: ['paleFoundation', 'palette'] },
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
      },
      {
        id: 'wart', label: 'Wart', namePart: 'warty', applyOrder: 60, patch: true,
        steps: ['Roll a pea of modelling wax, stick it on with spirit gum and smooth the edges flat.'],
        products: ['modellingWax', 'spiritGum']
      },
      {
        id: 'nose', label: 'Crooked nose', namePart: 'crooked', applyOrder: 60, patch: true,
        steps: ['Stick the nose on with spirit gum and blend the edges with a little latex and foundation.'],
        products: ['witchNose', 'spiritGum', 'latex']
      }
    ]
  },

  masks: [
    { id: 'none', label: 'None', namePart: '', applyOrder: 105, steps: [], products: [] },
    {
      id: 'hag', label: 'Hag mask', namePart: 'gnarled', applyOrder: 105,
      steps: ['Pull the mask on and line up the eye holes before your wig and hood go on.'],
      products: [{ name: 'Hag mask', asin: 'B0H2GVKBQG' }]
    },
    {
      id: 'sheet', label: 'Sheet ghost', namePart: 'draped', applyOrder: 105,
      steps: ['Drape an old white sheet over your head, mark where your eyes are with a pencil, then take it off and cut two small holes.'],
      products: [{ name: 'White flat sheet', q: 'white flat sheet single' }]
    },
    {
      id: 'skeleton', label: 'Skeleton mask', namePart: 'grinning', applyOrder: 105,
      steps: ['Put the mask on first so the strap sits under your hair or hood.'],
      products: [{ name: 'Skeleton mask', q: 'skeleton face mask halloween' }]
    }
  ],

  clothing: [
    { id: 'plain', label: 'Plain dark top', noun: '', applyOrder: 110, steps: [], products: [] },
    { id: 'tuxedo', label: 'Tuxedo and bow tie', noun: 'aristocrat', applyOrder: 110, steps: [], products: [{ name: 'Black tuxedo jacket', q: 'black tuxedo jacket' }, { name: 'White dress shirt', q: 'white dress shirt' }, { name: 'Black bow tie', q: 'black bow tie' }] },
    { id: 'shirtTie', label: 'White shirt and tie', noun: 'clerk', applyOrder: 110, steps: [], products: [{ name: 'White dress shirt', q: 'white dress shirt' }, { name: 'Black skinny tie', q: 'black skinny tie' }] },
    {
      id: 'vampire', label: 'High-collared cape', noun: 'aristocrat', applyOrder: 110,
      steps: ['Pin the cape collar to your shoulders so it stands up and frames your face.'],
      products: [{ name: 'High-collar vampire cape', q: 'high collar vampire cape red lining' }, { name: 'Burgundy brocade waistcoat', q: 'burgundy brocade waistcoat' }, { name: 'White ruffled cravat', q: 'white ruffled cravat jabot' }]
    },
    { id: 'velvetCorset', label: 'Velvet corset and capelet', noun: 'temptress', applyOrder: 110, steps: [], products: [{ name: 'Red velvet corset top', q: 'red velvet corset top' }, { name: 'Black lace capelet', q: 'black lace capelet' }, { name: 'Black velvet choker', q: 'black velvet choker' }] },
    { id: 'cloak', label: 'Brown hooded cloak', noun: 'wanderer', applyOrder: 110, steps: [], products: [{ name: 'Brown hooded cloak', q: 'brown hooded cloak' }] },
    { id: 'redCape', label: 'Red hooded cape', noun: 'wanderer', applyOrder: 110, steps: [], products: [{ name: 'Red hooded cape', q: 'red hooded cape' }] },
    {
      id: 'shawl', label: 'Tattered shawl', noun: 'crone', applyOrder: 110,
      steps: ['Snip the shawl hem into uneven points and pull a few stitches loose.'],
      products: [{ name: 'Knitted shawl in moss green', q: 'knitted shawl green grey' }, { name: 'Long black dress', q: 'long black witch dress' }]
    },
    {
      id: 'zombie', label: 'Torn shirt', noun: 'shambler', applyOrder: 110,
      steps: ['Rip an old shirt at the seams, rub in brown eyeshadow and splash a little fake blood round the collar.'],
      products: [{ name: 'Off-white button-up shirt', q: 'off white cotton shirt' }, 'freshBlood', 'palette']
    },
    {
      id: 'tornJumper', label: 'Torn jumper', noun: 'shambler', applyOrder: 110,
      steps: ['Snip holes in an old jumper, pull a few stitches loose and rub in brown eyeshadow for dirt.'],
      products: [{ name: 'Grey knitted jumper', q: 'grey knitted jumper' }, 'palette']
    },
    {
      id: 'bloodTee', label: 'Bloodied T-shirt', noun: 'shambler', applyOrder: 110,
      steps: ['Flick fake blood over a white T-shirt with an old toothbrush and let it dry before you put it on.'],
      products: [{ name: 'White T-shirt', q: 'plain white t-shirt' }, 'freshBlood']
    },
    { id: 'vestTop', label: 'Black vest top', noun: 'shambler', applyOrder: 110, steps: [], products: [{ name: 'Black vest top', q: 'black vest top' }] },
    {
      id: 'nurseDress', label: 'Torn nurse dress', noun: 'nurse', applyOrder: 110,
      steps: ['Rip the hem and sleeves of the nurse dress and splatter it with fake blood.'],
      products: [{ name: 'White nurse dress', q: 'white nurse dress costume' }, 'freshBlood']
    },
    { id: 'clown', label: 'Ruff and stripes', noun: 'jester', applyOrder: 110, steps: [], products: [{ name: 'Red and white striped top', q: 'red white striped long sleeve top' }, { name: 'Pleated ruff collar', q: 'clown ruff collar white' }] },
    { id: 'harlequin', label: 'Harlequin satin top', noun: 'jester', applyOrder: 110, steps: [], products: [{ name: 'Red and black harlequin top', q: 'red black harlequin top' }] },
    {
      id: 'bride', label: 'Ragged lace bodice', noun: 'bride', applyOrder: 110,
      steps: ['Tear the lace edges and rub grey eyeshadow into the folds so it looks grave-worn.'],
      products: [{ name: 'Ivory lace corset top', q: 'ivory lace corset top' }]
    },
    { id: 'hoodie', label: 'Bone-print hoodie', noun: 'skeleton', applyOrder: 110, steps: [], products: [{ name: 'Skeleton print hoodie', q: 'skeleton print hoodie black' }] },
    { id: 'blazer', label: 'Blazer and feathers', noun: 'dandy', applyOrder: 110, steps: [], products: [{ name: 'Black blazer', q: 'black blazer' }, { name: 'Black and white striped shirt', q: 'black white vertical striped shirt' }, { name: 'Black feather shoulder piece', q: 'black feather epaulette shoulder' }] },
    { id: 'doll', label: 'Doll dress', noun: 'doll', applyOrder: 110, steps: [], products: [{ name: 'Pink puff sleeve dress', q: 'pink puff sleeve dress' }, { name: 'White lace Peter Pan collar', q: 'detachable lace peter pan collar' }] },
    {
      id: 'mourning', label: 'Mourning gown', noun: 'mourner', applyOrder: 110,
      steps: ['Brush white powder over the shoulders and folds so the fabric looks faded and dusty.'],
      products: [{ name: 'Victorian high-neck black dress', q: 'victorian high neck black dress' }]
    },
    {
      id: 'pumpkin', label: 'Pumpkin top', noun: 'pumpkin', applyOrder: 110,
      steps: ['Cut leaf shapes from green felt and stitch them round the neckline.'],
      products: [{ name: 'Orange long-sleeve top', q: 'orange long sleeve top' }, { name: 'Green felt sheets', q: 'green felt sheets' }]
    },
    { id: 'redDress', label: 'Red dress', noun: 'socialite', applyOrder: 110, steps: [], products: [{ name: 'Red satin dress', q: 'red satin dress' }] },
    { id: 'tulleGown', label: 'Purple tulle gown', noun: 'enchantress', applyOrder: 110, steps: [], products: [{ name: 'Purple tulle gown', q: 'purple tulle gown' }] },
    { id: 'laceTop', label: 'Black lace top', noun: 'enchantress', applyOrder: 110, steps: [], products: [{ name: 'Black lace top', q: 'black lace top long sleeve' }] },
    { id: 'velvetTop', label: 'Black velvet top', noun: 'enchantress', applyOrder: 110, steps: [], products: [{ name: 'Black velvet top', q: 'black velvet top' }, { name: 'Black velvet choker', q: 'black velvet choker' }] },
    { id: 'hatterJacket', label: 'Burgundy jacket and jabot', noun: 'eccentric', applyOrder: 110, steps: [], products: [{ name: 'Burgundy velvet jacket', q: 'burgundy velvet jacket' }, { name: 'White ruffled jabot with bow', q: 'white ruffled jabot' }] },
    { id: 'highCollar', label: 'High-collared black top', noun: 'fiend', applyOrder: 110, steps: [], products: [{ name: 'Black high-collared top', q: 'black high collar gothic top' }] }
  ],

  headwear: [
    { id: 'none', label: 'None', applyOrder: 115, steps: [], products: [] },
    {
      id: 'witchHat', label: 'Crooked witch hat', applyOrder: 115,
      steps: ['Push a length of florist wire inside the hat to bend the tip into a crook.'],
      products: [{ name: 'Crooked witch hat', q: 'crooked witch hat black' }, { name: 'Florist wire', q: 'florist wire' }]
    },
    { id: 'purpleHat', label: 'Purple witch hat with veil', applyOrder: 115, steps: [], products: [{ name: 'Purple witch hat with feathers and veil', q: 'purple witch hat feathers veil' }] },
    { id: 'topHat', label: 'Black top hat', applyOrder: 115, steps: [], products: [{ name: 'Black top hat', q: 'black top hat' }] },
    { id: 'horns', label: 'Devil horns', applyOrder: 115, steps: [], products: [{ name: 'Red devil horns headband', q: 'red devil horns headband' }] },
    { id: 'redHood', label: 'Red hood', applyOrder: 115, steps: [], products: [{ name: 'Red hooded cape', q: 'red hooded cape' }] },
    { id: 'brownHood', label: 'Brown hood', applyOrder: 115, steps: [], products: [{ name: 'Brown hooded cloak', q: 'brown hooded cloak' }] },
    { id: 'nurseCap', label: 'Nurse cap', applyOrder: 115, steps: [], products: [{ name: 'Nurse cap', q: 'nurse hat costume' }] },
    {
      id: 'cone', label: 'Little cone hat', applyOrder: 115,
      steps: ['Angle the cone hat to one side and tuck the elastic under your hair.'],
      products: [{ name: 'Mini clown cone hat', q: 'mini clown party hat pompom' }]
    },
    {
      id: 'veil', label: 'Veil and wilted crown', applyOrder: 115,
      steps: ['Brush brown and grey eyeshadow onto the flower crown so it looks wilted, then pin the veil underneath.'],
      products: [{ name: 'Dried flower crown', q: 'dried flower crown' }, { name: 'Long tulle veil', q: 'long ivory tulle veil' }]
    },
    { id: 'bow', label: 'Big hair bow', applyOrder: 115, steps: [], products: [{ name: 'Large velvet hair bow', q: 'large burgundy velvet hair bow' }] },
    { id: 'stalk', label: 'Stalk headband', applyOrder: 115, steps: [], products: [{ name: 'Pumpkin stalk headband', q: 'pumpkin stem headband' }] }
  ],

  accessories: [
    { id: 'none', label: 'None', applyOrder: 120, steps: [], products: [] },
    { id: 'choker', label: 'Black choker', applyOrder: 120, steps: [], products: [{ name: 'Black velvet choker', q: 'black velvet choker' }] },
    { id: 'tulleRuff', label: 'Red and black ruff', applyOrder: 120, steps: [], products: [{ name: 'Red and black tulle ruff collar', q: 'red black tulle ruff collar' }] },
    { id: 'amulet', label: 'Blood amulet', applyOrder: 120, steps: [], products: [{ name: 'Gothic red gem pendant', q: 'gothic red gem pendant necklace' }] },
    { id: 'bones', label: 'Bone charms', applyOrder: 120, steps: [], products: [{ name: 'Bone charm necklace', q: 'bone charm necklace' }] },
    { id: 'locket', label: 'Pearls and locket', applyOrder: 120, steps: [], products: [{ name: 'Pearl necklace with locket', q: 'pearl necklace heart locket' }] },
    { id: 'cameo', label: 'Cameo brooch', applyOrder: 120, steps: [], products: [{ name: 'Victorian cameo brooch', q: 'victorian cameo brooch' }] },
    { id: 'key', label: 'Key on a ribbon', applyOrder: 120, steps: [], products: [{ name: 'Skeleton key necklace', q: 'skeleton key necklace ribbon' }] },
    {
      id: 'pompoms', label: 'Pompoms', applyOrder: 120,
      steps: ['Safety-pin two big pompoms down the front of your top.'],
      products: [{ name: 'Large red pompoms', q: 'large red craft pompoms' }]
    },
    { id: 'lantern', label: 'Green glass lantern', applyOrder: 120, steps: [], products: [{ name: 'Green glass lantern', q: 'green glass lantern battery' }] },
    { id: 'candlestick', label: 'Candlestick', applyOrder: 120, steps: [], products: [{ name: 'Brass candlestick', q: 'brass candlestick' }, { name: 'LED taper candle', q: 'led taper candle' }] },
    { id: 'cauldron', label: 'Cauldron', applyOrder: 120, steps: [], products: [{ name: 'Mini cauldron', q: 'halloween cauldron' }] },
    { id: 'goblet', label: 'Goblet', applyOrder: 120, steps: [], products: [{ name: 'Gold goblet', q: 'gold goblet' }] },
    { id: 'teapot', label: 'Teapot', applyOrder: 120, steps: [], products: [{ name: 'China teapot', q: 'blue and white china teapot' }] }
  ],

  // Presets have versions; each version is tagged scary, sexy or glam.
  // set lists everything that differs from the neutral default. byFeatures adds to set for each features setting.
  presets: [
    {
      id: 'vampire', label: 'Vampire',
      nouns: { feminine: 'countess', masculine: 'count', androgynous: 'noble' },
      versions: [
        {
          id: 'count', label: 'Count', tag: 'glam',
          set: { skin: 'corpse', contour: 'redRims', extras: ['fangs', 'elegantDrips'], clothing: 'tuxedo', hairStyle: 'slick', hairColour: 'black' },
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
          products: [{ name: 'Black gloves with long nails', q: 'black witch gloves long nails' }]
        },
        {
          id: 'hagMakeup', label: 'Hag makeup', tag: 'scary',
          set: { extras: ['wart', 'nose'], underEyes: 'kohl', hairStyle: 'witch', hairColour: 'white', clothing: 'shawl', headwear: 'witchHat', accessory: 'bones' }
        }
      ]
    },
    {
      id: 'zombie', label: 'Zombie',
      nouns: { feminine: 'zombie', masculine: 'zombie', androgynous: 'revenant' },
      versions: [
        { id: 'oneEyed', label: 'One-eyed', tag: 'scary', set: { skin: 'corpse', lenses: 'whiteoutOne', effects: ['templePeel', 'tornCheeks'], contour: 'bruised', clothing: 'tornJumper' } },
        { id: 'mauled', label: 'Mauled', tag: 'scary', set: { skin: 'corpse', effects: ['clawRip'], contour: 'bruised', clothing: 'redCape', headwear: 'redHood' } },
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
      versions: [
        {
          id: 'tornCheeks', label: 'Torn cheeks', tag: 'scary',
          set: { facePaint: 'clown', underEyes: 'bruised', effects: ['tornCheeks', 'tornCorners'], lips: 'blood', clothing: 'harlequin', accessory: 'tulleRuff', hairStyle: 'bunches', hairColour: 'black' }
        },
        {
          id: 'bloodTears', label: 'Blood tears', tag: 'scary',
          set: { facePaint: 'clownPink', underEyes: 'bruised', effects: ['bloodTears'], lips: 'blood', clothing: 'harlequin', accessory: 'tulleRuff', hairStyle: 'ponytail', hairColour: 'black' }
        },
        {
          id: 'glam', label: 'Glam clown', tag: 'glam',
          set: { facePaint: 'clown', lips: 'blood', clothing: 'clown', headwear: 'cone', accessory: 'pompoms', hairStyle: 'witch', hairColour: 'orange' }
        }
      ]
    },
    {
      id: 'bride', label: 'Corpse bride',
      nouns: { feminine: 'bride', masculine: 'groom', androgynous: 'betrothed' },
      versions: [
        {
          id: 'dead', label: 'Dead bride', tag: 'scary',
          set: { skin: 'bruised', contour: 'bruised', underEyes: 'hollows', lips: 'blue', clothing: 'bride', headwear: 'veil', accessory: 'locket', hairStyle: 'long', hairColour: 'auburn' }
        },
        {
          id: 'faded', label: 'Faded bride', tag: 'glam',
          set: { skin: 'corpse', eyes: 'softSmoky', clothing: 'bride', headwear: 'veil', accessory: 'locket', hairStyle: 'bun', hairColour: 'auburn' }
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
      versions: [
        {
          id: 'cracked', label: 'Cracked doll', tag: 'scary',
          set: { effects: ['cracked'], underEyes: 'hollows', eyes: 'glitter', clothing: 'doll', headwear: 'bow', accessory: 'key', hairStyle: 'bunches', hairColour: 'blonde' }
        },
        {
          id: 'porcelain', label: 'Porcelain doll', tag: 'glam',
          set: { skin: 'corpse', eyes: 'glitter', lips: 'blood', clothing: 'doll', headwear: 'bow', accessory: 'key', hairStyle: 'bunches', hairColour: 'blonde' }
        }
      ]
    },
    {
      id: 'ghost', label: 'Victorian ghost',
      nouns: { feminine: 'widow', masculine: 'widower', androgynous: 'spectre' },
      versions: [
        { id: 'sheet', label: 'Sheet ghost', tag: 'scary', nouns: { feminine: 'spook', masculine: 'spook', androgynous: 'spook' }, set: { mask: 'sheet' } },
        { id: 'greyLady', label: 'Grey lady', tag: 'glam', set: { skin: 'ghostly', lenses: 'iceMesh', clothing: 'mourning', accessory: 'cameo', hairStyle: 'bun', hairColour: 'silver' } }
      ]
    },
    {
      id: 'pumpkin', label: 'Pumpkin',
      nouns: { feminine: 'lantern', masculine: 'lantern', androgynous: 'gourd' },
      versions: [
        { id: 'jack', label: 'Jack-o\'-lantern', tag: 'glam', set: { facePaint: 'pumpkin', lenses: 'cat', clothing: 'pumpkin', headwear: 'stalk', hairStyle: 'crop', hairColour: 'black' } }
      ]
    },
    {
      id: 'victim', label: 'Murder victim',
      nouns: { feminine: 'victim', masculine: 'victim', androgynous: 'victim' },
      versions: [
        {
          id: 'cluedo', label: 'Cluedo victim', tag: 'scary',
          set: { skin: 'corpse', clothing: 'redDress', effects: ['foreheadGash', 'bloodTears'], extras: ['elegantDrips'], lenses: 'whiteout', accessory: 'candlestick', hairStyle: 'bun', hairColour: 'black' }
        },
        {
          id: 'elegant', label: 'Elegant corpse', tag: 'glam',
          nouns: { feminine: 'corpse', masculine: 'corpse', androgynous: 'corpse' },
          set: { clothing: 'redDress', effects: ['foreheadGash'], lips: 'blood', hairStyle: 'bun', hairColour: 'black' }
        }
      ]
    },
    {
      id: 'witch', label: 'Glam witch',
      nouns: { feminine: 'enchantress', masculine: 'sorcerer', androgynous: 'witch' },
      versions: [
        {
          id: 'purple', label: 'Purple witch', tag: 'glam',
          set: { facePaint: 'glamWitch', lips: 'blood', clothing: 'tulleGown', headwear: 'purpleHat', accessory: 'cauldron', hairStyle: 'long', hairColour: 'black' }
        },
        { id: 'web', label: 'Web witch', tag: 'sexy', set: { eyes: 'spiderweb', lips: 'blood', clothing: 'laceTop', hairStyle: 'long', hairColour: 'black' } },
        { id: 'velvet', label: 'Velvet witch', tag: 'glam', set: { eyes: 'berry', lips: 'berry', clothing: 'velvetTop', accessory: 'goblet', hairStyle: 'bob', hairColour: 'black' } }
      ]
    },
    {
      id: 'hatter', label: 'Mad Hatter',
      nouns: { feminine: 'hatter', masculine: 'hatter', androgynous: 'hatter' },
      versions: [
        {
          id: 'hatter', label: 'Hatter', tag: 'glam',
          set: { hairStyle: 'longWavy', hairColour: 'silver', headwear: 'topHat', lenses: 'swirl', eyes: 'whiteLashes', lips: 'blood', clothing: 'hatterJacket', accessory: 'teapot' }
        }
      ]
    },
    {
      id: 'devil', label: 'Devil',
      nouns: { feminine: 'devil', masculine: 'devil', androgynous: 'devil' },
      versions: [
        {
          id: 'scary', label: 'Scary devil', tag: 'scary',
          set: { facePaint: 'devil', headwear: 'horns', lenses: 'blackout', effects: ['veins'], clothing: 'highCollar', hairStyle: 'slick', hairColour: 'black' }
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
