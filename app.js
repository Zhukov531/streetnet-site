/* StreetNet — landing interactions
   nav, scroll-reveal, live timer, count-up, parallax, G-meter, switcher */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky nav + scan driver ---------- */
  var nav = document.getElementById('nav');
  var scanScheduled = false;
  function scheduleScan(){
    if(scanScheduled) return; scanScheduled = true;
    requestAnimationFrame(function(){ scanScheduled = false; scan(); });
  }
  function onScroll(){ if(nav) nav.classList.toggle('is-stuck', window.scrollY > 12); scheduleScan(); }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', scheduleScan, {passive:true});
  window.addEventListener('load', scheduleScan);

  /* ---------- universal in-view scanner ----------
     (scroll + getBoundingClientRect — robust across browsers AND preview
     environments where IntersectionObserver callbacks may not fire) */
  function inView(el, frac){
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if(r.height === 0 && r.width === 0) return false;
    return r.top < vh*(frac||0.88) && r.bottom > 0;
  }
  var watchers = [];   // {el, cb, frac, done}
  function watch(el, cb, frac){ watchers.push({el:el, cb:cb, frac:frac||0.88, done:false}); }
  function scan(){
    for(var i=0;i<watchers.length;i++){
      var w = watchers[i];
      if(!w.done && inView(w.el, w.frac)){ w.done = true; w.cb(w.el); }
    }
  }

  /* ---------- scroll reveal ----------
     Visibility is NOT gated on animation. We only switch on entrance
     animations (body.anim-on) once we confirm rAF actually advances. */
  var reveal = [].slice.call(document.querySelectorAll('[data-reveal]'));
  reveal.forEach(function(el){ watch(el, function(e){ e.classList.add('in'); }); });

  var animProbed = false;
  function enableAnims(){
    if(animProbed) return; animProbed = true;
    if(reduce) return;                 // reduced-motion: leave content static & visible
    document.body.classList.add('anim-on');
    scan();                            // reveal whatever is already in view
  }
  // Probe: only enable entrance anims if two consecutive frames fire.
  var probeFrames = 0;
  (function probe(){
    requestAnimationFrame(function(){
      probeFrames++;
      if(probeFrames >= 2) enableAnims();
      else requestAnimationFrame(probe);
    });
  })();

  /* ---------- bento hover glow tracking ---------- */
  document.querySelectorAll('.tile').forEach(function(t){
    t.addEventListener('pointermove', function(e){
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    });
  });

  /* ---------- live lap timer (hero) ---------- */
  var timerEl = document.getElementById('liveTimer');
  if(timerEl && !reduce){
    var base = 102.86;            // 01:42.86 seconds
    var t0 = performance.now();
    function fmt(s){
      var m = Math.floor(s/60);
      var rem = s - m*60;
      var whole = Math.floor(rem);
      var cs = Math.floor((rem - whole)*100);
      function p(n){ return (n<10?'0':'')+n; }
      return p(m)+':'+p(whole)+'.<span class="ms">'+p(cs)+'</span>';
    }
    function tick(now){
      var s = base + ((now - t0)/1000);
      if(s > 109.5) { t0 = now; s = base; }     // loop a short window
      timerEl.innerHTML = fmt(s);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- car dot along track (hero) ---------- */
  var path = document.getElementById('trackPath');
  var car = document.getElementById('carDot');
  if(path && car && !reduce && path.getTotalLength){
    var len = path.getTotalLength();
    var s0 = performance.now();
    (function move(now){
      var p = ((now - s0)/6500) % 1;
      var pt = path.getPointAtLength(p*len);
      car.setAttribute('cx', pt.x); car.setAttribute('cy', pt.y);
      requestAnimationFrame(move);
    })(s0);
  } else if(car && path && path.getTotalLength){
    var pt0 = path.getPointAtLength(0); car.setAttribute('cx', pt0.x); car.setAttribute('cy', pt0.y);
  }

  /* ---------- mini replay progress (feature tile) ---------- */
  var mini = document.getElementById('miniProg');
  if(mini){
    watch(mini, function(){
      if(reduce){ mini.style.strokeDashoffset = '0'; }
      else { mini.style.transition='stroke-dashoffset 2.6s cubic-bezier(.4,0,.1,1)'; mini.style.strokeDashoffset='0'; }
    }, 0.7);
  }

  /* ---------- count-up stats ---------- */
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var deci = (target % 1 !== 0) ? 2 : 0;
    var uSpan = el.querySelector('.u'); var uHtml = uSpan ? uSpan.outerHTML : '';
    if(reduce){ el.innerHTML = target.toFixed(deci) + (suffix||'') ; if(uSpan) el.innerHTML = target.toFixed(deci)+uHtml; return; }
    var d=1100, st=performance.now();
    (function step(now){
      var p = Math.min((now-st)/d,1);
      var e = 1-Math.pow(1-p,3);
      var val = (target*e).toFixed(deci);
      el.innerHTML = val + (uSpan ? uHtml : suffix);
      if(p<1) requestAnimationFrame(step);
    })(st);
  }
  document.querySelectorAll('[data-count]').forEach(function(el){
    watch(el, function(){ countUp(el); }, 0.85);
  });

  /* ---------- parallax (hero) ---------- */
  var parEls = [].slice.call(document.querySelectorAll('[data-par]'));
  if(!reduce && parEls.length){
    var ticking=false, my=0;
    function applyScroll(){
      parEls.forEach(function(el){
        var f = parseFloat(el.getAttribute('data-par'));
        el.style.transform = 'translate3d(0,'+(window.scrollY*f*-1)+'px,0)';
      });
      ticking=false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ requestAnimationFrame(applyScroll); ticking=true; }
    }, {passive:true});
    // pointer parallax on the stage cards
    var stage = document.querySelector('.hero-stage');
    if(stage){
      stage.addEventListener('pointermove', function(e){
        var r = stage.getBoundingClientRect();
        var dx = (e.clientX-r.left)/r.width-0.5, dy=(e.clientY-r.top)/r.height-0.5;
        stage.querySelectorAll('.fcard').forEach(function(c){
          var f = parseFloat(c.getAttribute('data-par')||'0.05')*120;
          c.style.transform = 'translate3d('+(dx*f)+'px,'+(dy*f)+'px,0)';
        });
      });
      stage.addEventListener('pointerleave', function(){
        stage.querySelectorAll('.fcard').forEach(function(c){ c.style.transform=''; });
      });
    }
  }

  /* ---------- G-meter animated dot + trail ---------- */
  var gDot = document.getElementById('gDot');
  var gNum = document.getElementById('gNum');
  var gTrail = document.getElementById('gTrail');
  var gMini = document.getElementById('gminiDot');
  if(gDot && !reduce){
    // a looping "lap" of g-forces (lateral x, longitudinal y) normalized -1..1
    var pts = [
      [0,0.9],[0.2,0.6],[0.55,0.1],[0.85,-0.3],[0.7,-0.7],[0.3,-0.85],
      [-0.1,-0.6],[-0.5,-0.1],[-0.8,0.35],[-0.65,0.7],[-0.25,0.85],[0,0.9]
    ];
    var trail = [];
    var g0 = performance.now(), seg = 900;
    function lerp(a,b,t){ return a+(b-a)*t; }
    (function gloop(now){
      var prog = ((now-g0)/seg);
      var i = Math.floor(prog) % (pts.length-1);
      var f = prog % 1;
      var x = lerp(pts[i][0], pts[i+1][0], f);
      var y = lerp(pts[i][1], pts[i+1][1], f);
      // place dot (radius ~ 130px from center 150)
      var R = 120;
      gDot.style.left = (50 + x*40) + '%';
      gDot.style.top  = (50 - y*40) + '%';
      var mag = Math.min(1.3, Math.sqrt(x*x+y*y)*1.18);
      if(gNum) gNum.textContent = mag.toFixed(2);
      // trail
      trail.push([150 + x*R, 150 - y*R]);
      if(trail.length>26) trail.shift();
      if(gTrail){
        var d = trail.map(function(p,idx){ return (idx?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1); }).join(' ');
        gTrail.setAttribute('d', d);
      }
      if(gMini){ gMini.setAttribute('cx', 50 + x*36); gMini.setAttribute('cy', 50 - y*36); }
      requestAnimationFrame(gloop);
    })(g0);
  }

  /* ---------- hero variant switcher ---------- */
  var sw = document.getElementById('variantSwitch');
  if(sw){
    var saved = localStorage.getItem('sn-hero') || 'a';
    setHero(saved);
    sw.querySelectorAll('button').forEach(function(b){
      b.addEventListener('click', function(){ setHero(b.getAttribute('data-v')); });
    });
    function setHero(v){
      document.body.classList.remove('hero-a','hero-b','hero-c');
      document.body.classList.add('hero-'+v);
      sw.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-v')===v); });
      localStorage.setItem('sn-hero', v);
      scheduleScan();
    }
  }

  /* ---------- kick off reveal scan ---------- */
  scan();
  setTimeout(scan, 80);
  setTimeout(scan, 400);
})();
