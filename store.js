// Store: localStorage-backed simulation for SIAP Loktuan
// Entities: parcels, archives, parties, audits, draft
// All data resets via window.SIADP.resetSimulation()

(function () {
  const KEY = "siap_v3_state";

  // ---------------- seed data ----------------
  function seed() {
    const today = new Date();
    const iso = (d) => d.toISOString();
    const daysAgo = (n) => {
      const d = new Date(today);
      d.setDate(d.getDate() - n);
      return iso(d);
    };

    let parcels = [
      {
        id: "p-001",
        kode: "LKT-04-02-2018-001",
        nop: "65.71.030.012.001-0124.0",
        rt: "04", rw: "02",
        alamat: "Jl. Mayjend Sutoyo Gg. Melati No. 12",
        luas: 240,
        pemilikAwal: "H. Abdul Rahman",
        pemilikSaatIni: "Siti Aminah",
        status: "terarsip",
        tanggalDaftar: daysAgo(2400),
        batas: { utara: "Tanah Bpk. Sugianto", selatan: "Jl. Melati", timur: "Tanah Ny. Halimah", barat: "Saluran irigasi" },
      },
      {
        id: "p-002",
        kode: "LKT-04-02-2019-007",
        nop: "65.71.030.012.001-0211.0",
        rt: "04", rw: "02",
        alamat: "Jl. Mayjend Sutoyo Gg. Melati No. 18",
        luas: 312,
        pemilikAwal: "Marwan Idris",
        pemilikSaatIni: "Marwan Idris",
        status: "terarsip",
        tanggalDaftar: daysAgo(1900),
        batas: { utara: "Jalan setapak", selatan: "Tanah Bpk. Yusuf", timur: "Tanah kosong", barat: "Tanah Bpk. Andi" },
      },
      {
        id: "p-003",
        kode: "LKT-06-03-2020-014",
        nop: "65.71.030.014.003-0088.0",
        rt: "06", rw: "03",
        alamat: "Jl. Sangatta KM 3, RT 06",
        luas: 540,
        pemilikAwal: "PT Bumi Loktuan Lestari",
        pemilikSaatIni: "Hendra Wijaya",
        status: "terarsip",
        tanggalDaftar: daysAgo(1500),
        batas: { utara: "Sungai kecil", selatan: "Jl. Sangatta", timur: "Tanah PT BLL", barat: "Tanah Bpk. Joko" },
      },
      {
        id: "p-004",
        kode: "LKT-02-01-2021-003",
        nop: "65.71.030.011.002-0045.0",
        rt: "02", rw: "01",
        alamat: "Jl. Yos Sudarso, Loktuan RT 02",
        luas: 180,
        pemilikAwal: "Nurhayati",
        pemilikSaatIni: "Nurhayati",
        status: "terarsip",
        tanggalDaftar: daysAgo(1300),
        batas: { utara: "Tanah Bpk. Rudi", selatan: "Gang Mawar", timur: "Tanah Ny. Tini", barat: "Jl. Yos Sudarso" },
      },
      {
        id: "p-005",
        kode: "LKT-04-02-2022-021",
        nop: "65.71.030.012.001-0312.0",
        rt: "04", rw: "02",
        alamat: "Jl. Mayjend Sutoyo Gg. Anggrek No. 5",
        luas: 196,
        pemilikAwal: "Bachtiar Halim",
        pemilikSaatIni: "Ratna Kusuma",
        status: "terarsip",
        tanggalDaftar: daysAgo(900),
        batas: { utara: "Tanah Bpk. Ferry", selatan: "Tanah Ny. Sari", timur: "Gg. Anggrek", barat: "Saluran" },
      },
      {
        id: "p-006",
        kode: "LKT-08-04-2023-009",
        nop: "65.71.030.016.004-0078.0",
        rt: "08", rw: "04",
        alamat: "Jl. KH. Ahmad Dahlan, Loktuan RT 08",
        luas: 420,
        pemilikAwal: "Drs. Tarmizi",
        pemilikSaatIni: "Drs. Tarmizi",
        status: "draft",
        tanggalDaftar: daysAgo(420),
        batas: { utara: "Tanah Bpk. Asep", selatan: "Tanah Bpk. Made", timur: "Jl. KH. A. Dahlan", barat: "Tanah Ny. Lia" },
      },
      {
        id: "p-007",
        kode: "LKT-05-02-2024-002",
        nop: "65.71.030.013.002-0156.0",
        rt: "05", rw: "02",
        alamat: "Jl. Cendana, Loktuan RT 05",
        luas: 268,
        pemilikAwal: "Yusman Akbar",
        pemilikSaatIni: "Lina Mariana",
        status: "terarsip",
        tanggalDaftar: daysAgo(300),
        batas: { utara: "Tanah Bpk. Made", selatan: "Tanah Bpk. Hartanto", timur: "Tanah Bpk. Rio", barat: "Jl. Cendana" },
      },
      {
        id: "p-008",
        kode: "LKT-03-01-2024-005",
        nop: "65.71.030.011.001-0099.0",
        rt: "03", rw: "01",
        alamat: "Jl. Diponegoro Gg. III No. 4",
        luas: 156,
        pemilikAwal: "Sumarno",
        pemilikSaatIni: "Sumarno",
        status: "sengketa",
        tanggalDaftar: daysAgo(220),
        batas: { utara: "Tanah Bpk. Eko", selatan: "Tanah Ny. Wati", timur: "Gg. III", barat: "Tanah Bpk. Hari" },
      },
    ];

    // Lengkapi tiap persil dengan data dokumen "Surat Tanah" (mengikuti format SPPHT)
    const romawi = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
    parcels = parcels.map((p, i) => {
      const d = new Date(p.tanggalDaftar);
      const noUrut = String(40 + i).padStart(2, "0");
      return {
        ...p,
        nama: p.pemilikSaatIni,
        kelurahan: "Loktuan",
        jenisSurat: "SPPHT",
        nomorSurat: `500.17.3.3/${noUrut}/KEC-BU/${d.getFullYear()}`,
        suratFile: `scan_surat_${p.kode.toLowerCase()}.pdf`,
        suratUploaded: true,
      };
    });

    const archives = [
      {
        id: "a-001",
        parcelId: "p-001",
        nomorSPPHT: "SPPHT/047/IV/2024",
        jenis: "Jual Beli",
        tanggal: daysAgo(180),
        pengalih: { nama: "Hj. Maryam", nik: "6471010101700001", status: "hidup", peran: "pemilik" },
        penerima: { nama: "Siti Aminah", nik: "6471025612850002", jk: "Perempuan", telp: "0813-5544-6677", alamat: "Jl. Mayjend Sutoyo Gg. Melati No. 12" },
        nomorAkta: "12/2024/PPAT-LKT",
        catatan: "Jual beli normal antara ibu kandung dan anak.",
        dokumen: ["SPPHT", "KTP pemohon", "KK pemohon", "Surat pengantar RT/RW", "Surat tidak sengketa"],
        status: "terarsip",
        rekonstruksi: false,
      },
      {
        id: "a-002",
        parcelId: "p-003",
        nomorSPPHT: "SPPHT/052/V/2024",
        jenis: "Jual Beli",
        tanggal: daysAgo(150),
        pengalih: { nama: "PT Bumi Loktuan Lestari", nik: "—", status: "badan hukum", peran: "pemilik" },
        penerima: { nama: "Hendra Wijaya", nik: "6471020305790004", jk: "Laki-laki", telp: "0812-3344-1199", alamat: "Jl. Sangatta KM 3, RT 06" },
        nomorAkta: "18/2024/PPAT-LKT",
        catatan: "Pelepasan hak dari badan hukum ke perorangan.",
        dokumen: ["SPPHT", "KTP pemohon", "KK pemohon", "Surat tidak sengketa"],
        status: "terarsip",
        rekonstruksi: false,
      },
      {
        id: "a-003",
        parcelId: "p-005",
        nomorSPPHT: "SPPHT/061/VII/2024",
        jenis: "Waris",
        tanggal: daysAgo(120),
        pengalih: { nama: "Bachtiar Halim", nik: "6471010503520006", status: "meninggal", peran: "pewaris" },
        penerima: { nama: "Ratna Kusuma", nik: "6471025008860007", jk: "Perempuan", telp: "0852-7788-9933", alamat: "Jl. Mayjend Sutoyo Gg. Anggrek No. 5" },
        nomorAkta: "—",
        catatan: "Peralihan waris berdasarkan surat keterangan waris.",
        dokumen: ["SPPHT", "KTP pemohon", "KK pemohon", "Surat pengantar RT/RW"],
        status: "terarsip",
        rekonstruksi: true,
      },
      {
        id: "a-004",
        parcelId: "p-007",
        nomorSPPHT: "SPPHT/078/IX/2024",
        jenis: "Hibah",
        tanggal: daysAgo(85),
        pengalih: { nama: "Yusman Akbar", nik: "6471010606600008", status: "hidup", peran: "pemilik" },
        penerima: { nama: "Lina Mariana", nik: "6471025801920009", jk: "Perempuan", telp: "0857-1122-3344", alamat: "Jl. Cendana, Loktuan RT 05" },
        nomorAkta: "24/2024/PPAT-LKT",
        catatan: "Hibah dari ayah ke anak.",
        dokumen: ["SPPHT", "KTP pemohon", "KK pemohon", "Surat pengantar RT/RW", "Surat tidak sengketa", "KTP saksi 1", "KTP saksi 2"],
        status: "terarsip",
        rekonstruksi: false,
      },
      {
        id: "a-005",
        parcelId: "p-001",
        nomorSPPHT: "SPPHT/021/II/2020",
        jenis: "Jual Beli",
        tanggal: daysAgo(2000),
        pengalih: { nama: "H. Abdul Rahman", nik: "6471010101480010", status: "meninggal", peran: "pemilik" },
        penerima: { nama: "Hj. Maryam", nik: "6471010101700001", jk: "Perempuan", status: "hidup", telp: "—", alamat: "Loktuan" },
        nomorAkta: "08/2020/PPAT-LKT",
        catatan: "Peralihan generasi awal — rekonstruksi historis.",
        dokumen: ["SPPHT", "KTP pemohon"],
        status: "terarsip",
        rekonstruksi: true,
      },
    ];

    const parties = [
      { id: "pt-1", nama: "Siti Aminah", nik: "6471025612850002", status: "hidup", keterlibatan: "penerima", riwayatTerakhir: daysAgo(180) },
      { id: "pt-2", nama: "Hj. Maryam", nik: "6471010101700001", status: "hidup", keterlibatan: "pengalih", riwayatTerakhir: daysAgo(180) },
      { id: "pt-3", nama: "Hendra Wijaya", nik: "6471020305790004", status: "hidup", keterlibatan: "penerima", riwayatTerakhir: daysAgo(150) },
      { id: "pt-4", nama: "Ratna Kusuma", nik: "6471025008860007", status: "hidup", keterlibatan: "penerima", riwayatTerakhir: daysAgo(120) },
      { id: "pt-5", nama: "Bachtiar Halim", nik: "6471010503520006", status: "meninggal", keterlibatan: "pewaris", riwayatTerakhir: daysAgo(120) },
      { id: "pt-6", nama: "Lina Mariana", nik: "6471025801920009", status: "hidup", keterlibatan: "penerima", riwayatTerakhir: daysAgo(85) },
      { id: "pt-7", nama: "Yusman Akbar", nik: "6471010606600008", status: "hidup", keterlibatan: "pengalih", riwayatTerakhir: daysAgo(85) },
      { id: "pt-8", nama: "H. Abdul Rahman", nik: "6471010101480010", status: "meninggal", keterlibatan: "pemilik awal", riwayatTerakhir: daysAgo(2000) },
      { id: "pt-9", nama: "Sumarno", nik: "6471011202700011", status: "hidup", keterlibatan: "pemilik", riwayatTerakhir: daysAgo(220) },
      { id: "pt-10", nama: "Nurhayati", nik: "6471024505770012", status: "hidup", keterlibatan: "pemilik", riwayatTerakhir: daysAgo(1300) },
    ];

    const audits = [
      { id: "au-1", waktu: daysAgo(0), admin: "operator01", aksi: "LOGIN", entitas: "session", entId: "—", ip: "10.0.12.45" },
      { id: "au-2", waktu: daysAgo(1), admin: "operator01", aksi: "VIEW_FILE", entitas: "dokumen", entId: "a-004/SPPHT", ip: "10.0.12.45" },
      { id: "au-3", waktu: daysAgo(2), admin: "operator02", aksi: "CREATE", entitas: "peralihan", entId: "a-004", ip: "10.0.12.46" },
      { id: "au-4", waktu: daysAgo(3), admin: "operator01", aksi: "UPDATE", entitas: "tanah", entId: "p-005", ip: "10.0.12.45" },
      { id: "au-5", waktu: daysAgo(5), admin: "operator02", aksi: "CREATE", entitas: "tanah", entId: "p-008", ip: "10.0.12.46" },
      { id: "au-6", waktu: daysAgo(7), admin: "operator01", aksi: "VIEW_FILE", entitas: "dokumen", entId: "a-001/SPPHT", ip: "10.0.12.45" },
    ];

    return {
      version: 3,
      parcels,
      archives,
      parties,
      audits,
      draft: null,
    };
  }

  // ---------------- read/write ----------------
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const s = seed();
        localStorage.setItem(KEY, JSON.stringify(s));
        return s;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 3) {
        const s = seed();
        localStorage.setItem(KEY, JSON.stringify(s));
        return s;
      }
      return parsed;
    } catch (e) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  // ---------------- helpers ----------------
  function maskNik(nik) {
    if (!nik || nik.length < 8) return nik || "—";
    return nik.slice(0, 4) + "********" + nik.slice(-4);
  }

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  }
  function formatDateTime(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }
  function relTime(iso) {
    const now = Date.now();
    const t = new Date(iso).getTime();
    const diff = Math.max(0, now - t) / 1000;
    if (diff < 60) return "baru saja";
    if (diff < 3600) return Math.floor(diff / 60) + " menit lalu";
    if (diff < 86400) return Math.floor(diff / 3600) + " jam lalu";
    if (diff < 86400 * 7) return Math.floor(diff / 86400) + " hari lalu";
    return formatDate(iso);
  }

  function nextParcelKode(parcels, rt, rw) {
    const year = new Date().getFullYear();
    const prefix = `LKT-${rt}-${rw}-${year}-`;
    const existing = parcels.filter((p) => p.kode.startsWith(prefix));
    const max = existing.reduce((m, p) => {
      const n = parseInt(p.kode.slice(prefix.length), 10);
      return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    return prefix + String(max + 1).padStart(3, "0");
  }

  function nextNomorSurat(parcels) {
    const year = new Date().getFullYear();
    const seq = String((parcels.filter((p) => (p.nomorSurat || "").includes(`/KEC-BU/${year}`)).length) + 1).padStart(2, "0");
    return `500.17.3.3/${seq}/KEC-BU/${year}`;
  }

  window.SIADP = {
    load, save, seed,
    maskNik, formatDate, formatDateTime, relTime, nextParcelKode, nextNomorSurat,
    resetSimulation: () => {
      const s = seed();
      save(s);
      return s;
    },
  };
})();
