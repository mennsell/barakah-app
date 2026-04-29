// Navigasi Antar Tab
function switchTab(tabId, btnIndex) {
    // Sembunyikan semua tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    // Tampilkan tab target
    document.getElementById('tab-' + tabId).classList.add('active');

    // Ubah status tombol aktif di navigasi
    document.querySelectorAll('.nav-btn').forEach((btn, index) => {
        if(index === btnIndex) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ==========================================
// Fitur AI Advisor (Simulasi)
// ==========================================

function toggleKey() {
    const form = document.getElementById('key-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function saveKey() {
    const key = document.getElementById('key-inp').value;
    if(key) {
        alert('API Key berhasil disimpan di sesi ini!');
        toggleKey();
    } else {
        alert('Mohon masukkan API Key terlebih dahulu.');
    }
}

function askQ(text) {
    document.getElementById('cinp').value = text;
    sendMsg();
}

function handleKey(event) {
    // Kirim pesan jika user menekan tombol Enter
    if(event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMsg();
    }
}

function sendMsg() {
    const input = document.getElementById('cinp');
    const text = input.value.trim();
    if(!text) return;

    const msgs = document.getElementById('msgs');
    
    // Render gelembung pesan user
    msgs.innerHTML += `
        <div class="msg user">
            <div class="bubble">${text}</div>
        </div>
    `;
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight; // Auto-scroll ke bawah

    // Simulasi respons bot (AI) dengan jeda 1 detik
    setTimeout(() => {
        msgs.innerHTML += `
            <div class="msg bot">
                <div class="mav">☽</div>
                <div class="bubble">Ini adalah simulasi respon AI. Untuk jawaban sesungguhnya, aplikasikan integrasi endpoint API Azure OpenAI atau model LLM lain di sisi backend.</div>
            </div>
        `;
        msgs.scrollTop = msgs.scrollHeight;
    }, 1000);
}

// ==========================================
// Fitur Kalkulator Zakat
// ==========================================

function updateZForm() {
    const type = document.getElementById('ztype').value;
    document.getElementById('zmaal').style.display = type === 'maal' ? 'block' : 'none';
    document.getElementById('zemas').style.display = type === 'emas' ? 'block' : 'none';
    document.getElementById('zperak').style.display = type === 'perak' ? 'block' : 'none';
    document.getElementById('zdagang').style.display = type === 'dagang' ? 'block' : 'none';
}

function formatRp(angka) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(angka);
}

function hitungZakat() {
    const type = document.getElementById('ztype').value;
    let harta = 0;
    let nisab = 0;
    let nisabName = '';

    if(type === 'maal') {
        const tabungan = parseFloat(document.getElementById('z-tab').value) || 0;
        const utang = parseFloat(document.getElementById('z-utang').value) || 0;
        const hemas = parseFloat(document.getElementById('z-hemas').value) || 0;
        harta = tabungan - utang;
        nisab = 85 * hemas;
        nisabName = '85 gram emas';
    } else if(type === 'emas') {
        const berat = parseFloat(document.getElementById('z-gems').value) || 0;
        const hemas = parseFloat(document.getElementById('z-hemas2').value) || 0;
        harta = berat * hemas;
        nisab = 85 * hemas;
        nisabName = '85 gram emas';
    } else if(type === 'perak') {
        const berat = parseFloat(document.getElementById('z-gperak').value) || 0;
        const hperak = parseFloat(document.getElementById('z-hperak').value) || 0;
        harta = berat * hperak;
        nisab = 595 * hperak;
        nisabName = '595 gram perak';
    } else if(type === 'dagang') {
        const aset = parseFloat(document.getElementById('z-aset').value) || 0;
        const piu = parseFloat(document.getElementById('z-piu').value) || 0;
        const ud = parseFloat(document.getElementById('z-ud').value) || 0;
        const hemas = 1500000; // Asumsi harga emas default untuk perniagaan
        harta = (aset + piu) - ud;
        nisab = 85 * hemas;
        nisabName = '85 gram emas';
    }

    const isWajib = harta >= nisab;
    const zakat = isWajib ? harta * 0.025 : 0; // Tarif 2.5%
    const persentase = nisab > 0 ? Math.min((harta / nisab) * 100, 100) : 0;

    // Render Hasil ke UI
    document.getElementById('zrows').innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom: 8px;"><span>Total Harta Bersih:</span> <strong>${formatRp(harta)}</strong></div>
        <div style="display:flex; justify-content:space-between; margin-bottom: 8px;"><span>Batas Nisab (${nisabName}):</span> <strong>${formatRp(nisab)}</strong></div>
    `;
    document.getElementById('zamount').innerText = formatRp(zakat);
    
    document.getElementById('zstatus').innerHTML = isWajib
        ? `<div style="color:var(--g800); font-weight:600; margin-top:10px;">✅ Wajib Zakat (Harta telah mencapai nisab)</div>`
        : `<div style="color:#b91c1c; font-weight:600; margin-top:10px;">❌ Belum Wajib Zakat (Harta di bawah nisab)</div>`;
        
    document.getElementById('zprog').style.width = persentase + '%';
    document.getElementById('zprog').style.background = isWajib ? 'var(--g600)' : '#f59e0b';
}

// ==========================================
// Fitur Kalkulator Mudharabah / Musyarakah
// ==========================================

function updateAkad() {
    const akad = document.getElementById('akad').value;
    document.getElementById('mform').style.display = akad === 'mudharabah' ? 'block' : 'none';
    document.getElementById('msform').style.display = akad === 'musyarakah' ? 'block' : 'none';
}

function syncN(source) {
    if(source === 'sm') {
        const sm = parseFloat(document.getElementById('m-nsm').value) || 0;
        document.getElementById('m-nmb').value = 100 - sm;
    } else {
        const mb = parseFloat(document.getElementById('m-nmb').value) || 0;
        document.getElementById('m-nsm').value = 100 - mb;
    }
}

function hitungBH() {
    const akad = document.getElementById('akad').value;
    let porsiA = 0;
    let porsiB = 0;
    let lblA = '';
    let lblB = '';
    let pctA = 0;
    let pctB = 0;

    if(akad === 'mudharabah') {
        const profit = parseFloat(document.getElementById('m-profit').value) || 0;
        pctA = parseFloat(document.getElementById('m-nsm').value) || 0;
        pctB = parseFloat(document.getElementById('m-nmb').value) || 0;
        porsiA = profit * (pctA / 100);
        porsiB = profit * (pctB / 100);
        lblA = 'Shahibul Maal';
        lblB = 'Mudharib';
    } else {
        const modalA = parseFloat(document.getElementById('ms-a').value) || 0;
        const modalB = parseFloat(document.getElementById('ms-b').value) || 0;
        const profit = parseFloat(document.getElementById('ms-profit').value) || 0;
        const totalModal = modalA + modalB;

        if(totalModal > 0) {
            pctA = (modalA / totalModal) * 100;
            pctB = (modalB / totalModal) * 100;
            porsiA = profit * (pctA / 100);
            porsiB = profit * (pctB / 100);
        }
        lblA = 'Pihak A';
        lblB = 'Pihak B';
    }

    // Update UI Visualisasi
    document.getElementById('lbl-a').innerText = lblA + ` (${pctA.toFixed(0)}%)`;
    document.getElementById('lbl-b').innerText = lblB + ` (${pctB.toFixed(0)}%)`;
    document.getElementById('sub-a').innerText = `Bagian ${lblA}`;
    document.getElementById('sub-b').innerText = `Bagian ${lblB}`;

    document.getElementById('bar-a').style.width = pctA + '%';
    document.getElementById('bar-b').style.width = pctB + '%';

    document.getElementById('pa').innerText = formatRp(porsiA);
    document.getElementById('pb').innerText = formatRp(porsiB);
}

// Inisialisasi otomatis untuk memastikan UI state sinkron dengan pilihan form
window.onload = () => {
    updateZForm();
    updateAkad();
};
