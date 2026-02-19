// --- LOGIC NAMA TAMU (URL PARAM) ---
document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get('to');
    const elSapaan = document.getElementById("sapaan");
    const listNamaTamu = document.querySelectorAll(".nama-tamu-tampilan");
    
    const namaBersih = namaTamu ? decodeURIComponent(namaTamu).replace(/\+/g, ' ') : "";

    if (namaBersih !== "") { 
        // JIKA ADA NAMA (?to=...)
        if(elSapaan) elSapaan.innerText = "Yth"; 
        listNamaTamu.forEach(el => {
            el.innerText = namaBersih;
            el.style.fontWeight = "bold"; // Tambahkan tebal jika ada nama
        }); 
    } else { 
        // JIKA TIDAK ADA NAMA (Kosong)
        if(elSapaan) elSapaan.innerText = ""; 
        listNamaTamu.forEach(el => {
            el.innerText = "Bapak/Ibu/Saudara/i";
            el.style.fontWeight = "normal"; // Pastikan TIDAK tebal jika kosong
        }); 
    }
});

// --- AOS INITIALIZATION ---
AOS.init();

// --- BUKA UNDANGAN & PLAY MUSIC ---
function bukaUndangan() {
    document.getElementById('overlay-container').classList.add('overlay-hidden');
    document.body.style.overflow = 'auto';
    document.body.classList.remove('overflow-hidden');
    const song = document.getElementById('mySong');
    song.play().catch(e => console.log("Audio play blocked by browser"));
}

// --- COUNTDOWN LOGIC ---
const weddingDate = new Date("March 28, 2026 08:00:00").getTime();
const countdownFunction = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    
    const daysEl = document.getElementById("days");
    if(daysEl) {
        daysEl.innerHTML = d.toString().padStart(2, '0');
        document.getElementById("hours").innerHTML = h.toString().padStart(2, '0');
        document.getElementById("minutes").innerHTML = m.toString().padStart(2, '0');
        document.getElementById("seconds").innerHTML = s.toString().padStart(2, '0');
    }
    
    if(distance < 0) {
        clearInterval(countdownFunction);
        const container = document.querySelector(".countdown-container");
        if(container) container.innerHTML = "HARI BAHAGIA TELAH TIBA!";
    }
}, 1000);

// --- GOOGLE SHEETS INTEGRATION ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbz_kakR_6ST6QCO8VWNQMLX87SNTqqjsdmDwexyy3qdThYu_oMS0vCq94BQp9rt-XV_jg/exec';
const form = document.querySelector('#form-ucapan');
const btnKirim = document.querySelector('#btnKirim');

if(form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        btnKirim.disabled = true;
        btnKirim.innerText = "Mengirim...";
        fetch(scriptURL, {
            method: 'POST',
            body: new FormData(form)
        }).then(() => {
            alert("Terima kasih atas ucapannya!");
            btnKirim.disabled = false;
            btnKirim.innerText = "Kirim Ucapan";
            form.reset();
            muatUcapan();
        }).catch(err => {
            console.error(err);
            btnKirim.disabled = false;
            btnKirim.innerText = "Kirim Ucapan";
        });
    });
}

function muatUcapan() {
    fetch(scriptURL).then(res => res.json()).then(data => {
        const wadah = document.querySelector('#daftar-ucapan');
        if(!wadah) return;
        wadah.innerHTML = '';
        
        if(!data || data.length === 0) {
            wadah.innerHTML = '<p class="text-gray-500 italic text-center">Belum ada ucapan.</p>';
            return;
        }

        const opsiTanggal = { day: 'numeric', month: 'long' };
        const opsiWaktu = { hour: '2-digit', minute: '2-digit', hour12: false };

        data.reverse().forEach(row => {
            if (row[4] !== 'yes') {
                return; 
            }

            let formatWaktu = "";
            if(row[3]) {
                const d = new Date(row[3]);
                const tgl = new Intl.DateTimeFormat('id-ID', opsiTanggal).format(d);
                const jam = new Intl.DateTimeFormat('id-ID', opsiWaktu).format(d).replace(':', '.');
                formatWaktu = `${tgl}, ${jam}`;
            }

            wadah.innerHTML += `
            <div class="item-ucapan mb-4 p-3 border-l-4 border-[#719B6E] bg-white shadow-sm">
                <div class="flex justify-between items-center">
                    <strong class="text-[var(--sisi-komen)] text-sm">${row[0]}</strong>
                    <span class="text-[10px] text-gray-400 font-mono">${formatWaktu}</span>
                </div>
                <div class="text-[10px] inline-block px-2 py-0.5 rounded bg-gray-50 text-gray-500 mb-1">
                    ${row[1]}
                </div>
                <p class="text-gray-700 text-sm leading-relaxed">${row[2]}</p>
            </div>`;
        });
    });
}

// Panggil fungsi muat ucapan pertama kali
muatUcapan();

// --- WHATSAPP REDIRECT ---
function kirimWA() {
    const text = encodeURIComponent("Halo Maya & Fajar, saya ingin mengonfirmasi kehadiran di pernikahan kalian...");
    window.open(`https://wa.me/6281371744048?text=${text}`);
}

// --- WATERMARK FLOWER ANIMATION ---
const containers = document.querySelectorAll('.watermark-container');
const flowerIcons = ['🌸', '🌼', '🌻', '🌺', '🌷'];
const density = 0.001;

containers.forEach(container => {
    const rect = container.getBoundingClientRect();
    const area = rect.width * rect.height;
    const numberOfFlowers = Math.floor(area * density);
    for(let i = 0; i < numberOfFlowers; i++) {
        const span = document.createElement('span');
        span.innerText = flowerIcons[Math.floor(Math.random() * flowerIcons.length)];
        span.style.position = 'absolute';
        span.style.fontSize = (Math.random() * 20 + 20) + 'px';
        span.style.opacity = '0.1';
        span.style.zIndex = '0';
        span.style.pointerEvents = 'none';
        span.style.userSelect = 'none';
        span.style.top = Math.random() * 100 + '%';
        span.style.left = Math.random() * 100 + '%';
        span.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(span);
    }
});

// --- INTERSECTION OBSERVER (SCROLL ANIMATION) ---
document.addEventListener("DOMContentLoaded", function() {
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const targets = document.querySelectorAll('.desktop-row');
    targets.forEach(target => {
        observer.observe(target);
    });
});