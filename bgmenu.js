const J = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode: function(t) {
    if (typeof t != "string")
      return "";
    const e = new TextEncoder().encode(t);
    let i = "";
    return e.forEach((n) => {
      i += String.fromCharCode(n);
    }), btoa(i);
  },
  decode: function(t) {
    if (typeof t != "string" || t.length === 0)
      return "";
    try {
      if (!/^[A-Za-z0-9+/=]+$/.test(t))
        throw new Error("Invalid Base64 format");
      let e = this._utf8Decode(atob(t));
      return this._hasEncodingErrors(e) && (console.warn("Old encoding detected! Switching to old decoding method..."), e = this._oldDecode(t)), e;
    } catch (e) {
      return console.error("Decoding failed:", e), "";
    }
  },
  _utf8Decode: function(t) {
    try {
      const e = new Uint8Array(t.length);
      for (let i = 0; i < t.length; i++)
        e[i] = t.charCodeAt(i);
      return new TextDecoder("utf-8", { fatal: !1 }).decode(e);
    } catch {
      return t;
    }
  },
  _hasEncodingErrors: function(t) {
    return /[\uFFFD]/.test(t);
  },
  _oldDecode: function(t) {
    if (t === void 0)
      return "";
    var e = "", i, n, r, s, o, d, u, h = 0;
    for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); h < t.length; )
      s = this._keyStr.indexOf(t.charAt(h++)), o = this._keyStr.indexOf(t.charAt(h++)), d = this._keyStr.indexOf(t.charAt(h++)), u = this._keyStr.indexOf(t.charAt(h++)), i = s << 2 | o >> 4, n = (o & 15) << 4 | d >> 2, r = (d & 3) << 6 | u, e = e + String.fromCharCode(i), d != 64 && (e = e + String.fromCharCode(n)), u != 64 && (e = e + String.fromCharCode(r));
    return e = this._utf8_decode(e), e;
  },
  _utf8_decode: function(t) {
    var e = "", i = 0, n, r, s;
    for (n = r = 0; i < t.length; )
      n = t.charCodeAt(i), n < 128 ? (e += String.fromCharCode(n), i++) : n > 191 && n < 224 ? (r = t.charCodeAt(i + 1), e += String.fromCharCode((n & 31) << 6 | r & 63), i += 2) : (r = t.charCodeAt(i + 1), s = t.charCodeAt(i + 2), e += String.fromCharCode((n & 15) << 12 | (r & 63) << 6 | s & 63), i += 3);
    return e;
  }
}, Ut = ["http://localhost:8080/v1", "https://api2.fouita.com/v1"], Ht = ["http://localhost:3000", "https://ops.fouita.com"], dt = {
  api: Ut[1],
  api_int: Ht[1]
};
let Mt = {};
const Pt = () => {
  var i, n;
  var t = new Headers();
  t.append("Content-Type", "application/json");
  let e = null;
  try {
    e = JSON.parse((n = (i = window == null ? void 0 : window.localStorage) == null ? void 0 : i.getItem("f/user")) != null ? n : "{}");
  } catch {
  }
  e && e.token && t.append("Authorization", `Bearer ${e.token}`), Mt = {
    method: "POST",
    headers: t,
    mode: "cors",
    cache: "default"
  };
}, Vt = () => (Pt(), Mt);
function At(t, e) {
  let i = t.startsWith("http") ? t : dt.api + t;
  return Et(i, {
    ...Vt(),
    body: JSON.stringify(e)
  }).then((n) => n.json()).catch((n) => n);
}
function it(t, e) {
  return new Promise(
    (i, n) => At(t, e).then((r) => i(r.json ? JSON.parse(J.decode(r.json)) : r)).catch((r) => n(r))
  );
}
function R(t, e) {
  return At(t, e);
}
function Et(t, e) {
  return new Promise(async (i, n) => {
    fetch(t, e).then(async (r) => {
      if (r.status == 401) {
        i({ status: 401, error: !0, messsage: "Need to authenticate to perform this action" });
        return;
      }
      if (r.status > 400) {
        n();
        return;
      }
      i(r);
    });
  });
}
function at(t) {
  if (Array.isArray(t))
    return t.map(at);
  if (t !== null && typeof t == "object") {
    const e = {};
    for (const i in t)
      i !== "uid" && i !== "index" && (e[i] = at(t[i]));
    return e;
  }
  return t;
}
const Jt = {
  eqInputs(t, e) {
    var i, n, r, s, o, d, u;
    if (!t || !e || ((i = t == null ? void 0 : t.steps) == null ? void 0 : i.length) !== ((n = e == null ? void 0 : e.steps) == null ? void 0 : n.length))
      return !1;
    for (let h = 0; h < ((r = t == null ? void 0 : t.steps) == null ? void 0 : r.length); h++)
      if (((o = (s = t == null ? void 0 : t.steps) == null ? void 0 : s[h]) == null ? void 0 : o.inputs) && ((u = (d = e == null ? void 0 : e.steps) == null ? void 0 : d[h]) == null ? void 0 : u.inputs) && JSON.stringify(t.steps[h].inputs) !== JSON.stringify(e.steps[h].inputs))
        return !1;
    return !0;
  },
  async init(t, e, i = !0) {
    var d, u, h, _, w, v, x, O, a, D, N, b, M, L, A;
    const r = ((d = (await it("/form/details", {
      vuid: t
    })).q[0]) == null ? void 0 : d.forms) || [];
    if (e.version || (e.version = ((u = r == null ? void 0 : r[0]) == null ? void 0 : u.version) || "1"), i && ((h = e == null ? void 0 : e.steps) == null ? void 0 : h.length) && (r == null ? void 0 : r.length) && ((_ = r[0]) == null ? void 0 : _.version) !== e.version) {
      if ((v = (w = r[0]) == null ? void 0 : w.steps) != null && v.length) {
        let S = JSON.parse(JSON.stringify({ ...r[0], version: "0" }));
        S = this.objProps(S);
        const k = at(S), C = at({ ...e, version: "0" });
        if (this.eqInputs(k, C))
          return S;
      }
      e = this.overrideForm(r[0], e);
    } else if (r != null && r.length)
      return this.objProps(r[0]);
    if (!((x = e == null ? void 0 : e.steps) != null && x.length) && !e.uid) {
      const S = await R("/form/create", {
        name: (O = e == null ? void 0 : e.name) != null ? O : "My Form",
        vuid: t
      });
      return {
        uid: S.uids.form,
        steps: [{
          uid: S.uids.step,
          index: 0,
          inputs: []
        }]
      };
    }
    e.vuid = t, e = this.b64Props(e);
    const s = await R("/form/save-w-inputs", e), o = {
      uid: e.uid || s.uids.form,
      version: e.version,
      props: e.props,
      steps: []
    };
    for (let S = 0; S < e.steps.length; S++) {
      const k = {
        uid: ((a = e.steps[S]) == null ? void 0 : a.uid) || s.uids[`step_${S}`],
        key: (D = e.steps[S]) == null ? void 0 : D.key,
        index: (N = e.steps[S]) == null ? void 0 : N.index,
        props: (b = e.steps[S]) == null ? void 0 : b.props,
        inputs: []
      };
      for (let C = 0; C < e.steps[S].inputs.length; C++) {
        const F = {
          uid: ((M = e.steps[S].inputs[C]) == null ? void 0 : M.uid) || s.uids[`input_${S}_${C}`],
          ...e.steps[S].inputs[C]
        };
        if ((L = F.cols) != null && L.length)
          for (let T = 0; T < F.cols.length; T++)
            F.cols[T] && ((A = F.cols[T]).uid || (A.uid = s.uids[`col_${S}_${C}_${T}`]));
        k.inputs.push(F);
      }
      o.steps.push(k);
    }
    return this.objProps(o);
  },
  overrideForm(t, e) {
    var r;
    const i = {
      uid: t.uid,
      version: e.version,
      props: e.props,
      steps: []
    };
    t.steps || (t.steps = []);
    const n = t.steps.map((s) => s.inputs || []).flat();
    for (let s = 0; s < e.steps.length; s++) {
      const o = e.steps[s], d = t.steps.find((u) => u.key === e.steps[s].key);
      o.uid = d == null ? void 0 : d.uid;
      for (let u = 0; u < o.inputs.length; u++) {
        const h = o.inputs[u];
        h.uid = (r = n.find((_) => _.key === o.inputs[u].key)) == null ? void 0 : r.uid;
      }
      i.steps.push(o);
    }
    return i;
  },
  async addStep(t, e) {
    const i = {
      fuid: t.uid,
      index: e.index,
      name: e.name
    }, n = await R("/form/create-step", i);
    return e.uid = n.uids.step, e;
  },
  async saveInput(t, e, i) {
    data = {
      fuid: t.uid,
      suid: e.uid,
      uid: i.uid,
      label: i.label,
      type: i.type,
      props: i.props ? J.encode(JSON.stringify(i.props)) : "",
      index: i.index
    };
    const n = await R("/form/save-input", data);
    return i.uid || (i.uid = n.uids.input), i;
  },
  async removeStep(t, e) {
    const i = {
      fuid: t.uid,
      suid: e.uid
    };
    await R("/form/delete-step", i);
    const n = t.steps.findIndex((r) => r.uid == e.uid);
    t.steps.splice(n, 1);
    for (let r = 0; r < t.steps.length; r++)
      t.steps[r].index = r;
    return t;
  },
  async removeInput(t, e, i) {
    const n = {
      fuid: t.uid,
      suid: e.uid,
      uid: i.uid
    };
    await R("/form/delete-input", n);
    const r = e.inputs.findIndex((s) => s.uid == i.uid);
    e.inputs.splice(r, 1);
    for (let s = 0; s < e.inputs.length; s++)
      e.inputs[s].index = s;
    return e;
  },
  async submit(t) {
    var i, n;
    const e = {
      fuid: t.uid,
      fields: []
    };
    for (let r of t.steps)
      if (r.inputs) {
        for (let s of r.inputs)
          if ((i = s.type) != null && i.endsWith("Content") || e.fields.push({
            iuid: s.uid,
            value: s.value
          }), (n = s.cols) != null && n.length)
            for (let o of s.cols)
              e.fields.push({
                iuid: o.uid,
                value: o.value
              });
      }
    return e.fields.length ? (await fetch(dt.api_int + "/submit", {
      method: "POST",
      body: JSON.stringify(e)
    }), { success: !0 }) : { error: !0, message: "Data is empty" };
  },
  b64Props(t) {
    var n;
    t = JSON.parse(JSON.stringify(t)), t.props = t.props ? J.encode(JSON.stringify(t.props)) : "";
    let e = 0, i = 0;
    for (let r of t.steps)
      if (r.props = r.props ? J.encode(JSON.stringify(r.props)) : "", r.index = e++, r.inputs) {
        for (let s of r.inputs)
          if (s.index = i++, s.props = s.props ? J.encode(JSON.stringify(s.props)) : "", (n = s.cols) != null && n.length)
            for (let o of s.cols)
              o.props = o.props ? J.encode(JSON.stringify(o.props)) : "";
      }
    return t;
  },
  objProps(t) {
    var e;
    t = JSON.parse(JSON.stringify(t)), t.props = t.props ? JSON.parse(J.decode(t.props)) : {};
    for (let i of t.steps)
      if (i.props = i.props ? JSON.parse(J.decode(i.props)) : {}, i.inputs) {
        for (let n of i.inputs)
          if (n.props = n.props ? JSON.parse(J.decode(n.props)) : {}, (e = n.cols) != null && e.length)
            for (let r of n.cols)
              r.props = r.props ? JSON.parse(J.decode(r.props)) : {};
      }
    return t;
  }
}, zt = {
  setUpIntegration() {
    return () => ({
      async call(t, e, i) {
        return await Et(dt.api_int + "/run", {
          method: "POST",
          body: JSON.stringify({
            vuid: t,
            op: e,
            data: i
          })
        }).then((n) => n.json());
      }
    });
  }
}, B = {
  set(t, e) {
    let i = t.split(".");
    window.Fouita = window.Fouita || {};
    let n = window.Fouita;
    for (let r = 0; r < i.length; r++) {
      const s = i[r];
      r < i.length - 1 ? (n[s] = n[s] || {}, n = n[s]) : n[s] = e;
    }
  }
}, Bt = {
  async init() {
    if (!window.ftgun) {
      if (await import("https://cdn.fouita.com/assets/gun/gun-2020.1235.min.js"), !Gun) {
        setTimeout(() => {
          this.init();
        }, 50);
        return;
      }
      try {
        window.ftgun = new Gun({ peers: ["https://gun2.fouita.com/gun"] });
      } catch {
        window.ftgun = {};
      }
    }
  },
  async getData(t) {
    if (!window.ftgun) {
      await this.init(), setTimeout(() => {
        this.getData(t);
      }, 50);
      return;
    }
    return new Promise((e) => {
      try {
        window.ftgun.get("wdg/" + t).once(e);
      } catch {
        e();
      }
    });
  },
  async set(t, e) {
    if (!window.ftgun) {
      await this.init(), setTimeout(() => {
        this.set(t, e);
      }, 50);
      return;
    }
    try {
      window.ftgun.get("wdg/" + t).set(e);
    } catch {
    }
  },
  async put(t, e) {
    if (!window.ftgun) {
      await this.init(), setTimeout(() => {
        this.set(t, e);
      }, 50);
      return;
    }
    try {
      window.ftgun.get("wdg/" + t).put(e);
    } catch {
    }
  },
  async on(t, e) {
    if (!window.ftgun) {
      await this.init(), setTimeout(() => {
        this.on(t, e);
      }, 50);
      return;
    }
    try {
      window.ftgun.get("wdg/" + t).on(e);
    } catch {
      e == null || e({ error: !0 });
    }
  },
  async get(t) {
    try {
      return window.ftgun.get("wdg/" + t);
    } catch {
    }
  }
};
var vt = {};
const V = {
  get(t) {
    var i;
    let e;
    try {
      e = (i = window == null ? void 0 : window.localStorage) == null ? void 0 : i.getItem(t);
    } catch {
      e = vt[t];
    }
    if (!!e)
      try {
        e = JSON.parse(e);
      } finally {
        return e;
      }
  },
  set(t, e) {
    try {
      window == null || window.localStorage.setItem(t, typeof e == "object" ? JSON.stringify(e) : e);
    } catch {
      vt[t] = e;
    }
  }
};
function Wt(t, e) {
  return Math.floor(Math.random() * (e - t + 1) + t);
}
const ht = navigator.userAgent.toLowerCase(), Q = {
  track(t, e) {
    if (!t)
      return;
    let i = V.get("ft/wactions");
    if (!i)
      i = [{
        vuid: t,
        name: e,
        count: 1
      }];
    else {
      let n = i.find((r) => r.vuid == t && r.name == e);
      n ? n.count += 1 : i.push({
        vuid: t,
        name: e,
        count: 1
      });
    }
    V.set("ft/wactions", i);
  },
  sendTrackedData() {
    const t = V.get("ft/wactions");
    if (!(t != null && t.length))
      return;
    const e = {
      actions: t
    }, i = {
      "content-type": "application/json",
      "X-Content-Type-Options": "nosniff"
    }, n = new Blob([JSON.stringify(e)], i);
    navigator.sendBeacon(dt.api + "/track-actions", n), V.set("ft/wactions", []);
  },
  setUpTrackingCycle() {
    let t = Wt(4e4, 6e4);
    setInterval(this.sendTrackedData, t);
  },
  async setupVisitor() {
    if (V.get("ft/vstr")) {
      this.setUpTrackingCycle();
      return;
    }
    const t = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term"
    ], e = new URL(window.location.href), i = document.referrer ? new URL(document.referrer) : null;
    ({
      country: await this.country(),
      browser: this.browser(),
      os: this.os(),
      device: this.device(),
      origin: this.origin(),
      referrer: i == null || i.origin,
      ...t.reduce((n, r) => {
        var s, o;
        return { ...typeof n == "object" ? n : { [n]: (s = e.searchParams.get(n)) != null ? s : "" }, [r]: (o = e.searchParams.get(r)) != null ? o : "" };
      })
    }, this.setUpTrackingCycle());
  },
  country() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  },
  path() {
    return window.location.pathname;
  },
  origin() {
    return window.location.origin;
  },
  device() {
    return /android|iphone|kindle|ipad/i.test(ht) ? "Mobile" : "Desktop";
  },
  browser() {
    const t = {
      edge: "MS Edge",
      "edg/": "Edge (chromium)",
      opr: "Opera",
      chrome: "Chrome",
      trident: "MS IE",
      firefox: "Mozilla Firefox",
      safari: "Safari"
    };
    for (let e of Object.keys(t))
      if (~ht.indexOf(e))
        return t[e];
    return "Other Browser";
  },
  os() {
    const t = {
      win: "Windows",
      "like mac": "iOS",
      mac: "Mac OS",
      linux: "Linux",
      android: "Android"
    };
    for (let e of Object.keys(t))
      if (~ht.indexOf(e))
        return t[e];
    return "Unknown OS";
  }
};
window.addEventListener("beforeunload", Q.sendTrackedData);
Q.setupVisitor();
const ot = {}, Nt = {
  call(t, e) {
    var i;
    (i = ot[t]) == null || i.call(ot, e);
  },
  listen(t, e) {
    ot[t] = e;
  }
}, ut = {
  async init(t, e) {
    if (!t)
      return e;
    let i = [];
    for (let s of e)
      for (let o of s.options)
        o.key && i.push(o.key);
    if (!i.length)
      return e;
    const n = await R("/widget/init-quiz", {
      vuid: t,
      keys: i
    }), r = n == null ? void 0 : n.uids;
    if (!!r) {
      for (let s of e)
        for (let o of s.options)
          o.key && r[o.key] && (o.uid = r[o.key]);
      return e;
    }
  },
  async vote(t, e, i = {}) {
    var s, o, d, u;
    if (!t)
      return;
    let n = (s = V.get(`ftw/voter/${t}`)) != null ? s : { voted: [] };
    Array.isArray(e) || (e = [e]);
    let r = await R("/widget/vote", {
      vuid: t,
      voter: n == null ? void 0 : n.uid,
      uids: e,
      ...i
    });
    return ((o = r == null ? void 0 : r.uids) == null ? void 0 : o.voter) && typeof ((d = r == null ? void 0 : r.uids) == null ? void 0 : d.voter) != "object" ? n = { uid: (u = r.uids) == null ? void 0 : u.voter, voted: e } : n.voted = [...new Set(n.voted.concat(e))], V.set(`ftw/voter/${t}`, n), { success: !0 };
  },
  hasVoted(t, e) {
    if (!(e != null && e.options))
      return;
    let i = e.options.map((s) => s.uid), n = V.get(`ftw/voter/${t}`);
    return !(n != null && n.uid) || !(n != null && n.voted) ? !1 : !!i.find((s) => n.voted.includes(s));
  },
  async voteSummary(t) {
    return t ? await it("/widget/vote-summary", {
      vuid: t
    }) : void 0;
  }
}, jt = (t) => `
#${t} .text-primary {color: rgb(var(--ft-primary,0 0 0) / var(--tw-text-opacity)) !important}
#${t} .text-secondary {color: rgb(var(--ft-secondary,0 0 0) / var(--tw-text-opacity)) !important}
#${t} .text-tertiary {color: rgb(var(--ft-tertiary,0 0 0) / var(--tw-text-opacity)) !important}
#${t} .text-quaternary {color: rgb(var(--ft-quaternary,0 0 0) / var(--tw-text-opacity)) !important}
#${t} .bg-primary {background-color: rgb(var(--ft-primary,255 255 255) / var(--tw-bg-opacity)) !important}
#${t} .bg-secondary {background-color: rgb(var(--ft-secondary,255 255 255) / var(--tw-bg-opacity)) !important}
#${t} .bg-tertiary {background-color: rgb(var(--ft-tertiary,255 255 255) / var(--tw-bg-opacity)) !important}
#${t} .bg-quaternary {background-color: rgb(var(--ft-quaternary,255 255 255) / var(--tw-bg-opacity)) !important}
`;
function Rt(t) {
  const i = window.getComputedStyle(t).getPropertyValue("font-family").toLowerCase();
  (!i || i.includes("time")) && (t.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', t.style.lineHeight = 1.5);
}
function qt(t) {
  if (!t)
    return;
  const e = window.getComputedStyle(t).fontFamily;
  (!e || ["serif", "Times", '"Times New Roman"'].includes(e)) && (document.body.style.fontFamily = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"');
}
const G = {
  cmps: {},
  async insert(t) {
    var h, _, w, v;
    const e = (h = this.cmps) == null ? void 0 : h[t];
    if (!e) {
      console.warn("No widget exist ", t);
      return;
    }
    const i = (await import(
      /* @vite-ignore */
      e.url
    )).default, n = (_ = e.feed) != null ? _ : {}, r = document.getElementById(e.id);
    if (!r)
      return;
    qt(r);
    let s = document.getElementById(`${e.uid}-css`);
    s || (s = document.createElement("style"), s.setAttribute("id", `${e.uid}-css`), e.css || (e.css = ""), e.css += jt(e.id), s.appendChild(document.createTextNode(e.css)), r.append(s));
    let o = document.getElementById("fouita-tw-base");
    o || (o = document.createElement("link"), o.setAttribute("id", "fouita-tw-base"), o.setAttribute("rel", "stylesheet"), o.setAttribute("href", "https://cdn.fouita.com/assets/fouita/tw-base.css"), document.head.append(o));
    let d = document.getElementById(e.uid);
    d && d.remove();
    const u = document.createElement("div");
    u.setAttribute("id", e.uid), r.append(u), n != null && n.css && (n.css = this.addIdToSelector(n.css, e.id)), Rt(r), new i({
      target: u,
      props: {
        ...n,
        editable: !1,
        __service: e.uid
      }
    }), (v = (w = window.Fouita) == null ? void 0 : w.Tracker) == null || v.call(e.uid, "Display");
  },
  remove(t) {
    const e = document.getElementById(t);
    if (e) {
      const i = e.parentElement;
      if (i) {
        const n = i.getAttribute("id"), r = document.querySelectorAll(`div[id="${n}"]`);
        for (let s of r)
          s.remove();
      }
    }
  },
  isInPage(t) {
    return !!document.getElementById(t);
  },
  addIdToSelector(t, e) {
    var r, s, o, d;
    const i = t.split("}");
    for (let u = 0; u < i.length; u++)
      if (i[u].trim() !== "") {
        const h = i[u].split("{");
        if (h.length > 1) {
          const _ = h[0].split(",");
          for (let w = 0; w < _.length; w++)
            _[w] = (s = (r = _[w]) == null ? void 0 : r.replace(/^[\n\t\s]+/g, "")) != null ? s : "", !((o = _[w]) != null && o.startsWith("#")) && !((d = _[w]) != null && d.startsWith("@")) && (_[w] = `#${e} ${_[w]}`);
          h[0] = _.join(","), i[u] = h.join("{");
        }
      }
    let n = i.join("}");
    return n = t.replace(/([^{}]+)\{([^{}]+)\}/g, (u, h, _) => {
      const w = _.trim().replace(/;$/, "").split(";").map((x) => (x = x.trim(), x)).join(";"), v = h.trim();
      return v.startsWith("#") ? `${v} { ${w} }` : `#${e} ${v} { ${w} }`;
    }), n;
  }
};
var K = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Ct = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n();
  })(K, function() {
    var i = 1e3, n = 6e4, r = 36e5, s = "millisecond", o = "second", d = "minute", u = "hour", h = "day", _ = "week", w = "month", v = "quarter", x = "year", O = "date", a = "Invalid Date", D = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, N = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, b = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(m) {
      var l = ["th", "st", "nd", "rd"], c = m % 100;
      return "[" + m + (l[(c - 20) % 10] || l[c] || l[0]) + "]";
    } }, M = function(m, l, c) {
      var g = String(m);
      return !g || g.length >= l ? m : "" + Array(l + 1 - g.length).join(c) + m;
    }, L = { s: M, z: function(m) {
      var l = -m.utcOffset(), c = Math.abs(l), g = Math.floor(c / 60), f = c % 60;
      return (l <= 0 ? "+" : "-") + M(g, 2, "0") + ":" + M(f, 2, "0");
    }, m: function m(l, c) {
      if (l.date() < c.date())
        return -m(c, l);
      var g = 12 * (c.year() - l.year()) + (c.month() - l.month()), f = l.clone().add(g, w), y = c - f < 0, $ = l.clone().add(g + (y ? -1 : 1), w);
      return +(-(g + (c - f) / (y ? f - $ : $ - f)) || 0);
    }, a: function(m) {
      return m < 0 ? Math.ceil(m) || 0 : Math.floor(m);
    }, p: function(m) {
      return { M: w, y: x, w: _, d: h, D: O, h: u, m: d, s: o, ms: s, Q: v }[m] || String(m || "").toLowerCase().replace(/s$/, "");
    }, u: function(m) {
      return m === void 0;
    } }, A = "en", S = {};
    S[A] = b;
    var k = "$isDayjsObject", C = function(m) {
      return m instanceof U || !(!m || !m[k]);
    }, F = function m(l, c, g) {
      var f;
      if (!l)
        return A;
      if (typeof l == "string") {
        var y = l.toLowerCase();
        S[y] && (f = y), c && (S[y] = c, f = y);
        var $ = l.split("-");
        if (!f && $.length > 1)
          return m($[0]);
      } else {
        var E = l.name;
        S[E] = l, f = E;
      }
      return !g && f && (A = f), f || !g && A;
    }, T = function(m, l) {
      if (C(m))
        return m.clone();
      var c = typeof l == "object" ? l : {};
      return c.date = m, c.args = arguments, new U(c);
    }, p = L;
    p.l = F, p.i = C, p.w = function(m, l) {
      return T(m, { locale: l.$L, utc: l.$u, x: l.$x, $offset: l.$offset });
    };
    var U = function() {
      function m(c) {
        this.$L = F(c.locale, null, !0), this.parse(c), this.$x = this.$x || c.x || {}, this[k] = !0;
      }
      var l = m.prototype;
      return l.parse = function(c) {
        this.$d = function(g) {
          var f = g.date, y = g.utc;
          if (f === null)
            return new Date(NaN);
          if (p.u(f))
            return new Date();
          if (f instanceof Date)
            return new Date(f);
          if (typeof f == "string" && !/Z$/i.test(f)) {
            var $ = f.match(D);
            if ($) {
              var E = $[2] - 1 || 0, I = ($[7] || "0").substring(0, 3);
              return y ? new Date(Date.UTC($[1], E, $[3] || 1, $[4] || 0, $[5] || 0, $[6] || 0, I)) : new Date($[1], E, $[3] || 1, $[4] || 0, $[5] || 0, $[6] || 0, I);
            }
          }
          return new Date(f);
        }(c), this.init();
      }, l.init = function() {
        var c = this.$d;
        this.$y = c.getFullYear(), this.$M = c.getMonth(), this.$D = c.getDate(), this.$W = c.getDay(), this.$H = c.getHours(), this.$m = c.getMinutes(), this.$s = c.getSeconds(), this.$ms = c.getMilliseconds();
      }, l.$utils = function() {
        return p;
      }, l.isValid = function() {
        return this.$d.toString() !== a;
      }, l.isSame = function(c, g) {
        var f = T(c);
        return this.startOf(g) <= f && f <= this.endOf(g);
      }, l.isAfter = function(c, g) {
        return T(c) < this.startOf(g);
      }, l.isBefore = function(c, g) {
        return this.endOf(g) < T(c);
      }, l.$g = function(c, g, f) {
        return p.u(c) ? this[g] : this.set(f, c);
      }, l.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, l.valueOf = function() {
        return this.$d.getTime();
      }, l.startOf = function(c, g) {
        var f = this, y = !!p.u(g) || g, $ = p.p(c), E = function(Z, P) {
          var j = p.w(f.$u ? Date.UTC(f.$y, P, Z) : new Date(f.$y, P, Z), f);
          return y ? j : j.endOf(h);
        }, I = function(Z, P) {
          return p.w(f.toDate()[Z].apply(f.toDate("s"), (y ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(P)), f);
        }, Y = this.$W, H = this.$M, z = this.$D, X = "set" + (this.$u ? "UTC" : "");
        switch ($) {
          case x:
            return y ? E(1, 0) : E(31, 11);
          case w:
            return y ? E(1, H) : E(0, H + 1);
          case _:
            var q = this.$locale().weekStart || 0, tt = (Y < q ? Y + 7 : Y) - q;
            return E(y ? z - tt : z + (6 - tt), H);
          case h:
          case O:
            return I(X + "Hours", 0);
          case u:
            return I(X + "Minutes", 1);
          case d:
            return I(X + "Seconds", 2);
          case o:
            return I(X + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, l.endOf = function(c) {
        return this.startOf(c, !1);
      }, l.$set = function(c, g) {
        var f, y = p.p(c), $ = "set" + (this.$u ? "UTC" : ""), E = (f = {}, f[h] = $ + "Date", f[O] = $ + "Date", f[w] = $ + "Month", f[x] = $ + "FullYear", f[u] = $ + "Hours", f[d] = $ + "Minutes", f[o] = $ + "Seconds", f[s] = $ + "Milliseconds", f)[y], I = y === h ? this.$D + (g - this.$W) : g;
        if (y === w || y === x) {
          var Y = this.clone().set(O, 1);
          Y.$d[E](I), Y.init(), this.$d = Y.set(O, Math.min(this.$D, Y.daysInMonth())).$d;
        } else
          E && this.$d[E](I);
        return this.init(), this;
      }, l.set = function(c, g) {
        return this.clone().$set(c, g);
      }, l.get = function(c) {
        return this[p.p(c)]();
      }, l.add = function(c, g) {
        var f, y = this;
        c = Number(c);
        var $ = p.p(g), E = function(H) {
          var z = T(y);
          return p.w(z.date(z.date() + Math.round(H * c)), y);
        };
        if ($ === w)
          return this.set(w, this.$M + c);
        if ($ === x)
          return this.set(x, this.$y + c);
        if ($ === h)
          return E(1);
        if ($ === _)
          return E(7);
        var I = (f = {}, f[d] = n, f[u] = r, f[o] = i, f)[$] || 1, Y = this.$d.getTime() + c * I;
        return p.w(Y, this);
      }, l.subtract = function(c, g) {
        return this.add(-1 * c, g);
      }, l.format = function(c) {
        var g = this, f = this.$locale();
        if (!this.isValid())
          return f.invalidDate || a;
        var y = c || "YYYY-MM-DDTHH:mm:ssZ", $ = p.z(this), E = this.$H, I = this.$m, Y = this.$M, H = f.weekdays, z = f.months, X = f.meridiem, q = function(P, j, et, st) {
          return P && (P[j] || P(g, y)) || et[j].slice(0, st);
        }, tt = function(P) {
          return p.s(E % 12 || 12, P, "0");
        }, Z = X || function(P, j, et) {
          var st = P < 12 ? "AM" : "PM";
          return et ? st.toLowerCase() : st;
        };
        return y.replace(N, function(P, j) {
          return j || function(et) {
            switch (et) {
              case "YY":
                return String(g.$y).slice(-2);
              case "YYYY":
                return p.s(g.$y, 4, "0");
              case "M":
                return Y + 1;
              case "MM":
                return p.s(Y + 1, 2, "0");
              case "MMM":
                return q(f.monthsShort, Y, z, 3);
              case "MMMM":
                return q(z, Y);
              case "D":
                return g.$D;
              case "DD":
                return p.s(g.$D, 2, "0");
              case "d":
                return String(g.$W);
              case "dd":
                return q(f.weekdaysMin, g.$W, H, 2);
              case "ddd":
                return q(f.weekdaysShort, g.$W, H, 3);
              case "dddd":
                return H[g.$W];
              case "H":
                return String(E);
              case "HH":
                return p.s(E, 2, "0");
              case "h":
                return tt(1);
              case "hh":
                return tt(2);
              case "a":
                return Z(E, I, !0);
              case "A":
                return Z(E, I, !1);
              case "m":
                return String(I);
              case "mm":
                return p.s(I, 2, "0");
              case "s":
                return String(g.$s);
              case "ss":
                return p.s(g.$s, 2, "0");
              case "SSS":
                return p.s(g.$ms, 3, "0");
              case "Z":
                return $;
            }
            return null;
          }(P) || $.replace(":", "");
        });
      }, l.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, l.diff = function(c, g, f) {
        var y, $ = this, E = p.p(g), I = T(c), Y = (I.utcOffset() - this.utcOffset()) * n, H = this - I, z = function() {
          return p.m($, I);
        };
        switch (E) {
          case x:
            y = z() / 12;
            break;
          case w:
            y = z();
            break;
          case v:
            y = z() / 3;
            break;
          case _:
            y = (H - Y) / 6048e5;
            break;
          case h:
            y = (H - Y) / 864e5;
            break;
          case u:
            y = H / r;
            break;
          case d:
            y = H / n;
            break;
          case o:
            y = H / i;
            break;
          default:
            y = H;
        }
        return f ? y : p.a(y);
      }, l.daysInMonth = function() {
        return this.endOf(w).$D;
      }, l.$locale = function() {
        return S[this.$L];
      }, l.locale = function(c, g) {
        if (!c)
          return this.$L;
        var f = this.clone(), y = F(c, g, !0);
        return y && (f.$L = y), f;
      }, l.clone = function() {
        return p.w(this.$d, this);
      }, l.toDate = function() {
        return new Date(this.valueOf());
      }, l.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, l.toISOString = function() {
        return this.$d.toISOString();
      }, l.toString = function() {
        return this.$d.toUTCString();
      }, m;
    }(), W = U.prototype;
    return T.prototype = W, [["$ms", s], ["$s", o], ["$m", d], ["$H", u], ["$W", h], ["$M", w], ["$y", x], ["$D", O]].forEach(function(m) {
      W[m[1]] = function(l) {
        return this.$g(l, m[0], m[1]);
      };
    }), T.extend = function(m, l) {
      return m.$i || (m(l, U, T), m.$i = !0), T;
    }, T.locale = F, T.isDayjs = C, T.unix = function(m) {
      return T(1e3 * m);
    }, T.en = S[A], T.Ls = S, T.p = {}, T;
  });
})(Ct);
const rt = Ct.exports;
var kt = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n();
  })(K, function() {
    var i = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 }, n = {};
    return function(r, s, o) {
      var d, u = function(v, x, O) {
        O === void 0 && (O = {});
        var a = new Date(v), D = function(N, b) {
          b === void 0 && (b = {});
          var M = b.timeZoneName || "short", L = N + "|" + M, A = n[L];
          return A || (A = new Intl.DateTimeFormat("en-US", { hour12: !1, timeZone: N, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: M }), n[L] = A), A;
        }(x, O);
        return D.formatToParts(a);
      }, h = function(v, x) {
        for (var O = u(v, x), a = [], D = 0; D < O.length; D += 1) {
          var N = O[D], b = N.type, M = N.value, L = i[b];
          L >= 0 && (a[L] = parseInt(M, 10));
        }
        var A = a[3], S = A === 24 ? 0 : A, k = a[0] + "-" + a[1] + "-" + a[2] + " " + S + ":" + a[4] + ":" + a[5] + ":000", C = +v;
        return (o.utc(k).valueOf() - (C -= C % 1e3)) / 6e4;
      }, _ = s.prototype;
      _.tz = function(v, x) {
        v === void 0 && (v = d);
        var O = this.utcOffset(), a = this.toDate(), D = a.toLocaleString("en-US", { timeZone: v }), N = Math.round((a - new Date(D)) / 1e3 / 60), b = o(D, { locale: this.$L }).$set("millisecond", this.$ms).utcOffset(15 * -Math.round(a.getTimezoneOffset() / 15) - N, !0);
        if (x) {
          var M = b.utcOffset();
          b = b.add(O - M, "minute");
        }
        return b.$x.$timezone = v, b;
      }, _.offsetName = function(v) {
        var x = this.$x.$timezone || o.tz.guess(), O = u(this.valueOf(), x, { timeZoneName: v }).find(function(a) {
          return a.type.toLowerCase() === "timezonename";
        });
        return O && O.value;
      };
      var w = _.startOf;
      _.startOf = function(v, x) {
        if (!this.$x || !this.$x.$timezone)
          return w.call(this, v, x);
        var O = o(this.format("YYYY-MM-DD HH:mm:ss:SSS"), { locale: this.$L });
        return w.call(O, v, x).tz(this.$x.$timezone, !0);
      }, o.tz = function(v, x, O) {
        var a = O && x, D = O || x || d, N = h(+o(), D);
        if (typeof v != "string")
          return o(v).tz(D);
        var b = function(S, k, C) {
          var F = S - 60 * k * 1e3, T = h(F, C);
          if (k === T)
            return [F, k];
          var p = h(F -= 60 * (T - k) * 1e3, C);
          return T === p ? [F, T] : [S - 60 * Math.min(T, p) * 1e3, Math.max(T, p)];
        }(o.utc(v, a).valueOf(), N, D), M = b[0], L = b[1], A = o(M).utcOffset(L);
        return A.$x.$timezone = D, A;
      }, o.tz.guess = function() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      }, o.tz.setDefault = function(v) {
        d = v;
      };
    };
  });
})(kt);
const Zt = kt.exports;
var Ft = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n();
  })(K, function() {
    var i = "minute", n = /[+-]\d\d(?::?\d\d)?/g, r = /([+-]|\d\d)/g;
    return function(s, o, d) {
      var u = o.prototype;
      d.utc = function(a) {
        var D = { date: a, utc: !0, args: arguments };
        return new o(D);
      }, u.utc = function(a) {
        var D = d(this.toDate(), { locale: this.$L, utc: !0 });
        return a ? D.add(this.utcOffset(), i) : D;
      }, u.local = function() {
        return d(this.toDate(), { locale: this.$L, utc: !1 });
      };
      var h = u.parse;
      u.parse = function(a) {
        a.utc && (this.$u = !0), this.$utils().u(a.$offset) || (this.$offset = a.$offset), h.call(this, a);
      };
      var _ = u.init;
      u.init = function() {
        if (this.$u) {
          var a = this.$d;
          this.$y = a.getUTCFullYear(), this.$M = a.getUTCMonth(), this.$D = a.getUTCDate(), this.$W = a.getUTCDay(), this.$H = a.getUTCHours(), this.$m = a.getUTCMinutes(), this.$s = a.getUTCSeconds(), this.$ms = a.getUTCMilliseconds();
        } else
          _.call(this);
      };
      var w = u.utcOffset;
      u.utcOffset = function(a, D) {
        var N = this.$utils().u;
        if (N(a))
          return this.$u ? 0 : N(this.$offset) ? w.call(this) : this.$offset;
        if (typeof a == "string" && (a = function(A) {
          A === void 0 && (A = "");
          var S = A.match(n);
          if (!S)
            return null;
          var k = ("" + S[0]).match(r) || ["-", 0, 0], C = k[0], F = 60 * +k[1] + +k[2];
          return F === 0 ? 0 : C === "+" ? F : -F;
        }(a), a === null))
          return this;
        var b = Math.abs(a) <= 16 ? 60 * a : a, M = this;
        if (D)
          return M.$offset = b, M.$u = a === 0, M;
        if (a !== 0) {
          var L = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
          (M = this.local().add(b + L, i)).$offset = b, M.$x.$localOffset = L;
        } else
          M = this.utc();
        return M;
      };
      var v = u.format;
      u.format = function(a) {
        var D = a || (this.$u ? "YYYY-MM-DDTHH:mm:ss[Z]" : "");
        return v.call(this, D);
      }, u.valueOf = function() {
        var a = this.$utils().u(this.$offset) ? 0 : this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset());
        return this.$d.valueOf() - 6e4 * a;
      }, u.isUTC = function() {
        return !!this.$u;
      }, u.toISOString = function() {
        return this.toDate().toISOString();
      }, u.toString = function() {
        return this.toDate().toUTCString();
      };
      var x = u.toDate;
      u.toDate = function(a) {
        return a === "s" && this.$offset ? d(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate() : x.call(this);
      };
      var O = u.diff;
      u.diff = function(a, D, N) {
        if (a && this.$u === a.$u)
          return O.call(this, a, D, N);
        var b = this.local(), M = d(a).local();
        return O.call(b, M, D, N);
      };
    };
  });
})(Ft);
const Qt = Ft.exports;
var It = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n();
  })(K, function() {
    return function(i, n) {
      n.prototype.isSameOrBefore = function(r, s) {
        return this.isSame(r, s) || this.isBefore(r, s);
      };
    };
  });
})(It);
const Xt = It.exports;
var Lt = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n();
  })(K, function() {
    return function(i, n) {
      n.prototype.isSameOrAfter = function(r, s) {
        return this.isSame(r, s) || this.isAfter(r, s);
      };
    };
  });
})(Lt);
const Gt = Lt.exports;
var Kt = { exports: {} };
(function(t, e) {
  (function(i, n) {
    t.exports = n();
  })(K, function() {
    return { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), ordinal: function(i) {
      var n = ["th", "st", "nd", "rd"], r = i % 100;
      return "[" + i + (n[(r - 20) % 10] || n[r] || n[0]) + "]";
    } };
  });
})(Kt);
rt.extend(Zt);
rt.extend(Qt);
rt.extend(Gt);
rt.extend(Xt);
let ct = {
  top: [],
  middle: [],
  end: []
}, ft = [], nt = [];
function pt(t) {
  for (let e of ct[t])
    e == null || e();
  ct[t] = [];
}
function te(t) {
  const e = (t == null ? void 0 : t.tz) || "Europe/Paris", i = rt().tz(e), n = i.format("dddd"), r = t == null ? void 0 : t.schedule.find((d) => d.day === n);
  if (!(r != null && r.checked))
    return !1;
  const s = i.format("YYYY-MM-DD");
  if (t.closeDays.some((d) => {
    if (d.value === "Single day" && d.date === s)
      return !0;
    if (d.value === "Range days" && d.range) {
      const [u, h] = d.range.split(" to ");
      return i.isSameOrAfter(u, "day") && i.isSameOrBefore(h, "day");
    }
    return !1;
  }))
    return !1;
  for (let d = 0; d < r.dateFrom.length; d++) {
    const u = r.dateFrom[d], h = r.dateTo[d];
    if (u !== "From" && h !== "To") {
      const [_, w] = u.split(":"), [v, x] = h.split(":");
      if (i.set("hour", _).set("minute", w).isBefore() && i.set("hour", v).set("minute", x).isAfter())
        return !0;
    }
  }
  return !1;
}
document.addEventListener("scroll", (t) => {
  let e = document.body;
  window.scrollY > 0 && pt("top"), e.scrollHeight / 3 - window.scrollY - window.innerHeight <= 5 && pt("middle"), e.scrollHeight - window.scrollY - window.innerHeight <= 10 && pt("end");
});
function mt(t = 0) {
  if (nt.length == 0 && t < 200) {
    setTimeout(() => mt(t + 1), 100);
    return;
  }
  for (let e of nt)
    e == null || e();
  nt = [], setTimeout(() => mt(0), 200);
}
window.addEventListener("widgetload", () => {
  mt();
});
function lt() {
  for (let t of ft)
    t == null || t();
  ft = [];
}
const ee = Q.browser() === "Safari";
ee ? document.addEventListener("mousemove", (t) => {
  const e = window.innerWidth, i = window.innerHeight;
  (t.x < 10 && t.movementX < 0 || t.x > e - 10 && t.movementX > 0 || t.y < 10 && t.movementY < 0 || t.y > i - 10 && t.movementY > 0) && lt();
}) : document.addEventListener("mouseleave", lt);
const ne = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
if (ne)
  try {
    let r = function() {
      lt();
    }, s = function() {
      (window.pageYOffset || document.documentElement.scrollTop) - i < -600 && r();
    }, u = function() {
      clearTimeout(d), d = setTimeout(h, o);
    }, h = function() {
      lt();
    }, e = 0, i = 0, n = 0;
    window.addEventListener("touchstart", function(_) {
      e = _.touches[0].clientY, i = window.pageYOffset || document.documentElement.scrollTop, n = Date.now();
    }), window.addEventListener("touchend", function(_) {
      setTimeout(s, 500);
    });
    const o = 1e4;
    let d;
    document.addEventListener("keydown", u), document.addEventListener("touchstart", u), setTimeout(u, 3e3);
  } catch {
  }
