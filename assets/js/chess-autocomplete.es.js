class It {
  unwrap(e, n) {
    const s = this._chain((o) => L.ok(e ? e(o) : o), (o) => n ? L.ok(n(o)) : L.err(o));
    if (s.isErr)
      throw s.error;
    return s.value;
  }
  map(e, n) {
    return this._chain((s) => L.ok(e(s)), (s) => L.err(n ? n(s) : s));
  }
  chain(e, n) {
    return this._chain(e, n ?? ((s) => L.err(s)));
  }
}
class Tn extends It {
  constructor(e) {
    super(), this.value = e, this.isOk = !0, this.isErr = !1;
  }
  _chain(e, n) {
    return e(this.value);
  }
}
class Bn extends It {
  constructor(e) {
    super(), this.error = e, this.isOk = !1, this.isErr = !0;
  }
  _chain(e, n) {
    return n(this.error);
  }
}
var L;
(function(t) {
  function e(o) {
    return new Tn(o);
  }
  t.ok = e;
  function n(o) {
    return new Bn(o || new Error());
  }
  t.err = n;
  function s(o) {
    if (Array.isArray(o)) {
      const a = [];
      for (let l = 0; l < o.length; l++) {
        const c = o[l];
        if (c.isErr)
          return c;
        a.push(c.value);
      }
      return t.ok(a);
    }
    const i = {}, r = Object.keys(o);
    for (let a = 0; a < r.length; a++) {
      const l = o[r[a]];
      if (l.isErr)
        return l;
      i[r[a]] = l.value;
    }
    return t.ok(i);
  }
  t.all = s;
})(L || (L = {}));
const pt = (t) => (t = t - (t >>> 1 & 1431655765), t = (t & 858993459) + (t >>> 2 & 858993459), Math.imul(t + (t >>> 4) & 252645135, 16843009) >> 24), Ke = (t) => (t = t >>> 8 & 16711935 | (t & 16711935) << 8, t >>> 16 & 65535 | (t & 65535) << 16), mt = (t) => (t = t >>> 1 & 1431655765 | (t & 1431655765) << 1, t = t >>> 2 & 858993459 | (t & 858993459) << 2, t = t >>> 4 & 252645135 | (t & 252645135) << 4, Ke(t));
class u {
  constructor(e, n) {
    this.lo = e | 0, this.hi = n | 0;
  }
  static fromSquare(e) {
    return e >= 32 ? new u(0, 1 << e - 32) : new u(1 << e, 0);
  }
  static fromRank(e) {
    return new u(255, 0).shl64(8 * e);
  }
  static fromFile(e) {
    return new u(16843009 << e, 16843009 << e);
  }
  static empty() {
    return new u(0, 0);
  }
  static full() {
    return new u(4294967295, 4294967295);
  }
  static corners() {
    return new u(129, 2164260864);
  }
  static center() {
    return new u(402653184, 24);
  }
  static backranks() {
    return new u(255, 4278190080);
  }
  static backrank(e) {
    return e === "white" ? new u(255, 0) : new u(0, 4278190080);
  }
  static lightSquares() {
    return new u(1437226410, 1437226410);
  }
  static darkSquares() {
    return new u(2857740885, 2857740885);
  }
  complement() {
    return new u(~this.lo, ~this.hi);
  }
  xor(e) {
    return new u(this.lo ^ e.lo, this.hi ^ e.hi);
  }
  union(e) {
    return new u(this.lo | e.lo, this.hi | e.hi);
  }
  intersect(e) {
    return new u(this.lo & e.lo, this.hi & e.hi);
  }
  diff(e) {
    return new u(this.lo & ~e.lo, this.hi & ~e.hi);
  }
  intersects(e) {
    return this.intersect(e).nonEmpty();
  }
  isDisjoint(e) {
    return this.intersect(e).isEmpty();
  }
  supersetOf(e) {
    return e.diff(this).isEmpty();
  }
  subsetOf(e) {
    return this.diff(e).isEmpty();
  }
  shr64(e) {
    return e >= 64 ? u.empty() : e >= 32 ? new u(this.hi >>> e - 32, 0) : e > 0 ? new u(this.lo >>> e ^ this.hi << 32 - e, this.hi >>> e) : this;
  }
  shl64(e) {
    return e >= 64 ? u.empty() : e >= 32 ? new u(0, this.lo << e - 32) : e > 0 ? new u(this.lo << e, this.hi << e ^ this.lo >>> 32 - e) : this;
  }
  bswap64() {
    return new u(Ke(this.hi), Ke(this.lo));
  }
  rbit64() {
    return new u(mt(this.hi), mt(this.lo));
  }
  minus64(e) {
    const n = this.lo - e.lo, s = (n & e.lo & 1) + (e.lo >>> 1) + (n >>> 1) >>> 31;
    return new u(n, this.hi - (e.hi + s));
  }
  equals(e) {
    return this.lo === e.lo && this.hi === e.hi;
  }
  size() {
    return pt(this.lo) + pt(this.hi);
  }
  isEmpty() {
    return this.lo === 0 && this.hi === 0;
  }
  nonEmpty() {
    return this.lo !== 0 || this.hi !== 0;
  }
  has(e) {
    return (e >= 32 ? this.hi & 1 << e - 32 : this.lo & 1 << e) !== 0;
  }
  set(e, n) {
    return n ? this.with(e) : this.without(e);
  }
  with(e) {
    return e >= 32 ? new u(this.lo, this.hi | 1 << e - 32) : new u(this.lo | 1 << e, this.hi);
  }
  without(e) {
    return e >= 32 ? new u(this.lo, this.hi & ~(1 << e - 32)) : new u(this.lo & ~(1 << e), this.hi);
  }
  toggle(e) {
    return e >= 32 ? new u(this.lo, this.hi ^ 1 << e - 32) : new u(this.lo ^ 1 << e, this.hi);
  }
  last() {
    if (this.hi !== 0)
      return 63 - Math.clz32(this.hi);
    if (this.lo !== 0)
      return 31 - Math.clz32(this.lo);
  }
  first() {
    if (this.lo !== 0)
      return 31 - Math.clz32(this.lo & -this.lo);
    if (this.hi !== 0)
      return 63 - Math.clz32(this.hi & -this.hi);
  }
  withoutFirst() {
    return this.lo !== 0 ? new u(this.lo & this.lo - 1, this.hi) : new u(0, this.hi & this.hi - 1);
  }
  moreThanOne() {
    return this.hi !== 0 && this.lo !== 0 || (this.lo & this.lo - 1) !== 0 || (this.hi & this.hi - 1) !== 0;
  }
  singleSquare() {
    return this.moreThanOne() ? void 0 : this.last();
  }
  *[Symbol.iterator]() {
    let e = this.lo, n = this.hi;
    for (; e !== 0; ) {
      const s = 31 - Math.clz32(e & -e);
      e ^= 1 << s, yield s;
    }
    for (; n !== 0; ) {
      const s = 31 - Math.clz32(n & -n);
      n ^= 1 << s, yield 32 + s;
    }
  }
  *reversed() {
    let e = this.lo, n = this.hi;
    for (; n !== 0; ) {
      const s = 31 - Math.clz32(n);
      n ^= 1 << s, yield 32 + s;
    }
    for (; e !== 0; ) {
      const s = 31 - Math.clz32(e);
      e ^= 1 << s, yield s;
    }
  }
}
const ve = ["a", "b", "c", "d", "e", "f", "g", "h"], _t = ["1", "2", "3", "4", "5", "6", "7", "8"], ne = ["white", "black"], ge = ["pawn", "knight", "bishop", "rook", "queen", "king"], Ln = ["a", "h"], ke = (t) => "role" in t, He = (t) => "from" in t, C = (t) => t !== void 0, B = (t) => t === "white" ? "black" : "white", H = (t) => t >> 3, N = (t) => t & 7, An = (t, e) => 0 <= t && t < 8 && 0 <= e && e < 8 ? t + 8 * e : void 0, re = (t) => {
  switch (t) {
    case "pawn":
      return "p";
    case "knight":
      return "n";
    case "bishop":
      return "b";
    case "rook":
      return "r";
    case "queen":
      return "q";
    case "king":
      return "k";
  }
};
function ft(t) {
  switch (t.toLowerCase()) {
    case "p":
      return "pawn";
    case "n":
      return "knight";
    case "b":
      return "bishop";
    case "r":
      return "rook";
    case "q":
      return "queen";
    case "k":
      return "king";
    default:
      return;
  }
}
function be(t) {
  if (t.length === 2)
    return An(t.charCodeAt(0) - 97, t.charCodeAt(1) - 49);
}
const D = (t) => ve[N(t)] + _t[H(t)], $e = (t) => {
  if (t[1] === "@" && t.length === 4) {
    const e = ft(t[0]), n = be(t.slice(2));
    if (e && C(n))
      return { role: e, to: n };
  } else if (t.length === 4 || t.length === 5) {
    const e = be(t.slice(0, 2)), n = be(t.slice(2, 4));
    let s;
    if (t.length === 5 && (s = ft(t[4]), !s))
      return;
    if (C(e) && C(n))
      return { from: e, to: n, promotion: s };
  }
}, tt = (t, e) => t === "white" ? e === "a" ? 2 : 6 : e === "a" ? 58 : 62, nt = (t, e) => t === "white" ? e === "a" ? 3 : 5 : e === "a" ? 59 : 61, ye = (t, e) => {
  let n = u.empty();
  for (const s of e) {
    const o = t + s;
    0 <= o && o < 64 && Math.abs(N(t) - N(o)) <= 2 && (n = n.with(o));
  }
  return n;
}, q = (t) => {
  const e = [];
  for (let n = 0; n < 64; n++)
    e[n] = t(n);
  return e;
}, Dn = q((t) => ye(t, [-9, -8, -7, -1, 1, 7, 8, 9])), Rn = q((t) => ye(t, [-17, -15, -10, -6, 6, 10, 15, 17])), On = {
  white: q((t) => ye(t, [7, 9])),
  black: q((t) => ye(t, [-7, -9]))
}, st = (t) => Dn[t], ot = (t) => Rn[t], Ne = (t, e) => On[t][e], Ge = q((t) => u.fromFile(N(t)).without(t)), Fe = q((t) => u.fromRank(H(t)).without(t)), ze = q((t) => {
  const e = new u(134480385, 2151686160), n = 8 * (H(t) - N(t));
  return (n >= 0 ? e.shl64(n) : e.shr64(-n)).without(t);
}), Ue = q((t) => {
  const e = new u(270549120, 16909320), n = 8 * (H(t) + N(t) - 7);
  return (n >= 0 ? e.shl64(n) : e.shr64(-n)).without(t);
}), We = (t, e, n) => {
  let s = n.intersect(e), o = s.bswap64();
  return s = s.minus64(t), o = o.minus64(t.bswap64()), s.xor(o.bswap64()).intersect(e);
}, In = (t, e) => We(u.fromSquare(t), Ge[t], e), _n = (t, e) => {
  const n = Fe[t];
  let s = e.intersect(n), o = s.rbit64();
  return s = s.minus64(u.fromSquare(t)), o = o.minus64(u.fromSquare(63 - t)), s.xor(o.rbit64()).intersect(n);
}, ce = (t, e) => {
  const n = u.fromSquare(t);
  return We(n, ze[t], e).xor(We(n, Ue[t], e));
}, he = (t, e) => In(t, e).xor(_n(t, e)), Kt = (t, e) => ce(t, e).xor(he(t, e)), Ht = (t, e) => {
  const n = u.fromSquare(e);
  return Fe[t].intersects(n) ? Fe[t].with(t) : Ue[t].intersects(n) ? Ue[t].with(t) : ze[t].intersects(n) ? ze[t].with(t) : Ge[t].intersects(n) ? Ge[t].with(t) : u.empty();
}, de = (t, e) => Ht(t, e).intersect(u.full().shl64(t).xor(u.full().shl64(e))).withoutFirst();
class ae {
  constructor() {
  }
  static default() {
    const e = new ae();
    return e.reset(), e;
  }
  /**
   * Resets all pieces to the default starting position for standard chess.
   */
  reset() {
    this.occupied = new u(65535, 4294901760), this.promoted = u.empty(), this.white = new u(65535, 0), this.black = new u(0, 4294901760), this.pawn = new u(65280, 16711680), this.knight = new u(66, 1107296256), this.bishop = new u(36, 603979776), this.rook = new u(129, 2164260864), this.queen = new u(8, 134217728), this.king = new u(16, 268435456);
  }
  static empty() {
    const e = new ae();
    return e.clear(), e;
  }
  clear() {
    this.occupied = u.empty(), this.promoted = u.empty();
    for (const e of ne)
      this[e] = u.empty();
    for (const e of ge)
      this[e] = u.empty();
  }
  clone() {
    const e = new ae();
    e.occupied = this.occupied, e.promoted = this.promoted;
    for (const n of ne)
      e[n] = this[n];
    for (const n of ge)
      e[n] = this[n];
    return e;
  }
  getColor(e) {
    if (this.white.has(e))
      return "white";
    if (this.black.has(e))
      return "black";
  }
  getRole(e) {
    for (const n of ge)
      if (this[n].has(e))
        return n;
  }
  get(e) {
    const n = this.getColor(e);
    if (!n)
      return;
    const s = this.getRole(e), o = this.promoted.has(e);
    return { color: n, role: s, promoted: o };
  }
  /**
   * Removes and returns the piece from the given `square`, if any.
   */
  take(e) {
    const n = this.get(e);
    return n && (this.occupied = this.occupied.without(e), this[n.color] = this[n.color].without(e), this[n.role] = this[n.role].without(e), n.promoted && (this.promoted = this.promoted.without(e))), n;
  }
  /**
   * Put `piece` onto `square`, potentially replacing an existing piece.
   * Returns the existing piece, if any.
   */
  set(e, n) {
    const s = this.take(e);
    return this.occupied = this.occupied.with(e), this[n.color] = this[n.color].with(e), this[n.role] = this[n.role].with(e), n.promoted && (this.promoted = this.promoted.with(e)), s;
  }
  has(e) {
    return this.occupied.has(e);
  }
  *[Symbol.iterator]() {
    for (const e of this.occupied)
      yield [e, this.get(e)];
  }
  pieces(e, n) {
    return this[e].intersect(this[n]);
  }
  rooksAndQueens() {
    return this.rook.union(this.queen);
  }
  bishopsAndQueens() {
    return this.bishop.union(this.queen);
  }
  steppers() {
    return this.knight.union(this.pawn).union(this.king);
  }
  sliders() {
    return this.bishop.union(this.rook).union(this.queen);
  }
  /**
   * Finds the unique king of the given `color`, if any.
   */
  kingOf(e) {
    return this.pieces(e, "king").singleSquare();
  }
}
var W;
(function(t) {
  t.Empty = "ERR_EMPTY", t.OppositeCheck = "ERR_OPPOSITE_CHECK", t.PawnsOnBackrank = "ERR_PAWNS_ON_BACKRANK", t.Kings = "ERR_KINGS", t.Variant = "ERR_VARIANT";
})(W || (W = {}));
class te extends Error {
}
const Kn = (t, e, n, s) => n[e].intersect(he(t, s).intersect(n.rooksAndQueens()).union(ce(t, s).intersect(n.bishopsAndQueens())).union(ot(t).intersect(n.knight)).union(st(t).intersect(n.king)).union(Ne(B(e), t).intersect(n.pawn)));
class Y {
  constructor() {
  }
  static default() {
    const e = new Y();
    return e.castlingRights = u.corners(), e.rook = {
      white: { a: 0, h: 7 },
      black: { a: 56, h: 63 }
    }, e.path = {
      white: { a: new u(14, 0), h: new u(96, 0) },
      black: { a: new u(0, 234881024), h: new u(0, 1610612736) }
    }, e;
  }
  static empty() {
    const e = new Y();
    return e.castlingRights = u.empty(), e.rook = {
      white: { a: void 0, h: void 0 },
      black: { a: void 0, h: void 0 }
    }, e.path = {
      white: { a: u.empty(), h: u.empty() },
      black: { a: u.empty(), h: u.empty() }
    }, e;
  }
  clone() {
    const e = new Y();
    return e.castlingRights = this.castlingRights, e.rook = {
      white: { a: this.rook.white.a, h: this.rook.white.h },
      black: { a: this.rook.black.a, h: this.rook.black.h }
    }, e.path = {
      white: { a: this.path.white.a, h: this.path.white.h },
      black: { a: this.path.black.a, h: this.path.black.h }
    }, e;
  }
  add(e, n, s, o) {
    const i = tt(e, n), r = nt(e, n);
    this.castlingRights = this.castlingRights.with(o), this.rook[e][n] = o, this.path[e][n] = de(o, r).with(r).union(de(s, i).with(i)).without(s).without(o);
  }
  static fromSetup(e) {
    const n = Y.empty(), s = e.castlingRights.intersect(e.board.rook);
    for (const o of ne) {
      const i = u.backrank(o), r = e.board.kingOf(o);
      if (!C(r) || !i.has(r))
        continue;
      const a = s.intersect(e.board[o]).intersect(i), l = a.first();
      C(l) && l < r && n.add(o, "a", r, l);
      const c = a.last();
      C(c) && r < c && n.add(o, "h", r, c);
    }
    return n;
  }
  discardRook(e) {
    if (this.castlingRights.has(e)) {
      this.castlingRights = this.castlingRights.without(e);
      for (const n of ne)
        for (const s of Ln)
          this.rook[n][s] === e && (this.rook[n][s] = void 0);
    }
  }
  discardColor(e) {
    this.castlingRights = this.castlingRights.diff(u.backrank(e)), this.rook[e].a = void 0, this.rook[e].h = void 0;
  }
}
class Hn {
  constructor(e) {
    this.rules = e;
  }
  reset() {
    this.board = ae.default(), this.pockets = void 0, this.turn = "white", this.castles = Y.default(), this.epSquare = void 0, this.remainingChecks = void 0, this.halfmoves = 0, this.fullmoves = 1;
  }
  setupUnchecked(e) {
    this.board = e.board.clone(), this.board.promoted = u.empty(), this.pockets = void 0, this.turn = e.turn, this.castles = Y.fromSetup(e), this.epSquare = $n(this, e.epSquare), this.remainingChecks = void 0, this.halfmoves = e.halfmoves, this.fullmoves = e.fullmoves;
  }
  // When subclassing overwrite at least:
  //
  // - static default()
  // - static fromSetup()
  // - static clone()
  //
  // - dests()
  // - isVariantEnd()
  // - variantOutcome()
  // - hasInsufficientMaterial()
  // - isStandardMaterial()
  kingAttackers(e, n, s) {
    return Kn(e, n, this.board, s);
  }
  playCaptureAt(e, n) {
    this.halfmoves = 0, n.role === "rook" && this.castles.discardRook(e), this.pockets && this.pockets[B(n.color)][n.promoted ? "pawn" : n.role]++;
  }
  ctx() {
    const e = this.isVariantEnd(), n = this.board.kingOf(this.turn);
    if (!C(n))
      return { king: n, blockers: u.empty(), checkers: u.empty(), variantEnd: e, mustCapture: !1 };
    const s = he(n, u.empty()).intersect(this.board.rooksAndQueens()).union(ce(n, u.empty()).intersect(this.board.bishopsAndQueens())).intersect(this.board[B(this.turn)]);
    let o = u.empty();
    for (const r of s) {
      const a = de(n, r).intersect(this.board.occupied);
      a.moreThanOne() || (o = o.union(a));
    }
    const i = this.kingAttackers(n, B(this.turn), this.board.occupied);
    return {
      king: n,
      blockers: o,
      checkers: i,
      variantEnd: e,
      mustCapture: !1
    };
  }
  clone() {
    var e, n;
    const s = new this.constructor();
    return s.board = this.board.clone(), s.pockets = (e = this.pockets) === null || e === void 0 ? void 0 : e.clone(), s.turn = this.turn, s.castles = this.castles.clone(), s.epSquare = this.epSquare, s.remainingChecks = (n = this.remainingChecks) === null || n === void 0 ? void 0 : n.clone(), s.halfmoves = this.halfmoves, s.fullmoves = this.fullmoves, s;
  }
  validate() {
    if (this.board.occupied.isEmpty())
      return L.err(new te(W.Empty));
    if (this.board.king.size() !== 2)
      return L.err(new te(W.Kings));
    if (!C(this.board.kingOf(this.turn)))
      return L.err(new te(W.Kings));
    const e = this.board.kingOf(B(this.turn));
    return C(e) ? this.kingAttackers(e, this.turn, this.board.occupied).nonEmpty() ? L.err(new te(W.OppositeCheck)) : u.backranks().intersects(this.board.pawn) ? L.err(new te(W.PawnsOnBackrank)) : L.ok(void 0) : L.err(new te(W.Kings));
  }
  dropDests(e) {
    return u.empty();
  }
  dests(e, n) {
    if (n = n || this.ctx(), n.variantEnd)
      return u.empty();
    const s = this.board.get(e);
    if (!s || s.color !== this.turn)
      return u.empty();
    let o, i;
    if (s.role === "pawn") {
      o = Ne(this.turn, e).intersect(this.board[B(this.turn)]);
      const r = this.turn === "white" ? 8 : -8, a = e + r;
      if (0 <= a && a < 64 && !this.board.occupied.has(a)) {
        o = o.with(a);
        const l = this.turn === "white" ? e < 16 : e >= 48, c = a + r;
        l && !this.board.occupied.has(c) && (o = o.with(c));
      }
      C(this.epSquare) && Fn(this, e, n) && (i = u.fromSquare(this.epSquare));
    } else s.role === "bishop" ? o = ce(e, this.board.occupied) : s.role === "knight" ? o = ot(e) : s.role === "rook" ? o = he(e, this.board.occupied) : s.role === "queen" ? o = Kt(e, this.board.occupied) : o = st(e);
    if (o = o.diff(this.board[this.turn]), C(n.king)) {
      if (s.role === "king") {
        const r = this.board.occupied.without(e);
        for (const a of o)
          this.kingAttackers(a, B(this.turn), r).nonEmpty() && (o = o.without(a));
        return o.union(gt(this, "a", n)).union(gt(this, "h", n));
      }
      if (n.checkers.nonEmpty()) {
        const r = n.checkers.singleSquare();
        if (!C(r))
          return u.empty();
        o = o.intersect(de(r, n.king).with(r));
      }
      n.blockers.has(e) && (o = o.intersect(Ht(e, n.king)));
    }
    return i && (o = o.union(i)), o;
  }
  isVariantEnd() {
    return !1;
  }
  variantOutcome(e) {
  }
  hasInsufficientMaterial(e) {
    return this.board[e].intersect(this.board.pawn.union(this.board.rooksAndQueens())).nonEmpty() ? !1 : this.board[e].intersects(this.board.knight) ? this.board[e].size() <= 2 && this.board[B(e)].diff(this.board.king).diff(this.board.queen).isEmpty() : this.board[e].intersects(this.board.bishop) ? (!this.board.bishop.intersects(u.darkSquares()) || !this.board.bishop.intersects(u.lightSquares())) && this.board.pawn.isEmpty() && this.board.knight.isEmpty() : !0;
  }
  // The following should be identical in all subclasses
  toSetup() {
    var e, n;
    return {
      board: this.board.clone(),
      pockets: (e = this.pockets) === null || e === void 0 ? void 0 : e.clone(),
      turn: this.turn,
      castlingRights: this.castles.castlingRights,
      epSquare: Gn(this),
      remainingChecks: (n = this.remainingChecks) === null || n === void 0 ? void 0 : n.clone(),
      halfmoves: Math.min(this.halfmoves, 150),
      fullmoves: Math.min(Math.max(this.fullmoves, 1), 9999)
    };
  }
  isInsufficientMaterial() {
    return ne.every((e) => this.hasInsufficientMaterial(e));
  }
  hasDests(e) {
    e = e || this.ctx();
    for (const n of this.board[this.turn])
      if (this.dests(n, e).nonEmpty())
        return !0;
    return this.dropDests(e).nonEmpty();
  }
  isLegal(e, n) {
    if (ke(e))
      return !this.pockets || this.pockets[this.turn][e.role] <= 0 || e.role === "pawn" && u.backranks().has(e.to) ? !1 : this.dropDests(n).has(e.to);
    {
      if (e.promotion === "pawn" || e.promotion === "king" && this.rules !== "antichess" || !!e.promotion !== (this.board.pawn.has(e.from) && u.backranks().has(e.to)))
        return !1;
      const s = this.dests(e.from, n);
      return s.has(e.to) || s.has(zn(this, e).to);
    }
  }
  isCheck() {
    const e = this.board.kingOf(this.turn);
    return C(e) && this.kingAttackers(e, B(this.turn), this.board.occupied).nonEmpty();
  }
  isEnd(e) {
    return (e ? e.variantEnd : this.isVariantEnd()) ? !0 : this.isInsufficientMaterial() || !this.hasDests(e);
  }
  isCheckmate(e) {
    return e = e || this.ctx(), !e.variantEnd && e.checkers.nonEmpty() && !this.hasDests(e);
  }
  isStalemate(e) {
    return e = e || this.ctx(), !e.variantEnd && e.checkers.isEmpty() && !this.hasDests(e);
  }
  outcome(e) {
    const n = this.variantOutcome(e);
    return n || (e = e || this.ctx(), this.isCheckmate(e) ? { winner: B(this.turn) } : this.isInsufficientMaterial() || this.isStalemate(e) ? { winner: void 0 } : void 0);
  }
  allDests(e) {
    e = e || this.ctx();
    const n = /* @__PURE__ */ new Map();
    if (e.variantEnd)
      return n;
    for (const s of this.board[this.turn])
      n.set(s, this.dests(s, e));
    return n;
  }
  play(e) {
    const n = this.turn, s = this.epSquare, o = $t(this, e);
    if (this.epSquare = void 0, this.halfmoves += 1, n === "black" && (this.fullmoves += 1), this.turn = B(n), ke(e))
      this.board.set(e.to, { role: e.role, color: n }), this.pockets && this.pockets[n][e.role]--, e.role === "pawn" && (this.halfmoves = 0);
    else {
      const i = this.board.take(e.from);
      if (!i)
        return;
      let r;
      if (i.role === "pawn") {
        this.halfmoves = 0, e.to === s && (r = this.board.take(e.to + (n === "white" ? -8 : 8)));
        const a = e.from - e.to;
        Math.abs(a) === 16 && 8 <= e.from && e.from <= 55 && (this.epSquare = e.from + e.to >> 1), e.promotion && (i.role = e.promotion, i.promoted = !!this.pockets);
      } else if (i.role === "rook")
        this.castles.discardRook(e.from);
      else if (i.role === "king") {
        if (o) {
          const a = this.castles.rook[n][o];
          if (C(a)) {
            const l = this.board.take(a);
            this.board.set(tt(n, o), i), l && this.board.set(nt(n, o), l);
          }
        }
        this.castles.discardColor(n);
      }
      if (!o) {
        const a = this.board.set(e.to, i) || r;
        a && this.playCaptureAt(e.to, a);
      }
    }
    this.remainingChecks && this.isCheck() && (this.remainingChecks[n] = Math.max(this.remainingChecks[n] - 1, 0));
  }
}
class le extends Hn {
  constructor() {
    super("chess");
  }
  static default() {
    const e = new this();
    return e.reset(), e;
  }
  static fromSetup(e) {
    const n = new this();
    return n.setupUnchecked(e), n.validate().map((s) => n);
  }
  clone() {
    return super.clone();
  }
}
const $n = (t, e) => {
  if (!C(e))
    return;
  const n = t.turn === "white" ? 5 : 2, s = t.turn === "white" ? 8 : -8;
  if (H(e) !== n || t.board.occupied.has(e + s))
    return;
  const o = e - s;
  if (!(!t.board.pawn.has(o) || !t.board[B(t.turn)].has(o)))
    return e;
}, Gn = (t) => {
  if (!C(t.epSquare))
    return;
  const e = t.ctx(), s = t.board.pieces(t.turn, "pawn").intersect(Ne(B(t.turn), t.epSquare));
  for (const o of s)
    if (t.dests(o, e).has(t.epSquare))
      return t.epSquare;
}, Fn = (t, e, n) => {
  if (!C(t.epSquare) || !Ne(t.turn, e).has(t.epSquare))
    return !1;
  if (!C(n.king))
    return !0;
  const s = t.turn === "white" ? 8 : -8, o = t.epSquare - s;
  return t.kingAttackers(n.king, B(t.turn), t.board.occupied.toggle(e).toggle(o).with(t.epSquare)).without(o).isEmpty();
}, gt = (t, e, n) => {
  if (!C(n.king) || n.checkers.nonEmpty())
    return u.empty();
  const s = t.castles.rook[t.turn][e];
  if (!C(s) || t.castles.path[t.turn][e].intersects(t.board.occupied))
    return u.empty();
  const o = tt(t.turn, e), i = de(n.king, o), r = t.board.occupied.without(n.king);
  for (const c of i)
    if (t.kingAttackers(c, B(t.turn), r).nonEmpty())
      return u.empty();
  const a = nt(t.turn, e), l = t.board.occupied.toggle(n.king).toggle(s).toggle(a);
  return t.kingAttackers(o, B(t.turn), l).nonEmpty() ? u.empty() : u.fromSquare(s);
}, $t = (t, e) => {
  if (ke(e))
    return;
  const n = e.to - e.from;
  if (!(Math.abs(n) !== 2 && !t.board[t.turn].has(e.to)) && t.board.king.has(e.from))
    return n > 0 ? "h" : "a";
}, zn = (t, e) => {
  const n = $t(t, e);
  if (!n)
    return e;
  const s = t.castles.rook[t.turn][n];
  return {
    from: e.from,
    to: C(s) ? s : e.to
  };
};
var bt;
(function(t) {
  t.Fen = "ERR_FEN", t.Board = "ERR_BOARD", t.Pockets = "ERR_POCKETS", t.Turn = "ERR_TURN", t.Castling = "ERR_CASTLING", t.EpSquare = "ERR_EP_SQUARE", t.RemainingChecks = "ERR_REMAINING_CHECKS", t.Halfmoves = "ERR_HALFMOVES", t.Fullmoves = "ERR_FULLMOVES";
})(bt || (bt = {}));
const Un = (t) => {
  let e = re(t.role);
  return t.color === "white" && (e = e.toUpperCase()), t.promoted && (e += "~"), e;
}, Wn = (t) => {
  let e = "", n = 0;
  for (let s = 7; s >= 0; s--)
    for (let o = 0; o < 8; o++) {
      const i = o + s * 8, r = t.get(i);
      r ? (n > 0 && (e += n, n = 0), e += Un(r)) : n++, o === 7 && (n > 0 && (e += n, n = 0), s !== 0 && (e += "/"));
    }
  return e;
}, wt = (t) => ge.map((e) => re(e).repeat(t[e])).join(""), qn = (t) => wt(t.white).toUpperCase() + wt(t.black), jn = (t, e) => {
  let n = "";
  for (const s of ne) {
    const o = u.backrank(s);
    let i = t.kingOf(s);
    C(i) && !o.has(i) && (i = void 0);
    const r = t.pieces(s, "rook").intersect(o);
    for (const a of e.intersect(o).reversed())
      if (a === r.first() && C(i) && a < i)
        n += s === "white" ? "Q" : "q";
      else if (a === r.last() && C(i) && i < a)
        n += s === "white" ? "K" : "k";
      else {
        const l = ve[N(a)];
        n += s === "white" ? l.toUpperCase() : l;
      }
  }
  return n || "-";
}, Vn = (t) => `${t.white}+${t.black}`, qe = (t, e) => [
  Wn(t.board) + (t.pockets ? `[${qn(t.pockets)}]` : ""),
  t.turn[0],
  jn(t.board, t.castlingRights),
  C(t.epSquare) ? D(t.epSquare) : "-",
  ...t.remainingChecks ? [Vn(t.remainingChecks)] : [],
  Math.max(0, Math.min(t.halfmoves, 9999)),
  Math.max(1, Math.min(t.fullmoves, 9999))
].join(" "), Xn = (t, e) => {
  const n = /* @__PURE__ */ new Map(), s = t.ctx();
  for (const [o, i] of t.allDests(s))
    if (i.nonEmpty()) {
      const r = Array.from(i, D);
      o === s.king && N(o) === 4 && (i.has(0) ? r.push("c1") : i.has(56) && r.push("c8"), i.has(7) ? r.push("g1") : i.has(63) && r.push("g8")), n.set(D(o), r);
    }
  return n;
}, Qn = (t, e) => {
  let n = "";
  if (ke(e))
    e.role !== "pawn" && (n = re(e.role).toUpperCase()), n += "@" + D(e.to);
  else {
    const s = t.board.getRole(e.from);
    if (!s)
      return "--";
    if (s === "king" && (t.board[t.turn].has(e.to) || Math.abs(e.to - e.from) === 2))
      n = e.to > e.from ? "O-O" : "O-O-O";
    else {
      const o = t.board.occupied.has(e.to) || s === "pawn" && N(e.from) !== N(e.to);
      if (s !== "pawn") {
        n = re(s).toUpperCase();
        let i;
        if (s === "king" ? i = st(e.to).intersect(t.board.king) : s === "queen" ? i = Kt(e.to, t.board.occupied).intersect(t.board.queen) : s === "rook" ? i = he(e.to, t.board.occupied).intersect(t.board.rook) : s === "bishop" ? i = ce(e.to, t.board.occupied).intersect(t.board.bishop) : i = ot(e.to).intersect(t.board.knight), i = i.intersect(t.board[t.turn]).without(e.from), i.nonEmpty()) {
          const r = t.ctx();
          for (const a of i)
            t.dests(a, r).has(e.to) || (i = i.without(a));
          if (i.nonEmpty()) {
            let a = !1, l = i.intersects(u.fromRank(H(e.from)));
            i.intersects(u.fromFile(N(e.from))) ? a = !0 : l = !0, l && (n += ve[N(e.from)]), a && (n += _t[H(e.from)]);
          }
        }
      } else o && (n = ve[N(e.from)]);
      o && (n += "x"), n += D(e.to), e.promotion && (n += "=" + re(e.promotion).toUpperCase());
    }
  }
  return n;
}, Zn = (t, e) => {
  var n;
  const s = Qn(t, e);
  return t.play(e), !((n = t.outcome()) === null || n === void 0) && n.winner ? s + "#" : t.isCheck() ? s + "+" : s;
}, Yn = (t, e) => Zn(t.clone(), e), Jn = ["white", "black"], Ce = ["a", "b", "c", "d", "e", "f", "g", "h"], Ee = ["1", "2", "3", "4", "5", "6", "7", "8"], es = [...Ee].reverse(), xe = Ce.flatMap((t) => Ee.map((e) => t + e)), se = (t) => t.every((e) => e >= 0 && e <= 7) ? xe[8 * t[0] + t[1]] : void 0, Q = (t) => se(t), E = (t) => [t.charCodeAt(0) - 97, t.charCodeAt(1) - 49], Gt = xe.map(E), ts = xe.map((t, e) => ({ key: t, pos: Gt[e] }));
function Ft(t) {
  let e;
  const n = () => (e === void 0 && (e = t()), e);
  return n.clear = () => {
    e = void 0;
  }, n;
}
const ns = () => {
  let t;
  return {
    start() {
      t = performance.now();
    },
    cancel() {
      t = void 0;
    },
    stop() {
      if (!t)
        return 0;
      const e = performance.now() - t;
      return t = void 0, e;
    }
  };
}, pe = (t) => t === "white" ? "black" : "white", ue = (t, e) => (t[0] - e[0]) ** 2 + (t[1] - e[1]) ** 2, je = (t, e) => t.role === e.role && t.color === e.color, ss = (t, e) => t[0] === e[0] && t[1] === e[1], me = (t) => (e, n) => [
  (n ? e[0] : 7 - e[0]) * t.width / 8,
  (n ? 7 - e[1] : e[1]) * t.height / 8
], G = (t, e) => {
  t.style.transform = `translate(${e[0]}px,${e[1]}px)`;
}, zt = (t, e, n = 1) => {
  t.style.transform = `translate(${e[0]}px,${e[1]}px) scale(${n})`;
}, it = (t, e) => {
  t.style.visibility = e ? "visible" : "hidden";
}, J = (t) => {
  var e;
  if (t.clientX || t.clientX === 0)
    return [t.clientX, t.clientY];
  if ((e = t.targetTouches) != null && e[0])
    return [t.targetTouches[0].clientX, t.targetTouches[0].clientY];
}, os = Ft(() => !("ontouchstart" in window) && ["macintosh", "firefox"].every((t) => navigator.userAgent.toLowerCase().includes(t))), Ut = (t) => t.button === 2 && !(t.ctrlKey && os()), z = (t, e) => {
  const n = document.createElement(t);
  return e && (n.className = e), n;
};
function Wt(t, e, n) {
  const s = E(t);
  return e || (s[0] = 7 - s[0], s[1] = 7 - s[1]), [
    n.left + n.width * s[0] / 8 + n.width / 16,
    n.top + n.height * (7 - s[1]) / 8 + n.height / 16
  ];
}
const j = (t, e) => Math.abs(t - e), qt = (t, e, n, s) => j(t, n) * j(e, s) === 2, jt = (t, e, n, s) => t === n != (e === s), Vt = (t, e, n, s) => j(t, n) === j(e, s) && t !== n, is = (t, e, n, s) => jt(t, e, n, s) || Vt(t, e, n, s), rs = (t, e, n, s) => Math.max(j(t, n), j(e, s)) === 1, as = (t, e, n, s, o) => {
  const i = o ? 1 : -1;
  return t === n && (s === e + i || // allow 2 squares from first two ranks, for horde
  s === e + 2 * i && (o ? e <= 1 : e >= 6));
}, ls = (t, e, n, s) => {
  const o = n - t, i = s - e;
  if (o && i && Math.abs(o) !== Math.abs(i))
    return [];
  const r = Math.sign(o), a = Math.sign(i), l = [];
  let c = t + r, d = e + a;
  for (; c !== n || d !== s; )
    l.push([c, d]), c += r, d += a;
  return l.map(se).filter((h) => h !== void 0);
}, cs = (t) => j(t.orig.pos[0], t.dest.pos[0]) <= 1 && (j(t.orig.pos[0], t.dest.pos[0]) === 1 ? t.dest.pos[1] === t.orig.pos[1] + (t.color === "white" ? 1 : -1) : as(...t.orig.pos, ...t.dest.pos, t.color === "white")), hs = (t) => qt(...t.orig.pos, ...t.dest.pos), Xt = (t) => Vt(...t.orig.pos, ...t.dest.pos), Qt = (t) => jt(...t.orig.pos, ...t.dest.pos), ds = (t) => Xt(t) || Qt(t), us = (t) => rs(...t.orig.pos, ...t.dest.pos) || t.orig.pos[1] === t.dest.pos[1] && t.orig.pos[1] === (t.color === "white" ? 0 : 7) && (t.orig.pos[0] === 4 && (t.dest.pos[0] === 2 && t.rookFilesFriendlies.includes(0) || t.dest.pos[0] === 6 && t.rookFilesFriendlies.includes(7)) || t.rookFilesFriendlies.includes(t.dest.pos[0])), ps = { pawn: cs, knight: hs, bishop: Xt, rook: Qt, queen: ds, king: us };
function Zt(t, e) {
  const n = t.pieces, s = n.get(e);
  if (!s || s.color === t.turnColor)
    return [];
  const o = s.color, i = new Map([...n].filter(([d, h]) => h.color === o)), r = new Map([...n].filter(([d, h]) => h.color === pe(o))), a = { key: e, pos: E(e) }, l = (d) => ps[s.role](d) && t.premovable.additionalPremoveRequirements(d), c = {
    orig: a,
    role: s.role,
    allPieces: n,
    friendlies: i,
    enemies: r,
    color: o,
    rookFilesFriendlies: Array.from(n).filter(([d, h]) => d[1] === (o === "white" ? "1" : "8") && h.color === o && h.role === "rook").map(([d]) => E(d)[0]),
    lastMove: t.lastMove
  };
  return ts.filter((d) => l({ ...c, dest: d })).map((d) => d.key);
}
function R(t, ...e) {
  t && setTimeout(() => t(...e), 1);
}
function ms(t) {
  t.orientation = pe(t.orientation), t.animation.current = t.draggable.current = t.selected = void 0;
}
function fs(t, e) {
  for (const [n, s] of e)
    s ? t.pieces.set(n, s) : t.pieces.delete(n);
}
function gs(t, e) {
  if (t.check = void 0, e === !0 && (e = t.turnColor), e)
    for (const [n, s] of t.pieces)
      s.role === "king" && s.color === e && (t.check = n);
}
function bs(t, e, n, s) {
  X(t), t.premovable.current = [e, n], R(t.premovable.events.set, e, n, s);
}
function V(t) {
  t.premovable.current && (t.premovable.current = void 0, R(t.premovable.events.unset));
}
function ws(t, e, n) {
  V(t), t.predroppable.current = { role: e, key: n }, R(t.predroppable.events.set, e, n);
}
function X(t) {
  const e = t.predroppable;
  e.current && (e.current = void 0, R(e.events.unset));
}
function vs(t, e, n) {
  if (!t.autoCastle)
    return !1;
  const s = t.pieces.get(e);
  if (!s || s.role !== "king")
    return !1;
  const o = E(e), i = E(n);
  if (o[1] !== 0 && o[1] !== 7 || o[1] !== i[1])
    return !1;
  o[0] === 4 && !t.pieces.has(n) && (i[0] === 6 ? n = Q([7, i[1]]) : i[0] === 2 && (n = Q([0, i[1]])));
  const r = t.pieces.get(n);
  return !r || r.color !== s.color || r.role !== "rook" ? !1 : (t.pieces.delete(e), t.pieces.delete(n), o[0] < i[0] ? (t.pieces.set(Q([6, i[1]]), s), t.pieces.set(Q([5, i[1]]), r)) : (t.pieces.set(Q([2, i[1]]), s), t.pieces.set(Q([3, i[1]]), r)), !0);
}
function Yt(t, e, n) {
  const s = t.pieces.get(e), o = t.pieces.get(n);
  if (e === n || !s)
    return !1;
  const i = o && o.color !== s.color ? o : void 0;
  return n === t.selected && _(t), R(t.events.move, e, n, i), vs(t, e, n) || (t.pieces.set(n, s), t.pieces.delete(e)), t.lastMove = [e, n], t.check = void 0, R(t.events.change), i || !0;
}
function rt(t, e, n, s) {
  if (t.pieces.has(n))
    if (s)
      t.pieces.delete(n);
    else
      return !1;
  return R(t.events.dropNewPiece, e, n), t.pieces.set(n, e), t.lastMove = [n], t.check = void 0, R(t.events.change), t.movable.dests = void 0, t.turnColor = pe(t.turnColor), !0;
}
function Jt(t, e, n) {
  const s = Yt(t, e, n);
  return s && (t.movable.dests = void 0, t.turnColor = pe(t.turnColor), t.animation.current = void 0), s;
}
function en(t, e, n) {
  if (at(t, e, n)) {
    const s = Jt(t, e, n);
    if (s) {
      const o = t.hold.stop();
      _(t);
      const i = {
        premove: !1,
        ctrlKey: t.stats.ctrlKey,
        holdTime: o
      };
      return s !== !0 && (i.captured = s), R(t.movable.events.after, e, n, i), !0;
    }
  } else if (ys(t, e, n))
    return bs(t, e, n, {
      ctrlKey: t.stats.ctrlKey
    }), _(t), !0;
  return _(t), !1;
}
function tn(t, e, n, s) {
  const o = t.pieces.get(e);
  o && (ks(t, e, n) || s) ? (t.pieces.delete(e), rt(t, o, n, s), R(t.movable.events.afterNewPiece, o.role, n, {
    premove: !1,
    predrop: !1
  })) : o && Cs(t, e, n) ? ws(t, o.role, n) : (V(t), X(t)), t.pieces.delete(e), _(t);
}
function Ve(t, e, n) {
  if (R(t.events.select, e), t.selected) {
    if (t.selected === e && !t.draggable.enabled) {
      _(t), t.hold.cancel();
      return;
    } else if ((t.selectable.enabled || n) && t.selected !== e && en(t, t.selected, e)) {
      t.stats.dragged = !1;
      return;
    }
  }
  (t.selectable.enabled || t.draggable.enabled) && (sn(t, e) || lt(t, e)) && (nn(t, e), t.hold.start());
}
function nn(t, e) {
  t.selected = e, lt(t, e) ? t.premovable.customDests || (t.premovable.dests = Zt(t, e)) : t.premovable.dests = void 0;
}
function _(t) {
  t.selected = void 0, t.premovable.dests = void 0, t.hold.cancel();
}
function sn(t, e) {
  const n = t.pieces.get(e);
  return !!n && (t.movable.color === "both" || t.movable.color === n.color && t.turnColor === n.color);
}
const at = (t, e, n) => {
  var s, o;
  return e !== n && sn(t, e) && (t.movable.free || !!((o = (s = t.movable.dests) == null ? void 0 : s.get(e)) != null && o.includes(n)));
};
function ks(t, e, n) {
  const s = t.pieces.get(e);
  return !!s && (e === n || !t.pieces.has(n)) && (t.movable.color === "both" || t.movable.color === s.color && t.turnColor === s.color);
}
function lt(t, e) {
  const n = t.pieces.get(e);
  return !!n && t.premovable.enabled && t.movable.color === n.color && t.turnColor !== n.color;
}
const ys = (t, e, n) => {
  var s;
  return e !== n && lt(t, e) && (((s = t.premovable.customDests) == null ? void 0 : s.get(e)) ?? Zt(t, e)).includes(n);
};
function Cs(t, e, n) {
  const s = t.pieces.get(e), o = t.pieces.get(n);
  return !!s && (!o || o.color !== t.movable.color) && t.predroppable.enabled && (s.role !== "pawn" || n[1] !== "1" && n[1] !== "8") && t.movable.color === s.color && t.turnColor !== s.color;
}
function Es(t, e) {
  const n = t.pieces.get(e);
  return !!n && t.draggable.enabled && (t.movable.color === "both" || t.movable.color === n.color && (t.turnColor === n.color || t.premovable.enabled));
}
function Ms(t) {
  const e = t.premovable.current;
  if (!e)
    return !1;
  const n = e[0], s = e[1];
  let o = !1;
  if (at(t, n, s)) {
    const i = Jt(t, n, s);
    if (i) {
      const r = { premove: !0 };
      i !== !0 && (r.captured = i), R(t.movable.events.after, n, s, r), o = !0;
    }
  }
  return V(t), o;
}
function Ps(t, e) {
  const n = t.predroppable.current;
  let s = !1;
  if (!n)
    return !1;
  if (e(n)) {
    const o = {
      role: n.role,
      color: t.movable.color
    };
    rt(t, o, n.key) && (R(t.movable.events.afterNewPiece, n.role, n.key, {
      premove: !1,
      predrop: !0
    }), s = !0);
  }
  return X(t), s;
}
function ct(t) {
  V(t), X(t), _(t);
}
function vt(t) {
  t.movable.color = t.movable.dests = t.animation.current = void 0, ct(t);
}
function ee(t, e, n) {
  let s = Math.floor(8 * (t[0] - n.left) / n.width);
  e || (s = 7 - s);
  let o = 7 - Math.floor(8 * (t[1] - n.top) / n.height);
  return e || (o = 7 - o), s >= 0 && s < 8 && o >= 0 && o < 8 ? se([s, o]) : void 0;
}
function Ss(t, e, n, s) {
  const o = E(t), i = Gt.filter((c) => ss(o, c) || is(o[0], o[1], c[0], c[1]) || qt(o[0], o[1], c[0], c[1])), a = i.map((c) => Wt(Q(c), n, s)).map((c) => ue(e, c)), [, l] = a.reduce((c, d, h) => c[0] < d ? c : [d, h], [a[0], 0]);
  return se(i[l]);
}
const O = (t) => t.orientation === "white", on = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", Ns = {
  p: "pawn",
  r: "rook",
  n: "knight",
  b: "bishop",
  q: "queen",
  k: "king"
}, xs = {
  pawn: "p",
  rook: "r",
  knight: "n",
  bishop: "b",
  queen: "q",
  king: "k"
};
function rn(t) {
  t === "start" && (t = on);
  const e = /* @__PURE__ */ new Map();
  let n = 7, s = 0;
  for (const o of t)
    switch (o) {
      case " ":
      case "[":
        return e;
      case "/":
        if (--n, n < 0)
          return e;
        s = 0;
        break;
      case "~": {
        const i = se([s - 1, n]), r = i && e.get(i);
        r && (r.promoted = !0);
        break;
      }
      default: {
        const i = o.charCodeAt(0);
        if (i < 57)
          s += i - 48;
        else {
          const r = o.toLowerCase(), a = se([s, n]);
          a && e.set(a, {
            role: Ns[r],
            color: o === r ? "black" : "white"
          }), ++s;
        }
      }
    }
  return e;
}
function Ts(t) {
  return es.map((e) => Ce.map((n) => {
    const s = t.get(n + e);
    if (s) {
      let o = xs[s.role];
      return s.color === "white" && (o = o.toUpperCase()), s.promoted && (o += "~"), o;
    } else
      return "1";
  }).join("")).join("/").replace(/1{2,}/g, (e) => e.length.toString());
}
function an(t, e) {
  e.animation && (ht(t.animation, e.animation), (t.animation.duration || 0) < 70 && (t.animation.enabled = !1));
}
function ln(t, e) {
  var n, s, o;
  if ((n = e.movable) != null && n.dests && (t.movable.dests = void 0), (s = e.drawable) != null && s.autoShapes && (t.drawable.autoShapes = []), ht(t, e), e.fen && (t.pieces = rn(e.fen), t.drawable.shapes = ((o = e.drawable) == null ? void 0 : o.shapes) || []), "check" in e && gs(t, e.check || !1), "lastMove" in e && !e.lastMove ? t.lastMove = void 0 : e.lastMove && (t.lastMove = e.lastMove), t.selected && nn(t, t.selected), an(t, e), !t.movable.rookCastle && t.movable.dests) {
    const i = t.movable.color === "white" ? "1" : "8", r = "e" + i, a = t.movable.dests.get(r), l = t.pieces.get(r);
    if (!a || !l || l.role !== "king")
      return;
    t.movable.dests.set(r, a.filter((c) => !(c === "a" + i && a.includes("c" + i)) && !(c === "h" + i && a.includes("g" + i))));
  }
}
function ht(t, e) {
  for (const n in e)
    n === "__proto__" || n === "constructor" || !Object.prototype.hasOwnProperty.call(e, n) || (Object.prototype.hasOwnProperty.call(t, n) && kt(t[n]) && kt(e[n]) ? ht(t[n], e[n]) : t[n] = e[n]);
}
function kt(t) {
  if (typeof t != "object" || t === null)
    return !1;
  const e = Object.getPrototypeOf(t);
  return e === Object.prototype || e === null;
}
const Z = (t, e) => e.animation.enabled ? As(t, e) : U(t, e);
function U(t, e) {
  const n = t(e);
  return e.dom.redraw(), n;
}
const Te = (t, e) => ({
  key: t,
  pos: E(t),
  piece: e
}), Bs = (t, e) => e.sort((n, s) => ue(t.pos, n.pos) - ue(t.pos, s.pos))[0];
function Ls(t, e) {
  const n = /* @__PURE__ */ new Map(), s = [], o = /* @__PURE__ */ new Map(), i = [], r = [], a = /* @__PURE__ */ new Map();
  let l, c, d;
  for (const [h, p] of t)
    a.set(h, Te(h, p));
  for (const h of xe)
    l = e.pieces.get(h), c = a.get(h), l ? c ? je(l, c.piece) || (i.push(c), r.push(Te(h, l))) : r.push(Te(h, l)) : c && i.push(c);
  for (const h of r)
    c = Bs(h, i.filter((p) => je(h.piece, p.piece))), c && (d = [c.pos[0] - h.pos[0], c.pos[1] - h.pos[1]], n.set(h.key, d.concat(d)), s.push(c.key));
  for (const h of i)
    s.includes(h.key) || o.set(h.key, h.piece);
  return {
    anims: n,
    fadings: o
  };
}
function cn(t, e) {
  const n = t.animation.current;
  if (n === void 0) {
    t.dom.destroyed || t.dom.redrawNow();
    return;
  }
  const s = 1 - (e - n.start) * n.frequency;
  if (s <= 0)
    t.animation.current = void 0, t.dom.redrawNow();
  else {
    const o = Ds(s);
    for (const i of n.plan.anims.values())
      i[2] = i[0] * o, i[3] = i[1] * o;
    t.dom.redrawNow(!0), requestAnimationFrame((i = performance.now()) => cn(t, i));
  }
}
function As(t, e) {
  const n = new Map(e.pieces), s = t(e), o = Ls(n, e);
  if (o.anims.size || o.fadings.size) {
    const i = e.animation.current && e.animation.current.start;
    e.animation.current = {
      start: performance.now(),
      frequency: 1 / e.animation.duration,
      plan: o
    }, i || cn(e, performance.now());
  } else
    e.dom.redraw();
  return s;
}
const Ds = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1, Rs = ["green", "red", "blue", "yellow"];
function Os(t, e) {
  if (e.touches && e.touches.length > 1)
    return;
  e.stopPropagation(), e.preventDefault(), e.ctrlKey ? _(t) : ct(t);
  const n = J(e), s = ee(n, O(t), t.dom.bounds());
  s && (t.drawable.current = {
    orig: s,
    pos: n,
    brush: Hs(e),
    snapToValidMove: t.drawable.defaultSnapToValidMove
  }, hn(t));
}
function hn(t) {
  requestAnimationFrame(() => {
    const e = t.drawable.current;
    if (e) {
      const n = ee(e.pos, O(t), t.dom.bounds());
      n || (e.snapToValidMove = !1);
      const s = e.snapToValidMove ? Ss(e.orig, e.pos, O(t), t.dom.bounds()) : n;
      s !== e.mouseSq && (e.mouseSq = s, e.dest = s !== e.orig ? s : void 0, t.dom.redrawNow()), hn(t);
    }
  });
}
function Is(t, e) {
  t.drawable.current && (t.drawable.current.pos = J(e));
}
function _s(t) {
  const e = t.drawable.current;
  e && (e.mouseSq && $s(t.drawable, e), dn(t));
}
function dn(t) {
  t.drawable.current && (t.drawable.current = void 0, t.dom.redraw());
}
function Ks(t) {
  t.drawable.shapes.length && (t.drawable.shapes = [], t.dom.redraw(), pn(t.drawable));
}
const Xe = (t, e) => t.orig === e.orig && t.dest === e.dest, un = (t, e) => t.brush === e.brush;
function Hs(t) {
  var s;
  const e = (t.shiftKey || t.ctrlKey) && Ut(t), n = t.altKey || t.metaKey || ((s = t.getModifierState) == null ? void 0 : s.call(t, "AltGraph"));
  return Rs[(e ? 1 : 0) + (n ? 2 : 0)];
}
function $s(t, e) {
  const n = t.shapes.find((s) => Xe(s, e));
  n && (t.shapes = t.shapes.filter((s) => !Xe(s, e))), (!n || !un(n, e)) && t.shapes.push({
    orig: e.orig,
    dest: e.dest,
    brush: e.brush
  }), pn(t);
}
function pn(t) {
  t.onChange && t.onChange(t.shapes);
}
function Gs(t, e) {
  if (!(t.trustAllEvents || e.isTrusted) || e.buttons !== void 0 && e.buttons > 1 || e.touches && e.touches.length > 1)
    return;
  const n = t.dom.bounds(), s = J(e), o = ee(s, O(t), n);
  if (!o)
    return;
  const i = t.pieces.get(o), r = t.selected;
  if (!r && t.drawable.enabled && (t.drawable.eraseOnMovablePieceClick || !i || i.color !== t.turnColor) && Ks(t), e.cancelable !== !1 && (!e.touches || t.blockTouchScroll || i || r || Fs(t, s)))
    e.preventDefault();
  else if (e.touches)
    return;
  const a = !!t.premovable.current, l = !!t.predroppable.current;
  t.stats.ctrlKey = e.ctrlKey, t.selected && at(t, t.selected, o) ? Z((h) => Ve(h, o), t) : Ve(t, o);
  const c = t.selected === o, d = fn(t, o);
  if (i && d && c && Es(t, o)) {
    t.draggable.current = {
      orig: o,
      piece: i,
      origPos: s,
      pos: s,
      started: t.draggable.autoDistance && t.stats.dragged,
      element: d,
      previouslySelected: r,
      originTarget: e.target,
      keyHasChanged: !1
    }, d.cgDragging = !0, d.classList.add("dragging");
    const h = t.dom.elements.ghost;
    h && (h.className = `ghost ${i.color} ${i.role}`, G(h, me(n)(E(o), O(t))), it(h, !0)), dt(t);
  } else
    a && V(t), l && X(t);
  t.dom.redraw();
}
function Fs(t, e) {
  const n = O(t), s = t.dom.bounds(), o = Math.pow(t.touchIgnoreRadius * s.width / 16, 2) * 2;
  for (const i of t.pieces.keys()) {
    const r = Wt(i, n, s);
    if (ue(r, e) <= o)
      return !0;
  }
  return !1;
}
function zs(t, e, n, s) {
  t.pieces.set("a0", e), t.dom.redraw();
  const i = J(n);
  t.draggable.current = {
    orig: "a0",
    piece: e,
    origPos: i,
    pos: i,
    started: !0,
    element: () => fn(t, "a0"),
    originTarget: n.target,
    newPiece: !0,
    force: !!s,
    keyHasChanged: !1
  }, dt(t);
}
function dt(t) {
  requestAnimationFrame(() => {
    var s;
    const e = t.draggable.current;
    if (!e)
      return;
    (s = t.animation.current) != null && s.plan.anims.has(e.orig) && (t.animation.current = void 0);
    const n = t.pieces.get(e.orig);
    if (!n || !je(n, e.piece))
      Me(t);
    else if (!e.started && ue(e.pos, e.origPos) >= Math.pow(t.draggable.distance, 2) && (e.started = !0), e.started) {
      if (typeof e.element == "function") {
        const i = e.element();
        if (!i)
          return;
        i.cgDragging = !0, i.classList.add("dragging"), e.element = i;
      }
      const o = t.dom.bounds();
      G(e.element, [
        e.pos[0] - o.left - o.width / 16,
        e.pos[1] - o.top - o.height / 16
      ]), e.keyHasChanged || (e.keyHasChanged = e.orig !== ee(e.pos, O(t), o));
    }
    dt(t);
  });
}
function Us(t, e) {
  t.draggable.current && (!e.touches || e.touches.length < 2) && (t.draggable.current.pos = J(e));
}
function Ws(t, e) {
  const n = t.draggable.current;
  if (!n)
    return;
  if (e.type === "touchend" && e.cancelable !== !1 && e.preventDefault(), e.type === "touchend" && n.originTarget !== e.target && !n.newPiece) {
    t.draggable.current = void 0;
    return;
  }
  V(t), X(t);
  const s = J(e) || n.pos, o = ee(s, O(t), t.dom.bounds());
  o && n.started && n.orig !== o ? n.newPiece ? tn(t, n.orig, o, n.force) : (t.stats.ctrlKey = e.ctrlKey, en(t, n.orig, o) && (t.stats.dragged = !0)) : n.newPiece ? t.pieces.delete(n.orig) : t.draggable.deleteOnDropOff && !o && (t.pieces.delete(n.orig), R(t.events.change)), (n.orig === n.previouslySelected || n.keyHasChanged) && (n.orig === o || !o) ? _(t) : t.selectable.enabled || _(t), mn(t), t.draggable.current = void 0, t.dom.redraw();
}
function Me(t) {
  const e = t.draggable.current;
  e && (e.newPiece && t.pieces.delete(e.orig), t.draggable.current = void 0, _(t), mn(t), t.dom.redraw());
}
function mn(t) {
  const e = t.dom.elements;
  e.ghost && it(e.ghost, !1);
}
function fn(t, e) {
  let n = t.dom.elements.board.firstChild;
  for (; n; ) {
    if (n.cgKey === e && n.tagName === "PIECE")
      return n;
    n = n.nextSibling;
  }
}
function qs(t, e) {
  t.exploding = { stage: 1, keys: e }, t.dom.redraw(), setTimeout(() => {
    yt(t, 2), setTimeout(() => yt(t, void 0), 120);
  }, 120);
}
function yt(t, e) {
  t.exploding && (e ? t.exploding.stage = e : t.exploding = void 0, t.dom.redraw());
}
function js(t, e) {
  function n() {
    ms(t), e();
  }
  return {
    set(s) {
      s.orientation && s.orientation !== t.orientation && n(), an(t, s), (s.fen ? Z : U)((o) => ln(o, s), t);
    },
    state: t,
    getFen: () => Ts(t.pieces),
    toggleOrientation: n,
    setPieces(s) {
      Z((o) => fs(o, s), t);
    },
    selectSquare(s, o) {
      s ? Z((i) => Ve(i, s, o), t) : t.selected && (_(t), t.dom.redraw());
    },
    move(s, o) {
      Z((i) => Yt(i, s, o), t);
    },
    newPiece(s, o) {
      Z((i) => rt(i, s, o), t);
    },
    playPremove() {
      if (t.premovable.current) {
        if (Z(Ms, t))
          return !0;
        t.dom.redraw();
      }
      return !1;
    },
    playPredrop(s) {
      if (t.predroppable.current) {
        const o = Ps(t, s);
        return t.dom.redraw(), o;
      }
      return !1;
    },
    cancelPremove() {
      U(V, t);
    },
    cancelPredrop() {
      U(X, t);
    },
    cancelMove() {
      U((s) => {
        ct(s), Me(s);
      }, t);
    },
    stop() {
      U((s) => {
        vt(s), Me(s);
      }, t);
    },
    explode(s) {
      qs(t, s);
    },
    setAutoShapes(s) {
      U((o) => o.drawable.autoShapes = s, t);
    },
    setShapes(s) {
      U((o) => o.drawable.shapes = s.slice(), t);
    },
    getKeyAtDomPos(s) {
      return ee(s, O(t), t.dom.bounds());
    },
    redrawAll: e,
    dragNewPiece(s, o, i) {
      zs(t, s, o, i);
    },
    destroy() {
      vt(t), t.dom.unbind && t.dom.unbind(), t.dom.destroyed = !0;
    }
  };
}
function Vs() {
  return {
    pieces: rn(on),
    orientation: "white",
    turnColor: "white",
    coordinates: !0,
    coordinatesOnSquares: !1,
    ranksPosition: "right",
    autoCastle: !0,
    viewOnly: !1,
    disableContextMenu: !1,
    addPieceZIndex: !1,
    blockTouchScroll: !1,
    touchIgnoreRadius: 1,
    pieceKey: !1,
    trustAllEvents: !1,
    highlight: {
      lastMove: !0,
      check: !0
    },
    animation: {
      enabled: !0,
      duration: 200
    },
    movable: {
      free: !0,
      color: "both",
      showDests: !0,
      events: {},
      rookCastle: !0
    },
    premovable: {
      enabled: !0,
      showDests: !0,
      castle: !0,
      additionalPremoveRequirements: (t) => !0,
      events: {}
    },
    predroppable: {
      enabled: !1,
      events: {}
    },
    draggable: {
      enabled: !0,
      distance: 3,
      autoDistance: !0,
      showGhost: !0,
      deleteOnDropOff: !1
    },
    dropmode: {
      active: !1
    },
    selectable: {
      enabled: !0
    },
    stats: {
      // on touchscreen, default to "tap-tap" moves
      // instead of drag
      dragged: !("ontouchstart" in window)
    },
    events: {},
    drawable: {
      enabled: !0,
      // can draw
      visible: !0,
      // can view
      defaultSnapToValidMove: !0,
      eraseOnMovablePieceClick: !0,
      shapes: [],
      autoShapes: [],
      brushes: {
        green: { key: "g", color: "#15781B", opacity: 1, lineWidth: 10 },
        red: { key: "r", color: "#882020", opacity: 1, lineWidth: 10 },
        blue: { key: "b", color: "#003088", opacity: 1, lineWidth: 10 },
        yellow: { key: "y", color: "#e68f00", opacity: 1, lineWidth: 10 },
        paleBlue: { key: "pb", color: "#003088", opacity: 0.4, lineWidth: 15 },
        paleGreen: { key: "pg", color: "#15781B", opacity: 0.4, lineWidth: 15 },
        paleRed: { key: "pr", color: "#882020", opacity: 0.4, lineWidth: 15 },
        paleGrey: {
          key: "pgr",
          color: "#4a4a4a",
          opacity: 0.35,
          lineWidth: 15
        },
        purple: { key: "purple", color: "#68217a", opacity: 0.65, lineWidth: 10 },
        pink: { key: "pink", color: "#ee2080", opacity: 0.5, lineWidth: 10 },
        white: { key: "white", color: "white", opacity: 1, lineWidth: 10 },
        paleWhite: { key: "pwhite", color: "white", opacity: 0.6, lineWidth: 10 }
      },
      prevSvgHash: ""
    },
    hold: ns()
  };
}
function Xs() {
  const t = x("defs"), e = A(x("filter"), { id: "cg-filter-blur" });
  return e.appendChild(A(x("feGaussianBlur"), { stdDeviation: "0.013" })), t.appendChild(e), t;
}
function Qs(t, e) {
  const n = t.drawable, s = n.current, o = s && s.mouseSq ? s : void 0, i = /* @__PURE__ */ new Map(), r = t.dom.bounds(), a = n.autoShapes.filter((h) => !h.piece);
  for (const h of n.shapes.concat(a).concat(o ? [o] : [])) {
    if (!h.dest)
      continue;
    const p = i.get(h.dest) ?? /* @__PURE__ */ new Set(), m = Se(Pe(E(h.orig), t.orientation), r), g = Se(Pe(E(h.dest), t.orientation), r);
    p.add(Cn(En(m, g))), i.set(h.dest, p);
  }
  const l = [], c = o ? n.shapes.findIndex((h) => Xe(h, o) && un(h, o)) : -1;
  for (const [h, p] of n.shapes.concat(a).entries()) {
    const m = c !== -1 && c === h;
    l.push({
      shape: p,
      current: !1,
      pendingErase: m,
      hash: Ct(p, Qe(p.dest, i), !1, r, m, Mt(p.dest, i))
    });
  }
  o && c === -1 && l.push({
    shape: o,
    current: !0,
    hash: Ct(o, Qe(o.dest, i), !0, r, !1, Mt(o.dest, i)),
    pendingErase: !1
  });
  const d = l.map((h) => h.hash).join(";");
  d !== t.drawable.prevSvgHash && (t.drawable.prevSvgHash = d, Zs(n, l, e), Ys(l, e, (h) => to(t, h, n.brushes, i, r)));
}
function Zs(t, e, n) {
  for (const s of [n.shapes, n.shapesBelow]) {
    const o = s.querySelector("defs"), i = e.filter((c) => s === n.shapesBelow == !!c.shape.below), r = /* @__PURE__ */ new Map();
    for (const c of i.filter((d) => d.shape.dest && d.shape.brush)) {
      const d = vn(t.brushes[c.shape.brush], c.shape.modifiers), { key: h, color: p } = kn(c.shape);
      h && p && r.set(h, { key: h, color: p, opacity: 1, lineWidth: 1 }), r.set(d.key, d);
    }
    const a = /* @__PURE__ */ new Set();
    let l = o.firstElementChild;
    for (; l; )
      a.add(l.getAttribute("cgKey")), l = l.nextElementSibling;
    for (const [c, d] of r.entries())
      a.has(c) || o.appendChild(oo(d));
  }
}
function Ys(t, e, n) {
  for (const [s, o] of [
    [e.shapes, e.custom],
    [e.shapesBelow, e.customBelow]
  ]) {
    const [i, r] = [s, o].map((c) => c.querySelector("g")), a = t.filter((c) => s === e.shapesBelow == !!c.shape.below), l = /* @__PURE__ */ new Map();
    for (const c of a)
      l.set(c.hash, !1);
    for (const c of [i, r]) {
      const d = [];
      let h = c.firstElementChild, p;
      for (; h; )
        p = h.getAttribute("cgHash"), l.has(p) ? l.set(p, !0) : d.push(h), h = h.nextElementSibling;
      for (const m of d)
        c.removeChild(m);
    }
    for (const c of a.filter((d) => !l.get(d.hash)))
      for (const d of n(c))
        d.isCustom ? r.appendChild(d.el) : i.appendChild(d.el);
  }
}
function Ct({ orig: t, dest: e, brush: n, piece: s, modifiers: o, customSvg: i, label: r, below: a }, l, c, d, h, p) {
  var m;
  return [
    d.width,
    d.height,
    c,
    h && "pendingErase",
    p,
    t,
    e,
    n,
    l && "-",
    s && Js(s),
    o && eo(o),
    i && `custom-${Et(i.html)},${((m = i.center) == null ? void 0 : m[0]) ?? "o"}`,
    r && `label-${Et(r.text)}`,
    a && "below"
  ].filter((g) => g).join(",");
}
const Js = (t) => [t.color, t.role, t.scale].filter((e) => e).join(","), eo = (t) => [t.lineWidth, t.hilite].filter((e) => e).join(",");
function Et(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++)
    e = (e << 5) - e + t.charCodeAt(n) >>> 0;
  return e.toString();
}
function to(t, { shape: e, current: n, pendingErase: s, hash: o }, i, r, a) {
  const l = Se(Pe(E(e.orig), t.orientation), a), c = e.dest ? Se(Pe(E(e.dest), t.orientation), a) : l, d = e.brush && vn(i[e.brush], e.modifiers), h = r.get(e.dest), p = [];
  if (d) {
    const m = A(x("g"), { cgHash: o });
    p.push({ el: m }), l[0] !== c[0] || l[1] !== c[1] ? m.appendChild(so(e, d, l, c, n, Qe(e.dest, r), s)) : m.appendChild(no(i[e.brush], l, n, a, s));
  }
  if (e.label) {
    const m = e.label;
    m.fill ?? (m.fill = e.brush && i[e.brush].color);
    const g = e.brush ? void 0 : "tr";
    p.push({ el: io(m, o, l, c, h, g), isCustom: !0 });
  }
  if (e.customSvg) {
    const m = e.customSvg.center ?? "orig", [g, f] = m === "label" ? Mn(l, c, h).map((w) => w - 0.5) : m === "dest" ? c : l, k = A(x("g"), { transform: `translate(${g},${f})`, cgHash: o });
    k.innerHTML = `<svg width="1" height="1" viewBox="0 0 100 100">${e.customSvg.html}</svg>`, p.push({ el: k, isCustom: !0 });
  }
  return p;
}
function no(t, e, n, s, o) {
  const i = ro(), r = (s.width + s.height) / (4 * Math.max(s.width, s.height));
  return A(x("circle"), {
    stroke: t.color,
    "stroke-width": i[n ? 0 : 1],
    fill: "none",
    opacity: yn(t, n, o),
    cx: e[0],
    cy: e[1],
    r: r - i[1] / 2
  });
}
function so(t, e, n, s, o, i, r) {
  var d;
  function a(h) {
    var y;
    const p = lo(i && !o), m = s[0] - n[0], g = s[1] - n[1], f = Math.atan2(g, m), k = Math.cos(f) * p, w = Math.sin(f) * p, v = kn(t);
    return A(x("line"), {
      stroke: h ? v.color : e.color,
      "stroke-width": ao(e, o) * (h ? 1.14 : 1),
      "stroke-linecap": "round",
      "marker-end": `url(#arrowhead-${h ? v.key : e.key})`,
      opacity: (y = t.modifiers) != null && y.hilite && !r ? 1 : yn(e, o, r),
      x1: n[0],
      y1: n[1],
      x2: s[0] - k,
      y2: s[1] - w
    });
  }
  if (!((d = t.modifiers) != null && d.hilite))
    return a(!1);
  const l = A(x("g"), { opacity: e.opacity }), c = A(x("g"), { filter: "url(#cg-filter-blur)" });
  return c.appendChild(co(n, s)), c.appendChild(a(!0)), l.appendChild(c), l.appendChild(a(!1)), l;
}
function oo(t) {
  const e = A(x("marker"), {
    id: "arrowhead-" + t.key,
    orient: "auto",
    overflow: "visible",
    markerWidth: 4,
    markerHeight: 4,
    refX: t.key.startsWith("hilite") ? 1.86 : 2.05,
    refY: 2
  });
  return e.appendChild(A(x("path"), {
    d: "M0,0 V4 L3,2 Z",
    fill: t.color
  })), e.setAttribute("cgKey", t.key), e;
}
function io(t, e, n, s, o, i) {
  const a = 0.4 * 0.75 ** t.text.length, l = Mn(n, s, o), c = i === "tr" ? 0.4 : 0, d = A(x("g"), {
    transform: `translate(${l[0] + c},${l[1] - c})`,
    cgHash: e
  });
  d.appendChild(A(x("circle"), {
    r: 0.4 / 2,
    "fill-opacity": i ? 1 : 0.8,
    "stroke-opacity": i ? 1 : 0.7,
    "stroke-width": 0.03,
    fill: t.fill ?? "#666",
    stroke: "white"
  }));
  const h = A(x("text"), {
    "font-size": a,
    "font-family": "Noto Sans",
    "text-anchor": "middle",
    fill: "white",
    y: 0.13 * 0.75 ** t.text.length
  });
  return h.innerHTML = t.text, d.appendChild(h), d;
}
const Pe = (t, e) => e === "white" ? t : [7 - t[0], 7 - t[1]], gn = (t, e) => (t % e + e) % e, bn = (t, e) => gn(t + e, 16), wn = (t) => [...t].some((e) => [-3, -2, -1, 1, 2, 3].some((n) => t.has(bn(e, n)))), Qe = (t, e) => !!t && e.has(t) && wn(e.get(t)), x = (t) => document.createElementNS("http://www.w3.org/2000/svg", t), Mt = (t, e) => t && e.has(t) ? e.get(t).size : 0;
function A(t, e) {
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t.setAttribute(n, e[n]);
  return t;
}
const vn = (t, e) => e ? {
  color: t.color,
  opacity: Math.round(t.opacity * 10) / 10,
  lineWidth: Math.round(e.lineWidth || t.lineWidth),
  key: [t.key, e.lineWidth].filter((n) => n).join("")
} : t, ro = () => [3 / 64, 4 / 64], ao = (t, e) => (t.lineWidth || 10) * (e ? 0.85 : 1) / 64;
function kn(t) {
  var n;
  const e = (n = t.modifiers) == null ? void 0 : n.hilite;
  return { key: e && `hilite-${e.replace("#", "")}`, color: e };
}
const yn = (t, e, n) => (t.opacity || 1) * (n ? 0.6 : e ? 0.9 : 1), lo = (t) => (t ? 20 : 10) / 64;
function Se(t, e) {
  const n = Math.min(1, e.width / e.height), s = Math.min(1, e.height / e.width);
  return [(t[0] - 3.5) * n, (3.5 - t[1]) * s];
}
function co(t, e) {
  const n = {
    from: [Math.floor(Math.min(t[0], e[0])), Math.floor(Math.min(t[1], e[1]))],
    to: [Math.ceil(Math.max(t[0], e[0])), Math.ceil(Math.max(t[1], e[1]))]
  };
  return A(x("rect"), {
    x: n.from[0],
    y: n.from[1],
    width: n.to[0] - n.from[0],
    height: n.to[1] - n.from[1],
    fill: "none",
    stroke: "none"
  });
}
const Cn = (t) => gn(Math.round(t * 8 / Math.PI), 16), En = (t, e) => Math.atan2(e[1] - t[1], e[0] - t[0]) + Math.PI, ho = (t, e) => Math.sqrt([t[0] - e[0], t[1] - e[1]].reduce((n, s) => n + s * s, 0));
function Mn(t, e, n) {
  let s = ho(t, e);
  const o = En(t, e);
  if (n && (s -= 33 / 64, wn(n))) {
    s -= 10 / 64;
    const i = Cn(o);
    i & 1 && [-1, 1].some((r) => n.has(bn(i, r))) && (s -= 0.4);
  }
  return [t[0] - Math.cos(o) * s, t[1] - Math.sin(o) * s].map((i) => i + 0.5);
}
function uo(t, e) {
  t.innerHTML = "", t.classList.add("cg-wrap");
  for (const d of Jn)
    t.classList.toggle("orientation-" + d, e.orientation === d);
  t.classList.toggle("manipulable", !e.viewOnly);
  const n = z("cg-container");
  t.appendChild(n);
  const s = z("cg-board");
  n.appendChild(s);
  let o, i, r, a, l;
  if (e.drawable.visible && ([o, i] = ["cg-shapes-below", "cg-shapes"].map((d) => Pt(d, !0)), [r, a] = ["cg-custom-below", "cg-custom-svgs"].map((d) => Pt(d, !1)), l = z("cg-auto-pieces"), n.appendChild(o), n.appendChild(r), n.appendChild(i), n.appendChild(a), n.appendChild(l)), e.coordinates) {
    const d = e.orientation === "black" ? " black" : "", h = e.ranksPosition === "left" ? " left" : "";
    if (e.coordinatesOnSquares) {
      const p = e.orientation === "white" ? (m) => m + 1 : (m) => 8 - m;
      Ce.forEach((m, g) => n.appendChild(Be(Ee.map((f) => m + f), "squares rank" + p(g) + d + h, g % 2 === 0 ? "black" : "white")));
    } else
      n.appendChild(Be(Ee, "ranks" + d + h, e.ranksPosition === "right" == (e.orientation === "white") ? "white" : "black")), n.appendChild(Be(Ce, "files" + d, pe(e.orientation)));
  }
  let c;
  return e.draggable.enabled && e.draggable.showGhost && (c = z("piece", "ghost"), it(c, !1), n.appendChild(c)), { board: s, container: n, wrap: t, ghost: c, shapes: i, shapesBelow: o, custom: a, customBelow: r, autoPieces: l };
}
function Pt(t, e) {
  const n = A(x("svg"), {
    class: t,
    viewBox: e ? "-4 -4 8 8" : "-3.5 -3.5 8 8",
    preserveAspectRatio: "xMidYMid slice"
  });
  return e && n.appendChild(Xs()), n.appendChild(x("g")), n;
}
function Be(t, e, n) {
  const s = z("coords", e);
  let o;
  return t.forEach((i, r) => {
    const a = r % 2 === (n === "white" ? 0 : 1);
    o = z("coord", `coord-${a ? "light" : "dark"}`), o.textContent = i, s.appendChild(o);
  }), s;
}
function po(t, e) {
  if (!t.dropmode.active)
    return;
  V(t), X(t);
  const n = t.dropmode.piece;
  if (n) {
    t.pieces.set("a0", n);
    const s = J(e), o = s && ee(s, O(t), t.dom.bounds());
    o && tn(t, "a0", o);
  }
  t.dom.redraw();
}
function mo(t, e) {
  const n = t.dom.elements.board;
  if ("ResizeObserver" in window && new ResizeObserver(e).observe(t.dom.elements.wrap), (t.disableContextMenu || t.drawable.enabled) && n.addEventListener("contextmenu", (o) => o.preventDefault()), t.viewOnly)
    return;
  const s = go(t);
  n.addEventListener("touchstart", s, {
    passive: !1
  }), n.addEventListener("mousedown", s, {
    passive: !1
  });
}
function fo(t, e) {
  const n = [];
  if ("ResizeObserver" in window || n.push(oe(document.body, "chessground.resize", e)), !t.viewOnly) {
    const s = St(t, Us, Is), o = St(t, Ws, _s);
    for (const r of ["touchmove", "mousemove"])
      n.push(oe(document, r, s));
    for (const r of ["touchend", "mouseup"])
      n.push(oe(document, r, o));
    const i = () => t.dom.bounds.clear();
    n.push(oe(document, "scroll", i, { capture: !0, passive: !0 })), n.push(oe(window, "resize", i, { passive: !0 }));
  }
  return () => n.forEach((s) => s());
}
function oe(t, e, n, s) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s);
}
const go = (t) => (e) => {
  t.draggable.current ? Me(t) : t.drawable.current ? dn(t) : e.shiftKey || Ut(e) ? t.drawable.enabled && Os(t, e) : t.viewOnly || (t.dropmode.active ? po(t, e) : Gs(t, e));
}, St = (t, e, n) => (s) => {
  t.drawable.current ? t.drawable.enabled && n(t, s) : t.viewOnly || e(t, s);
};
function bo(t) {
  const e = O(t), n = me(t.dom.bounds()), s = t.dom.elements.board, o = t.pieces, i = t.animation.current, r = i ? i.plan.anims : /* @__PURE__ */ new Map(), a = i ? i.plan.fadings : /* @__PURE__ */ new Map(), l = t.draggable.current, c = ko(t), d = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
  let g, f, k, w, v, y, T, M, I, K;
  for (f = s.firstChild; f; ) {
    if (g = f.cgKey, Pn(f))
      if (k = o.get(g), v = r.get(g), y = a.get(g), w = f.cgPiece, f.cgDragging && (!l || l.orig !== g) && (f.classList.remove("dragging"), G(f, n(E(g), e)), f.cgDragging = !1), !y && f.cgFading && (f.cgFading = !1, f.classList.remove("fading")), k) {
        if (v && f.cgAnimating && w === ie(k)) {
          const b = E(g);
          b[0] += v[2], b[1] += v[3], f.classList.add("anim"), G(f, n(b, e));
        } else f.cgAnimating && (f.cgAnimating = !1, f.classList.remove("anim"), G(f, n(E(g), e)), t.addPieceZIndex && (f.style.zIndex = Le(E(g), e)));
        w === ie(k) && (!y || !f.cgFading) ? d.add(g) : y && w === ie(y) ? (f.classList.add("fading"), f.cgFading = !0) : Ae(p, w, f);
      } else
        Ae(p, w, f);
    else if (Sn(f)) {
      const b = f.className;
      c.get(g) === b ? h.add(g) : Ae(m, b, f);
    }
    f = f.nextSibling;
  }
  for (const [b, P] of c)
    if (!h.has(b)) {
      I = m.get(P), K = I && I.pop();
      const S = n(E(b), e);
      if (K)
        K.cgKey = b, G(K, S);
      else {
        const $ = z("square", P);
        $.cgKey = b, G($, S), s.insertBefore($, s.firstChild);
      }
    }
  for (const [b, P] of o)
    if (v = r.get(b), !d.has(b))
      if (T = p.get(ie(P)), M = T && T.pop(), M) {
        M.cgKey = b, M.cgFading && (M.classList.remove("fading"), M.cgFading = !1);
        const S = E(b);
        t.addPieceZIndex && (M.style.zIndex = Le(S, e)), v && (M.cgAnimating = !0, M.classList.add("anim"), S[0] += v[2], S[1] += v[3]), G(M, n(S, e));
      } else {
        const S = ie(P), $ = z("piece", S), fe = E(b);
        $.cgPiece = S, $.cgKey = b, v && ($.cgAnimating = !0, fe[0] += v[2], fe[1] += v[3]), G($, n(fe, e)), t.addPieceZIndex && ($.style.zIndex = Le(fe, e)), s.appendChild($);
      }
  for (const b of p.values())
    xt(t, b);
  for (const b of m.values())
    xt(t, b);
}
function wo(t) {
  const e = O(t), n = me(t.dom.bounds());
  let s = t.dom.elements.board.firstChild;
  for (; s; )
    (Pn(s) && !s.cgAnimating || Sn(s)) && G(s, n(E(s.cgKey), e)), s = s.nextSibling;
}
function Nt(t) {
  var r, a;
  const e = t.dom.elements.wrap.getBoundingClientRect(), n = t.dom.elements.container, s = e.height / e.width, o = Math.floor(e.width * window.devicePixelRatio / 8) * 8 / window.devicePixelRatio, i = o * s;
  n.style.width = o + "px", n.style.height = i + "px", t.dom.bounds.clear(), (r = t.addDimensionsCssVarsTo) == null || r.style.setProperty("---cg-width", o + "px"), (a = t.addDimensionsCssVarsTo) == null || a.style.setProperty("---cg-height", i + "px");
}
const Pn = (t) => t.tagName === "PIECE", Sn = (t) => t.tagName === "SQUARE";
function xt(t, e) {
  for (const n of e)
    t.dom.elements.board.removeChild(n);
}
function Le(t, e) {
  const s = t[1];
  return `${e ? 10 - s : 3 + s}`;
}
const ie = (t) => `${t.color} ${t.role}`, vo = (t, e) => {
  var n;
  return (n = t.lastMove) != null && n[1] && !t.pieces.has(t.lastMove[1]) && t.lastMove[0][0] === "e" && ["h", "a"].includes(t.lastMove[1][0]) && t.lastMove[0][1] === t.lastMove[1][1] && ls(...E(t.lastMove[0]), ...E(t.lastMove[1])).some((s) => t.pieces.has(s)) ? (e > t.lastMove[0] ? "g" : "c") + e[1] : e;
};
function ko(t) {
  var o, i;
  const e = /* @__PURE__ */ new Map();
  if (t.lastMove && t.highlight.lastMove)
    for (const [r, a] of t.lastMove.entries())
      F(e, r === 1 ? vo(t, a) : a, "last-move");
  if (t.check && t.highlight.check && F(e, t.check, "check"), t.selected && (F(e, t.selected, "selected"), t.movable.showDests)) {
    for (const r of ((o = t.movable.dests) == null ? void 0 : o.get(t.selected)) ?? [])
      F(e, r, "move-dest" + (t.pieces.has(r) ? " oc" : ""));
    for (const r of ((i = t.premovable.customDests) == null ? void 0 : i.get(t.selected)) ?? t.premovable.dests ?? [])
      F(e, r, "premove-dest" + (t.pieces.has(r) ? " oc" : ""));
  }
  const n = t.premovable.current;
  if (n)
    for (const r of n)
      F(e, r, "current-premove");
  else t.predroppable.current && F(e, t.predroppable.current.key, "current-premove");
  const s = t.exploding;
  if (s)
    for (const r of s.keys)
      F(e, r, "exploding" + s.stage);
  return t.highlight.custom && t.highlight.custom.forEach((r, a) => {
    F(e, a, r);
  }), e;
}
function F(t, e, n) {
  const s = t.get(e);
  s ? t.set(e, `${s} ${n}`) : t.set(e, n);
}
function Ae(t, e, n) {
  const s = t.get(e);
  s ? s.push(n) : t.set(e, [n]);
}
function yo(t, e, n) {
  const s = /* @__PURE__ */ new Map(), o = [];
  for (const a of t)
    s.set(a.hash, !1);
  let i = e.firstElementChild, r;
  for (; i; )
    r = i.getAttribute("cgHash"), s.has(r) ? s.set(r, !0) : o.push(i), i = i.nextElementSibling;
  for (const a of o)
    e.removeChild(a);
  for (const a of t)
    s.get(a.hash) || e.appendChild(n(a));
}
function Co(t, e) {
  const s = t.drawable.autoShapes.filter((o) => o.piece).map((o) => ({
    shape: o,
    hash: Po(o),
    current: !1,
    pendingErase: !1
  }));
  yo(s, e, (o) => Mo(t, o, t.dom.bounds()));
}
function Eo(t) {
  var o;
  const e = O(t), n = me(t.dom.bounds());
  let s = (o = t.dom.elements.autoPieces) == null ? void 0 : o.firstChild;
  for (; s; )
    zt(s, n(E(s.cgKey), e), s.cgScale), s = s.nextSibling;
}
function Mo(t, { shape: e, hash: n }, s) {
  var c, d, h;
  const o = e.orig, i = (c = e.piece) == null ? void 0 : c.role, r = (d = e.piece) == null ? void 0 : d.color, a = (h = e.piece) == null ? void 0 : h.scale, l = z("piece", `${i} ${r}`);
  return l.setAttribute("cgHash", n), l.cgKey = o, l.cgScale = a, zt(l, me(s)(E(o), O(t)), a), l;
}
const Po = (t) => {
  var e, n, s;
  return [t.orig, (e = t.piece) == null ? void 0 : e.role, (n = t.piece) == null ? void 0 : n.color, (s = t.piece) == null ? void 0 : s.scale].join(",");
};
function So(t, e) {
  const n = Vs();
  ln(n, e || {});
  function s() {
    const o = "dom" in n ? n.dom.unbind : void 0, i = uo(t, n), r = Ft(() => i.board.getBoundingClientRect()), a = (d) => {
      bo(c), i.autoPieces && Co(c, i.autoPieces), !d && i.shapes && Qs(c, i);
    }, l = () => {
      Nt(c), wo(c), i.autoPieces && Eo(c);
    }, c = n;
    return c.dom = {
      elements: i,
      bounds: r,
      redraw: No(a),
      redrawNow: a,
      unbind: o
    }, c.drawable.prevSvgHash = "", Nt(c), a(!1), mo(c, l), o || (c.dom.unbind = fo(c, l)), c.events.insert && c.events.insert(i), c;
  }
  return js(s(), s);
}
function No(t) {
  let e = !1;
  return () => {
    e || (e = !0, requestAnimationFrame(() => {
      t(), e = !1;
    }));
  };
}
class xo {
  init(e, n) {
    const o = {
      movable: {
        free: !1,
        color: "white",
        showDests: !0,
        rookCastle: !1,
        events: {
          after: n
        }
      },
      draggable: {
        showGhost: !0
      },
      animation: {
        enabled: !0,
        duration: 200
      },
      highlight: {
        lastMove: !0,
        check: !0
      },
      drawable: {
        brushes: {
          green: { key: "green", color: "#15781B", opacity: 1, lineWidth: 10 },
          red: { key: "red", color: "#882020", opacity: 1, lineWidth: 10 },
          blue: { key: "blue", color: "#003088", opacity: 1, lineWidth: 10 },
          yellow: { key: "yellow", color: "#e68f00", opacity: 1, lineWidth: 10 },
          chosenMove: { key: "chosenMove", color: "#e69500", opacity: 0.8, lineWidth: 12 },
          candidateMove: { key: "candidateMove", color: "#7c8aa0", opacity: 0.55, lineWidth: 8 }
        }
      }
    };
    this.cg = So(e, o), this.badgeContainer = document.createElement("div"), this.badgeContainer.className = "chess-prob-badges", e.appendChild(this.badgeContainer);
  }
  updatePosition(e, n, s, o, i) {
    this.cg.set({
      fen: e,
      turnColor: n,
      movable: {
        color: n,
        dests: s
      },
      lastMove: o,
      check: i,
      viewOnly: !1
    });
  }
  setViewOnly(e, n, s) {
    this.cg.set({
      viewOnly: !0,
      fen: e,
      lastMove: n,
      check: s
    });
  }
  flip() {
    this.cg.toggleOrientation();
  }
  getOrientation() {
    return this.cg.state.orientation;
  }
  showProbabilityArrows(e) {
    const s = [...e].sort((i, r) => i.isChosen && !r.isChosen ? 1 : !i.isChosen && r.isChosen ? -1 : 0).map((i) => ({
      orig: i.from,
      dest: i.to,
      brush: i.isChosen ? "chosenMove" : "candidateMove"
    }));
    this.cg.setAutoShapes(s), this.clearBadges();
    const o = this.cg.state.orientation;
    for (const i of e) {
      const r = i.to, a = r.charCodeAt(0) - 97, l = parseInt(r[1]), c = o === "white" ? a : 7 - a, d = o === "white" ? 8 - l : l - 1, h = document.createElement("div");
      h.className = "chess-prob-badge " + (i.isChosen ? "chess-prob-badge-chosen" : "chess-prob-badge-candidate"), h.textContent = Math.round(i.probability * 100) + "%", c === 7 ? (h.style.left = `${(c + 1) * 12.5}%`, h.style.top = `${d * 12.5}%`, h.style.transform = "translate(-100%, 0)") : c === 0 ? (h.style.left = "0", h.style.top = `${d * 12.5}%`) : (h.style.left = `${(c + 1) * 12.5}%`, h.style.top = `${d * 12.5}%`, h.style.transform = "translate(-100%, 0)"), this.badgeContainer.appendChild(h);
    }
  }
  clearArrows() {
    this.cg.setAutoShapes([]), this.clearBadges();
  }
  clearBadges() {
    this.badgeContainer.innerHTML = "";
  }
  showPromotionDialog(e, n) {
    return new Promise((s) => {
      const o = this.cg.state.dom.elements.board;
      if (!o) {
        s(null);
        return;
      }
      const i = this.cg.state.orientation, r = e.charCodeAt(0) - 97, a = parseInt(e[1]), l = i === "white" ? r : 7 - r, c = i === "white" ? 8 - a : a - 1, d = c === 0, h = [
        { role: "queen", letter: "q" },
        { role: "knight", letter: "n" },
        { role: "rook", letter: "r" },
        { role: "bishop", letter: "b" }
      ], p = document.createElement("div");
      p.className = "chess-promotion-overlay";
      const m = () => p.remove();
      p.addEventListener("click", () => {
        m(), s(null);
      }), h.forEach((g, f) => {
        const k = d ? c + f : c - f, w = `${l * 12.5}%`, v = `${k * 12.5}%`, y = document.createElement("div");
        y.className = "chess-promotion-choice", y.style.left = w, y.style.top = v;
        const T = document.createElement("square"), M = document.createElement("piece");
        M.classList.add(n, g.role), T.appendChild(M), y.appendChild(T), p.appendChild(y), y.addEventListener("click", (I) => {
          I.stopPropagation(), m(), s(g.letter);
        });
      }), o.appendChild(p);
    });
  }
  destroy() {
    var e;
    (e = this.cg) == null || e.destroy();
  }
}
const To = 480;
function Nn(t) {
  const n = (t == null ? void 0 : t.mode) === "board-only" ? "board-only" : "sidebar", s = n === "board-only" ? "ca-layout-board-only" : "ca-layout-sidebar", o = t == null ? void 0 : t.boardSize, i = typeof o == "number" && isFinite(o) && o > 0 ? o : To, r = typeof (t == null ? void 0 : t.moveListContainerId) == "string" ? t.moveListContainerId : null;
  return { mode: n, containerClass: s, boardSizePx: i, moveListContainerId: r };
}
const Bo = '<svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.062 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>', Lo = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>', Ao = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M8 7.3v3.7" stroke-linecap="round"/><circle cx="8" cy="4.9" r="0.85" fill="currentColor" stroke="none"/></svg>', De = 2500, Ze = 1e3, Ye = 2500, Je = 100;
function Do(t) {
  const e = Math.round(t / Je) * Je;
  return Math.min(Ye, Math.max(Ze, e));
}
class Ro {
  constructor(e, n) {
    this.loadingBlurEl = null, this.loadingModalEl = null, this.loadingProgressFill = null, this.loadingProgressText = null, this.boardBlockerEl = null, this.mustDownloadBlurEl = null, this.mustDownloadModalEl = null, this.settingsModalClose = null, this.onNewGameWithColor = null, this.onMoveNavigate = null, this.onSamplingParamsChanged = null, this.onMetadataChanged = null, this.onLoadModel = null, this.onShowProbabilitiesChanged = null, this.onClaimDraw = null, this.onThemeModeChanged = null, this.onBoardThemeChanged = null, this.onPieceSetChanged = null, this.currentModelPath = "", this.models = [], this.timeControl = "rapid", this.userElo = De, this.modelElo = De, this.moveListPortalRoot = null, this.container = e;
    const s = n ?? Nn(void 0);
    this.layoutMode = s.mode, this.boardSizePx = s.boardSizePx, this.moveListContainerId = s.moveListContainerId, this.layoutContainerClass = s.containerClass;
  }
  initialize() {
    this.container.innerHTML = "", this.container.className = "chess-game-container", this.container.classList.add(this.layoutContainerClass), this.container.style.setProperty("--ca-board-size", `${this.boardSizePx}px`), this.buildDOM();
  }
  getBoardContainer() {
    return this.boardContainer;
  }
  /** Returns the portal wrapper injected into the host element, or null when
   * the move list is rendered internally. Used by ChessGame to pass the root
   * to ThemeManager so live theme changes reach the portal. */
  getMoveListPortalRoot() {
    return this.moveListPortalRoot;
  }
  /** Remove the injected portal wrapper from the host element (leaving the host
   * element itself intact). Safe to call even when no portal was created. */
  destroy() {
    var e, n;
    (e = this.settingsModalClose) == null || e.call(this), this.settingsModalClose = null, (n = this.moveListPortalRoot) == null || n.remove(), this.moveListPortalRoot = null;
  }
  updateStatus(e) {
    this.statusText.innerHTML = e;
  }
  updateMoveHistory(e, n) {
    if (this.moveHistoryEl.innerHTML = "", e.length === 0) {
      this.moveHistoryEl.innerHTML = '<div class="chess-move-history-empty">No moves yet</div>';
      return;
    }
    for (let s = 0; s < e.length; s += 2) {
      const o = Math.floor(s / 2) + 1, i = document.createElement("div");
      i.className = "chess-move-pair";
      const r = document.createElement("div");
      r.className = "chess-move-number", r.textContent = `${o}.`, i.appendChild(r);
      const a = document.createElement("div");
      if (a.className = "chess-move-item", s === n && a.classList.add("current"), a.textContent = e[s], a.onclick = () => {
        var l;
        return (l = this.onMoveNavigate) == null ? void 0 : l.call(this, s);
      }, i.appendChild(a), s + 1 < e.length) {
        const l = document.createElement("div");
        l.className = "chess-move-item", s + 1 === n && l.classList.add("current"), l.textContent = e[s + 1], l.onclick = () => {
          var c;
          return (c = this.onMoveNavigate) == null ? void 0 : c.call(this, s + 1);
        }, i.appendChild(l);
      }
      this.moveHistoryEl.appendChild(i);
    }
    this.moveHistoryEl.scrollTop = this.moveHistoryEl.scrollHeight;
  }
  // --- Game Over Overlay ---
  showGameEndBanner(e, n) {
    this.gameEndBannerText.textContent = e, this.gameEndBanner.classList.remove("chess-hidden", "chess-game-end-banner-win", "chess-game-end-banner-draw"), this.gameEndBanner.classList.add(n ? "chess-game-end-banner-draw" : "chess-game-end-banner-win"), this.gameEndBannerBtn.className = n ? "chess-btn chess-btn-secondary chess-btn-sm" : "chess-btn chess-btn-primary chess-btn-sm", this.controlNewGameBtn.style.display = "none";
  }
  hideGameEndBanner() {
    this.gameEndBanner.classList.add("chess-hidden"), this.controlNewGameBtn.style.display = "";
  }
  setClaimDrawAvailable(e, n = []) {
    this.claimDrawBtn.style.display = e ? "" : "none", this.claimDrawBtn.title = n.length > 0 ? `Claim draw by ${n.join(" or ")}` : "Claim draw";
  }
  // Gate the New Game CTAs on model-load state: starting a game before the AI
  // session is ready yields an unplayable position (AI never moves). Both the
  // below-board control and the game-end banner button share this gate.
  setNewGameEnabled(e) {
    this.controlNewGameBtn.disabled = !e, this.controlNewGameBtn.title = e ? "" : "Loading AI model…", this.gameEndBannerBtn.disabled = !e, this.gameEndBannerBtn.title = e ? "" : "Loading AI model…";
  }
  // --- Loading Modal (download progress + init spinner) ---
  // One overlay spans the whole load lifecycle: a progress bar while the model
  // downloads, then a spinner while the ONNX session initializes. Cache hits skip
  // straight to the spinner. Calling a show* method while the modal is already up
  // swaps its body in place — no flicker from tearing down and rebuilding the blur.
  showDownloadProgress(e) {
    const n = new AbortController(), s = this.ensureLoadingCard("knight"), o = document.createElement("div");
    o.className = "chess-card-title", o.textContent = "Loading...", s.appendChild(o), e && s.appendChild(this._buildSizeChip(e)), this.loadingProgressText = document.createElement("div"), this.loadingProgressText.className = "chess-card-pct", this.loadingProgressText.textContent = "0%", s.appendChild(this.loadingProgressText);
    const i = document.createElement("div");
    i.className = "chess-loading-progress-bar", this.loadingProgressFill = document.createElement("div"), this.loadingProgressFill.className = "chess-loading-progress-fill", i.appendChild(this.loadingProgressFill), s.appendChild(i);
    const r = document.createElement("button");
    return r.className = "chess-btn chess-btn-sm chess-btn-ghost", r.textContent = "Cancel", r.onclick = () => n.abort(), s.appendChild(r), { abortController: n };
  }
  updateLoadingProgress(e) {
    this.loadingProgressFill && (this.loadingProgressFill.style.width = e + "%"), this.loadingProgressText && (this.loadingProgressText.textContent = Math.round(e) + "%");
  }
  showLoadingSpinner(e = "Warming up the engine…") {
    const n = this.ensureLoadingCard("spinner");
    this.loadingProgressFill = null, this.loadingProgressText = null;
    const s = document.createElement("div");
    s.className = "chess-card-title", s.textContent = e, n.appendChild(s);
    const o = document.createElement("div");
    o.className = "chess-card-sub", o.textContent = "Getting the model ready to play.", n.appendChild(o);
  }
  hideLoadingModal() {
    var e, n;
    (e = this.loadingModalEl) == null || e.remove(), this.loadingModalEl = null, (n = this.loadingBlurEl) == null || n.remove(), this.loadingBlurEl = null, this.loadingProgressFill = null, this.loadingProgressText = null;
  }
  // Build the blur + modal shell on first use, then (re)build the card inside it so
  // a show* call swaps the contents in place — no scrim flicker from tearing down
  // and rebuilding the blur. Returns the card body to append into.
  ensureLoadingCard(e) {
    this.loadingBlurEl || (this.loadingBlurEl = document.createElement("div"), this.loadingBlurEl.className = "chess-loading-blur", this.boardContainer.appendChild(this.loadingBlurEl)), this.loadingModalEl || (this.loadingModalEl = document.createElement("div"), this.loadingModalEl.className = "chess-loading-modal", this.boardContainer.appendChild(this.loadingModalEl)), this.loadingModalEl.replaceChildren();
    const { card: n, body: s } = this._buildCard(e);
    return this.loadingModalEl.appendChild(n), s;
  }
  // Shared overlay card used by the download invite, download progress, and init
  // spinner: a checker banner (the board motif that ties the surfaces together) +
  // an accent medallion holding either the knight glyph or a spinner, then a body
  // to fill in. Returns both so the caller can mount the card and fill the body.
  _buildCard(e) {
    const n = document.createElement("div");
    n.className = "chess-card";
    const s = document.createElement("div");
    s.className = "chess-card-banner";
    const o = document.createElement("div");
    if (o.className = "chess-card-medallion", e === "spinner") {
      const r = document.createElement("div");
      r.className = "chess-spinner chess-spinner-dark", o.appendChild(r);
    } else
      o.textContent = "♞";
    const i = document.createElement("div");
    return i.className = "chess-card-body", n.append(s, o, i), { card: n, body: i };
  }
  // A pill chip showing the model download size, with the download glyph.
  _buildSizeChip(e) {
    const n = document.createElement("div");
    n.className = "chess-card-chip", n.innerHTML = Lo;
    const s = document.createElement("span");
    return s.textContent = e, n.appendChild(s), n;
  }
  // --- Must Download Overlay ---
  showMustDownloadOverlay() {
    return new Promise((e) => {
      this.mustDownloadBlurEl = document.createElement("div"), this.mustDownloadBlurEl.className = "chess-loading-blur", this.boardContainer.appendChild(this.mustDownloadBlurEl), this.mustDownloadModalEl = document.createElement("div"), this.mustDownloadModalEl.className = "chess-loading-modal";
      const { card: n, body: s } = this._buildCard("knight"), o = document.createElement("div");
      o.className = "chess-card-title", o.textContent = "Download to play", s.appendChild(o);
      const i = document.createElement("div");
      i.className = "chess-card-sub", i.textContent = "The chess AI is required to play. It downloads once, then runs in your browser.", s.appendChild(i);
      const r = document.createElement("button");
      r.className = "chess-btn chess-btn-primary chess-card-block", r.textContent = "Download", r.onclick = () => {
        var a, l;
        (a = this.mustDownloadBlurEl) == null || a.remove(), this.mustDownloadBlurEl = null, (l = this.mustDownloadModalEl) == null || l.remove(), this.mustDownloadModalEl = null, e();
      }, s.appendChild(r), this.mustDownloadModalEl.appendChild(n), this.boardContainer.appendChild(this.mustDownloadModalEl);
    });
  }
  // --- Board Blocker ---
  showBoardBlocker(e, n) {
    this.hideBoardBlocker(), this.boardBlockerEl = document.createElement("div"), this.boardBlockerEl.className = "chess-board-blocker";
    const { card: s, body: o } = this._buildCard("knight"), i = document.createElement("div");
    i.className = "chess-card-title", i.textContent = "Load the Chess AI", o.appendChild(i);
    const r = document.createElement("div");
    r.className = "chess-card-sub", r.textContent = "Runs entirely in your browser. One-time download, then it's instant.", o.appendChild(r), n && o.appendChild(this._buildSizeChip(n));
    const a = document.createElement("button");
    a.className = "chess-btn chess-btn-primary chess-card-block", a.textContent = "Play", o.appendChild(a), this.boardBlockerEl.appendChild(s), this.boardBlockerEl.addEventListener("click", e, { once: !0 }), this.boardContainer.appendChild(this.boardBlockerEl);
  }
  hideBoardBlocker() {
    var e;
    (e = this.boardBlockerEl) == null || e.remove(), this.boardBlockerEl = null;
  }
  // --- New Game Modal ---
  showNewGameModal() {
    const e = document.createElement("div");
    e.className = "chess-modal", e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true");
    const n = document.createElement("div");
    n.className = "chess-modal-content";
    const s = document.createElement("div");
    s.className = "chess-modal-title", s.textContent = "New game", n.appendChild(s);
    const o = document.createElement("div");
    o.className = "chess-newgame-sub", o.textContent = "Pick your side", n.appendChild(o);
    const i = document.createElement("div");
    i.className = "chess-color-options";
    const r = (w, v, y) => {
      const T = document.createElement("label");
      T.className = "chess-side";
      const M = document.createElement("input");
      M.type = "radio", M.name = "playerColor", M.value = w;
      const I = document.createElement("div");
      I.className = "chess-side-check", I.textContent = "✓";
      const K = document.createElement("div");
      K.className = `chess-side-tile chess-side-tile-${w}`;
      const b = document.createElement("span");
      b.className = `chess-side-king chess-side-king-${w}`, b.textContent = "♚", K.appendChild(b);
      const P = document.createElement("div");
      P.className = "chess-side-name", P.textContent = v;
      const S = document.createElement("div");
      return S.className = "chess-side-cap", S.textContent = y, T.append(M, I, K, P, S), T;
    }, a = r("white", "White", "You move first"), l = r("black", "Black", "AI moves first"), c = a.querySelector("input"), d = l.querySelector("input");
    i.append(a, l);
    const h = (w, v) => {
      v.checked = !0, a.classList.toggle("chess-side-selected", w === a), l.classList.toggle("chess-side-selected", w === l);
    };
    a.addEventListener("click", () => h(a, c)), l.addEventListener("click", () => h(l, d)), c.addEventListener("change", () => h(a, c)), d.addEventListener("change", () => h(l, d)), h(a, c), n.appendChild(i);
    const p = document.createElement("div");
    p.className = "chess-modal-buttons";
    const m = () => {
      e.remove(), document.removeEventListener("keydown", g);
    }, g = (w) => {
      var v;
      w.key === "Escape" ? m() : w.key === "Enter" && !(document.activeElement instanceof HTMLButtonElement) && (m(), (v = this.onNewGameWithColor) == null || v.call(this, c.checked));
    };
    document.addEventListener("keydown", g);
    const f = document.createElement("button");
    f.className = "chess-btn chess-btn-secondary chess-modal-cancel", f.textContent = "Cancel", f.onclick = m, p.appendChild(f);
    const k = document.createElement("button");
    k.className = "chess-btn chess-btn-primary chess-modal-start", k.textContent = "Start game", k.onclick = () => {
      var v;
      const w = c.checked;
      m(), (v = this.onNewGameWithColor) == null || v.call(this, w);
    }, p.appendChild(k), n.appendChild(p), e.appendChild(n), e.addEventListener("click", (w) => {
      w.target === e && m();
    }), this.container.appendChild(e), k.focus(), e.addEventListener("keydown", (w) => {
      if (w.key !== "Tab") return;
      const v = e.querySelectorAll(
        'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (v.length === 0) return;
      const y = v[0], T = v[v.length - 1];
      w.shiftKey && document.activeElement === y ? (w.preventDefault(), T.focus()) : !w.shiftKey && document.activeElement === T && (w.preventDefault(), y.focus());
    });
  }
  // --- Model Management ---
  setModelOptions(e, n) {
    this.models = e, this.currentModelPath = n, this.modelSelect.innerHTML = "";
    for (const s of e) {
      const o = document.createElement("option");
      o.value = s.path, o.textContent = s.size ? `${s.label} (${s.size})` : s.label, this.modelSelect.appendChild(o);
    }
    n && (this.modelSelect.value = n), this.modelSection.style.display = e.length > 1 ? "" : "none", this._updateLoadBtnState(), this._updateModelLabel();
  }
  setCurrentModel(e) {
    this.currentModelPath = e, this._updateLoadBtnState(), this._updateModelLabel();
  }
  setMetadataSettings(e) {
    this.timeControl = e.timeControl ?? "missing", this.userElo = e.userElo, this.modelElo = e.modelElo, this.timeControlSeg.set(this.timeControl), this.userEloControl.set(this.userElo), this.modelEloControl.set(this.modelElo);
  }
  _updateModelLabel() {
    const e = this.models.find((n) => n.path === this.currentModelPath);
    this.modelLabel.textContent = e ? `Playing against ${e.label}` : "";
  }
  toggleSettingsPanel() {
    if (this.layoutMode === "board-only")
      if (this.settingsModalClose)
        this.settingsModalClose();
      else {
        const e = document.createElement("div");
        e.className = "chess-modal-content chess-modal-content-settings", e.appendChild(this.settingsPanel), this.settingsPanel.classList.remove("chess-hidden");
        const { close: n } = this._openModal(e, () => {
          this.settingsModalClose = null, this.gearBtn.classList.remove("chess-settings-btn-active");
          const o = this.container.querySelector(".chess-game-wrapper");
          this.settingsPanel.parentNode === e && o && (this.settingsPanel.classList.add("chess-hidden"), o.appendChild(this.settingsPanel));
        });
        this.settingsModalClose = n, this.gearBtn.classList.add("chess-settings-btn-active");
        const s = e.querySelector(
          'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
        );
        s == null || s.focus();
      }
    else {
      const e = this.settingsPanel.classList.toggle("chess-hidden") === !1;
      this.gearBtn.classList.toggle("chess-settings-btn-active", e), this.moveHistoryEl.style.display = e ? "none" : "";
    }
  }
  // Open a modal overlay containing the given content element. Calls onClose when
  // the modal is dismissed (scrim-click, Escape, or the returned close handle).
  // Returns a close handle so callers can dismiss the modal programmatically.
  _openModal(e, n) {
    const s = document.createElement("div");
    s.className = "chess-modal", s.setAttribute("role", "dialog"), s.setAttribute("aria-modal", "true"), s.appendChild(e);
    const o = () => {
      s.parentNode && (s.remove(), document.removeEventListener("keydown", i), n());
    }, i = (r) => {
      r.key === "Escape" && (r.preventDefault(), o());
    };
    return document.addEventListener("keydown", i), s.addEventListener("click", (r) => {
      r.target === s && o();
    }), s.addEventListener("keydown", (r) => {
      if (r.key !== "Tab") return;
      const a = s.querySelectorAll(
        'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (a.length === 0) return;
      const l = a[0], c = a[a.length - 1];
      r.shiftKey && document.activeElement === l ? (r.preventDefault(), c.focus()) : !r.shiftKey && document.activeElement === c && (r.preventDefault(), l.focus());
    }), this.container.appendChild(s), { close: o };
  }
  // --- DOM Construction ---
  _buildSharedControls() {
    this.controlNewGameBtn = document.createElement("button"), this.controlNewGameBtn.className = "chess-btn chess-btn-primary", this.controlNewGameBtn.textContent = "New Game", this.controlNewGameBtn.disabled = !0, this.controlNewGameBtn.title = "Loading AI model…", this.controlNewGameBtn.onclick = () => this.showNewGameModal(), this.claimDrawBtn = document.createElement("button"), this.claimDrawBtn.className = "chess-btn chess-btn-accent", this.claimDrawBtn.textContent = "Claim Draw", this.claimDrawBtn.style.display = "none", this.claimDrawBtn.onclick = () => {
      var e;
      return (e = this.onClaimDraw) == null ? void 0 : e.call(this);
    }, this.gearBtn = document.createElement("button"), this.gearBtn.className = "chess-settings-btn", this.gearBtn.title = "Settings", this.gearBtn.setAttribute("aria-label", "Settings"), this.gearBtn.innerHTML = Bo, this.gearBtn.onclick = () => this.toggleSettingsPanel();
  }
  _buildSharedContent() {
    this.gameEndBanner = document.createElement("div"), this.gameEndBanner.className = "chess-game-end-banner chess-hidden", this.gameEndBannerText = document.createElement("span"), this.gameEndBannerText.className = "chess-game-end-banner-text", this.gameEndBanner.appendChild(this.gameEndBannerText);
    const e = document.createElement("button");
    if (e.className = "chess-btn chess-btn-primary chess-btn-sm", e.textContent = "New Game", e.disabled = !0, e.title = "Loading AI model…", e.onclick = () => this.showNewGameModal(), this.gameEndBannerBtn = e, this.gameEndBanner.appendChild(e), this.settingsPanel = document.createElement("div"), this.settingsPanel.className = "chess-settings-panel chess-hidden", this._buildSettingsPanel(), this.moveHistoryEl = document.createElement("div"), this.moveHistoryEl.className = "chess-move-history", this.moveListContainerId) {
      const n = document.getElementById(this.moveListContainerId);
      if (n) {
        const s = document.createElement("div");
        s.className = "chess-game-container ca-move-portal", s.appendChild(this.moveHistoryEl), n.appendChild(s), this.moveListPortalRoot = s;
      } else
        console.warn(
          `[chess-autocomplete] moveListContainerId: element #${this.moveListContainerId} not found — falling back to internal move list.`
        );
    }
  }
  buildDOM() {
    this.layoutMode === "board-only" ? this._buildDOMBoardOnly() : this._buildDOMSidebar();
  }
  _buildDOMSidebar() {
    const e = document.createElement("div");
    e.className = "chess-game-wrapper";
    const n = document.createElement("div");
    n.className = "chess-game-left", this.boardContainer = document.createElement("div"), this.boardContainer.className = "chess-board-container", n.appendChild(this.boardContainer), this._buildSharedControls();
    const s = document.createElement("div");
    s.className = "chess-control-panel", s.appendChild(this.controlNewGameBtn), s.appendChild(this.claimDrawBtn), n.appendChild(s), e.appendChild(n);
    const o = document.createElement("div");
    o.className = "chess-game-right";
    const i = document.createElement("div");
    i.className = "chess-status";
    const r = document.createElement("div");
    if (r.className = "chess-status-text", this.statusText = document.createElement("div"), this.modelLabel = document.createElement("div"), this.modelLabel.className = "chess-model-label", r.appendChild(this.statusText), r.appendChild(this.modelLabel), i.appendChild(r), i.appendChild(this.gearBtn), o.appendChild(i), this._isIOSSafari()) {
      const a = document.createElement("div");
      a.className = "chess-ios-warning", a.textContent = "iOS Safari detected — GPU acceleration is unavailable. Performance may be slower.", o.appendChild(a);
    }
    this._buildSharedContent(), o.appendChild(this.gameEndBanner), o.appendChild(this.settingsPanel), this.moveListPortalRoot || o.appendChild(this.moveHistoryEl), e.appendChild(o), this.container.appendChild(e);
  }
  _buildDOMBoardOnly() {
    const e = document.createElement("div");
    e.className = "chess-game-wrapper", this._buildSharedControls();
    const n = document.createElement("div");
    n.className = "chess-status";
    const s = document.createElement("div");
    s.className = "chess-status-text", this.statusText = document.createElement("div"), this.modelLabel = document.createElement("div"), this.modelLabel.className = "chess-model-label", s.appendChild(this.statusText), s.appendChild(this.modelLabel), n.appendChild(s), this.controlNewGameBtn.className = "chess-btn chess-btn-primary chess-btn-sm", n.appendChild(this.controlNewGameBtn), n.appendChild(this.claimDrawBtn), n.appendChild(this.gearBtn), e.appendChild(n), this.boardContainer = document.createElement("div"), this.boardContainer.className = "chess-board-container", e.appendChild(this.boardContainer), this._buildSharedContent(), e.insertBefore(this.gameEndBanner, this.boardContainer), e.appendChild(this.settingsPanel), this.moveListPortalRoot || e.appendChild(this.moveHistoryEl), this.container.appendChild(e);
  }
  // Create a settings section, append it to the panel, and return it so fields
  // can be added. Sections are separated by hairline dividers (no headers — the
  // fields are self-evident); pass a title only if a heading is wanted.
  _section(e) {
    const n = document.createElement("div");
    if (n.className = "chess-settings-section", e) {
      const s = document.createElement("div");
      s.className = "chess-settings-section-title", s.textContent = e, n.appendChild(s);
    }
    return this.settingsPanel.appendChild(n), n;
  }
  _buildSettingsPanel() {
    const e = this._section(), n = document.createElement("div");
    n.className = "chess-settings-field";
    const s = document.createElement("label");
    s.className = "chess-context-label", s.textContent = "Time control", n.appendChild(s), this.timeControlSeg = this._buildSegmented(
      [
        ["bullet", "Bullet"],
        ["blitz", "Blitz"],
        ["rapid", "Rapid"],
        ["classical", "Classical"],
        ["missing", "Any"]
      ],
      this.timeControl,
      (y) => {
        this.timeControl = y, this._emitMetadataSettings();
      }
    ), n.appendChild(this.timeControlSeg.el), e.appendChild(n), this.userEloControl = this._buildEloControl("Your Elo", this.userElo, (y) => {
      this.userElo = y, this._emitMetadataSettings();
    }), e.appendChild(this.userEloControl.el), this.modelEloControl = this._buildEloControl("Opponent Elo", this.modelElo, (y) => {
      this.modelElo = y, this._emitMetadataSettings();
    }), e.appendChild(this.modelEloControl.el);
    const o = this._section(), i = document.createElement("div");
    i.className = "chess-settings-field";
    const r = document.createElement("label"), a = document.createElement("span");
    a.className = "chess-settings-label-text", a.textContent = "Temperature", a.appendChild(this._buildInfo("Lower = more predictable, higher = more creative.")), this.temperatureValue = document.createElement("span"), this.temperatureValue.className = "chess-settings-value", this.temperatureValue.textContent = "1.0", r.append(a, this.temperatureValue), i.appendChild(r), this.temperatureSlider = document.createElement("input"), this.temperatureSlider.type = "range", this.temperatureSlider.min = "0", this.temperatureSlider.max = "2", this.temperatureSlider.step = "0.1", this.temperatureSlider.value = "1", this.temperatureSlider.oninput = () => {
      const y = parseFloat(this.temperatureSlider.value);
      this.temperatureValue.textContent = y.toFixed(1), this._emitSamplingParams();
    }, i.appendChild(this.temperatureSlider);
    const l = document.createElement("div");
    l.className = "chess-slider-range", l.innerHTML = "<span>0</span><span>2.0</span>", i.appendChild(l), o.appendChild(i);
    const c = document.createElement("div");
    c.className = "chess-settings-field";
    const d = document.createElement("label"), h = document.createElement("span");
    h.className = "chess-settings-label-text", h.textContent = "Top-K", h.appendChild(this._buildInfo("Number of candidate moves to sample from.")), this.topKValue = document.createElement("span"), this.topKValue.className = "chess-settings-value", this.topKValue.textContent = "1", d.append(h, this.topKValue), c.appendChild(d), this.topKSlider = document.createElement("input"), this.topKSlider.type = "range", this.topKSlider.min = "1", this.topKSlider.max = "20", this.topKSlider.step = "1", this.topKSlider.value = "1", this.topKSlider.oninput = () => {
      const y = parseInt(this.topKSlider.value);
      this.topKValue.textContent = String(y), this._emitSamplingParams();
    }, c.appendChild(this.topKSlider);
    const p = document.createElement("div");
    p.className = "chess-slider-range", p.innerHTML = "<span>1</span><span>20</span>", c.appendChild(p), o.appendChild(c);
    const m = document.createElement("div");
    m.className = "chess-settings-field chess-switch-field";
    const g = document.createElement("span");
    g.className = "chess-switch-text", g.textContent = "Show move probabilities";
    const f = document.createElement("label");
    f.className = "chess-switch", this.showProbsCheckbox = document.createElement("input"), this.showProbsCheckbox.type = "checkbox", this.showProbsCheckbox.onchange = () => {
      var y;
      (y = this.onShowProbabilitiesChanged) == null || y.call(this, this.showProbsCheckbox.checked);
    };
    const k = document.createElement("span");
    k.className = "chess-switch-track", f.append(this.showProbsCheckbox, k), m.append(g, f), o.appendChild(m), this.modelSection = this._section();
    const w = document.createElement("div");
    w.className = "chess-settings-field";
    const v = document.createElement("div");
    v.className = "chess-model-row", this.modelSelect = document.createElement("select"), v.appendChild(this.modelSelect), this.loadModelBtn = document.createElement("button"), this.loadModelBtn.className = "chess-btn chess-btn-primary chess-btn-sm", this.loadModelBtn.textContent = "Load", this.loadModelBtn.style.display = "none", this.loadModelBtn.onclick = () => {
      var y;
      return (y = this.onLoadModel) == null ? void 0 : y.call(this, this.modelSelect.value);
    }, v.appendChild(this.loadModelBtn), this.modelSelect.onchange = () => this._updateLoadBtnState(), w.appendChild(v), this.modelSection.appendChild(w), this._buildAppearanceField();
  }
  _buildAppearanceField() {
    this.appearanceField = this._section();
    const e = document.createElement("div");
    e.className = "chess-context-grid", this.themeModeSelect = this._buildThemeSelect(
      "Theme",
      [["auto", "Auto"], ["light", "Light"], ["dark", "Dark"]],
      () => {
        var n;
        return (n = this.onThemeModeChanged) == null ? void 0 : n.call(this, this.themeModeSelect.value);
      }
    ), e.appendChild(this.themeModeSelect.parentElement), this.pieceSetSelect = this._buildThemeSelect(
      "Pieces",
      [["cburnett", "Cburnett"], ["merida", "Merida"]],
      () => {
        var n;
        return (n = this.onPieceSetChanged) == null ? void 0 : n.call(this, this.pieceSetSelect.value);
      }
    ), e.appendChild(this.pieceSetSelect.parentElement), this.boardThemeSelect = this._buildThemeSelect(
      "Board",
      [["default", "Default"], ["brown", "Brown"], ["blue", "Blue"], ["green", "Green"]],
      () => {
        var n;
        return (n = this.onBoardThemeChanged) == null ? void 0 : n.call(this, this.boardThemeSelect.value);
      },
      !0
    ), e.appendChild(this.boardThemeSelect.parentElement), this.appearanceField.appendChild(e);
  }
  _buildThemeSelect(e, n, s, o = !1) {
    const i = document.createElement("div");
    i.className = "chess-context-control" + (o ? " chess-context-control-wide" : "");
    const r = document.createElement("label");
    r.textContent = e;
    const a = document.createElement("select");
    for (const [l, c] of n) {
      const d = document.createElement("option");
      d.value = l, d.textContent = c, a.appendChild(d);
    }
    return a.onchange = s, i.appendChild(r), i.appendChild(a), a;
  }
  setThemePicker(e, n) {
    this.appearanceField.style.display = e ? "" : "none", this.themeModeSelect.value = n.mode, this.boardThemeSelect.value = n.board, this.pieceSetSelect.value = n.pieces;
  }
  _emitSamplingParams() {
    var e;
    (e = this.onSamplingParamsChanged) == null || e.call(this, {
      temperature: parseFloat(this.temperatureSlider.value),
      topK: parseInt(this.topKSlider.value, 10)
    });
  }
  // Click-to-reveal info popover (also shows on hover for pointer users). Returns
  // the wrapper so it can be inlined next to a field label.
  _buildInfo(e) {
    const n = document.createElement("span");
    n.className = "chess-info";
    const s = document.createElement("button");
    s.type = "button", s.className = "chess-info-btn", s.setAttribute("aria-label", "More information"), s.setAttribute("aria-expanded", "false"), s.innerHTML = Ao;
    const o = document.createElement("span");
    o.className = "chess-info-pop", o.setAttribute("role", "tooltip"), o.textContent = e;
    const i = (l) => {
      n.contains(l.target) || a();
    }, r = (l) => {
      l.key === "Escape" && a();
    };
    function a() {
      n.classList.remove("chess-info-open"), s.setAttribute("aria-expanded", "false"), document.removeEventListener("click", i), document.removeEventListener("keydown", r);
    }
    return s.addEventListener("click", (l) => {
      l.stopPropagation();
      const c = n.classList.toggle("chess-info-open");
      s.setAttribute("aria-expanded", String(c)), c ? (document.addEventListener("click", i), document.addEventListener("keydown", r)) : (document.removeEventListener("click", i), document.removeEventListener("keydown", r));
    }), n.append(s, o), n;
  }
  // Segmented (radiogroup) control — a row of pill buttons, one active.
  _buildSegmented(e, n, s) {
    const o = document.createElement("div");
    o.className = "chess-segmented", o.setAttribute("role", "radiogroup");
    const i = /* @__PURE__ */ new Map(), r = (a) => {
      i.forEach((l, c) => {
        const d = c === a;
        l.classList.toggle("chess-segmented-on", d), l.setAttribute("aria-checked", String(d)), l.tabIndex = d ? 0 : -1;
      });
    };
    for (const [a, l] of e) {
      const c = document.createElement("button");
      c.type = "button", c.className = "chess-segmented-item", c.setAttribute("role", "radio"), c.textContent = l, c.onclick = () => {
        r(a), s(a);
      }, i.set(a, c), o.appendChild(c);
    }
    return r(n), { el: o, set: r };
  }
  // Elo control — a snap-to-bucket slider with a live value bubble plus an
  // "Unknown" checkbox that maps to the missing-rating metadata word.
  _buildEloControl(e, n, s) {
    const o = document.createElement("div");
    o.className = "chess-settings-field chess-elo-field";
    const i = document.createElement("label"), r = document.createElement("span");
    r.className = "chess-settings-label-text", r.textContent = e;
    const a = document.createElement("span");
    a.className = "chess-settings-value", i.append(r, a), o.appendChild(i);
    const l = document.createElement("input");
    l.type = "range", l.min = String(Ze), l.max = String(Ye), l.step = String(Je), l.value = String(De), o.appendChild(l);
    const c = document.createElement("div");
    c.className = "chess-slider-foot";
    const d = document.createElement("span");
    d.textContent = String(Ze);
    const h = document.createElement("span");
    h.textContent = String(Ye);
    const p = document.createElement("label");
    p.className = "chess-elo-unknown";
    const m = document.createElement("input");
    m.type = "checkbox", p.append(m, document.createTextNode("Unknown")), c.append(d, p, h), o.appendChild(c);
    const g = () => {
      const k = m.checked;
      l.disabled = k, o.classList.toggle("chess-elo-unknown-on", k), a.textContent = k ? "—" : l.value;
    };
    l.oninput = () => {
      a.textContent = l.value, s(Number(l.value));
    }, m.onchange = () => {
      g(), s(m.checked ? "missing" : Number(l.value));
    };
    const f = (k) => {
      k === "missing" ? m.checked = !0 : (m.checked = !1, l.value = String(Do(k))), g();
    };
    return f(n), { el: o, set: f };
  }
  _emitMetadataSettings() {
    var e;
    (e = this.onMetadataChanged) == null || e.call(this, {
      timeControl: this.timeControl,
      userElo: this.userElo,
      modelElo: this.modelElo
    });
  }
  _updateLoadBtnState() {
    this.loadModelBtn.style.display = this.modelSelect.value === this.currentModelPath ? "none" : "";
  }
  _isIOSSafari() {
    const e = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(e) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  }
}
class Oo {
  constructor(e, n = {}, s = []) {
    this.mql = null, this.mqlListener = null, this.container = e, this.roots = [e, ...s], this.mode = n.mode ?? "auto", this.board = n.board ?? "default", this.pieces = n.pieces ?? "cburnett", this.accent = n.accent;
  }
  /** Apply current theme and start tracking the system theme when in 'auto'. */
  apply() {
    this.applyResolvedMode(), this.applyBoard(), this.applyPieces(), this.applyAccent(), this.watchSystem();
  }
  getMode() {
    return this.mode;
  }
  getBoard() {
    return this.board;
  }
  getPieces() {
    return this.pieces;
  }
  setMode(e) {
    this.mode = e, this.applyResolvedMode(), this.watchSystem();
  }
  setBoard(e) {
    this.board = e, this.applyBoard();
  }
  setPieces(e) {
    this.pieces = e, this.applyPieces();
  }
  destroy() {
    this.mql && this.mqlListener && this.mql.removeEventListener("change", this.mqlListener), this.mql = null, this.mqlListener = null;
  }
  resolveMode() {
    return this.mode === "light" || this.mode === "dark" ? this.mode : typeof matchMedia == "function" && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyResolvedMode() {
    const e = this.resolveMode();
    for (const n of this.roots)
      n.dataset.caTheme = e;
  }
  applyBoard() {
    this.container.classList.remove("ca-board-brown", "ca-board-blue", "ca-board-green"), this.board !== "default" && this.container.classList.add(`ca-board-${this.board}`);
  }
  applyPieces() {
    this.container.classList.remove("ca-pieces-cburnett", "ca-pieces-merida"), this.pieces !== "cburnett" && this.container.classList.add(`ca-pieces-${this.pieces}`);
  }
  applyAccent() {
    if (this.accent)
      for (const e of this.roots)
        e.style.setProperty("--ca-accent", this.accent);
  }
  watchSystem() {
    this.mode === "auto" && !this.mql && typeof matchMedia == "function" && (this.mql = matchMedia("(prefers-color-scheme: dark)"), this.mqlListener = () => {
      this.mode === "auto" && this.applyResolvedMode();
    }, this.mql.addEventListener("change", this.mqlListener));
  }
}
const Io = [32774, 32768, 32769, 32770, 32771, 32772, 32773, 16385, 16393, 16392, 16386, 16402, 16400, 16387, 16411, 16408, 16388, 16420, 16416, 16389, 16429, 16424, 16390, 16438, 16432, 16391, 16447, 16440, 20481, 20489, 20488, 12289, 12296, 12290, 12304, 12291, 12312, 12292, 12320, 12293, 12328, 12294, 12336, 12295, 12344, 8201, 8210, 8219, 8228, 8237, 8246, 8255, 4106, 4113, 16450, 16458, 16457, 16456, 16448, 16451, 16467, 16465, 16452, 16476, 16473, 16453, 16485, 16481, 16454, 16494, 16489, 16455, 16503, 16497, 16505, 20546, 20554, 20553, 20552, 20544, 12354, 12361, 12352, 12355, 12369, 12356, 12377, 12357, 12385, 12358, 12393, 12359, 12401, 12409, 8266, 8264, 8275, 8284, 8293, 8302, 8311, 4171, 4178, 4176, 16515, 16523, 16522, 16521, 16513, 16516, 16532, 16530, 16528, 16512, 16517, 16541, 16538, 16518, 16550, 16546, 16519, 16559, 16554, 16562, 16570, 20611, 20619, 20618, 20617, 20609, 12419, 12426, 12417, 12420, 12434, 12416, 12421, 12442, 12422, 12450, 12423, 12458, 12466, 12474, 8331, 8329, 8340, 8336, 8349, 8358, 8367, 4236, 4243, 4241, 4232, 16580, 16588, 16587, 16586, 16578, 16581, 16597, 16595, 16593, 16577, 16582, 16606, 16603, 16600, 16576, 16583, 16615, 16611, 16619, 16627, 16635, 20676, 20684, 20683, 20682, 20674, 12484, 12491, 12482, 12485, 12499, 12481, 12486, 12507, 12480, 12487, 12515, 12523, 12531, 12539, 8396, 8394, 8405, 8401, 8414, 8408, 8423, 4301, 4308, 4306, 4297, 16645, 16653, 16652, 16651, 16643, 16646, 16662, 16660, 16658, 16642, 16647, 16671, 16668, 16665, 16641, 16676, 16672, 16640, 16684, 16692, 16700, 20741, 20749, 20748, 20747, 20739, 12549, 12556, 12547, 12550, 12564, 12546, 12551, 12572, 12545, 12580, 12544, 12588, 12596, 12604, 8461, 8459, 8470, 8466, 8479, 8473, 8480, 4366, 4373, 4371, 4362, 16710, 16718, 16717, 16716, 16708, 16711, 16727, 16725, 16723, 16707, 16733, 16730, 16706, 16741, 16737, 16705, 16749, 16744, 16704, 16757, 16765, 20806, 20814, 20813, 20812, 20804, 12614, 12621, 12612, 12615, 12629, 12611, 12637, 12610, 12645, 12609, 12653, 12608, 12661, 12669, 8526, 8524, 8535, 8531, 8538, 8545, 8552, 4431, 4438, 4436, 4427, 16775, 16783, 16782, 16781, 16773, 16790, 16788, 16772, 16798, 16795, 16771, 16806, 16802, 16770, 16814, 16809, 16769, 16822, 16816, 16768, 16830, 20871, 20879, 20878, 20877, 20869, 12679, 12686, 12677, 12694, 12676, 12702, 12675, 12710, 12674, 12718, 12673, 12726, 12672, 12734, 8591, 8589, 8596, 8603, 8610, 8617, 8624, 4503, 4501, 4492, 16847, 16846, 16838, 16855, 16853, 16837, 16863, 16860, 16836, 16871, 16867, 16835, 16879, 16874, 16834, 16887, 16881, 16833, 16895, 16888, 16832, 20943, 20942, 20934, 12751, 12742, 12759, 12741, 12767, 12740, 12775, 12739, 12783, 12738, 12791, 12737, 12799, 12736, 8654, 8661, 8668, 8675, 8682, 8689, 8696, 4566, 4557, 16905, 16913, 16912, 16896, 16897, 16906, 16922, 16920, 16907, 16931, 16928, 16908, 16940, 16936, 16909, 16949, 16944, 16910, 16958, 16952, 16911, 21001, 21009, 21008, 20992, 20993, 12809, 12816, 12800, 12810, 12824, 12811, 12832, 12812, 12840, 12813, 12848, 12814, 12856, 12815, 8721, 8705, 8730, 8739, 8748, 8757, 8766, 4626, 4633, 4610, 16970, 16978, 16977, 16976, 16968, 16960, 16961, 16962, 16971, 16987, 16985, 16972, 16996, 16993, 16973, 17005, 17001, 16974, 17014, 17009, 16975, 17023, 17017, 21066, 21074, 21073, 21072, 21064, 21056, 21057, 21058, 12874, 12881, 12872, 12865, 12875, 12889, 12876, 12897, 12877, 12905, 12878, 12913, 12879, 12921, 8786, 8784, 8768, 8770, 8795, 8804, 8813, 8822, 8831, 4691, 4698, 4696, 4675, 17035, 17043, 17042, 17041, 17033, 17025, 17026, 17027, 17036, 17052, 17050, 17048, 17032, 17037, 17061, 17058, 17038, 17070, 17066, 17039, 17079, 17074, 17082, 21131, 21139, 21138, 21137, 21129, 21121, 21122, 21123, 12939, 12946, 12937, 12930, 12940, 12954, 12936, 12941, 12962, 12942, 12970, 12943, 12978, 12986, 8851, 8849, 8833, 8835, 8860, 8856, 8869, 8878, 8887, 4756, 4763, 4761, 4752, 4736, 4740, 17100, 17108, 17107, 17106, 17098, 17090, 17091, 17092, 17101, 17117, 17115, 17113, 17097, 17102, 17126, 17123, 17120, 17096, 17103, 17135, 17131, 17139, 17147, 21196, 21204, 21203, 21202, 21194, 21186, 21187, 21188, 13004, 13011, 13002, 12995, 13005, 13019, 13001, 13006, 13027, 13e3, 13007, 13035, 13043, 13051, 8916, 8914, 8898, 8900, 8925, 8921, 8934, 8928, 8943, 4821, 4828, 4826, 4817, 4801, 4805, 17165, 17173, 17172, 17171, 17163, 17155, 17156, 17157, 17166, 17182, 17180, 17178, 17162, 17167, 17191, 17188, 17185, 17161, 17196, 17192, 17160, 17204, 17212, 21261, 21269, 21268, 21267, 21259, 21251, 21252, 21253, 13069, 13076, 13067, 13060, 13070, 13084, 13066, 13071, 13092, 13065, 13100, 13064, 13108, 13116, 8981, 8979, 8963, 8965, 8990, 8986, 8999, 8993, 9e3, 4886, 4893, 4891, 4882, 4866, 4870, 17230, 17238, 17237, 17236, 17228, 17220, 17221, 17222, 17231, 17247, 17245, 17243, 17227, 17253, 17250, 17226, 17261, 17257, 17225, 17269, 17264, 17224, 17277, 21326, 21334, 21333, 21332, 21324, 21316, 21317, 21318, 13134, 13141, 13132, 13125, 13135, 13149, 13131, 13157, 13130, 13165, 13129, 13173, 13128, 13181, 9046, 9044, 9028, 9030, 9055, 9051, 9058, 9065, 9072, 4951, 4958, 4956, 4947, 4931, 4935, 17295, 17303, 17302, 17301, 17293, 17285, 17286, 17287, 17310, 17308, 17292, 17318, 17315, 17291, 17326, 17322, 17290, 17334, 17329, 17289, 17342, 17336, 17288, 21391, 21399, 21398, 21397, 21389, 21381, 21382, 21383, 13199, 13206, 13197, 13190, 13214, 13196, 13222, 13195, 13230, 13194, 13238, 13193, 13246, 13192, 9111, 9109, 9093, 9095, 9116, 9123, 9130, 9137, 9144, 5023, 5021, 5012, 4996, 17367, 17366, 17358, 17350, 17351, 17375, 17373, 17357, 17383, 17380, 17356, 17391, 17387, 17355, 17399, 17394, 17354, 17407, 17401, 17353, 17352, 21463, 21462, 21454, 21446, 21447, 13271, 13262, 13255, 13279, 13261, 13287, 13260, 13295, 13259, 13303, 13258, 13311, 13257, 13256, 9174, 9158, 9181, 9188, 9195, 9202, 9209, 5086, 5077, 5061, 17425, 17433, 17432, 17416, 17417, 17426, 17442, 17440, 17408, 17410, 17427, 17451, 17448, 17428, 17460, 17456, 17429, 17469, 17464, 17430, 17431, 21521, 21529, 21528, 21512, 21513, 13329, 13336, 13320, 13330, 13344, 13312, 13331, 13352, 13332, 13360, 13333, 13368, 13334, 13335, 9241, 9225, 9250, 9218, 9259, 9268, 9277, 5146, 5153, 5121, 5130, 17490, 17498, 17497, 17496, 17488, 17480, 17481, 17482, 17491, 17507, 17505, 17473, 17475, 17492, 17516, 17513, 17493, 17525, 17521, 17494, 17534, 17529, 17495, 21586, 21594, 21593, 21592, 21584, 21576, 21577, 21578, 13394, 13401, 13392, 13385, 13395, 13409, 13377, 13396, 13417, 13397, 13425, 13398, 13433, 13399, 9306, 9304, 9288, 9290, 9315, 9283, 9324, 9333, 9342, 5211, 5218, 5216, 5184, 5186, 5195, 17555, 17563, 17562, 17561, 17553, 17545, 17546, 17547, 17556, 17572, 17570, 17568, 17552, 17536, 17538, 17540, 17557, 17581, 17578, 17558, 17590, 17586, 17559, 17599, 17594, 21651, 21659, 21658, 21657, 21649, 21641, 21642, 21643, 13459, 13466, 13457, 13450, 13460, 13474, 13456, 13442, 13461, 13482, 13462, 13490, 13463, 13498, 9371, 9369, 9353, 9355, 9380, 9376, 9344, 9348, 9389, 9398, 9407, 5276, 5283, 5281, 5272, 5256, 5249, 5251, 5260, 17620, 17628, 17627, 17626, 17618, 17610, 17611, 17612, 17621, 17637, 17635, 17633, 17617, 17601, 17603, 17605, 17622, 17646, 17643, 17640, 17616, 17623, 17655, 17651, 17659, 21716, 21724, 21723, 21722, 21714, 21706, 21707, 21708, 13524, 13531, 13522, 13515, 13525, 13539, 13521, 13507, 13526, 13547, 13520, 13527, 13555, 13563, 9436, 9434, 9418, 9420, 9445, 9441, 9409, 9413, 9454, 9448, 9463, 5341, 5348, 5346, 5337, 5321, 5314, 5316, 5325, 17685, 17693, 17692, 17691, 17683, 17675, 17676, 17677, 17686, 17702, 17700, 17698, 17682, 17666, 17668, 17670, 17687, 17711, 17708, 17705, 17681, 17716, 17712, 17680, 17724, 21781, 21789, 21788, 21787, 21779, 21771, 21772, 21773, 13589, 13596, 13587, 13580, 13590, 13604, 13586, 13572, 13591, 13612, 13585, 13620, 13584, 13628, 9501, 9499, 9483, 9485, 9510, 9506, 9474, 9478, 9519, 9513, 9520, 5406, 5413, 5411, 5402, 5386, 5379, 5381, 5390, 17750, 17758, 17757, 17756, 17748, 17740, 17741, 17742, 17751, 17767, 17765, 17763, 17747, 17731, 17733, 17735, 17773, 17770, 17746, 17781, 17777, 17745, 17789, 17784, 17744, 21846, 21854, 21853, 21852, 21844, 21836, 21837, 21838, 13654, 13661, 13652, 13645, 13655, 13669, 13651, 13637, 13677, 13650, 13685, 13649, 13693, 13648, 9566, 9564, 9548, 9550, 9575, 9571, 9539, 9543, 9578, 9585, 9592, 5471, 5478, 5476, 5467, 5451, 5444, 5446, 5455, 17815, 17823, 17822, 17821, 17813, 17805, 17806, 17807, 17830, 17828, 17812, 17796, 17798, 17838, 17835, 17811, 17846, 17842, 17810, 17854, 17849, 17809, 17808, 21911, 21919, 21918, 21917, 21909, 21901, 21902, 21903, 13719, 13726, 13717, 13710, 13734, 13716, 13702, 13742, 13715, 13750, 13714, 13758, 13713, 13712, 9631, 9629, 9613, 9615, 9636, 9604, 9643, 9650, 9657, 5543, 5541, 5532, 5516, 5509, 5511, 17887, 17886, 17878, 17870, 17871, 17895, 17893, 17877, 17861, 17863, 17903, 17900, 17876, 17911, 17907, 17875, 17919, 17914, 17874, 17873, 17872, 21983, 21982, 21974, 21966, 21967, 13791, 13782, 13775, 13799, 13781, 13767, 13807, 13780, 13815, 13779, 13823, 13778, 13777, 13776, 9694, 9678, 9701, 9669, 9708, 9715, 9722, 5606, 5597, 5581, 5574, 17945, 17953, 17952, 17936, 17937, 17946, 17962, 17960, 17928, 17930, 17947, 17971, 17968, 17920, 17923, 17948, 17980, 17976, 17949, 17950, 17951, 22041, 22049, 22048, 22032, 22033, 13849, 13856, 13840, 13850, 13864, 13832, 13851, 13872, 13824, 13852, 13880, 13853, 13854, 13855, 9761, 9745, 9770, 9738, 9779, 9731, 9788, 5666, 5673, 5641, 5650, 18010, 18018, 18017, 18016, 18008, 18e3, 18001, 18002, 18011, 18027, 18025, 17993, 17995, 18012, 18036, 18033, 17985, 17988, 18013, 18045, 18041, 18014, 18015, 22106, 22114, 22113, 22112, 22104, 22096, 22097, 22098, 13914, 13921, 13912, 13905, 13915, 13929, 13897, 13916, 13937, 13889, 13917, 13945, 13918, 13919, 9826, 9824, 9808, 9810, 9835, 9803, 9844, 9796, 9853, 5731, 5738, 5736, 5704, 5706, 5715, 18075, 18083, 18082, 18081, 18073, 18065, 18066, 18067, 18076, 18092, 18090, 18088, 18072, 18056, 18058, 18060, 18077, 18101, 18098, 18050, 18053, 18078, 18110, 18106, 18079, 22171, 22179, 22178, 22177, 22169, 22161, 22162, 22163, 13979, 13986, 13977, 13970, 13980, 13994, 13976, 13962, 13981, 14002, 13954, 13982, 14010, 13983, 9891, 9889, 9873, 9875, 9900, 9896, 9864, 9868, 9909, 9861, 9918, 5796, 5803, 5801, 5792, 5776, 5769, 5771, 5780, 18140, 18148, 18147, 18146, 18138, 18130, 18131, 18132, 18141, 18157, 18155, 18153, 18137, 18121, 18123, 18125, 18142, 18166, 18163, 18160, 18136, 18112, 18115, 18118, 18143, 18175, 18171, 22236, 22244, 22243, 22242, 22234, 22226, 22227, 22228, 14044, 14051, 14042, 14035, 14045, 14059, 14041, 14027, 14046, 14067, 14040, 14019, 14047, 14075, 9956, 9954, 9938, 9940, 9965, 9961, 9929, 9933, 9974, 9968, 9920, 9926, 9983, 5861, 5868, 5866, 5857, 5841, 5834, 5836, 5845, 18205, 18213, 18212, 18211, 18203, 18195, 18196, 18197, 18206, 18222, 18220, 18218, 18202, 18186, 18188, 18190, 18207, 18231, 18228, 18225, 18201, 18177, 18180, 18183, 18236, 18232, 18200, 22301, 22309, 22308, 22307, 22299, 22291, 22292, 22293, 14109, 14116, 14107, 14100, 14110, 14124, 14106, 14092, 14111, 14132, 14105, 14084, 14140, 14104, 10021, 10019, 10003, 10005, 10030, 10026, 9994, 9998, 10039, 10033, 9985, 9991, 10040, 5926, 5933, 5931, 5922, 5906, 5899, 5901, 5910, 18270, 18278, 18277, 18276, 18268, 18260, 18261, 18262, 18271, 18287, 18285, 18283, 18267, 18251, 18253, 18255, 18293, 18290, 18266, 18242, 18245, 18301, 18297, 18265, 18264, 22366, 22374, 22373, 22372, 22364, 22356, 22357, 22358, 14174, 14181, 14172, 14165, 14175, 14189, 14171, 14157, 14197, 14170, 14149, 14205, 14169, 14168, 10086, 10084, 10068, 10070, 10095, 10091, 10059, 10063, 10098, 10050, 10105, 5991, 5998, 5996, 5987, 5971, 5964, 5966, 5975, 18335, 18343, 18342, 18341, 18333, 18325, 18326, 18327, 18350, 18348, 18332, 18316, 18318, 18358, 18355, 18331, 18307, 18310, 18366, 18362, 18330, 18329, 18328, 22431, 22439, 22438, 22437, 22429, 22421, 22422, 22423, 14239, 14246, 14237, 14230, 14254, 14236, 14222, 14262, 14235, 14214, 14270, 14234, 14233, 14232, 10151, 10149, 10133, 10135, 10156, 10124, 10163, 10115, 10170, 6063, 6061, 6052, 6036, 6029, 6031, 18407, 18406, 18398, 18390, 18391, 18415, 18413, 18397, 18381, 18383, 18423, 18420, 18396, 18372, 18375, 18431, 18427, 18395, 18394, 18393, 18392, 22503, 22502, 22494, 22486, 22487, 14311, 14302, 14295, 14319, 14301, 14287, 14327, 14300, 14279, 14335, 14299, 14298, 14297, 14296, 10214, 10198, 10221, 10189, 10228, 10180, 10235, 6126, 6117, 6101, 6094, 18465, 18473, 18472, 18456, 18457, 18466, 18482, 18480, 18448, 18450, 18467, 18491, 18488, 18440, 18443, 18468, 18432, 18436, 18469, 18470, 18471, 22561, 22569, 22568, 22552, 22553, 14369, 14376, 14360, 14370, 14384, 14352, 14371, 14392, 14344, 14372, 14336, 14373, 14374, 14375, 10281, 10265, 10290, 10258, 10299, 10251, 10244, 6186, 6193, 6161, 6170, 18530, 18538, 18537, 18536, 18528, 18520, 18521, 18522, 18531, 18547, 18545, 18513, 18515, 18532, 18556, 18553, 18505, 18508, 18533, 18497, 18501, 18534, 18535, 22626, 22634, 22633, 22632, 22624, 22616, 22617, 22618, 14434, 14441, 14432, 14425, 14435, 14449, 14417, 14436, 14457, 14409, 14437, 14401, 14438, 14439, 10346, 10344, 10328, 10330, 10355, 10323, 10364, 10316, 10309, 6251, 6258, 6256, 6224, 6226, 6235, 18595, 18603, 18602, 18601, 18593, 18585, 18586, 18587, 18596, 18612, 18610, 18608, 18592, 18576, 18578, 18580, 18597, 18621, 18618, 18570, 18573, 18598, 18562, 18566, 18599, 22691, 22699, 22698, 22697, 22689, 22681, 22682, 22683, 14499, 14506, 14497, 14490, 14500, 14514, 14496, 14482, 14501, 14522, 14474, 14502, 14466, 14503, 10411, 10409, 10393, 10395, 10420, 10416, 10384, 10388, 10429, 10381, 10374, 6316, 6323, 6321, 6312, 6296, 6289, 6291, 6300, 18660, 18668, 18667, 18666, 18658, 18650, 18651, 18652, 18661, 18677, 18675, 18673, 18657, 18641, 18643, 18645, 18662, 18686, 18683, 18680, 18656, 18632, 18635, 18638, 18663, 18627, 18631, 22756, 22764, 22763, 22762, 22754, 22746, 22747, 22748, 14564, 14571, 14562, 14555, 14565, 14579, 14561, 14547, 14566, 14587, 14560, 14539, 14567, 14531, 10476, 10474, 10458, 10460, 10485, 10481, 10449, 10453, 10494, 10488, 10440, 10446, 10439, 6381, 6388, 6386, 6377, 6361, 6354, 6356, 6365, 18725, 18733, 18732, 18731, 18723, 18715, 18716, 18717, 18726, 18742, 18740, 18738, 18722, 18706, 18708, 18710, 18727, 18751, 18748, 18745, 18721, 18697, 18700, 18703, 18720, 18688, 18692, 22821, 22829, 22828, 22827, 22819, 22811, 22812, 22813, 14629, 14636, 14627, 14620, 14630, 14644, 14626, 14612, 14631, 14652, 14625, 14604, 14624, 14596, 10541, 10539, 10523, 10525, 10550, 10546, 10514, 10518, 10559, 10553, 10505, 10511, 10496, 6446, 6453, 6451, 6442, 6426, 6419, 6421, 6430, 18790, 18798, 18797, 18796, 18788, 18780, 18781, 18782, 18791, 18807, 18805, 18803, 18787, 18771, 18773, 18775, 18813, 18810, 18786, 18762, 18765, 18785, 18753, 18757, 18784, 22886, 22894, 22893, 22892, 22884, 22876, 22877, 22878, 14694, 14701, 14692, 14685, 14695, 14709, 14691, 14677, 14717, 14690, 14669, 14689, 14661, 14688, 10606, 10604, 10588, 10590, 10615, 10611, 10579, 10583, 10618, 10570, 10561, 6511, 6518, 6516, 6507, 6491, 6484, 6486, 6495, 18855, 18863, 18862, 18861, 18853, 18845, 18846, 18847, 18870, 18868, 18852, 18836, 18838, 18878, 18875, 18851, 18827, 18830, 18850, 18818, 18822, 18849, 18848, 22951, 22959, 22958, 22957, 22949, 22941, 22942, 22943, 14759, 14766, 14757, 14750, 14774, 14756, 14742, 14782, 14755, 14734, 14754, 14726, 14753, 14752, 10671, 10669, 10653, 10655, 10676, 10644, 10683, 10635, 10626, 6583, 6581, 6572, 6556, 6549, 6551, 18927, 18926, 18918, 18910, 18911, 18935, 18933, 18917, 18901, 18903, 18943, 18940, 18916, 18892, 18895, 18915, 18883, 18887, 18914, 18913, 18912, 23023, 23022, 23014, 23006, 23007, 14831, 14822, 14815, 14839, 14821, 14807, 14847, 14820, 14799, 14819, 14791, 14818, 14817, 14816, 10734, 10718, 10741, 10709, 10748, 10700, 10691, 6646, 6637, 6621, 6614, 18985, 18993, 18992, 18976, 18977, 18986, 19002, 19e3, 18968, 18970, 18987, 18960, 18963, 18988, 18952, 18956, 18989, 18944, 18949, 18990, 18991, 23081, 23089, 23088, 23072, 23073, 14889, 14896, 14880, 14890, 14904, 14872, 14891, 14864, 14892, 14856, 14893, 14848, 14894, 14895, 10801, 10785, 10810, 10778, 10771, 10764, 10757, 6706, 6713, 6681, 6690, 19050, 19058, 19057, 19056, 19048, 19040, 19041, 19042, 19051, 19067, 19065, 19033, 19035, 19052, 19025, 19028, 19053, 19017, 19021, 19054, 19009, 19014, 19055, 23146, 23154, 23153, 23152, 23144, 23136, 23137, 23138, 14954, 14961, 14952, 14945, 14955, 14969, 14937, 14956, 14929, 14957, 14921, 14958, 14913, 14959, 10866, 10864, 10848, 10850, 10875, 10843, 10836, 10829, 10822, 6771, 6778, 6776, 6744, 6746, 6755, 19115, 19123, 19122, 19121, 19113, 19105, 19106, 19107, 19116, 19132, 19130, 19128, 19112, 19096, 19098, 19100, 19117, 19090, 19093, 19118, 19082, 19086, 19119, 19074, 19079, 23211, 23219, 23218, 23217, 23209, 23201, 23202, 23203, 15019, 15026, 15017, 15010, 15020, 15034, 15016, 15002, 15021, 14994, 15022, 14986, 15023, 14978, 10931, 10929, 10913, 10915, 10940, 10936, 10904, 10908, 10901, 10894, 10887, 6836, 6843, 6841, 6832, 6816, 6809, 6811, 6820, 19180, 19188, 19187, 19186, 19178, 19170, 19171, 19172, 19181, 19197, 19195, 19193, 19177, 19161, 19163, 19165, 19182, 19176, 19152, 19155, 19158, 19183, 19147, 19151, 19139, 23276, 23284, 23283, 23282, 23274, 23266, 23267, 23268, 15084, 15091, 15082, 15075, 15085, 15099, 15081, 15067, 15086, 15080, 15059, 15087, 15051, 15043, 10996, 10994, 10978, 10980, 11005, 11001, 10969, 10973, 10960, 10966, 10959, 6901, 6908, 6906, 6897, 6881, 6874, 6876, 6885, 19245, 19253, 19252, 19251, 19243, 19235, 19236, 19237, 19246, 19262, 19260, 19258, 19242, 19226, 19228, 19230, 19247, 19241, 19217, 19220, 19223, 19240, 19208, 19212, 19204, 23341, 23349, 23348, 23347, 23339, 23331, 23332, 23333, 15149, 15156, 15147, 15140, 15150, 15164, 15146, 15132, 15151, 15145, 15124, 15144, 15116, 15108, 11061, 11059, 11043, 11045, 11070, 11066, 11034, 11038, 11025, 11031, 11016, 6966, 6973, 6971, 6962, 6946, 6939, 6941, 6950, 19310, 19318, 19317, 19316, 19308, 19300, 19301, 19302, 19311, 19327, 19325, 19323, 19307, 19291, 19293, 19295, 19306, 19282, 19285, 19305, 19273, 19277, 19304, 19264, 19269, 23406, 23414, 23413, 23412, 23404, 23396, 23397, 23398, 15214, 15221, 15212, 15205, 15215, 15229, 15211, 15197, 15210, 15189, 15209, 15181, 15208, 15173, 11126, 11124, 11108, 11110, 11135, 11131, 11099, 11103, 11090, 11081, 11072, 7031, 7038, 7036, 7027, 7011, 7004, 7006, 7015, 19375, 19383, 19382, 19381, 19373, 19365, 19366, 19367, 19390, 19388, 19372, 19356, 19358, 19371, 19347, 19350, 19370, 19338, 19342, 19369, 19329, 19334, 19368, 23471, 23479, 23478, 23477, 23469, 23461, 23462, 23463, 15279, 15286, 15277, 15270, 15294, 15276, 15262, 15275, 15254, 15274, 15246, 15273, 15238, 15272, 11191, 11189, 11173, 11175, 11196, 11164, 11155, 11146, 11137, 7103, 7101, 7092, 7076, 7069, 7071, 19447, 19446, 19438, 19430, 19431, 19455, 19453, 19437, 19421, 19423, 19436, 19412, 19415, 19435, 19403, 19407, 19434, 19394, 19399, 19433, 19432, 23543, 23542, 23534, 23526, 23527, 15351, 15342, 15335, 15359, 15341, 15327, 15340, 15319, 15339, 15311, 15338, 15303, 15337, 15336, 11254, 11238, 11261, 11229, 11220, 11211, 11202, 7166, 7157, 7141, 7134, 19505, 19513, 19512, 19496, 19497, 19506, 19488, 19490, 19507, 19480, 19483, 19508, 19472, 19476, 19509, 19464, 19469, 19510, 19456, 19462, 19511, 23601, 23609, 23608, 23592, 23593, 15409, 15416, 15400, 15410, 15392, 15411, 15384, 15412, 15376, 15413, 15368, 15414, 15360, 15415, 11321, 11305, 11298, 11291, 11284, 11277, 11270, 7226, 7201, 7210, 19570, 19578, 19577, 19576, 19568, 19560, 19561, 19562, 19571, 19553, 19555, 19572, 19545, 19548, 19573, 19537, 19541, 19574, 19529, 19534, 19575, 19521, 19527, 23666, 23674, 23673, 23672, 23664, 23656, 23657, 23658, 15474, 15481, 15472, 15465, 15475, 15457, 15476, 15449, 15477, 15441, 15478, 15433, 15479, 15425, 11386, 11384, 11368, 11370, 11363, 11356, 11349, 11342, 11335, 7291, 7264, 7266, 7275, 19635, 19643, 19642, 19641, 19633, 19625, 19626, 19627, 19636, 19632, 19616, 19618, 19620, 19637, 19610, 19613, 19638, 19602, 19606, 19639, 19594, 19599, 19586, 23731, 23739, 23738, 23737, 23729, 23721, 23722, 23723, 15539, 15546, 15537, 15530, 15540, 15536, 15522, 15541, 15514, 15542, 15506, 15543, 15498, 15490, 11451, 11449, 11433, 11435, 11424, 11428, 11421, 11414, 11407, 7356, 7352, 7336, 7329, 7331, 7340, 19700, 19708, 19707, 19706, 19698, 19690, 19691, 19692, 19701, 19697, 19681, 19683, 19685, 19702, 19696, 19672, 19675, 19678, 19703, 19667, 19671, 19659, 19651, 23796, 23804, 23803, 23802, 23794, 23786, 23787, 23788, 15604, 15611, 15602, 15595, 15605, 15601, 15587, 15606, 15600, 15579, 15607, 15571, 15563, 15555, 11516, 11514, 11498, 11500, 11489, 11493, 11480, 11486, 11479, 7421, 7417, 7401, 7394, 7396, 7405, 19765, 19773, 19772, 19771, 19763, 19755, 19756, 19757, 19766, 19762, 19746, 19748, 19750, 19767, 19761, 19737, 19740, 19743, 19760, 19728, 19732, 19724, 19716, 23861, 23869, 23868, 23867, 23859, 23851, 23852, 23853, 15669, 15676, 15667, 15660, 15670, 15666, 15652, 15671, 15665, 15644, 15664, 15636, 15628, 15620, 11581, 11579, 11563, 11565, 11554, 11558, 11545, 11551, 11536, 7486, 7482, 7466, 7459, 7461, 7470, 19830, 19838, 19837, 19836, 19828, 19820, 19821, 19822, 19831, 19827, 19811, 19813, 19815, 19826, 19802, 19805, 19825, 19793, 19797, 19824, 19784, 19789, 19781, 23926, 23934, 23933, 23932, 23924, 23916, 23917, 23918, 15734, 15741, 15732, 15725, 15735, 15731, 15717, 15730, 15709, 15729, 15701, 15728, 15693, 15685, 11646, 11644, 11628, 11630, 11619, 11623, 11610, 11601, 11592, 7551, 7547, 7531, 7524, 7526, 7535, 19895, 19903, 19902, 19901, 19893, 19885, 19886, 19887, 19892, 19876, 19878, 19891, 19867, 19870, 19890, 19858, 19862, 19889, 19849, 19854, 19888, 19840, 19846, 23991, 23999, 23998, 23997, 23989, 23981, 23982, 23983, 15799, 15806, 15797, 15790, 15796, 15782, 15795, 15774, 15794, 15766, 15793, 15758, 15792, 15750, 11711, 11709, 11693, 11695, 11684, 11675, 11666, 11657, 11648, 7612, 7596, 7589, 7591, 19967, 19966, 19958, 19950, 19951, 19957, 19941, 19943, 19956, 19932, 19935, 19955, 19923, 19927, 19954, 19914, 19919, 19953, 19905, 19911, 19952, 24063, 24062, 24054, 24046, 24047, 15871, 15862, 15855, 15861, 15847, 15860, 15839, 15859, 15831, 15858, 15823, 15857, 15815, 15856, 11774, 11758, 11749, 11740, 11731, 11722, 11713, 7677, 7661, 7654, 20025, 20016, 20017, 20026, 20008, 20010, 20027, 2e4, 20003, 20028, 19992, 19996, 20029, 19984, 19989, 20030, 19976, 19982, 20031, 19968, 19975, 24121, 24112, 24113, 15929, 15920, 15930, 15912, 15931, 15904, 15932, 15896, 15933, 15888, 15934, 15880, 15935, 15872, 11825, 11818, 11811, 11804, 11797, 11790, 11783, 7721, 7730, 20090, 20088, 20080, 20081, 20082, 20091, 20073, 20075, 20092, 20065, 20068, 20093, 20057, 20061, 20094, 20049, 20054, 20095, 20041, 20047, 20033, 24186, 24184, 24176, 24177, 24178, 15994, 15992, 15985, 15995, 15977, 15996, 15969, 15997, 15961, 15998, 15953, 15999, 15945, 15937, 11888, 11890, 11883, 11876, 11869, 11862, 11855, 7784, 7786, 7795, 20155, 20153, 20145, 20146, 20147, 20156, 20152, 20136, 20138, 20140, 20157, 20130, 20133, 20158, 20122, 20126, 20159, 20114, 20119, 20106, 20098, 24251, 24249, 24241, 24242, 24243, 16059, 16057, 16050, 16060, 16056, 16042, 16061, 16034, 16062, 16026, 16063, 16018, 16010, 16002, 11953, 11955, 11944, 11948, 11941, 11934, 11927, 7856, 7849, 7851, 7860, 20220, 20218, 20210, 20211, 20212, 20221, 20217, 20201, 20203, 20205, 20222, 20216, 20192, 20195, 20198, 20223, 20187, 20191, 20179, 20171, 20163, 24316, 24314, 24306, 24307, 24308, 16124, 16122, 16115, 16125, 16121, 16107, 16126, 16120, 16099, 16127, 16091, 16083, 16075, 16067, 12018, 12020, 12009, 12013, 12e3, 12006, 11999, 7921, 7914, 7916, 7925, 20285, 20283, 20275, 20276, 20277, 20286, 20282, 20266, 20268, 20270, 20287, 20281, 20257, 20260, 20263, 20280, 20248, 20252, 20244, 20236, 20228, 24381, 24379, 24371, 24372, 24373, 16189, 16187, 16180, 16190, 16186, 16172, 16191, 16185, 16164, 16184, 16156, 16148, 16140, 16132, 12083, 12085, 12074, 12078, 12065, 12071, 12056, 7986, 7979, 7981, 7990, 20350, 20348, 20340, 20341, 20342, 20351, 20347, 20331, 20333, 20335, 20346, 20322, 20325, 20345, 20313, 20317, 20344, 20304, 20309, 20301, 20293, 24446, 24444, 24436, 24437, 24438, 16254, 16252, 16245, 16255, 16251, 16237, 16250, 16229, 16249, 16221, 16248, 16213, 16205, 16197, 12148, 12150, 12139, 12143, 12130, 12121, 12112, 8051, 8044, 8046, 8055, 20415, 20413, 20405, 20406, 20407, 20412, 20396, 20398, 20411, 20387, 20390, 20410, 20378, 20382, 20409, 20369, 20374, 20408, 20360, 20366, 20358, 24511, 24509, 24501, 24502, 24503, 16319, 16317, 16310, 16316, 16302, 16315, 16294, 16314, 16286, 16313, 16278, 16312, 16270, 16262, 12213, 12215, 12204, 12195, 12186, 12177, 12168, 8116, 8109, 8111, 20478, 20470, 20471, 20477, 20461, 20463, 20476, 20452, 20455, 20475, 20443, 20447, 20474, 20434, 20439, 20473, 20425, 20431, 20472, 20416, 20423, 24574, 24566, 24567, 16382, 16375, 16381, 16367, 16380, 16359, 16379, 16351, 16378, 16343, 16377, 16335, 16376, 16327, 12278, 12269, 12260, 12251, 12242, 12233, 12224, 8181, 8174, 66, 64, 36928, 41024, 45120, 49216, 74, 72, 36936, 41032, 45128, 49224, 131, 129, 139, 137, 196, 194, 204, 202, 261, 259, 269, 267, 326, 324, 334, 332, 391, 37255, 41351, 45447, 49543, 389, 399, 37263, 41359, 45455, 49551, 397, 586, 584, 37448, 41544, 45640, 49736, 594, 592, 37456, 41552, 45648, 49744, 578, 576, 37440, 41536, 45632, 49728, 651, 649, 659, 657, 643, 641, 716, 714, 724, 722, 708, 706, 781, 779, 789, 787, 773, 771, 846, 844, 854, 852, 838, 836, 911, 37775, 41871, 45967, 50063, 909, 919, 37783, 41879, 45975, 50071, 917, 903, 37767, 41863, 45959, 50055, 901, 1106, 1104, 37968, 42064, 46160, 50256, 1114, 1112, 37976, 42072, 46168, 50264, 1098, 1096, 37960, 42056, 46152, 50248, 1171, 1169, 1179, 1177, 1163, 1161, 1236, 1234, 1244, 1242, 1228, 1226, 1301, 1299, 1309, 1307, 1293, 1291, 1366, 1364, 1374, 1372, 1358, 1356, 1431, 38295, 42391, 46487, 50583, 1429, 1439, 38303, 42399, 46495, 50591, 1437, 1423, 38287, 42383, 46479, 50575, 1421, 1626, 1624, 38488, 42584, 46680, 50776, 1634, 1632, 38496, 42592, 46688, 50784, 1618, 1616, 38480, 42576, 46672, 50768, 1691, 1689, 1699, 1697, 1683, 1681, 1756, 1754, 1764, 1762, 1748, 1746, 1821, 1819, 1829, 1827, 1813, 1811, 1886, 1884, 1894, 1892, 1878, 1876, 1951, 38815, 42911, 47007, 51103, 1949, 1959, 38823, 42919, 47015, 51111, 1957, 1943, 38807, 42903, 46999, 51095, 1941, 2146, 2144, 39008, 43104, 47200, 51296, 2154, 2152, 39016, 43112, 47208, 51304, 2138, 2136, 39e3, 43096, 47192, 51288, 2211, 2209, 2219, 2217, 2203, 2201, 2276, 2274, 2284, 2282, 2268, 2266, 2341, 2339, 2349, 2347, 2333, 2331, 2406, 2404, 2414, 2412, 2398, 2396, 2471, 39335, 43431, 47527, 51623, 2469, 2479, 39343, 43439, 47535, 51631, 2477, 2463, 39327, 43423, 47519, 51615, 2461, 2666, 2664, 39528, 43624, 47720, 51816, 2674, 2672, 39536, 43632, 47728, 51824, 2658, 2656, 39520, 43616, 47712, 51808, 2731, 2729, 2739, 2737, 2723, 2721, 2796, 2794, 2804, 2802, 2788, 2786, 2861, 2859, 2869, 2867, 2853, 2851, 2926, 2924, 2934, 2932, 2918, 2916, 2991, 39855, 43951, 48047, 52143, 2989, 2999, 39863, 43959, 48055, 52151, 2997, 2983, 39847, 43943, 48039, 52135, 2981, 3186, 3184, 40048, 44144, 48240, 52336, 3194, 3192, 40056, 44152, 48248, 52344, 3178, 3176, 40040, 44136, 48232, 52328, 3251, 3249, 3259, 3257, 3243, 3241, 3316, 3314, 3324, 3322, 3308, 3306, 3381, 3379, 3389, 3387, 3373, 3371, 3446, 3444, 3454, 3452, 3438, 3436, 3511, 40375, 44471, 48567, 52663, 3509, 3519, 40383, 44479, 48575, 52671, 3517, 3503, 40367, 44463, 48559, 52655, 3501, 3706, 3704, 40568, 44664, 48760, 52856, 3698, 3696, 40560, 44656, 48752, 52848, 3771, 3769, 3763, 3761, 3836, 3834, 3828, 3826, 3901, 3899, 3893, 3891, 3966, 3964, 3958, 3956, 4031, 40895, 44991, 49087, 53183, 4029, 4023, 40887, 44983, 49079, 53175, 4021, 67, 587, 1107, 1627, 2147, 2667, 3187, 3707, 388, 908, 1428, 1948, 2468, 2988, 3508, 4028, 26680, 30720, 55807, 59847], _o = Object.fromEntries(Io.map((t, e) => [t, e])), Re = {
  p: 0,
  n: 1,
  b: 2,
  r: 3,
  q: 4,
  k: 5
}, et = {
  n: 9,
  b: 10,
  r: 11,
  q: 12
}, Ko = Object.fromEntries(
  Object.entries(et).map(([t, e]) => [e, t])
), we = {
  e1g1: 26680,
  e1c1: 30720,
  e8g8: 55807,
  e8c8: 59847
}, Ho = Object.fromEntries(
  Object.entries(we).map(([t, e]) => [e, t])
), $o = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
}, Go = Object.fromEntries(
  Object.entries($o).map(([t, e]) => [e, t])
);
function Tt(t) {
  return Go[t];
}
function Bt(t) {
  return String(t + 1);
}
function Oe(t) {
  if (t.castlingMove) return t.castlingMove;
  const { fromFile: e, fromRank: n, toFile: s, toRank: o, role: i, promotion: r } = t;
  return (r || i) << 12 | e << 9 | n << 6 | s << 3 | o;
}
function Lt(t) {
  const e = Ho[t];
  if (e) return e;
  const n = t >> 12 & 15, s = Tt(t >> 9 & 7), o = Bt(t >> 6 & 7), i = Tt(t >> 3 & 7), r = Bt(t & 7), a = Ko[n];
  return s + o + i + r + (a || "");
}
const Fo = 32774, zo = 61952, Uo = 62464, xn = 15, Wo = 1, qo = 2, jo = 1, Vo = 2, Xo = 3, Qo = 4, Zo = {
  bullet: Xo,
  blitz: Vo,
  rapid: jo,
  classical: Qo
};
function Yo(t, e) {
  return e === "bin_logits_v1" || t === "bin_logits";
}
function At(t) {
  if (t == null || t === "missing")
    return zo;
  const e = Number(t);
  if (!Number.isFinite(e))
    throw new Error(`Invalid Elo metadata value: ${t}`);
  const n = Math.max(1e3, Math.min(e, 2500)), o = (Math.min(Math.floor((n + 50) / 100) * 100, 2500) - 1e3) / 100;
  return xn << 12 | Wo << 9 | o + 1 << 3;
}
function Jo(t) {
  if (!t || t === "missing")
    return Uo;
  const e = Zo[t];
  if (e === void 0)
    throw new Error(`Invalid time control metadata value: ${t}`);
  return xn << 12 | qo << 9 | e;
}
function ei(t) {
  return [
    Jo(t == null ? void 0 : t.timeControl),
    At(t == null ? void 0 : t.whiteElo),
    At(t == null ? void 0 : t.blackElo)
  ];
}
function ti(t, e = {}) {
  const n = e.addMetadataTokens ? ei(e.metadata) : [];
  return n.push(Fo, ...t), n;
}
function ni(t, e = {}) {
  var n;
  return e.outputMode === "bin_logits_v1" || e.outputTokenizer === "BinMoveTokenizer" ? t : (n = e.binToReal) == null ? void 0 : n[t];
}
const Ie = {
  pawn: "p",
  knight: "n",
  bishop: "b",
  rook: "r",
  queen: "q",
  king: "k"
};
class si {
  constructor(e, n) {
    this.session = null, this.isReady = !1, this.temperature = 1, this.topK = 1, this.inputType = "int32", this.inputName = "x", this.outputName = "select_8", this.modelConfig = null, this.onnxRuntime = e, this.sessionOptions = n;
  }
  setOnnxRuntime(e) {
    this.onnxRuntime = e;
  }
  setMetadataContext(e) {
    var n;
    (n = this.modelConfig) != null && n.addMetadataTokens && (this.modelConfig.metadata = e);
  }
  getOnnxRuntime() {
    const e = this.onnxRuntime ?? globalThis.ort;
    if (!e)
      throw new Error(
        "ONNX Runtime Web is not configured. Pass config.onnxRuntime or load an ONNX Runtime script that defines globalThis.ort."
      );
    return e;
  }
  async initSession(e, n) {
    var i, r, a, l, c, d;
    const s = this.getOnnxRuntime();
    if (this.session) {
      try {
        this.session.release ? await this.session.release() : (i = this.session.handler) != null && i.dispose && this.session.handler.dispose();
      } catch {
      }
      this.session = null, this.isReady = !1;
    }
    const o = URL.createObjectURL(e);
    try {
      s.env.wasm.numThreads = 1, s.env.wasm.proxy = !1, s.env.logLevel = "error";
      const h = {
        logSeverityLevel: 3,
        executionProviders: ["webgpu", "wasm"],
        preferredOutputLocation: "cpu",
        ...this.sessionOptions
      };
      this.session = await s.InferenceSession.create(o, h), this.inputType = "int32", this.inputName = "x", this.outputName = "select_8", this.modelConfig = n ?? null;
      const p = this.session.inputNames;
      if (p != null && p.length) {
        this.inputName = p[0];
        const g = ((l = (a = (r = this.session.handler) == null ? void 0 : r.inputMetadata) == null ? void 0 : a.get) == null ? void 0 : l.call(a, this.inputName)) ?? ((c = this.session.inputMetadata) == null ? void 0 : c[this.inputName]) ?? ((d = this.session.inputMetadata) == null ? void 0 : d[0]);
        ((g == null ? void 0 : g.type) === "int64" || (g == null ? void 0 : g.dataType) === "int64") && (this.inputType = "int64");
      }
      const m = this.session.outputNames;
      m != null && m.length && (this.outputName = m[0]), this.isReady = !0;
    } finally {
      URL.revokeObjectURL(o);
    }
  }
  usesBinLogitsOutput() {
    var e;
    return Yo(this.outputName, (e = this.modelConfig) == null ? void 0 : e.outputMode);
  }
  getLegalMovesAsBin(e) {
    const n = le.default();
    for (const i of e) {
      const r = $e(i);
      if (!r) throw new Error(`Invalid UCI move: ${i}`);
      n.play(r);
    }
    const s = n.allDests(), o = [];
    for (const [i, r] of s) {
      const a = n.board.get(i);
      if (!a) continue;
      const l = Ie[a.role], c = N(i), d = H(i);
      for (const h of r) {
        const p = N(h), m = H(h);
        if (l === "k") {
          const k = n.board.get(h);
          if (k && k.color === a.color && k.role === "rook") {
            const w = p > c, v = a.color === "white" ? w ? "e1g1" : "e1c1" : w ? "e8g8" : "e8c8";
            o.push(we[v]);
            continue;
          }
        }
        const g = D(i) + D(h), f = we[g];
        if (f !== void 0) {
          o.push(f);
          continue;
        }
        if (l === "p" && (m === 7 || m === 0))
          for (const k of ["q", "r", "b", "n"]) {
            const w = {
              fromFile: c,
              fromRank: d,
              toFile: p,
              toRank: m,
              role: Re[l],
              promotion: et[k]
            };
            o.push(Oe(w));
          }
        else {
          const k = {
            fromFile: c,
            fromRank: d,
            toFile: p,
            toRank: m,
            role: Re[l]
          };
          o.push(Oe(k));
        }
      }
    }
    return o;
  }
  async getMove(e) {
    if (await new Promise((o) => setTimeout(o, 100)), !this.isReady || !this.session)
      throw new Error("ONNX model not initialized");
    let n = null, s = null;
    try {
      n = this.buildModelInput(e), s = await this.session.run({ [this.inputName]: n });
      const o = this.getLegalMovesAsBin(e), { sampledBinMove: i, topCandidates: r } = this.sampleBinMove(s, o), a = Lt(i), l = r.map((c) => {
        const d = Lt(c.binMove);
        return {
          from: d.substring(0, 2),
          to: d.substring(2, 4),
          probability: c.probability,
          isChosen: c.binMove === i
        };
      });
      return { uciMove: a, topMoves: l };
    } catch (o) {
      return console.error("Error during ONNX inference:", o), null;
    } finally {
      if (n != null && n.dispose && n.dispose(), s)
        for (const o of Object.values(s))
          o != null && o.dispose && o.dispose();
    }
  }
  buildModelInput(e) {
    const n = this.getOnnxRuntime(), s = le.default(), o = [];
    for (const a of e) {
      const l = $e(a);
      if (!l) throw new Error(`Invalid UCI move: ${a}`);
      if (!He(l)) {
        s.play(l);
        continue;
      }
      const c = s.board.get(l.from);
      if (!c) throw new Error(`No piece at ${D(l.from)}`);
      const d = D(l.from) + D(l.to), h = we[d];
      if (h !== void 0)
        o.push(h);
      else {
        const p = Ie[c.role], m = {
          fromFile: N(l.from),
          fromRank: H(l.from),
          toFile: N(l.to),
          toRank: H(l.to),
          role: Re[p],
          promotion: l.promotion ? et[Ie[l.promotion]] : void 0
        };
        o.push(Oe(m));
      }
      s.play(l);
    }
    const i = ti(o, this.modelConfig ?? {}), r = this.inputType === "int64" ? BigInt64Array.from(i, (a) => BigInt(a)) : Int32Array.from(i);
    return new n.Tensor(this.inputType, r, [1, i.length]);
  }
  sampleBinMove(e, n) {
    var I, K;
    const s = e[this.outputName], o = s.cpuData ?? s.data, i = [], r = {
      outputMode: this.usesBinLogitsOutput() ? "bin_logits_v1" : (I = this.modelConfig) == null ? void 0 : I.outputMode,
      outputTokenizer: (K = this.modelConfig) == null ? void 0 : K.outputTokenizer,
      binToReal: _o
    };
    for (const b of n) {
      const P = ni(b, r);
      if (P === void 0) throw new Error(`Missing tokenizer mapping for bin move: ${b}`);
      const S = o[P];
      if (S === void 0 || !isFinite(S)) throw new Error(`Invalid logit for token ${P} (bin ${b}): ${S}`);
      i.push({ binMove: b, logit: S });
    }
    if (i.sort((b, P) => P.logit - b.logit), i.length === 0)
      return console.error("No legal moves"), { sampledBinMove: 0, topCandidates: [] };
    const a = this.temperature <= 0 ? 1e-9 : this.temperature, l = i.map((b) => b.logit / a), c = l[0], d = l.map((b) => Math.exp(b - c)), h = d.reduce((b, P) => b + P, 0), p = d.map((b) => b / h), m = Math.min(20, i.length), g = i.slice(0, m).map((b, P) => ({
      binMove: b.binMove,
      probability: p[P]
    }));
    if (this.temperature <= 0 || this.topK <= 1)
      return {
        sampledBinMove: i[0].binMove,
        topCandidates: g
      };
    const f = Math.min(this.topK, i.length), k = p.slice(0, f), w = k.reduce((b, P) => b + P, 0), v = k.map((b) => b / w), y = Math.random();
    let T = 0, M = f - 1;
    for (let b = 0; b < v.length; b++)
      if (T += v[b], y < T) {
        M = b;
        break;
      }
    return {
      sampledBinMove: i[M].binMove,
      topCandidates: g
    };
  }
  async reset() {
  }
}
class oi {
  constructor(e, n = "chess-models") {
    this.dbName = "ChessGameDB", this.dbVersion = 1, this.db = null, this.modelUrl = e, this.storeName = n;
  }
  async initDB() {
    return new Promise((e, n) => {
      const s = indexedDB.open(this.dbName, this.dbVersion);
      s.onerror = () => n(s.error), s.onsuccess = () => {
        this.db = s.result, e(this.db);
      }, s.onupgradeneeded = (o) => {
        const i = o.target.result;
        i.objectStoreNames.contains(this.storeName) || i.createObjectStore(this.storeName);
      };
    });
  }
  async getCachedModel(e) {
    const n = e || this.modelUrl;
    return this.db || await this.initDB(), new Promise((s, o) => {
      const a = this.db.transaction(this.storeName, "readonly").objectStore(this.storeName).get(n);
      a.onerror = () => o(a.error), a.onsuccess = () => s(a.result);
    });
  }
  async cacheModel(e, n) {
    const s = n || this.modelUrl;
    return this.db || await this.initDB(), new Promise((o, i) => {
      const l = this.db.transaction(this.storeName, "readwrite").objectStore(this.storeName).put(e, s);
      l.onerror = () => i(l.error), l.onsuccess = () => o();
    });
  }
  async downloadModel(e, n, s) {
    const o = s || this.modelUrl;
    try {
      const i = await fetch(o, { signal: n });
      if (!i.ok)
        throw new Error(`Failed to download model: ${i.statusText}`);
      const r = i.headers.get("content-length");
      if (!r)
        throw new Error("Server did not provide content-length header");
      const a = parseInt(r, 10);
      let l = 0;
      const c = i.body.getReader(), d = [];
      try {
        for (; ; ) {
          const { done: p, value: m } = await c.read();
          if (p) break;
          d.push(m), l += m.length;
          const g = l / a * 100;
          e == null || e(g);
        }
      } catch (p) {
        throw c.cancel(), p;
      }
      const h = new Blob(d, { type: "application/octet-stream" });
      return await this.cacheModel(h, o), h;
    } catch (i) {
      throw console.error("[ModelManager] Download error:", i), i;
    }
  }
  async getModel(e, n, s) {
    const o = s || this.modelUrl;
    try {
      const i = await this.getCachedModel(o);
      return i ? (console.debug("[ModelManager] Using cached model"), e == null || e(100), i) : (console.debug("[ModelManager] Downloading model..."), await this.downloadModel(e, n, o));
    } catch (i) {
      throw console.error("[ModelManager] Error getting model:", i), i;
    }
  }
  async clearCache(e) {
    const n = e || this.modelUrl;
    return this.db || await this.initDB(), new Promise((s, o) => {
      const a = this.db.transaction(this.storeName, "readwrite").objectStore(this.storeName).delete(n);
      a.onerror = () => o(a.error), a.onsuccess = () => s();
    });
  }
}
const Dt = {
  threefoldRepetition: "Threefold repetition",
  fivefoldRepetition: "Fivefold repetition",
  fiftyMoveRule: "Fifty-move rule",
  seventyFiveMoveRule: "Seventy-five-move rule"
};
function ut(t) {
  return qe(t.toSetup()).split(" ").slice(0, 4).join(" ");
}
function Rt(t) {
  const e = /* @__PURE__ */ new Map();
  return e.set(ut(t), 1), { counts: e };
}
function ii(t, e) {
  const n = ut(e), s = (t.counts.get(n) ?? 0) + 1;
  return t.counts.set(n, s), s;
}
function Ot(t, e) {
  return t.counts.get(ut(e)) ?? 0;
}
function _e(t, e) {
  if (e >= 5)
    return {
      automaticDraw: "fivefoldRepetition",
      claimableDraws: []
    };
  if (t.halfmoves >= 150)
    return {
      automaticDraw: "seventyFiveMoveRule",
      claimableDraws: []
    };
  const n = [];
  return e >= 3 && n.push("threefoldRepetition"), t.halfmoves >= 100 && n.push("fiftyMoveRule"), {
    automaticDraw: null,
    claimableDraws: n
  };
}
class ri {
  constructor(e) {
    this.config = e, this.models = e.models, this.currentModelPath = e.models[0].path, this.modelManager = new oi(this.currentModelPath), this.aiProvider = new si(e.onnxRuntime, e.onnxSessionOptions), this.boardUI = new xo(), this.pos = le.default(), this.moveHistory = [], this.sanHistory = [], this.uciHistory = [], this.moveTopMoves = [], this.showProbabilities = !1, this.isHumanWhite = !0, this.gameInProgress = !1, this.currentPositionIndex = -1, this.playMetadata = this.getPlayMetadataFromModel(e.models[0]), this.repetitionTracker = Rt(this.pos), this.currentDrawState = _e(
      this.pos,
      Ot(this.repetitionTracker, this.pos)
    ), this.claimedDrawText = null;
  }
  async init() {
    var i;
    const e = document.getElementById(this.config.containerId);
    if (!e)
      throw new Error(`Container element not found: ${this.config.containerId}`);
    this.panels = new Ro(e, Nn(this.config.layout)), this.panels.initialize();
    const n = this.panels.getMoveListPortalRoot(), s = n ? [n] : [];
    this.themeManager = new Oo(e, this.config.theme, s), this.themeManager.apply(), this.boardUI.init(this.panels.getBoardContainer(), this.onHumanMove.bind(this)), this.panels.onNewGameWithColor = (r) => this.startNewGame(r), this.panels.onMoveNavigate = (r) => this.navigateToMove(r), this.panels.onSamplingParamsChanged = (r) => {
      var a;
      if (this.aiProvider.temperature = r.temperature, this.aiProvider.topK = r.topK, this.showProbabilities) {
        const l = this.currentPositionIndex === -1 ? this.moveHistory.length - 1 : this.currentPositionIndex;
        this.boardUI.clearArrows(), l >= 0 && ((a = this.moveTopMoves[l]) == null ? void 0 : a.length) > 0 && this.boardUI.showProbabilityArrows(this.moveTopMoves[l].slice(0, r.topK));
      }
    }, this.panels.onMetadataChanged = (r) => {
      this.playMetadata = r, this.applyPlayMetadataToModels();
    }, this.panels.onLoadModel = (r) => this.loadModel(r), this.panels.onClaimDraw = () => this.claimDraw(), this.panels.onThemeModeChanged = (r) => this.themeManager.setMode(r), this.panels.onBoardThemeChanged = (r) => this.themeManager.setBoard(r), this.panels.onPieceSetChanged = (r) => this.themeManager.setPieces(r), this.panels.onShowProbabilitiesChanged = (r) => {
      var l;
      this.showProbabilities = r;
      const a = this.currentPositionIndex === -1 ? this.moveHistory.length - 1 : this.currentPositionIndex;
      this.boardUI.clearArrows(), r && a >= 0 && ((l = this.moveTopMoves[a]) == null ? void 0 : l.length) > 0 && this.boardUI.showProbabilityArrows(this.moveTopMoves[a].slice(0, this.aiProvider.topK));
    }, this.applyPlayMetadataToModels(), this.panels.setMetadataSettings(this.playMetadata), this.panels.setModelOptions(this.models, this.currentModelPath), this.panels.setThemePicker(((i = this.config.theme) == null ? void 0 : i.showPicker) !== !1, {
      mode: this.themeManager.getMode(),
      board: this.themeManager.getBoard(),
      pieces: this.themeManager.getPieces()
    }), this.updateStatus(), this.panels.updateMoveHistory(this.sanHistory, this.currentPositionIndex), this.updateBoard();
    const o = await this.modelManager.getCachedModel(this.currentModelPath);
    if (o) {
      this.panels.showLoadingSpinner();
      const r = this.models.find((a) => a.path === this.currentModelPath);
      this.applyPlayMetadataToModels(), await this.aiProvider.initSession(o, r), this.panels.setNewGameEnabled(!0), this.panels.hideLoadingModal(), await this.startGame();
    } else {
      const r = this.models.find((a) => a.path === this.currentModelPath);
      this.panels.showBoardBlocker(() => this.beginDownloadFlow(), r == null ? void 0 : r.size);
    }
  }
  async onHumanMove(e, n) {
    if (!this.gameInProgress) {
      this.updateBoard();
      return;
    }
    if (!this.isAtPresentPosition()) {
      this.updateBoard();
      return;
    }
    const s = be(e);
    if (s === void 0) return;
    const o = this.pos.board.get(s);
    if (o && o.role === "pawn" && (n[1] === "1" || n[1] === "8")) {
      const r = o.color === "white" ? "white" : "black", a = await this.boardUI.showPromotionDialog(n, r);
      if (!a) {
        this.updateBoard();
        return;
      }
      const l = `${e}${n}${a}`;
      if (!this.playMove(l)) {
        this.updateBoard();
        return;
      }
    } else {
      const r = `${e}${n}`;
      if (!this.playMove(r)) {
        this.updateBoard();
        return;
      }
    }
    this.boardUI.clearArrows(), this.updateBoard(), await this.getAIMove();
  }
  playMove(e) {
    const n = $e(e);
    if (!n || !this.pos.isLegal(n)) return !1;
    const s = Yn(this.pos, n);
    this.pos.play(n);
    const o = ii(this.repetitionTracker, this.pos);
    return this.currentDrawState = _e(this.pos, o), this.moveHistory.push(n), this.sanHistory.push(s), this.uciHistory.push(e), this.moveTopMoves.push([]), this.currentPositionIndex = this.moveHistory.length - 1, this.updateBoard(), this.panels.updateMoveHistory(this.sanHistory, this.currentPositionIndex), this.checkGameEnd(), !0;
  }
  updateBoard() {
    const e = qe(this.pos.toSetup()), n = this.pos.turn, s = Xn(this.pos);
    let o;
    if (this.moveHistory.length > 0) {
      const r = this.moveHistory[this.moveHistory.length - 1];
      He(r) && (o = [D(r.from), D(r.to)]);
    }
    const i = this.pos.isCheck();
    this.boardUI.updatePosition(e, n, s, o, i);
  }
  async getAIMove() {
    if (!(!this.gameInProgress || this.isGameOver())) {
      if (!this.aiProvider.isReady) {
        this.panels.updateStatus("Error: AI provider not initialized");
        return;
      }
      try {
        const e = await this.aiProvider.getMove(this.uciHistory);
        if (e) {
          const { uciMove: n, topMoves: s } = e;
          this.playMove(n), s && (this.moveTopMoves[this.moveTopMoves.length - 1] = s), this.showProbabilities && s && this.boardUI.showProbabilityArrows(s.slice(0, this.aiProvider.topK));
        } else
          this.panels.updateStatus("Error: AI returned no move");
      } catch (e) {
        console.error("Error getting AI move:", e), this.panels.updateStatus("Error getting AI move: " + e.message);
      }
    }
  }
  isGameOver() {
    return this.pos.isCheckmate() || this.pos.isStalemate() || this.pos.isInsufficientMaterial() || this.currentDrawState.automaticDraw !== null;
  }
  checkGameEnd() {
    if (this.pos.isCheckmate()) {
      const e = this.pos.turn === "white" ? "Black" : "White";
      this.gameInProgress = !1, this.panels.showGameEndBanner(`Checkmate · ${e} wins`, !1), this.updateStatus();
      return;
    }
    if (this.pos.isStalemate()) {
      this.gameInProgress = !1, this.panels.showGameEndBanner("Stalemate · Draw", !0), this.updateStatus();
      return;
    }
    if (this.pos.isInsufficientMaterial()) {
      this.gameInProgress = !1, this.panels.showGameEndBanner("Insufficient material · Draw", !0), this.updateStatus();
      return;
    }
    if (this.currentDrawState.automaticDraw) {
      this.gameInProgress = !1;
      const e = Dt[this.currentDrawState.automaticDraw] ?? "FIDE draw";
      this.panels.showGameEndBanner(`${e} · Draw`, !0), this.updateStatus();
      return;
    }
    this.updateStatus();
  }
  updateStatus() {
    const e = this.pos.turn === "white" ? "White" : "Black", n = this.claimedDrawText !== null || this.pos.isCheckmate() || this.pos.isStalemate() || this.pos.isInsufficientMaterial() || this.currentDrawState.automaticDraw !== null;
    let s = "";
    if (!n && (this.pos.isCheck() && (s = `${e} is in check! `), s += `${e} to move.`, this.currentDrawState.claimableDraws.length > 0)) {
      const o = this.getClaimableDrawLabels();
      s += ` ${e} may claim a draw by ${o.join(" or ")}.`;
    }
    this.panels.updateStatus(s), this.updateClaimDrawAvailability();
  }
  navigateToMove(e) {
    var r;
    const n = le.default();
    let s;
    for (let a = 0; a <= e && a < this.moveHistory.length; a++) {
      const l = this.moveHistory[a];
      n.play(l), a === e && He(l) && (s = [D(l.from), D(l.to)]);
    }
    const o = qe(n.toSetup()), i = n.isCheck();
    e === this.moveHistory.length - 1 ? (this.currentPositionIndex = -1, this.pos = n, this.updateBoard()) : (this.currentPositionIndex = e, this.boardUI.setViewOnly(o, s, i)), this.boardUI.clearArrows(), this.showProbabilities && ((r = this.moveTopMoves[e]) == null ? void 0 : r.length) > 0 && this.boardUI.showProbabilityArrows(this.moveTopMoves[e].slice(0, this.aiProvider.topK)), this.panels.updateMoveHistory(this.sanHistory, e), this.updateClaimDrawAvailability();
  }
  isAtPresentPosition() {
    return this.currentPositionIndex === -1 || this.currentPositionIndex === this.moveHistory.length - 1;
  }
  async startNewGame(e) {
    this.pos = le.default(), this.moveHistory = [], this.sanHistory = [], this.uciHistory = [], this.moveTopMoves = [], this.isHumanWhite = e, this.currentPositionIndex = -1, this.repetitionTracker = Rt(this.pos), this.currentDrawState = _e(
      this.pos,
      Ot(this.repetitionTracker, this.pos)
    ), this.claimedDrawText = null, this.applyPlayMetadataToModels();
    const n = this.boardUI.getOrientation();
    e && n === "black" ? this.boardUI.flip() : !e && n === "white" && this.boardUI.flip(), this.panels.hideGameEndBanner(), this.panels.setClaimDrawAvailable(!1), this.boardUI.clearArrows(), this.updateBoard(), this.updateStatus(), this.panels.updateMoveHistory(this.sanHistory, this.currentPositionIndex), await this.startGame();
  }
  async startGame() {
    this.gameInProgress = !0, this.updateStatus(), this.isHumanWhite || await this.getAIMove();
  }
  claimDraw() {
    if (!this.gameInProgress || !this.isHumanTurn() || this.currentDrawState.claimableDraws.length === 0)
      return;
    const e = this.getClaimableDrawLabels();
    this.claimedDrawText = e.join(" or ").toLowerCase(), this.gameInProgress = !1, this.panels.setClaimDrawAvailable(!1), this.panels.showGameEndBanner(`${e.join(" or ")} · Draw claimed`, !0), this.updateStatus();
  }
  getClaimableDrawLabels() {
    return this.currentDrawState.claimableDraws.map((e) => Dt[e] ?? e);
  }
  isHumanTurn() {
    return this.pos.turn === (this.isHumanWhite ? "white" : "black");
  }
  updateClaimDrawAvailability() {
    if (!this.panels) return;
    const e = this.gameInProgress && this.isAtPresentPosition() && this.isHumanTurn() && this.currentDrawState.claimableDraws.length > 0;
    this.panels.setClaimDrawAvailable(e, this.getClaimableDrawLabels());
  }
  async loadModel(e) {
    const n = this.models.find((o) => o.path === e);
    if (!n) {
      console.error("Model not found:", e);
      return;
    }
    this.currentModelPath = e, this.applyPlayMetadataToModels(), this.panels.setNewGameEnabled(!1);
    let s = await this.modelManager.getCachedModel(e);
    if (!s) {
      const { abortController: o } = this.panels.showDownloadProgress(n.size);
      try {
        s = await this.modelManager.getModel(
          (i) => this.panels.updateLoadingProgress(i),
          o.signal,
          e
        );
      } catch (i) {
        if (this.panels.hideLoadingModal(), i.name === "AbortError")
          return;
        console.error("Model download failed:", i);
        return;
      }
    }
    this.panels.showLoadingSpinner(), await this.aiProvider.initSession(s, n), this.panels.setNewGameEnabled(!0), this.panels.hideLoadingModal(), this.panels.hideBoardBlocker(), this.panels.setCurrentModel(e), await this.startGame();
  }
  async beginDownloadFlow() {
    const e = this.models.find((o) => o.path === this.currentModelPath), n = e == null ? void 0 : e.size, { abortController: s } = this.panels.showDownloadProgress(n);
    this.applyPlayMetadataToModels();
    try {
      const o = await this.modelManager.getModel(
        (i) => this.panels.updateLoadingProgress(i),
        s.signal,
        this.currentModelPath
      );
      this.panels.showLoadingSpinner(), this.applyPlayMetadataToModels(), await this.aiProvider.initSession(o, e), this.panels.setNewGameEnabled(!0), this.panels.hideLoadingModal(), this.panels.hideBoardBlocker(), await this.startGame();
    } catch (o) {
      this.panels.hideLoadingModal(), o.name === "AbortError" ? (await this.panels.showMustDownloadOverlay(), await this.beginDownloadFlow()) : console.error("Model download failed:", o);
    }
  }
  getPlayMetadataFromModel(e) {
    const n = e == null ? void 0 : e.metadata;
    return {
      timeControl: (n == null ? void 0 : n.timeControl) ?? "rapid",
      userElo: this.isHumanWhite ? (n == null ? void 0 : n.whiteElo) ?? 2500 : (n == null ? void 0 : n.blackElo) ?? 2500,
      modelElo: this.isHumanWhite ? (n == null ? void 0 : n.blackElo) ?? 2500 : (n == null ? void 0 : n.whiteElo) ?? 2500
    };
  }
  applyPlayMetadataToModels() {
    const e = this.getMetadataContext();
    for (const n of this.models)
      n.addMetadataTokens && (n.metadata = e);
    this.aiProvider.setMetadataContext(e);
  }
  getMetadataContext() {
    const { timeControl: e, userElo: n, modelElo: s } = this.playMetadata;
    return {
      timeControl: e,
      whiteElo: this.isHumanWhite ? n : s,
      blackElo: this.isHumanWhite ? s : n
    };
  }
  /**
   * Tear down the widget. In the default `auto` theme mode each instance attaches
   * a `prefers-color-scheme` listener; call this when unmounting the widget (e.g.
   * in an SPA) so that listener and the Chessground instance are released.
   * Safe to call before {@link init}.
   */
  destroy() {
    var e, n;
    (e = this.themeManager) == null || e.destroy(), (n = this.panels) == null || n.destroy(), this.boardUI.destroy();
  }
}
export {
  ri as ChessGame
};
