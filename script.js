// ======= DATA & INIT =======
const daftarDonatur = [
  "Andi",
  "Budi",
  "Citra",
  "Dewi",
  "Eko",
  "Farah",
  "Gilang",
  "Hendra",
  "Indah",
  "Joko",
  "Kartika",
  "Lukman",
  "Maya",
  "Nadia",
  "Oka",
  "Putri",
  "Qori",
  "Rizky",
  "Sinta",
  "Taufik",
  "Umar",
  "Vina",
  "Wahyu",
  "Xena",
  "Yusuf",
  "Zahra",
];
let dataDonasi = [];
let sudahUploadHariIni = false;

// GANTI URL DI BAWAH INI DENGAN URL WEB APP ANDA
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzFeWPEZ_dP7qHaJsNVMTRUldSqfyRjRTYLN5yyfoAkbZOWTiLynkwISs9bn-Bsso6X2g/exec";

// ======= INISIALISASI =======
document.addEventListener("DOMContentLoaded", function () {
  // Set tanggal hari ini
  const tanggalHariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById(
    "tanggalHariIni"
  ).innerHTML = `<i class="fas fa-calendar-day mr-2 text-purple-500"></i>${tanggalHariIni}`;

  // Periksa status upload hari ini
  checkUploadStatus();

  // Muat dropdown donatur
  muatDropdown();

  // Tambahkan event listeners
  document.getElementById("btnTambah").addEventListener("click", tambahData);
  document
    .getElementById("btnUpload")
    .addEventListener("click", uploadToGoogleSheets);
});

// ======= FUNGSI UNTUK MEMERIKSA STATUS UPLOAD =======
function checkUploadStatus() {
  const lastUploadDate = localStorage.getItem("lastUploadDate");
  const today = new Date().toDateString();

  if (lastUploadDate === today) {
    sudahUploadHariIni = true;
    document.getElementById("btnUpload").disabled = true;
    document.getElementById("btnUpload").classList.add("upload-disabled");
    document.getElementById("uploadInfo").textContent =
      "Anda sudah melakukan upload hari ini. Upload hanya dapat dilakukan sekali per hari.";
    showUploadStatus("Anda sudah melakukan upload hari ini", false);
  } else {
    sudahUploadHariIni = false;
    document.getElementById("btnUpload").disabled = false;
    document.getElementById("btnUpload").classList.remove("upload-disabled");
    document.getElementById("uploadInfo").textContent =
      "Upload data donasi ke Google Sheets";
    showUploadStatus("Siap untuk upload data", null);
  }
}

// ======= UTILITY =======
function showNotification(message, isSuccess = true) {
  const notif = document.getElementById("notifikasi");
  notif.textContent = message;
  notif.className =
    "mb-4 md:mb-6 text-center p-3 md:p-4 rounded-xl transition-all duration-300 opacity-100 show";
  if (isSuccess) {
    notif.classList.add("bg-green-50", "border-green-200", "text-green-700");
  } else {
    notif.classList.add("bg-red-50", "border-red-200", "text-red-700");
  }
  setTimeout(() => {
    notif.classList.remove("show");
  }, 3000);
}

function showUploadStatus(message, isSuccess = null) {
  const status = document.getElementById("uploadStatus");
  status.textContent = message;
  status.className =
    "text-center p-4 rounded-xl transition-all duration-300 opacity-100 show";
  if (isSuccess === true)
    status.classList.add("bg-green-50", "border-green-200", "text-green-700");
  else if (isSuccess === false)
    status.classList.add("bg-red-50", "border-red-200", "text-red-700");
  else status.classList.add("bg-blue-50", "border-blue-200", "text-blue-700");
}

// ======= MUAT DROPDOWN =======
function muatDropdown() {
  const select = document.getElementById("donatur");
  select.innerHTML = "";
  daftarDonatur.forEach((nama) => select.add(new Option(nama, nama)));
  document.getElementById("btnTambah").disabled = false;
  document.getElementById("btnText").textContent = "Tambah";
  document.getElementById("pemasukan").disabled = false;
}