function ie(t) {
  if (!(t != null && t.length))
    return !1;
  let e = !1, i = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [n, r] = i.split("/", 2);
  for (let s of t)
    e || (e = ["All", n].includes(s.region) && ["All", r].includes(s.state));
  return e;
}
const gt = {
  resetEvts() {
    ct = {
      top: [],
      middle: [],
      end: []
    }, ft = [], nt = [];
  },
  reset() {
    var t;
    V.set("ft/vstr", { uid: (t = V.get("ft/vstr")) == null ? void 0 : t.uid }), this.resetEvts();
  },
  getVisitor() {
    return V.get("ft/vstr");
  },
  setVisitor(t) {
    V.set("ft/vstr", { ...this.getVisitor(), ...t });
  },
  getVisitorFlow(t) {
    var e, i, n;
    return (n = (i = this.getVisitor()) == null ? void 0 : i[(e = t.vuid) != null ? e : t.uid]) != null ? n : {};
  },
  setVisitorFlow(t, e) {
    var n;
    const i = this.getVisitorFlow(t);
    this.setVisitor({ [(n = t.vuid) != null ? n : t.uid]: { ...i, ...e } });
  },
  canLoadCmp(t) {
    return t.action_flow ? (this.setUserNextVisit(t), this.execActionFlow(t)) : !0;
  },
  setUserNextVisit(t) {
    const e = this.getVisitorFlow(t);
    e.num_visits = e.num_visits !== void 0 ? e.num_visits + 1 : 0, this.setVisitorFlow(t, { num_visits: e.num_visits });
  },
  execActionFlow(t) {
    let e = t.action_flow;
    return this.setupEvents(t, e), this.setupTriggers(t, e.triggers), !1;
  },
  setupEvents(t, e) {
    e.page_enter.act != "N/A" && this.setupPageEnterEvent(t, e.page_enter, "page_enter"), e.scroll.act != "N/A" && this.setupScrollEvent(t, e.scroll, "scroll"), e.page_leave.act != "N/A" && this.setupPageLeaveEvent(t, e.page_leave, "page_leave"), e.page_action.act != "N/A" && this.setupPageActionEvent(t, e.page_action, "page_action");
  },
  setShowCmp(t, e, i) {
    return () => {
      var D, N, b, M, L, A, S, k, C, F, T;
      const n = t.action_flow.conditions, r = n.url_param.act;
      if (r !== "N/A") {
        const U = new URLSearchParams(window.location.search).get(n.url_param.cond.param) === n.url_param.cond.eq;
        if (r === "show" && !U || r === "hide" && U)
          return;
      }
      const s = (N = (D = n.url_matching) == null ? void 0 : D.act) != null ? N : "N/A";
      let o = "", d = "";
      try {
        o = window.top.location.href, d = window.top.location.pathname;
      } catch {
      }
      if (s !== "N/A" && o && !o.startsWith("https://embed.fouita.com")) {
        const p = ((M = (b = n.url_matching) == null ? void 0 : b.pages) != null ? M : []).some((U) => {
          var m;
          return !U.path || U.path === "/" ? d === "/" : new RegExp(encodeURI((m = U.path) != null ? m : ""), "i").test(o);
        });
        if (s === "show" && !p || s === "hide" && p)
          return;
      }
      const u = n.visitor_region.act;
      if (u !== "N/A") {
        let p = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const [U, W] = p.split("/", 2), m = ["All", U].includes(n.visitor_region.cond.region) && ["All", W].includes(n.visitor_region.cond.state) || ie(n.visitor_region.more_conds);
        if (u === "show" && !m || u === "hide" && m)
          return;
      }
      const h = (A = (L = n.visitor_countries) == null ? void 0 : L.act) != null ? A : "N/A";
      if (h !== "N/A") {
        let p = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const U = ((k = (S = n.visitor_countries) == null ? void 0 : S.countries) != null ? k : []).some((W) => {
          var m;
          return ((m = W == null ? void 0 : W.tz) != null ? m : []).includes(p);
        });
        if (h === "show" && !U || h === "hide" && U)
          return;
      }
      const _ = n.device.act;
      if (_ !== "N/A") {
        const p = n.device.cond.eq === Q.device();
        if (_ === "show" && !p || _ === "hide" && p)
          return;
      }
      const w = n.browser.act;
      if (w !== "N/A") {
        const p = n.browser.cond.eq === Q.browser();
        if (w === "show" && !p || w === "hide" && p)
          return;
      }
      const v = n.os.act;
      if (v !== "N/A") {
        const p = n.os.cond.eq === Q.os();
        if (v === "show" && !p || v === "hide" && p)
          return;
      }
      const x = (C = n.schedule) == null ? void 0 : C.act;
      if (x && x !== "N/A") {
        const p = +new Date(n.schedule.cond.at) <= +new Date();
        if (x === "show" && !p)
          return;
      }
      const O = (F = n.scheduleHide) == null ? void 0 : F.act;
      if (O && O !== "N/A") {
        const p = +new Date(n.scheduleHide.cond.at) <= +new Date();
        if (O === "hide" && p)
          return;
      }
      const a = this.getVisitorFlow(t);
      i !== "page_action" && (a.next_show_time > +new Date() || a.next_show_visit && a.next_show_visit > a.num_visits || e.after_visit > a.num_visits) || e.total_show <= a.num_shows || a.next_time && a.next_time > +new Date() || ((T = t.action_flow) == null ? void 0 : T.sc) && t.action_flow.sc.active && !te(t.action_flow.sc) || setTimeout(() => {
        G.insert(t.uid), this.setNextShowVisit(t, e), e.for_time > 0 && setTimeout(() => {
          this.rmPcmp(t);
        }, e.for_time * 1e3);
      }, e.after_time * 1e3);
    };
  },
  setNextShowVisit(t, e) {
    var n, r, s;
    const i = this.getVisitorFlow(t);
    i.num_shows = ((n = i.num_shows) != null ? n : 0) + 1, i.next_show_visit = Math.max((r = i.next_show_visit) != null ? r : 0, (s = i.num_visits) != null ? s : 0) + e.every_visit, i.next_time = +e.every_time ? +new Date() + e.every_time * 60 * 1e3 : 0, this.setVisitorFlow(t, { next_show_visit: i.next_show_visit, num_shows: i.num_shows, next_time: i.next_time });
  },
  setHideCmp(t, e, i) {
    return () => {
      var n, r;
      if (!!G.isInPage(t.uid)) {
        if (e.for_time) {
          const s = +new Date() + (~e.for_time ? e.for_time * 1e3 : 1578e9);
          this.setVisitorFlow(t, { next_show_time: s });
        }
        if (e.for_next) {
          const s = this.getVisitorFlow(t);
          s.next_show_visit = Math.max((n = s.next_show_visit) != null ? n : 0, (r = s.num_visits) != null ? r : 0) + e.for_next, this.setVisitorFlow(t, { next_show_visit: s.next_show_visit });
        }
        i !== "trigger" && this.rmPcmp(t);
      }
    };
  },
  rmPcmp(t) {
    G.remove(t.uid);
  },
  setupPageEnterEvent(t, e, i) {
    let n = this.setupVisibility(t, e, i);
    nt.push(n);
  },
  setupScrollEvent(t, e, i) {
    let n = this.setupVisibility(t, e, i);
    ct[e.scroll_type].push(n);
  },
  setupPageLeaveEvent(t, e, i) {
    let n = this.setupVisibility(t, e, i);
    ft.push(n);
  },
  setupPageActionEvent(t, e, i) {
    let n = this.setupVisibility(t, e, i);
    this.listenAction(e.action, n);
  },
  setupVisibility(t, e, i) {
    let n;
    return e.act === "show" && (n = this.setShowCmp(t, e.show, i)), e.act === "hide" && (n = this.setHideCmp(t, e.hide, i)), dispatchEvent(new Event("widgetload")), n;
  },
  getByXpath: function(t, e = document) {
    return e.evaluate(t, e, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  },
  listenAction(t, e) {
    var n;
    if (!t.xpath)
      return;
    const i = document.evaluate(t.xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let r = 0; r < ((n = i == null ? void 0 : i.snapshotLength) != null ? n : 0); r++)
      i.snapshotItem(r).addEventListener(t.name, () => {
        e == null || e();
      });
    if (!(i != null && i.snapshotLength)) {
      setTimeout(() => {
        this.listenAction(t, e);
      }, 200);
      return;
    }
  },
  setupTriggers(t, e) {
    var n;
    if (!(e != null && e.length))
      return;
    const i = {};
    for (let r of e) {
      let s = this.setupVisibility(t, r, "trigger");
      i[r.name] = () => setTimeout(s, 500);
    }
    Nt.listen((n = t.vuid) != null ? n : t.uid, (r) => {
      var s;
      (s = i[r]) == null || s.call(i);
    });
  }
};
async function re(t) {
  var n;
  let e = V.get(`ftw/${t}`);
  if (e && e.exp > +new Date())
    return e.data;
  e = await it("/q/widget", { uid: t });
  const i = (n = e.q) == null ? void 0 : n[0];
  if (i) {
    const r = 1e4 + +new Date();
    return V.set(`ftw/${t}`, { exp: r, data: i }), i;
  }
  return null;
}
function se(t) {
  return t.replace(/([^{}]+)\{([^{}]+)\}/g, (i, n, r) => {
    const s = r.trim().replace(/;$/, "").split(";").map((o) => o.trim() + " !important").join(";");
    return `${n.trim()} { ${s} }`;
  });
}
let wt = "";
try {
  wt = window.location.href;
} catch {
}
function oe(t) {
  for (let e of t)
    import(e);
}
async function ue(t, e) {
  var o, d, u;
  const i = se(J.decode(e)), n = await re(t);
  if (!n)
    return;
  const r = (d = (o = n.data_feed) == null ? void 0 : o[0]) == null ? void 0 : d.feed_data;
  n.feed = r ? JSON.parse(J.decode(r)) : {}, n.action_flow = JSON.parse(J.decode(n.action_flow)), n.css = i, G.cmps[n.uid] = n;
  const s = ((u = n.dep_urls) != null ? u : "").split(" ").concat(n.url);
  oe([...new Set(s)]), gt.canLoadCmp(n) && G.insert(n.uid), setTimeout(() => {
    Yt(n);
  }, 1e3);
}
function Yt(t) {
  let e = "";
  try {
    e = window.location.href;
  } catch {
  }
  wt !== e && !e.startsWith("https://embed.fouita.com") && !e.startsWith("https://emb.fouita.com") && (gt.resetEvts(), gt.canLoadCmp(t) && G.insert(t.uid), wt = e), setTimeout(() => {
    Yt(t);
  }, 1e3);
}
var yt;
!((yt = window.Fouita) != null && yt.Form) && B.set("Form", Jt);
var $t;
!(($t = window.Fouita) != null && $t.request) && B.set("request", it);
var _t;
!((_t = window.Fouita) != null && _t.mutate) && B.set("mutate", it);
var St;
!((St = window.Fouita) != null && St.Tracker) && B.set("Tracker.call", Q.track);
var xt;
!((xt = window.Fouita) != null && xt.Trigger) && B.set("Trigger.call", Nt.call);
var Ot;
!((Ot = window.Fouita) != null && Ot.Integration) && B.set("Integration", zt.setUpIntegration());
var Tt;
!((Tt = window.Fouita) != null && Tt.widgetEditor) && B.set("widgetEditor", () => null);
var Dt;
(Dt = window.Fouita) != null && Dt.Quiz || (B.set("Quiz.vote", ut.vote), B.set("Quiz.summary", ut.voteSummary), B.set("Quiz.init", ut.init), B.set("Quiz.hasVoted", ut.hasVoted));
var bt;
(bt = window.Fouita) != null && bt.DB || B.set("DB", Bt);
const ae = ue;
export {
  ae as Loader
};