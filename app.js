const NS = "http://www.w3.org/2000/svg";
const W = 900, H = 420, padL = 96, padR = 96, padT = 40, padB = 64;
const xT1 = padL, xT2 = W - padR, plotH = H - padT - padB;
const yFor = v => padT + (v - 1) / 4 * plotH;
const chartEl = document.getElementById("chart");
const cardsEl = document.getElementById("cards");
const filtersEl = document.getElementById("filters");
const toolbarEl = document.getElementById("chartToolbar");
let activeGroup = "all", activeChild = null;

function svgEl(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

/* 端点标签防重叠 */
(function () {
  const b1 = {}, b2 = {};
  CHILDREN.forEach(c => { (b1[c.t1] = b1[c.t1] || []).push(c); (b2[c.t2] = b2[c.t2] || []).push(c); });
  CHILDREN.forEach(c => {
    c._o1 = (b1[c.t1].indexOf(c) - (b1[c.t1].length - 1) / 2) * 13;
    c._o2 = (b2[c.t2].indexOf(c) - (b2[c.t2].length - 1) / 2) * 13;
  });
})();

function renderChart() {
  const svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, preserveAspectRatio: "xMidYMid meet" });
  RISK_LEVELS.forEach(function (r) {
    const y = yFor(r.v);
    svg.appendChild(svgEl("line", { x1: padL - 12, y1: y, x2: W - padR + 12, y2: y, class: "gridline" }));
    const t = svgEl("text", { x: padL - 18, y: y + 4, "text-anchor": "end", class: "ylab" });
    t.textContent = r.v + "  " + r.name; svg.appendChild(t);
  });
  [["T1  2025", xT1], ["T2  2026", xT2]].forEach(function (p) {
    const t = svgEl("text", { x: p[1], y: H - 20, "text-anchor": "middle", class: "xlab" });
    t.textContent = p[0]; svg.appendChild(t);
  });
  CHILDREN.forEach(function (c) {
    const g = GROUPS[c.group];
    const p = svgEl("path", { d: "M " + xT1 + " " + yFor(c.t1) + " L " + xT2 + " " + yFor(c.t2), class: "traj", stroke: g.color, "data-id": c.id });
    p.addEventListener("click", function () { focusChild(c.id); });
    svg.appendChild(p);
    svg.appendChild(svgEl("circle", { cx: xT1, cy: yFor(c.t1), r: 4, fill: g.color, class: "dot" }));
    svg.appendChild(svgEl("circle", { cx: xT2, cy: yFor(c.t2), r: 4, fill: g.color, class: "dot" }));
    const a = svgEl("text", { x: xT1 - 12, y: yFor(c.t1) + 4 + c._o1, "text-anchor": "end", class: "ylab" });
    a.textContent = c.id; svg.appendChild(a);
    const b = svgEl("text", { x: xT2 + 12, y: yFor(c.t2) + 4 + c._o2, class: "ylab" });
    b.textContent = c.id; svg.appendChild(b);
  });
  chartEl.appendChild(svg);
}

function renderToolbar() {
  function add(key, label) {
    const b = document.createElement("button");
    b.className = "tb-btn"; b.textContent = label; b.dataset.group = key;
    b.onclick = function () { setGroup(key); }; toolbarEl.appendChild(b);
  }
  add("all", "全部 16 名");
  Object.keys(GROUPS).forEach(function (k) { add(k, GROUPS[k].label + "（" + GROUPS[k].count + "）"); });
}

function renderFilters() {
  function add(key, label) {
    const b = document.createElement("button");
    b.className = "filters-btn"; b.textContent = label; b.dataset.group = key;
    b.onclick = function () { setGroup(key); }; filtersEl.appendChild(b);
  }
  filtersEl.innerHTML = "";
  add("all", "全部");
  Object.keys(GROUPS).forEach(function (k) { add(k, GROUPS[k].label); });
}

function renderCards() {
  cardsEl.innerHTML = "";
  const order = { improved: 0, partial: 1, declined: 2 };
  CHILDREN.filter(function (c) { return activeGroup === "all" || c.group === activeGroup; })
    .slice().sort(function (a, b) { return order[a.group] - order[b.group]; })
    .forEach(function (c) {
      const g = GROUPS[c.group];
      const d = document.createElement("div");
      d.className = "card" + (activeChild === c.id ? " hl" : "");
      d.id = "card-" + c.id;
      d.innerHTML =
        '<div class="top"><span class="id">' + c.id + '</span><span class="tag ' + c.group + '">' + g.label + '</span></div>' +
        '<div class="riskrow"><span class="chip" style="background:' + g.color + '">T1 ' + c.t1 + '</span><span class="desc">' + c.t1d + '</span></div>' +
        '<div class="riskrow"><span class="chip" style="background:' + g.color + '">T2 ' + c.t2 + '</span><span class="desc">' + c.t2d + '</span></div>' +
        '<div class="desc" style="color:#94a3b8;font-size:12px;margin-top:6px">变化：' + c.change + '</div>';
      cardsEl.appendChild(d);
    });
}

function setGroup(key) {
  activeGroup = key;
  document.querySelectorAll(".tb-btn").forEach(function (b) {
    const on = b.dataset.group === key;
    b.classList.toggle("on", on);
    b.style.background = on ? (key === "all" ? "#0f172a" : GROUPS[key].color) : "#fff";
  });
  document.querySelectorAll(".filters button").forEach(function (b) { b.classList.toggle("on", b.dataset.group === key); });
  document.querySelectorAll(".traj").forEach(function (e) {
    const c = CHILDREN.find(function (x) { return x.id === e.getAttribute("data-id"); });
    e.style.opacity = (key !== "all" && c.group !== key) ? 0.1 : "";
  });
  renderCards();
}

function focusChild(id) {
  activeChild = id;
  setGroup("all");
  const card = document.getElementById("card-" + id);
  if (card) {
    document.querySelectorAll(".card").forEach(function (c) { c.classList.remove("hl"); });
    card.classList.add("hl");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

renderChart();
renderToolbar();
renderFilters();
renderCards();
setGroup("all");