// ======= TAMBAH DATA =======
function tambahData() {
  const donatur = document.getElementById("donatur").value;
  const nominal = document.getElementById("pemasukan").value;
  if (nominal === "") {
    showNotification("Nominal tidak boleh kosong", false);
    return;
  }
  const tanggal = new Date().toLocaleDateString("id-ID");
  dataDonasi.push({ donatur, nominal, tanggal });

  const tbody = document.querySelector("#tabelDonasi tbody");
  const row = tbody.insertRow();
  row.className = "table-row";

  const donaturCell = row.insertCell(0);
  donaturCell.className = "py-3 md:py-4 px-4 md:px-6";
  donaturCell.textContent = donatur;

  const nominalCell = row.insertCell(1);
  nominalCell.className = "py-3 md:py-4 px-4 md:px-6 text-right font-mono";
  nominalCell.textContent = "Rp " + Number(nominal).toLocaleString("id-ID");

  const aksiCell = row.insertCell(2);
  aksiCell.className = "py-3 md:py-4 px-4 md:px-6 text-center";
  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.className =
    "bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition duration-200 mx-1";
  editBtn.title = "Edit donasi";
  editBtn.addEventListener("click", () => editRow(row));
  aksiCell.appendChild(editBtn);

  const select = document.getElementById("donatur");
  select.remove(select.selectedIndex);

  if (select.options.length === 0) {
    document.getElementById("btnTambah").disabled = true;
    document.getElementById("btnText").textContent = "Selesai";
    showNotification("✅ Semua donatur sudah diinput");
    document.getElementById("pemasukan").disabled = true;
  } else showNotification(`✅ Donasi ${donatur} berhasil ditambahkan`);

  document.getElementById("pemasukan").value = "";
  hitungTotal();
}

// ======= HITUNG TOTAL =======
function hitungTotal() {
  let total = 0;
  document.querySelectorAll("#tabelDonasi tbody tr").forEach((row) => {
    const text = row.cells[1].textContent.replace(/[Rp\s.]/g, "");
    total += Number(text);
  });
  const formatted = "Rp " + total.toLocaleString("id-ID");
  document.getElementById("totalDonasi").textContent = formatted;
  document.getElementById("totalDonasiMobile").textContent = formatted;
}

// ======= EDIT & SAVE =======
function editRow(row) {
  const nominalCell = row.cells[1];
  const aksiCell = row.cells[2];
  const currentNominal = nominalCell.textContent.replace(/[Rp\s.]/g, "");
  nominalCell.innerHTML = `<input type="number" id="editInput" value="${currentNominal}" min="0" class="w-24 md:w-32 px-3 py-2 border border-gray-300 rounded text-right font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500">`;
  aksiCell.innerHTML = "";
  const saveBtn = document.createElement("button");
  saveBtn.innerHTML = `<i class="fas fa-check"></i>`;
  saveBtn.className =
    "bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg mx-1 transition duration-200";
  saveBtn.addEventListener("click", () => saveRow(row));
  aksiCell.appendChild(saveBtn);
}

function saveRow(row) {
  const newValue = document.getElementById("editInput").value;
  if (newValue === "") {
    showNotification("Nominal tidak boleh kosong", false);
    return;
  }
  row.cells[1].textContent = "Rp " + Number(newValue).toLocaleString("id-ID");
  hitungTotal();
  showNotification(`✅ Donasi ${row.cells[0].textContent} berhasil diperbarui`);
  const aksiCell = row.cells[2];
  aksiCell.innerHTML = "";
  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;
  editBtn.className =
    "bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg mx-1 transition duration-200";
  editBtn.addEventListener("click", () => editRow(row));
  aksiCell.appendChild(editBtn);
}

// ======= UPLOAD =======
function uploadToGoogleSheets() {
  // Cek apakah sudah upload hari ini
  if (sudahUploadHariIni) {
    showUploadStatus(
      "Anda sudah melakukan upload hari ini. Upload hanya dapat dilakukan sekali per hari.",
      false
    );
    return;
  }

  const scriptURL = GOOGLE_SCRIPT_URL;
  if (!scriptURL || scriptURL === "[GANTI DENGAN URL WEB APP ANDA]") {
    showUploadStatus("URL Web App belum diatur", false);
    return;
  }
  if (dataDonasi.length === 0) {
    showUploadStatus("Tidak ada data untuk diupload", false);
    return;
  }
  showUploadStatus("Mengupload data ke Google Sheets...", null);
  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: dataDonasi }),
  })
    .then(() => {
      // Set status upload hari ini
      const today = new Date().toDateString();
      localStorage.setItem("lastUploadDate", today);
      sudahUploadHariIni = true;

      // Nonaktifkan tombol upload
      document.getElementById("btnUpload").disabled = true;
      document.getElementById("btnUpload").classList.add("upload-disabled");
      document.getElementById("uploadInfo").textContent =
        "Anda sudah melakukan upload hari ini. Upload hanya dapat dilakukan sekali per hari.";

      showUploadStatus(
        "✅ Data berhasil diupload ke Google Sheets (hanya dapat upload sekali per hari)",
        true
      );
      dataDonasi = [];
      hitungTotal();
    })
    .catch((err) => {
      showUploadStatus("❌ Gagal mengirim data: " + err, false);
    });
}
