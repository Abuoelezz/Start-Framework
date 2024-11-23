"use strict";
(self.webpackChunkapp_1 = self.webpackChunkapp_1 || []).push([
  [179],
  {
    353: () => {
      function ne(e) {
        return "function" == typeof e;
      }
      function uo(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const Ri = uo(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function lo(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class gt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (ne(r))
              try {
                r();
              } catch (i) {
                t = i instanceof Ri ? i.errors : [i];
              }
            const { _finalizers: o } = this;
            if (o) {
              this._finalizers = null;
              for (const i of o)
                try {
                  Cf(i);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof Ri ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Ri(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Cf(t);
            else {
              if (t instanceof gt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && lo(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && lo(n, t), t instanceof gt && t._removeParent(this);
        }
      }
      gt.EMPTY = (() => {
        const e = new gt();
        return (e.closed = !0), e;
      })();
      const _f = gt.EMPTY;
      function Df(e) {
        return (
          e instanceof gt ||
          (e && "closed" in e && ne(e.remove) && ne(e.add) && ne(e.unsubscribe))
        );
      }
      function Cf(e) {
        ne(e) ? e() : e.unsubscribe();
      }
      const Un = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Fi = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = Fi;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = Fi;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function wf(e) {
        Fi.setTimeout(() => {
          const { onUnhandledError: t } = Un;
          if (!t) throw e;
          t(e);
        });
      }
      function Ef() {}
      const JC = Ha("C", void 0, void 0);
      function Ha(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let Hn = null;
      function Oi(e) {
        if (Un.useDeprecatedSynchronousErrorHandling) {
          const t = !Hn;
          if ((t && (Hn = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = Hn;
            if (((Hn = null), n)) throw r;
          }
        } else e();
      }
      class Ga extends gt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Df(t) && t.add(this))
              : (this.destination = iw);
        }
        static create(t, n, r) {
          return new co(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Wa(
                (function ew(e) {
                  return Ha("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Wa(
                (function XC(e) {
                  return Ha("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? Wa(JC, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const nw = Function.prototype.bind;
      function za(e, t) {
        return nw.call(e, t);
      }
      class rw {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Pi(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Pi(r);
            }
          else Pi(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Pi(n);
            }
        }
      }
      class co extends Ga {
        constructor(t, n, r) {
          let o;
          if ((super(), ne(t) || !t))
            o = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let i;
            this && Un.useDeprecatedNextContext
              ? ((i = Object.create(t)),
                (i.unsubscribe = () => this.unsubscribe()),
                (o = {
                  next: t.next && za(t.next, i),
                  error: t.error && za(t.error, i),
                  complete: t.complete && za(t.complete, i),
                }))
              : (o = t);
          }
          this.destination = new rw(o);
        }
      }
      function Pi(e) {
        Un.useDeprecatedSynchronousErrorHandling
          ? (function tw(e) {
              Un.useDeprecatedSynchronousErrorHandling &&
                Hn &&
                ((Hn.errorThrown = !0), (Hn.error = e));
            })(e)
          : wf(e);
      }
      function Wa(e, t) {
        const { onStoppedNotification: n } = Un;
        n && Fi.setTimeout(() => n(e, t));
      }
      const iw = {
          closed: !0,
          next: Ef,
          error: function ow(e) {
            throw e;
          },
          complete: Ef,
        },
        qa =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Gn(e) {
        return e;
      }
      function bf(e) {
        return 0 === e.length
          ? Gn
          : 1 === e.length
          ? e[0]
          : function (n) {
              return e.reduce((r, o) => o(r), n);
            };
      }
      let _e = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function uw(e) {
              return (
                (e && e instanceof Ga) ||
                ((function aw(e) {
                  return e && ne(e.next) && ne(e.error) && ne(e.complete);
                })(e) &&
                  Df(e))
              );
            })(n)
              ? n
              : new co(n, r, o);
            return (
              Oi(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i)
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Mf(r))((o, i) => {
              const s = new co({
                next: (a) => {
                  try {
                    n(a);
                  } catch (u) {
                    i(u), s.unsubscribe();
                  }
                },
                error: i,
                complete: o,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [qa]() {
            return this;
          }
          pipe(...n) {
            return bf(n)(this);
          }
          toPromise(n) {
            return new (n = Mf(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function Mf(e) {
        var t;
        return null !== (t = e ?? Un.Promise) && void 0 !== t ? t : Promise;
      }
      const lw = uo(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let Ht = (() => {
        class e extends _e {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Sf(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new lw();
          }
          next(n) {
            Oi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            Oi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            Oi(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o
              ? _f
              : ((this.currentObservers = null),
                i.push(n),
                new gt(() => {
                  (this.currentObservers = null), lo(i, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new _e();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Sf(t, n)), e;
      })();
      class Sf extends Ht {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : _f;
        }
      }
      function If(e) {
        return ne(e?.lift);
      }
      function Fe(e) {
        return (t) => {
          if (If(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function Se(e, t, n, r, o) {
        return new cw(e, t, n, r, o);
      }
      class cw extends Ga {
        constructor(t, n, r, o, i, s) {
          super(t),
            (this.onFinalize = i),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (u) {
                    t.error(u);
                  }
                }
              : super._next),
            (this._error = o
              ? function (a) {
                  try {
                    o(a);
                  } catch (u) {
                    t.error(u);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function W(e, t) {
        return Fe((n, r) => {
          let o = 0;
          n.subscribe(
            Se(r, (i) => {
              r.next(e.call(t, i, o++));
            })
          );
        });
      }
      function bn(e) {
        return this instanceof bn ? ((this.v = e), this) : new bn(e);
      }
      function xf(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          r = n.apply(e, t || []),
          i = [];
        return (
          (o = {}),
          s("next"),
          s("throw"),
          s("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function s(f) {
          r[f] &&
            (o[f] = function (h) {
              return new Promise(function (p, g) {
                i.push([f, h, p, g]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function u(f) {
              f.value instanceof bn
                ? Promise.resolve(f.value.v).then(l, c)
                : d(i[0][2], f);
            })(r[f](h));
          } catch (p) {
            d(i[0][3], p);
          }
        }
        function l(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
        }
      }
      function Nf(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function Ya(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, u) {
                !(function o(i, s, a, u) {
                  Promise.resolve(u).then(function (l) {
                    i({ value: l, done: a });
                  }, s);
                })(a, u, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      "function" == typeof SuppressedError && SuppressedError;
      const Rf = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Ff(e) {
        return ne(e?.then);
      }
      function Of(e) {
        return ne(e[qa]);
      }
      function Pf(e) {
        return Symbol.asyncIterator && ne(e?.[Symbol.asyncIterator]);
      }
      function kf(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Lf = (function Rw() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function Vf(e) {
        return ne(e?.[Lf]);
      }
      function jf(e) {
        return xf(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield bn(n.read());
              if (o) return yield bn(void 0);
              yield yield bn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function Bf(e) {
        return ne(e?.getReader);
      }
      function St(e) {
        if (e instanceof _e) return e;
        if (null != e) {
          if (Of(e))
            return (function Fw(e) {
              return new _e((t) => {
                const n = e[qa]();
                if (ne(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (Rf(e))
            return (function Ow(e) {
              return new _e((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Ff(e))
            return (function Pw(e) {
              return new _e((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, wf);
              });
            })(e);
          if (Pf(e)) return $f(e);
          if (Vf(e))
            return (function kw(e) {
              return new _e((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (Bf(e))
            return (function Lw(e) {
              return $f(jf(e));
            })(e);
        }
        throw kf(e);
      }
      function $f(e) {
        return new _e((t) => {
          (function Vw(e, t) {
            var n, r, o, i;
            return (function Af(e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    l(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  try {
                    l(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  c.done
                    ? i(c.value)
                    : (function o(i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, u);
                }
                l((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = Nf(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function nn(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Pe(e, t, n = 1 / 0) {
        return ne(t)
          ? Pe((r, o) => W((i, s) => t(r, i, o, s))(St(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            Fe((r, o) =>
              (function jw(e, t, n, r, o, i, s, a) {
                const u = [];
                let l = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !u.length && !l && t.complete();
                  },
                  h = (g) => (l < r ? p(g) : u.push(g)),
                  p = (g) => {
                    i && t.next(g), l++;
                    let m = !1;
                    St(n(g, c++)).subscribe(
                      Se(
                        t,
                        (D) => {
                          o?.(D), i ? h(D) : t.next(D);
                        },
                        () => {
                          m = !0;
                        },
                        void 0,
                        () => {
                          if (m)
                            try {
                              for (l--; u.length && l < r; ) {
                                const D = u.shift();
                                s ? nn(t, s, () => p(D)) : p(D);
                              }
                              f();
                            } catch (D) {
                              t.error(D);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    Se(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, o, e, n)
            ));
      }
      function pr(e = 1 / 0) {
        return Pe(Gn, e);
      }
      const rn = new _e((e) => e.complete());
      function Ja(e) {
        return e[e.length - 1];
      }
      function Uf(e) {
        return ne(Ja(e)) ? e.pop() : void 0;
      }
      function fo(e) {
        return (function $w(e) {
          return e && ne(e.schedule);
        })(Ja(e))
          ? e.pop()
          : void 0;
      }
      function Hf(e, t = 0) {
        return Fe((n, r) => {
          n.subscribe(
            Se(
              r,
              (o) => nn(r, e, () => r.next(o), t),
              () => nn(r, e, () => r.complete(), t),
              (o) => nn(r, e, () => r.error(o), t)
            )
          );
        });
      }
      function Gf(e, t = 0) {
        return Fe((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function zf(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new _e((n) => {
          nn(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            nn(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function De(e, t) {
        return t
          ? (function Zw(e, t) {
              if (null != e) {
                if (Of(e))
                  return (function Hw(e, t) {
                    return St(e).pipe(Gf(t), Hf(t));
                  })(e, t);
                if (Rf(e))
                  return (function zw(e, t) {
                    return new _e((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Ff(e))
                  return (function Gw(e, t) {
                    return St(e).pipe(Gf(t), Hf(t));
                  })(e, t);
                if (Pf(e)) return zf(e, t);
                if (Vf(e))
                  return (function Ww(e, t) {
                    return new _e((n) => {
                      let r;
                      return (
                        nn(n, t, () => {
                          (r = e[Lf]()),
                            nn(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0
                            );
                        }),
                        () => ne(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (Bf(e))
                  return (function qw(e, t) {
                    return zf(jf(e), t);
                  })(e, t);
              }
              throw kf(e);
            })(e, t)
          : St(e);
      }
      function Xa(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new co({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return t(...n).subscribe(r);
      }
      function ee(e) {
        for (let t in e) if (e[t] === ee) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function eu(e, t) {
        for (const n in t)
          t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
      }
      function te(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(te).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function tu(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const Yw = ee({ __forward_ref__: ee });
      function re(e) {
        return (
          (e.__forward_ref__ = re),
          (e.toString = function () {
            return te(this());
          }),
          e
        );
      }
      function R(e) {
        return nu(e) ? e() : e;
      }
      function nu(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(Yw) &&
          e.__forward_ref__ === re
        );
      }
      class C extends Error {
        constructor(t, n) {
          super(
            (function ki(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t.trim() : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function P(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function Li(e, t) {
        throw new C(-201, !1);
      }
      function st(e, t) {
        null == e &&
          (function Y(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function V(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function It(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function Vi(e) {
        return Wf(e, ji) || Wf(e, Zf);
      }
      function Wf(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function qf(e) {
        return e && (e.hasOwnProperty(ru) || e.hasOwnProperty(sE))
          ? e[ru]
          : null;
      }
      const ji = ee({ ɵprov: ee }),
        ru = ee({ ɵinj: ee }),
        Zf = ee({ ngInjectableDef: ee }),
        sE = ee({ ngInjectorDef: ee });
      var x = (() => (
        ((x = x || {})[(x.Default = 0)] = "Default"),
        (x[(x.Host = 1)] = "Host"),
        (x[(x.Self = 2)] = "Self"),
        (x[(x.SkipSelf = 4)] = "SkipSelf"),
        (x[(x.Optional = 8)] = "Optional"),
        x
      ))();
      let ou;
      function mt(e) {
        const t = ou;
        return (ou = e), t;
      }
      function Qf(e, t, n) {
        const r = Vi(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & x.Optional
          ? null
          : void 0 !== t
          ? t
          : void Li(te(e));
      }
      function Mn(e) {
        return { toString: e }.toString();
      }
      var At = (() => (
          ((At = At || {})[(At.OnPush = 0)] = "OnPush"),
          (At[(At.Default = 1)] = "Default"),
          At
        ))(),
        Gt = (() => {
          return (
            ((e = Gt || (Gt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            Gt
          );
          var e;
        })();
      const oe = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        gr = {},
        K = [],
        Bi = ee({ ɵcmp: ee }),
        iu = ee({ ɵdir: ee }),
        su = ee({ ɵpipe: ee }),
        Kf = ee({ ɵmod: ee }),
        sn = ee({ ɵfac: ee }),
        ho = ee({ __NG_ELEMENT_ID__: ee });
      let uE = 0;
      function yt(e) {
        return Mn(() => {
          const n = !0 === e.standalone,
            r = {},
            o = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: r,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === At.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              standalone: n,
              dependencies: (n && e.dependencies) || null,
              getStandaloneInjector: null,
              selectors: e.selectors || K,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || Gt.Emulated,
              id: "c" + uE++,
              styles: e.styles || K,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            i = e.dependencies,
            s = e.features;
          return (
            (o.inputs = Xf(e.inputs, r)),
            (o.outputs = Xf(e.outputs)),
            s && s.forEach((a) => a(o)),
            (o.directiveDefs = i
              ? () => ("function" == typeof i ? i() : i).map(Yf).filter(Jf)
              : null),
            (o.pipeDefs = i
              ? () => ("function" == typeof i ? i() : i).map(qe).filter(Jf)
              : null),
            o
          );
        });
      }
      function Yf(e) {
        return J(e) || We(e);
      }
      function Jf(e) {
        return null !== e;
      }
      function zt(e) {
        return Mn(() => ({
          type: e.type,
          bootstrap: e.bootstrap || K,
          declarations: e.declarations || K,
          imports: e.imports || K,
          exports: e.exports || K,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function Xf(e, t) {
        if (null == e) return gr;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      const F = yt;
      function J(e) {
        return e[Bi] || null;
      }
      function We(e) {
        return e[iu] || null;
      }
      function qe(e) {
        return e[su] || null;
      }
      function at(e, t) {
        const n = e[Kf] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${te(e)} does not have '\u0275mod' property.`);
        return n;
      }
      const j = 11;
      function tt(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function xt(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function lu(e) {
        return 0 != (8 & e.flags);
      }
      function Gi(e) {
        return 2 == (2 & e.flags);
      }
      function zi(e) {
        return 1 == (1 & e.flags);
      }
      function Nt(e) {
        return null !== e.template;
      }
      function pE(e) {
        return 0 != (256 & e[2]);
      }
      function Qn(e, t) {
        return e.hasOwnProperty(sn) ? e[sn] : null;
      }
      class yE {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function _t() {
        return nh;
      }
      function nh(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = _E), vE;
      }
      function vE() {
        const e = oh(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === gr) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function _E(e, t, n, r) {
        const o =
            oh(e) ||
            (function DE(e, t) {
              return (e[rh] = t);
            })(e, { previous: gr, current: null }),
          i = o.current || (o.current = {}),
          s = o.previous,
          a = this.declaredInputs[n],
          u = s[a];
        (i[a] = new yE(u && u.currentValue, t, s === gr)), (e[r] = t);
      }
      _t.ngInherit = !0;
      const rh = "__ngSimpleChanges__";
      function oh(e) {
        return e[rh] || null;
      }
      function Ce(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function Wi(e, t) {
        return Ce(t[e]);
      }
      function lt(e, t) {
        return Ce(t[e.index]);
      }
      function pu(e, t) {
        return e.data[t];
      }
      function ct(e, t) {
        const n = t[e];
        return tt(n) ? n : n[0];
      }
      function qi(e) {
        return 64 == (64 & e[2]);
      }
      function Sn(e, t) {
        return null == t ? null : e[t];
      }
      function ih(e) {
        e[18] = 0;
      }
      function gu(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (
          ;
          null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5]));

        )
          (r[5] += t), (n = r), (r = r[3]);
      }
      const O = { lFrame: gh(null), bindingsEnabled: !0 };
      function ah() {
        return O.bindingsEnabled;
      }
      function v() {
        return O.lFrame.lView;
      }
      function q() {
        return O.lFrame.tView;
      }
      function mu(e) {
        return (O.lFrame.contextLView = e), e[8];
      }
      function yu(e) {
        return (O.lFrame.contextLView = null), e;
      }
      function Ie() {
        let e = uh();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function uh() {
        return O.lFrame.currentTNode;
      }
      function Wt(e, t) {
        const n = O.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function vu() {
        return O.lFrame.isParent;
      }
      function Cr() {
        return O.lFrame.bindingIndex++;
      }
      function un(e) {
        const t = O.lFrame,
          n = t.bindingIndex;
        return (t.bindingIndex = t.bindingIndex + e), n;
      }
      function PE(e, t) {
        const n = O.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Du(t);
      }
      function Du(e) {
        O.lFrame.currentDirectiveIndex = e;
      }
      function fh() {
        return O.lFrame.currentQueryIndex;
      }
      function wu(e) {
        O.lFrame.currentQueryIndex = e;
      }
      function LE(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function hh(e, t, n) {
        if (n & x.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & x.Host ||
              ((o = LE(i)), null === o || ((i = i[15]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (O.lFrame = ph());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function Eu(e) {
        const t = ph(),
          n = e[1];
        (O.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function ph() {
        const e = O.lFrame,
          t = null === e ? null : e.child;
        return null === t ? gh(e) : t;
      }
      function gh(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function mh() {
        const e = O.lFrame;
        return (
          (O.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const yh = mh;
      function bu() {
        const e = mh();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Qe() {
        return O.lFrame.selectedIndex;
      }
      function In(e) {
        O.lFrame.selectedIndex = e;
      }
      function ce() {
        const e = O.lFrame;
        return pu(e.tView, e.selectedIndex);
      }
      function Zi(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: u,
              ngAfterViewChecked: l,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            u && (e.viewHooks || (e.viewHooks = [])).push(-n, u),
            l &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, l),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, l)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function Qi(e, t, n) {
        vh(e, t, 3, n);
      }
      function Ki(e, t, n, r) {
        (3 & e[2]) === n && vh(e, t, n, r);
      }
      function Mu(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function vh(e, t, n, r) {
        const i = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let u = void 0 !== r ? 65535 & e[18] : 0; u < s; u++)
          if ("number" == typeof t[u + 1]) {
            if (((a = t[u]), null != r && a >= r)) break;
          } else
            t[u] < 0 && (e[18] += 65536),
              (a < i || -1 == i) &&
                (WE(e, n, t, u), (e[18] = (4294901760 & e[18]) + u + 2)),
              u++;
      }
      function WE(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              i.call(a);
            } finally {
            }
          }
        } else
          try {
            i.call(a);
          } finally {
          }
      }
      class _o {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Yi(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const o = n[r];
          if ("number" == typeof o) {
            if (0 !== o) break;
            r++;
            const i = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, i);
          } else {
            const i = o,
              s = n[++r];
            Dh(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
          }
        }
        return r;
      }
      function _h(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function Dh(e) {
        return 64 === e.charCodeAt(0);
      }
      function Ji(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  Ch(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function Ch(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      function wh(e) {
        return -1 !== e;
      }
      function wr(e) {
        return 32767 & e;
      }
      function Er(e, t) {
        let n = (function YE(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let Iu = !0;
      function Xi(e) {
        const t = Iu;
        return (Iu = e), t;
      }
      let JE = 0;
      const qt = {};
      function Co(e, t) {
        const n = Tu(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          Au(r.data, e),
          Au(t, null),
          Au(r.blueprint, null));
        const o = es(e, t),
          i = e.injectorIndex;
        if (wh(o)) {
          const s = wr(o),
            a = Er(o, t),
            u = a[1].data;
          for (let l = 0; l < 8; l++) t[i + l] = a[s + l] | u[s + l];
        }
        return (t[i + 8] = o), i;
      }
      function Au(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Tu(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function es(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          if (((r = Nh(o)), null === r)) return -1;
          if ((n++, (o = o[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function ts(e, t, n) {
        !(function XE(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(ho) && (r = n[ho]),
            null == r && (r = n[ho] = JE++);
          const o = 255 & r;
          t.data[e + (o >> 5)] |= 1 << o;
        })(e, t, n);
      }
      function Mh(e, t, n) {
        if (n & x.Optional || void 0 !== e) return e;
        Li();
      }
      function Sh(e, t, n, r) {
        if (
          (n & x.Optional && void 0 === r && (r = null),
          0 == (n & (x.Self | x.Host)))
        ) {
          const o = e[9],
            i = mt(void 0);
          try {
            return o ? o.get(t, r, n & x.Optional) : Qf(t, r, n & x.Optional);
          } finally {
            mt(i);
          }
        }
        return Mh(r, 0, n);
      }
      function Ih(e, t, n, r = x.Default, o) {
        if (null !== e) {
          if (1024 & t[2]) {
            const s = (function ob(e, t, n, r, o) {
              let i = e,
                s = t;
              for (
                ;
                null !== i && null !== s && 1024 & s[2] && !(256 & s[2]);

              ) {
                const a = Ah(i, s, n, r | x.Self, qt);
                if (a !== qt) return a;
                let u = i.parent;
                if (!u) {
                  const l = s[21];
                  if (l) {
                    const c = l.get(n, qt, r);
                    if (c !== qt) return c;
                  }
                  (u = Nh(s)), (s = s[15]);
                }
                i = u;
              }
              return o;
            })(e, t, n, r, qt);
            if (s !== qt) return s;
          }
          const i = Ah(e, t, n, r, qt);
          if (i !== qt) return i;
        }
        return Sh(t, n, r, o);
      }
      function Ah(e, t, n, r, o) {
        const i = (function nb(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(ho) ? e[ho] : void 0;
          return "number" == typeof t ? (t >= 0 ? 255 & t : rb) : t;
        })(n);
        if ("function" == typeof i) {
          if (!hh(t, e, r)) return r & x.Host ? Mh(o, 0, r) : Sh(t, n, r, o);
          try {
            const s = i(r);
            if (null != s || r & x.Optional) return s;
            Li();
          } finally {
            yh();
          }
        } else if ("number" == typeof i) {
          let s = null,
            a = Tu(e, t),
            u = -1,
            l = r & x.Host ? t[16][6] : null;
          for (
            (-1 === a || r & x.SkipSelf) &&
            ((u = -1 === a ? es(e, t) : t[a + 8]),
            -1 !== u && xh(r, !1)
              ? ((s = t[1]), (a = wr(u)), (t = Er(u, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const c = t[1];
            if (Th(i, a, c.data)) {
              const d = tb(a, t, n, s, r, l);
              if (d !== qt) return d;
            }
            (u = t[a + 8]),
              -1 !== u && xh(r, t[1].data[a + 8] === l) && Th(i, a, t)
                ? ((s = c), (a = wr(u)), (t = Er(u, t)))
                : (a = -1);
          }
        }
        return o;
      }
      function tb(e, t, n, r, o, i) {
        const s = t[1],
          a = s.data[e + 8],
          c = ns(
            a,
            s,
            n,
            null == r ? Gi(a) && Iu : r != s && 0 != (3 & a.type),
            o & x.Host && i === a
          );
        return null !== c ? wo(t, s, c, a) : qt;
      }
      function ns(e, t, n, r, o) {
        const i = e.providerIndexes,
          s = t.data,
          a = 1048575 & i,
          u = e.directiveStart,
          c = i >> 20,
          f = o ? a + c : e.directiveEnd;
        for (let h = r ? a : a + c; h < f; h++) {
          const p = s[h];
          if ((h < u && n === p) || (h >= u && p.type === n)) return h;
        }
        if (o) {
          const h = s[u];
          if (h && Nt(h) && h.type === n) return u;
        }
        return null;
      }
      function wo(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function qE(e) {
            return e instanceof _o;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function Jw(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new C(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function Q(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : P(e);
              })(i[n])
            );
          const a = Xi(s.canSeeViewProviders);
          s.resolving = !0;
          const u = s.injectImpl ? mt(s.injectImpl) : null;
          hh(e, r, x.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function zE(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = nh(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  o &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== u && mt(u), Xi(a), (s.resolving = !1), yh();
          }
        }
        return o;
      }
      function Th(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function xh(e, t) {
        return !(e & x.Self || (e & x.Host && t));
      }
      class br {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return Ih(this._tNode, this._lView, t, r, n);
        }
      }
      function rb() {
        return new br(Ie(), v());
      }
      function xu(e) {
        return nu(e)
          ? () => {
              const t = xu(R(e));
              return t && t();
            }
          : Qn(e);
      }
      function Nh(e) {
        const t = e[1],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[6] : null;
      }
      function Eo(e) {
        return (function eb(e, t) {
          if ("class" === t) return e.classes;
          if ("style" === t) return e.styles;
          const n = e.attrs;
          if (n) {
            const r = n.length;
            let o = 0;
            for (; o < r; ) {
              const i = n[o];
              if (_h(i)) break;
              if (0 === i) o += 2;
              else if ("number" == typeof i)
                for (o++; o < r && "string" == typeof n[o]; ) o++;
              else {
                if (i === t) return n[o + 1];
                o += 2;
              }
            }
          }
          return null;
        })(Ie(), e);
      }
      const Sr = "__parameters__";
      function Ar(e, t, n) {
        return Mn(() => {
          const r = (function Nu(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(u, l, c) {
              const d = u.hasOwnProperty(Sr)
                ? u[Sr]
                : Object.defineProperty(u, Sr, { value: [] })[Sr];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), u;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      class S {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = V({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      function dt(e, t) {
        void 0 === t && (t = e);
        for (let n = 0; n < e.length; n++) {
          let r = e[n];
          Array.isArray(r)
            ? (t === e && (t = e.slice(0, n)), dt(r, t))
            : t !== e && t.push(r);
        }
        return t;
      }
      function ln(e, t) {
        e.forEach((n) => (Array.isArray(n) ? ln(n, t) : t(n)));
      }
      function Fh(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function rs(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function ft(e, t, n) {
        let r = Tr(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function ub(e, t, n, r) {
                let o = e.length;
                if (o == t) e.push(n, r);
                else if (1 === o) e.push(r, e[0]), (e[0] = n);
                else {
                  for (o--, e.push(e[o - 1], e[o]); o > t; )
                    (e[o] = e[o - 2]), o--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function Fu(e, t) {
        const n = Tr(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Tr(e, t) {
        return (function kh(e, t, n) {
          let r = 0,
            o = e.length >> n;
          for (; o !== r; ) {
            const i = r + ((o - r) >> 1),
              s = e[i << n];
            if (t === s) return i << n;
            s > t ? (o = i) : (r = i + 1);
          }
          return ~(o << n);
        })(e, t, 1);
      }
      const Io = {},
        Pu = "__NG_DI_FLAG__",
        is = "ngTempTokenPath",
        mb = /\n/gm,
        Lh = "__source";
      let Ao;
      function xr(e) {
        const t = Ao;
        return (Ao = e), t;
      }
      function vb(e, t = x.Default) {
        if (void 0 === Ao) throw new C(-203, !1);
        return null === Ao
          ? Qf(e, void 0, t)
          : Ao.get(e, t & x.Optional ? null : void 0, t);
      }
      function A(e, t = x.Default) {
        return (
          (function aE() {
            return ou;
          })() || vb
        )(R(e), t);
      }
      function me(e, t = x.Default) {
        return (
          "number" != typeof t &&
            (t =
              0 |
              (t.optional && 8) |
              (t.host && 1) |
              (t.self && 2) |
              (t.skipSelf && 4)),
          A(e, t)
        );
      }
      function ku(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = R(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new C(900, !1);
            let o,
              i = x.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                u = _b(a);
              "number" == typeof u
                ? -1 === u
                  ? (o = a.token)
                  : (i |= u)
                : (o = a);
            }
            t.push(A(o, i));
          } else t.push(A(r));
        }
        return t;
      }
      function To(e, t) {
        return (e[Pu] = t), (e.prototype[Pu] = t), e;
      }
      function _b(e) {
        return e[Pu];
      }
      const xo = To(Ar("Optional"), 8),
        No = To(Ar("SkipSelf"), 4);
      var nt = (() => (
        ((nt = nt || {})[(nt.Important = 1)] = "Important"),
        (nt[(nt.DashCase = 2)] = "DashCase"),
        nt
      ))();
      const $u = new Map();
      let Lb = 0;
      const Hu = "__ngContext__";
      function $e(e, t) {
        tt(t)
          ? ((e[Hu] = t[20]),
            (function jb(e) {
              $u.set(e[20], e);
            })(t))
          : (e[Hu] = t);
      }
      function zu(e, t) {
        return undefined(e, t);
      }
      function Po(e) {
        const t = e[3];
        return xt(t) ? t[3] : t;
      }
      function Wu(e) {
        return op(e[13]);
      }
      function qu(e) {
        return op(e[4]);
      }
      function op(e) {
        for (; null !== e && !xt(e); ) e = e[4];
        return e;
      }
      function Rr(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          xt(r) ? (i = r) : tt(r) && ((s = !0), (r = r[0]));
          const a = Ce(r);
          0 === e && null !== n
            ? null == o
              ? cp(t, n, a)
              : Kn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? Kn(t, n, a, o || null, !0)
            : 2 === e
            ? (function el(e, t, n) {
                const r = us(e, t);
                r &&
                  (function aM(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function cM(e, t, n, r, o) {
                const i = n[7];
                i !== Ce(n) && Rr(t, e, r, i, o);
                for (let a = 10; a < n.length; a++) {
                  const u = n[a];
                  ko(u[1], u, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function Qu(e, t, n) {
        return e.createElement(t, n);
      }
      function sp(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          o = t[3];
        512 & t[2] && ((t[2] &= -513), gu(o, -1)), n.splice(r, 1);
      }
      function Ku(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const o = r[17];
          null !== o && o !== e && sp(o, r), t > 0 && (e[n - 1][4] = r[4]);
          const i = rs(e, 10 + t);
          !(function Xb(e, t) {
            ko(e, t, t[j], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = i[19];
          null !== s && s.detachView(i[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -65);
        }
        return r;
      }
      function ap(e, t) {
        if (!(128 & t[2])) {
          const n = t[j];
          n.destroyNode && ko(e, t, n, 3, null, null),
            (function nM(e) {
              let t = e[13];
              if (!t) return Yu(e[1], e);
              for (; t; ) {
                let n = null;
                if (tt(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; )
                    tt(t) && Yu(t[1], t), (t = t[3]);
                  null === t && (t = e), tt(t) && Yu(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function Yu(e, t) {
        if (!(128 & t[2])) {
          (t[2] &= -65),
            (t[2] |= 128),
            (function sM(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof _o)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          u = i[s + 1];
                        try {
                          u.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        i.call(o);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function iM(e, t) {
              const n = e.cleanup,
                r = t[7];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 1],
                      a = "function" == typeof s ? s(t) : Ce(t[s]),
                      u = r[(o = n[i + 2])],
                      l = n[i + 3];
                    "boolean" == typeof l
                      ? a.removeEventListener(n[i], u, l)
                      : l >= 0
                      ? r[(o = l)]()
                      : r[(o = -l)].unsubscribe(),
                      (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) (0, r[i])();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && t[j].destroy();
          const n = t[17];
          if (null !== n && xt(t[3])) {
            n !== t[3] && sp(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
          !(function Bb(e) {
            $u.delete(e[20]);
          })(t);
        }
      }
      function up(e, t, n) {
        return (function lp(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          if (2 & r.flags) {
            const o = e.data[r.directiveStart].encapsulation;
            if (o === Gt.None || o === Gt.Emulated) return null;
          }
          return lt(r, n);
        })(e, t.parent, n);
      }
      function Kn(e, t, n, r, o) {
        e.insertBefore(t, n, r, o);
      }
      function cp(e, t, n) {
        e.appendChild(t, n);
      }
      function dp(e, t, n, r, o) {
        null !== r ? Kn(e, t, n, r, o) : cp(e, t, n);
      }
      function us(e, t) {
        return e.parentNode(t);
      }
      let ol,
        pp = function hp(e, t, n) {
          return 40 & e.type ? lt(e, n) : null;
        };
      function ls(e, t, n, r) {
        const o = up(e, r, t),
          i = t[j],
          a = (function fp(e, t, n) {
            return pp(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let u = 0; u < n.length; u++) dp(i, o, n[u], a, !1);
          else dp(i, o, n, a, !1);
      }
      function cs(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return lt(t, e);
          if (4 & n) return Xu(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return cs(e, r);
            {
              const o = e[t.index];
              return xt(o) ? Xu(-1, o) : Ce(o);
            }
          }
          if (32 & n) return zu(t, e)() || Ce(e[t.index]);
          {
            const r = mp(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : cs(Po(e[16]), r)
              : cs(e, t.next);
          }
        }
        return null;
      }
      function mp(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function Xu(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[1].firstChild;
          if (null !== o) return cs(r, o);
        }
        return t[7];
      }
      function tl(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            u = n.type;
          if (
            (s && 0 === t && (a && $e(Ce(a), r), (n.flags |= 4)),
            64 != (64 & n.flags))
          )
            if (8 & u) tl(e, t, n.child, r, o, i, !1), Rr(t, e, o, a, i);
            else if (32 & u) {
              const l = zu(n, r);
              let c;
              for (; (c = l()); ) Rr(t, e, o, c, i);
              Rr(t, e, o, a, i);
            } else 16 & u ? yp(e, t, r, n, o, i) : Rr(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function ko(e, t, n, r, o, i) {
        tl(n, r, e.firstChild, t, o, i, !1);
      }
      function yp(e, t, n, r, o, i) {
        const s = n[16],
          u = s[6].projection[r.projection];
        if (Array.isArray(u))
          for (let l = 0; l < u.length; l++) Rr(t, e, o, u[l], i);
        else tl(e, t, u, s[3], o, i, !0);
      }
      function vp(e, t, n) {
        e.setAttribute(t, "style", n);
      }
      function nl(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      class Ep {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      function Tn(e) {
        return e instanceof Ep ? e.changingThisBreaksApplicationSecurity : e;
      }
      const MM =
        /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
      var we = (() => (
        ((we = we || {})[(we.NONE = 0)] = "NONE"),
        (we[(we.HTML = 1)] = "HTML"),
        (we[(we.STYLE = 2)] = "STYLE"),
        (we[(we.SCRIPT = 3)] = "SCRIPT"),
        (we[(we.URL = 4)] = "URL"),
        (we[(we.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        we
      ))();
      function jo(e) {
        const t = (function Bo() {
          const e = v();
          return e && e[12];
        })();
        return t
          ? t.sanitize(we.URL, e) || ""
          : (function Lo(e, t) {
              const n = (function CM(e) {
                return (e instanceof Ep && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(
                  `Required a safe ${t}, got a ${n} (see https://g.co/ng/security#xss)`
                );
              }
              return n === t;
            })(e, "URL")
          ? Tn(e)
          : (function sl(e) {
              return (e = String(e)).match(MM) ? e : "unsafe:" + e;
            })(P(e));
      }
      const cl = new S("ENVIRONMENT_INITIALIZER"),
        Np = new S("INJECTOR", -1),
        Rp = new S("INJECTOR_DEF_TYPES");
      class Fp {
        get(t, n = Io) {
          if (n === Io) {
            const r = new Error(`NullInjectorError: No provider for ${te(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function jM(...e) {
        return { ɵproviders: Op(0, e) };
      }
      function Op(e, ...t) {
        const n = [],
          r = new Set();
        let o;
        return (
          ln(t, (i) => {
            const s = i;
            dl(s, n, [], r) && (o || (o = []), o.push(s));
          }),
          void 0 !== o && Pp(o, n),
          n
        );
      }
      function Pp(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: o } = e[n];
          ln(o, (i) => {
            t.push(i);
          });
        }
      }
      function dl(e, t, n, r) {
        if (!(e = R(e))) return !1;
        let o = null,
          i = qf(e);
        const s = !i && J(e);
        if (i || s) {
          if (s && !s.standalone) return !1;
          o = e;
        } else {
          const u = e.ngModule;
          if (((i = qf(u)), !i)) return !1;
          o = u;
        }
        const a = r.has(o);
        if (s) {
          if (a) return !1;
          if ((r.add(o), s.dependencies)) {
            const u =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const l of u) dl(l, t, n, r);
          }
        } else {
          if (!i) return !1;
          {
            if (null != i.imports && !a) {
              let l;
              r.add(o);
              try {
                ln(i.imports, (c) => {
                  dl(c, t, n, r) && (l || (l = []), l.push(c));
                });
              } finally {
              }
              void 0 !== l && Pp(l, t);
            }
            if (!a) {
              const l = Qn(o) || (() => new o());
              t.push(
                { provide: o, useFactory: l, deps: K },
                { provide: Rp, useValue: o, multi: !0 },
                { provide: cl, useValue: () => A(o), multi: !0 }
              );
            }
            const u = i.providers;
            null == u ||
              a ||
              ln(u, (c) => {
                t.push(c);
              });
          }
        }
        return o !== e && void 0 !== e.providers;
      }
      const BM = ee({ provide: String, useValue: ee });
      function fl(e) {
        return null !== e && "object" == typeof e && BM in e;
      }
      function Jn(e) {
        return "function" == typeof e;
      }
      const hl = new S("Set Injector scope."),
        ps = {},
        UM = {};
      let pl;
      function gs() {
        return void 0 === pl && (pl = new Fp()), pl;
      }
      class xn {}
      class Vp extends xn {
        constructor(t, n, r, o) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = o),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            ml(t, (s) => this.processProvider(s)),
            this.records.set(Np, Fr(void 0, this)),
            o.has("environment") && this.records.set(xn, Fr(void 0, this));
          const i = this.records.get(hl);
          null != i && "string" == typeof i.value && this.scopes.add(i.value),
            (this.injectorDefTypes = new Set(this.get(Rp.multi, K, x.Self)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const t of this._ngOnDestroyHooks) t.ngOnDestroy();
            for (const t of this._onDestroyHooks) t();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear(),
              (this._onDestroyHooks.length = 0);
          }
        }
        onDestroy(t) {
          this._onDestroyHooks.push(t);
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = xr(this),
            r = mt(void 0);
          try {
            return t();
          } finally {
            xr(n), mt(r);
          }
        }
        get(t, n = Io, r = x.Default) {
          this.assertNotDestroyed();
          const o = xr(this),
            i = mt(void 0);
          try {
            if (!(r & x.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const u =
                  (function qM(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof S)
                    );
                  })(t) && Vi(t);
                (a = u && this.injectableDefInScope(u) ? Fr(gl(t), ps) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & x.Self ? gs() : this.parent).get(
              t,
              (n = r & x.Optional && n === Io ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[is] = s[is] || []).unshift(te(t)), o)) throw s;
              return (function Db(e, t, n, r) {
                const o = e[is];
                throw (
                  (t[Lh] && o.unshift(t[Lh]),
                  (e.message = (function Cb(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let o = te(t);
                    if (Array.isArray(t)) o = t.map(te).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : te(a))
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      mb,
                      "\n  "
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[is] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            mt(i), xr(o);
          }
        }
        resolveInjectorInitializers() {
          const t = xr(this),
            n = mt(void 0);
          try {
            const r = this.get(cl.multi, K, x.Self);
            for (const o of r) o();
          } finally {
            xr(t), mt(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(te(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new C(205, !1);
        }
        processProvider(t) {
          let n = Jn((t = R(t))) ? t : R(t && t.provide);
          const r = (function GM(e) {
            return fl(e) ? Fr(void 0, e.useValue) : Fr(jp(e), ps);
          })(t);
          if (Jn(t) || !0 !== t.multi) this.records.get(n);
          else {
            let o = this.records.get(n);
            o ||
              ((o = Fr(void 0, ps, !0)),
              (o.factory = () => ku(o.multi)),
              this.records.set(n, o)),
              (n = t),
              o.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === ps && ((n.value = UM), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function WM(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = R(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
      }
      function gl(e) {
        const t = Vi(e),
          n = null !== t ? t.factory : Qn(e);
        if (null !== n) return n;
        if (e instanceof S) throw new C(204, !1);
        if (e instanceof Function)
          return (function HM(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function So(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new C(204, !1))
              );
            const n = (function oE(e) {
              const t = e && (e[ji] || e[Zf]);
              if (t) {
                const n = (function iE(e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new C(204, !1);
      }
      function jp(e, t, n) {
        let r;
        if (Jn(e)) {
          const o = R(e);
          return Qn(o) || gl(o);
        }
        if (fl(e)) r = () => R(e.useValue);
        else if (
          (function Lp(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...ku(e.deps || []));
        else if (
          (function kp(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => A(R(e.useExisting));
        else {
          const o = R(e && (e.useClass || e.provide));
          if (
            !(function zM(e) {
              return !!e.deps;
            })(e)
          )
            return Qn(o) || gl(o);
          r = () => new o(...ku(e.deps));
        }
        return r;
      }
      function Fr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function ZM(e) {
        return !!e.ɵproviders;
      }
      function ml(e, t) {
        for (const n of e)
          Array.isArray(n) ? ml(n, t) : ZM(n) ? ml(n.ɵproviders, t) : t(n);
      }
      class Bp {}
      class YM {
        resolveComponentFactory(t) {
          throw (function KM(e) {
            const t = Error(
              `No component factory found for ${te(
                e
              )}. Did you add it to @NgModule.entryComponents?`
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let $o = (() => {
        class e {}
        return (e.NULL = new YM()), e;
      })();
      function JM() {
        return Or(Ie(), v());
      }
      function Or(e, t) {
        return new ht(lt(e, t));
      }
      let ht = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = JM), e;
      })();
      function XM(e) {
        return e instanceof ht ? e.nativeElement : e;
      }
      class Up {}
      let dn = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function e0() {
                const e = v(),
                  n = ct(Ie().index, e);
                return (tt(n) ? n : e)[j];
              })()),
            e
          );
        })(),
        t0 = (() => {
          class e {}
          return (
            (e.ɵprov = V({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class Uo {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const n0 = new Uo("14.3.0"),
        yl = {};
      function _l(e) {
        return e.ngOriginalError;
      }
      class Pr {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && _l(t);
          for (; n && _l(n); ) n = _l(n);
          return n || null;
        }
      }
      function Hp(e) {
        return e.ownerDocument.defaultView;
      }
      function fn(e) {
        return e instanceof Function ? e() : e;
      }
      function zp(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const Wp = "ng-template";
      function h0(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let o = e[r++];
          if (n && "class" === o) {
            if (((o = e[r]), -1 !== zp(o.toLowerCase(), t, 0))) return !0;
          } else if (1 === o) {
            for (; r < e.length && "string" == typeof (o = e[r++]); )
              if (o.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function qp(e) {
        return 4 === e.type && e.value !== Wp;
      }
      function p0(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Wp);
      }
      function g0(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function v0(e) {
            for (let t = 0; t < e.length; t++) if (_h(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const u = t[a];
          if ("number" != typeof u) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== u && !p0(e, u, n)) || ("" === u && 1 === t.length))
                ) {
                  if (Rt(r)) return !1;
                  s = !0;
                }
              } else {
                const l = 8 & r ? u : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!h0(e.attrs, l, n)) {
                    if (Rt(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = m0(8 & r ? "class" : u, o, qp(e), n);
                if (-1 === d) {
                  if (Rt(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== l) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== zp(h, l, 0)) || (2 & r && l !== f)) {
                    if (Rt(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Rt(r) && !Rt(u)) return !1;
            if (s && Rt(u)) continue;
            (s = !1), (r = u | (1 & r));
          }
        }
        return Rt(r) || s;
      }
      function Rt(e) {
        return 0 == (1 & e);
      }
      function m0(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function _0(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function Zp(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (g0(e, t[r], n)) return !0;
        return !1;
      }
      function Qp(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function C0(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !Rt(s) && ((t += Qp(i, o)), (o = "")),
              (r = s),
              (i = i || !Rt(r));
          n++;
        }
        return "" !== o && (t += Qp(i, o)), t;
      }
      const k = {};
      function Te(e) {
        Kp(q(), v(), Qe() + e, !1);
      }
      function Kp(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const i = e.preOrderCheckHooks;
            null !== i && Qi(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && Ki(t, i, 0, n);
          }
        In(n);
      }
      function eg(e, t = null, n = null, r) {
        const o = tg(e, t, n, r);
        return o.resolveInjectorInitializers(), o;
      }
      function tg(e, t = null, n = null, r, o = new Set()) {
        const i = [n || K, jM(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : te(e))),
          new Vp(i, t || gs(), r || null, o)
        );
      }
      let Ct = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return eg({ name: "" }, r, n, "");
            {
              const o = n.name ?? "";
              return eg({ name: o }, n.parent, n.providers, o);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = Io),
          (e.NULL = new Fp()),
          (e.ɵprov = V({ token: e, providedIn: "any", factory: () => A(Np) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function _(e, t = x.Default) {
        const n = v();
        return null === n ? A(e, t) : Ih(Ie(), n, R(e), t);
      }
      function bl() {
        throw new Error("invalid");
      }
      function ys(e, t) {
        return (e << 17) | (t << 2);
      }
      function Ft(e) {
        return (e >> 17) & 32767;
      }
      function Ml(e) {
        return 2 | e;
      }
      function hn(e) {
        return (131068 & e) >> 2;
      }
      function Sl(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function Il(e) {
        return 1 | e;
      }
      function vg(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r],
              i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              wu(o), s.contentQueries(2, t[i], i);
            }
          }
      }
      function Ds(e, t, n, r, o, i, s, a, u, l, c) {
        const d = t.blueprint.slice();
        return (
          (d[0] = o),
          (d[2] = 76 | r),
          (null !== c || (e && 1024 & e[2])) && (d[2] |= 1024),
          ih(d),
          (d[3] = d[15] = e),
          (d[8] = n),
          (d[10] = s || (e && e[10])),
          (d[j] = a || (e && e[j])),
          (d[12] = u || (e && e[12]) || null),
          (d[9] = l || (e && e[9]) || null),
          (d[6] = i),
          (d[20] = (function Vb() {
            return Lb++;
          })()),
          (d[21] = c),
          (d[16] = 2 == t.type ? e[16] : d),
          d
        );
      }
      function Vr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function Pl(e, t, n, r, o) {
            const i = uh(),
              s = vu(),
              u = (e.data[t] = (function rS(e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = u),
              null !== i &&
                (s
                  ? null == i.child && null !== u.parent && (i.child = u)
                  : null === i.next && (i.next = u)),
              u
            );
          })(e, t, n, r, o)),
            (function OE() {
              return O.lFrame.inI18n;
            })() && (i.flags |= 64);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function vo() {
            const e = O.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Wt(i, !0), i;
      }
      function jr(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function kl(e, t, n) {
        Eu(t);
        try {
          const r = e.viewQuery;
          null !== r && Gl(1, r, n);
          const o = e.template;
          null !== o && _g(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && vg(e, t),
            e.staticViewQueries && Gl(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function eS(e, t) {
              for (let n = 0; n < t.length; n++) _S(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), bu();
        }
      }
      function Cs(e, t, n, r) {
        const o = t[2];
        if (128 != (128 & o)) {
          Eu(t);
          try {
            ih(t),
              (function ch(e) {
                return (O.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && _g(e, t, n, 2, r);
            const s = 3 == (3 & o);
            if (s) {
              const l = e.preOrderCheckHooks;
              null !== l && Qi(t, l, null);
            } else {
              const l = e.preOrderHooks;
              null !== l && Ki(t, l, 0, null), Mu(t, 0);
            }
            if (
              ((function yS(e) {
                for (let t = Wu(e); null !== t; t = qu(t)) {
                  if (!t[2]) continue;
                  const n = t[9];
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r],
                      i = o[3];
                    0 == (512 & o[2]) && gu(i, 1), (o[2] |= 512);
                  }
                }
              })(t),
              (function mS(e) {
                for (let t = Wu(e); null !== t; t = qu(t))
                  for (let n = 10; n < t.length; n++) {
                    const r = t[n],
                      o = r[1];
                    qi(r) && Cs(o, r, o.template, r[8]);
                  }
              })(t),
              null !== e.contentQueries && vg(e, t),
              s)
            ) {
              const l = e.contentCheckHooks;
              null !== l && Qi(t, l);
            } else {
              const l = e.contentHooks;
              null !== l && Ki(t, l, 1), Mu(t, 1);
            }
            !(function J0(e, t) {
              const n = e.hostBindingOpCodes;
              if (null !== n)
                try {
                  for (let r = 0; r < n.length; r++) {
                    const o = n[r];
                    if (o < 0) In(~o);
                    else {
                      const i = o,
                        s = n[++r],
                        a = n[++r];
                      PE(s, i), a(2, t[i]);
                    }
                  }
                } finally {
                  In(-1);
                }
            })(e, t);
            const a = e.components;
            null !== a &&
              (function X0(e, t) {
                for (let n = 0; n < t.length; n++) vS(e, t[n]);
              })(t, a);
            const u = e.viewQuery;
            if ((null !== u && Gl(2, u, r), s)) {
              const l = e.viewCheckHooks;
              null !== l && Qi(t, l);
            } else {
              const l = e.viewHooks;
              null !== l && Ki(t, l, 2), Mu(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[2] &= -41),
              512 & t[2] && ((t[2] &= -513), gu(t[3], -1));
          } finally {
            bu();
          }
        }
      }
      function _g(e, t, n, r, o) {
        const i = Qe(),
          s = 2 & r;
        try {
          In(-1), s && t.length > 22 && Kp(e, t, 22, !1), n(r, o);
        } finally {
          In(i);
        }
      }
      function Ll(e, t, n) {
        !ah() ||
          ((function uS(e, t, n, r) {
            const o = n.directiveStart,
              i = n.directiveEnd;
            e.firstCreatePass || Co(n, t), $e(r, t);
            const s = n.initialInputs;
            for (let a = o; a < i; a++) {
              const u = e.data[a],
                l = Nt(u);
              l && hS(t, n, u);
              const c = wo(t, e, a, n);
              $e(c, t),
                null !== s && pS(0, a - o, c, u, 0, s),
                l && (ct(n.index, t)[8] = c);
            }
          })(e, t, n, lt(n, t)),
          128 == (128 & n.flags) &&
            (function lS(e, t, n) {
              const r = n.directiveStart,
                o = n.directiveEnd,
                i = n.index,
                s = (function kE() {
                  return O.lFrame.currentDirectiveIndex;
                })();
              try {
                In(i);
                for (let a = r; a < o; a++) {
                  const u = e.data[a],
                    l = t[a];
                  Du(a),
                    (null !== u.hostBindings ||
                      0 !== u.hostVars ||
                      null !== u.hostAttrs) &&
                      Ig(u, l);
                }
              } finally {
                In(-1), Du(s);
              }
            })(e, t, n));
      }
      function Vl(e, t, n = lt) {
        const r = t.localNames;
        if (null !== r) {
          let o = t.index + 1;
          for (let i = 0; i < r.length; i += 2) {
            const s = r[i + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[o++] = a;
          }
        }
      }
      function Cg(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = jl(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts
            ))
          : t;
      }
      function jl(e, t, n, r, o, i, s, a, u, l) {
        const c = 22 + r,
          d = c + o,
          f = (function tS(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : k);
            return n;
          })(c, d),
          h = "function" == typeof l ? l() : l;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: u,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function wg(e, t, n, r) {
        const o = Rg(t);
        null === n
          ? o.push(r)
          : (o.push(n), e.firstCreatePass && Fg(e).push(r, o.length - 1));
      }
      function Eg(e, t, n) {
        for (let r in e)
          if (e.hasOwnProperty(r)) {
            const o = e[r];
            (n = null === n ? {} : n).hasOwnProperty(r)
              ? n[r].push(t, o)
              : (n[r] = [t, o]);
          }
        return n;
      }
      function bg(e, t) {
        const r = t.directiveEnd,
          o = e.data,
          i = t.attrs,
          s = [];
        let a = null,
          u = null;
        for (let l = t.directiveStart; l < r; l++) {
          const c = o[l],
            d = c.inputs,
            f = null === i || qp(t) ? null : gS(d, i);
          s.push(f), (a = Eg(d, l, a)), (u = Eg(c.outputs, l, u));
        }
        null !== a &&
          (a.hasOwnProperty("class") && (t.flags |= 16),
          a.hasOwnProperty("style") && (t.flags |= 32)),
          (t.initialInputs = s),
          (t.inputs = a),
          (t.outputs = u);
      }
      function Mg(e, t) {
        const n = ct(t, e);
        16 & n[2] || (n[2] |= 32);
      }
      function Bl(e, t, n, r) {
        let o = !1;
        if (ah()) {
          const i = (function cS(e, t, n) {
              const r = e.directiveRegistry;
              let o = null;
              if (r)
                for (let i = 0; i < r.length; i++) {
                  const s = r[i];
                  Zp(n, s.selectors, !1) &&
                    (o || (o = []),
                    ts(Co(n, t), e, s.type),
                    Nt(s) ? (Ag(e, n), o.unshift(s)) : o.push(s));
                }
              return o;
            })(e, t, n),
            s = null === r ? null : { "": -1 };
          if (null !== i) {
            (o = !0), Tg(n, e.data.length, i.length);
            for (let c = 0; c < i.length; c++) {
              const d = i[c];
              d.providersResolver && d.providersResolver(d);
            }
            let a = !1,
              u = !1,
              l = jr(e, t, i.length, null);
            for (let c = 0; c < i.length; c++) {
              const d = i[c];
              (n.mergedAttrs = Ji(n.mergedAttrs, d.hostAttrs)),
                xg(e, n, t, l, d),
                fS(l, d, s),
                null !== d.contentQueries && (n.flags |= 8),
                (null !== d.hostBindings ||
                  null !== d.hostAttrs ||
                  0 !== d.hostVars) &&
                  (n.flags |= 128);
              const f = d.type.prototype;
              !a &&
                (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                ((e.preOrderHooks || (e.preOrderHooks = [])).push(n.index),
                (a = !0)),
                !u &&
                  (f.ngOnChanges || f.ngDoCheck) &&
                  ((e.preOrderCheckHooks || (e.preOrderCheckHooks = [])).push(
                    n.index
                  ),
                  (u = !0)),
                l++;
            }
            bg(e, n);
          }
          s &&
            (function dS(e, t, n) {
              if (t) {
                const r = (e.localNames = []);
                for (let o = 0; o < t.length; o += 2) {
                  const i = n[t[o + 1]];
                  if (null == i) throw new C(-301, !1);
                  r.push(t[o], i);
                }
              }
            })(n, r, s);
        }
        return (n.mergedAttrs = Ji(n.mergedAttrs, n.attrs)), o;
      }
      function Sg(e, t, n, r, o, i) {
        const s = i.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const u = ~t.index;
          (function aS(e) {
            let t = e.length;
            for (; t > 0; ) {
              const n = e[--t];
              if ("number" == typeof n && n < 0) return n;
            }
            return 0;
          })(a) != u && a.push(u),
            a.push(r, o, s);
        }
      }
      function Ig(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Ag(e, t) {
        (t.flags |= 2), (e.components || (e.components = [])).push(t.index);
      }
      function fS(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          Nt(t) && (n[""] = e);
        }
      }
      function Tg(e, t, n) {
        (e.flags |= 1),
          (e.directiveStart = t),
          (e.directiveEnd = t + n),
          (e.providerIndexes = t);
      }
      function xg(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = Qn(o.type)),
          s = new _o(i, Nt(o), _);
        (e.blueprint[r] = s),
          (n[r] = s),
          Sg(e, t, 0, r, jr(e, n, o.hostVars, k), o);
      }
      function hS(e, t, n) {
        const r = lt(t, e),
          o = Cg(n),
          i = e[10],
          s = ws(
            e,
            Ds(
              e,
              o,
              null,
              n.onPush ? 32 : 16,
              r,
              t,
              i,
              i.createRenderer(r, n),
              null,
              null,
              null
            )
          );
        e[t.index] = s;
      }
      function Zt(e, t, n, r, o, i) {
        const s = lt(e, t);
        !(function $l(e, t, n, r, o, i, s) {
          if (null == i) e.removeAttribute(t, o, n);
          else {
            const a = null == s ? P(i) : s(i, r || "", o);
            e.setAttribute(t, o, a, n);
          }
        })(t[j], s, i, e.value, n, r, o);
      }
      function pS(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let u = 0; u < s.length; ) {
            const l = s[u++],
              c = s[u++],
              d = s[u++];
            null !== a ? r.setInput(n, d, l, c) : (n[c] = d);
          }
        }
      }
      function gS(e, t) {
        let n = null,
          r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              e.hasOwnProperty(o) &&
                (null === n && (n = []), n.push(o, e[o], t[r + 1])),
                (r += 2);
            } else r += 2;
          else r += 4;
        }
        return n;
      }
      function Ng(e, t, n, r) {
        return new Array(e, !0, !1, t, null, 0, r, n, null, null);
      }
      function vS(e, t) {
        const n = ct(t, e);
        if (qi(n)) {
          const r = n[1];
          48 & n[2] ? Cs(r, n, r.template, n[8]) : n[5] > 0 && Ul(n);
        }
      }
      function Ul(e) {
        for (let r = Wu(e); null !== r; r = qu(r))
          for (let o = 10; o < r.length; o++) {
            const i = r[o];
            if (qi(i))
              if (512 & i[2]) {
                const s = i[1];
                Cs(s, i, s.template, i[8]);
              } else i[5] > 0 && Ul(i);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = ct(n[r], e);
            qi(o) && o[5] > 0 && Ul(o);
          }
      }
      function _S(e, t) {
        const n = ct(t, e),
          r = n[1];
        (function DS(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          kl(r, n, n[8]);
      }
      function ws(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function Hl(e) {
        for (; e; ) {
          e[2] |= 32;
          const t = Po(e);
          if (pE(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function Es(e, t, n, r = !0) {
        const o = t[10];
        o.begin && o.begin();
        try {
          Cs(e, t, e.template, n);
        } catch (s) {
          throw (r && Pg(t, s), s);
        } finally {
          o.end && o.end();
        }
      }
      function Gl(e, t, n) {
        wu(0), t(e, n);
      }
      function Rg(e) {
        return e[7] || (e[7] = []);
      }
      function Fg(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function Pg(e, t) {
        const n = e[9],
          r = n ? n.get(Pr, null) : null;
        r && r.handleError(t);
      }
      function zl(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            u = t[s],
            l = e.data[s];
          null !== l.setInput ? l.setInput(u, o, r, a) : (u[a] = o);
        }
      }
      function bs(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = tu(o, a))
              : 2 == i && (r = tu(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      function Ms(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(Ce(i)), xt(i)))
            for (let a = 10; a < i.length; a++) {
              const u = i[a],
                l = u[1].firstChild;
              null !== l && Ms(u[1], u, l, r);
            }
          const s = n.type;
          if (8 & s) Ms(e, t, n.child, r);
          else if (32 & s) {
            const a = zu(n, t);
            let u;
            for (; (u = a()); ) r.push(u);
          } else if (16 & s) {
            const a = mp(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const u = Po(t[16]);
              Ms(u[1], u, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class Ho {
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return Ms(n, t, n.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 128 == (128 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (xt(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (Ku(t, r), rs(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          ap(this._lView[1], this._lView);
        }
        onDestroy(t) {
          wg(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          Hl(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -65;
        }
        reattach() {
          this._lView[2] |= 64;
        }
        detectChanges() {
          Es(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new C(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function tM(e, t) {
              ko(e, t, t[j], 2, null, null);
            })(this._lView[1], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new C(902, !1);
          this._appRef = t;
        }
      }
      class CS extends Ho {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          Es(t[1], t, t[8], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class Wl extends $o {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = J(t);
          return new Go(n, this.ngModule);
        }
      }
      function kg(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class ES {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          const o = this.injector.get(t, yl, r);
          return o !== yl || n === yl ? o : this.parentInjector.get(t, n, r);
        }
      }
      class Go extends Bp {
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function w0(e) {
              return e.map(C0).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        get inputs() {
          return kg(this.componentDef.inputs);
        }
        get outputs() {
          return kg(this.componentDef.outputs);
        }
        create(t, n, r, o) {
          let i = (o = o || this.ngModule) instanceof xn ? o : o?.injector;
          i &&
            null !== this.componentDef.getStandaloneInjector &&
            (i = this.componentDef.getStandaloneInjector(i) || i);
          const s = i ? new ES(t, i) : t,
            a = s.get(Up, null);
          if (null === a) throw new C(407, !1);
          const u = s.get(t0, null),
            l = a.createRenderer(null, this.componentDef),
            c = this.componentDef.selectors[0][0] || "div",
            d = r
              ? (function nS(e, t, n) {
                  return e.selectRootElement(t, n === Gt.ShadowDom);
                })(l, r, this.componentDef.encapsulation)
              : Qu(
                  l,
                  c,
                  (function wS(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(c)
                ),
            f = this.componentDef.onPush ? 288 : 272,
            h = jl(0, null, null, 1, 0, null, null, null, null, null),
            p = Ds(null, h, null, f, null, null, a, l, u, s, null);
          let g, m;
          Eu(p);
          try {
            const D = (function SS(e, t, n, r, o, i) {
              const s = n[1];
              n[22] = e;
              const u = Vr(s, 22, 2, "#host", null),
                l = (u.mergedAttrs = t.hostAttrs);
              null !== l &&
                (bs(u, l, !0),
                null !== e &&
                  (Yi(o, e, l),
                  null !== u.classes && nl(o, e, u.classes),
                  null !== u.styles && vp(o, e, u.styles)));
              const c = r.createRenderer(e, t),
                d = Ds(
                  n,
                  Cg(t),
                  null,
                  t.onPush ? 32 : 16,
                  n[22],
                  u,
                  r,
                  c,
                  i || null,
                  null,
                  null
                );
              return (
                s.firstCreatePass &&
                  (ts(Co(u, n), s, t.type), Ag(s, u), Tg(u, n.length, 1)),
                ws(n, d),
                (n[22] = d)
              );
            })(d, this.componentDef, p, a, l);
            if (d)
              if (r) Yi(l, d, ["ng-version", n0.full]);
              else {
                const { attrs: w, classes: y } = (function E0(e) {
                  const t = [],
                    n = [];
                  let r = 1,
                    o = 2;
                  for (; r < e.length; ) {
                    let i = e[r];
                    if ("string" == typeof i)
                      2 === o
                        ? "" !== i && t.push(i, e[++r])
                        : 8 === o && n.push(i);
                    else {
                      if (!Rt(o)) break;
                      o = i;
                    }
                    r++;
                  }
                  return { attrs: t, classes: n };
                })(this.componentDef.selectors[0]);
                w && Yi(l, d, w), y && y.length > 0 && nl(l, d, y.join(" "));
              }
            if (((m = pu(h, 22)), void 0 !== n)) {
              const w = (m.projection = []);
              for (let y = 0; y < this.ngContentSelectors.length; y++) {
                const M = n[y];
                w.push(null != M ? Array.from(M) : null);
              }
            }
            (g = (function IS(e, t, n, r) {
              const o = n[1],
                i = (function sS(e, t, n) {
                  const r = Ie();
                  e.firstCreatePass &&
                    (n.providersResolver && n.providersResolver(n),
                    xg(e, r, t, jr(e, t, 1, null), n),
                    bg(e, r));
                  const o = wo(t, e, r.directiveStart, r);
                  $e(o, t);
                  const i = lt(r, t);
                  return i && $e(i, t), o;
                })(o, n, t);
              if (((e[8] = n[8] = i), null !== r)) for (const a of r) a(i, t);
              if (t.contentQueries) {
                const a = Ie();
                t.contentQueries(1, i, a.directiveStart);
              }
              const s = Ie();
              return (
                !o.firstCreatePass ||
                  (null === t.hostBindings && null === t.hostAttrs) ||
                  (In(s.index),
                  Sg(n[1], s, 0, s.directiveStart, s.directiveEnd, t),
                  Ig(t, i)),
                i
              );
            })(D, this.componentDef, p, [AS])),
              kl(h, p, null);
          } finally {
            bu();
          }
          return new MS(this.componentType, g, Or(m, p), p, m);
        }
      }
      class MS extends class QM {} {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new CS(o)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let o;
          if (null !== r && (o = r[t])) {
            const i = this._rootLView;
            zl(i[1], i, o, t, n), Mg(i, this._tNode.index);
          }
        }
        get injector() {
          return new br(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function AS() {
        const e = Ie();
        Zi(v()[1], e);
      }
      function X(e) {
        let t = (function Lg(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          n = !0;
        const r = [e];
        for (; t; ) {
          let o;
          if (Nt(e)) o = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new C(903, !1);
            o = t.ɵdir;
          }
          if (o) {
            if (n) {
              r.push(o);
              const s = e;
              (s.inputs = ql(e.inputs)),
                (s.declaredInputs = ql(e.declaredInputs)),
                (s.outputs = ql(e.outputs));
              const a = o.hostBindings;
              a && RS(e, a);
              const u = o.viewQuery,
                l = o.contentQueries;
              if (
                (u && xS(e, u),
                l && NS(e, l),
                eu(e.inputs, o.inputs),
                eu(e.declaredInputs, o.declaredInputs),
                eu(e.outputs, o.outputs),
                Nt(o) && o.data.animation)
              ) {
                const c = e.data;
                c.animation = (c.animation || []).concat(o.data.animation);
              }
            }
            const i = o.features;
            if (i)
              for (let s = 0; s < i.length; s++) {
                const a = i[s];
                a && a.ngInherit && a(e), a === X && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function TS(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const o = e[r];
            (o.hostVars = t += o.hostVars),
              (o.hostAttrs = Ji(o.hostAttrs, (n = Ji(n, o.hostAttrs))));
          }
        })(r);
      }
      function ql(e) {
        return e === gr ? {} : e === K ? [] : e;
      }
      function xS(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      function NS(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, o, i) => {
              t(r, o, i), n(r, o, i);
            }
          : t;
      }
      function RS(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, o) => {
              t(r, o), n(r, o);
            }
          : t;
      }
      let Ss = null;
      function Xn() {
        if (!Ss) {
          const e = oe.Symbol;
          if (e && e.iterator) Ss = e.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let n = 0; n < t.length; ++n) {
              const r = t[n];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (Ss = r);
            }
          }
        }
        return Ss;
      }
      function zo(e) {
        return (
          !!(function Zl(e) {
            return (
              null !== e && ("function" == typeof e || "object" == typeof e)
            );
          })(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Xn() in e))
        );
      }
      function Ue(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function Kt(e, t, n, r) {
        const o = v();
        return Ue(o, Cr(), t) && (q(), Zt(ce(), o, e, t, n, r)), Kt;
      }
      function Ot(e, t, n) {
        const r = v();
        return (
          Ue(r, Cr(), t) &&
            (function pt(e, t, n, r, o, i, s, a) {
              const u = lt(t, n);
              let c,
                l = t.inputs;
              !a && null != l && (c = l[r])
                ? (zl(e, n, c, r, o), Gi(t) && Mg(n, t.index))
                : 3 & t.type &&
                  ((r = (function oS(e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, t.value || "", r) : o),
                  i.setProperty(u, r, o));
            })(q(), ce(), r, e, t, r[j], n, !1),
          Ot
        );
      }
      function Ql(e, t, n, r, o) {
        const s = o ? "class" : "style";
        zl(e, n, t.inputs[s], s, r);
      }
      function $(e, t, n, r) {
        const o = v(),
          i = q(),
          s = 22 + e,
          a = o[j],
          u = (o[s] = Qu(
            a,
            t,
            (function GE() {
              return O.lFrame.currentNamespace;
            })()
          )),
          l = i.firstCreatePass
            ? (function US(e, t, n, r, o, i, s) {
                const a = t.consts,
                  l = Vr(t, e, 2, o, Sn(a, i));
                return (
                  Bl(t, n, l, Sn(a, s)),
                  null !== l.attrs && bs(l, l.attrs, !1),
                  null !== l.mergedAttrs && bs(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, i, o, 0, t, n, r)
            : i.data[s];
        Wt(l, !0);
        const c = l.mergedAttrs;
        null !== c && Yi(a, u, c);
        const d = l.classes;
        null !== d && nl(a, u, d);
        const f = l.styles;
        return (
          null !== f && vp(a, u, f),
          64 != (64 & l.flags) && ls(i, o, u, l),
          0 ===
            (function AE() {
              return O.lFrame.elementDepthCount;
            })() && $e(u, o),
          (function TE() {
            O.lFrame.elementDepthCount++;
          })(),
          zi(l) &&
            (Ll(i, o, l),
            (function Dg(e, t, n) {
              if (lu(t)) {
                const o = t.directiveEnd;
                for (let i = t.directiveStart; i < o; i++) {
                  const s = e.data[i];
                  s.contentQueries && s.contentQueries(1, n[i], i);
                }
              }
            })(i, l, o)),
          null !== r && Vl(o, l),
          $
        );
      }
      function z() {
        let e = Ie();
        vu()
          ? (function _u() {
              O.lFrame.isParent = !1;
            })()
          : ((e = e.parent), Wt(e, !1));
        const t = e;
        !(function xE() {
          O.lFrame.elementDepthCount--;
        })();
        const n = q();
        return (
          n.firstCreatePass && (Zi(n, e), lu(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function QE(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Ql(n, t, v(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function KE(e) {
              return 0 != (32 & e.flags);
            })(t) &&
            Ql(n, t, v(), t.stylesWithoutHost, !1),
          z
        );
      }
      function He(e, t, n, r) {
        return $(e, t, n, r), z(), He;
      }
      function Jl() {
        return v();
      }
      function qo(e) {
        return !!e && "function" == typeof e.then;
      }
      const Xl = function Kg(e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function Ee(e, t, n, r) {
        const o = v(),
          i = q(),
          s = Ie();
        return (
          (function Jg(e, t, n, r, o, i, s, a) {
            const u = zi(r),
              c = e.firstCreatePass && Fg(e),
              d = t[8],
              f = Rg(t);
            let h = !0;
            if (3 & r.type || a) {
              const m = lt(r, t),
                D = a ? a(m) : m,
                w = f.length,
                y = a ? (Z) => a(Ce(Z[r.index])) : r.index;
              let M = null;
              if (
                (!a &&
                  u &&
                  (M = (function GS(e, t, n, r) {
                    const o = e.cleanup;
                    if (null != o)
                      for (let i = 0; i < o.length - 1; i += 2) {
                        const s = o[i];
                        if (s === n && o[i + 1] === r) {
                          const a = t[7],
                            u = o[i + 2];
                          return a.length > u ? a[u] : null;
                        }
                        "string" == typeof s && (i += 2);
                      }
                    return null;
                  })(e, t, o, r.index)),
                null !== M)
              )
                ((M.__ngLastListenerFn__ || M).__ngNextListenerFn__ = i),
                  (M.__ngLastListenerFn__ = i),
                  (h = !1);
              else {
                i = em(r, t, d, i, !1);
                const Z = n.listen(D, o, i);
                f.push(i, Z), c && c.push(o, y, w, w + 1);
              }
            } else i = em(r, t, d, i, !1);
            const p = r.outputs;
            let g;
            if (h && null !== p && (g = p[o])) {
              const m = g.length;
              if (m)
                for (let D = 0; D < m; D += 2) {
                  const le = t[g[D]][g[D + 1]].subscribe(i),
                    hr = f.length;
                  f.push(i, le), c && c.push(o, r.index, hr, -(hr + 1));
                }
            }
          })(i, o, o[j], s, e, t, 0, r),
          Ee
        );
      }
      function Xg(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (o) {
          return Pg(e, o), !1;
        }
      }
      function em(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          Hl(2 & e.flags ? ct(e.index, t) : t);
          let u = Xg(t, 0, r, s),
            l = i.__ngNextListenerFn__;
          for (; l; ) (u = Xg(t, 0, l, s) && u), (l = l.__ngNextListenerFn__);
          return o && !1 === u && (s.preventDefault(), (s.returnValue = !1)), u;
        };
      }
      function tm(e = 1) {
        return (function VE(e) {
          return (O.lFrame.contextLView = (function jE(e, t) {
            for (; e > 0; ) (t = t[15]), e--;
            return t;
          })(e, O.lFrame.contextLView))[8];
        })(e);
      }
      function dm(e, t, n, r, o) {
        const i = e[n + 1],
          s = null === t;
        let a = r ? Ft(i) : hn(i),
          u = !1;
        for (; 0 !== a && (!1 === u || s); ) {
          const c = e[a + 1];
          KS(e[a], t) && ((u = !0), (e[a + 1] = r ? Il(c) : Ml(c))),
            (a = r ? Ft(c) : hn(c));
        }
        u && (e[n + 1] = r ? Ml(i) : Il(i));
      }
      function KS(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Tr(e, t) >= 0)
        );
      }
      const xe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function fm(e) {
        return e.substring(xe.key, xe.keyEnd);
      }
      function YS(e) {
        return e.substring(xe.value, xe.valueEnd);
      }
      function pm(e, t) {
        const n = xe.textEnd;
        let r = (xe.key = Qr(e, t, n));
        return n === r
          ? -1
          : ((r = xe.keyEnd =
              (function tI(e, t, n) {
                let r;
                for (
                  ;
                  t < n &&
                  (45 === (r = e.charCodeAt(t)) ||
                    95 === r ||
                    ((-33 & r) >= 65 && (-33 & r) <= 90) ||
                    (r >= 48 && r <= 57));

                )
                  t++;
                return t;
              })(e, r, n)),
            (r = mm(e, r, n)),
            (r = xe.value = Qr(e, r, n)),
            (r = xe.valueEnd =
              (function nI(e, t, n) {
                let r = -1,
                  o = -1,
                  i = -1,
                  s = t,
                  a = s;
                for (; s < n; ) {
                  const u = e.charCodeAt(s++);
                  if (59 === u) return a;
                  34 === u || 39 === u
                    ? (a = s = ym(e, u, s, n))
                    : t === s - 4 &&
                      85 === i &&
                      82 === o &&
                      76 === r &&
                      40 === u
                    ? (a = s = ym(e, 41, s, n))
                    : u > 32 && (a = s),
                    (i = o),
                    (o = r),
                    (r = -33 & u);
                }
                return a;
              })(e, r, n)),
            mm(e, r, n));
      }
      function Qr(e, t, n) {
        for (; t < n && e.charCodeAt(t) <= 32; ) t++;
        return t;
      }
      function mm(e, t, n, r) {
        return (t = Qr(e, t, n)) < n && t++, t;
      }
      function ym(e, t, n, r) {
        let o = -1,
          i = n;
        for (; i < r; ) {
          const s = e.charCodeAt(i++);
          if (s == t && 92 !== o) return i;
          o = 92 == s && 92 === o ? 0 : s;
        }
        throw new Error();
      }
      function Zo(e, t, n) {
        return kt(e, t, n, !1), Zo;
      }
      function gn(e, t) {
        return kt(e, t, null, !0), gn;
      }
      function Pt(e) {
        !(function Lt(e, t, n, r) {
          const o = q(),
            i = un(2);
          o.firstUpdatePass && _m(o, null, i, r);
          const s = v();
          if (n !== k && Ue(s, i, n)) {
            const a = o.data[Qe()];
            if (Em(a, r) && !vm(o, i)) {
              let u = r ? a.classesWithoutHost : a.stylesWithoutHost;
              null !== u && (n = tu(u, n || "")), Ql(o, a, s, n, r);
            } else
              !(function cI(e, t, n, r, o, i, s, a) {
                o === k && (o = K);
                let u = 0,
                  l = 0,
                  c = 0 < o.length ? o[0] : null,
                  d = 0 < i.length ? i[0] : null;
                for (; null !== c || null !== d; ) {
                  const f = u < o.length ? o[u + 1] : void 0,
                    h = l < i.length ? i[l + 1] : void 0;
                  let g,
                    p = null;
                  c === d
                    ? ((u += 2), (l += 2), f !== h && ((p = d), (g = h)))
                    : null === d || (null !== c && c < d)
                    ? ((u += 2), (p = c))
                    : ((l += 2), (p = d), (g = h)),
                    null !== p && Cm(e, t, n, r, p, g, s, a),
                    (c = u < o.length ? o[u] : null),
                    (d = l < i.length ? i[l] : null);
                }
              })(
                o,
                a,
                s,
                s[j],
                s[i + 1],
                (s[i + 1] = (function lI(e, t, n) {
                  if (null == n || "" === n) return K;
                  const r = [],
                    o = Tn(n);
                  if (Array.isArray(o))
                    for (let i = 0; i < o.length; i++) e(r, o[i], !0);
                  else if ("object" == typeof o)
                    for (const i in o) o.hasOwnProperty(i) && e(r, i, o[i]);
                  else "string" == typeof o && t(r, o);
                  return r;
                })(e, t, n)),
                r,
                i
              );
          }
        })(Dm, rI, e, !1);
      }
      function rI(e, t) {
        for (
          let n = (function XS(e) {
            return (
              (function gm(e) {
                (xe.key = 0),
                  (xe.keyEnd = 0),
                  (xe.value = 0),
                  (xe.valueEnd = 0),
                  (xe.textEnd = e.length);
              })(e),
              pm(e, Qr(e, 0, xe.textEnd))
            );
          })(t);
          n >= 0;
          n = pm(t, n)
        )
          Dm(e, fm(t), YS(t));
      }
      function kt(e, t, n, r) {
        const o = v(),
          i = q(),
          s = un(2);
        i.firstUpdatePass && _m(i, e, s, r),
          t !== k &&
            Ue(o, s, t) &&
            Cm(
              i,
              i.data[Qe()],
              o,
              o[j],
              e,
              (o[s + 1] = (function dI(e, t) {
                return (
                  null == e ||
                    ("string" == typeof t
                      ? (e += t)
                      : "object" == typeof e && (e = te(Tn(e)))),
                  e
                );
              })(t, n)),
              r,
              s
            );
      }
      function vm(e, t) {
        return t >= e.expandoStartIndex;
      }
      function _m(e, t, n, r) {
        const o = e.data;
        if (null === o[n + 1]) {
          const i = o[Qe()],
            s = vm(e, n);
          Em(i, r) && null === t && !s && (t = !1),
            (t = (function iI(e, t, n, r) {
              const o = (function Cu(e) {
                const t = O.lFrame.currentDirectiveIndex;
                return -1 === t ? null : e[t];
              })(e);
              let i = r ? t.residualClasses : t.residualStyles;
              if (null === o)
                0 === (r ? t.classBindings : t.styleBindings) &&
                  ((n = Qo((n = tc(null, e, t, n, r)), t.attrs, r)),
                  (i = null));
              else {
                const s = t.directiveStylingLast;
                if (-1 === s || e[s] !== o)
                  if (((n = tc(o, e, t, n, r)), null === i)) {
                    let u = (function sI(e, t, n) {
                      const r = n ? t.classBindings : t.styleBindings;
                      if (0 !== hn(r)) return e[Ft(r)];
                    })(e, t, r);
                    void 0 !== u &&
                      Array.isArray(u) &&
                      ((u = tc(null, e, t, u[1], r)),
                      (u = Qo(u, t.attrs, r)),
                      (function aI(e, t, n, r) {
                        e[Ft(n ? t.classBindings : t.styleBindings)] = r;
                      })(e, t, r, u));
                  } else
                    i = (function uI(e, t, n) {
                      let r;
                      const o = t.directiveEnd;
                      for (let i = 1 + t.directiveStylingLast; i < o; i++)
                        r = Qo(r, e[i].hostAttrs, n);
                      return Qo(r, t.attrs, n);
                    })(e, t, r);
              }
              return (
                void 0 !== i &&
                  (r ? (t.residualClasses = i) : (t.residualStyles = i)),
                n
              );
            })(o, i, t, r)),
            (function ZS(e, t, n, r, o, i) {
              let s = i ? t.classBindings : t.styleBindings,
                a = Ft(s),
                u = hn(s);
              e[r] = n;
              let c,
                l = !1;
              if (Array.isArray(n)) {
                const d = n;
                (c = d[1]), (null === c || Tr(d, c) > 0) && (l = !0);
              } else c = n;
              if (o)
                if (0 !== u) {
                  const f = Ft(e[a + 1]);
                  (e[r + 1] = ys(f, a)),
                    0 !== f && (e[f + 1] = Sl(e[f + 1], r)),
                    (e[a + 1] = (function U0(e, t) {
                      return (131071 & e) | (t << 17);
                    })(e[a + 1], r));
                } else
                  (e[r + 1] = ys(a, 0)),
                    0 !== a && (e[a + 1] = Sl(e[a + 1], r)),
                    (a = r);
              else
                (e[r + 1] = ys(u, 0)),
                  0 === a ? (a = r) : (e[u + 1] = Sl(e[u + 1], r)),
                  (u = r);
              l && (e[r + 1] = Ml(e[r + 1])),
                dm(e, c, r, !0),
                dm(e, c, r, !1),
                (function QS(e, t, n, r, o) {
                  const i = o ? e.residualClasses : e.residualStyles;
                  null != i &&
                    "string" == typeof t &&
                    Tr(i, t) >= 0 &&
                    (n[r + 1] = Il(n[r + 1]));
                })(t, c, e, r, i),
                (s = ys(a, u)),
                i ? (t.classBindings = s) : (t.styleBindings = s);
            })(o, i, t, n, s, r);
        }
      }
      function tc(e, t, n, r, o) {
        let i = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((i = t[a]), (r = Qo(r, i.hostAttrs, o)), i !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function Qo(e, t, n) {
        const r = n ? 1 : 2;
        let o = -1;
        if (null !== t)
          for (let i = 0; i < t.length; i++) {
            const s = t[i];
            "number" == typeof s
              ? (o = s)
              : o === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                ft(e, s, !!n || t[++i]));
          }
        return void 0 === e ? null : e;
      }
      function Dm(e, t, n) {
        ft(e, t, Tn(n));
      }
      function Cm(e, t, n, r, o, i, s, a) {
        if (!(3 & t.type)) return;
        const u = e.data,
          l = u[a + 1];
        As(
          (function cg(e) {
            return 1 == (1 & e);
          })(l)
            ? wm(u, t, n, o, hn(l), s)
            : void 0
        ) ||
          (As(i) ||
            ((function lg(e) {
              return 2 == (2 & e);
            })(l) &&
              (i = wm(u, null, n, o, a, s))),
          (function dM(e, t, n, r, o) {
            if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
            else {
              let i = -1 === r.indexOf("-") ? void 0 : nt.DashCase;
              null == o
                ? e.removeStyle(n, r, i)
                : ("string" == typeof o &&
                    o.endsWith("!important") &&
                    ((o = o.slice(0, -10)), (i |= nt.Important)),
                  e.setStyle(n, r, o, i));
            }
          })(r, s, Wi(Qe(), n), o, i));
      }
      function wm(e, t, n, r, o, i) {
        const s = null === t;
        let a;
        for (; o > 0; ) {
          const u = e[o],
            l = Array.isArray(u),
            c = l ? u[1] : u,
            d = null === c;
          let f = n[o + 1];
          f === k && (f = d ? K : void 0);
          let h = d ? Fu(f, r) : c === r ? f : void 0;
          if ((l && !As(h) && (h = Fu(u, r)), As(h) && ((a = h), s))) return a;
          const p = e[o + 1];
          o = s ? Ft(p) : hn(p);
        }
        if (null !== t) {
          let u = i ? t.residualClasses : t.residualStyles;
          null != u && (a = Fu(u, r));
        }
        return a;
      }
      function As(e) {
        return void 0 !== e;
      }
      function Em(e, t) {
        return 0 != (e.flags & (t ? 16 : 32));
      }
      function he(e, t = "") {
        const n = v(),
          r = q(),
          o = e + 22,
          i = r.firstCreatePass ? Vr(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function Zu(e, t) {
            return e.createText(t);
          })(n[j], t));
        ls(r, n, s, i), Wt(i, !1);
      }
      function nc(e) {
        return rc("", e, ""), nc;
      }
      function rc(e, t, n) {
        const r = v(),
          o = (function $r(e, t, n, r) {
            return Ue(e, Cr(), n) ? t + P(n) + r : k;
          })(r, e, t, n);
        return (
          o !== k &&
            (function pn(e, t, n) {
              const r = Wi(t, e);
              !(function ip(e, t, n) {
                e.setValue(t, n);
              })(e[j], r, n);
            })(r, Qe(), o),
          rc
        );
      }
      const Yr = "en-US";
      let zm = Yr;
      function sc(e, t, n, r, o) {
        if (((e = R(e)), Array.isArray(e)))
          for (let i = 0; i < e.length; i++) sc(e[i], t, n, r, o);
        else {
          const i = q(),
            s = v();
          let a = Jn(e) ? e : R(e.provide),
            u = jp(e);
          const l = Ie(),
            c = 1048575 & l.providerIndexes,
            d = l.directiveStart,
            f = l.providerIndexes >> 20;
          if (Jn(e) || !e.multi) {
            const h = new _o(u, o, _),
              p = uc(a, t, o ? c : c + f, d);
            -1 === p
              ? (ts(Co(l, s), i, a),
                ac(i, e, t.length),
                t.push(a),
                l.directiveStart++,
                l.directiveEnd++,
                o && (l.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = uc(a, t, c + f, d),
              p = uc(a, t, c, c + f),
              g = h >= 0 && n[h],
              m = p >= 0 && n[p];
            if ((o && !m) || (!o && !g)) {
              ts(Co(l, s), i, a);
              const D = (function TA(e, t, n, r, o) {
                const i = new _o(e, n, _);
                return (
                  (i.multi = []),
                  (i.index = t),
                  (i.componentProviders = 0),
                  my(i, o, r && !n),
                  i
                );
              })(o ? AA : IA, n.length, o, r, u);
              !o && m && (n[p].providerFactory = D),
                ac(i, e, t.length, 0),
                t.push(a),
                l.directiveStart++,
                l.directiveEnd++,
                o && (l.providerIndexes += 1048576),
                n.push(D),
                s.push(D);
            } else ac(i, e, h > -1 ? h : p, my(n[o ? p : h], u, !o && r));
            !o && r && m && n[p].componentProviders++;
          }
        }
      }
      function ac(e, t, n, r) {
        const o = Jn(t),
          i = (function $M(e) {
            return !!e.useClass;
          })(t);
        if (o || i) {
          const u = (i ? R(t.useClass) : t).prototype.ngOnDestroy;
          if (u) {
            const l = e.destroyHooks || (e.destroyHooks = []);
            if (!o && t.multi) {
              const c = l.indexOf(n);
              -1 === c ? l.push(n, [r, u]) : l[c + 1].push(r, u);
            } else l.push(n, u);
          }
        }
      }
      function my(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function uc(e, t, n, r) {
        for (let o = n; o < r; o++) if (t[o] === e) return o;
        return -1;
      }
      function IA(e, t, n, r) {
        return lc(this.multi, []);
      }
      function AA(e, t, n, r) {
        const o = this.multi;
        let i;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = wo(n, n[1], this.providerFactory.index, r);
          (i = a.slice(0, s)), lc(o, i);
          for (let u = s; u < a.length; u++) i.push(a[u]);
        } else (i = []), lc(o, i);
        return i;
      }
      function lc(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function ue(e, t = []) {
        return (n) => {
          n.providersResolver = (r, o) =>
            (function SA(e, t, n) {
              const r = q();
              if (r.firstCreatePass) {
                const o = Nt(e);
                sc(n, r.data, r.blueprint, o, !0),
                  sc(t, r.data, r.blueprint, o, !1);
              }
            })(r, o ? o(e) : e, t);
        };
      }
      class nr {}
      class yy {}
      class vy extends nr {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new Wl(this));
          const r = at(t);
          (this._bootstrapComponents = fn(r.bootstrap)),
            (this._r3Injector = tg(
              t,
              n,
              [
                { provide: nr, useValue: this },
                { provide: $o, useValue: this.componentFactoryResolver },
              ],
              te(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class cc extends yy {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new vy(this.moduleType, t);
        }
      }
      class NA extends nr {
        constructor(t, n, r) {
          super(),
            (this.componentFactoryResolver = new Wl(this)),
            (this.instance = null);
          const o = new Vp(
            [
              ...t,
              { provide: nr, useValue: this },
              { provide: $o, useValue: this.componentFactoryResolver },
            ],
            n || gs(),
            r,
            new Set(["environment"])
          );
          (this.injector = o), o.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function Fs(e, t, n = null) {
        return new NA(e, t, n).injector;
      }
      let RA = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n.id)) {
              const r = Op(0, n.type),
                o =
                  r.length > 0
                    ? Fs([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n.id, o);
            }
            return this.cachedInjectors.get(n.id);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (e.ɵprov = V({
            token: e,
            providedIn: "environment",
            factory: () => new e(A(xn)),
          })),
          e
        );
      })();
      function _y(e) {
        e.getStandaloneInjector = (t) =>
          t.get(RA).getOrCreateStandaloneInjector(e);
      }
      function fc(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const ge = class oT extends Ht {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let o = t,
            i = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const u = t;
            (o = u.next?.bind(u)),
              (i = u.error?.bind(u)),
              (s = u.complete?.bind(u));
          }
          this.__isAsync && ((i = fc(i)), o && (o = fc(o)), s && (s = fc(s)));
          const a = super.subscribe({ next: o, error: i, complete: s });
          return t instanceof gt && t.add(a), a;
        }
      };
      function iT() {
        return this._results[Xn()]();
      }
      class hc {
        constructor(t = !1) {
          (this._emitDistinctChangesOnly = t),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const n = Xn(),
            r = hc.prototype;
          r[n] || (r[n] = iT);
        }
        get changes() {
          return this._changes || (this._changes = new ge());
        }
        get(t) {
          return this._results[t];
        }
        map(t) {
          return this._results.map(t);
        }
        filter(t) {
          return this._results.filter(t);
        }
        find(t) {
          return this._results.find(t);
        }
        reduce(t, n) {
          return this._results.reduce(t, n);
        }
        forEach(t) {
          this._results.forEach(t);
        }
        some(t) {
          return this._results.some(t);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(t, n) {
          const r = this;
          r.dirty = !1;
          const o = dt(t);
          (this._changesDetected = !(function sb(e, t, n) {
            if (e.length !== t.length) return !1;
            for (let r = 0; r < e.length; r++) {
              let o = e[r],
                i = t[r];
              if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
            }
            return !0;
          })(r._results, o, n)) &&
            ((r._results = o),
            (r.length = o.length),
            (r.last = o[this.length - 1]),
            (r.first = o[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      let mn = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = uT), e;
      })();
      const sT = mn,
        aT = class extends sT {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t, n) {
            const r = this._declarationTContainer.tViews,
              o = Ds(
                this._declarationLView,
                r,
                t,
                16,
                null,
                r.declTNode,
                null,
                null,
                null,
                null,
                n || null
              );
            o[17] = this._declarationLView[this._declarationTContainer.index];
            const s = this._declarationLView[19];
            return (
              null !== s && (o[19] = s.createEmbeddedView(r)),
              kl(r, o, t),
              new Ho(o)
            );
          }
        };
      function uT() {
        return Os(Ie(), v());
      }
      function Os(e, t) {
        return 4 & e.type ? new aT(t, e, Or(e, t)) : null;
      }
      let Vt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = lT), e;
      })();
      function lT() {
        return Fy(Ie(), v());
      }
      const cT = Vt,
        Ny = class extends cT {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Or(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new br(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = es(this._hostTNode, this._hostLView);
            if (wh(t)) {
              const n = Er(t, this._hostLView),
                r = wr(t);
              return new br(n[1].data[r + 8], n);
            }
            return new br(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = Ry(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            let o, i;
            "number" == typeof r
              ? (o = r)
              : null != r && ((o = r.index), (i = r.injector));
            const s = t.createEmbeddedView(n || {}, i);
            return this.insert(s, o), s;
          }
          createComponent(t, n, r, o, i) {
            const s =
              t &&
              !(function Mo(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.environmentInjector || d.ngModuleRef);
            }
            const u = s ? t : new Go(J(t)),
              l = r || this.parentInjector;
            if (!i && null == u.ngModule) {
              const f = (s ? l : this.parentInjector).get(xn, null);
              f && (i = f);
            }
            const c = u.create(l, o, void 0, i);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[1];
            if (
              (function IE(e) {
                return xt(e[3]);
              })(r)
            ) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new Ny(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function rM(e, t, n, r) {
              const o = 10 + r,
                i = n.length;
              r > 0 && (n[o - 1][4] = t),
                r < i - 10
                  ? ((t[4] = n[o]), Fh(n, 10 + r, t))
                  : (n.push(t), (t[4] = null)),
                (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function oM(e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0),
                    null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 64);
            })(o, r, s, i);
            const a = Xu(i, s),
              u = r[j],
              l = us(u, s[7]);
            return (
              null !== l &&
                (function eM(e, t, n, r, o, i) {
                  (r[0] = o), (r[6] = t), ko(e, r, n, 1, o, i);
                })(o, s[6], u, r, l, a),
              t.attachToViewContainerRef(),
              Fh(pc(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = Ry(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = Ku(this._lContainer, n);
            r && (rs(pc(this._lContainer), n), ap(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = Ku(this._lContainer, n);
            return r && null != rs(pc(this._lContainer), n) ? new Ho(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function Ry(e) {
        return e[8];
      }
      function pc(e) {
        return e[8] || (e[8] = []);
      }
      function Fy(e, t) {
        let n;
        const r = t[e.index];
        if (xt(r)) n = r;
        else {
          let o;
          if (8 & e.type) o = Ce(r);
          else {
            const i = t[j];
            o = i.createComment("");
            const s = lt(e, t);
            Kn(
              i,
              us(i, s),
              o,
              (function uM(e, t) {
                return e.nextSibling(t);
              })(i, s),
              !1
            );
          }
          (t[e.index] = n = Ng(r, t, o, e)), ws(t, n);
        }
        return new Ny(n, e, t);
      }
      class gc {
        constructor(t) {
          (this.queryList = t), (this.matches = null);
        }
        clone() {
          return new gc(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class mc {
        constructor(t = []) {
          this.queries = t;
        }
        createEmbeddedView(t) {
          const n = t.queries;
          if (null !== n) {
            const r =
                null !== t.contentQueries ? t.contentQueries[0] : n.length,
              o = [];
            for (let i = 0; i < r; i++) {
              const s = n.getByIndex(i);
              o.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new mc(o);
          }
          return null;
        }
        insertView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        detachView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        dirtyQueriesWithMatches(t) {
          for (let n = 0; n < this.queries.length; n++)
            null !== Vy(t, n).matches && this.queries[n].setDirty();
        }
      }
      class Oy {
        constructor(t, n, r = null) {
          (this.predicate = t), (this.flags = n), (this.read = r);
        }
      }
      class yc {
        constructor(t = []) {
          this.queries = t;
        }
        elementStart(t, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(t, n);
        }
        elementEnd(t) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].elementEnd(t);
        }
        embeddedTView(t) {
          let n = null;
          for (let r = 0; r < this.length; r++) {
            const o = null !== n ? n.length : 0,
              i = this.getByIndex(r).embeddedTView(t, o);
            i &&
              ((i.indexInDeclarationView = r),
              null !== n ? n.push(i) : (n = [i]));
          }
          return null !== n ? new yc(n) : null;
        }
        template(t, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(t, n);
        }
        getByIndex(t) {
          return this.queries[t];
        }
        get length() {
          return this.queries.length;
        }
        track(t) {
          this.queries.push(t);
        }
      }
      class vc {
        constructor(t, n = -1) {
          (this.metadata = t),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = n);
        }
        elementStart(t, n) {
          this.isApplyingToNode(n) && this.matchTNode(t, n);
        }
        elementEnd(t) {
          this._declarationNodeIndex === t.index &&
            (this._appliesToNextNode = !1);
        }
        template(t, n) {
          this.elementStart(t, n);
        }
        embeddedTView(t, n) {
          return this.isApplyingToNode(t)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-t.index, n),
              new vc(this.metadata))
            : null;
        }
        isApplyingToNode(t) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const n = this._declarationNodeIndex;
            let r = t.parent;
            for (; null !== r && 8 & r.type && r.index !== n; ) r = r.parent;
            return n === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(t, n) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let o = 0; o < r.length; o++) {
              const i = r[o];
              this.matchTNodeWithReadOption(t, n, hT(n, i)),
                this.matchTNodeWithReadOption(t, n, ns(n, t, i, !1, !1));
            }
          else
            r === mn
              ? 4 & n.type && this.matchTNodeWithReadOption(t, n, -1)
              : this.matchTNodeWithReadOption(t, n, ns(n, t, r, !1, !1));
        }
        matchTNodeWithReadOption(t, n, r) {
          if (null !== r) {
            const o = this.metadata.read;
            if (null !== o)
              if (o === ht || o === Vt || (o === mn && 4 & n.type))
                this.addMatch(n.index, -2);
              else {
                const i = ns(n, t, o, !1, !1);
                null !== i && this.addMatch(n.index, i);
              }
            else this.addMatch(n.index, r);
          }
        }
        addMatch(t, n) {
          null === this.matches
            ? (this.matches = [t, n])
            : this.matches.push(t, n);
        }
      }
      function hT(e, t) {
        const n = e.localNames;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
        return null;
      }
      function gT(e, t, n, r) {
        return -1 === n
          ? (function pT(e, t) {
              return 11 & e.type ? Or(e, t) : 4 & e.type ? Os(e, t) : null;
            })(t, e)
          : -2 === n
          ? (function mT(e, t, n) {
              return n === ht
                ? Or(t, e)
                : n === mn
                ? Os(t, e)
                : n === Vt
                ? Fy(t, e)
                : void 0;
            })(e, t, r)
          : wo(e, e[1], n, t);
      }
      function Py(e, t, n, r) {
        const o = t[19].queries[r];
        if (null === o.matches) {
          const i = e.data,
            s = n.matches,
            a = [];
          for (let u = 0; u < s.length; u += 2) {
            const l = s[u];
            a.push(l < 0 ? null : gT(t, i[l], s[u + 1], n.metadata.read));
          }
          o.matches = a;
        }
        return o.matches;
      }
      function _c(e, t, n, r) {
        const o = e.queries.getByIndex(n),
          i = o.matches;
        if (null !== i) {
          const s = Py(e, t, o, n);
          for (let a = 0; a < i.length; a += 2) {
            const u = i[a];
            if (u > 0) r.push(s[a / 2]);
            else {
              const l = i[a + 1],
                c = t[-u];
              for (let d = 10; d < c.length; d++) {
                const f = c[d];
                f[17] === f[3] && _c(f[1], f, l, r);
              }
              if (null !== c[9]) {
                const d = c[9];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  _c(h[1], h, l, r);
                }
              }
            }
          }
        }
        return r;
      }
      function ri(e) {
        const t = v(),
          n = q(),
          r = fh();
        wu(r + 1);
        const o = Vy(n, r);
        if (
          e.dirty &&
          (function SE(e) {
            return 4 == (4 & e[2]);
          })(t) ===
            (2 == (2 & o.metadata.flags))
        ) {
          if (null === o.matches) e.reset([]);
          else {
            const i = o.crossesNgTemplate ? _c(n, t, r, []) : Py(n, t, o, r);
            e.reset(i, XM), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function Dc(e, t, n) {
        const r = q();
        r.firstCreatePass &&
          (Ly(r, new Oy(e, t, n), -1),
          2 == (2 & t) && (r.staticViewQueries = !0)),
          ky(r, v(), t);
      }
      function Cc(e, t, n, r) {
        const o = q();
        if (o.firstCreatePass) {
          const i = Ie();
          Ly(o, new Oy(t, n, r), i.index),
            (function vT(e, t) {
              const n = e.contentQueries || (e.contentQueries = []);
              t !== (n.length ? n[n.length - 1] : -1) &&
                n.push(e.queries.length - 1, t);
            })(o, e),
            2 == (2 & n) && (o.staticContentQueries = !0);
        }
        ky(o, v(), n);
      }
      function oi() {
        return (function yT(e, t) {
          return e[19].queries[t].queryList;
        })(v(), fh());
      }
      function ky(e, t, n) {
        const r = new hc(4 == (4 & n));
        wg(e, t, r, r.destroy),
          null === t[19] && (t[19] = new mc()),
          t[19].queries.push(new gc(r));
      }
      function Ly(e, t, n) {
        null === e.queries && (e.queries = new yc()),
          e.queries.track(new vc(t, n));
      }
      function Vy(e, t) {
        return e.queries.getByIndex(t);
      }
      function ks(...e) {}
      const Ls = new S("Application Initializer");
      let Vs = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = ks),
              (this.reject = ks),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (qo(i)) n.push(i);
                else if (Xl(i)) {
                  const s = new Promise((a, u) => {
                    i.subscribe({ complete: a, error: u });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Ls, 8));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const si = new S("AppId", {
        providedIn: "root",
        factory: function rv() {
          return `${Sc()}${Sc()}${Sc()}`;
        },
      });
      function Sc() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const ov = new S("Platform Initializer"),
        iv = new S("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        sv = new S("appBootstrapListener");
      let jT = (() => {
        class e {
          log(n) {
            console.log(n);
          }
          warn(n) {
            console.warn(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      const yn = new S("LocaleId", {
        providedIn: "root",
        factory: () =>
          me(yn, x.Optional | x.SkipSelf) ||
          (function BT() {
            return (typeof $localize < "u" && $localize.locale) || Yr;
          })(),
      });
      class UT {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Ic = (() => {
        class e {
          compileModuleSync(n) {
            return new cc(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = fn(at(n).declarations).reduce((s, a) => {
                const u = J(a);
                return u && s.push(new Go(u)), s;
              }, []);
            return new UT(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const zT = (() => Promise.resolve(0))();
      function Ac(e) {
        typeof Zone > "u"
          ? zT.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class Ne {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ge(!1)),
            (this.onMicrotaskEmpty = new ge(!1)),
            (this.onStable = new ge(!1)),
            (this.onError = new ge(!1)),
            typeof Zone > "u")
          )
            throw new C(908, !1);
          Zone.assertZonePatched();
          const o = this;
          if (
            ((o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.AsyncStackTaggingZoneSpec)
          ) {
            const i = Zone.AsyncStackTaggingZoneSpec;
            o._inner = o._inner.fork(new i("Angular"));
          }
          Zone.TaskTrackingZoneSpec &&
            (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function WT() {
              let e = oe.requestAnimationFrame,
                t = oe.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function QT(e) {
              const t = () => {
                !(function ZT(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(oe, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                xc(e),
                                (e.isCheckStableRunning = !0),
                                Tc(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    xc(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return lv(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      cv(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, u) => {
                  try {
                    return lv(e), n.invoke(o, i, s, a, u);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), cv(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          xc(e),
                          Tc(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!Ne.isInAngularZone()) throw new C(909, !1);
        }
        static assertNotInAngularZone() {
          if (Ne.isInAngularZone()) throw new C(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, qT, ks, ks);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const qT = {};
      function Tc(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function xc(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function lv(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function cv(e) {
        e._nesting--, Tc(e);
      }
      class KT {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new ge()),
            (this.onMicrotaskEmpty = new ge()),
            (this.onStable = new ge()),
            (this.onError = new ge());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      const dv = new S(""),
        js = new S("");
      let Fc,
        Nc = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Fc ||
                  ((function YT(e) {
                    Fc = e;
                  })(o),
                  o.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      Ne.assertNotInAngularZone(),
                        Ac(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                Ac(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Ne), A(Rc), A(js));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Rc = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Fc?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = V({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })(),
        Fn = null;
      const fv = new S("AllowMultipleToken"),
        Oc = new S("PlatformDestroyListeners");
      class hv {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function gv(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new S(r);
        return (i = []) => {
          let s = Pc();
          if (!s || s.injector.get(fv, !1)) {
            const a = [...n, ...i, { provide: o, useValue: !0 }];
            e
              ? e(a)
              : (function ex(e) {
                  if (Fn && !Fn.get(fv, !1)) throw new C(400, !1);
                  Fn = e;
                  const t = e.get(yv);
                  (function pv(e) {
                    const t = e.get(ov, null);
                    t && t.forEach((n) => n());
                  })(e);
                })(
                  (function mv(e = [], t) {
                    return Ct.create({
                      name: t,
                      providers: [
                        { provide: hl, useValue: "platform" },
                        { provide: Oc, useValue: new Set([() => (Fn = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function nx(e) {
            const t = Pc();
            if (!t) throw new C(401, !1);
            return t;
          })();
        };
      }
      function Pc() {
        return Fn?.get(yv) ?? null;
      }
      let yv = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const o = (function _v(e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new KT()
                      : ("zone.js" === e ? void 0 : e) || new Ne(t)),
                  n
                );
              })(
                r?.ngZone,
                (function vv(e) {
                  return {
                    enableLongStackTrace: !1,
                    shouldCoalesceEventChangeDetection:
                      !(!e || !e.ngZoneEventCoalescing) || !1,
                    shouldCoalesceRunChangeDetection:
                      !(!e || !e.ngZoneRunCoalescing) || !1,
                  };
                })(r)
              ),
              i = [{ provide: Ne, useValue: o }];
            return o.run(() => {
              const s = Ct.create({
                  providers: i,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                a = n.create(s),
                u = a.injector.get(Pr, null);
              if (!u) throw new C(402, !1);
              return (
                o.runOutsideAngular(() => {
                  const l = o.onError.subscribe({
                    next: (c) => {
                      u.handleError(c);
                    },
                  });
                  a.onDestroy(() => {
                    $s(this._modules, a), l.unsubscribe();
                  });
                }),
                (function Dv(e, t, n) {
                  try {
                    const r = n();
                    return qo(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(u, o, () => {
                  const l = a.injector.get(Vs);
                  return (
                    l.runInitializers(),
                    l.donePromise.then(
                      () => (
                        (function Wm(e) {
                          st(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (zm = e.toLowerCase().replace(/_/g, "-"));
                        })(a.injector.get(yn, Yr) || Yr),
                        this._moduleDoBootstrap(a),
                        a
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = Cv({}, r);
            return (function JT(e, t, n) {
              const r = new cc(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Bs);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new C(403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new C(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Oc, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Ct));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function Cv(e, t) {
        return Array.isArray(t) ? t.reduce(Cv, e) : { ...e, ...t };
      }
      let Bs = (() => {
        class e {
          constructor(n, r, o) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const i = new _e((a) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    a.next(this._stable), a.complete();
                  });
              }),
              s = new _e((a) => {
                let u;
                this._zone.runOutsideAngular(() => {
                  u = this._zone.onStable.subscribe(() => {
                    Ne.assertNotInAngularZone(),
                      Ac(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), a.next(!0));
                      });
                  });
                });
                const l = this._zone.onUnstable.subscribe(() => {
                  Ne.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        a.next(!1);
                      }));
                });
                return () => {
                  u.unsubscribe(), l.unsubscribe();
                };
              });
            this.isStable = (function Qw(...e) {
              const t = fo(e),
                n = (function Uw(e, t) {
                  return "number" == typeof Ja(e) ? e.pop() : t;
                })(e, 1 / 0),
                r = e;
              return r.length
                ? 1 === r.length
                  ? St(r[0])
                  : pr(n)(De(r, t))
                : rn;
            })(
              i,
              s.pipe(
                (function Kw(e = {}) {
                  const {
                    connector: t = () => new Ht(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = e;
                  return (i) => {
                    let s,
                      a,
                      u,
                      l = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        a?.unsubscribe(), (a = void 0);
                      },
                      h = () => {
                        f(), (s = u = void 0), (c = d = !1);
                      },
                      p = () => {
                        const g = s;
                        h(), g?.unsubscribe();
                      };
                    return Fe((g, m) => {
                      l++, !d && !c && f();
                      const D = (u = u ?? t());
                      m.add(() => {
                        l--, 0 === l && !d && !c && (a = Xa(p, o));
                      }),
                        D.subscribe(m),
                        !s &&
                          l > 0 &&
                          ((s = new co({
                            next: (w) => D.next(w),
                            error: (w) => {
                              (d = !0), f(), (a = Xa(h, n, w)), D.error(w);
                            },
                            complete: () => {
                              (c = !0), f(), (a = Xa(h, r)), D.complete();
                            },
                          })),
                          St(g).subscribe(s));
                    })(i);
                  };
                })()
              )
            );
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const o = n instanceof Bp;
            if (!this._injector.get(Vs).done)
              throw (
                (!o &&
                  (function mr(e) {
                    const t = J(e) || We(e) || qe(e);
                    return null !== t && t.standalone;
                  })(n),
                new C(405, false))
              );
            let s;
            (s = o ? n : this._injector.get($o).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function XT(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(nr),
              l = s.create(Ct.NULL, [], r || s.selector, a),
              c = l.location.nativeElement,
              d = l.injector.get(dv, null);
            return (
              d?.registerApplication(c),
              l.onDestroy(() => {
                this.detachView(l.hostView),
                  $s(this.components, l),
                  d?.unregisterApplication(c);
              }),
              this._loadComponent(l),
              l
            );
          }
          tick() {
            if (this._runningTick) throw new C(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n)
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            $s(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView),
              this.tick(),
              this.components.push(n),
              this._injector
                .get(sv, [])
                .concat(this._bootstrapListeners)
                .forEach((o) => o(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy()),
                  this._onMicrotaskEmptySubscription.unsubscribe();
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => $s(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new C(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Ne), A(xn), A(Pr));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function $s(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let Ev = !0,
        Us = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = ix), e;
        })();
      function ix(e) {
        return (function sx(e, t, n) {
          if (Gi(e) && !n) {
            const r = ct(e.index, t);
            return new Ho(r, r);
          }
          return 47 & e.type ? new Ho(t[16], t) : null;
        })(Ie(), v(), 16 == (16 & e));
      }
      class Av {
        constructor() {}
        supports(t) {
          return zo(t);
        }
        create(t) {
          return new fx(t);
        }
      }
      const dx = (e, t) => t;
      class fx {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || dx);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < xv(r, o, i)) ? n : r,
              a = xv(s, o, i),
              u = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const l = a - o,
                c = u - o;
              if (l != c) {
                for (let f = 0; f < l; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    p = h + f;
                  c <= p && p < l && (i[f] = h + 1);
                }
                i[s.previousIndex] = c - l;
              }
            }
            a !== u && t(s, a, u);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !zo(t))) throw new C(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function LS(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Xn()]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, i, o))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new hx(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (t = this._reinsertAfter(i, t._prev, o))
              : t.currentIndex != o &&
                ((t.currentIndex = o), this._addToMoves(t, o)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Tv()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Tv()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class hx {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class px {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class Tv {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new px()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function xv(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      function Rv() {
        return new zs([new Av()]);
      }
      let zs = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || Rv()),
              deps: [[e, new No(), new xo()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new C(901, !1);
          }
        }
        return (e.ɵprov = V({ token: e, providedIn: "root", factory: Rv })), e;
      })();
      const _x = gv(null, "core", []);
      let Dx = (() => {
        class e {
          constructor(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Bs));
          }),
          (e.ɵmod = zt({ type: e })),
          (e.ɵinj = It({})),
          e
        );
      })();
      function _n(e) {
        return "boolean" == typeof e ? e : null != e && "false" !== e;
      }
      let Ws = null;
      function Jt() {
        return Ws;
      }
      const rt = new S("DocumentToken");
      let Bc = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({
            token: e,
            factory: function () {
              return (function bx() {
                return A(Ov);
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const Mx = new S("Location Initialized");
      let Ov = (() => {
        class e extends Bc {
          constructor(n) {
            super(), (this._doc = n), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Jt().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Jt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Jt().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(n) {
            this.location.pathname = n;
          }
          pushState(n, r, o) {
            Pv() ? this._history.pushState(n, r, o) : (this.location.hash = o);
          }
          replaceState(n, r, o) {
            Pv()
              ? this._history.replaceState(n, r, o)
              : (this.location.hash = o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(rt));
          }),
          (e.ɵprov = V({
            token: e,
            factory: function () {
              return (function Sx() {
                return new Ov(A(rt));
              })();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function Pv() {
        return !!window.history.pushState;
      }
      function $c(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function kv(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function Dn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let or = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({
            token: e,
            factory: function () {
              return me(Vv);
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const Lv = new S("appBaseHref");
      let Vv = (() => {
          class e extends or {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  me(rt).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return $c(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  Dn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + Dn(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + Dn(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Bc), A(Lv, 8));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Ix = (() => {
          class e extends or {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = $c(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + Dn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + Dn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Bc), A(Lv, 8));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Uc = (() => {
          class e {
            constructor(n) {
              (this._subject = new ge()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._baseHref = kv(jv(r))),
                this._locationStrategy.onPopState((o) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: o.state,
                    type: o.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + Dn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function Tx(e, t) {
                  return e && t.startsWith(e) ? t.substring(e.length) : t;
                })(this._baseHref, jv(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._locationStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + Dn(r)),
                  o
                );
            }
            replaceState(n, r = "", o = null) {
              this._locationStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + Dn(r)),
                  o
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
          }
          return (
            (e.normalizeQueryParams = Dn),
            (e.joinWithSlash = $c),
            (e.stripTrailingSlash = kv),
            (e.ɵfac = function (n) {
              return new (n || e)(A(or));
            }),
            (e.ɵprov = V({
              token: e,
              factory: function () {
                return (function Ax() {
                  return new Uc(A(or));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function jv(e) {
        return e.replace(/\/index.html$/, "");
      }
      class gN {
        constructor(t, n, r, o) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = o);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let Kv = (() => {
        class e {
          constructor(n, r, o) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = o),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((o, i, s) => {
              if (null == o.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new gN(o.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === i ? void 0 : i);
              else if (null !== i) {
                const a = r.get(i);
                r.move(a, s), Yv(a, o);
              }
            });
            for (let o = 0, i = r.length; o < i; o++) {
              const a = r.get(o).context;
              (a.index = o), (a.count = i), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((o) => {
              Yv(r.get(o.currentIndex), o);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(Vt), _(mn), _(zs));
          }),
          (e.ɵdir = F({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          e
        );
      })();
      function Yv(e, t) {
        e.context.$implicit = t.item;
      }
      let zN = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = zt({ type: e })),
          (e.ɵinj = It({})),
          e
        );
      })();
      let QN = (() => {
        class e {}
        return (
          (e.ɵprov = V({
            token: e,
            providedIn: "root",
            factory: () => new KN(A(rt), window),
          })),
          e
        );
      })();
      class KN {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function YN(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              n_(this.window.history) ||
              n_(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function n_(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class od extends class MR extends class Ex {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          !(function wx(e) {
            Ws || (Ws = e);
          })(new od());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function SR() {
            return (
              (di = di || document.querySelector("base")),
              di ? di.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function IR(e) {
                (oa = oa || document.createElement("a")),
                  oa.setAttribute("href", e);
                const t = oa.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          di = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return (function fN(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
              const r = n.indexOf("="),
                [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
              if (o.trim() === t) return decodeURIComponent(i);
            }
            return null;
          })(document.cookie, t);
        }
      }
      let oa,
        di = null;
      const a_ = new S("TRANSITION_ID"),
        TR = [
          {
            provide: Ls,
            useFactory: function AR(e, t, n) {
              return () => {
                n.get(Vs).donePromise.then(() => {
                  const r = Jt(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [a_, rt, Ct],
            multi: !0,
          },
        ];
      let NR = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const ia = new S("EventManagerPlugins");
      let sa = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => (o.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(ia), A(Ne));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class u_ {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = Jt().getGlobalEventTarget(this._doc, t);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let l_ = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((o) => {
                this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        fi = (() => {
          class e extends l_ {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, o) {
              n.forEach((i) => {
                const s = this._doc.createElement("style");
                (s.textContent = i), o.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(c_), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, o) => {
                this._addStylesToHost(n, o, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(c_));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(rt));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function c_(e) {
        Jt().remove(e);
      }
      const id = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        sd = /%COMP%/g;
      function aa(e, t, n) {
        for (let r = 0; r < t.length; r++) {
          let o = t[r];
          Array.isArray(o) ? aa(e, o, n) : ((o = o.replace(sd, e)), n.push(o));
        }
        return n;
      }
      function h_(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let ad = (() => {
        class e {
          constructor(n, r, o) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new ud(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case Gt.Emulated: {
                let o = this.rendererByCompId.get(r.id);
                return (
                  o ||
                    ((o = new LR(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId
                    )),
                    this.rendererByCompId.set(r.id, o)),
                  o.applyToHost(n),
                  o
                );
              }
              case 1:
              case Gt.ShadowDom:
                return new VR(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const o = aa(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(o),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(sa), A(fi), A(si));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class ud {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(id[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          (g_(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (g_(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = id[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = id[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (nt.DashCase | nt.Important)
            ? t.style.setProperty(n, r, o & nt.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & nt.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, h_(r))
            : this.eventManager.addEventListener(t, n, h_(r));
        }
      }
      function g_(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class LR extends ud {
        constructor(t, n, r, o) {
          super(t), (this.component = r);
          const i = aa(o + "-" + r.id, r.styles, []);
          n.addStyles(i),
            (this.contentAttr = (function OR(e) {
              return "_ngcontent-%COMP%".replace(sd, e);
            })(o + "-" + r.id)),
            (this.hostAttr = (function PR(e) {
              return "_nghost-%COMP%".replace(sd, e);
            })(o + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class VR extends ud {
        constructor(t, n, r, o) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = aa(o.id, o.styles, []);
          for (let s = 0; s < i.length; s++) {
            const a = document.createElement("style");
            (a.textContent = i[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
      }
      let jR = (() => {
        class e extends u_ {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(rt));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const m_ = ["alt", "control", "meta", "shift"],
        BR = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        $R = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let UR = (() => {
        class e extends u_ {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Jt().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              m_.forEach((l) => {
                const c = r.indexOf(l);
                c > -1 && (r.splice(c, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const u = {};
            return (u.domEventName = o), (u.fullKey = s), u;
          }
          static matchEventFullKeyCode(n, r) {
            let o = BR[n.key] || n.key,
              i = "";
            return (
              r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
              !(null == o || !o) &&
                ((o = o.toLowerCase()),
                " " === o ? (o = "space") : "." === o && (o = "dot"),
                m_.forEach((s) => {
                  s !== o && (0, $R[s])(n) && (i += s + ".");
                }),
                (i += o),
                i === r)
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(rt));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const WR = gv(_x, "browser", [
          { provide: iv, useValue: "browser" },
          {
            provide: ov,
            useValue: function HR() {
              od.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: rt,
            useFactory: function zR() {
              return (
                (function gM(e) {
                  ol = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        __ = new S(""),
        D_ = [
          {
            provide: js,
            useClass: class xR {
              addToWindow(t) {
                (oe.getAngularTestability = (r, o = !0) => {
                  const i = t.findTestabilityInTree(r, o);
                  if (null == i)
                    throw new Error("Could not find testability for element.");
                  return i;
                }),
                  (oe.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (oe.getAllAngularRootElements = () => t.getAllRootElements()),
                  oe.frameworkStabilizers || (oe.frameworkStabilizers = []),
                  oe.frameworkStabilizers.push((r) => {
                    const o = oe.getAllAngularTestabilities();
                    let i = o.length,
                      s = !1;
                    const a = function (u) {
                      (s = s || u), i--, 0 == i && r(s);
                    };
                    o.forEach(function (u) {
                      u.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? Jt().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: dv, useClass: Nc, deps: [Ne, Rc, js] },
          { provide: Nc, useClass: Nc, deps: [Ne, Rc, js] },
        ],
        C_ = [
          { provide: hl, useValue: "root" },
          {
            provide: Pr,
            useFactory: function GR() {
              return new Pr();
            },
            deps: [],
          },
          { provide: ia, useClass: jR, multi: !0, deps: [rt, Ne, iv] },
          { provide: ia, useClass: UR, multi: !0, deps: [rt] },
          { provide: ad, useClass: ad, deps: [sa, fi, si] },
          { provide: Up, useExisting: ad },
          { provide: l_, useExisting: fi },
          { provide: fi, useClass: fi, deps: [rt] },
          { provide: sa, useClass: sa, deps: [ia, Ne] },
          { provide: class JN {}, useClass: NR, deps: [] },
          [],
        ];
      let qR = (() => {
          class e {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: si, useValue: n.appId },
                  { provide: a_, useExisting: si },
                  TR,
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(__, 12));
            }),
            (e.ɵmod = zt({ type: e })),
            (e.ɵinj = It({ providers: [...C_, ...D_], imports: [zN, Dx] })),
            e
          );
        })(),
        w_ = (() => {
          class e {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(rt));
            }),
            (e.ɵprov = V({
              token: e,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function QR() {
                        return new w_(A(rt));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function I(...e) {
        return De(e, fo(e));
      }
      typeof window < "u" && window;
      class Ut extends Ht {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      const ua = uo(
          (e) =>
            function () {
              e(this),
                (this.name = "EmptyError"),
                (this.message = "no elements in sequence");
            }
        ),
        { isArray: rF } = Array,
        { getPrototypeOf: oF, prototype: iF, keys: sF } = Object;
      function M_(e) {
        if (1 === e.length) {
          const t = e[0];
          if (rF(t)) return { args: t, keys: null };
          if (
            (function aF(e) {
              return e && "object" == typeof e && oF(e) === iF;
            })(t)
          ) {
            const n = sF(t);
            return { args: n.map((r) => t[r]), keys: n };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: uF } = Array;
      function S_(e) {
        return W((t) =>
          (function lF(e, t) {
            return uF(t) ? e(...t) : e(t);
          })(e, t)
        );
      }
      function I_(e, t) {
        return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
      }
      function A_(...e) {
        const t = fo(e),
          n = Uf(e),
          { args: r, keys: o } = M_(e);
        if (0 === r.length) return De([], t);
        const i = new _e(
          (function cF(e, t, n = Gn) {
            return (r) => {
              T_(
                t,
                () => {
                  const { length: o } = e,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let u = 0; u < o; u++)
                    T_(
                      t,
                      () => {
                        const l = De(e[u], t);
                        let c = !1;
                        l.subscribe(
                          Se(
                            r,
                            (d) => {
                              (i[u] = d),
                                c || ((c = !0), a--),
                                a || r.next(n(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, t, o ? (s) => I_(o, s) : Gn)
        );
        return n ? i.pipe(S_(n)) : i;
      }
      function T_(e, t, n) {
        e ? nn(n, e, t) : t();
      }
      function dd(...e) {
        return (function dF() {
          return pr(1);
        })()(De(e, fo(e)));
      }
      function x_(e) {
        return new _e((t) => {
          St(e()).subscribe(t);
        });
      }
      function hi(e, t) {
        const n = ne(e) ? e : () => e,
          r = (o) => o.error(n());
        return new _e(t ? (o) => t.schedule(r, 0, o) : r);
      }
      function fd() {
        return Fe((e, t) => {
          let n = null;
          e._refCount++;
          const r = Se(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const o = e._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class N_ extends _e {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            If(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new gt();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                Se(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = gt.EMPTY));
          }
          return t;
        }
        refCount() {
          return fd()(this);
        }
      }
      function Xt(e, t) {
        return Fe((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            Se(
              r,
              (u) => {
                o?.unsubscribe();
                let l = 0;
                const c = i++;
                St(e(u, c)).subscribe(
                  (o = Se(
                    r,
                    (d) => r.next(t ? t(u, d, c, l++) : d),
                    () => {
                      (o = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function pi(e) {
        return e <= 0
          ? () => rn
          : Fe((t, n) => {
              let r = 0;
              t.subscribe(
                Se(n, (o) => {
                  ++r <= e && (n.next(o), e <= r && n.complete());
                })
              );
            });
      }
      function Pn(e, t) {
        return Fe((n, r) => {
          let o = 0;
          n.subscribe(Se(r, (i) => e.call(t, i, o++) && r.next(i)));
        });
      }
      function la(e) {
        return Fe((t, n) => {
          let r = !1;
          t.subscribe(
            Se(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function R_(e = hF) {
        return Fe((t, n) => {
          let r = !1;
          t.subscribe(
            Se(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function hF() {
        return new ua();
      }
      function kn(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? Pn((o, i) => e(o, i, r)) : Gn,
            pi(1),
            n ? la(t) : R_(() => new ua())
          );
      }
      function ir(e, t) {
        return ne(t) ? Pe(e, t, 1) : Pe(e, 1);
      }
      function Ge(e, t, n) {
        const r = ne(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Fe((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                Se(
                  i,
                  (u) => {
                    var l;
                    null === (l = r.next) || void 0 === l || l.call(r, u),
                      i.next(u);
                  },
                  () => {
                    var u;
                    (a = !1),
                      null === (u = r.complete) || void 0 === u || u.call(r),
                      i.complete();
                  },
                  (u) => {
                    var l;
                    (a = !1),
                      null === (l = r.error) || void 0 === l || l.call(r, u),
                      i.error(u);
                  },
                  () => {
                    var u, l;
                    a &&
                      (null === (u = r.unsubscribe) ||
                        void 0 === u ||
                        u.call(r)),
                      null === (l = r.finalize) || void 0 === l || l.call(r);
                  }
                )
              );
            })
          : Gn;
      }
      function Ln(e) {
        return Fe((t, n) => {
          let i,
            r = null,
            o = !1;
          (r = t.subscribe(
            Se(n, void 0, void 0, (s) => {
              (i = St(e(s, Ln(e)(t)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            })
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function pF(e, t, n, r, o) {
        return (i, s) => {
          let a = n,
            u = t,
            l = 0;
          i.subscribe(
            Se(
              s,
              (c) => {
                const d = l++;
                (u = a ? e(u, c, d) : ((a = !0), c)), r && s.next(u);
              },
              o &&
                (() => {
                  a && s.next(u), s.complete();
                })
            )
          );
        };
      }
      function F_(e, t) {
        return Fe(pF(e, t, arguments.length >= 2, !0));
      }
      function hd(e) {
        return e <= 0
          ? () => rn
          : Fe((t, n) => {
              let r = [];
              t.subscribe(
                Se(
                  n,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function O_(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? Pn((o, i) => e(o, i, r)) : Gn,
            hd(1),
            n ? la(t) : R_(() => new ua())
          );
      }
      function pd(e) {
        return Fe((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      const U = "primary",
        gi = Symbol("RouteTitle");
      class yF {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function eo(e) {
        return new yF(e);
      }
      function vF(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function en(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !P_(e[o], t[o]))) return !1;
        return !0;
      }
      function P_(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((o, i) => r[i] === o);
        }
        return e === t;
      }
      function k_(e) {
        return Array.prototype.concat.apply([], e);
      }
      function L_(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function ke(e, t) {
        for (const n in e) e.hasOwnProperty(n) && t(e[n], n);
      }
      function Vn(e) {
        return Xl(e) ? e : qo(e) ? De(Promise.resolve(e)) : I(e);
      }
      const CF = {
          exact: function B_(e, t, n) {
            if (
              !ar(e.segments, t.segments) ||
              !ca(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !B_(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: $_,
        },
        V_ = {
          exact: function wF(e, t) {
            return en(e, t);
          },
          subset: function EF(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => P_(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function j_(e, t, n) {
        return (
          CF[n.paths](e.root, t.root, n.matrixParams) &&
          V_[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function $_(e, t, n) {
        return U_(e, t, t.segments, n);
      }
      function U_(e, t, n, r) {
        if (e.segments.length > n.length) {
          const o = e.segments.slice(0, n.length);
          return !(!ar(o, n) || t.hasChildren() || !ca(o, n, r));
        }
        if (e.segments.length === n.length) {
          if (!ar(e.segments, n) || !ca(e.segments, n, r)) return !1;
          for (const o in t.children)
            if (!e.children[o] || !$_(e.children[o], t.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
          return (
            !!(ar(e.segments, o) && ca(e.segments, o, r) && e.children[U]) &&
            U_(e.children[U], t, i, r)
          );
        }
      }
      function ca(e, t, n) {
        return t.every((r, o) => V_[n](e[o].parameters, r.parameters));
      }
      class sr {
        constructor(t, n, r) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = eo(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return SF.serialize(this);
        }
      }
      class H {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            ke(n, (r, o) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return da(this);
        }
      }
      class mi {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = eo(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return W_(this);
        }
      }
      function ar(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      let H_ = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({
            token: e,
            factory: function () {
              return new md();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      class md {
        parse(t) {
          const n = new PF(t);
          return new sr(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(t) {
          const n = `/${yi(t.root, !0)}`,
            r = (function TF(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${fa(n)}=${fa(o)}`).join("&")
                    : `${fa(n)}=${fa(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function IF(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const SF = new md();
      function da(e) {
        return e.segments.map((t) => W_(t)).join("/");
      }
      function yi(e, t) {
        if (!e.hasChildren()) return da(e);
        if (t) {
          const n = e.children[U] ? yi(e.children[U], !1) : "",
            r = [];
          return (
            ke(e.children, (o, i) => {
              i !== U && r.push(`${i}:${yi(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function MF(e, t) {
            let n = [];
            return (
              ke(e.children, (r, o) => {
                o === U && (n = n.concat(t(r, o)));
              }),
              ke(e.children, (r, o) => {
                o !== U && (n = n.concat(t(r, o)));
              }),
              n
            );
          })(e, (r, o) =>
            o === U ? [yi(e.children[U], !1)] : [`${o}:${yi(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[U]
            ? `${da(e)}/${n[0]}`
            : `${da(e)}/(${n.join("//")})`;
        }
      }
      function G_(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function fa(e) {
        return G_(e).replace(/%3B/gi, ";");
      }
      function yd(e) {
        return G_(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function ha(e) {
        return decodeURIComponent(e);
      }
      function z_(e) {
        return ha(e.replace(/\+/g, "%20"));
      }
      function W_(e) {
        return `${yd(e.path)}${(function AF(e) {
          return Object.keys(e)
            .map((t) => `;${yd(t)}=${yd(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const xF = /^[^\/()?;=#]+/;
      function pa(e) {
        const t = e.match(xF);
        return t ? t[0] : "";
      }
      const NF = /^[^=?&#]+/,
        FF = /^[^&#]+/;
      class PF {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new H([], {})
              : new H([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[U] = new H(t, n)),
            r
          );
        }
        parseSegment() {
          const t = pa(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new C(4009, !1);
          return this.capture(t), new mi(ha(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = pa(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = pa(this.remaining);
            o && ((r = o), this.capture(r));
          }
          t[ha(n)] = ha(r);
        }
        parseQueryParam(t) {
          const n = (function RF(e) {
            const t = e.match(NF);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function OF(e) {
              const t = e.match(FF);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = z_(n),
            i = z_(r);
          if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
          } else t[o] = i;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = pa(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o) throw new C(4010, !1);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.slice(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : t && (i = U);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[U] : new H([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new C(4011, !1);
        }
      }
      function vd(e) {
        return e.segments.length > 0 ? new H([], { [U]: e }) : e;
      }
      function ga(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const i = ga(e.children[r]);
          (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
        }
        return (function kF(e) {
          if (1 === e.numberOfChildren && e.children[U]) {
            const t = e.children[U];
            return new H(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new H(e.segments, t));
      }
      function ur(e) {
        return e instanceof sr;
      }
      function jF(e, t, n, r, o) {
        if (0 === n.length) return to(t.root, t.root, t.root, r, o);
        const i = (function Q_(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new Z_(!0, 0, e);
          let t = 0,
            n = !1;
          const r = e.reduce((o, i, s) => {
            if ("object" == typeof i && null != i) {
              if (i.outlets) {
                const a = {};
                return (
                  ke(i.outlets, (u, l) => {
                    a[l] = "string" == typeof u ? u.split("/") : u;
                  }),
                  [...o, { outlets: a }]
                );
              }
              if (i.segmentPath) return [...o, i.segmentPath];
            }
            return "string" != typeof i
              ? [...o, i]
              : 0 === s
              ? (i.split("/").forEach((a, u) => {
                  (0 == u && "." === a) ||
                    (0 == u && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? t++
                      : "" != a && o.push(a));
                }),
                o)
              : [...o, i];
          }, []);
          return new Z_(n, t, r);
        })(n);
        return i.toRoot()
          ? to(t.root, t.root, new H([], {}), r, o)
          : (function s(u) {
              const l = (function $F(e, t, n, r) {
                  if (e.isAbsolute) return new no(t.root, !0, 0);
                  if (-1 === r) return new no(n, n === t.root, 0);
                  return (function K_(e, t, n) {
                    let r = e,
                      o = t,
                      i = n;
                    for (; i > o; ) {
                      if (((i -= o), (r = r.parent), !r)) throw new C(4005, !1);
                      o = r.segments.length;
                    }
                    return new no(r, !1, o - i);
                  })(n, r + (vi(e.commands[0]) ? 0 : 1), e.numberOfDoubleDots);
                })(i, t, e.snapshot?._urlSegment, u),
                c = l.processChildren
                  ? Di(l.segmentGroup, l.index, i.commands)
                  : Dd(l.segmentGroup, l.index, i.commands);
              return to(t.root, l.segmentGroup, c, r, o);
            })(e.snapshot?._lastPathIndex);
      }
      function vi(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function _i(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function to(e, t, n, r, o) {
        let s,
          i = {};
        r &&
          ke(r, (u, l) => {
            i[l] = Array.isArray(u) ? u.map((c) => `${c}`) : `${u}`;
          }),
          (s = e === t ? n : q_(e, t, n));
        const a = vd(ga(s));
        return new sr(a, i, o);
      }
      function q_(e, t, n) {
        const r = {};
        return (
          ke(e.children, (o, i) => {
            r[i] = o === t ? n : q_(o, t, n);
          }),
          new H(e.segments, r)
        );
      }
      class Z_ {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && vi(r[0]))
          )
            throw new C(4003, !1);
          const o = r.find(_i);
          if (o && o !== L_(r)) throw new C(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class no {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function Dd(e, t, n) {
        if (
          (e || (e = new H([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return Di(e, t, n);
        const r = (function HF(e, t, n) {
            let r = 0,
              o = t;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= n.length) return i;
              const s = e.segments[o],
                a = n[r];
              if (_i(a)) break;
              const u = `${a}`,
                l = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === u) break;
              if (u && l && "object" == typeof l && void 0 === l.outlets) {
                if (!J_(u, l, s)) return i;
                r += 2;
              } else {
                if (!J_(u, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, t, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new H(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[U] = new H(e.segments.slice(r.pathIndex), e.children)),
            Di(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new H(e.segments, {})
          : r.match && !e.hasChildren()
          ? Cd(e, t, n)
          : r.match
          ? Di(e, 0, o)
          : Cd(e, t, n);
      }
      function Di(e, t, n) {
        if (0 === n.length) return new H(e.segments, {});
        {
          const r = (function UF(e) {
              return _i(e[0]) ? e[0].outlets : { [U]: e };
            })(n),
            o = {};
          return (
            ke(r, (i, s) => {
              "string" == typeof i && (i = [i]),
                null !== i && (o[s] = Dd(e.children[s], t, i));
            }),
            ke(e.children, (i, s) => {
              void 0 === r[s] && (o[s] = i);
            }),
            new H(e.segments, o)
          );
        }
      }
      function Cd(e, t, n) {
        const r = e.segments.slice(0, t);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (_i(i)) {
            const u = GF(i.outlets);
            return new H(r, u);
          }
          if (0 === o && vi(n[0])) {
            r.push(new mi(e.segments[t].path, Y_(n[0]))), o++;
            continue;
          }
          const s = _i(i) ? i.outlets[U] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && vi(a)
            ? (r.push(new mi(s, Y_(a))), (o += 2))
            : (r.push(new mi(s, {})), o++);
        }
        return new H(r, {});
      }
      function GF(e) {
        const t = {};
        return (
          ke(e, (n, r) => {
            "string" == typeof n && (n = [n]),
              null !== n && (t[r] = Cd(new H([], {}), 0, n));
          }),
          t
        );
      }
      function Y_(e) {
        const t = {};
        return ke(e, (n, r) => (t[r] = `${n}`)), t;
      }
      function J_(e, t, n) {
        return e == n.path && en(t, n.parameters);
      }
      class wn {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class wd extends wn {
        constructor(t, n, r = "imperative", o = null) {
          super(t, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class lr extends wn {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class ma extends wn {
        constructor(t, n, r, o) {
          super(t, n), (this.reason = r), (this.code = o), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class X_ extends wn {
        constructor(t, n, r, o) {
          super(t, n), (this.error = r), (this.target = o), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class zF extends wn {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class WF extends wn {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class qF extends wn {
        constructor(t, n, r, o, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class ZF extends wn {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class QF extends wn {
        constructor(t, n, r, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class KF {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class YF {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class JF {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class XF {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class e1 {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class t1 {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class eD {
        constructor(t, n, r) {
          (this.routerEvent = t),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class tD {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = Ed(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = Ed(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = bd(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== t);
        }
        pathFromRoot(t) {
          return bd(t, this._root).map((n) => n.value);
        }
      }
      function Ed(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = Ed(e, n);
          if (r) return r;
        }
        return null;
      }
      function bd(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = bd(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class En {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function ro(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class nD extends tD {
        constructor(t, n) {
          super(t), (this.snapshot = n), Md(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function rD(e, t) {
        const n = (function r1(e, t) {
            const s = new ya([], {}, {}, "", {}, U, t, null, e.root, -1, {});
            return new iD("", new En(s, []));
          })(e, t),
          r = new Ut([new mi("", {})]),
          o = new Ut({}),
          i = new Ut({}),
          s = new Ut({}),
          a = new Ut(""),
          u = new cr(r, o, s, a, i, U, t, n.root);
        return (u.snapshot = n.root), new nD(new En(u, []), n);
      }
      class cr {
        constructor(t, n, r, o, i, s, a, u) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.pipe(W((l) => l[gi])) ?? I(void 0)),
            (this._futureSnapshot = u);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(W((t) => eo(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(W((t) => eo(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function oD(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function o1(e) {
          return e.reduce(
            (t, n) => ({
              params: { ...t.params, ...n.params },
              data: { ...t.data, ...n.data },
              resolve: {
                ...n.data,
                ...t.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class ya {
        constructor(t, n, r, o, i, s, a, u, l, c, d, f) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.title = this.data?.[gi]),
            (this.routeConfig = u),
            (this._urlSegment = l),
            (this._lastPathIndex = c),
            (this._correctedLastPathIndex = f ?? c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = eo(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = eo(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class iD extends tD {
        constructor(t, n) {
          super(n), (this.url = t), Md(this, n);
        }
        toString() {
          return sD(this._root);
        }
      }
      function Md(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => Md(e, n));
      }
      function sD(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(sD).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function Sd(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            en(t.queryParams, n.queryParams) ||
              e.queryParams.next(n.queryParams),
            t.fragment !== n.fragment && e.fragment.next(n.fragment),
            en(t.params, n.params) || e.params.next(n.params),
            (function _F(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!en(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.url.next(n.url),
            en(t.data, n.data) || e.data.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function Id(e, t) {
        const n =
          en(e.params, t.params) &&
          (function bF(e, t) {
            return (
              ar(e, t) && e.every((n, r) => en(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || Id(e.parent, t.parent))
        );
      }
      function Ci(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const o = (function s1(e, t, n) {
            return t.children.map((r) => {
              for (const o of n.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return Ci(e, r, o);
              return Ci(e, r);
            });
          })(e, t, n);
          return new En(r, o);
        }
        {
          if (e.shouldAttach(t.value)) {
            const i = e.retrieve(t.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => Ci(e, a))),
                s
              );
            }
          }
          const r = (function a1(e) {
              return new cr(
                new Ut(e.url),
                new Ut(e.params),
                new Ut(e.queryParams),
                new Ut(e.fragment),
                new Ut(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            o = t.children.map((i) => Ci(e, i));
          return new En(r, o);
        }
      }
      const Ad = "ngNavigationCancelingError";
      function aD(e, t) {
        const { redirectTo: n, navigationBehaviorOptions: r } = ur(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          o = uD(!1, 0, t);
        return (o.url = n), (o.navigationBehaviorOptions = r), o;
      }
      function uD(e, t, n) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Ad] = !0), (r.cancellationCode = t), n && (r.url = n), r;
      }
      function lD(e) {
        return cD(e) && ur(e.url);
      }
      function cD(e) {
        return e && e[Ad];
      }
      class u1 {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.injector = null),
            (this.children = new wi()),
            (this.attachRef = null);
        }
      }
      let wi = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const o = this.getOrCreateContext(n);
            (o.outlet = r), this.contexts.set(n, o);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new u1()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const va = !1;
      let Td = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.parentContexts = n),
              (this.location = r),
              (this.changeDetector = i),
              (this.environmentInjector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new ge()),
              (this.deactivateEvents = new ge()),
              (this.attachEvents = new ge()),
              (this.detachEvents = new ge()),
              (this.name = o || U),
              n.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.getContext(this.name)?.outlet === this &&
              this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const n = this.parentContexts.getContext(this.name);
              n &&
                n.route &&
                (n.attachRef
                  ? this.attach(n.attachRef, n.route)
                  : this.activateWith(n.route, n.injector));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new C(4012, va);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new C(4012, va);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new C(4012, va);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new C(4013, va);
            this._activatedRoute = n;
            const o = this.location,
              s = n._futureSnapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              u = new l1(n, a, o.injector);
            if (
              r &&
              (function c1(e) {
                return !!e.resolveComponentFactory;
              })(r)
            ) {
              const l = r.resolveComponentFactory(s);
              this.activated = o.createComponent(l, o.length, u);
            } else
              this.activated = o.createComponent(s, {
                index: o.length,
                injector: u,
                environmentInjector: r ?? this.environmentInjector,
              });
            this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(wi), _(Vt), Eo("name"), _(Us), _(xn));
          }),
          (e.ɵdir = F({
            type: e,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
          })),
          e
        );
      })();
      class l1 {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === cr
            ? this.route
            : t === wi
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      let xd = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = yt({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [_y],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && He(0, "router-outlet");
            },
            dependencies: [Td],
            encapsulation: 2,
          })),
          e
        );
      })();
      function dD(e, t) {
        return (
          e.providers &&
            !e._injector &&
            (e._injector = Fs(e.providers, t, `Route: ${e.path}`)),
          e._injector ?? t
        );
      }
      function Rd(e) {
        const t = e.children && e.children.map(Rd),
          n = t ? { ...e, children: t } : { ...e };
        return (
          !n.component &&
            !n.loadComponent &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== U &&
            (n.component = xd),
          n
        );
      }
      function Mt(e) {
        return e.outlet || U;
      }
      function fD(e, t) {
        const n = e.filter((r) => Mt(r) === t);
        return n.push(...e.filter((r) => Mt(r) !== t)), n;
      }
      function Ei(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const n = t.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class g1 {
        constructor(t, n, r, o) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            Sd(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const o = ro(n);
          t.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            ke(o, (i, s) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = ro(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = ro(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const o = ro(n);
          t.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new t1(i.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new XF(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if ((Sd(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Sd(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = Ei(o.snapshot),
                u = a?.get($o) ?? null;
              (s.attachRef = null),
                (s.route = o),
                (s.resolver = u),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(o, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class hD {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class _a {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function m1(e, t, n) {
        const r = e._root;
        return bi(r, t ? t._root : null, n, [r.value]);
      }
      function oo(e, t) {
        const n = Symbol(),
          r = t.get(e, n);
        return r === n
          ? "function" != typeof e ||
            (function rE(e) {
              return null !== Vi(e);
            })(e)
            ? t.get(e)
            : e
          : r;
      }
      function bi(
        e,
        t,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const i = ro(t);
        return (
          e.children.forEach((s) => {
            (function v1(
              e,
              t,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const i = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const u = (function _1(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !ar(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !ar(e.url, t.url) || !en(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Id(e, t) || !en(e.queryParams, t.queryParams);
                    default:
                      return !Id(e, t);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                u
                  ? o.canActivateChecks.push(new hD(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  bi(e, t, i.component ? (a ? a.children : null) : n, r, o),
                  u &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new _a(a.outlet.component, s));
              } else
                s && Mi(t, a, o),
                  o.canActivateChecks.push(new hD(r)),
                  bi(e, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          ke(i, (s, a) => Mi(s, n.getContext(a), o)),
          o
        );
      }
      function Mi(e, t, n) {
        const r = ro(e),
          o = e.value;
        ke(r, (i, s) => {
          Mi(i, o.component ? (t ? t.children.getContext(s) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new _a(
              o.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              o
            )
          );
      }
      function Si(e) {
        return "function" == typeof e;
      }
      function Fd(e) {
        return e instanceof ua || "EmptyError" === e?.name;
      }
      const Da = Symbol("INITIAL_VALUE");
      function io() {
        return Xt((e) =>
          A_(
            e.map((t) =>
              t.pipe(
                pi(1),
                (function fF(...e) {
                  const t = fo(e);
                  return Fe((n, r) => {
                    (t ? dd(e, n, t) : dd(e, n)).subscribe(r);
                  });
                })(Da)
              )
            )
          ).pipe(
            W((t) => {
              for (const n of t)
                if (!0 !== n) {
                  if (n === Da) return Da;
                  if (!1 === n || n instanceof sr) return n;
                }
              return !0;
            }),
            Pn((t) => t !== Da),
            pi(1)
          )
        );
      }
      function pD(e) {
        return (function sw(...e) {
          return bf(e);
        })(
          Ge((t) => {
            if (ur(t)) throw aD(0, t);
          }),
          W((t) => !0 === t)
        );
      }
      const Od = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function gD(e, t, n, r, o) {
        const i = Pd(e, t, n);
        return i.matched
          ? (function k1(e, t, n, r) {
              const o = t.canMatch;
              return o && 0 !== o.length
                ? I(
                    o.map((s) => {
                      const a = oo(s, e);
                      return Vn(
                        (function M1(e) {
                          return e && Si(e.canMatch);
                        })(a)
                          ? a.canMatch(t, n)
                          : e.runInContext(() => a(t, n))
                      );
                    })
                  ).pipe(io(), pD())
                : I(!0);
            })((r = dD(t, r)), t, n).pipe(W((s) => (!0 === s ? i : { ...Od })))
          : I(i);
      }
      function Pd(e, t, n) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? { ...Od }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const o = (t.matcher || vF)(n, e, t);
        if (!o) return { ...Od };
        const i = {};
        ke(o.posParams, (a, u) => {
          i[u] = a.path;
        });
        const s =
          o.consumed.length > 0
            ? { ...i, ...o.consumed[o.consumed.length - 1].parameters }
            : i;
        return {
          matched: !0,
          consumedSegments: o.consumed,
          remainingSegments: n.slice(o.consumed.length),
          parameters: s,
          positionalParamSegments: o.posParams ?? {},
        };
      }
      function Ca(e, t, n, r, o = "corrected") {
        if (
          n.length > 0 &&
          (function j1(e, t, n) {
            return n.some((r) => wa(e, t, r) && Mt(r) !== U);
          })(e, n, r)
        ) {
          const s = new H(
            t,
            (function V1(e, t, n, r) {
              const o = {};
              (o[U] = r),
                (r._sourceSegment = e),
                (r._segmentIndexShift = t.length);
              for (const i of n)
                if ("" === i.path && Mt(i) !== U) {
                  const s = new H([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = t.length),
                    (o[Mt(i)] = s);
                }
              return o;
            })(e, t, r, new H(n, e.children))
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: [] }
          );
        }
        if (
          0 === n.length &&
          (function B1(e, t, n) {
            return n.some((r) => wa(e, t, r));
          })(e, n, r)
        ) {
          const s = new H(
            e.segments,
            (function L1(e, t, n, r, o, i) {
              const s = {};
              for (const a of r)
                if (wa(e, n, a) && !o[Mt(a)]) {
                  const u = new H([], {});
                  (u._sourceSegment = e),
                    (u._segmentIndexShift =
                      "legacy" === i ? e.segments.length : t.length),
                    (s[Mt(a)] = u);
                }
              return { ...o, ...s };
            })(e, t, n, r, e.children, o)
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: n }
          );
        }
        const i = new H(e.segments, e.children);
        return (
          (i._sourceSegment = e),
          (i._segmentIndexShift = t.length),
          { segmentGroup: i, slicedSegments: n }
        );
      }
      function wa(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      function mD(e, t, n, r) {
        return (
          !!(Mt(e) === r || (r !== U && wa(t, n, e))) &&
          ("**" === e.path || Pd(t, e, n).matched)
        );
      }
      function yD(e, t, n) {
        return 0 === t.length && !e.children[n];
      }
      const Ea = !1;
      class ba {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class vD {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function Ii(e) {
        return hi(new ba(e));
      }
      function _D(e) {
        return hi(new vD(e));
      }
      class G1 {
        constructor(t, n, r, o, i) {
          (this.injector = t),
            (this.configLoader = n),
            (this.urlSerializer = r),
            (this.urlTree = o),
            (this.config = i),
            (this.allowRedirects = !0);
        }
        apply() {
          const t = Ca(this.urlTree.root, [], [], this.config).segmentGroup,
            n = new H(t.segments, t.children);
          return this.expandSegmentGroup(this.injector, this.config, n, U)
            .pipe(
              W((i) =>
                this.createUrlTree(
                  ga(i),
                  this.urlTree.queryParams,
                  this.urlTree.fragment
                )
              )
            )
            .pipe(
              Ln((i) => {
                if (i instanceof vD)
                  return (this.allowRedirects = !1), this.match(i.urlTree);
                throw i instanceof ba ? this.noMatchError(i) : i;
              })
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.injector, this.config, t.root, U)
            .pipe(
              W((o) => this.createUrlTree(ga(o), t.queryParams, t.fragment))
            )
            .pipe(
              Ln((o) => {
                throw o instanceof ba ? this.noMatchError(o) : o;
              })
            );
        }
        noMatchError(t) {
          return new C(4002, Ea);
        }
        createUrlTree(t, n, r) {
          const o = vd(t);
          return new sr(o, n, r);
        }
        expandSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, n, r).pipe(W((i) => new H([], i)))
            : this.expandSegment(t, r, n, r.segments, o, !0);
        }
        expandChildren(t, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return De(o).pipe(
            ir((i) => {
              const s = r.children[i],
                a = fD(n, i);
              return this.expandSegmentGroup(t, a, s, i).pipe(
                W((u) => ({ segment: u, outlet: i }))
              );
            }),
            F_((i, s) => ((i[s.outlet] = s.segment), i), {}),
            O_()
          );
        }
        expandSegment(t, n, r, o, i, s) {
          return De(r).pipe(
            ir((a) =>
              this.expandSegmentAgainstRoute(t, n, r, a, o, i, s).pipe(
                Ln((l) => {
                  if (l instanceof ba) return I(null);
                  throw l;
                })
              )
            ),
            kn((a) => !!a),
            Ln((a, u) => {
              if (Fd(a)) return yD(n, o, i) ? I(new H([], {})) : Ii(n);
              throw a;
            })
          );
        }
        expandSegmentAgainstRoute(t, n, r, o, i, s, a) {
          return mD(o, n, i, s)
            ? void 0 === o.redirectTo
              ? this.matchSegmentAgainstRoute(t, n, o, i, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s)
              : Ii(n)
            : Ii(n);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                o,
                i,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
          const i = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? _D(i)
            : this.lineralizeSegments(r, i).pipe(
                Pe((s) => {
                  const a = new H(s, {});
                  return this.expandSegment(t, a, n, s, o, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: u,
            remainingSegments: l,
            positionalParamSegments: c,
          } = Pd(n, o, i);
          if (!a) return Ii(n);
          const d = this.applyRedirectCommands(u, o.redirectTo, c);
          return o.redirectTo.startsWith("/")
            ? _D(d)
            : this.lineralizeSegments(o, d).pipe(
                Pe((f) => this.expandSegment(t, n, r, f.concat(l), s, !1))
              );
        }
        matchSegmentAgainstRoute(t, n, r, o, i) {
          return "**" === r.path
            ? ((t = dD(r, t)),
              r.loadChildren
                ? (r._loadedRoutes
                    ? I({
                        routes: r._loadedRoutes,
                        injector: r._loadedInjector,
                      })
                    : this.configLoader.loadChildren(t, r)
                  ).pipe(
                    W(
                      (a) => (
                        (r._loadedRoutes = a.routes),
                        (r._loadedInjector = a.injector),
                        new H(o, {})
                      )
                    )
                  )
                : I(new H(o, {})))
            : gD(n, r, o, t).pipe(
                Xt(
                  ({ matched: s, consumedSegments: a, remainingSegments: u }) =>
                    s
                      ? this.getChildConfig((t = r._injector ?? t), r, o).pipe(
                          Pe((c) => {
                            const d = c.injector ?? t,
                              f = c.routes,
                              { segmentGroup: h, slicedSegments: p } = Ca(
                                n,
                                a,
                                u,
                                f
                              ),
                              g = new H(h.segments, h.children);
                            if (0 === p.length && g.hasChildren())
                              return this.expandChildren(d, f, g).pipe(
                                W((y) => new H(a, y))
                              );
                            if (0 === f.length && 0 === p.length)
                              return I(new H(a, {}));
                            const m = Mt(r) === i;
                            return this.expandSegment(
                              d,
                              g,
                              f,
                              p,
                              m ? U : i,
                              !0
                            ).pipe(
                              W((w) => new H(a.concat(w.segments), w.children))
                            );
                          })
                        )
                      : Ii(n)
                )
              );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? I({ routes: n.children, injector: t })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? I({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function P1(e, t, n, r) {
                  const o = t.canLoad;
                  return void 0 === o || 0 === o.length
                    ? I(!0)
                    : I(
                        o.map((s) => {
                          const a = oo(s, e);
                          return Vn(
                            (function C1(e) {
                              return e && Si(e.canLoad);
                            })(a)
                              ? a.canLoad(t, n)
                              : e.runInContext(() => a(t, n))
                          );
                        })
                      ).pipe(io(), pD());
                })(t, n, r).pipe(
                  Pe((o) =>
                    o
                      ? this.configLoader.loadChildren(t, n).pipe(
                          Ge((i) => {
                            (n._loadedRoutes = i.routes),
                              (n._loadedInjector = i.injector);
                          })
                        )
                      : (function U1(e) {
                          return hi(uD(Ea, 3));
                        })()
                  )
                )
            : I({ routes: [], injector: t });
        }
        lineralizeSegments(t, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return I(r);
            if (o.numberOfChildren > 1 || !o.children[U])
              return hi(new C(4e3, Ea));
            o = o.children[U];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r
          );
        }
        applyRedirectCreateUrlTree(t, n, r, o) {
          const i = this.createSegmentGroup(t, n.root, r, o);
          return new sr(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            ke(t, (o, i) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, o) {
          const i = this.createSegments(t, n.segments, r, o);
          let s = {};
          return (
            ke(n.children, (a, u) => {
              s[u] = this.createSegmentGroup(t, a, r, o);
            }),
            new H(i, s)
          );
        }
        createSegments(t, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(t, i, o)
              : this.findOrReturn(i, r)
          );
        }
        findPosParam(t, n, r) {
          const o = r[n.path.substring(1)];
          if (!o) throw new C(4001, Ea);
          return o;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === t.path) return n.splice(r), o;
            r++;
          }
          return t;
        }
      }
      class W1 {}
      class Q1 {
        constructor(t, n, r, o, i, s, a, u) {
          (this.injector = t),
            (this.rootComponentType = n),
            (this.config = r),
            (this.urlTree = o),
            (this.url = i),
            (this.paramsInheritanceStrategy = s),
            (this.relativeLinkResolution = a),
            (this.urlSerializer = u);
        }
        recognize() {
          const t = Ca(
            this.urlTree.root,
            [],
            [],
            this.config.filter((n) => void 0 === n.redirectTo),
            this.relativeLinkResolution
          ).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            U
          ).pipe(
            W((n) => {
              if (null === n) return null;
              const r = new ya(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  U,
                  this.rootComponentType,
                  null,
                  this.urlTree.root,
                  -1,
                  {}
                ),
                o = new En(r, n),
                i = new iD(this.url, o);
              return this.inheritParamsAndData(i._root), i;
            })
          );
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = oD(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, n, r)
            : this.processSegment(t, n, r, r.segments, o);
        }
        processChildren(t, n, r) {
          return De(Object.keys(r.children)).pipe(
            ir((o) => {
              const i = r.children[o],
                s = fD(n, o);
              return this.processSegmentGroup(t, s, i, o);
            }),
            F_((o, i) => (o && i ? (o.push(...i), o) : null)),
            (function gF(e, t = !1) {
              return Fe((n, r) => {
                let o = 0;
                n.subscribe(
                  Se(r, (i) => {
                    const s = e(i, o++);
                    (s || t) && r.next(i), !s && r.complete();
                  })
                );
              });
            })((o) => null !== o),
            la(null),
            O_(),
            W((o) => {
              if (null === o) return null;
              const i = DD(o);
              return (
                (function K1(e) {
                  e.sort((t, n) =>
                    t.value.outlet === U
                      ? -1
                      : n.value.outlet === U
                      ? 1
                      : t.value.outlet.localeCompare(n.value.outlet)
                  );
                })(i),
                i
              );
            })
          );
        }
        processSegment(t, n, r, o, i) {
          return De(n).pipe(
            ir((s) =>
              this.processSegmentAgainstRoute(s._injector ?? t, s, r, o, i)
            ),
            kn((s) => !!s),
            Ln((s) => {
              if (Fd(s)) return yD(r, o, i) ? I([]) : I(null);
              throw s;
            })
          );
        }
        processSegmentAgainstRoute(t, n, r, o, i) {
          if (n.redirectTo || !mD(n, r, o, i)) return I(null);
          let s;
          if ("**" === n.path) {
            const a = o.length > 0 ? L_(o).parameters : {},
              u = wD(r) + o.length;
            s = I({
              snapshot: new ya(
                o,
                a,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                bD(n),
                Mt(n),
                n.component ?? n._loadedComponent ?? null,
                n,
                CD(r),
                u,
                MD(n),
                u
              ),
              consumedSegments: [],
              remainingSegments: [],
            });
          } else
            s = gD(r, n, o, t).pipe(
              W(
                ({
                  matched: a,
                  consumedSegments: u,
                  remainingSegments: l,
                  parameters: c,
                }) => {
                  if (!a) return null;
                  const d = wD(r) + u.length;
                  return {
                    snapshot: new ya(
                      u,
                      c,
                      Object.freeze({ ...this.urlTree.queryParams }),
                      this.urlTree.fragment,
                      bD(n),
                      Mt(n),
                      n.component ?? n._loadedComponent ?? null,
                      n,
                      CD(r),
                      d,
                      MD(n),
                      d
                    ),
                    consumedSegments: u,
                    remainingSegments: l,
                  };
                }
              )
            );
          return s.pipe(
            Xt((a) => {
              if (null === a) return I(null);
              const {
                snapshot: u,
                consumedSegments: l,
                remainingSegments: c,
              } = a;
              t = n._injector ?? t;
              const d = n._loadedInjector ?? t,
                f = (function Y1(e) {
                  return e.children
                    ? e.children
                    : e.loadChildren
                    ? e._loadedRoutes
                    : [];
                })(n),
                { segmentGroup: h, slicedSegments: p } = Ca(
                  r,
                  l,
                  c,
                  f.filter((m) => void 0 === m.redirectTo),
                  this.relativeLinkResolution
                );
              if (0 === p.length && h.hasChildren())
                return this.processChildren(d, f, h).pipe(
                  W((m) => (null === m ? null : [new En(u, m)]))
                );
              if (0 === f.length && 0 === p.length) return I([new En(u, [])]);
              const g = Mt(n) === i;
              return this.processSegment(d, f, h, p, g ? U : i).pipe(
                W((m) => (null === m ? null : [new En(u, m)]))
              );
            })
          );
        }
      }
      function J1(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function DD(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!J1(r)) {
            t.push(r);
            continue;
          }
          const o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r);
        }
        for (const r of n) {
          const o = DD(r.children);
          t.push(new En(r.value, o));
        }
        return t.filter((r) => !n.has(r));
      }
      function CD(e) {
        let t = e;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function wD(e) {
        let t = e,
          n = t._segmentIndexShift ?? 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment), (n += t._segmentIndexShift ?? 0);
        return n - 1;
      }
      function bD(e) {
        return e.data || {};
      }
      function MD(e) {
        return e.resolve || {};
      }
      function SD(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function kd(e) {
        return Xt((t) => {
          const n = e(t);
          return n ? De(n).pipe(W(() => t)) : I(t);
        });
      }
      let ID = (() => {
          class e {
            buildTitle(n) {
              let r,
                o = n.root;
              for (; void 0 !== o; )
                (r = this.getResolvedTitleForRoute(o) ?? r),
                  (o = o.children.find((i) => i.outlet === U));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[gi];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = V({
              token: e,
              factory: function () {
                return me(AD);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        AD = (() => {
          class e extends ID {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(w_));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      class sO {}
      class uO extends class aO {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      } {}
      const Sa = new S("", { providedIn: "root", factory: () => ({}) }),
        Ld = new S("ROUTES");
      let Vd = (() => {
        class e {
          constructor(n, r) {
            (this.injector = n),
              (this.compiler = r),
              (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap());
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return I(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = Vn(n.loadComponent()).pipe(
                Ge((i) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = i);
                }),
                pd(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              o = new N_(r, () => new Ht()).pipe(fd());
            return this.componentLoaders.set(n, o), o;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return I({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const i = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                W((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let u,
                    l,
                    c = !1;
                  Array.isArray(a)
                    ? (l = a)
                    : ((u = a.create(n).injector),
                      (l = k_(u.get(Ld, [], x.Self | x.Optional))));
                  return { routes: l.map(Rd), injector: u };
                }),
                pd(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new N_(i, () => new Ht()).pipe(fd());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return Vn(n()).pipe(
              Pe((r) =>
                r instanceof yy || Array.isArray(r)
                  ? I(r)
                  : De(this.compiler.compileModuleAsync(r))
              )
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Ct), A(Ic));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class cO {}
      class dO {
        shouldProcessUrl(t) {
          return !0;
        }
        extract(t) {
          return t;
        }
        merge(t, n) {
          return t;
        }
      }
      function fO(e) {
        throw e;
      }
      function hO(e, t, n) {
        return t.parse("/");
      }
      const pO = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        gO = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      function xD() {
        const e = me(H_),
          t = me(wi),
          n = me(Uc),
          r = me(Ct),
          o = me(Ic),
          i = me(Ld, { optional: !0 }) ?? [],
          s = me(Sa, { optional: !0 }) ?? {},
          a = me(AD),
          u = me(ID, { optional: !0 }),
          l = me(cO, { optional: !0 }),
          c = me(sO, { optional: !0 }),
          d = new Le(null, e, t, n, r, o, k_(i));
        return (
          l && (d.urlHandlingStrategy = l),
          c && (d.routeReuseStrategy = c),
          (d.titleStrategy = u ?? a),
          (function mO(e, t) {
            e.errorHandler && (t.errorHandler = e.errorHandler),
              e.malformedUriErrorHandler &&
                (t.malformedUriErrorHandler = e.malformedUriErrorHandler),
              e.onSameUrlNavigation &&
                (t.onSameUrlNavigation = e.onSameUrlNavigation),
              e.paramsInheritanceStrategy &&
                (t.paramsInheritanceStrategy = e.paramsInheritanceStrategy),
              e.relativeLinkResolution &&
                (t.relativeLinkResolution = e.relativeLinkResolution),
              e.urlUpdateStrategy &&
                (t.urlUpdateStrategy = e.urlUpdateStrategy),
              e.canceledNavigationResolution &&
                (t.canceledNavigationResolution =
                  e.canceledNavigationResolution);
          })(s, d),
          d
        );
      }
      let Le = (() => {
        class e {
          constructor(n, r, o, i, s, a, u) {
            (this.rootComponentType = n),
              (this.urlSerializer = r),
              (this.rootContexts = o),
              (this.location = i),
              (this.config = u),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new Ht()),
              (this.errorHandler = fO),
              (this.malformedUriErrorHandler = hO),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.afterPreactivation = () => I(void 0)),
              (this.urlHandlingStrategy = new dO()),
              (this.routeReuseStrategy = new uO()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.configLoader = s.get(Vd)),
              (this.configLoader.onLoadEndListener = (f) =>
                this.triggerEvent(new YF(f))),
              (this.configLoader.onLoadStartListener = (f) =>
                this.triggerEvent(new KF(f))),
              (this.ngModule = s.get(nr)),
              (this.console = s.get(jT));
            const d = s.get(Ne);
            (this.isNgZoneEnabled = d instanceof Ne && Ne.isInAngularZone()),
              this.resetConfig(u),
              (this.currentUrlTree = (function DF() {
                return new sr(new H([], {}), {}, null);
              })()),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.routerState = rD(
                this.currentUrlTree,
                this.rootComponentType
              )),
              (this.transitions = new Ut({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            return this.location.getState()?.ɵrouterPageId;
          }
          setupNavigations(n) {
            const r = this.events;
            return n.pipe(
              Pn((o) => 0 !== o.id),
              W((o) => ({
                ...o,
                extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
              })),
              Xt((o) => {
                let i = !1,
                  s = !1;
                return I(o).pipe(
                  Ge((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.rawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? {
                            ...this.lastSuccessfulNavigation,
                            previousNavigation: null,
                          }
                        : null,
                    };
                  }),
                  Xt((a) => {
                    const u = this.browserUrlTree.toString(),
                      l =
                        !this.navigated ||
                        a.extractedUrl.toString() !== u ||
                        u !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || l) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        ND(a.source) && (this.browserUrlTree = a.extractedUrl),
                        I(a).pipe(
                          Xt((d) => {
                            const f = this.transitions.getValue();
                            return (
                              r.next(
                                new wd(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState
                                )
                              ),
                              f !== this.transitions.getValue()
                                ? rn
                                : Promise.resolve(d)
                            );
                          }),
                          (function z1(e, t, n, r) {
                            return Xt((o) =>
                              (function H1(e, t, n, r, o) {
                                return new G1(e, t, n, r, o).apply();
                              })(e, t, n, o.extractedUrl, r).pipe(
                                W((i) => ({ ...o, urlAfterRedirects: i }))
                              )
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config
                          ),
                          Ge((d) => {
                            (this.currentNavigation = {
                              ...this.currentNavigation,
                              finalUrl: d.urlAfterRedirects,
                            }),
                              (o.urlAfterRedirects = d.urlAfterRedirects);
                          }),
                          (function eO(e, t, n, r, o, i) {
                            return Pe((s) =>
                              (function Z1(
                                e,
                                t,
                                n,
                                r,
                                o,
                                i,
                                s = "emptyOnly",
                                a = "legacy"
                              ) {
                                return new Q1(e, t, n, r, o, s, a, i)
                                  .recognize()
                                  .pipe(
                                    Xt((u) =>
                                      null === u
                                        ? (function q1(e) {
                                            return new _e((t) => t.error(e));
                                          })(new W1())
                                        : I(u)
                                    )
                                  );
                              })(
                                e,
                                t,
                                n,
                                s.urlAfterRedirects,
                                r.serialize(s.urlAfterRedirects),
                                r,
                                o,
                                i
                              ).pipe(W((a) => ({ ...s, targetSnapshot: a })))
                            );
                          })(
                            this.ngModule.injector,
                            this.rootComponentType,
                            this.config,
                            this.urlSerializer,
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution
                          ),
                          Ge((d) => {
                            if (
                              ((o.targetSnapshot = d.targetSnapshot),
                              "eager" === this.urlUpdateStrategy)
                            ) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl
                                );
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new zF(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot
                            );
                            r.next(f);
                          })
                        )
                      );
                    if (
                      l &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: f,
                          extractedUrl: h,
                          source: p,
                          restoredState: g,
                          extras: m,
                        } = a,
                        D = new wd(f, this.serializeUrl(h), p, g);
                      r.next(D);
                      const w = rD(h, this.rootComponentType).snapshot;
                      return I(
                        (o = {
                          ...a,
                          targetSnapshot: w,
                          urlAfterRedirects: h,
                          extras: {
                            ...m,
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          },
                        })
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), rn;
                  }),
                  Ge((a) => {
                    const u = new WF(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot
                    );
                    this.triggerEvent(u);
                  }),
                  W(
                    (a) =>
                      (o = {
                        ...a,
                        guards: m1(
                          a.targetSnapshot,
                          a.currentSnapshot,
                          this.rootContexts
                        ),
                      })
                  ),
                  (function I1(e, t) {
                    return Pe((n) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: o,
                        guards: {
                          canActivateChecks: i,
                          canDeactivateChecks: s,
                        },
                      } = n;
                      return 0 === s.length && 0 === i.length
                        ? I({ ...n, guardsResult: !0 })
                        : (function A1(e, t, n, r) {
                            return De(e).pipe(
                              Pe((o) =>
                                (function O1(e, t, n, r, o) {
                                  const i =
                                    t && t.routeConfig
                                      ? t.routeConfig.canDeactivate
                                      : null;
                                  return i && 0 !== i.length
                                    ? I(
                                        i.map((a) => {
                                          const u = Ei(t) ?? o,
                                            l = oo(a, u);
                                          return Vn(
                                            (function b1(e) {
                                              return e && Si(e.canDeactivate);
                                            })(l)
                                              ? l.canDeactivate(e, t, n, r)
                                              : u.runInContext(() =>
                                                  l(e, t, n, r)
                                                )
                                          ).pipe(kn());
                                        })
                                      ).pipe(io())
                                    : I(!0);
                                })(o.component, o.route, n, t, r)
                              ),
                              kn((o) => !0 !== o, !0)
                            );
                          })(s, r, o, e).pipe(
                            Pe((a) =>
                              a &&
                              (function D1(e) {
                                return "boolean" == typeof e;
                              })(a)
                                ? (function T1(e, t, n, r) {
                                    return De(t).pipe(
                                      ir((o) =>
                                        dd(
                                          (function N1(e, t) {
                                            return (
                                              null !== e && t && t(new JF(e)),
                                              I(!0)
                                            );
                                          })(o.route.parent, r),
                                          (function x1(e, t) {
                                            return (
                                              null !== e && t && t(new e1(e)),
                                              I(!0)
                                            );
                                          })(o.route, r),
                                          (function F1(e, t, n) {
                                            const r = t[t.length - 1],
                                              i = t
                                                .slice(0, t.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function y1(e) {
                                                    const t = e.routeConfig
                                                      ? e.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return t && 0 !== t.length
                                                      ? { node: e, guards: t }
                                                      : null;
                                                  })(s)
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  x_(() =>
                                                    I(
                                                      s.guards.map((u) => {
                                                        const l =
                                                            Ei(s.node) ?? n,
                                                          c = oo(u, l);
                                                        return Vn(
                                                          (function E1(e) {
                                                            return (
                                                              e &&
                                                              Si(
                                                                e.canActivateChild
                                                              )
                                                            );
                                                          })(c)
                                                            ? c.canActivateChild(
                                                                r,
                                                                e
                                                              )
                                                            : l.runInContext(
                                                                () => c(r, e)
                                                              )
                                                        ).pipe(kn());
                                                      })
                                                    ).pipe(io())
                                                  )
                                                );
                                            return I(i).pipe(io());
                                          })(e, o.path, n),
                                          (function R1(e, t, n) {
                                            const r = t.routeConfig
                                              ? t.routeConfig.canActivate
                                              : null;
                                            if (!r || 0 === r.length)
                                              return I(!0);
                                            const o = r.map((i) =>
                                              x_(() => {
                                                const s = Ei(t) ?? n,
                                                  a = oo(i, s);
                                                return Vn(
                                                  (function w1(e) {
                                                    return (
                                                      e && Si(e.canActivate)
                                                    );
                                                  })(a)
                                                    ? a.canActivate(t, e)
                                                    : s.runInContext(() =>
                                                        a(t, e)
                                                      )
                                                ).pipe(kn());
                                              })
                                            );
                                            return I(o).pipe(io());
                                          })(e, o.route, n)
                                        )
                                      ),
                                      kn((o) => !0 !== o, !0)
                                    );
                                  })(r, i, e, t)
                                : I(a)
                            ),
                            W((a) => ({ ...n, guardsResult: a }))
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  Ge((a) => {
                    if (((o.guardsResult = a.guardsResult), ur(a.guardsResult)))
                      throw aD(0, a.guardsResult);
                    const u = new qF(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult
                    );
                    this.triggerEvent(u);
                  }),
                  Pn(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, "", 3),
                      !1)
                  ),
                  kd((a) => {
                    if (a.guards.canActivateChecks.length)
                      return I(a).pipe(
                        Ge((u) => {
                          const l = new ZF(
                            u.id,
                            this.serializeUrl(u.extractedUrl),
                            this.serializeUrl(u.urlAfterRedirects),
                            u.targetSnapshot
                          );
                          this.triggerEvent(l);
                        }),
                        Xt((u) => {
                          let l = !1;
                          return I(u).pipe(
                            (function tO(e, t) {
                              return Pe((n) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: o },
                                } = n;
                                if (!o.length) return I(n);
                                let i = 0;
                                return De(o).pipe(
                                  ir((s) =>
                                    (function nO(e, t, n, r) {
                                      const o = e.routeConfig,
                                        i = e._resolve;
                                      return (
                                        void 0 !== o?.title &&
                                          !SD(o) &&
                                          (i[gi] = o.title),
                                        (function rO(e, t, n, r) {
                                          const o = (function oO(e) {
                                            return [
                                              ...Object.keys(e),
                                              ...Object.getOwnPropertySymbols(
                                                e
                                              ),
                                            ];
                                          })(e);
                                          if (0 === o.length) return I({});
                                          const i = {};
                                          return De(o).pipe(
                                            Pe((s) =>
                                              (function iO(e, t, n, r) {
                                                const o = Ei(t) ?? r,
                                                  i = oo(e, o);
                                                return Vn(
                                                  i.resolve
                                                    ? i.resolve(t, n)
                                                    : o.runInContext(() =>
                                                        i(t, n)
                                                      )
                                                );
                                              })(e[s], t, n, r).pipe(
                                                kn(),
                                                Ge((a) => {
                                                  i[s] = a;
                                                })
                                              )
                                            ),
                                            hd(1),
                                            (function mF(e) {
                                              return W(() => e);
                                            })(i),
                                            Ln((s) => (Fd(s) ? rn : hi(s)))
                                          );
                                        })(i, e, t, r).pipe(
                                          W(
                                            (s) => (
                                              (e._resolvedData = s),
                                              (e.data = oD(e, n).resolve),
                                              o &&
                                                SD(o) &&
                                                (e.data[gi] = o.title),
                                              null
                                            )
                                          )
                                        )
                                      );
                                    })(s.route, r, e, t)
                                  ),
                                  Ge(() => i++),
                                  hd(1),
                                  Pe((s) => (i === o.length ? I(n) : rn))
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector
                            ),
                            Ge({
                              next: () => (l = !0),
                              complete: () => {
                                l ||
                                  (this.restoreHistory(u),
                                  this.cancelNavigationTransition(u, "", 2));
                              },
                            })
                          );
                        }),
                        Ge((u) => {
                          const l = new QF(
                            u.id,
                            this.serializeUrl(u.extractedUrl),
                            this.serializeUrl(u.urlAfterRedirects),
                            u.targetSnapshot
                          );
                          this.triggerEvent(l);
                        })
                      );
                  }),
                  kd((a) => {
                    const u = (l) => {
                      const c = [];
                      l.routeConfig?.loadComponent &&
                        !l.routeConfig._loadedComponent &&
                        c.push(
                          this.configLoader.loadComponent(l.routeConfig).pipe(
                            Ge((d) => {
                              l.component = d;
                            }),
                            W(() => {})
                          )
                        );
                      for (const d of l.children) c.push(...u(d));
                      return c;
                    };
                    return A_(u(a.targetSnapshot.root)).pipe(la(), pi(1));
                  }),
                  kd(() => this.afterPreactivation()),
                  W((a) => {
                    const u = (function i1(e, t, n) {
                      const r = Ci(e, t._root, n ? n._root : void 0);
                      return new nD(r, t);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState
                    );
                    return (o = { ...a, targetRouterState: u });
                  }),
                  Ge((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, t, n) =>
                    W(
                      (r) => (
                        new g1(
                          t,
                          r.targetRouterState,
                          r.currentRouterState,
                          n
                        ).activate(e),
                        r
                      )
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a)
                  ),
                  Ge({
                    next() {
                      i = !0;
                    },
                    complete() {
                      i = !0;
                    },
                  }),
                  pd(() => {
                    i || s || this.cancelNavigationTransition(o, "", 1),
                      this.currentNavigation?.id === o.id &&
                        (this.currentNavigation = null);
                  }),
                  Ln((a) => {
                    if (((s = !0), cD(a))) {
                      lD(a) ||
                        ((this.navigated = !0), this.restoreHistory(o, !0));
                      const u = new ma(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a.message,
                        a.cancellationCode
                      );
                      if ((r.next(u), lD(a))) {
                        const l = this.urlHandlingStrategy.merge(
                            a.url,
                            this.rawUrlTree
                          ),
                          c = {
                            skipLocationChange: o.extras.skipLocationChange,
                            replaceUrl:
                              "eager" === this.urlUpdateStrategy ||
                              ND(o.source),
                          };
                        this.scheduleNavigation(l, "imperative", null, c, {
                          resolve: o.resolve,
                          reject: o.reject,
                          promise: o.promise,
                        });
                      } else o.resolve(!1);
                    } else {
                      this.restoreHistory(o, !0);
                      const u = new X_(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a,
                        o.targetSnapshot ?? void 0
                      );
                      r.next(u);
                      try {
                        o.resolve(this.errorHandler(a));
                      } catch (l) {
                        o.reject(l);
                      }
                    }
                    return rn;
                  })
                );
              })
            );
          }
          resetRootComponentType(n) {
            (this.rootComponentType = n),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(n) {
            this.transitions.next({ ...this.transitions.value, ...n });
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    const o = { replaceUrl: !0 },
                      i = n.state?.navigationId ? n.state : null;
                    if (i) {
                      const a = { ...i };
                      delete a.navigationId,
                        delete a.ɵrouterPageId,
                        0 !== Object.keys(a).length && (o.state = a);
                    }
                    const s = this.parseUrl(n.url);
                    this.scheduleNavigation(s, r, i, o);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(n) {
            this.events.next(n);
          }
          resetConfig(n) {
            (this.config = n.map(Rd)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: u,
              } = r,
              l = o || this.routerState.root,
              c = u ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case "merge":
                d = { ...this.currentUrlTree.queryParams, ...i };
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = i || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              jF(l, this.currentUrlTree, n, d, c ?? null)
            );
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const o = ur(n) ? n : this.parseUrl(n),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, "imperative", null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function yO(e) {
                for (let t = 0; t < e.length; t++) {
                  if (null == e[t]) throw new C(4008, false);
                }
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let o;
            if (((o = !0 === r ? { ...pO } : !1 === r ? { ...gO } : r), ur(n)))
              return j_(this.currentUrlTree, n, o);
            const i = this.parseUrl(n);
            return j_(this.currentUrlTree, i, o);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, o) => {
              const i = n[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (n) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = n.id),
                  (this.currentPageId = n.targetPageId),
                  this.events.next(
                    new lr(
                      n.id,
                      this.serializeUrl(n.extractedUrl),
                      this.serializeUrl(this.currentUrlTree)
                    )
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  this.titleStrategy?.updateTitle(this.routerState.snapshot),
                  n.resolve(!0);
              },
              (n) => {
                this.console.warn(`Unhandled Navigation Error: ${n}`);
              }
            );
          }
          scheduleNavigation(n, r, o, i, s) {
            if (this.disposed) return Promise.resolve(!1);
            let a, u, l;
            s
              ? ((a = s.resolve), (u = s.reject), (l = s.promise))
              : (l = new Promise((f, h) => {
                  (a = f), (u = h);
                }));
            const c = ++this.navigationId;
            let d;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (o = this.location.getState()),
                  (d =
                    o && o.ɵrouterPageId
                      ? o.ɵrouterPageId
                      : i.replaceUrl || i.skipLocationChange
                      ? this.browserPageId ?? 0
                      : (this.browserPageId ?? 0) + 1))
                : (d = 0),
              this.setTransition({
                id: c,
                targetPageId: d,
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: n,
                extras: i,
                resolve: a,
                reject: u,
                promise: l,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              l.catch((f) => Promise.reject(f))
            );
          }
          setBrowserUrl(n, r) {
            const o = this.urlSerializer.serialize(n),
              i = {
                ...r.extras.state,
                ...this.generateNgRouterState(r.id, r.targetPageId),
              };
            this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl
              ? this.location.replaceState(o, "", i)
              : this.location.go(o, "", i);
          }
          restoreHistory(n, r = !1) {
            if ("computed" === this.canceledNavigationResolution) {
              const o = this.currentPageId - n.targetPageId;
              ("popstate" !== n.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !== this.currentNavigation?.finalUrl) ||
              0 === o
                ? this.currentUrlTree === this.currentNavigation?.finalUrl &&
                  0 === o &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(o);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId
              )
            );
          }
          cancelNavigationTransition(n, r, o) {
            const i = new ma(n.id, this.serializeUrl(n.extractedUrl), r, o);
            this.triggerEvent(i), n.resolve(!1);
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            bl();
          }),
          (e.ɵprov = V({
            token: e,
            factory: function () {
              return xD();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      function ND(e) {
        return "imperative" !== e;
      }
      let jd = (() => {
          class e {
            constructor(n, r, o, i, s) {
              (this.router = n),
                (this.route = r),
                (this.tabIndexAttribute = o),
                (this.renderer = i),
                (this.el = s),
                (this._preserveFragment = !1),
                (this._skipLocationChange = !1),
                (this._replaceUrl = !1),
                (this.commands = null),
                (this.onChanges = new Ht()),
                this.setTabIndexIfNotOnNativeEl("0");
            }
            set preserveFragment(n) {
              this._preserveFragment = _n(n);
            }
            get preserveFragment() {
              return this._preserveFragment;
            }
            set skipLocationChange(n) {
              this._skipLocationChange = _n(n);
            }
            get skipLocationChange() {
              return this._skipLocationChange;
            }
            set replaceUrl(n) {
              this._replaceUrl = _n(n);
            }
            get replaceUrl() {
              return this._replaceUrl;
            }
            setTabIndexIfNotOnNativeEl(n) {
              if (null != this.tabIndexAttribute) return;
              const r = this.renderer,
                o = this.el.nativeElement;
              null !== n
                ? r.setAttribute(o, "tabindex", n)
                : r.removeAttribute(o, "tabindex");
            }
            ngOnChanges(n) {
              this.onChanges.next(this);
            }
            set routerLink(n) {
              null != n
                ? ((this.commands = Array.isArray(n) ? n : [n]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick() {
              return (
                null === this.urlTree ||
                  this.router.navigateByUrl(this.urlTree, {
                    skipLocationChange: this.skipLocationChange,
                    replaceUrl: this.replaceUrl,
                    state: this.state,
                  }),
                !0
              );
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(Le), _(cr), Eo("tabindex"), _(dn), _(ht));
            }),
            (e.ɵdir = F({
              type: e,
              selectors: [["", "routerLink", "", 5, "a", 5, "area"]],
              hostBindings: function (n, r) {
                1 & n &&
                  Ee("click", function () {
                    return r.onClick();
                  });
              },
              inputs: {
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [_t],
            })),
            e
          );
        })(),
        Aa = (() => {
          class e {
            constructor(n, r, o) {
              (this.router = n),
                (this.route = r),
                (this.locationStrategy = o),
                (this._preserveFragment = !1),
                (this._skipLocationChange = !1),
                (this._replaceUrl = !1),
                (this.commands = null),
                (this.href = null),
                (this.onChanges = new Ht()),
                (this.subscription = n.events.subscribe((i) => {
                  i instanceof lr && this.updateTargetUrlAndHref();
                }));
            }
            set preserveFragment(n) {
              this._preserveFragment = _n(n);
            }
            get preserveFragment() {
              return this._preserveFragment;
            }
            set skipLocationChange(n) {
              this._skipLocationChange = _n(n);
            }
            get skipLocationChange() {
              return this._skipLocationChange;
            }
            set replaceUrl(n) {
              this._replaceUrl = _n(n);
            }
            get replaceUrl() {
              return this._replaceUrl;
            }
            set routerLink(n) {
              this.commands = null != n ? (Array.isArray(n) ? n : [n]) : null;
            }
            ngOnChanges(n) {
              this.updateTargetUrlAndHref(), this.onChanges.next(this);
            }
            ngOnDestroy() {
              this.subscription.unsubscribe();
            }
            onClick(n, r, o, i, s) {
              return (
                !!(
                  0 !== n ||
                  r ||
                  o ||
                  i ||
                  s ||
                  ("string" == typeof this.target && "_self" != this.target) ||
                  null === this.urlTree
                ) ||
                (this.router.navigateByUrl(this.urlTree, {
                  skipLocationChange: this.skipLocationChange,
                  replaceUrl: this.replaceUrl,
                  state: this.state,
                }),
                !1)
              );
            }
            updateTargetUrlAndHref() {
              this.href =
                null !== this.urlTree
                  ? this.locationStrategy.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(Le), _(cr), _(or));
            }),
            (e.ɵdir = F({
              type: e,
              selectors: [
                ["a", "routerLink", ""],
                ["area", "routerLink", ""],
              ],
              hostVars: 2,
              hostBindings: function (n, r) {
                1 & n &&
                  Ee("click", function (i) {
                    return r.onClick(
                      i.button,
                      i.ctrlKey,
                      i.shiftKey,
                      i.altKey,
                      i.metaKey
                    );
                  }),
                  2 & n && Kt("target", r.target)("href", r.href, jo);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [_t],
            })),
            e
          );
        })(),
        RD = (() => {
          class e {
            constructor(n, r, o, i, s, a) {
              (this.router = n),
                (this.element = r),
                (this.renderer = o),
                (this.cdr = i),
                (this.link = s),
                (this.linkWithHref = a),
                (this.classes = []),
                (this.isActive = !1),
                (this.routerLinkActiveOptions = { exact: !1 }),
                (this.isActiveChange = new ge()),
                (this.routerEventsSubscription = n.events.subscribe((u) => {
                  u instanceof lr && this.update();
                }));
            }
            ngAfterContentInit() {
              I(this.links.changes, this.linksWithHrefs.changes, I(null))
                .pipe(pr())
                .subscribe((n) => {
                  this.update(), this.subscribeToEachLinkOnChanges();
                });
            }
            subscribeToEachLinkOnChanges() {
              this.linkInputChangesSubscription?.unsubscribe();
              const n = [
                ...this.links.toArray(),
                ...this.linksWithHrefs.toArray(),
                this.link,
                this.linkWithHref,
              ]
                .filter((r) => !!r)
                .map((r) => r.onChanges);
              this.linkInputChangesSubscription = De(n)
                .pipe(pr())
                .subscribe((r) => {
                  this.isActive !== this.isLinkActive(this.router)(r) &&
                    this.update();
                });
            }
            set routerLinkActive(n) {
              const r = Array.isArray(n) ? n : n.split(" ");
              this.classes = r.filter((o) => !!o);
            }
            ngOnChanges(n) {
              this.update();
            }
            ngOnDestroy() {
              this.routerEventsSubscription.unsubscribe(),
                this.linkInputChangesSubscription?.unsubscribe();
            }
            update() {
              !this.links ||
                !this.linksWithHrefs ||
                !this.router.navigated ||
                Promise.resolve().then(() => {
                  const n = this.hasActiveLinks();
                  this.isActive !== n &&
                    ((this.isActive = n),
                    this.cdr.markForCheck(),
                    this.classes.forEach((r) => {
                      n
                        ? this.renderer.addClass(this.element.nativeElement, r)
                        : this.renderer.removeClass(
                            this.element.nativeElement,
                            r
                          );
                    }),
                    n && void 0 !== this.ariaCurrentWhenActive
                      ? this.renderer.setAttribute(
                          this.element.nativeElement,
                          "aria-current",
                          this.ariaCurrentWhenActive.toString()
                        )
                      : this.renderer.removeAttribute(
                          this.element.nativeElement,
                          "aria-current"
                        ),
                    this.isActiveChange.emit(n));
                });
            }
            isLinkActive(n) {
              const r = (function vO(e) {
                return !!e.paths;
              })(this.routerLinkActiveOptions)
                ? this.routerLinkActiveOptions
                : this.routerLinkActiveOptions.exact || !1;
              return (o) => !!o.urlTree && n.isActive(o.urlTree, r);
            }
            hasActiveLinks() {
              const n = this.isLinkActive(this.router);
              return (
                (this.link && n(this.link)) ||
                (this.linkWithHref && n(this.linkWithHref)) ||
                this.links.some(n) ||
                this.linksWithHrefs.some(n)
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(
                _(Le),
                _(ht),
                _(dn),
                _(Us),
                _(jd, 8),
                _(Aa, 8)
              );
            }),
            (e.ɵdir = F({
              type: e,
              selectors: [["", "routerLinkActive", ""]],
              contentQueries: function (n, r, o) {
                if ((1 & n && (Cc(o, jd, 5), Cc(o, Aa, 5)), 2 & n)) {
                  let i;
                  ri((i = oi())) && (r.links = i),
                    ri((i = oi())) && (r.linksWithHrefs = i);
                }
              },
              inputs: {
                routerLinkActiveOptions: "routerLinkActiveOptions",
                ariaCurrentWhenActive: "ariaCurrentWhenActive",
                routerLinkActive: "routerLinkActive",
              },
              outputs: { isActiveChange: "isActiveChange" },
              exportAs: ["routerLinkActive"],
              standalone: !0,
              features: [_t],
            })),
            e
          );
        })();
      class FD {}
      let _O = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.router = n),
              (this.injector = o),
              (this.preloadingStrategy = i),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                Pn((n) => n instanceof lr),
                ir(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const o = [];
            for (const i of r) {
              i.providers &&
                !i._injector &&
                (i._injector = Fs(i.providers, n, `Route: ${i.path}`));
              const s = i._injector ?? n,
                a = i._loadedInjector ?? s;
              (i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad) ||
              (i.loadComponent && !i._loadedComponent)
                ? o.push(this.preloadConfig(s, i))
                : (i.children || i._loadedRoutes) &&
                  o.push(this.processRoutes(a, i.children ?? i._loadedRoutes));
            }
            return De(o).pipe(pr());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let o;
              o =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : I(null);
              const i = o.pipe(
                Pe((s) =>
                  null === s
                    ? I(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? De([i, this.loader.loadComponent(r)]).pipe(pr())
                : i;
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Le), A(Ic), A(xn), A(FD), A(Vd));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Bd = new S("");
      let OD = (() => {
        class e {
          constructor(n, r, o = {}) {
            (this.router = n),
              (this.viewportScroller = r),
              (this.options = o),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (o.scrollPositionRestoration =
                o.scrollPositionRestoration || "disabled"),
              (o.anchorScrolling = o.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.router.events.subscribe((n) => {
              n instanceof wd
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof lr &&
                  ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.router.parseUrl(n.urlAfterRedirects).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.router.events.subscribe((n) => {
              n instanceof eD &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.router.triggerEvent(
              new eD(
                n,
                "popstate" === this.lastSource
                  ? this.store[this.restoredId]
                  : null,
                r
              )
            );
          }
          ngOnDestroy() {
            this.routerEventsSubscription &&
              this.routerEventsSubscription.unsubscribe(),
              this.scrollEventsSubscription &&
                this.scrollEventsSubscription.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            bl();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function so(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function $d(e) {
        return [{ provide: Ld, multi: !0, useValue: e }];
      }
      function kD() {
        const e = me(Ct);
        return (t) => {
          const n = e.get(Bs);
          if (t !== n.components[0]) return;
          const r = e.get(Le),
            o = e.get(LD);
          1 === e.get(Ud) && r.initialNavigation(),
            e.get(VD, null, x.Optional)?.setUpPreloading(),
            e.get(Bd, null, x.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            o.closed || (o.next(), o.unsubscribe());
        };
      }
      const LD = new S("", { factory: () => new Ht() }),
        Ud = new S("", { providedIn: "root", factory: () => 1 });
      const VD = new S("");
      function EO(e) {
        return so(0, [
          { provide: VD, useExisting: _O },
          { provide: FD, useExisting: e },
        ]);
      }
      const jD = new S("ROUTER_FORROOT_GUARD"),
        bO = [
          Uc,
          { provide: H_, useClass: md },
          { provide: Le, useFactory: xD },
          wi,
          {
            provide: cr,
            useFactory: function PD(e) {
              return e.routerState.root;
            },
            deps: [Le],
          },
          Vd,
        ];
      function MO() {
        return new hv("Router", Le);
      }
      let BD = (() => {
        class e {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                bO,
                [],
                $d(n),
                {
                  provide: jD,
                  useFactory: TO,
                  deps: [[Le, new xo(), new No()]],
                },
                { provide: Sa, useValue: r || {} },
                r?.useHash
                  ? { provide: or, useClass: Ix }
                  : { provide: or, useClass: Vv },
                {
                  provide: Bd,
                  useFactory: () => {
                    const e = me(Le),
                      t = me(QN),
                      n = me(Sa);
                    return (
                      n.scrollOffset && t.setOffset(n.scrollOffset),
                      new OD(e, t, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? EO(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: hv, multi: !0, useFactory: MO },
                r?.initialNavigation ? xO(r) : [],
                [
                  { provide: $D, useFactory: kD },
                  { provide: sv, multi: !0, useExisting: $D },
                ],
              ],
            };
          }
          static forChild(n) {
            return { ngModule: e, providers: [$d(n)] };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(jD, 8));
          }),
          (e.ɵmod = zt({ type: e })),
          (e.ɵinj = It({ imports: [xd] })),
          e
        );
      })();
      function TO(e) {
        return "guarded";
      }
      function xO(e) {
        return [
          "disabled" === e.initialNavigation
            ? so(3, [
                {
                  provide: Ls,
                  multi: !0,
                  useFactory: () => {
                    const t = me(Le);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Ud, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? so(2, [
                { provide: Ud, useValue: 0 },
                {
                  provide: Ls,
                  multi: !0,
                  deps: [Ct],
                  useFactory: (t) => {
                    const n = t.get(Mx, Promise.resolve());
                    let r = !1;
                    return () =>
                      n.then(
                        () =>
                          new Promise((i) => {
                            const s = t.get(Le),
                              a = t.get(LD);
                            (function o(i) {
                              t.get(Le)
                                .events.pipe(
                                  Pn(
                                    (a) =>
                                      a instanceof lr ||
                                      a instanceof ma ||
                                      a instanceof X_
                                  ),
                                  W(
                                    (a) =>
                                      a instanceof lr ||
                                      (a instanceof ma &&
                                        (0 === a.code || 1 === a.code) &&
                                        null)
                                  ),
                                  Pn((a) => null !== a),
                                  pi(1)
                                )
                                .subscribe(() => {
                                  i();
                                });
                            })(() => {
                              i(!0), (r = !0);
                            }),
                              (s.afterPreactivation = () => (
                                i(!0), r || a.closed ? I(void 0) : a
                              )),
                              s.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const $D = new S("");
      let Na = (() => {
          class e {
            constructor() {
              (this.title = ""), (this.customColor = "");
            }
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [["app-star"]],
              inputs: { title: "title", customColor: "customColor" },
              decls: 7,
              vars: 7,
              consts: [
                [1, "text-center", "pt-4"],
                [1, "text-uppercase", "mb-3", "fs-1", "fw-bolder"],
                [
                  1,
                  "d-flex",
                  "align-items-center",
                  "justify-content-center",
                  "mb-3",
                ],
                [1, "line", "me-3"],
                [1, "fa-solid", "fa-star"],
                [1, "line", "ms-3"],
              ],
              template: function (n, r) {
                1 & n &&
                  ($(0, "div", 0)(1, "h2", 1),
                  he(2),
                  z(),
                  $(3, "div", 2),
                  He(4, "div", 3)(5, "i", 4)(6, "div", 5),
                  z()()),
                  2 & n &&
                    (Zo("color", r.customColor),
                    Te(2),
                    nc(r.title),
                    Te(2),
                    Zo("background-color", r.customColor),
                    Te(2),
                    Zo("background-color", r.customColor));
              },
              styles: [".line[_ngcontent-%COMP%]{height:4px;width:80px}"],
            })),
            e
          );
        })(),
        RO = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [["app-about"]],
              decls: 11,
              vars: 2,
              consts: [
                [
                  1,
                  "about",
                  "text-white",
                  "d-flex",
                  "justify-content-center",
                  "align-items-center",
                ],
                [1, ""],
                [3, "title", "customColor"],
                [1, "container"],
                [1, "row", "px-5"],
                [1, "col-md-6", "ps-md-5"],
                [1, "col-md-6", "pe-5"],
              ],
              template: function (n, r) {
                1 & n &&
                  ($(0, "div", 0)(1, "div", 1),
                  He(2, "app-star", 2),
                  $(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "p"),
                  he(
                    7,
                    " Freelancer is a free bootstrap theme created by Route. The download includes the complete source files including HTML, CSS, and JavaScript as well as optional SASS stylesheets for easy customization. "
                  ),
                  z()(),
                  $(8, "div", 6)(9, "p"),
                  he(
                    10,
                    " Freelancer is a free bootstrap theme created by Route. The download includes the complete source files including HTML, CSS, and JavaScript as well as optional SASS stylesheets for easy customization. "
                  ),
                  z()()()()()()),
                  2 & n &&
                    (Te(2),
                    Ot("title", "about component")("customColor", "white"));
              },
              dependencies: [Na],
              styles: [
                ".about[_ngcontent-%COMP%]{background-color:var(--main-color)}",
              ],
            })),
            e
          );
        })(),
        UD = (() => {
          class e {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (o) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(dn), _(ht));
            }),
            (e.ɵdir = F({ type: e })),
            e
          );
        })(),
        dr = (() => {
          class e extends UD {}
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (
                  t ||
                  (t = (function Be(e) {
                    return Mn(() => {
                      const t = e.prototype.constructor,
                        n = t[sn] || xu(t),
                        r = Object.prototype;
                      let o = Object.getPrototypeOf(e.prototype).constructor;
                      for (; o && o !== r; ) {
                        const i = o[sn] || xu(o);
                        if (i && i !== n) return i;
                        o = Object.getPrototypeOf(o);
                      }
                      return (i) => new i();
                    });
                  })(e))
                )(r || e);
              };
            })()),
            (e.ɵdir = F({ type: e, features: [X] })),
            e
          );
        })();
      const tn = new S("NgValueAccessor"),
        PO = { provide: tn, useExisting: re(() => Ra), multi: !0 },
        LO = new S("CompositionEventMode");
      let Ra = (() => {
        class e extends UD {
          constructor(n, r, o) {
            super(n, r),
              (this._compositionMode = o),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function kO() {
                  const e = Jt() ? Jt().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(dn), _(ht), _(LO, 8));
          }),
          (e.ɵdir = F({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                Ee("input", function (i) {
                  return r._handleInput(i.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (i) {
                  return r._compositionEnd(i.target.value);
                });
            },
            features: [ue([PO]), X],
          })),
          e
        );
      })();
      const ze = new S("NgValidators"),
        Bn = new S("NgAsyncValidators");
      function XD(e) {
        return null != e;
      }
      function eC(e) {
        return qo(e) ? De(e) : e;
      }
      function tC(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? { ...t, ...n } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function nC(e, t) {
        return t.map((n) => n(e));
      }
      function rC(e) {
        return e.map((t) =>
          (function BO(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function Hd(e) {
        return null != e
          ? (function oC(e) {
              if (!e) return null;
              const t = e.filter(XD);
              return 0 == t.length
                ? null
                : function (n) {
                    return tC(nC(n, t));
                  };
            })(rC(e))
          : null;
      }
      function Gd(e) {
        return null != e
          ? (function iC(e) {
              if (!e) return null;
              const t = e.filter(XD);
              return 0 == t.length
                ? null
                : function (n) {
                    return (function FO(...e) {
                      const t = Uf(e),
                        { args: n, keys: r } = M_(e),
                        o = new _e((i) => {
                          const { length: s } = n;
                          if (!s) return void i.complete();
                          const a = new Array(s);
                          let u = s,
                            l = s;
                          for (let c = 0; c < s; c++) {
                            let d = !1;
                            St(n[c]).subscribe(
                              Se(
                                i,
                                (f) => {
                                  d || ((d = !0), l--), (a[c] = f);
                                },
                                () => u--,
                                void 0,
                                () => {
                                  (!u || !d) &&
                                    (l || i.next(r ? I_(r, a) : a),
                                    i.complete());
                                }
                              )
                            );
                          }
                        });
                      return t ? o.pipe(S_(t)) : o;
                    })(nC(n, t).map(eC)).pipe(W(tC));
                  };
            })(rC(e))
          : null;
      }
      function sC(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function zd(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function Oa(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function lC(e, t) {
        const n = zd(t);
        return (
          zd(e).forEach((o) => {
            Oa(n, o) || n.push(o);
          }),
          n
        );
      }
      function cC(e, t) {
        return zd(t).filter((n) => !Oa(e, n));
      }
      class dC {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = Hd(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = Gd(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t) {
          this.control && this.control.reset(t);
        }
        hasError(t, n) {
          return !!this.control && this.control.hasError(t, n);
        }
        getError(t, n) {
          return this.control ? this.control.getError(t, n) : null;
        }
      }
      class Xe extends dC {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class $n extends dC {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class fC {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let hC = (() => {
          class e extends fC {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_($n, 2));
            }),
            (e.ɵdir = F({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  gn("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending);
              },
              features: [X],
            })),
            e
          );
        })(),
        pC = (() => {
          class e extends fC {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(_(Xe, 10));
            }),
            (e.ɵdir = F({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  gn("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [X],
            })),
            e
          );
        })();
      const Ai = "VALID",
        ka = "INVALID",
        ao = "PENDING",
        Ti = "DISABLED";
      function Qd(e) {
        return (La(e) ? e.validators : e) || null;
      }
      function mC(e) {
        return Array.isArray(e) ? Hd(e) : e || null;
      }
      function Kd(e, t) {
        return (La(t) ? t.asyncValidators : e) || null;
      }
      function yC(e) {
        return Array.isArray(e) ? Gd(e) : e || null;
      }
      function La(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      class DC {
        constructor(t, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            (this._rawValidators = t),
            (this._rawAsyncValidators = n),
            (this._composedValidatorFn = mC(this._rawValidators)),
            (this._composedAsyncValidatorFn = yC(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === Ai;
        }
        get invalid() {
          return this.status === ka;
        }
        get pending() {
          return this.status == ao;
        }
        get disabled() {
          return this.status === Ti;
        }
        get enabled() {
          return this.status !== Ti;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          (this._rawValidators = t), (this._composedValidatorFn = mC(t));
        }
        setAsyncValidators(t) {
          (this._rawAsyncValidators = t),
            (this._composedAsyncValidatorFn = yC(t));
        }
        addValidators(t) {
          this.setValidators(lC(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(lC(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(cC(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(cC(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return Oa(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return Oa(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = ao),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = Ti),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = Ai),
            this._forEachChild((r) => {
              r.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === Ai || this.status === ao) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? Ti : Ai;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = ao), (this._hasOwnPendingAsyncValidator = !0);
            const n = eC(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, n = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(t) {
          let n = t;
          return null == n ||
            (Array.isArray(n) || (n = n.split(".")), 0 === n.length)
            ? null
            : n.reduce((r, o) => r && r._find(o), this);
        }
        getError(t, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, n) {
          return !!this.getError(t, n);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new ge()), (this.statusChanges = new ge());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? Ti
            : this.errors
            ? ka
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(ao)
            ? ao
            : this._anyControlsHaveStatus(ka)
            ? ka
            : Ai;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((n) => n.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          La(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
      }
      class Yd extends DC {
        constructor(t, n, r) {
          super(Qd(n), Kd(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, n) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(t, n, r = {}) {
          this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, n, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            n && this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, n = {}) {
          (function _C(e, t, n) {
            e._forEachChild((r, o) => {
              if (void 0 === n[o]) throw new C(1002, "");
            });
          })(this, 0, t),
            Object.keys(t).forEach((r) => {
              (function vC(e, t, n) {
                const r = e.controls;
                if (!(t ? Object.keys(r) : r).length) throw new C(1e3, "");
                if (!r[n]) throw new C(1001, "");
              })(this, !0, r),
                this.controls[r].setValue(t[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (Object.keys(t).forEach((r) => {
              const o = this.controls[r];
              o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = {}, n = {}) {
          this._forEachChild((r, o) => {
            r.reset(t[o], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (t, n, r) => ((t[r] = n.getRawValue()), t)
          );
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && t(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const [n, r] of Object.entries(this.controls))
            if (this.contains(n) && t(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
          );
        }
        _reduceChildren(t, n) {
          let r = t;
          return (
            this._forEachChild((o, i) => {
              r = n(r, o, i);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(t) {
          return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
        }
      }
      function xi(e, t) {
        Jd(e, t),
          t.valueAccessor.writeValue(e.value),
          e.disabled && t.valueAccessor.setDisabledState?.(!0),
          (function QO(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && CC(e, t);
            });
          })(e, t),
          (function YO(e, t) {
            const n = (r, o) => {
              t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function KO(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && CC(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function ZO(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const n = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(n),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(n);
                });
            }
          })(e, t);
      }
      function Ba(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function Jd(e, t) {
        const n = (function aC(e) {
          return e._rawValidators;
        })(e);
        null !== t.validator
          ? e.setValidators(sC(n, t.validator))
          : "function" == typeof n && e.setValidators([n]);
        const r = (function uC(e) {
          return e._rawAsyncValidators;
        })(e);
        null !== t.asyncValidator
          ? e.setAsyncValidators(sC(r, t.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const o = () => e.updateValueAndValidity();
        Ba(t._rawValidators, o), Ba(t._rawAsyncValidators, o);
      }
      function CC(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      const nP = { provide: Xe, useExisting: re(() => Ua) },
        Ni = (() => Promise.resolve())();
      let Ua = (() => {
        class e extends Xe {
          constructor(n, r) {
            super(),
              (this.submitted = !1),
              (this._directives = new Set()),
              (this.ngSubmit = new ge()),
              (this.form = new Yd({}, Hd(n), Gd(r)));
          }
          ngAfterViewInit() {
            this._setUpdateStrategy();
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          get controls() {
            return this.form.controls;
          }
          addControl(n) {
            Ni.then(() => {
              const r = this._findContainer(n.path);
              (n.control = r.registerControl(n.name, n.control)),
                xi(n.control, n),
                n.control.updateValueAndValidity({ emitEvent: !1 }),
                this._directives.add(n);
            });
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            Ni.then(() => {
              const r = this._findContainer(n.path);
              r && r.removeControl(n.name), this._directives.delete(n);
            });
          }
          addFormGroup(n) {
            Ni.then(() => {
              const r = this._findContainer(n.path),
                o = new Yd({});
              (function wC(e, t) {
                Jd(e, t);
              })(o, n),
                r.registerControl(n.name, o),
                o.updateValueAndValidity({ emitEvent: !1 });
            });
          }
          removeFormGroup(n) {
            Ni.then(() => {
              const r = this._findContainer(n.path);
              r && r.removeControl(n.name);
            });
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            Ni.then(() => {
              this.form.get(n.path).setValue(r);
            });
          }
          setValue(n) {
            this.control.setValue(n);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function bC(e, t) {
                e._syncPendingControls(),
                  t.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this._directives),
              this.ngSubmit.emit(n),
              "dialog" === n?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n) {
            this.form.reset(n), (this.submitted = !1);
          }
          _setUpdateStrategy() {
            this.options &&
              null != this.options.updateOn &&
              (this.form._updateOn = this.options.updateOn);
          }
          _findContainer(n) {
            return n.pop(), n.length ? this.form.get(n) : this.form;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(_(ze, 10), _(Bn, 10));
          }),
          (e.ɵdir = F({
            type: e,
            selectors: [
              ["form", 3, "ngNoForm", "", 3, "formGroup", ""],
              ["ng-form"],
              ["", "ngForm", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                Ee("submit", function (i) {
                  return r.onSubmit(i);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { options: ["ngFormOptions", "options"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [ue([nP]), X],
          })),
          e
        );
      })();
      function MC(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      function SC(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const IC = class extends DC {
          constructor(t = null, n, r) {
            super(Qd(n), Kd(r, n)),
              (this.defaultValue = null),
              (this._onChange = []),
              (this._pendingChange = !1),
              this._applyFormState(t),
              this._setUpdateStrategy(n),
              this._initObservables(),
              this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: !!this.asyncValidator,
              }),
              La(n) &&
                (n.nonNullable || n.initialValueIsDefault) &&
                (this.defaultValue = SC(t) ? t.value : t);
          }
          setValue(t, n = {}) {
            (this.value = this._pendingValue = t),
              this._onChange.length &&
                !1 !== n.emitModelToViewChange &&
                this._onChange.forEach((r) =>
                  r(this.value, !1 !== n.emitViewToModelChange)
                ),
              this.updateValueAndValidity(n);
          }
          patchValue(t, n = {}) {
            this.setValue(t, n);
          }
          reset(t = this.defaultValue, n = {}) {
            this._applyFormState(t),
              this.markAsPristine(n),
              this.markAsUntouched(n),
              this.setValue(this.value, n),
              (this._pendingChange = !1);
          }
          _updateValue() {}
          _anyControls(t) {
            return !1;
          }
          _allControlsDisabled() {
            return this.disabled;
          }
          registerOnChange(t) {
            this._onChange.push(t);
          }
          _unregisterOnChange(t) {
            MC(this._onChange, t);
          }
          registerOnDisabledChange(t) {
            this._onDisabledChange.push(t);
          }
          _unregisterOnDisabledChange(t) {
            MC(this._onDisabledChange, t);
          }
          _forEachChild(t) {}
          _syncPendingControls() {
            return !(
              "submit" !== this.updateOn ||
              (this._pendingDirty && this.markAsDirty(),
              this._pendingTouched && this.markAsTouched(),
              !this._pendingChange) ||
              (this.setValue(this._pendingValue, {
                onlySelf: !0,
                emitModelToViewChange: !1,
              }),
              0)
            );
          }
          _applyFormState(t) {
            SC(t)
              ? ((this.value = this._pendingValue = t.value),
                t.disabled
                  ? this.disable({ onlySelf: !0, emitEvent: !1 })
                  : this.enable({ onlySelf: !0, emitEvent: !1 }))
              : (this.value = this._pendingValue = t);
          }
        },
        iP = { provide: $n, useExisting: re(() => tf) },
        xC = (() => Promise.resolve())();
      let tf = (() => {
          class e extends $n {
            constructor(n, r, o, i, s) {
              super(),
                (this._changeDetectorRef = s),
                (this.control = new IC()),
                (this._registered = !1),
                (this.update = new ge()),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(o),
                (this.valueAccessor = (function ef(e, t) {
                  if (!t) return null;
                  let n, r, o;
                  return (
                    Array.isArray(t),
                    t.forEach((i) => {
                      i.constructor === Ra
                        ? (n = i)
                        : (function eP(e) {
                            return Object.getPrototypeOf(e.constructor) === dr;
                          })(i)
                        ? (r = i)
                        : (o = i);
                    }),
                    o || r || n || null
                  );
                })(0, i));
            }
            ngOnChanges(n) {
              if ((this._checkForErrors(), !this._registered || "name" in n)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = n.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in n && this._updateDisabled(n),
                (function Xd(e, t) {
                  if (!e.hasOwnProperty("model")) return !1;
                  const n = e.model;
                  return !!n.isFirstChange() || !Object.is(t, n.currentValue);
                })(n, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              xi(this.control, this),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(n) {
              xC.then(() => {
                this.control.setValue(n, { emitViewToModelChange: !1 }),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _updateDisabled(n) {
              const r = n.isDisabled.currentValue,
                o = 0 !== r && _n(r);
              xC.then(() => {
                o && !this.control.disabled
                  ? this.control.disable()
                  : !o && this.control.disabled && this.control.enable(),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _getPath(n) {
              return this._parent
                ? (function Va(e, t) {
                    return [...t.path, e];
                  })(n, this._parent)
                : [n];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(
                _(Xe, 9),
                _(ze, 10),
                _(Bn, 10),
                _(tn, 10),
                _(Us, 8)
              );
            }),
            (e.ɵdir = F({
              type: e,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [ue([iP]), X, _t],
            })),
            e
          );
        })(),
        NC = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = F({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            e
          );
        })(),
        FC = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = zt({ type: e })),
            (e.ɵinj = It({})),
            e
          );
        })(),
        TP = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = zt({ type: e })),
            (e.ɵinj = It({ imports: [FC] })),
            e
          );
        })(),
        xP = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = zt({ type: e })),
            (e.ɵinj = It({ imports: [TP] })),
            e
          );
        })(),
        RP = (() => {
          class e {
            constructor() {
              (this.userName = ""),
                (this.userEmail = ""),
                (this.userAge = ""),
                (this.userPassword = "");
            }
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [["app-contact"]],
              decls: 18,
              vars: 12,
              consts: [
                [1, "mb-4"],
                [1, "pt-3", "conatiner"],
                ["title", "conatct section", "customColor", "#2c3e50"],
                ["action", "", 1, "w-50", "p-3", "mx-auto", "mt-5"],
                ["for", "userName", 1, "position-relative", "top-0"],
                [
                  "id",
                  "userName",
                  "type",
                  "text",
                  "placeholder",
                  "Name",
                  "name",
                  "userName",
                  1,
                  "form-control",
                  "border-0",
                  "border-bottom",
                  "py-3",
                  "position-relative",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["for", "userAge", 1, "position-relative", "top-0"],
                [
                  "id",
                  "userAge",
                  "type",
                  "text",
                  "placeholder",
                  "Age",
                  "name",
                  "userName",
                  1,
                  "form-control",
                  "border-0",
                  "border-bottom",
                  "py-3",
                  "position-relative",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["for", "userEmail", 1, "position-relative", "top-0"],
                [
                  "id",
                  "userEmail",
                  "type",
                  "text",
                  "placeholder",
                  "Email",
                  "name",
                  "userName",
                  1,
                  "form-control",
                  "border-0",
                  "border-bottom",
                  "py-3",
                  "position-relative",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                ["for", "userPassword", 1, "position-relative", "top-0"],
                [
                  "id",
                  "userPassword",
                  "type",
                  "text",
                  "placeholder",
                  "Password",
                  "name",
                  "userName",
                  1,
                  "form-control",
                  "border-0",
                  "border-bottom",
                  "py-3",
                  "position-relative",
                  3,
                  "ngModel",
                  "ngModelChange",
                ],
                [
                  1,
                  "btn",
                  "mt-4",
                  "text-white",
                  2,
                  "background-color",
                  "#1abc9c",
                ],
              ],
              template: function (n, r) {
                1 & n &&
                  ($(0, "div", 0)(1, "div", 1),
                  He(2, "app-star", 2),
                  $(3, "form", 3)(4, "label", 4),
                  he(5, "Name : "),
                  z(),
                  $(6, "input", 5),
                  Ee("ngModelChange", function (i) {
                    return (r.userName = i);
                  }),
                  z(),
                  $(7, "label", 6),
                  he(8, "Age : "),
                  z(),
                  $(9, "input", 7),
                  Ee("ngModelChange", function (i) {
                    return (r.userAge = i);
                  }),
                  z(),
                  $(10, "label", 8),
                  he(11, "Email : "),
                  z(),
                  $(12, "input", 9),
                  Ee("ngModelChange", function (i) {
                    return (r.userEmail = i);
                  }),
                  z(),
                  $(13, "label", 10),
                  he(14, "Password : "),
                  z(),
                  $(15, "input", 11),
                  Ee("ngModelChange", function (i) {
                    return (r.userPassword = i);
                  }),
                  z(),
                  $(16, "button", 12),
                  he(17, " Send Message "),
                  z()()()()),
                  2 & n &&
                    (Te(4),
                    gn("__top", !r.userName.length),
                    Te(2),
                    Ot("ngModel", r.userName),
                    Te(1),
                    gn("__top", !r.userAge.length),
                    Te(2),
                    Ot("ngModel", r.userAge),
                    Te(1),
                    gn("__top", !r.userEmail.length),
                    Te(2),
                    Ot("ngModel", r.userEmail),
                    Te(1),
                    gn("__top", !r.userPassword.length),
                    Te(2),
                    Ot("ngModel", r.userPassword));
              },
              dependencies: [NC, Ra, hC, pC, tf, Ua, Na],
              styles: [
                "input.form-control[_ngcontent-%COMP%]:focus{box-shadow:none}label[_ngcontent-%COMP%]{color:var(--main-color);margin-bottom:7px;transition:.6s top}.__top[_ngcontent-%COMP%]{top:40px!important}@media screen and (max-width: 768px){form[_ngcontent-%COMP%]{width:100%!important}}",
              ],
            })),
            e
          );
        })(),
        FP = (() => {
          class e {
            constructor() {
              (this.title = "start Framework"),
                (this.customColorFromHome = "white");
            }
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [["app-home"]],
              decls: 6,
              vars: 2,
              consts: [
                [
                  1,
                  "home",
                  "d-flex",
                  "justify-content-center",
                  "align-items-center",
                  "text-white",
                ],
                [1, "text-center"],
                ["src", "./images/avataaars.svg", "alt", "", 1, "mb-3"],
                [3, "title", "customColor"],
                [1, ""],
              ],
              template: function (n, r) {
                1 & n &&
                  ($(0, "div", 0)(1, "div", 1),
                  He(2, "img", 2)(3, "app-star", 3),
                  $(4, "div", 4),
                  he(
                    5,
                    "Frontend Developer - Backend Developer - Graphic Designer"
                  ),
                  z()()()),
                  2 & n &&
                    (Te(3),
                    Ot("title", r.title)("customColor", r.customColorFromHome));
              },
              dependencies: [Na],
              styles: [
                ".home[_ngcontent-%COMP%]{background-color:var(--main-color)}img[_ngcontent-%COMP%]{width:250px}",
              ],
            })),
            e
          );
        })(),
        OP = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [["app-not-found"]],
              decls: 2,
              vars: 0,
              template: function (n, r) {
                1 & n && ($(0, "p"), he(1, "not-found works!"), z());
              },
            })),
            e
          );
        })();
      function PP(e, t) {
        if (1 & e) {
          const n = Jl();
          $(0, "div", 9)(1, "div", 10),
            He(2, "img", 11),
            $(3, "div", 12),
            Ee("click", function () {
              const i = mu(n).$implicit,
                s = tm();
              return (s.flag = !1), yu((s.modelImg = i));
            }),
            He(4, "i", 13),
            z()()();
        }
        if (2 & e) {
          const n = t.$implicit;
          Te(2), Ot("src", n, jo);
        }
      }
      const kP = [
        { path: "", component: FP, title: "home" },
        { path: "about", component: RO, title: "about" },
        { path: "contact", component: RP, title: "contact" },
        {
          path: "portfolio",
          component: (() => {
            class e {
              constructor() {
                (this.flag = !0),
                  (this.modelImg = ""),
                  (this.srcs = [
                    "./images/port2.png",
                    "./images/port1.png",
                    "./images/port3.png",
                    "./images/port2.png",
                    "./images/port1.png",
                    "./images/port3.png",
                  ]);
              }
              hideModel(n, r) {
                n != r && (this.flag = !0);
              }
              ngOnInit() {}
            }
            return (
              (e.ɵfac = function (n) {
                return new (n || e)();
              }),
              (e.ɵcmp = yt({
                type: e,
                selectors: [["app-portfolio"]],
                decls: 9,
                vars: 4,
                consts: [
                  [1, "mb-4"],
                  [1, "pt-4"],
                  ["title", "portfolio component", "customColor", "#2c3e50"],
                  [1, "container"],
                  [1, "row", "g-5"],
                  ["class", "col-lg-4 col-md-6", 4, "ngFor", "ngForOf"],
                  [
                    1,
                    "model__",
                    "position-fixed",
                    "start-0",
                    "w-100",
                    "top-0",
                    "h-100",
                    "bg-primary",
                    "bg-opacity-25",
                    "d-flex",
                    "justify-content-center",
                    "align-items-center",
                    3,
                    "click",
                  ],
                  ["alt", "", 3, "src"],
                  ["img", ""],
                  [1, "col-lg-4", "col-md-6"],
                  [1, "rounded-3", "overflow-hidden", "position-relative"],
                  ["alt", "", 1, "w-100", "rounded-3", 3, "src"],
                  [
                    1,
                    "layer__",
                    "position-absolute",
                    "start-0",
                    "w-100",
                    "top-0",
                    "h-100",
                    "d-flex",
                    "justify-content-center",
                    "align-items-center",
                    3,
                    "click",
                  ],
                  [1, "text-white", "fa-solid", "fa-plus", "fa-6x"],
                ],
                template: function (n, r) {
                  if (1 & n) {
                    const o = Jl();
                    $(0, "div", 0)(1, "div", 1),
                      He(2, "app-star", 2),
                      $(3, "div", 3)(4, "div", 4),
                      (function qg(e, t, n, r, o, i, s, a) {
                        const u = v(),
                          l = q(),
                          c = e + 22,
                          d = l.firstCreatePass
                            ? (function BS(e, t, n, r, o, i, s, a, u) {
                                const l = t.consts,
                                  c = Vr(t, e, 4, s || null, Sn(l, a));
                                Bl(t, n, c, Sn(l, u)), Zi(t, c);
                                const d = (c.tViews = jl(
                                  2,
                                  c,
                                  r,
                                  o,
                                  i,
                                  t.directiveRegistry,
                                  t.pipeRegistry,
                                  null,
                                  t.schemas,
                                  l
                                ));
                                return (
                                  null !== t.queries &&
                                    (t.queries.template(t, c),
                                    (d.queries = t.queries.embeddedTView(c))),
                                  c
                                );
                              })(c, l, u, t, n, r, o, i, s)
                            : l.data[c];
                        Wt(d, !1);
                        const f = u[j].createComment("");
                        ls(l, u, f, d),
                          $e(f, u),
                          ws(u, (u[c] = Ng(f, u, f, d))),
                          zi(d) && Ll(l, u, d),
                          null != s && Vl(u, d, a);
                      })(5, PP, 5, 1, "div", 5),
                      z()()(),
                      $(6, "div", 6),
                      Ee("click", function (s) {
                        mu(o);
                        const a = (function Zg(e) {
                          return (function Dr(e, t) {
                            return e[t];
                          })(
                            (function FE() {
                              return O.lFrame.contextLView;
                            })(),
                            22 + e
                          );
                        })(8);
                        return yu(r.hideModel(s.target, a));
                      }),
                      He(7, "img", 7, 8),
                      z()();
                  }
                  2 & n &&
                    (Te(5),
                    Ot("ngForOf", r.srcs),
                    Te(1),
                    gn("d-none", r.flag),
                    Te(1),
                    Ot("src", r.modelImg, jo));
                },
                dependencies: [Kv, Na],
                styles: [
                  ".layer__[_ngcontent-%COMP%]{background-color:#1abc9ce6;opacity:0;cursor:pointer;transition:.6s opacity}.layer__[_ngcontent-%COMP%]:hover{opacity:1}.model__[_ngcontent-%COMP%]{z-index:9999}img[_ngcontent-%COMP%]{width:600px}",
                ],
              })),
              e
            );
          })(),
          title: "portfolio",
        },
        { path: "**", component: OP, title: "404" },
      ];
      let LP = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = zt({ type: e })),
          (e.ɵinj = It({ imports: [BD.forRoot(kP, { useHash: !0 }), BD] })),
          e
        );
      })();
      const VP = ["navRef"];
      let YC = (() => {
          class e {
            animation() {
              window.scrollY > 30
                ? this.nav.nativeElement.classList.remove("py-4")
                : this.nav.nativeElement.classList.add("py-4");
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [["app-navbar"]],
              viewQuery: function (n, r) {
                if ((1 & n && Dc(VP, 5), 2 & n)) {
                  let o;
                  ri((o = oi())) && (r.nav = o.first);
                }
              },
              hostBindings: function (n, r) {
                1 & n &&
                  Ee(
                    "scroll",
                    function () {
                      return r.animation();
                    },
                    0,
                    Hp
                  );
              },
              decls: 18,
              vars: 0,
              consts: [
                [1, "navbar", "navbar-expand-lg", "fixed-top", "py-4"],
                ["navRef", ""],
                [1, "container"],
                [
                  "routerLink",
                  "/",
                  1,
                  "navbar-brand",
                  "text-white",
                  "text-uppercase",
                  "fw-bolder",
                  "fs-2",
                ],
                [
                  "type",
                  "button",
                  "data-bs-toggle",
                  "collapse",
                  "data-bs-target",
                  "#navbarSupportedContent",
                  "aria-controls",
                  "navbarSupportedContent",
                  "aria-expanded",
                  "false",
                  "aria-label",
                  "Toggle navigation",
                  1,
                  "navbar-toggler",
                ],
                [1, "navbar-toggler-icon"],
                [
                  "id",
                  "navbarSupportedContent",
                  1,
                  "collapse",
                  "navbar-collapse",
                ],
                [1, "navbar-nav", "ms-auto", "mb-2", "mb-lg-0"],
                [1, "nav-item", "me-3"],
                [
                  "routerLinkActive",
                  "active rounded-3",
                  "routerLink",
                  "about",
                  1,
                  "nav-link",
                  "text-white",
                  "text-uppercase",
                  "fw-bold",
                  "mt-3",
                  "mt-md-0",
                  "px-2",
                  2,
                  "width",
                  "fit-content",
                ],
                [
                  "routerLinkActive",
                  "active rounded-3",
                  "routerLink",
                  "portfolio",
                  1,
                  "nav-link",
                  "text-white",
                  "text-uppercase",
                  "fw-bold",
                  "mt-3",
                  "mt-md-0",
                  "px-2",
                  2,
                  "width",
                  "fit-content",
                ],
                [
                  "routerLinkActive",
                  "active rounded-3",
                  "routerLink",
                  "contact",
                  1,
                  "nav-link",
                  "text-white",
                  "text-uppercase",
                  "fw-bold",
                  "mt-3",
                  "mt-md-0",
                  "px-2",
                  2,
                  "width",
                  "fit-content",
                ],
              ],
              template: function (n, r) {
                1 & n &&
                  ($(0, "nav", 0, 1)(2, "div", 2)(3, "a", 3),
                  he(4, "Start Framework "),
                  z(),
                  $(5, "button", 4),
                  He(6, "span", 5),
                  z(),
                  $(7, "div", 6)(8, "ul", 7)(9, "li", 8)(10, "a", 9),
                  he(11, "about"),
                  z()(),
                  $(12, "li", 8)(13, "a", 10),
                  he(14, "portfolio"),
                  z()(),
                  $(15, "li", 8)(16, "a", 11),
                  he(17, "contact"),
                  z()()()()()());
              },
              dependencies: [Aa, RD],
              styles: [
                "nav[_ngcontent-%COMP%]{background-color:var(--second-color);transition:.6s padding}.active[_ngcontent-%COMP%]{background-color:var(--main-color)}",
              ],
            })),
            e
          );
        })(),
        jP = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [["app-footer"]],
              decls: 28,
              vars: 0,
              consts: [
                [1, "footer"],
                [1, "card-group", "m-4"],
                [1, "card"],
                [1, "card-body", "text-center"],
                [1, "card", "text-white"],
                [1, "icons"],
                [1, "fa-brands", "fa-facebook", "mx-1", "icon"],
                [1, "fa-brands", "fa-twitter", "mx-1", "icon"],
                [1, "fa-brands", "fa-linkedin-in", "mx-1", "icon"],
                [1, "fa-solid", "fa-globe", "mx-1", "icon"],
                [1, "p"],
              ],
              template: function (n, r) {
                1 & n &&
                  ($(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                    4,
                    "h3"
                  ),
                  he(5, "LOCATION"),
                  z(),
                  $(6, "p"),
                  he(7, "Tyaran Street"),
                  z(),
                  $(8, "p"),
                  he(9, "Nasr City, Cairo"),
                  z()()(),
                  $(10, "div", 4)(11, "div", 3)(12, "h3"),
                  he(13, "AROUND THE WEB"),
                  z(),
                  $(14, "div", 5),
                  He(15, "i", 6)(16, "i", 7)(17, "i", 8)(18, "i", 9),
                  z()()(),
                  $(19, "div", 2)(20, "div", 3)(21, "h3"),
                  he(22, "ABOUT FREELANCER"),
                  z(),
                  $(23, "p"),
                  he(
                    24,
                    " Freelance is a free to use, licensed Bootstrap theme created by Route "
                  ),
                  z()()()()(),
                  $(25, "div", 10)(26, "p"),
                  he(27, "Copyright \xa9 Your Website 2024"),
                  z()());
              },
              styles: [
                ".footer[_ngcontent-%COMP%]{background-color:#2c3e50;color:#fff;justify-content:center;text-align:center;padding:40px;margin:0}.card-group[_ngcontent-%COMP%]{background-color:transparent!important}.card[_ngcontent-%COMP%]{--bs-card-border-color: none;--bs-card-bg: transparent;color:#fff}.clr[_ngcontent-%COMP%]{clear:both}.n[_ngcontent-%COMP%]{width:33%}h3[_ngcontent-%COMP%]{padding-top:20px}.icon[_ngcontent-%COMP%]{border:1px white solid;border-radius:50%;-webkit-border-radius:50%;-moz-border-radius:50%;-ms-border-radius:50%;-o-border-radius:50%;padding:10px}.p[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{text-align:center;color:#f0f8ff;padding-top:10px}.p[_ngcontent-%COMP%]{background-color:#1a252f;padding:10px}",
              ],
            })),
            e
          );
        })(),
        BP = (() => {
          class e {
            constructor() {
              (this.vh100 = {}), (this.title = "app-1");
            }
            ngAfterViewInit() {
              (this.vh100 = {
                marginTop:
                  this.childNav.nav.nativeElement.clientHeight - 20 + "px",
                minHeight: `calc(100vh - ${this.childNav.nav.nativeElement.clientHeight}px)`,
              }),
                console.log();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = yt({
              type: e,
              selectors: [["app-root"]],
              viewQuery: function (n, r) {
                if ((1 & n && Dc(YC, 5), 2 & n)) {
                  let o;
                  ri((o = oi())) && (r.childNav = o.first);
                }
              },
              decls: 4,
              vars: 2,
              template: function (n, r) {
                1 & n &&
                  (He(0, "app-navbar"),
                  $(1, "div"),
                  He(2, "router-outlet"),
                  z(),
                  He(3, "app-footer")),
                  2 & n && (Te(1), Pt(r.vh100));
              },
              dependencies: [Td, YC, jP],
            })),
            e
          );
        })(),
        $P = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = zt({ type: e, bootstrap: [BP] })),
            (e.ɵinj = It({ imports: [qR, LP, xP] })),
            e
          );
        })();
      (function ox() {
        Ev = !1;
      })(),
        WR()
          .bootstrapModule($P)
          .catch((e) => console.error(e));
    },
  },
  (ne) => {
    ne((ne.s = 353));
  },
]);
