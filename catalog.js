/* ============================================================
   BYCYCLE — Product Catalog
   ============================================================ */

const CATALOG = {
  urban: {
    id: 'urban',
    badge: 'Urban',
    name: 'Blackline Urban',
    price: 1199,
    tagline: 'Nimble commuter build with upright geometry and puncture-resistant tires.',
    description: 'The Blackline Urban is built for the daily commute — an upright riding position, quick-accelerating alloy frame, and puncture-resistant tires that shrug off city streets. Finished in the same hand-polished metallic black shell as every Blackline frame.',
    specs: [
      ['Frame weight', '9.4kg'],
      ['Drivetrain', '9-speed'],
      ['Brakes', 'Hydraulic disc'],
      ['Wheel size', '700c'],
      ['Finish', 'PVD Black']
    ],
    colors: ['Matte Black', 'Graphite Silver'],
    sizes: ['S', 'M', 'L'],
    icon: '<circle cx="34" cy="62" r="24" stroke="#9AA0AC" stroke-width="2.4"/><circle cx="150" cy="62" r="24" stroke="#9AA0AC" stroke-width="2.4"/><path d="M34 62L74 24h34l16 38M74 24l14 20" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M88 44l-6 18h-48" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M150 62l-12-38" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round"/><circle cx="82" cy="44" r="3" fill="#B6FF3C"/>'
  },
  trail: {
    id: 'trail',
    badge: 'Trail',
    name: 'Blackline Trail',
    price: 1799,
    tagline: 'Wide-tread suspension fork and reinforced frame for rough terrain.',
    description: 'The Blackline Trail trades speed for confidence on rough ground — a reinforced frame, wide-tread rubber, and a suspension fork tuned for roots, rocks, and everything in between. Built for riders who leave the pavement on purpose.',
    specs: [
      ['Frame weight', '11.2kg'],
      ['Drivetrain', '12-speed'],
      ['Brakes', 'Hydraulic disc'],
      ['Wheel size', '29"'],
      ['Finish', 'PVD Black']
    ],
    colors: ['Matte Black', 'Olive Drab'],
    sizes: ['S', 'M', 'L', 'XL'],
    icon: '<circle cx="30" cy="60" r="27" stroke="#9AA0AC" stroke-width="2.4"/><circle cx="154" cy="60" r="27" stroke="#9AA0AC" stroke-width="2.4"/><path d="M30 60L70 26h32l24 34M70 26l12 22" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M82 48l-10 12h-42" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="76" cy="48" r="3" fill="#B6FF3C"/>'
  },
  race: {
    id: 'race',
    badge: 'Race',
    name: 'Blackline Race',
    price: 2399,
    tagline: 'Aero-profile tubing and a stiff drivetrain built for competitive pace.',
    description: 'The Blackline Race is the fastest frame we build — aero-profile tubing, a stiff bottom bracket for maximum power transfer, and a race-tuned drivetrain. Designed for riders chasing personal bests, not just miles.',
    specs: [
      ['Frame weight', '7.8kg'],
      ['Drivetrain', '12-speed'],
      ['Brakes', 'Hydraulic disc'],
      ['Wheel size', '700c'],
      ['Finish', 'PVD Black']
    ],
    colors: ['Matte Black', 'Volt Green Accent'],
    sizes: ['XS', 'S', 'M', 'L'],
    icon: '<circle cx="36" cy="62" r="22" stroke="#9AA0AC" stroke-width="2.4"/><circle cx="148" cy="62" r="22" stroke="#9AA0AC" stroke-width="2.4"/><path d="M36 62L78 28h30l10 34M78 28l10 22" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M88 50l-6 12h-46" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="84" cy="50" r="3" fill="#B6FF3C"/>'
  },
  fold: {
    id: 'fold',
    badge: 'Fold',
    name: 'Blackline Fold',
    price: 999,
    tagline: 'Compact folding frame that fits in a trunk, a closet, or a train.',
    description: 'The Blackline Fold folds down in under fifteen seconds without sacrificing the ride quality the Blackline name is built on. Small wheels, a compact hinge-locked frame, and the same aerospace-grade alloy as the rest of the lineup.',
    specs: [
      ['Frame weight', '8.1kg'],
      ['Drivetrain', '8-speed'],
      ['Brakes', 'Hydraulic disc'],
      ['Wheel size', '20"'],
      ['Finish', 'PVD Black']
    ],
    colors: ['Matte Black'],
    sizes: ['One Size'],
    icon: '<circle cx="46" cy="60" r="18" stroke="#9AA0AC" stroke-width="2.4"/><circle cx="140" cy="60" r="18" stroke="#9AA0AC" stroke-width="2.4"/><path d="M46 60L86 34h24l20 26M86 34l8 16" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M94 50l-8 10h-40" stroke="#E4E7EC" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="90" cy="50" r="3" fill="#B6FF3C"/>'
  }
};
