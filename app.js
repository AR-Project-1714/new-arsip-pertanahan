// SIAP — multi-page shell: navigation, sidebar, topbar, page mount helper

const PAGE_URL = {
  "dashboard": "index.html",
  "arsip-baru": "arsipBaru.html",
  "arsip-sppht": "arsipSppht.html",
  "data-tanah": "dataTanah.html",
  "data-pihak": "dataPihak.html",
  "audit-log": "auditLog.html",
  "pengaturan": "pengaturan.html",
  "detail": "detail.html",
};

// Navigate across pages (state shared via localStorage)
function go(page, ctx) {
  let url = PAGE_URL[page] || "index.html";
  if (ctx) url += "?parcel=" + encodeURIComponent(ctx);
  window.location.href = url;
}

function getParam(name) {
  const u = new URLSearchParams(window.location.search);
  return u.get(name);
}

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "dashboard" },
  { key: "arsip-baru", label: "Arsip Baru", icon: "plus-circle", accent: true },
  { key: "arsip-sppht", label: "Arsip SPPHT", icon: "archive" },
  { key: "data-tanah", label: "Data Tanah", icon: "land" },
  { key: "data-pihak", label: "Data Pihak", icon: "users" },
  { key: "audit-log", label: "Audit Log", icon: "history" },
  { key: "pengaturan", label: "Pengaturan", icon: "settings" },
];

const TITLES = {
  "dashboard": { t: "Dashboard", s: "Ringkasan sistem arsip digital pertanahan." },
  "arsip-baru": { t: "Arsip Baru", s: "Wizard pembuatan arsip SPPHT / peralihan kepemilikan." },
  "arsip-sppht": { t: "Arsip SPPHT", s: "Daftar semua arsip peralihan yang tersimpan." },
  "data-tanah": { t: "Data Tanah", s: "Master data surat tanah di Kelurahan Loktuan." },
  "data-pihak": { t: "Data Pihak", s: "Pengalih, penerima, dan pemilik tercatat." },
  "audit-log": { t: "Audit Log", s: "Jejak audit append-only seluruh aktivitas operator." },
  "pengaturan": { t: "Pengaturan", s: "Akun operator dan informasi sistem." },
  "detail": { t: "Detail Riwayat Kepemilikan", s: "Chain of title surat tanah." },
};

// Shared state hook (persists to localStorage, wires VIEW_FILE audit)
function useAppState() {
  const [state, setState] = React.useState(() => SIADP.load());
  React.useEffect(() => { SIADP.save(state); }, [state]);
  React.useEffect(() => {
    window.SIADP._onView = (entId) => {
      setState((s) => ({
        ...s,
        audits: [{
          id: "au-" + Date.now(),
          waktu: new Date().toISOString(),
          admin: "operator01", aksi: "VIEW_FILE", entitas: "dokumen",
          entId, ip: "10.0.12.45",
        }, ...s.audits],
      }));
    };
  }, []);
  return [state, setState];
}

function Sidebar({ active }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">SIAP</div>
        <div className="brand-text">
          <div className="t1">SIAP Loktuan</div>
          <div className="t2">Sistem Arsip Digital Pertanahan</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-group-label">Operasional</div>
        {NAV.slice(0, 5).map((n) => (
          <a key={n.key} href={PAGE_URL[n.key]} className={"nav-item " + (active === n.key ? "active" : "")}>
            <Icon name={n.icon} size={17}/>
            <span>{n.label}</span>
            {n.accent && active !== n.key && <span className="badge-count" style={{ background: "var(--accent-soft)", color: "oklch(45% 0.1 60)" }}>Cepat</span>}
          </a>
        ))}
        <div className="nav-group-label" style={{ marginTop: 8 }}>Sistem</div>
        {NAV.slice(5).map((n) => (
          <a key={n.key} href={PAGE_URL[n.key]} className={"nav-item " + (active === n.key ? "active" : "")}>
            <Icon name={n.icon} size={17}/>
            <span>{n.label}</span>
          </a>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="user">
          <div className="avatar">O1</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-1)" }}>Operator 01</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Kel. Loktuan · Admin</div>
          </div>
          <button className="icon-btn" style={{ width: 28, height: 28 }} title="Keluar"><Icon name="logout" size={14}/></button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ crumbs }) {
  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Icon name="chevron-right" size={12} className="sep"/>}
            <span className={i === crumbs.length - 1 ? "last" : ""}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="topbar-spacer"/>
      <div className="topbar-search">
        <Icon name="search" size={14}/>
        <input placeholder="Cari cepat di seluruh sistem…"/>
        <span style={{ fontSize: 11, padding: "1px 5px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 4, color: "var(--ink-4)" }}>⌘K</span>
      </div>
      <Btn variant="primary" icon="plus" onClick={() => go("arsip-baru")}>Arsip Baru</Btn>
      <button className="icon-btn" title="Notifikasi"><Icon name="bell" size={16}/><span className="dot"/></button>
    </div>
  );
}

// Mount a page: builds shell (sidebar + topbar + page head) and renders the screen.
// config: { active, title?, sub?, crumbs?, render({state,setState}) }
function mountPage(config) {
  function Root() {
    const [state, setState] = useAppState();
    const meta = TITLES[config.active] || { t: "—", s: "" };
    const title = config.title || meta.t;
    const sub = config.sub || meta.s;
    const crumbs = config.crumbs || ["Beranda", title];
    return (
      <ToastProvider>
        <div className="app">
          <Sidebar active={config.active}/>
          <div className="main">
            <Topbar crumbs={crumbs}/>
            <div className="content">
              <div className="page-head">
                <div>
                  <h1>{title}</h1>
                  <div className="sub">{sub}</div>
                </div>
              </div>
              {config.render({ state, setState })}
            </div>
          </div>
        </div>
      </ToastProvider>
    );
  }
  ReactDOM.createRoot(document.getElementById("root")).render(<Root/>);
}

Object.assign(window, { go, getParam, NAV, TITLES, PAGE_URL, useAppState, Sidebar, Topbar, mountPage });
