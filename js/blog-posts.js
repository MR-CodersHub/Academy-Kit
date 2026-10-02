/* ============================================================
   ACADEMYKIT — BLOG POSTS DATA + DETAILS RENDERER
   Each blog card links to blog-details.html?post=<slug>.
   This module renders the matching article, TOC and related posts.
   ============================================================ */
'use strict';

const BLOG_AUTHORS = {
  arjun: { name: 'Arjun Mehta', role: 'Founder & CEO, AcademyKit', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', bio: 'Former national-level footballer and sports educator with 15+ years of experience in school sportswear. Arjun founded AcademyKit to bring professional-quality kits to every school in India.' },
  priya: { name: 'Priya Nair', role: 'Head of Design, AcademyKit', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', bio: 'Priya leads kit design at AcademyKit, working with 500+ schools on colours, crests and sublimation graphics that survive seasons of play.' },
  rahul: { name: 'Rahul Verma', role: 'Production Director, AcademyKit', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', bio: 'Rahul runs production across our Ludhiana and Tiruppur units, overseeing fabric selection, stitching quality and on-time dispatch.' },
  meera: { name: 'Meera Pillai', role: 'School Relations Head, AcademyKit', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', bio: 'Meera works directly with PE coordinators and principals, helping schools plan kit budgets, size runs and sports-day timelines.' }
};

const BLOG_CATS = {
  kits: 'Kit Guides',
  care: 'Kit Care',
  branding: 'Branding',
  trends: 'Trends',
  schools: 'School Sport'
};

const BLOG_POSTS = {
  'choose-football-kit-2026': {
    cat: 'kits', title: 'How to Choose the Perfect Football Kit for Your School Team in 2026',
    date: 'September 28, 2026', read: '8 min read', author: 'arjun',
    img: 'https://i.pinimg.com/1200x/06/5c/45/065c45262d88633f7e685b626e206158.jpg',
    body: `
      <p>Choosing the right football kit for your school team is much more than picking colours. A great kit performs under match conditions, fits every player, represents your school identity and survives a full season — all within budget.</p>
      <h2>1. Define Your Budget First</h2>
      <p>Establish your per-unit budget upfront. School football kits range from ₹799 training jerseys to ₹2,500+ full match kits. A realistic mid-range is ₹1,200–₹1,800 per player, with 10–25% bulk savings above 50 units.</p>
      <h2>2. Choose the Right Fabric</h2>
      <ul><li><strong>Moisture-wicking polyester (150gsm)</strong> — the gold standard for Indian climates.</li><li><strong>Mesh panels</strong> — underarm ventilation for intensive play.</li><li><strong>Avoid 100% cotton</strong> — absorbs sweat and turns heavy.</li></ul>
      <blockquote>"A player in the right fabric focuses on the game — not on discomfort."<br/>— Arjun Mehta, Founder of AcademyKit</blockquote>
      <h2>3. Sublimation vs Screen Printing</h2>
      <p>Sublimation embeds colour into fabric — no cracking ever. Screen printing suits simple designs on any base colour. For 2–3 seasons of use, sublimation wins.</p>`
  },
  'cricket-kits-guide': {
    cat: 'kits', title: 'The Ultimate Guide to School Cricket Kits: What to Look for',
    date: 'September 25, 2026', read: '6 min read', author: 'priya',
    img: 'https://i.pinimg.com/736x/84/18/a3/8418a3af7b4dac5538a48bed260e8fbd.jpg',
    body: `
      <p>Cricket whites look simple, but a school cricket kit hides a dozen decisions — fabric weight, trouser cut, cap style and embroidery that survives long days in the sun.</p>
      <h2>Fabric That Breathes All Day</h2>
      <p>Five-day tournaments demand lightweight, breathable poly-cotton blends. Look for 140–160gsm with ventilation zones at the back and underarms.</p>
      <h2>Trousers, Caps and Embroidery</h2>
      <ul><li><strong>Elasticated waist trousers</strong> with reinforced knees for diving fielders.</li><li><strong>Structured caps</strong> with embroidered crests, not printed ones that peel.</li><li><strong>Contrast piping</strong> in house colours for instant team identity.</li></ul>
      <blockquote>"Whites show everything — stitching quality cannot hide on a cricket kit."</blockquote>
      <h2>Ordering on Budget</h2>
      <p>Standardise sizes across age groups, order 10% spares, and combine junior and senior orders to cross bulk-discount thresholds.</p>`
  },
  'football-kits-last-longer': {
    cat: 'care', title: '10 Tips to Make Your School Football Kits Last Longer',
    date: 'September 20, 2026', read: '4 min read', author: 'rahul',
    img: 'https://i.pinimg.com/1200x/64/12/e5/6412e5685b1ca22b713b520d48eabd37.jpg',
    body: `
      <p>Schools replace kits far earlier than needed — usually from washing mistakes, not wear. These ten habits routinely double kit life.</p>
      <h2>Wash Right</h2>
      <ul><li>Cold machine wash at 30–40°C, jerseys turned inside-out.</li><li>Mild detergent only — never bleach or fabric softener on sublimated prints.</li><li>Wash within 24 hours of a match; dried sweat weakens fibres.</li></ul>
      <h2>Dry and Store Smart</h2>
      <p>Shade-dry, never tumble-dry. Store fully dry kits folded — hanging stretches collars over a summer break.</p>
      <blockquote>"90% of fading we see in returned kits comes from hot water and harsh detergent."</blockquote>`
  },
  'branding-boosts-performance': {
    cat: 'branding', title: 'Why Custom Team Branding Boosts School Sports Performance',
    date: 'September 15, 2026', read: '7 min read', author: 'arjun',
    img: 'https://i.pinimg.com/1200x/bb/11/11/bb1111e49ee86fa84ddf575bae299a60.jpg',
    body: `
      <p>Ask any coach: a team that looks united plays united. Sports psychology backs it — shared identity raises cohesion, accountability and effort.</p>
      <h2>Identity Drives Behaviour</h2>
      <p>Players in a proper branded kit report higher pride and lower dropout. For schools, that means better attendance at practice and stronger house loyalty.</p>
      <h2>What Good Branding Includes</h2>
      <ul><li>School crest on the chest — embroidered for prestige.</li><li>Consistent colours across every sport for one school identity.</li><li>Player names and numbers for ownership and recognition.</li></ul>
      <blockquote>"The day our kits arrived, practice attendance jumped. Coincidence? The coaches don't think so."</blockquote>`
  },
  'sportswear-trends-2026': {
    cat: 'trends', title: 'School Sportswear Trends Dominating 2026',
    date: 'September 10, 2026', read: '5 min read', author: 'meera',
    img: 'https://i.pinimg.com/736x/11/9d/6b/119d6b77ff00b50571ad1b2b01b79221.jpg',
    body: `
      <p>School sportswear in 2026 blends pro-level tech with bold school pride. Here is what leading schools are ordering.</p>
      <h2>Top 3 Shifts</h2>
      <ul><li><strong>Eco fabrics</strong> — recycled polyester kits are now price-competitive.</li><li><strong>Bold sublimation</strong> — gradients and geometric panels replace plain solids.</li><li><strong>Retro collars</strong> — polo-style collars return for cricket and football.</li></ul>
      <h2>Tech That Matters</h2>
      <p>Anti-odour finishes and UV-protective weaves top the request list from schools in hotter states.</p>`
  },
  'sports-day-budget': {
    cat: 'schools', title: 'How to Plan Your School Sports Day Kit Budget in 2026',
    date: 'September 5, 2026', read: '9 min read', author: 'rahul',
    img: 'https://i.pinimg.com/736x/db/5b/72/db5b725fe59693e6b7f8269cbed23c38.jpg',
    body: `
      <p>Sports day kits for hundreds of students can spiral without a plan. This budgeting framework keeps coordinators in control.</p>
      <h2>Count First, Price Later</h2>
      <p>Lock participant numbers per house and event before requesting quotes. A 10% buffer covers last-minute entries without rush fees.</p>
      <h2>Where the Money Goes</h2>
      <ul><li>House colour tees or bibs — the bulk of cost.</li><li>Caps and sashes for march-past squads.</li><li>Volunteer and referee kits — often forgotten.</li></ul>
      <blockquote>"Schools that finalise numbers early consistently save 15–20% versus rush orders."</blockquote>`
  },
  'basketball-jerseys-reversible': {
    cat: 'kits', title: 'Reversible vs. Standard Basketball Jerseys: Which is Right for Your School?',
    date: 'August 28, 2026', read: '5 min read', author: 'priya',
    img: 'https://i.pinimg.com/1200x/7e/23/b3/7e23b3a613791eb48aba29f3cec6d979.jpg',
    body: `
      <p>Reversible jerseys promise two kits in one. But are they right for your school? Cost, branding and durability all differ.</p>
      <h2>Reversible Pros and Cons</h2>
      <ul><li><strong>Pros:</strong> home + away in one garment, fewer items to manage.</li><li><strong>Cons:</strong> heavier fabric, limited embroidery options, higher per-unit cost.</li></ul>
      <h2>Our Recommendation</h2>
      <p>Schools playing frequent away fixtures: go reversible. Schools prioritising premium crest embroidery: choose standard single-side jerseys.</p>`
  },
  'football-checklist': {
    cat: 'kits', title: 'Football Kit Buying Checklist: 12 Things Schools Forget',
    date: 'August 22, 2026', read: '7 min read', author: 'arjun',
    img: 'https://i.pinimg.com/736x/94/37/d0/9437d0db2b66072d19cfbed2e3a542b8.jpg',
    body: `
      <p>Every season, orders get delayed by the same forgotten items. Run through this checklist before you approve any football order.</p>
      <h2>The Forgotten Five</h2>
      <ul><li>Socks in matching sizes — ordered last, delayed most.</li><li>Spare goalkeeper kit with padded shorts.</li><li>Trial and timing-chip-friendly fits for selections.</li><li>Extra sets in S and M — the fastest sizes to run out.</li><li>Crest files in vector format (SVG/AI) for clean embroidery.</li></ul>
      <blockquote>"Socks delay more school orders than any other single item."</blockquote>`
  },
  'wash-sublimated-jerseys': {
    cat: 'care', title: 'How to Wash Sublimated Jerseys Without Fading Colours',
    date: 'August 18, 2026', read: '5 min read', author: 'meera',
    img: 'https://i.pinimg.com/736x/72/66/cf/7266cf795ab8d16d4deb0d795eed57a2.jpg',
    body: `
      <p>Sublimation never cracks — but harsh washing still dulls it. This exact routine keeps prints vivid past 50 washes.</p>
      <h2>The Routine</h2>
      <ul><li>Cold wash (30°C), jersey inside-out, mild liquid detergent.</li><li>No bleach, no softener, no hot water — ever.</li><li>Shade-dry; direct harsh sun fades even sublimated colour over time.</li></ul>
      <h2>Stain Emergencies</h2>
      <p>Grass and mud: soak in cold salted water first, then wash normally. Never use hot water on protein stains.</p>`
  },
  'off-season-storage': {
    cat: 'care', title: 'Off-Season Kit Storage: Keep Kits Fresh for Next Year',
    date: 'August 12, 2026', read: '4 min read', author: 'rahul',
    img: 'https://i.pinimg.com/736x/cc/f1/20/ccf1202e1b509fdf98e3c1d225eebfca.jpg',
    body: `
      <p>Three idle months can ruin good kits — mildew, stretched collars and mystery odours. Store them right and skip replacement costs.</p>
      <h2>Fold, Don't Hang</h2>
      <p>Fold jerseys to protect collars and shoulders. Hang only blazers and track jackets.</p>
      <h2>Moisture Is the Enemy</h2>
      <ul><li>Store bone-dry kits only, with silica sachets in each bag.</li><li>Air kit bags monthly; wipe interiors with diluted vinegar.</li><li>Keep whites separate from coloured bibs to avoid dye transfer.</li></ul>`
  },
  'crest-placement': {
    cat: 'branding', title: 'School Crest Placement Rules Every Team Should Know',
    date: 'August 8, 2026', read: '6 min read', author: 'priya',
    img: 'https://i.pinimg.com/736x/af/be/b9/afbeb9983f705c56c5a16381b20dd207.jpg',
    body: `
      <p>Crest placement looks trivial until 200 jerseys arrive with badges in slightly different spots. Standardise these rules.</p>
      <h2>Position Standards</h2>
      <ul><li><strong>Left chest</strong> — the classic school position, 8–10cm wide.</li><li><strong>Centre chest</strong> — for clubs and senior teams wanting a bolder look.</li><li><strong>Sleeve or back collar</strong> — secondary marks, never the main crest.</li></ul>
      <h2>Embroidery vs Print</h2>
      <p>Embroidery signals prestige and lasts longest; sublimated crests suit complex multi-colour designs at lower cost.</p>`
  },
  'names-numbers-fonts': {
    cat: 'branding', title: 'Player Names & Numbers: Fonts That Last 50+ Washes',
    date: 'August 1, 2026', read: '5 min read', author: 'arjun',
    img: 'https://i.pinimg.com/1200x/e7/35/15/e735151d40279afb1b2b49dd4959251f.jpg',
    body: `
      <p>Peeling numbers embarrass teams mid-season. Font choice and application method decide whether names survive.</p>
      <h2>Fonts That Endure</h2>
      <ul><li><strong>Block and collegiate fonts</strong> — thick strokes resist cracking.</li><li>Avoid hairline scripts for heat-press applications.</li><li>Minimum 20cm back numbers for referee visibility.</li></ul>
      <h2>Application Methods</h2>
      <p>Sublimated names last longest; heat-press suits quick tournament turnarounds. Always test-wash one sample first.</p>`
  },
  'eco-fabrics': {
    cat: 'trends', title: 'Eco Fabrics in School Sport: Recycled Poly Explained',
    date: 'July 25, 2026', read: '6 min read', author: 'meera',
    img: 'https://i.pinimg.com/736x/12/1f/a1/121fa195c10b4442d98077fea63d559c.jpg',
    body: `
      <p>Recycled polyester has reached price parity with virgin poly — 200+ AcademyKit schools switched this year. What changes, and what doesn't?</p>
      <h2>Same Performance</h2>
      <p>Wicking, weight and print quality are identical — recycled yarn spins to the same 150gsm spec. Durability testing shows no difference across 50 washes.</p>
      <h2>Why Schools Switch</h2>
      <ul><li>Each kit recycles ~8 plastic bottles — a story students love.</li><li>Meets green-procurement norms many boards now prefer.</li><li>Negligible cost difference at 50+ units.</li></ul>`
  },
  'sublimation-graphics': {
    cat: 'trends', title: 'Bold Sublimation Graphics Schools Are Choosing in 2026',
    date: 'July 18, 2026', read: '4 min read', author: 'rahul',
    img: 'https://i.pinimg.com/736x/b2/6b/5d/b26b5da3588740b167af571a00f617bb.jpg',
    body: `
      <p>Plain solids are out. Tournament galleries this year belong to gradients, geometry and retro stripes — all made possible by full sublimation.</p>
      <h2>Winning Looks</h2>
      <ul><li><strong>Gradient fades</strong> — shoulder-to-hem colour transitions.</li><li><strong>Geometric side panels</strong> — sharp, modern, house-colour friendly.</li><li><strong>Retro chest bands</strong> — old-school stripes, new-school fabric.</li></ul>
      <h2>Design Rules</h2>
      <p>Keep numbers on solid panels for legibility, and limit palettes to three colours for cohesion.</p>`
  },
  'inter-house-budget': {
    cat: 'schools', title: 'Inter-House Tournaments: Kitting 4 Teams on a Budget',
    date: 'July 10, 2026', read: '8 min read', author: 'priya',
    img: 'https://i.pinimg.com/736x/46/b8/88/46b8887dd882c736cd6bab707ef07436.jpg',
    body: `
      <p>Four houses, four colours, one budget. Smart schools kit entire inter-house tournaments for the price of two full orders.</p>
      <h2>The Budget Formula</h2>
      <ul><li>House-colour tees (no names) + shared numbered bibs for fixtures.</li><li>Common shorts and socks across all houses.</li><li>One embroidered school kit reserved for the finals squad.</li></ul>
      <blockquote>"Bibs plus house tees cut our tournament kit spend by half."</blockquote>`
  },
  'sports-day-timeline': {
    cat: 'schools', title: 'Sports Day 2026: Complete Kit Planning Timeline',
    date: 'July 2, 2026', read: '9 min read', author: 'arjun',
    img: 'https://i.pinimg.com/1200x/5c/95/34/5c9534d93c259446665e189d4b89ac0c.jpg',
    body: `
      <p>Zero-stress sports days start 12 weeks out. Follow this week-by-week kit timeline used by 500+ schools.</p>
      <h2>The Timeline</h2>
      <ul><li><strong>Week 12–10:</strong> finalise designs, house colours and quantities.</li><li><strong>Week 9–6:</strong> approve mockups, place the order.</li><li><strong>Week 5–2:</strong> trial fittings, exchanges, march-past rehearsal kits.</li><li><strong>Race week:</strong> press, pack by house, and enjoy.</li></ul>
      <h2>Buffer Wisdom</h2>
      <p>Keep 10% spares and one open reorder slot — late admissions always arrive.</p>`
  },
  'athletic-wear-vs-pe-kits': {
    cat: 'trends', title: '5 Reasons Your School Athletes Need Proper Athletic Wear — Not Generic PE Kits',
    date: 'August 20, 2026', read: '6 min read', author: 'meera',
    img: 'https://i.pinimg.com/736x/91/b8/0e/91b80e7406465c439dceb0143954f0c8.jpg',
    body: `
      <p>Generic PE T-shirts are fine for warm-ups — but athletes training daily need engineered wear. Here is why schools upgrade.</p>
      <h2>Performance Differences</h2>
      <ul><li>Aerodynamic cuts reduce drag in sprints.</li><li>Four-way stretch supports full range of motion.</li><li>Flatlock seams prevent chafing over long sessions.</li></ul>
      <h2>Cost Per Wear</h2>
      <p>Proper athletic vests outlast basic tees 3:1, making them cheaper per training hour within a single academic year.</p>`
  },
  'sports-day-checklist-admin': {
    cat: 'schools', title: 'Annual Sports Day Preparation: A Complete Uniform Checklist for School Administrators',
    date: 'August 10, 2026', read: '7 min read', author: 'rahul',
    img: 'https://i.pinimg.com/736x/11/2a/07/112a079bd926dd48b9b72513b2ec221c.jpg',
    body: `
      <p>Administrators juggle budgets, vendors and hundreds of students before sports day. This checklist keeps uniform planning on rails.</p>
      <h2>Administrator Checklist</h2>
      <ul><li>Approve house-wise participant lists by week 10.</li><li>Confirm vendor delivery dates in writing.</li><li>Assign class teachers trial-fitting slots.</li><li>Reserve volunteer, referee and medical-team kits.</li></ul>
      <h2>Vendor Coordination</h2>
      <p>Single-vendor orders simplify accountability — one contact for misprints, size swaps and spares.</p>`
  }
};

const BLOG_CAT_ICONS = {
  kits: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7.5l3.2 2.3-1.2 3.7H10L8.8 9.8z"/><path d="M12 2.5V5M4.9 5.9l1.8 1.5M2.5 12H5M4.9 18.1l1.8-1.5M12 21.5V19M19.1 18.1l-1.8-1.5M21.5 12H19M19.1 5.9l-1.8 1.5"/></svg>',
  care: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 11h14l-1.8 9H6.8z"/><path d="M8.5 11 12 4l3.5 7"/><path d="M3 11h18"/></svg>',
  branding: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="12.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="11" r="1" fill="currentColor" stroke="none"/><path d="M15 20a4 4 0 0 0 4-4"/></svg>',
  trends: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg>',
  schools: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9.5 21v-3.5h5V21"/><path d="M12 9v4"/><path d="M12 4V2.5"/></svg>'
};

function renderBlogDetails() {
  const slug = new URLSearchParams(window.location.search).get('post');
  const post = BLOG_POSTS[slug] || BLOG_POSTS['choose-football-kit-2026'];
  const author = BLOG_AUTHORS[post.author];
  const catLabel = BLOG_CATS[post.cat] || post.cat;
  const catIcon = BLOG_CAT_ICONS[post.cat] || '';

  document.title = post.title + ' — AcademyKit Blog';
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', post.title + ' — AcademyKit Blog');

  const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
  const setImg = (id, src, alt) => { const el = document.getElementById(id); if (el) { el.src = src; el.alt = alt; } };

  const heroBg = document.getElementById('postHeroBg');
  if (heroBg) heroBg.style.backgroundImage = "url('" + post.img + "')";
  set('postCat', catIcon + ' ' + catLabel);
  set('postTitle', post.title);
  setImg('postAuthorImg', author.img, author.name);
  set('postAuthorName', 'By ' + author.name);
  set('postDate', post.date);
  set('postRead', post.read);
  const views = ((slug || 'choose-football-kit-2026').length * 137) % 40;
  set('postViews', (1.2 + views / 10).toFixed(1) + 'K views');
  setImg('postImg', post.img, post.title);

  const body = document.getElementById('postBody');
  if (body) {
    body.innerHTML = post.body;
    // anchor + TOC from headings
    const toc = document.getElementById('postToc');
    const heads = body.querySelectorAll('h2');
    heads.forEach((h, i) => { h.id = 'sec-' + i; });
    if (toc) {
      toc.innerHTML = Array.from(heads).map((h, i) =>
        '<a href="#sec-' + i + '" style="font-size:.875rem;color:var(--text-secondary);padding:6px 0;border-bottom:1px solid var(--border-color);transition:color .2s">' + h.textContent + '</a>'
      ).join('');
    }
  }

  setImg('postBioImg', author.img.replace('w=80', 'w=120'), author.name);
  set('postBioName', author.name);
  set('postBioRole', author.role);
  set('postBioBio', author.bio);

  // Related: same category first, then latest others
  const related = document.getElementById('relatedGrid');
  if (related) {
    const keys = Object.keys(BLOG_POSTS).filter(k => k !== (slug && BLOG_POSTS[slug] ? slug : 'choose-football-kit-2026'));
    const sameCat = keys.filter(k => BLOG_POSTS[k].cat === post.cat);
    const others = keys.filter(k => BLOG_POSTS[k].cat !== post.cat);
    const picks = sameCat.concat(others).slice(0, 3);
    related.innerHTML = picks.map((k, i) => {
      const p = BLOG_POSTS[k];
      const a = BLOG_AUTHORS[p.author];
      return '<article class="blog-card" data-reveal data-delay="' + (i + 1) + '">'
        + '<div class="blog-card-image"><img src="' + p.img + '" alt="' + p.title.replace(/"/g, '') + '" loading="lazy"/>'
        + '<div class="blog-card-cat">' + (BLOG_CAT_ICONS[p.cat] || '') + ' ' + (BLOG_CATS[p.cat] || '') + '</div></div>'
        + '<div class="blog-card-body"><div class="blog-meta"><div class="blog-meta-item">' + p.date + '</div>'
        + '<div class="blog-meta-item">' + p.read + '</div></div>'
        + '<h3 class="blog-card-title">' + p.title + '</h3>'
        + '<div class="blog-card-footer"><div class="blog-author"><img src="' + a.img.replace('w=80', 'w=60') + '" alt="" class="blog-author-img" loading="lazy"/><span class="blog-author-name">' + a.name + '</span></div>'
        + '<a href="blog-details.html?post=' + k + '" class="blog-read-more">Read</a></div></div></article>';
    }).join('');
    related.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
  }
}

document.addEventListener('DOMContentLoaded', renderBlogDetails);
