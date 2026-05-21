// Icons (Flaticon UIcons) + reusable UI primitives for SIAP

// ---------------- Icons (Flaticon UIcons — regular rounded) ----------------
const ICON_MAP = {
  dashboard: "fi-rr-apps",
  plus: "fi-rr-plus",
  "plus-circle": "fi-rr-add",
  archive: "fi-rr-box-open",
  map: "fi-rr-map",
  users: "fi-rr-users",
  history: "fi-rr-time-past",
  settings: "fi-rr-settings",
  search: "fi-rr-search",
  bell: "fi-rr-bell",
  "chevron-right": "fi-rr-angle-right",
  "chevron-left": "fi-rr-angle-left",
  "chevron-down": "fi-rr-angle-down",
  filter: "fi-rr-filter",
  x: "fi-rr-cross-small",
  check: "fi-rr-check",
  "check-circle": "fi-rr-checkbox",
  alert: "fi-rr-exclamation",
  info: "fi-rr-info",
  file: "fi-rr-document",
  "file-text": "fi-rr-document",
  upload: "fi-rr-cloud-upload-alt",
  eye: "fi-rr-eye",
  edit: "fi-rr-pencil",
  trash: "fi-rr-trash",
  refresh: "fi-rr-refresh",
  logout: "fi-rr-sign-out-alt",
  open: "fi-rr-eye",
  user: "fi-rr-user",
  land: "fi-rr-home-location-alt",
  shield: "fi-rr-shield-check",
  trending: "fi-rr-stats",
  stack: "fi-rr-duplicate",
  save: "fi-rr-disk",
  menu: "fi-rr-menu-burger",
  key: "fi-rr-key",
  calendar: "fi-rr-calendar",
  compass: "fi-rr-compass",
  lock: "fi-rr-lock",
};

const Icon = ({ name, size = 18, stroke, className = "ico", ...rest }) => {
  const cls = ICON_MAP[name] || "fi-rr-circle-small";
  const style = { fontSize: size, width: size, height: size, ...rest.style };
  return <i className={"fi " + cls + " " + className} style={style} aria-hidden="true" />;
};

// ---------------- Button ----------------
function Btn({ children, variant = "default", icon, size, ...rest }) {
  const cls = ["btn", variant !== "default" && variant, size === "sm" && "sm"].filter(Boolean).join(" ");
  return <button className={cls} {...rest}>{icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}{children}</button>;
}

// ---------------- Badge ----------------
function Badge({ children, variant = "", style }) {
  return <span className={"badge " + variant} style={style}><span className="dot"/>{children}</span>;
}
function StatusBadge({ status }) {
  const map = {
    terarsip: { v: "success", t: "Terarsip" },
    draft: { v: "warning", t: "Draft" },
    sengketa: { v: "danger", t: "Sengketa" },
    hidup: { v: "success", t: "Hidup" },
    meninggal: { v: "muted", t: "Meninggal" },
    "badan hukum": { v: "info", t: "Badan Hukum" },
  };
  const c = map[status] || { v: "muted", t: status };
  return <Badge variant={c.v}>{c.t}</Badge>;
}

// ---------------- Field wrapper ----------------
function Field({ label, required, error, hint, ok, children, style }) {
  return (
    <div className="field" style={style}>
      {label && <label>{label}{required && <span className="req">*</span>}</label>}
      {children}
      {error && <div className="error"><Icon name="alert" size={12}/>{error}</div>}
      {ok && <div className="ok"><Icon name="check" size={12}/>{ok}</div>}
      {hint && !error && !ok && <div className="hint">{hint}</div>}
    </div>
  );
}

