const placeholderImage =
  'https://cdn.shopify.com/s/files/1/0994/8961/2147/files/xyla-temp-ai-cant-do-this-sticker-pack-black_98f6507a-854a-4894-8b47-fc5eac15f7cd.png?v=1779467738';

type MerchProduct = {
  title: string;
  handle: string;
  category: string;
  style: 'Clean Style' | 'Worker Style';
  audience: string;
  status: 'Coming Soon';
};

const merchProducts: MerchProduct[] = [
  { title: 'MERCH – AI CAN’T DO THIS Black T-Shirt', handle: 'merch-ai-can-t-do-this-black-t-shirt', category: 'Men’s Apparel', style: 'Clean Style', audience: 'Men / Unisex', status: 'Coming Soon' },
  { title: 'MERCH – AI CAN’T DO THIS Black Hoodie', handle: 'merch-ai-can-t-do-this-black-hoodie', category: 'Men’s Apparel', style: 'Clean Style', audience: 'Men / Unisex', status: 'Coming Soon' },
  { title: 'MERCH – AI CAN’T DO THIS Black Hat', handle: 'merch-ai-can-t-do-this-black-hat', category: 'Headwear', style: 'Clean Style', audience: 'Unisex', status: 'Coming Soon' },
  { title: 'MERCH – AI CAN’T DO THIS Black Beanie', handle: 'merch-ai-can-t-do-this-black-beanie', category: 'Headwear', style: 'Worker Style', audience: 'Unisex', status: 'Coming Soon' },
  { title: 'MERCH – AI CAN’T DO THIS Black Sleeveless Shirt', handle: 'merch-ai-can-t-do-this-black-sleeveless-shirt', category: 'Men’s Apparel', style: 'Worker Style', audience: 'Men / Unisex', status: 'Coming Soon' },
  { title: 'MERCH – AI CAN’T DO THIS Black Tank Top', handle: 'merch-ai-can-t-do-this-black-tank-top', category: 'Men’s Apparel', style: 'Worker Style', audience: 'Men / Unisex', status: 'Coming Soon' },
  { title: 'MERCH – AI CAN’T DO THIS Black Women’s Tank Top', handle: 'merch-ai-can-t-do-this-black-women-s-tank-top', category: 'Women’s Apparel', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Black Fitted T-Shirt', handle: 'women-ai-can-t-do-this-black-fitted-t-shirt', category: 'Women’s Apparel', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Black Racerback Tank', handle: 'women-ai-can-t-do-this-black-racerback-tank', category: 'Women’s Apparel', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Black Crop Tee', handle: 'women-ai-can-t-do-this-black-crop-tee', category: 'Women’s Apparel', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Black Long Sleeve', handle: 'women-ai-can-t-do-this-black-long-sleeve', category: 'Women’s Apparel', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Black Hoodie', handle: 'women-ai-can-t-do-this-black-hoodie', category: 'Women’s Apparel', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Black Work Leggings', handle: 'women-ai-can-t-do-this-black-work-leggings', category: 'Women’s Apparel', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Rugged Torn Tank', handle: 'women-ai-can-t-do-this-rugged-torn-tank', category: 'Women’s Apparel', style: 'Worker Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'MERCH – AI CAN’T DO THIS Vehicle Decal', handle: 'merch-ai-can-t-do-this-vehicle-decal', category: 'Vehicle Decals', style: 'Worker Style', audience: 'Vehicle', status: 'Coming Soon' },
  { title: 'MERCH – Put It On The Back Of America Vehicle Decal', handle: 'merch-put-it-on-the-back-of-america-vehicle-decal', category: 'Vehicle Decals', style: 'Worker Style', audience: 'Vehicle', status: 'Coming Soon' },
  { title: 'MERCH – Real Hands Real Skill Real Results Sticker Pack', handle: 'merch-real-hands-real-skill-real-results-sticker-pack', category: 'Sticker Packs', style: 'Worker Style', audience: 'Jobsite', status: 'Coming Soon' },
  { title: 'MERCH – Jobsite Hard Hat Sticker Pack', handle: 'merch-jobsite-hard-hat-sticker-pack', category: 'Sticker Packs', style: 'Worker Style', audience: 'Jobsite', status: 'Coming Soon' },
  { title: 'MEN – AI CAN’T DO THIS Clean Black Tumbler', handle: 'men-ai-can-t-do-this-clean-black-tumbler', category: 'Accessories', style: 'Clean Style', audience: 'Men', status: 'Coming Soon' },
  { title: 'MEN – AI CAN’T DO THIS Worker Black Tumbler', handle: 'men-ai-can-t-do-this-worker-black-tumbler', category: 'Accessories', style: 'Worker Style', audience: 'Men', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Clean Black Tumbler', handle: 'women-ai-can-t-do-this-clean-black-tumbler', category: 'Accessories', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Worker Black Tumbler', handle: 'women-ai-can-t-do-this-worker-black-tumbler', category: 'Accessories', style: 'Worker Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'MEN – AI CAN’T DO THIS Clean Belt Buckle', handle: 'men-ai-can-t-do-this-clean-belt-buckle', category: 'Accessories', style: 'Clean Style', audience: 'Men', status: 'Coming Soon' },
  { title: 'MEN – AI CAN’T DO THIS Worker Belt Buckle', handle: 'men-ai-can-t-do-this-worker-belt-buckle', category: 'Accessories', style: 'Worker Style', audience: 'Men', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Clean Belt Buckle', handle: 'women-ai-can-t-do-this-clean-belt-buckle', category: 'Accessories', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Worker Belt Buckle', handle: 'women-ai-can-t-do-this-worker-belt-buckle', category: 'Accessories', style: 'Worker Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'MEN – AI CAN’T DO THIS Clean Trucker Hat', handle: 'men-ai-can-t-do-this-clean-trucker-hat', category: 'Headwear', style: 'Clean Style', audience: 'Men', status: 'Coming Soon' },
  { title: 'MEN – AI CAN’T DO THIS Worker Trucker Hat', handle: 'men-ai-can-t-do-this-worker-trucker-hat', category: 'Headwear', style: 'Worker Style', audience: 'Men', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Clean Trucker Hat', handle: 'women-ai-can-t-do-this-clean-trucker-hat', category: 'Headwear', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Worker Trucker Hat', handle: 'women-ai-can-t-do-this-worker-trucker-hat', category: 'Headwear', style: 'Worker Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'MEN – AI CAN’T DO THIS Clean Keychain', handle: 'men-ai-can-t-do-this-clean-keychain', category: 'Accessories', style: 'Clean Style', audience: 'Men', status: 'Coming Soon' },
  { title: 'MEN – AI CAN’T DO THIS Worker Keychain', handle: 'men-ai-can-t-do-this-worker-keychain', category: 'Accessories', style: 'Worker Style', audience: 'Men', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Clean Keychain', handle: 'women-ai-can-t-do-this-clean-keychain', category: 'Accessories', style: 'Clean Style', audience: 'Women', status: 'Coming Soon' },
  { title: 'WOMEN – AI CAN’T DO THIS Worker Keychain', handle: 'women-ai-can-t-do-this-worker-keychain', category: 'Accessories', style: 'Worker Style', audience: 'Women', status: 'Coming Soon' }
];

const filters = ['All', 'Clean Style', 'Worker Style', 'Men’s Line', 'Women’s Line', 'Vehicle Decals', 'Sticker Packs', 'Accessories', 'Jobsite Gear'];

const sections = [
  { title: 'Featured Drop', subtitle: 'The first AI CAN’T DO THIS merch wave: shirts, stickers, decals, hats, and jobsite gear.', products: merchProducts.slice(0, 8) },
  { title: 'Clean Style', subtitle: 'Sharp black-and-gold merch for everyday wear, training, shows, and content.', products: merchProducts.filter((product) => product.style === 'Clean Style') },
  { title: 'Worker Style', subtitle: 'Rugged, worn-work, jobsite-forward gear for the people doing the real work.', products: merchProducts.filter((product) => product.style === 'Worker Style') },
  { title: 'Men’s Line', subtitle: 'Men’s and unisex shirts, hoodies, hats, tanks, tumblers, buckles, and keychains.', products: merchProducts.filter((product) => product.audience.includes('Men') || product.audience.includes('Unisex')) },
  { title: 'Women’s Line', subtitle: 'Women’s fitted shirts, tanks, crop tees, hoodies, leggings, trucker hats, tumblers, buckles, and keychains.', products: merchProducts.filter((product) => product.audience.includes('Women')) },
  { title: 'Vehicle Decals', subtitle: 'Truck, trailer, work van, and back-window decal concepts for the movement.', products: merchProducts.filter((product) => product.category === 'Vehicle Decals') },
  { title: 'Sticker Packs', subtitle: 'Hard-hat, toolbox, laptop, vehicle, shop, and jobsite sticker pack concepts.', products: merchProducts.filter((product) => product.category === 'Sticker Packs') },
  { title: 'Accessories', subtitle: 'Tumblers, belt buckles, keychains, and everyday carry merch concepts.', products: merchProducts.filter((product) => product.category === 'Accessories') },
  { title: 'Jobsite Gear', subtitle: 'Sticker packs, decals, hats, beanies, and rugged pieces made for field visibility.', products: merchProducts.filter((product) => product.audience === 'Jobsite' || product.audience === 'Vehicle' || product.style === 'Worker Style') }
];

function card(product: MerchProduct) {
  return (
    <article key={product.handle} className="merch-card" data-title={product.title.toLowerCase()} data-category={product.category} data-style={product.style} data-audience={product.audience}>
      <div className="image-shell">
        <img src={placeholderImage} alt={`${product.title} placeholder`} />
        <span>{product.status}</span>
      </div>
      <div className="card-body">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.title.replace('MERCH – ', '').replace('WOMEN – ', '').replace('MEN – ', '')}</h3>
        <div className="badges">
          <span>{product.style}</span>
          <span>{product.audience}</span>
        </div>
        <p className="handle">/{product.handle}</p>
        <a className="button ghost" href="/pages/contact">Request Drop Notification</a>
      </div>
    </article>
  );
}

function DropListBlock() {
  return (
    <aside className="drop-block">
      <div>
        <p className="eyebrow">Drop List</p>
        <h3>Want the first release?</h3>
        <p>Get notified before the first AI CAN’T DO THIS merch drop goes live.</p>
      </div>
      <a className="button" href="/pages/contact">Request Drop Notification</a>
    </aside>
  );
}

export const metadata = {
  title: 'Apparel & Gear | Epoxy Will Change Your Life',
  description: 'Coming-soon AI CAN’T DO THIS apparel, vehicle decals, stickers, and accessories.'
};

export default function MerchPage() {
  return (
    <main className="merch-page">
      <style>{`
        .merch-page{min-height:100vh;background:#050505;color:#fff;padding:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow:hidden}.hero{position:relative;min-height:72vh;display:grid;align-items:center;padding:80px 6vw;border-bottom:1px solid rgba(213,165,30,.55);background:radial-gradient(circle at 82% 22%,rgba(213,165,30,.32),transparent 22%),linear-gradient(90deg,rgba(5,5,5,.97),rgba(5,5,5,.72),rgba(5,5,5,.42)),url('${placeholderImage}') right center/contain no-repeat}.hero:after{content:'';position:absolute;inset:24px;border:1px solid rgba(213,165,30,.68);pointer-events:none}.hero-content{position:relative;z-index:1;max-width:980px}.eyebrow{margin:0 0 12px;color:#d5a51e;font-size:12px;font-weight:950;letter-spacing:.18em;text-transform:uppercase}.hero h1{margin:0 0 22px;font-size:clamp(52px,9vw,132px);line-height:.86;letter-spacing:-.07em;text-transform:uppercase}.gold{color:#d5a51e}.hero p.lede{max-width:850px;margin:0;color:#d7d7d7;font-size:clamp(18px,2vw,26px);font-weight:800;line-height:1.24;text-transform:uppercase}.actions{display:flex;gap:14px;flex-wrap:wrap;margin-top:32px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:14px 20px;border:1px solid #f3c545;background:linear-gradient(135deg,#b88a16,#f3c545,#8b6210);color:#050505!important;font-size:13px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}.button.ghost{background:#050505;color:#fff!important;border-color:rgba(255,255,255,.55)}.toolbar{position:sticky;top:0;z-index:2;display:grid;gap:16px;padding:18px 6vw;background:rgba(5,5,5,.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(213,165,30,.34)}.search{width:100%;box-sizing:border-box;border:1px solid rgba(213,165,30,.44);background:#0b0b0b;color:#fff;padding:15px 16px;border-radius:0;font-size:16px}.filters{display:flex;gap:10px;flex-wrap:wrap}.filter{border:1px solid rgba(255,255,255,.26);background:#101010;color:#fff;padding:10px 12px;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.filter:first-child{border-color:#d5a51e;color:#d5a51e}.section{padding:72px 6vw;border-bottom:1px solid rgba(213,165,30,.2);background:radial-gradient(circle at top right,rgba(213,165,30,.13),transparent 34%),#080808}.section:nth-of-type(odd){background:#050505}.section-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:30px}.section h2{margin:0;font-size:clamp(34px,5vw,76px);line-height:.9;text-transform:uppercase;letter-spacing:-.045em}.section p.summary{max-width:820px;margin:10px 0 0;color:#cfcfcf;font-size:18px;line-height:1.55}.count{color:#d5a51e;font-weight:950;text-transform:uppercase;white-space:nowrap}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.merch-card{border:1px solid rgba(213,165,30,.42);background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.018));min-height:100%;transition:transform .2s ease,border-color .2s ease}.merch-card:hover{transform:translateY(-4px);border-color:rgba(243,197,69,.88)}.image-shell{position:relative;aspect-ratio:1/1;background:#050505;overflow:hidden;border-bottom:1px solid rgba(213,165,30,.26)}.image-shell img{width:100%;height:100%;object-fit:cover;display:block}.image-shell span{position:absolute;left:12px;top:12px;background:#d5a51e;color:#050505;padding:7px 9px;font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.08em}.card-body{padding:20px}.card-body h3{margin:0;color:#fff;font-size:20px;line-height:1;text-transform:uppercase}.badges{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0}.badges span{border:1px solid rgba(255,255,255,.25);color:#e5e5e5;padding:7px 8px;font-size:11px;font-weight:800;text-transform:uppercase}.handle{margin:0 0 14px;color:#888;font-size:12px;word-break:break-all}.drop-block{display:flex;align-items:center;justify-content:space-between;gap:24px;margin:28px 0 0;padding:28px;border:1px solid rgba(213,165,30,.52);background:linear-gradient(90deg,#0b0b0b,#171004,#0b0b0b)}.drop-block h3{margin:0 0 8px;font-size:28px;text-transform:uppercase}.drop-block p{margin:0;color:#ccc}.final{padding:90px 6vw;background:linear-gradient(90deg,rgba(5,5,5,.96),rgba(5,5,5,.7)),url('${placeholderImage}') center/cover no-repeat}.final h2{margin:0;font-size:clamp(42px,7vw,96px);line-height:.9;text-transform:uppercase;letter-spacing:-.05em}.final p{max-width:840px;color:#d8d8d8;font-size:20px;line-height:1.5}.safety{margin-top:18px;color:#aaa;font-size:13px;max-width:900px}@media(max-width:1200px){.grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:850px){.hero{min-height:74vh;padding:64px 22px;background-position:center bottom;background-size:110vw auto}.toolbar{padding:16px 22px}.section,.final{padding:54px 22px}.section-head,.drop-block{display:block}.grid{grid-template-columns:1fr}.button{width:100%;box-sizing:border-box;margin-top:10px}.hero:after{inset:14px}}
      `}</style>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Apparel & Gear</p>
          <h1>AI CAN’T<br /><span className="gold">DO THIS</span><br />Gear</h1>
          <p className="lede">Work-ready apparel, vehicle decals, stickers, and accessories built for people who still believe real skill matters.</p>
          <div className="actions">
            <a className="button" href="/pages/contact">Request Drop Notification</a>
            <a className="button ghost" href="/pages/the-movement">Join the Movement</a>
          </div>
          <p className="safety">Coming-soon preview only. No checkout, no live pricing, no product availability claim.</p>
        </div>
      </section>

      <section className="toolbar" aria-label="Merch filters">
        <input className="search" type="search" placeholder="Search merch by name, style, audience, or category..." aria-label="Search merch" />
        <div className="filters">
          {filters.map((filter) => <button className="filter" key={filter} type="button">{filter}</button>)}
        </div>
      </section>

      {sections.map((section, index) => (
        <section className="section" key={section.title}>
          <div className="section-head">
            <div>
              <p className="eyebrow">{section.title}</p>
              <h2>{section.title}</h2>
              <p className="summary">{section.subtitle}</p>
            </div>
            <span className="count">{section.products.length} slots</span>
          </div>
          <div className="grid">{section.products.map(card)}</div>
          {(index + 1) % 2 === 0 ? <DropListBlock /> : null}
        </section>
      ))}

      <section className="final">
        <p className="eyebrow">First Drop</p>
        <h2>Get on the<br /><span className="gold">First Drop List.</span></h2>
        <p>The first merch drop is being built now. Stickers, vehicle decals, shirts, hats, tumblers, belt buckles, keychains, and rugged work gear are being prepared.</p>
        <a className="button" href="/pages/contact">Request Drop Notification</a>
      </section>
    </main>
  );
}
