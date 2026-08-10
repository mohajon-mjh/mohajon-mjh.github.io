const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

function replaceOnce(oldStr, newStr, label){
  if(!html.includes(oldStr)){
    console.log("❌ মিলছে না: " + label);
    process.exit(1);
  }
  html = html.replace(oldStr, newStr);
  console.log("✅ " + label);
}

replaceOnce(
  `    <div id="fsc-add-section" style="display:none">
      <p style="font-size:13px;color:#aaa">গ্যালারি/স্টোরেজ থেকে একাধিক ছবি সিলেক্ট করুন (.png ফাইলনাম অনুযায়ী নাম অটো বসবে)</p>
      <input type="file" id="fsc-add-file-input" accept="image/*" multiple>
      <div id="fsc-add-list"></div>`,
  `    <div id="fsc-add-section" style="display:none">
      <p style="font-size:13px;color:#aaa">গ্যালারি/স্টোরেজ থেকে একাধিক ছবি সিলেক্ট করুন (.png ফাইলনাম অনুযায়ী নাম অটো বসবে)</p>
      <input type="file" id="fsc-add-file-input" accept="image/*" multiple>

      <div style="margin:12px 0;padding:10px;background:#1a1a1a;border-radius:8px">
        <label style="display:block;margin-bottom:8px"><input type="checkbox" id="fsc-add-select-all"> সব সিলেক্ট করুন</label>
        <button id="fsc-add-save-all-btn" class="save-btn">💾 সিলেক্টেড সব Save</button>
        <span id="fsc-add-save-status" style="font-size:13px;color:#8f8;margin-left:8px"></span>

        <div style="margin-top:14px">
          <label>প্রাইস লিস্ট পেস্ট করুন (প্রতি লাইনে: নাম — সাইজ — ৳দাম)
            <textarea id="fsc-price-paste" rows="6" placeholder="MJH Biryani Masala — 200GM — ৳220"></textarea>
          </label>
          <button id="fsc-price-apply-btn" class="save-btn">✅ প্রাইস বসান (নাম মিলিয়ে)</button>
          <span id="fsc-price-status" style="font-size:13px;color:#8f8;display:block;margin-top:6px"></span>
        </div>
      </div>

      <div id="fsc-add-list"></div>`,
  '(১) Flash Sale Add সেকশনে টুলবার যোগ হয়েছে'
);

replaceOnce(
  `    <div id="dotd-add-section" style="display:none">
      <p style="font-size:13px;color:#aaa">গ্যালারি/স্টোরেজ থেকে একাধিক ছবি সিলেক্ট করুন (.png ফাইলনাম অনুযায়ী নাম অটো বসবে)</p>
      <input type="file" id="dotd-add-file-input" accept="image/*" multiple>
      <div id="dotd-add-list"></div>`,
  `    <div id="dotd-add-section" style="display:none">
      <p style="font-size:13px;color:#aaa">গ্যালারি/স্টোরেজ থেকে একাধিক ছবি সিলেক্ট করুন (.png ফাইলনাম অনুযায়ী নাম অটো বসবে)</p>
      <input type="file" id="dotd-add-file-input" accept="image/*" multiple>

      <div style="margin:12px 0;padding:10px;background:#1a1a1a;border-radius:8px">
        <label style="display:block;margin-bottom:8px"><input type="checkbox" id="dotd-add-select-all"> সব সিলেক্ট করুন</label>
        <button id="dotd-add-save-all-btn" class="save-btn">💾 সিলেক্টেড সব Save</button>
        <span id="dotd-add-save-status" style="font-size:13px;color:#8f8;margin-left:8px"></span>

        <div style="margin-top:14px">
          <label>প্রাইস লিস্ট পেস্ট করুন (প্রতি লাইনে: নাম — সাইজ — ৳দাম)
            <textarea id="dotd-price-paste" rows="6" placeholder="MJH Biryani Masala — 200GM — ৳220"></textarea>
          </label>
          <button id="dotd-price-apply-btn" class="save-btn">✅ প্রাইস বসান (নাম মিলিয়ে)</button>
          <span id="dotd-price-status" style="font-size:13px;color:#8f8;display:block;margin-top:6px"></span>
        </div>
      </div>

      <div id="dotd-add-list"></div>`,
  '(২) Deals of the Day Add সেকশনে টুলবার যোগ হয়েছে'
);

fs.writeFileSync('admin.html', html, 'utf8');
console.log("✅ সব HTML প্যাচ সম্পন্ন");