// ---------------- Select (Choices.js wrapper) ----------------
// options: array of strings OR { value, label }
function Select({ value, onChange, options = [], placeholder, width, className, error, style }) {
  const selRef = React.useRef(null);
  const inst = React.useRef(null);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const norm = options.map((o) => (typeof o === "object" ? o : { value: o, label: o }));
  const optsKey = JSON.stringify(norm) + "|" + (placeholder || "");

  React.useEffect(() => {
    const el = selRef.current;
    if (!el || typeof Choices === "undefined") return;
    const c = new Choices(el, {
      searchEnabled: norm.length > 8,
      searchChoices: norm.length > 8,
      shouldSort: false,
      itemSelectText: "",
      allowHTML: false,
      placeholder: !!placeholder,
      placeholderValue: placeholder || null,
      position: "bottom",
    });
    inst.current = c;
    const handler = (e) => onChangeRef.current && onChangeRef.current(e.target.value);
    el.addEventListener("change", handler);
    return () => {
      el.removeEventListener("change", handler);
      try { c.destroy(); } catch (err) {}
      inst.current = null;
    };
  }, [optsKey]);

  React.useEffect(() => {
    if (inst.current) {
      try { inst.current.setChoiceByValue(value == null ? "" : value); } catch (e) {}
    }
  }, [value, optsKey]);

  return (
    <select
      ref={selRef}
      className={"select" + (error ? " error" : "") + (className ? " " + className : "")}
      style={{ width, ...style }}
      defaultValue={value == null ? "" : value}
    >
      {placeholder != null && <option value="">{placeholder}</option>}
      {norm.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ---------------- DatePicker (gaya shadcn/ui) ----------------
const DP_MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
const DP_DOWS = ["Sn","Sl","Rb","Km","Jm","Sb","Mg"];

function parseISO(s) { return s ? new Date(s + "T00:00:00") : null; }
function toISO(dt) {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function DatePicker({ value, onChange, placeholder = "Pilih tanggal", error }) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => parseISO(value) || new Date());
  const ref = React.useRef(null);

  React.useEffect(() => { const d = parseISO(value); if (d) setView(d); }, [value]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const sel = parseISO(value);
  const y = view.getFullYear(), m = view.getMonth();
  const startDay = (new Date(y, m, 1).getDay() + 6) % 7; // Senin di depan
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date();
  const same = (a, dd) => a && a.getFullYear() === y && a.getMonth() === m && a.getDate() === dd;
  const fmt = (dt) => dt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
  const pick = (d) => { onChange(toISO(new Date(y, m, d))); setOpen(false); };

  return (
    <div className={"datepicker" + (open ? " is-open" : "")} ref={ref}>
      <button type="button" className={"datepicker-trigger" + (error ? " error" : "") + (value ? "" : " placeholder")} onClick={() => setOpen((o) => !o)}>
        <Icon name="calendar" size={16}/>
        <span>{sel ? fmt(sel) : placeholder}</span>
        <Icon name="chevron-down" size={14}/>
      </button>
      {open && (
        <div className="datepicker-pop">
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => setView(new Date(y, m - 1, 1))}><Icon name="chevron-left" size={16}/></button>
            <div className="dp-title">{DP_MONTHS[m]} {y}</div>
            <button type="button" className="dp-nav" onClick={() => setView(new Date(y, m + 1, 1))}><Icon name="chevron-right" size={16}/></button>
          </div>
          <div className="dp-grid dp-dow">{DP_DOWS.map((d) => <div key={d} className="dp-dow-cell">{d}</div>)}</div>
          <div className="dp-grid">
            {cells.map((d, i) => d === null
              ? <div key={"e" + i}/>
              : <button type="button" key={i} className={"dp-day" + (same(sel, d) ? " selected" : "") + (same(today, d) ? " today" : "")} onClick={() => pick(d)}>{d}</button>
            )}
          </div>
          <div className="dp-foot">
            <button type="button" className="btn ghost sm" onClick={() => { onChange(toISO(new Date())); setOpen(false); }}>Hari ini</button>
            {value && <button type="button" className="btn subtle sm" onClick={() => { onChange(""); setOpen(false); }}>Hapus</button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Modal ----------------
function Modal({ open, onClose, title, subtitle, children, footer, size = "" }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose && onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div className={"modal-card " + size}>
        <div className="modal-head">
          <div style={{ flex: 1 }}>
            <h2>{title}</h2>
            {subtitle && <div className="sub">{subtitle}</div>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Tutup" style={{ width: 32, height: 32 }}>
            <Icon name="x" size={16}/>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------------- Toast ----------------
const ToastCtx = React.createContext(null);
function ToastProvider({ children }) {
  const [items, setItems] = React.useState([]);
  const push = React.useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setItems((arr) => [...arr, { id, ...t }]);
    setTimeout(() => setItems((arr) => arr.filter((x) => x.id !== id)), t.duration || 3200);
  }, []);
  const api = React.useMemo(() => ({
    success: (t, s) => push({ variant: "success", title: t, sub: s }),
    info: (t, s) => push({ variant: "info", title: t, sub: s }),
    warn: (t, s) => push({ variant: "warning", title: t, sub: s }),
    error: (t, s) => push({ variant: "danger", title: t, sub: s }),
  }), [push]);
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="toast-stack">
        {items.map((t) => (
          <div key={t.id} className={"toast " + t.variant}>
            <div className="ico" style={{ marginTop: 1 }}>
              <Icon name={t.variant === "success" ? "check-circle" : t.variant === "danger" ? "alert" : "info"} size={18}/>
            </div>
            <div className="body">
              <div className="t">{t.title}</div>
              {t.sub && <div className="s">{t.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => React.useContext(ToastCtx);

// ---------------- Pagination ----------------
function Pagination({ page, pageSize, total, onPage }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const window2 = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) window2.push(i);
  return (
    <div className="pagi">
      <div className="info">Menampilkan <b>{from}–{to}</b> dari <b>{total}</b> arsip</div>
      <div className="pages">
        <button className="page-btn" disabled={page <= 1} onClick={() => onPage(page - 1)}>Sebelumnya</button>
        {window2[0] > 1 && <span style={{ alignSelf: "center", color: "var(--ink-4)" }}>…</span>}
        {window2.map((p) => (
          <button key={p} className={"page-btn" + (p === page ? " active" : "")} onClick={() => onPage(p)}>{p}</button>
        ))}
        {window2[window2.length - 1] < totalPages && <span style={{ alignSelf: "center", color: "var(--ink-4)" }}>…</span>}
        <button className="page-btn" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Berikutnya</button>
      </div>
    </div>
  );
}

// ---------------- ProgressBar ----------------
function ProgressBar({ value, max = 100, color = "var(--primary)", height = 8 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ background: "var(--bg-soft)", borderRadius: 999, overflow: "hidden", height, border: "1px solid var(--line)" }}>
      <div style={{ width: pct + "%", height: "100%", background: color, transition: "width 320ms ease" }}/>
    </div>
  );
}

// ---------------- Empty state row for tables ----------------
function EmptyRow({ cols, icon = "search", title = "Belum ada data", sub }) {
  return (
    <tr>
      <td colSpan={cols} className="empty">
        <div className="empty">
          <div className="big"><Icon name={icon} size={24}/></div>
          <div style={{ fontWeight: 600, color: "var(--ink-1)" }}>{title}</div>
          {sub && <div style={{ marginTop: 4 }}>{sub}</div>}
        </div>
      </td>
    </tr>
  );
}

// Expose
Object.assign(window, {
  Icon, Btn, Badge, StatusBadge, Field, Select, DatePicker, Modal,
  ToastProvider, useToast, Pagination, ProgressBar, EmptyRow,
});
