const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const scriptBlocks = content.match(/<script type="module">[\s\S]*?<\/script>/g) || [];
const scBlock = scriptBlocks.find(b => b.includes('specialCatsContainer') || b.includes('scRenderCard'));

if (!scBlock) {
  console.log("❌ Special Categories script block খুঁজে পাওয়া যায়নি।");
  process.exit(1);
}

let code = scBlock.replace(/<script type="module">/, '').replace(/<\/script>/, '');
code = code.replace(/^import.*$/gm, '');

function ref(db, path) { return { __path: path, __db: db }; }
function query(refObj, ...args) { return { ...refObj, __query: true }; }
function orderByChild(field) { return { __orderByChild: field }; }
function equalTo(val) { return { __equalTo: val }; }
function limitToFirst(n) { return { __limitToFirst: n }; }
function startAfter(v) { return { __startAfter: v }; }
function get(refObj) { return Promise.resolve(mockSnapshot(refObj)); }
function initializeApp(config, name) { return { __app: true, name: name || "[DEFAULT]" }; }
function getApps() { return []; }
function getDatabase(app) { return { __db: true, app }; }

function mockSnapshot(refObj) {
  const path = (refObj && refObj.__path) || "";
  if (path.includes("settings/specialCategories")) {
    return {
      val: () => ({
        cat1: { name: "Test Category A", slug: "test-slug-a", order: 1 },
        cat2: { name: "Test Category B", slug: "test-slug-b", order: 2 }
      })
    };
  }
  return {
    val: () => ({
      prod1: { status: "active", price: 100, stock: 5, title: "Test Product 1", images: { main: "https://example.com/a.jpg" }, categoryId: "test-slug-a" },
      prod2: { status: "active", price: 200, stock: 0, title: "Test Product 2", images: { main: "https://example.com/b.jpg" }, categoryId: "test-slug-a" }
    })
  };
}

function onValue(refObj, callback, opts) {
  try {
    const snap = mockSnapshot(refObj);
    callback(snap);
  } catch (e) {
    console.log("\n🔴 onValue callback-এর ভেতরে এরর পাওয়া গেছে:");
    console.log(e.stack || e.message);
  }
}

function makeElement(cls) {
  const el = {
    style: {},
    innerHTML: "",
    className: cls || "",
    classList: {
      add(c){ el.className += " " + c; },
      remove(c){ el.className = el.className.split(" ").filter(x => x !== c).join(" "); },
      toggle(c){}
    },
    children: [],
    _parent: null,
    addEventListener(){},
    appendChild(child){ child._parent = el; el.children.push(child); },
    querySelector(sel){
      const clsName = sel.replace(".", "");
      return el.children.find(c => (c.className || "").includes(clsName)) || null;
    },
    querySelectorAll(sel){ return []; },
    scrollIntoView(){},
    remove(){
      if(el._parent){
        el._parent.children = el._parent.children.filter(c => c !== el);
      }
    }
  };
  return el;
}

const specialCatsContainer = makeElement();
const specialCatProductSection = makeElement();
const specialCatCarousel = makeElement();

global.document = {
  getElementById(id) {
    if (id === "specialCatsContainer") return specialCatsContainer;
    if (id === "specialCatProductSection") return specialCatProductSection;
    if (id === "specialCatCarousel") return specialCatCarousel;
    return makeElement();
  },
  createElement(tag) { return makeElement(); },
  querySelectorAll(sel) { return []; }
};

global.localStorage = {
  getItem() { return null; },
  setItem() {}
};

global.window = {};

try {
  const fn = new Function(
    'initializeApp','getApps','getDatabase','ref','onValue','query','orderByChild','equalTo','limitToFirst','startAfter','get',
    'document','localStorage','window',
    code
  );
  fn(initializeApp, getApps, getDatabase, ref, onValue, query, orderByChild, equalTo, limitToFirst, startAfter, get, global.document, global.localStorage, global.window);
  console.log("\n✅ কোনো রানটাইম এরর পাওয়া যায়নি — কোড সম্পূর্ণভাবে চলেছে।");
  console.log("specialCatsContainer children সংখ্যা:", specialCatsContainer.children.length);
  console.log("specialCatCarousel children সংখ্যা:", specialCatCarousel.children.length);
} catch (e) {
  console.log("\n🔴 টপ-লেভেল এরর পাওয়া গেছে:");
  console.log(e.stack || e.message);
}
