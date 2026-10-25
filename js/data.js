/* Halloween costume - options, outfits, method steps and products.
   Steps are either a string (uses the option's applyOrder) or [order, string].
   Order: 10 skin prep, 20 base, 30 contour, 40 under-eyes, 50 face paint,
   60 effects, 70 eye makeup, 80 lips, 85-88 setting and blood, 90 lenses,
   95 fangs, 100 wig and hair, 110 costume, 115 headwear, 120 accessories, 130 removal. */

const AMAZON_TAG = '';

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
    { id: 'crop', label: 'Tousled crop', namePart: 'tousled', wig: 'short messy wig' },
    { id: 'slick', label: 'Slicked-back wave', namePart: 'slick', wig: 'slicked back short wig' },
    { id: 'bun', label: 'High bun', namePart: 'prim', wig: 'high bun wig' },
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

  // Shared steps for any face makeup.
  prep: {
    steps: [
      [10, 'Cleanse, pat dry and apply a light moisturiser. Give it five minutes to sink in so paint does not slide.'],
      [10, 'Smooth a silicone-free primer over the face, lids and lips so pigment grips and lifts off cleanly later.']
    ],
    products: [
      { name: 'Silicone-free makeup primer', q: 'silicone free makeup primer' },
      { name: 'Latex-free makeup sponges', q: 'latex free makeup sponge wedges' }
    ]
  },
  setting: {
    steps: [
      [86, 'Mist with a setting spray and let it dry without touching. Press translucent powder into the T-zone if you will be under hot lights.'],
      [130, 'At the end of the night, melt everything off with a cleansing balm, then follow with your usual face wash.']
    ],
    products: [
      { name: 'Long-lasting setting spray', q: 'makeup setting spray long lasting' },
      { name: 'Translucent setting powder', q: 'translucent setting powder' },
      { name: 'Cleansing balm', q: 'cleansing balm makeup remover' }
    ]
  },
  wig: {
    steps: [
      [100, 'Plait or pin your own hair flat and pull on a wig cap, tucking in every stray end.'],
      [100, 'Set the wig on from front to back, secure it with wig grips at the temples and nape, then shape with a light hold spray.']
    ],
    products: [
      { name: 'Wig cap', q: 'wig cap nude' },
      { name: 'Wig grips', q: 'wig grips kirby grips' }
    ]
  },
  baldCap: {
    steps: [
      [100, 'Slick your hair flat with gel and pull a latex bald cap over it, front edge first, so it sits just above the brows.'],
      [100, 'Glue the edges with spirit gum, trim the excess and stipple your base over the join so it disappears.'],
      [130, 'Lift the bald cap edges with spirit gum remover on a cotton bud rather than peeling it off dry.']
    ],
    products: [
      { name: 'Spirit gum and remover', q: 'spirit gum and remover' }
    ]
  },

  makeup: {
    skin: [
      { id: 'none', label: 'Natural', namePart: '', applyOrder: 20, steps: [], products: [] },
      {
        id: 'corpse', label: 'Corpse pale', namePart: 'pallid', applyOrder: 20,
        steps: [
          'Mix a drop of white cream paint into your usual foundation and sponge it on in thin layers until the warmth drops out of the skin.',
          [30, 'Sweep a grey-mauve matte shadow under the cheekbones, at the temples and down the sides of the nose with a fluffy brush to hollow the face.'],
          [30, 'Dust the same shade under the jawline and blend until no edges remain.']
        ],
        products: [
          { name: 'White cream face paint', q: 'white cream face paint professional' },
          { name: 'Grey-mauve matte eyeshadow', q: 'grey taupe matte eyeshadow palette' },
          { name: 'Fluffy blending brushes', q: 'fluffy blending brush set' }
        ]
      },
      {
        id: 'zombie', label: 'Zombie grey-green', namePart: 'rotting', applyOrder: 20,
        steps: [
          'Stipple a grey-green water-activated paint over the face, neck and ears with a damp sponge, building it up in two thin coats.',
          [30, 'Press purple-brown from a bruise wheel into the temples, eye sockets and under the cheekbones.'],
          [30, 'Flick a little brown and dark red over the skin with a stiff toothbrush for mottled, decaying patches.']
        ],
        products: [
          { name: 'Grey-green water-activated face paint', q: 'grey green water activated face paint' },
          { name: 'Bruise wheel', q: 'bruise wheel sfx makeup' },
          { name: 'Stipple sponge', q: 'stipple sponge sfx makeup' }
        ]
      },
      {
        id: 'ghostly', label: 'Ghostly white', namePart: 'spectral', applyOrder: 20,
        steps: [
          'Press a white water-activated paint over the face, neck and ears with a damp sponge in thin, even layers.',
          [30, 'Shade the eye sockets, temples and cheek hollows with a cool grey-blue shadow so the face reads as hollow from across a room.'],
          [30, 'Set with plenty of translucent powder so the white does not crack as you talk.']
        ],
        products: [
          { name: 'White water-activated face paint', q: 'white water activated face paint' },
          { name: 'Cool grey eyeshadow', q: 'cool grey matte eyeshadow' }
        ]
      },
      {
        id: 'bruised', label: 'Bruised blue', namePart: 'drowned', applyOrder: 20,
        steps: [
          'Sponge a sheer pale blue-grey base over the face and neck, letting a little of your own skin show through.',
          [30, 'Dab purple and red-violet from a bruise wheel onto the cheekbones, temples and jaw, then soften the edges with a clean fingertip.'],
          [30, 'Add a touch of yellow-green around the outside of each bruise for an older, waterlogged look.']
        ],
        products: [
          { name: 'Pale blue face paint', q: 'pale blue face paint' },
          { name: 'Bruise wheel', q: 'bruise wheel sfx makeup' }
        ]
      }
    ],

    underEyes: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 40, steps: [], products: [] },
      {
        id: 'hollows', label: 'Dead hollows', namePart: 'hollow', applyOrder: 40,
        steps: [
          'Pat a grey-purple cream into the inner corners and under the lower lashes, following the curve of the socket bone.',
          'Deepen the innermost corners with a touch of dark brown, then blend the outer edge down onto the cheek until it fades away.'
        ],
        products: [
          { name: 'Bruise wheel', q: 'bruise wheel sfx makeup' },
          { name: 'Small blending brush', q: 'small pencil blending brush eyeshadow' }
        ]
      },
      {
        id: 'bruised', label: 'Bruised', namePart: 'battered', applyOrder: 40,
        steps: [
          'Tap red-purple from a bruise wheel along the lower lid and inner corner with a stipple sponge.',
          'Layer a deeper plum close to the lashes and a yellow-green halo at the outer edge, keeping the texture uneven.'
        ],
        products: [
          { name: 'Bruise wheel', q: 'bruise wheel sfx makeup' },
          { name: 'Stipple sponge', q: 'stipple sponge sfx makeup' }
        ]
      },
      {
        id: 'kohl', label: 'Smudged kohl', namePart: 'smudged', applyOrder: 40,
        steps: [
          'Run a soft black kohl pencil along the lower lash line and waterline, going heavier than feels sensible.',
          'Smudge it down with a fingertip, then drag a few faint streaks towards the cheek as if it has run.'
        ],
        products: [
          { name: 'Black kohl pencil', q: 'black kohl eyeliner pencil' },
          { name: 'Smudge brush', q: 'eyeliner smudge brush' }
        ]
      },
      {
        id: 'sockets', label: 'Sunken skull sockets', namePart: 'sunken', applyOrder: 40,
        steps: [
          'Outline the full eye socket in black cream paint, from under the brow bone to the top of the cheekbone.',
          'Fill it in solid black, then blend a grey ring around the outside so the hollow looks deep rather than painted on.'
        ],
        products: [
          { name: 'Black cream face paint', q: 'black cream face paint' },
          { name: 'Flat face paint brushes', q: 'face paint brush set flat' }
        ]
      }
    ],

    lenses: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 90, steps: [], products: [] },
      { id: 'whiteout', label: 'White-out', namePart: 'blind', applyOrder: 90, steps: [], products: [{ name: 'White-out contact lenses', q: 'white out halloween contact lenses' }] },
      { id: 'red', label: 'Red vampire', namePart: 'bloodthirsty', applyOrder: 90, steps: [], products: [{ name: 'Red vampire contact lenses', q: 'red vampire contact lenses' }] },
      { id: 'cat', label: 'Cat slit yellow', namePart: 'feline', applyOrder: 90, steps: [], products: [{ name: 'Yellow cat eye contact lenses', q: 'yellow cat eye contact lenses' }] },
      { id: 'black', label: 'Black sclera', namePart: 'possessed', applyOrder: 90, steps: [], products: [{ name: 'Black sclera contact lenses', q: 'black sclera contact lenses' }] },
      { id: 'ice', label: 'Ice blue', namePart: 'frozen', applyOrder: 90, steps: [], products: [{ name: 'Ice blue contact lenses', q: 'ice blue halloween contact lenses' }] }
    ],
    // Added once whenever any lens is chosen.
    lensCare: {
      steps: [
        [90, 'Buy coloured lenses only from a seller supervised by a registered optician, even with no prescription, and never share them.'],
        [90, 'Put lenses in last, once your face is set, with clean dry hands. Look up and place each lens on the white of the eye.'],
        [130, 'Take lenses out before you touch your makeup remover, and bin daily lenses after one wear.']
      ],
      products: [
        { name: 'Contact lens solution and case', q: 'contact lens solution with case' }
      ]
    },

    eyes: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 70, steps: [], products: [] },
      {
        id: 'smoky', label: 'Smoky black', namePart: 'smouldering', applyOrder: 70,
        steps: [
          'Pack a black cream base over the lid and up into the crease.',
          'Press matte black shadow on top and blend the edges upwards with a fluffy brush until it melts into grey.',
          'Smudge the same shadow under the lower lashes and line the waterline with black kohl.'
        ],
        products: [
          { name: 'Black cream eyeshadow', q: 'black cream eyeshadow' },
          { name: 'Matte black eyeshadow', q: 'matte black eyeshadow' },
          { name: 'Black kohl pencil', q: 'black kohl eyeliner pencil' }
        ]
      },
      {
        id: 'redLiner', label: 'Blood-red liner', namePart: 'weeping', applyOrder: 70,
        steps: [
          'Draw a sharp, oversized wing in red liquid liner, starting thin at the inner corner and flicking up towards the end of the brow.',
          'Line the lower lashes in red, then let one bead of liner run down from the outer corner like a bloody tear.'
        ],
        products: [{ name: 'Red liquid eyeliner', q: 'red liquid eyeliner waterproof' }]
      },
      {
        id: 'glitter', label: 'Glitter', namePart: 'glittering', applyOrder: 70,
        steps: [
          'Tap a glitter glue over the lid only, keeping the area above the crease clean.',
          'Press loose cosmetic glitter on with a flat brush, then lift any fallout off the cheeks with sticky tape before it spreads.'
        ],
        products: [
          { name: 'Cosmetic glitter', q: 'cosmetic glitter face eye' },
          { name: 'Glitter glue', q: 'glitter glue for eyes cosmetic' }
        ]
      },
      {
        id: 'diamonds', label: 'Clown diamonds', namePart: 'harlequin', applyOrder: 70,
        steps: [
          'Sketch a tall diamond through each eye with a white pencil, from mid-brow to mid-cheek.',
          'Fill it with blue cream paint using a flat brush, keeping the points crisp, then set with matching powder.'
        ],
        products: [
          { name: 'Blue cream face paint', q: 'blue cream face paint' },
          { name: 'Flat face paint brushes', q: 'face paint brush set flat' }
        ]
      }
    ],

    facePaint: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 50, steps: [], products: [] },
      {
        id: 'clown', label: 'Scary clown', namePart: 'grinning', applyOrder: 50,
        steps: [
          'Pat white clown base over the whole face with a powder puff, pressing rather than wiping so it stays opaque.',
          'Set the white with translucent powder and brush off the excess.',
          'Paint the nose red, draw a wide upturned grin well past the natural lip line in red, then outline it and add high arched brows in black.'
        ],
        products: [
          { name: 'White clown cream base', q: 'white clown makeup cream' },
          { name: 'Red and black face paint', q: 'red black face paint set' },
          { name: 'Fine liner brush', q: 'fine liner brush face paint' }
        ]
      },
      {
        id: 'skull', label: 'Skull (half face)', namePart: 'skeletal', applyOrder: 50,
        steps: [
          'Paint one half of the face white, using the centre of the nose and lips as a ragged dividing line.',
          'Fill the eye socket and nostril on that side solid black, and shade the cheek hollow and temple in charcoal.',
          'Draw the teeth over the lips with a fine liner brush, outlining each tooth in black and shading the gaps.'
        ],
        products: [
          { name: 'Black and white face paint', q: 'black and white face paint palette' },
          { name: 'Fine liner brush', q: 'fine liner brush face paint' }
        ]
      },
      {
        id: 'sugarSkull', label: 'Sugar skull', namePart: 'marigold', applyOrder: 50,
        steps: [
          'Cover the face with a white water-activated base and let it dry completely.',
          'Circle each eye with a coloured socket, then ring it with petals in a contrasting shade.',
          'Paint a black heart-shaped nose and stitched teeth across the mouth, then finish with dots on the chin and a flower on the forehead.'
        ],
        products: [
          { name: 'Bright face paint palette', q: 'rainbow face paint palette professional' },
          { name: 'Fine liner brush', q: 'fine liner brush face paint' }
        ]
      },
      {
        id: 'pumpkin', label: 'Pumpkin', namePart: 'carved', applyOrder: 50,
        steps: [
          'Sponge orange paint over the whole face, then shade curved rib lines down the face in a darker burnt orange.',
          'Paint black triangles over the eyes and nose and a jagged carved grin over the mouth with a flat brush.',
          'Add a touch of yellow along the inner edges of the cut-outs to suggest candlelight.'
        ],
        products: [
          { name: 'Orange and black face paint', q: 'orange black face paint halloween' },
          { name: 'Flat face paint brushes', q: 'face paint brush set flat' }
        ]
      }
    ],

    effects: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 60, steps: [], products: [] },
      {
        id: 'wound', label: 'Liquid latex wound', namePart: 'mauled', applyOrder: 60,
        steps: [
          [10, 'Patch-test liquid latex on your inner arm 24 hours before, and skip it entirely if you have a latex allergy.'],
          'Smooth a thin barrier of moisturiser over any fine hairs in the area so the latex cannot grip them.',
          'Stipple liquid latex in thin layers with a sponge, adding torn tissue between layers, then dry each with a hairdryer on cool.',
          'Tear the centre open with tweezers, colour inside with dark red and black cream, and fill with thick scab blood.',
          [130, 'To remove latex, lift an edge and roll it off slowly while massaging oil underneath. Never rip it.']
        ],
        products: [
          { name: 'Liquid latex', q: 'liquid latex sfx makeup' },
          { name: 'Thick scab blood', q: 'scab blood sfx makeup' },
          { name: 'Bruise wheel', q: 'bruise wheel sfx makeup' }
        ]
      },
      {
        id: 'stitchedMouth', label: 'Stitched mouth', namePart: 'stitched', applyOrder: 60,
        steps: [
          'Draw a thin line from each corner of the mouth up towards the ear with a burgundy lip pencil.',
          'Paint short black stitches across it with a liner brush, then stipple red and purple either side so the skin looks puckered.'
        ],
        products: [
          { name: 'Burgundy lip liner', q: 'burgundy lip liner' },
          { name: 'Black liquid eyeliner', q: 'black liquid eyeliner' },
          { name: 'Bruise wheel', q: 'bruise wheel sfx makeup' }
        ]
      },
      {
        id: 'scar', label: 'Stitched cheek scar', namePart: 'scarred', applyOrder: 60,
        steps: [
          'Paint two or three coats of rigid collodion along the scar line. It puckers the skin as it dries.',
          'Lay short lengths of black thread across the scar, fixing each end with a dot of spirit gum, then paint redness around every stitch.',
          [130, 'Dissolve spirit gum with its remover on a cotton pad, holding it on for a few seconds before wiping. Collodion peels off from the edge.']
        ],
        products: [
          { name: 'Rigid collodion', q: 'rigid collodion scar' },
          { name: 'Spirit gum and remover', q: 'spirit gum and remover' },
          { name: 'Black embroidery thread', q: 'black embroidery thread' }
        ]
      },
      {
        id: 'cracked', label: 'Cracked porcelain', namePart: 'cracked', applyOrder: 60,
        steps: [
          'Even out a pale porcelain base and set it with a sheer pearl powder for a glazed finish.',
          'Stipple round, rosy painted cheeks in a soft pink cream blush.',
          'Draw hairline cracks in dark brown liquid liner, branching from one point, then trace a fine white line alongside each crack so it looks chipped.'
        ],
        products: [
          { name: 'Pale porcelain foundation', q: 'porcelain pale foundation' },
          { name: 'Pink cream blush', q: 'pink cream blush' },
          { name: 'Brown liquid eyeliner', q: 'brown liquid eyeliner' },
          { name: 'White eyeliner pencil', q: 'white eyeliner pencil' }
        ]
      },
      {
        id: 'veins', label: 'Veins', namePart: 'veined', applyOrder: 60,
        steps: [
          'Draw veins in a blue-purple pencil, starting at the temples and under the eyes and branching outwards into ever finer lines.',
          'Tap over them with a fingertip to soften, then redraw the main branches so they sit under the skin rather than on it.'
        ],
        products: [{ name: 'Blue and purple eyeliner pencils', q: 'purple blue eyeliner pencil set' }]
      }
    ],

    lips: [
      { id: 'none', label: 'Natural', namePart: '', applyOrder: 80, steps: [], products: [] },
      {
        id: 'black', label: 'Black', namePart: 'inky', applyOrder: 80,
        steps: [
          'Line and fill the lips with a black lip liner, then press a black matte liquid lipstick on top.',
          'Blot, add a second coat and let it set before you talk.'
        ],
        products: [
          { name: 'Black lip liner', q: 'black lip liner' },
          { name: 'Black matte liquid lipstick', q: 'black matte liquid lipstick' }
        ]
      },
      {
        id: 'blood', label: 'Blood red', namePart: 'scarlet', applyOrder: 80,
        steps: [
          'Line just outside the natural lip line with a deep red liner, then fill with a long-wear red.',
          'Blot and press a touch of black into the centre for a darker, wetter finish.'
        ],
        products: [
          { name: 'Deep red lip liner', q: 'deep red lip liner' },
          { name: 'Long-wear red lipstick', q: 'long lasting blood red lipstick' }
        ]
      },
      {
        id: 'blue', label: 'Blue-dead', namePart: 'breathless', applyOrder: 80,
        steps: [
          'Pat concealer over the lips to knock back their natural colour.',
          'Press a matte blue-grey shadow into the lips, deeper at the corners, and set with powder.'
        ],
        products: [
          { name: 'Full-coverage concealer', q: 'full coverage concealer' },
          { name: 'Blue-grey matte eyeshadow', q: 'blue grey matte eyeshadow' }
        ]
      },
      {
        id: 'stitched', label: 'Stitched', namePart: 'silenced', applyOrder: 80,
        steps: [
          'Knock back the lips with concealer and a lilac-grey shadow.',
          'Draw vertical black stitches across both lips with a liner brush, cross each with a short diagonal, and dot red at every puncture.'
        ],
        products: [
          { name: 'Full-coverage concealer', q: 'full coverage concealer' },
          { name: 'Black liquid eyeliner', q: 'black liquid eyeliner' }
        ]
      }
    ],

    // Extras can be combined, so they are a multi-select.
    extras: [
      { id: 'none', label: 'None', namePart: '', applyOrder: 60, steps: [], products: [] },
      {
        id: 'fangs', label: 'Fangs', namePart: 'fanged', applyOrder: 95,
        steps: [
          'Soften the moulding beads in hot water, press them into each fang and onto your canine, then hold until cool and set.',
          'Practise talking in them before the night, and take them out to eat.'
        ],
        products: [{ name: 'Custom-fit vampire fangs', q: 'vampire fangs custom fit thermoplastic' }]
      },
      {
        id: 'blood', label: 'Blood drip', namePart: 'dripping', applyOrder: 88,
        steps: [
          'Dot thick fake blood at one corner of the mouth and let it run down towards the chin on its own.',
          'Use mouth-safe blood for anything near the lips, and add a smaller drip from a fang tip.'
        ],
        products: [{ name: 'Mouth-safe fake blood', q: 'mouth safe fake blood' }]
      },
      {
        id: 'wart', label: 'Wart', namePart: 'warty', applyOrder: 60,
        steps: [
          'Roll a pea of modelling wax and press it onto the chin over a thin layer of spirit gum.',
          'Blend the edges flat with a spatula and a little petroleum jelly, colour it a shade darker than the skin and push in two coarse hairs.'
        ],
        products: [
          { name: 'Modelling wax', q: 'modelling wax sfx' },
          { name: 'Spirit gum and remover', q: 'spirit gum and remover' }
        ]
      },
      {
        id: 'nose', label: 'Crooked nose', namePart: 'crooked', applyOrder: 60,
        steps: [
          [10, 'Patch-test spirit gum on your inner arm the day before.'],
          'Brush spirit gum onto the back of the foam latex nose and onto your own nose, wait until tacky, then press into place from the bridge down.',
          'Hide the edges with a little liquid latex, then colour over prosthetic and skin together so they match.',
          [130, 'Remove the nose by working spirit gum remover under the edges with a cotton bud rather than pulling.']
        ],
        products: [
          { name: 'Crooked witch nose prosthetic', q: 'witch nose prosthetic latex' },
          { name: 'Spirit gum and remover', q: 'spirit gum and remover' },
          { name: 'Liquid latex', q: 'liquid latex sfx makeup' }
        ]
      }
    ]
  },

  clothing: [
    { id: 'plain', label: 'Plain dark top', noun: '', applyOrder: 110, steps: [], products: [] },
    {
      id: 'vampire', label: 'High-collared cape', noun: 'aristocrat', applyOrder: 110,
      steps: ['Stand the cape collar up and pin it to the shirt shoulders with safety pins so it frames the head instead of flopping back.'],
      products: [
        { name: 'High-collar vampire cape', q: 'high collar vampire cape red lining' },
        { name: 'Burgundy brocade waistcoat', q: 'burgundy brocade waistcoat' },
        { name: 'White ruffled cravat', q: 'white ruffled cravat jabot' }
      ]
    },
    {
      id: 'shawl', label: 'Tattered shawl', noun: 'crone', applyOrder: 110,
      steps: ['Snip the shawl hem into uneven points and pull a few stitches loose so it looks moth-eaten.'],
      products: [
        { name: 'Knitted shawl in moss green', q: 'knitted shawl green grey' },
        { name: 'Long black dress', q: 'long black witch dress' }
      ]
    },
    {
      id: 'zombie', label: 'Torn shirt', noun: 'shambler', applyOrder: 110,
      steps: ['Rip the shirt at the seams and collar, rub in brown eyeshadow and cold tea, then flick fake blood around the neck.'],
      products: [{ name: 'Off-white button-up shirt', q: 'off white cotton shirt mens' }]
    },
    {
      id: 'clown', label: 'Ruff and stripes', noun: 'jester', applyOrder: 110,
      steps: [],
      products: [
        { name: 'Red and white striped top', q: 'red white striped long sleeve top' },
        { name: 'Pleated ruff collar', q: 'clown ruff collar white' }
      ]
    },
    {
      id: 'bride', label: 'Ragged lace bodice', noun: 'bride', applyOrder: 110,
      steps: ['Tear the lace edges, stain patches with cold tea and rub grey eyeshadow into the folds for a grave-soiled finish.'],
      products: [{ name: 'Ivory lace corset top', q: 'ivory lace corset top' }]
    },
    {
      id: 'hoodie', label: 'Bone-print hoodie', noun: 'skeleton', applyOrder: 110,
      steps: [],
      products: [{ name: 'Skeleton print hoodie', q: 'skeleton print hoodie black' }]
    },
    {
      id: 'doll', label: 'Doll dress', noun: 'doll', applyOrder: 110,
      steps: [],
      products: [
        { name: 'Pink puff sleeve dress', q: 'pink puff sleeve dress' },
        { name: 'White lace Peter Pan collar', q: 'detachable lace peter pan collar' }
      ]
    },
    {
      id: 'mourning', label: 'Mourning gown', noun: 'mourner', applyOrder: 110,
      steps: ['Brush white powder and a little grey shadow over the shoulders and folds so the fabric looks faded and dusty.'],
      products: [{ name: 'Victorian high-neck mourning dress', q: 'victorian high neck black dress' }]
    },
    {
      id: 'pumpkin', label: 'Pumpkin top', noun: 'pumpkin', applyOrder: 110,
      steps: ['Cut leaf shapes from green felt, draw veins on with a fabric pen and stitch them around the neckline.'],
      products: [
        { name: 'Orange long-sleeve top', q: 'orange long sleeve top' },
        { name: 'Green felt sheets', q: 'green felt sheets craft' }
      ]
    }
  ],

  headwear: [
    { id: 'none', label: 'None', applyOrder: 115, steps: [], products: [] },
    {
      id: 'witchHat', label: 'Crooked witch hat', applyOrder: 115,
      steps: ['Push a length of florist wire up inside the hat to bend the tip into a crook, then pin the brim to the wig with grips.'],
      products: [{ name: 'Crooked witch hat', q: 'crooked witch hat black' }, { name: 'Florist wire', q: 'florist wire' }]
    },
    {
      id: 'cone', label: 'Little cone hat', applyOrder: 115,
      steps: ['Angle the cone hat to one side and anchor the elastic under the wig with grips so it does not ride up.'],
      products: [{ name: 'Mini clown cone hat', q: 'mini clown party hat pompom' }]
    },
    {
      id: 'veil', label: 'Veil and wilted crown', applyOrder: 115,
      steps: ['Brush brown and grey eyeshadow onto the flower crown so it looks wilted, then pin the veil underneath at the crown.'],
      products: [{ name: 'Dried flower crown', q: 'dried flower crown' }, { name: 'Long tulle veil', q: 'long ivory tulle veil' }]
    },
    {
      id: 'bow', label: 'Big hair bow', applyOrder: 115,
      steps: [],
      products: [{ name: 'Large velvet hair bow', q: 'large burgundy velvet hair bow' }]
    },
    {
      id: 'stalk', label: 'Stalk headband', applyOrder: 115,
      steps: [],
      products: [{ name: 'Pumpkin stalk headband', q: 'pumpkin stem headband' }]
    }
  ],

  accessories: [
    { id: 'none', label: 'None', applyOrder: 120, steps: [], products: [] },
    { id: 'amulet', label: 'Blood amulet', applyOrder: 120, steps: [], products: [{ name: 'Gothic red gem pendant', q: 'gothic red gem pendant necklace' }] },
    { id: 'bones', label: 'Bone charms', applyOrder: 120, steps: [], products: [{ name: 'Bone charm necklace', q: 'bone charm necklace witch' }] },
    { id: 'locket', label: 'Pearls and locket', applyOrder: 120, steps: [], products: [{ name: 'Pearl necklace with locket', q: 'pearl necklace heart locket' }] },
    { id: 'cameo', label: 'Cameo brooch', applyOrder: 120, steps: [], products: [{ name: 'Victorian cameo brooch', q: 'victorian cameo brooch' }] },
    { id: 'key', label: 'Key on a ribbon', applyOrder: 120, steps: [], products: [{ name: 'Skeleton key necklace', q: 'skeleton key necklace ribbon' }] },
    {
      id: 'pompoms', label: 'Pompoms', applyOrder: 120,
      steps: ['Stitch or safety-pin two large pompoms down the front of the top.'],
      products: [{ name: 'Large red pompoms', q: 'large red craft pompoms' }]
    }
  ],

  outfits: [
    {
      id: 'vampire', label: 'Vampire',
      nouns: { feminine: 'countess', masculine: 'count', androgynous: 'noble' },
      set: { clothing: 'vampire', headwear: 'none', accessory: 'amulet', skin: 'corpse', lenses: 'red', extras: ['fangs'], lips: 'blood', hairStyle: 'slick', hairColour: 'black' },
      steps: [[110, 'Dress in the shirt and waistcoat first, then tie the cravat high under the chin before the cape goes on.']],
      products: [{ name: 'Gothic cape clasp chain', q: 'gothic cape clasp chain' }]
    },
    {
      id: 'hag', label: 'Hag',
      nouns: { feminine: 'hag', masculine: 'warlock', androgynous: 'witch' },
      set: { clothing: 'shawl', headwear: 'witchHat', accessory: 'bones', underEyes: 'kohl', extras: ['wart', 'nose'], hairStyle: 'witch', hairColour: 'white' },
      steps: [[110, 'Backcomb the wig in sections and mist with hairspray so it stands away from the face under the hat brim.']],
      products: [{ name: 'Gnarled wooden broom', q: 'witch broom halloween prop' }]
    },
    {
      id: 'zombie', label: 'Zombie',
      nouns: { feminine: 'zombie', masculine: 'zombie', androgynous: 'revenant' },
      set: { clothing: 'zombie', skin: 'zombie', underEyes: 'hollows', effects: 'wound', lenses: 'whiteout', hairStyle: 'crop', hairColour: 'darkBrown' },
      steps: [[110, 'Rough up the hair with dry shampoo and brown eyeshadow for grave dust, and smear a little on the hands and neck too.']],
      products: [{ name: 'Fake blood', q: 'fake blood halloween' }, { name: 'Dry shampoo', q: 'dry shampoo' }]
    },
    {
      id: 'clown', label: 'Scary clown',
      nouns: { feminine: 'clown', masculine: 'clown', androgynous: 'clown' },
      set: { clothing: 'clown', headwear: 'cone', accessory: 'pompoms', facePaint: 'clown', lips: 'blood', eyes: 'diamonds', hairStyle: 'witch', hairColour: 'orange' },
      steps: [[110, 'Keep the rest of the outfit to red, black and white so the face paint stays the focus.']],
      products: [{ name: 'White cotton gloves', q: 'white cotton costume gloves' }]
    },
    {
      id: 'bride', label: 'Corpse bride',
      nouns: { feminine: 'bride', masculine: 'groom', androgynous: 'betrothed' },
      set: { clothing: 'bride', headwear: 'veil', accessory: 'locket', skin: 'bruised', underEyes: 'hollows', lips: 'blue', hairStyle: 'long', hairColour: 'auburn' },
      steps: [[110, 'Tuck a few dried leaves and a little grey powder into the veil and hair as if just risen from the ground.']],
      products: [{ name: 'Dead rose bouquet', q: 'artificial black rose bouquet' }]
    },
    {
      id: 'skeleton', label: 'Skeleton',
      nouns: { feminine: 'skeleton', masculine: 'skeleton', androgynous: 'skeleton' },
      set: { clothing: 'hoodie', facePaint: 'skull', hairStyle: 'crop', hairColour: 'black' },
      steps: [[110, 'Wear black from head to toe so the white bones and the painted half of the face stand out.']],
      products: [{ name: 'Skeleton gloves', q: 'skeleton gloves' }]
    },
    {
      id: 'doll', label: 'Cursed doll',
      nouns: { feminine: 'doll', masculine: 'puppet', androgynous: 'marionette' },
      set: { clothing: 'doll', headwear: 'bow', accessory: 'key', effects: 'cracked', eyes: 'glitter', hairStyle: 'bunches', hairColour: 'blonde' },
      steps: [[110, 'Pin a large wind-up key to the back of the dress and move in small, stiff jerks.']],
      products: [{ name: 'Wind-up key prop', q: 'wind up key costume prop' }]
    },
    {
      id: 'ghost', label: 'Victorian ghost',
      nouns: { feminine: 'widow', masculine: 'widower', androgynous: 'spectre' },
      set: { clothing: 'mourning', accessory: 'cameo', skin: 'ghostly', lenses: 'ice', hairStyle: 'bun', hairColour: 'silver' },
      steps: [[110, 'Dust white powder over the wig and shoulders for a faded, ashen sheen.']],
      products: [{ name: 'Antique-style pocket watch', q: 'antique style pocket watch chain' }]
    },
    {
      id: 'pumpkin', label: 'Pumpkin',
      nouns: { feminine: 'lantern', masculine: 'lantern', androgynous: 'gourd' },
      set: { clothing: 'pumpkin', headwear: 'stalk', facePaint: 'pumpkin', lenses: 'cat', hairStyle: 'crop', hairColour: 'black' },
      steps: [[110, 'Carry a pumpkin bucket lit with a battery tea light to throw a warm glow up onto the face paint.']],
      products: [{ name: 'Pumpkin bucket', q: 'pumpkin bucket halloween' }, { name: 'Battery tea lights', q: 'battery tea lights' }]
    }
  ],

  // Pairs that should never come out of Randomise together.
  incompatible: [
    ['lips:stitched', 'effects:stitchedMouth'],
    ['facePaint:pumpkin', 'eyes:diamonds'],
    ['facePaint:sugarSkull', 'eyes:diamonds'],
    ['facePaint:skull', 'eyes:diamonds'],
    ['facePaint:clown', 'skin:zombie'],
    ['lenses:black', 'underEyes:sockets'],
    ['facePaint:pumpkin', 'effects:cracked'],
    ['facePaint:sugarSkull', 'effects:cracked']
  ],

  defaults: {
    shape: 'oval', features: 'androgynous', skinTone: 'peach', hairStyle: 'crop', hairColour: 'darkBrown',
    skin: 'none', underEyes: 'none', lenses: 'none', eyes: 'none', facePaint: 'none', effects: 'none', lips: 'none', extras: [],
    clothing: 'plain', headwear: 'none', accessory: 'none', outfit: null
  },

  nameFallbacks: { first: 'perfectly', second: 'ordinary', solo: 'restless' }
};
