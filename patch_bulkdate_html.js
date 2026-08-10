const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

const oldStr = `        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <label style="margin:0">% <input type="number" id="fsc-bulk-discount" min="0" max="100" style="width:70px" placeholder="%"></label>
          <button id="fsc-bulk-apply-btn" class="save-btn">✅ সিলেক্টেডে % বসান</button>
          <button id="fsc-bulk-save-btn" class="save-btn">💾 সিলেক্টেড Save</button>
          <button id="fsc-bulk-action-btn" class="danger-btn">🗑️ সিলেক্টেড রিমুভ</button>
        </div>`;

const newStr = `        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <label style="margin:0">% <input type="number" id="fsc-bulk-discount" min="0" max="100" style="width:70px" placeholder="%"></label>
          <button id="fsc-bulk-apply-btn" class="save-btn">✅ সিলেক্টেডে % বসান</button>
          <button id="fsc-bulk-save-btn" class="save-btn">💾 সিলেক্টেড Save</button>
          <button id="fsc-bulk-action-btn" class="danger-btn">🗑️ সিলেক্টেড রিমুভ</button>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px">
          <label style="margin:0">শুরুর তারিখ <input type="text" id="fsc-bulk-startdate" style="width:130px" placeholder="dd-mm-yyyy"></label>
          <label style="margin:0">শেষের তারিখ <input type="text" id="fsc-bulk-enddate" style="width:130px" placeholder="dd-mm-yyyy"></label>
          <button id="fsc-bulk-date-apply-btn" class="save-btn">📅 সিলেক্টেডে তারিখ বসান</button>
        </div>`;

if(!html.includes(oldStr)){
  console.log("❌ মিলছে না");
  process.exit(1);
}
html = html.replace(oldStr, newStr);
fs.writeFileSync('admin.html', html, 'utf8');
console.log("✅ বাল্ক ডেট ইনপুট + বাটন HTML-এ যোগ হয়েছে");
