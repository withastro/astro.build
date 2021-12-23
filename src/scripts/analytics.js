// Parts of the below code have been adapted for the web
// from https://github.com/jeffchannell/jiggle, GNU General Public License v2.0
const INTERVAL_MS = 10;
let intervals = [];
let jiggling = false;

class MouseMath {
  distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }
  gamma(st, nd, rd) {
    // pythagoras
    var a = Math.sqrt(Math.pow(st.x - nd.x, 2) + Math.pow(st.y - nd.y, 2));
    var b = Math.sqrt(Math.pow(nd.x - rd.x, 2) + Math.pow(nd.y - rd.y, 2));
    var c = Math.sqrt(Math.pow(rd.x - st.x, 2) + Math.pow(rd.y - st.y, 2));

    if (0 === a * b) {
      return 0;
    }
    // law of cosines
    return (
      180 -
      (Math.acos(
        (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b)
      ) *
        180) /
        Math.PI
    );
  }
}

class MouseHistory {
  HISTORY_MAX = 500;
  SHAKE_DEGREES = 400;

  math = new MouseMath();
  history = [];
  lastX = 0;
  lastY = 0;
  threshold = 100;

  check() {
    let now = performance.now();

    for (let i = 0; i < this.history.length; ++i) {
      if (now - this.history[i].t > this.HISTORY_MAX) {
        this.history.splice(i, 1);
      }
    }

    // reset degrees so we can add them again
    let degrees = 0;
    let max = 0;

    // add up gammas (deg=sum(gamma))
    if (this.history.length > 2) {
      for (let i = 2; i < this.history.length; ++i) {
        degrees += this.math.gamma(
          this.history[i],
          this.history[i - 1],
          this.history[i - 2]
        );
        max = Math.max(
          max,
          this.math.distance(this.history[i - 2], this.history[i - 1]),
          this.math.distance(this.history[i - 1], this.history[i])
        );
      }
    }

    return degrees > this.SHAKE_DEGREES && max > this.threshold;
  }

  clear() {
    this.lastX = 0;
    this.lastY = 0;
    this.history = [];
  }

  push(x, y) {
    this.lastX = x;
    this.lastY = y;
    this.history.push({ x, y, t: performance.now() });
  }
}

export class MouseEffect {
  timeouts = [];
  stopped = false;
  count = 0;

  constructor() {
    const old = document.querySelector('#mouse-effect');
    if (old) {
      this.canvas = old;
    } else {
      this.canvas = document.createElement("canvas");
      this.canvas.setAttribute("id", 'mouse-effect');
      this.canvas.classList.add('egg');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      document.body.appendChild(this.canvas);
    }
    this.context = this.canvas.getContext("2d");
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  render(x, y) {
    if (this.stopped) return;

    requestAnimationFrame(() => {
        this.count++;
        const { context: ctx } = this;
        const translate = (x, y) => ({ a: 1, b: 0, c: 0, d: 1, e: x, f: y });
        const base = new Path2D();
        base.addPath(new Path2D(`M1 0H0v29h3v-2h2v-2h2v-1h1v3h2v3h2v2h3v-2h2v-3h-2v-3h-2v-1l1-1h6v-3h-1v-2h-2v-2h-2v-2h-2v-1h-1v-2h-2V8H8V7H7V5H5V3H3V2H2V0H1Z`), translate(x, y));
        ctx.fillStyle = 'white';
        ctx.fill(base, 'nonzero');

        const cursor = new Path2D()
        cursor.addPath(new Path2D(`M0 0h2v2h1v1H2v24h1v-2h2v2H3v2H0V0Z`), translate(x, y));
        cursor.addPath(new Path2D(`M3 3h2v2h2v2h1v1h2v2h2v2h1v1h2v2h-2v-2h-1v-1h-2v-2H8V8H7V7H5V5H3V3ZM15 15h2v2h2v2h1v3h-6l-1 2h-1v-4h7v-1h-2v-2h-2v-2ZM7 22h1v2H7v1H5v-1h2v-2ZM8 24h2v3h2v3h3v2h-3v-2h-2v-3H8v-3ZM13 24h2v3h2v3h-2v-3h-2v-3Z`), translate(x, y))
        ctx.fillStyle = 'black';
        ctx.fill(cursor, 'nonzero');

        this.timeouts.push(setTimeout(() => {
            ctx.clearRect(x, y, 32, 32);
            this.count--;
            if (this.stopped && this.count <= 0) {
                this.canvas.remove();
            }
        }, 500));
    })
  }

  handleMouseMove({ x, y }) {
     this.render(x, y)
  }

  start() {
    window.addEventListener(
        "mousemove",
        this.handleMouseMove,
        { passive: true }
    );
  }

  stop() {
    this.stopped = true;
    window.removeEventListener(
        "mousemove",
        this.handleMouseMove
    );
  }
}

export function init() {
  const effect = new MouseEffect();
  effect.start();
}

export function lazy() {
  const mouseHistory = new MouseHistory();
  let effect;
  let timeout;

  window.addEventListener(
    "mousemove",
    ({ screenX: x, screenY: y }) => {
      if (jiggling) return;
      mouseHistory.push(x, y);
    },
    { passive: true }
  );
 
  setInterval(() => {
    if (mouseHistory.check()) {
      if (!jiggling) {
        jiggling = true;
        effect = new MouseEffect();
        setTimeout(() => {
          effect.start();
        }, 1000);
      }
    } else if (jiggling) {
      if (effect && !timeout) {
        timeout = setTimeout(() => {
            effect.stop();
            effect = null;
            jiggling = false;
            timeout = null;
        }, 6000);
      }
    }
  }, INTERVAL_MS);
}
