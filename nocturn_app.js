/* ═══════════════════════════════════════════
   NocTurn — v4 (Competition Build)
   ═══════════════════════════════════════════ */

// ─── CANDLE CURSOR + WARM GLOW ───
(function(){
  var sp=document.getElementById('cursorSpotlight');if(!sp)return;
  var mx=-100,my=-100,sx=-100,sy=-100;
  document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;});
  (function loop(){sx+=(mx-sx)*0.1;sy+=(my-sy)*0.1;sp.style.left=sx+'px';sp.style.top=sy+'px';requestAnimationFrame(loop);})();
})();

// ─── AMBIENT DIAMONDS & SHOOTING STARS ───
(function(){
  var el=document.getElementById('ambientParticles');if(!el)return;
  function spawnDiamond(){
    var d=document.createElement('div');d.className='amb-diamond';
    var sz=2+Math.random()*4;
    d.style.cssText='left:'+Math.random()*100+'%;bottom:-10px;width:'+sz+'px;height:'+sz+'px;'+
      'animation-duration:'+(12+Math.random()*18)+'s,'+(2+Math.random()*3)+'s;'+
      'animation-delay:0s,'+Math.random()*2+'s;'+
      'opacity:'+(0.15+Math.random()*0.3);
    el.appendChild(d);
    setTimeout(function(){d.remove();},30000);
  }
  function spawnStar(){
    var s=document.createElement('div');s.className='amb-star';
    s.style.cssText='left:'+(20+Math.random()*60)+'%;top:'+(5+Math.random()*40)+'%;'+
      'animation-duration:'+(1.5+Math.random()*1.5)+'s';
    el.appendChild(s);
    setTimeout(function(){s.remove();},4000);
  }
  // Initial burst
  for(var i=0;i<8;i++)setTimeout(spawnDiamond,i*400);
  // Continuous spawning
  setInterval(spawnDiamond,2500+Math.random()*2000);
  setInterval(spawnStar,6000+Math.random()*4000);
  // First star after a delay
  setTimeout(spawnStar,3000);
})();

// ─── FLOATING STAR PARTICLES ───
(function(){
  var c=document.querySelector('.museum-decor');if(!c)return;
  for(var i=0;i<60;i++){var d=document.createElement('div');d.className='dust';
  var sz=0.8+Math.random()*2.5;
  d.style.cssText='left:'+Math.random()*100+'%;top:'+Math.random()*100+'%;width:'+sz+'px;height:'+sz+'px;animation-delay:'+Math.random()*8+'s;animation-duration:'+(5+Math.random()*8)+'s;opacity:'+(0.1+Math.random()*0.35);c.appendChild(d);}
})();

// ─── ARTIFACT IMAGES ───
var ARTIFACT_IMAGES=[
  'artifacts/bangle-removebg-preview.png',
  'artifacts/blue-vase-removebg-preview.png',
  'artifacts/gold-bird-removebg-preview.png',
  'artifacts/gold-bust-removebg-preview.png',
  'artifacts/gold-coin-removebg-preview.png',
  'artifacts/gold-statue-removebg-preview.png',
  'artifacts/helmet-removebg-preview.png',
  'artifacts/jewelry-removebg-preview.png',
  'artifacts/jewelry-plush-removebg-preview.png',
  'artifacts/staff-removebg-preview.png'
];
var artifactImgs=[];
(function(){
  ARTIFACT_IMAGES.forEach(function(src){
    var img=new Image();img.src=src;artifactImgs.push(img);
  });
})();

// ─── AUDIO ENGINE ───
var AC=null;
function getAC(){if(!AC)try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return AC;}
function tone(f,dur,t,v){var a=getAC();if(!a)return;try{var o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.type=t||'sine';o.frequency.value=f;g.gain.setValueAtTime(v||0.03,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+dur);o.start();o.stop(a.currentTime+dur);}catch(e){}}
function sfxPick(){
  // Stone click — short low thud + high tap
  var a=getAC();if(!a)return;
  var o=a.createOscillator(),g=a.createGain(),flt=a.createBiquadFilter();
  flt.type='lowpass';flt.frequency.value=800;o.type='triangle';o.frequency.value=120;
  g.gain.setValueAtTime(0.12,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.06);
  o.connect(flt);flt.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+0.08);
  // high marble tap
  setTimeout(function(){var o2=a.createOscillator(),g2=a.createGain();o2.type='sine';o2.frequency.value=1800;g2.gain.setValueAtTime(0.04,a.currentTime);g2.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.03);o2.connect(g2);g2.connect(a.destination);o2.start();o2.stop(a.currentTime+0.04);},10);
}
function sfxAdv(){
  // Heavier stone press — double thud with resonance
  var a=getAC();if(!a)return;
  var o=a.createOscillator(),g=a.createGain(),flt=a.createBiquadFilter();
  flt.type='lowpass';flt.frequency.value=600;o.type='triangle';o.frequency.value=90;
  g.gain.setValueAtTime(0.15,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.1);
  o.connect(flt);flt.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+0.12);
  setTimeout(function(){
    var o2=a.createOscillator(),g2=a.createGain();o2.type='sine';o2.frequency.value=2200;g2.gain.setValueAtTime(0.05,a.currentTime);g2.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.04);o2.connect(g2);g2.connect(a.destination);o2.start();o2.stop(a.currentTime+0.05);
  },20);
  // Resonant echo
  setTimeout(function(){tone(160,0.08,'sine',0.03);},60);
}
function sfxBad(){tone(200,0.2,'sawtooth',0.04);setTimeout(function(){tone(150,0.22,'sawtooth',0.03);},100);}
function sfxShatter(){
  var a=getAC();if(!a)return;
  // Layer of sharp crackle sounds simulating breaking ceramic/glass
  for(var i=0;i<8;i++){
    (function(i){
      setTimeout(function(){
        var f=800+Math.random()*4000,dur=0.03+Math.random()*0.06;
        var o=a.createOscillator(),g=a.createGain(),flt=a.createBiquadFilter();
        flt.type='highpass';flt.frequency.value=1200+Math.random()*2000;
        o.type='sawtooth';o.frequency.value=f;
        g.gain.setValueAtTime(0.06+Math.random()*0.04,a.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+dur+0.05);
        o.connect(flt);flt.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+dur+0.08);
      },i*25+Math.random()*30);
    })(i);
  }
  // Low thud impact
  var o2=a.createOscillator(),g2=a.createGain();o2.type='sine';o2.frequency.value=80;
  g2.gain.setValueAtTime(0.08,a.currentTime);g2.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.25);
  o2.connect(g2);g2.connect(a.destination);o2.start();o2.stop(a.currentTime+0.3);
  // Scatter of tiny shards
  setTimeout(function(){
    for(var j=0;j<5;j++){setTimeout(function(){tone(2000+Math.random()*3000,0.02+Math.random()*0.03,'square',0.02);},j*40+Math.random()*30);}
  },100);
}
function sfx911Ring(){
  var a=getAC();if(!a)return;
  // Classic phone ring pattern
  function ring(delay){
    setTimeout(function(){
      var o=a.createOscillator(),o2=a.createOscillator(),g=a.createGain();
      o.type='sine';o.frequency.value=440;o2.type='sine';o2.frequency.value=480;
      g.gain.setValueAtTime(0.04,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.8);
      o.connect(g);o2.connect(g);g.connect(a.destination);o.start();o2.start();o.stop(a.currentTime+0.8);o2.stop(a.currentTime+0.8);
    },delay);
  }
  ring(0);ring(200);ring(1200);ring(1400);
}
function sfxGood(){
  // Satisfying stone lock-in — low thud + bright ping
  var a=getAC();if(!a)return;
  var o=a.createOscillator(),g=a.createGain(),flt=a.createBiquadFilter();
  flt.type='lowpass';flt.frequency.value=500;o.type='triangle';o.frequency.value=100;
  g.gain.setValueAtTime(0.12,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.08);
  o.connect(flt);flt.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+0.1);
  setTimeout(function(){tone(1200,0.1,'sine',0.05);},40);
  setTimeout(function(){tone(1600,0.08,'sine',0.03);},90);
}
function sfxReveal(){
  // Stone slab sliding open — low rumble + bright reveal
  var a=getAC();if(!a)return;
  var o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=70;
  g.gain.setValueAtTime(0.1,a.currentTime);g.gain.linearRampToValueAtTime(0.05,a.currentTime+0.15);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.3);
  o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+0.35);
  setTimeout(function(){tone(800,0.15,'sine',0.04);},100);
  setTimeout(function(){tone(1100,0.12,'sine',0.03);},200);
}
function sfxCreak(){
  var a=getAC();if(!a)return;
  // Low grinding creak
  for(var i=0;i<3;i++){
    (function(i){
      setTimeout(function(){
        var o=a.createOscillator(),g=a.createGain(),flt=a.createBiquadFilter();
        flt.type='bandpass';flt.frequency.value=200+i*80;flt.Q.value=8;
        o.type='sawtooth';o.frequency.setValueAtTime(60+i*15,a.currentTime);
        o.frequency.linearRampToValueAtTime(40+i*10,a.currentTime+0.6);
        g.gain.setValueAtTime(0.04,a.currentTime);
        g.gain.linearRampToValueAtTime(0.06,a.currentTime+0.2);
        g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.7);
        o.connect(flt);flt.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+0.8);
      },i*200);
    })(i);
  }
  // High-pitched hinge squeal
  setTimeout(function(){
    var o2=a.createOscillator(),g2=a.createGain(),flt2=a.createBiquadFilter();
    flt2.type='bandpass';flt2.frequency.value=1800;flt2.Q.value=15;
    o2.type='sawtooth';o2.frequency.setValueAtTime(1600,a.currentTime);o2.frequency.linearRampToValueAtTime(1200,a.currentTime+0.5);
    g2.gain.setValueAtTime(0.015,a.currentTime);g2.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.5);
    o2.connect(flt2);flt2.connect(g2);g2.connect(a.destination);o2.start();o2.stop(a.currentTime+0.6);
  },150);
}

function sfxQuizCrack(intensity){
  var a=getAC();if(!a)return;
  // Glass/stone cracking — layered high-freq burst + low thud
  var g=a.createGain();g.gain.setValueAtTime(0.06+intensity*0.04,a.currentTime);g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.25);g.connect(a.destination);
  for(var i=0;i<3+intensity*2;i++){
    (function(i){
      setTimeout(function(){
        var o=a.createOscillator(),fg=a.createGain(),flt=a.createBiquadFilter();
        flt.type='highpass';flt.frequency.value=1500+Math.random()*2000;
        o.type='sawtooth';o.frequency.value=800+Math.random()*3000;
        fg.gain.setValueAtTime(0.03+intensity*0.02,a.currentTime);fg.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.08+Math.random()*0.1);
        o.connect(flt);flt.connect(fg);fg.connect(a.destination);o.start();o.stop(a.currentTime+0.15);
      },i*25+Math.random()*20);
    })(i);
  }
  // Low impact thud
  var o2=a.createOscillator(),g2=a.createGain();o2.type='triangle';o2.frequency.value=50+intensity*20;
  g2.gain.setValueAtTime(0.08+intensity*0.04,a.currentTime);g2.gain.exponentialRampToValueAtTime(0.001,a.currentTime+0.15);
  o2.connect(g2);g2.connect(a.destination);o2.start();o2.stop(a.currentTime+0.2);
}

// ─── QUIZ CRACK SYSTEM ───
var quizCrackLevel=0;
var CRACK_PATHS=[
  // Glass crack patterns — sharp angular breaks with branching fractures
  {x:'12%',y:'5%',w:'38%',h:'48%',
    d:'M2,0 L5,8 L3,12 L7,18 L4,24 L8,30 L5,36 L9,42 L6,50 L10,58 L7,65 L11,72 L8,80 L12,88 L9,95 L13,100',
    d2:'M7,18 L14,16 L18,20 L22,17',d3:'M8,30 L2,34 L0,30',
    d4:'M10,58 L16,55 L20,60 L24,56',d5:'M6,50 L0,52'},
  {x:'68%',y:'3%',w:'28%',h:'52%',
    d:'M22,0 L19,6 L21,12 L17,18 L20,24 L16,32 L19,38 L15,46 L18,52 L14,60 L17,68 L13,76 L16,84 L12,92 L15,100',
    d2:'M17,18 L10,15 L7,18 L4,14',d3:'M15,46 L22,42 L26,46',
    d4:'M14,60 L8,62 L5,58',d5:'M16,84 L22,80'},
  {x:'38%',y:'18%',w:'32%',h:'58%',
    d:'M18,0 L15,6 L17,12 L13,20 L16,26 L12,34 L15,40 L11,48 L14,54 L10,62 L13,68 L9,76 L12,82 L8,90 L11,96 L7,100',
    d2:'M13,20 L6,17 L3,22 L0,18',d3:'M11,48 L18,44 L22,48 L26,44',
    d4:'M9,76 L3,78 L0,74',d5:'M14,54 L20,58 L24,54'},
  {x:'3%',y:'38%',w:'42%',h:'52%',
    d:'M32,0 L28,6 L30,12 L26,20 L29,26 L25,34 L28,40 L24,48 L27,54 L23,62 L26,68 L22,76 L25,84 L21,92 L24,100',
    d2:'M26,20 L20,16 L16,20 L12,16',d3:'M24,48 L30,44 L34,48',
    d4:'M22,76 L16,78 L12,74',d5:'M27,54 L33,58'},
  {x:'52%',y:'32%',w:'38%',h:'58%',
    d:'M8,0 L11,6 L9,12 L13,20 L10,26 L14,34 L11,40 L15,48 L12,54 L16,62 L13,68 L17,76 L14,82 L18,90 L15,96 L19,100',
    d2:'M13,20 L20,16 L24,20 L28,16',d3:'M15,48 L8,44 L4,48',
    d4:'M17,76 L24,78 L28,74',d5:'M12,54 L6,58 L2,54'}
];

function addQuizCrack(level){
  var container=document.getElementById('quizCracks');if(!container)return;
  if(level>CRACK_PATHS.length)return;
  var c=CRACK_PATHS[level-1];
  var opacity=0.25+level*0.12;
  var strokeW=0.5+level*0.15;
  var div=document.createElement('div');
  div.className='quiz-crack';
  div.style.cssText='left:'+c.x+';top:'+c.y+';width:'+c.w+';height:'+c.h;
  div.innerHTML='<svg viewBox="0 0 40 100" preserveAspectRatio="none">'+
    '<path d="'+c.d+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.25)+')" stroke-width="'+(strokeW+1.5)+'" stroke-linecap="round" filter="blur(2px)"/>'+
    '<path d="'+c.d+'" fill="none" stroke="rgba(255,255,255,'+opacity+')" stroke-width="'+strokeW+'" stroke-linejoin="bevel"/>'+
    '<path d="'+c.d2+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.8)+')" stroke-width="'+(strokeW*0.7)+'" stroke-linejoin="bevel"/>'+
    '<path d="'+c.d3+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.7)+')" stroke-width="'+(strokeW*0.6)+'" stroke-linejoin="bevel"/>'+
    '<path d="'+c.d4+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.6)+')" stroke-width="'+(strokeW*0.5)+'" stroke-linejoin="bevel"/>'+
    '<path d="'+c.d5+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.5)+')" stroke-width="'+(strokeW*0.4)+'" stroke-linejoin="bevel"/>'+
    '</svg>';
  container.appendChild(div);
  requestAnimationFrame(function(){div.classList.add('visible');});
}

function updateQuizRisk(){
  var meter=document.getElementById('quizRiskMeter');
  var fill=document.getElementById('quizRiskFill');
  if(!meter||!fill)return;
  if(S.quizBase>0){meter.classList.add('show');}
  var pct=Math.min(100,Math.max(0,(S.quizBase/60)*100));
  fill.style.width=pct+'%';
  if(pct>70)fill.style.background='linear-gradient(90deg,#8b1a2a,#dd2244)';
  else if(pct>40)fill.style.background='linear-gradient(90deg,var(--gold-dim),#8b1a2a)';
}

// ─── AMBIENT MUSIC ───
var ambDrones=[],ambInt=null,musicOn=false;
function startMusic(){
  var a=getAC();if(!a)return;musicOn=true;
  // Deep warm drones — museum hall resonance
  [[55,0.04,'sine'],[82.5,0.025,'sine'],[110,0.02,'triangle'],[165,0.012,'sine']].forEach(function(p){
    var o=a.createOscillator(),g=a.createGain();o.type=p[2];o.frequency.value=p[0];g.gain.value=p[1];o.connect(g);g.connect(a.destination);o.start();ambDrones.push({o:o,g:g});
  });
  // Strings-like pad — slow breathing swell
  var padFreqs=[130.81,164.81,196];
  padFreqs.forEach(function(f){
    var o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=f;
    g.gain.value=0;o.connect(g);g.connect(a.destination);o.start();ambDrones.push({o:o,g:g});
    (function swell(){if(!musicOn)return;var t=a.currentTime;
      g.gain.setValueAtTime(0.008,t);g.gain.linearRampToValueAtTime(0.02,t+4);g.gain.linearRampToValueAtTime(0.008,t+8);
      setTimeout(swell,8000);
    })();
  });
  // Piano-like bell tones — museum at night
  var pianoNotes=[261.63,293.66,329.63,349.23,392,440,493.88,523.25];
  function museumBell(){
    if(!musicOn)return;var a2=getAC();if(!a2)return;
    var f=pianoNotes[Math.floor(Math.random()*pianoNotes.length)];
    // Fundamental
    var o1=a2.createOscillator(),g1=a2.createGain();o1.type='sine';o1.frequency.value=f;
    g1.gain.setValueAtTime(0,a2.currentTime);g1.gain.linearRampToValueAtTime(0.035,a2.currentTime+0.08);
    g1.gain.exponentialRampToValueAtTime(0.001,a2.currentTime+3.5);o1.connect(g1);g1.connect(a2.destination);o1.start();o1.stop(a2.currentTime+4);
    // Soft harmonic
    var o2=a2.createOscillator(),g2=a2.createGain();o2.type='sine';o2.frequency.value=f*2;
    g2.gain.setValueAtTime(0,a2.currentTime);g2.gain.linearRampToValueAtTime(0.012,a2.currentTime+0.05);
    g2.gain.exponentialRampToValueAtTime(0.001,a2.currentTime+2);o2.connect(g2);g2.connect(a2.destination);o2.start();o2.stop(a2.currentTime+2.5);
  }
  museumBell();
  ambInt=setInterval(function(){museumBell();},3500+Math.random()*4000);
  var btn=document.getElementById('musicToggle');if(btn)btn.textContent='SOUND ON';
}
function stopMusic(){
  musicOn=false;ambDrones.forEach(function(d){try{d.o.stop();}catch(e){}});ambDrones=[];clearInterval(ambInt);
  var btn=document.getElementById('musicToggle');if(btn)btn.textContent='SOUND OFF';
}
function toggleMusic(){musicOn?stopMusic():startMusic();}

// ─── TOUR GUIDES ───
// Paste ElevenLabs audio URLs in the 'audioUrl' field for each guide.
// When set, narrate() will play the audio instead of speechSynthesis for the greeting.
var GUIDES={
  classical:{
    name:'Marcus Aurelius',era:'Classical',year:'490 BC',
    rate:0.78,pitch:0.55,voicePref:['Daniel','Aaron','en-GB'],
    audioUrl:'', // ← Paste ElevenLabs URL here
    accent:'rgba(200,190,175,','accentHex':'#c8beaf',accentDim:'#7a7568',
    greeting:'I am Marcus Aurelius, guardian of the Classical wing. Let us examine your record with the rigor of ancient philosophy.',
    style:'Stoic and philosophical. Uses ancient metaphors. Speaks of discipline, virtue, and duty.'
  },
  renaissance:{
    name:'Isabella di Firenze',era:'Renaissance',year:'1504 AD',
    rate:0.88,pitch:0.85,voicePref:['Samantha','Karen','en-US'],
    audioUrl:'', // ← Paste ElevenLabs URL here
    accent:'rgba(180,140,80,','accentHex':'#b48c50',accentDim:'#8a6a38',
    greeting:'Welcome, dear visitor. I am Isabella, patroness of the Florentine wing. Together we shall illuminate your driving artistry.',
    style:'Warm and eloquent. Uses art and beauty metaphors. Speaks of craft, mastery, and refinement.'
  },
  ming:{
    name:'Master Zheng',era:'Ming Dynasty',year:'1420 AD',
    rate:0.82,pitch:0.65,voicePref:['Daniel','Fred','en-GB'],
    audioUrl:'', // ← Paste ElevenLabs URL here
    accent:'rgba(100,160,130,','accentHex':'#64a082',accentDim:'#4a7a62',
    greeting:'I am Master Zheng, keeper of the Imperial collection. Patience and awareness are the foundations of safe travel.',
    style:'Calm and wise. Uses nature and harmony metaphors. Speaks of balance, patience, and flow.'
  },
  deco:{
    name:'Victor Langley',era:'Art Deco',year:'1928 AD',
    rate:1.0,pitch:0.75,voicePref:['Alex','Rishi','en-US'],
    audioUrl:'', // ← Paste ElevenLabs URL here
    accent:'rgba(180,180,200,','accentHex':'#b4b4c8',accentDim:'#8888a0',
    greeting:'Victor Langley, at your service. In my era, speed was the future. Let us see if you can handle it.',
    style:'Sharp and direct. Uses machine and speed metaphors. Speaks of precision, innovation, and modernity.'
  }
};
var activeGuide=null;
var guideKeys=['classical','renaissance','ming','deco'];
var guideIdx=0;

var GUIDE_IMG_MAP={
  classical:3,   // gold-bust
  renaissance:4, // gold-coin
  ming:1,        // blue-vase
  deco:5         // gold-statue
};

function showGuideAt(idx){
  guideIdx=idx;
  var key=guideKeys[idx],g=GUIDES[key];
  var stage=document.getElementById('guideStage');
  document.getElementById('guideCounter').textContent=(idx+1)+' / '+guideKeys.length;
  document.getElementById('guidePrevBtn').style.visibility=idx>0?'visible':'hidden';
  document.getElementById('guideNextBtn').textContent=idx<guideKeys.length-1?'Next':'';
  document.getElementById('guideNextBtn').style.visibility=idx<guideKeys.length-1?'visible':'hidden';
  // Spotlight color
  var sl=document.querySelector('.guide-spotlight');
  if(sl)sl.style.background='radial-gradient(circle at 50% 40%, '+g.accent+'0.12) 0%, '+g.accent+'0.04) 30%, transparent 65%)';
  stage.style.opacity='0';
  setTimeout(function(){
    var gImgIdx=GUIDE_IMG_MAP[key]!==undefined?GUIDE_IMG_MAP[key]:0;var gImgSrc=ARTIFACT_IMAGES[gImgIdx]||ARTIFACT_IMAGES[0];
    stage.innerHTML='<div class="gs-art"><img src="'+gImgSrc+'" class="art-image guide-art-img" alt="'+g.name+'"></div><div class="gs-era">'+g.year+'</div><div class="gs-name">'+g.name+'</div><div class="gs-desc">'+g.era+' Era</div><div class="gs-quote">"'+g.greeting+'"</div>';
    stage.style.opacity='1';
  },150);
  // Set as active temporarily for voice
  activeGuide=g;
  stopVoice();
  setTimeout(function(){
    if(g.audioUrl){
      var el=document.getElementById('voiceLiveText');if(el)el.textContent=g.greeting;
      playElevenLabs(g.audioUrl);
    }else{narrate(g.greeting);}
  },300);
}

function cycleGuide(dir){
  sfxAdv();
  var next=guideIdx+dir;
  if(next<0||next>=guideKeys.length)return;
  showGuideAt(next);
}

function confirmGuide(){
  var key=guideKeys[guideIdx],g=GUIDES[key];
  activeGuide=g;
  sfxAdv();
  var r=document.documentElement;
  r.style.setProperty('--era-accent',g.accentHex);
  r.style.setProperty('--era-accent-dim',g.accentDim);
  r.style.setProperty('--era-accent-rgb',g.accent);
  document.body.dataset.era=key;
  stopVoice();
  narrate('You have chosen '+g.name+'. Let us begin.');
  setTimeout(function(){showScreen('quiz');renderQ();},2000);
}

// ─── ELEVENLABS AUDIO ───
var elAudio=null;
function playElevenLabs(url,onEnd){
  stopElevenLabs();
  elAudio=new Audio(url);
  elAudio.volume=0.95;
  elAudio.onended=function(){elAudio=null;if(onEnd)onEnd();};
  elAudio.onerror=function(){elAudio=null;if(onEnd)onEnd();};
  elAudio.play().catch(function(){elAudio=null;if(onEnd)onEnd();});
}
function stopElevenLabs(){if(elAudio){try{elAudio.pause();elAudio.currentTime=0;}catch(e){}elAudio=null;}}

// ─── VOICE (robust queue + Chrome fix) ───
var vQ=[],vBusy=false,vTimer=null;
if('speechSynthesis' in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=function(){};}
function narrate(text){
  var el=document.getElementById('voiceLiveText');if(el)el.textContent=text;
  vQ.push(text);if(!vBusy)drainV();
}
function drainV(){
  if(!vQ.length){vBusy=false;return;}
  if(!('speechSynthesis' in window)){vBusy=false;return;}
  vBusy=true;var t=vQ.shift();
  speechSynthesis.cancel();clearInterval(vTimer);
  var u=new SpeechSynthesisUtterance(t);
  // Apply guide voice settings
  var g=activeGuide||{rate:0.85,pitch:0.7,voicePref:['Daniel','Samantha','en-GB']};
  u.rate=g.rate;u.pitch=g.pitch;u.volume=0.95;
  var voices=speechSynthesis.getVoices();
  var prefs=g.voicePref||['Daniel','Samantha','en-GB'];
  var v=null;
  for(var i=0;i<prefs.length&&!v;i++){var p=prefs[i];v=voices.find(function(x){return x.name.indexOf(p)>-1;})||voices.find(function(x){return x.lang===p;});}
  if(!v)v=voices.find(function(x){return x.lang&&x.lang.startsWith('en');})||null;
  if(v)u.voice=v;
  u.onend=function(){clearInterval(vTimer);setTimeout(drainV,250);};
  u.onerror=function(){clearInterval(vTimer);vBusy=false;setTimeout(drainV,150);};
  speechSynthesis.speak(u);
  vTimer=setInterval(function(){if(speechSynthesis.speaking&&!speechSynthesis.paused){speechSynthesis.pause();speechSynthesis.resume();}},7000);
}
function stopVoice(){vQ=[];vBusy=false;clearInterval(vTimer);if('speechSynthesis' in window)speechSynthesis.cancel();stopElevenLabs();}

// ─── LLM (OpenAI) ───
function getAIKey(){return localStorage.getItem('da_openai_key')||'';}
function setAIKey(k){localStorage.setItem('da_openai_key',k);}
async function aiAssess(data){
  var key=getAIKey();if(!key)return null;
  try{
    var r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:'gpt-4o-mini',max_tokens:300,messages:[
        {role:'system',content:'You are '+((activeGuide?activeGuide.name:'The Curator'))+', a museum guide from the '+((activeGuide?activeGuide.era:'Classical'))+' era who assesses driving risk. Your personality: '+((activeGuide?activeGuide.style:'Eloquent and wise. Uses museum metaphors.'))+' Speak in 3-4 sentences. Be specific about their data. End with one actionable safety recommendation. Be warm but honest. Reference State Farm Drive Safe & Save as a helpful program.'},
        {role:'user',content:'Assess this driver:\nRisk Score: '+data.score+'/100\nArchetype: '+data.arch+'\nPhone Distractions: '+data.phone+'\nLate Brakes: '+data.brakes+'\nObstacle Collisions: '+data.hits+'\nSafe Actions: '+data.safe+'\nTop risk factor: '+data.topRisk}
      ]})});
    var j=await r.json();return j.choices[0].message.content;
  }catch(e){return null;}
}

// ─── USER PROFILE (localStorage) ───
function getProfile(name){
  try{var d=JSON.parse(localStorage.getItem('da_profiles')||'{}');return d[name.toLowerCase()]||null;}catch(e){return null;}
}
function saveProfile(name,run){
  try{
    var d=JSON.parse(localStorage.getItem('da_profiles')||'{}');
    var k=name.toLowerCase();
    if(!d[k])d[k]={runs:[],best:null,visits:0};
    d[k].runs.push(run);d[k].visits++;
    if(d[k].best===null||run.score<d[k].best)d[k].best=run.score;
    localStorage.setItem('da_profiles',JSON.stringify(d));
  }catch(e){}
}
function checkReturning(){
  var name=document.getElementById('guestName').value.trim();
  var el=document.getElementById('returningBanner');
  if(!el||!name){if(el)el.style.display='none';return;}
  var p=getProfile(name);
  if(p&&p.runs.length>0){
    var last=p.runs[p.runs.length-1];
    el.style.display='block';
    var goalId=p.activeGoal,goalHtml='';
    if(goalId){var g=GOALS.find(function(x){return x.id===goalId;});if(g)goalHtml=' · Active goal: <strong>'+g.label+'</strong>';}
    el.innerHTML='<span class="rb-label">Returning Visitor</span><span class="rb-detail">'+p.visits+' visit'+(p.visits>1?'s':'')+' · Last score: <strong>'+last.score+'/100</strong> · Best: <strong>'+p.best+'/100</strong>'+goalHtml+'</span>';
  }else{el.style.display='none';}
}

// ─── WEATHER (Open-Meteo — no API key) ───
var weatherData=null;
function fetchWeather(){
  // Try geolocation first
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
      doWeatherFetch(pos.coords.latitude,pos.coords.longitude);
    },function(){
      // Geolocation denied — use IP-based fallback
      fetch('https://ipapi.co/json/').then(function(r){return r.json();}).then(function(j){
        if(j.latitude&&j.longitude)doWeatherFetch(j.latitude,j.longitude);
      }).catch(function(){ /* silent fallback */ });
    },{ timeout:5000 });
  }else{
    // No geolocation API — try IP fallback
    fetch('https://ipapi.co/json/').then(function(r){return r.json();}).then(function(j){
      if(j.latitude&&j.longitude)doWeatherFetch(j.latitude,j.longitude);
    }).catch(function(){});
  }
}
function doWeatherFetch(lat,lon){
  fetch('https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph')
    .then(function(r){return r.json();})
    .then(function(j){
      if(!j.current)return;
      var c=j.current,wc=c.weather_code;
      var desc='Clear';var hazard=null;
      if(wc>=95)      {desc='Thunderstorm';hazard='Severe thunderstorm — pull over if lightning is near. Hydroplaning risk is extreme.';}
      else if(wc>=80)  {desc='Heavy Rain/Snow';hazard='Heavy precipitation reduces visibility. Double your following distance.';}
      else if(wc>=70)  {desc='Snow/Sleet';hazard='Icy conditions ahead. Reduce speed by 50% and brake gently.';}
      else if(wc>=61)  {desc='Rain';hazard='Wet roads increase braking distance by 40%. Keep extra space.';}
      else if(wc>=51)  {desc='Light Rain';hazard='Light rain can make roads slick, especially in the first 15 minutes.';}
      else if(wc>=45)  {desc='Fog';hazard='Fog reduces visibility drastically. Use low beams, not high beams.';}
      else if(wc>=3)   {desc='Overcast';}
      else if(wc>=1)   {desc='Partly Cloudy';}
      if(!hazard)hazard='Conditions are favorable. Maintain standard safe driving practices.';
      weatherData={temp:Math.round(c.temperature_2m),desc:desc,wind:Math.round(c.wind_speed_10m),humidity:c.relative_humidity_2m,hazard:hazard,code:wc};
      showWeatherCard();
    }).catch(function(e){console.log('Weather fetch error:',e);});
}
function showWeatherCard(){
  if(!weatherData)return;
  var el=document.getElementById('weatherCard');
  if(!el)return;
  var w=weatherData;
  var icon=w.code>=61?'&#9748;':w.code>=45?'&#9729;':w.code>=3?'&#9729;':'&#9788;';
  el.style.display='flex';
  var html='<div class="wx-icon">'+icon+'</div><div class="wx-info"><div class="wx-temp">'+w.temp+'°F · '+w.desc+'</div><div class="wx-detail">Wind '+w.wind+' mph · Humidity '+w.humidity+'%</div>';
  html+='<div class="wx-hazard">'+w.hazard+'</div>';
  html+='</div>';
  el.innerHTML=html;
}

// ─── GOALS ───
var GOALS=[
  {id:'no_phone',label:'Zero phone distractions',check:function(){return S.phone===0;}},
  {id:'no_late_brake',label:'No late braking events',check:function(){return S.brakes===0;}},
  {id:'no_collisions',label:'Zero collisions',check:function(){return hitCount===0;}},
  {id:'score_under_30',label:'Score under 30 (low risk)',check:function(){return S.score<30;}},
  {id:'perfect_safe',label:'5+ safe actions',check:function(){return S.safe>=5;}}
];
function saveGoal(goalId){
  try{
    var d=JSON.parse(localStorage.getItem('da_profiles')||'{}');
    var k=S.visitorName.toLowerCase();
    if(!d[k])return;
    d[k].activeGoal=goalId;
    localStorage.setItem('da_profiles',JSON.stringify(d));
  }catch(e){}
  // Update UI
  document.querySelectorAll('.goal-opt').forEach(function(btn){
    btn.classList.toggle('selected',btn.dataset.goal===goalId);
  });
  var conf=document.getElementById('goalConfirm');
  if(conf){var g=GOALS.find(function(x){return x.id===goalId;});conf.textContent=g?'Goal set: '+g.label:'';conf.style.display='block';}
}
function getActiveGoal(name){
  try{
    var d=JSON.parse(localStorage.getItem('da_profiles')||'{}');
    var k=name.toLowerCase();
    return d[k]&&d[k].activeGoal?d[k].activeGoal:null;
  }catch(e){return null;}
}
function checkGoalAchieved(){
  var gid=getActiveGoal(S.visitorName);
  if(!gid)return null;
  var g=GOALS.find(function(x){return x.id===gid;});
  if(!g)return null;
  return {label:g.label,achieved:g.check()};
}

// ─── STATE ───
var S={score:0,quizBase:0,brakes:0,phone:0,safe:0,miles:0,visitorName:'',visitorId:'',simElapsed:0,simDuration:30};

// ─── DATA ───
var Qs=[
  {cat:'Distraction',icon:'I',q:'How often do you use your phone while driving?',opts:[['Never — fully hands-free',-4],['Only at complete stops',-1],['Occasionally while in motion',8],['Frequently while driving',18]]},
  {cat:'Braking',icon:'II',q:'How would you describe your typical braking style?',opts:[['Smooth and gradual',-4],['Generally gentle',-1],['Occasional hard stops',7],['Frequent, reactive braking',15]]},
  {cat:'Mileage',icon:'III',q:'How many miles do you drive per year?',opts:[['Under 5,000',-5],['5,000 – 10,000',-2],['10,000 – 15,000',4],['Over 15,000',9]]},
  {cat:'Night Driving',icon:'IV',q:'How often do you drive between 10pm and 4am?',opts:[['Rarely or never',-2],['A few times per month',3],['Several times a week',8],['Most of my driving is at night',13]]},
  {cat:'History',icon:'V',q:'Any accidents or violations in the past 3 years?',opts:[['None',-5],['One minor violation',5],['One at-fault accident',12],['Multiple incidents',22]]},
  {cat:'Conditions',icon:'VI',q:'What conditions do you typically drive in?',opts:[['Mostly clear and dry',-3],['Mixed weather, some rain',2],['Frequent rain, fog, or ice',7],['Severe weather regularly',13]]},
  {cat:'Safety',icon:'VII',q:'Do you consistently wear your seatbelt?',opts:[['Always',-3],['Usually',0],['Sometimes',5],['Rarely',11]]}
];
var qIdx=0,qAns=Array(7).fill(null);
var ARCHS=[{s:0,n:'The Vigilant Guardian',img:6},{s:20,n:'The Measured Commuter',img:4},{s:40,n:'The Urban Wanderer',img:1},{s:60,n:'The Reckless Charioteer',img:2},{s:80,n:'The Fallen Rider',img:0}];
function getArch(sc){for(var i=ARCHS.length-1;i>=0;i--)if(sc>=ARCHS[i].s)return ARCHS[i];return ARCHS[0];}

var HIST_STATS={phone:'In 2022, 3,308 people were killed in distracted-driving crashes. — NHTSA',brake:'Rear-end collisions account for 29% of all injury crashes in the U.S. — NHTSA',dodge:'42,795 people died in motor vehicle crashes in 2022 alone. — NHTSA',safe:'Seat belt use saved an estimated 14,955 lives in 2017. — NHTSA',general:'Teen drivers aged 16-19 are 3x more likely to be in a fatal crash. — CDC'};

var RECS=[
  {id:'phone',title:'Silence the Screen',desc:'Enable Do Not Disturb While Driving. At 40 mph, a 5-second glance means 100 feet driven blind.',sf:'State Farm\'s Drive Safe & Save tracks phone-free driving for premium discounts.'},
  {id:'brake',title:'The Three-Second Rule',desc:'Maintain at least 3 seconds of following distance. In wet conditions, double it.',sf:'Good braking habits are a top factor in your Drive Safe & Save score.'},
  {id:'dodge',title:'Situational Awareness',desc:'Scan intersections, check mirrors every 8 seconds, and anticipate the unexpected.',sf:'State Farm\'s mission: help people manage the risks of everyday life.'},
  {id:'safe',title:'Drive Safe & Save',desc:'Enroll in State Farm\'s telematics program. Your good habits become real savings — up to 30% off premiums.',sf:'Like a Good Neighbor, State Farm is there — rewarding safe driving.'}
];

// ─── SCREENS ───
function showScreen(id){
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');s.style.display='none';});
  var el=document.getElementById(id);if(!el)return;el.style.display='';
  requestAnimationFrame(function(){el.classList.add('active');});window.scrollTo(0,0);
}

// ─── LOBBY → START ───
function enterMuseum(){
  var name=document.getElementById('guestName').value.trim();
  if(!name){document.getElementById('guestName').focus();document.getElementById('guestName').style.borderColor='#8b1a2a';return;}
  S.visitorName=name;S.visitorId=Math.random().toString(36).slice(2,8).toUpperCase();
  var aiEl=document.getElementById('aiKeyInput');var kv=aiEl?aiEl.value.trim():'';if(kv)setAIKey(kv);
  fetchWeather();
  // 1) Fade out input area + title
  var inputArea=document.getElementById('lobbyInputArea');
  if(inputArea)inputArea.classList.add('fade-out');
  document.querySelectorAll('.lobby-title,.lobby-subtitle').forEach(function(el){el.style.transition='opacity 0.6s';el.style.opacity='0';});
  // 2) After fade, play creak and open doors
  setTimeout(function(){
    sfxCreak();
    var doors=document.getElementById('entranceDoors');
    if(doors)doors.classList.add('doors-open');
  },600);
  // 3) After doors open, show consent
  setTimeout(function(){
    document.getElementById('consentModal').style.display='block';document.getElementById('dimOverlay').classList.add('on');
  },2200);
}
function acceptConsent(){
  document.getElementById('consentModal').style.display='none';document.getElementById('dimOverlay').classList.remove('on');
  try{startMusic();}catch(e){}
  guideIdx=0;
  showScreen('pickGuide');
  setTimeout(function(){showGuideAt(0);},300);
}

// ─── QUIZ ───
function renderQ(){
  var q=Qs[qIdx],L=['A','B','C','D'];
  document.getElementById('qStepLabel').textContent='Question '+(qIdx+1)+' of '+Qs.length;
  document.getElementById('qProg').style.width=(qIdx/Qs.length*100)+'%';
  var h='<div class="q-category"><span class="q-cat-num">'+q.icon+'</span>'+q.cat+'</div>';
  h+='<div class="q-text">'+q.q+'</div><div class="q-options">';
  q.opts.forEach(function(o,i){h+='<button class="q-opt'+(qAns[qIdx]===i?' selected':'')+'" onclick="pickQ('+i+')"><span class="q-opt-marker">'+L[i]+'</span>'+o[0]+'</button>';});
  h+='</div><button class="q-next" onclick="advQ()"'+(qAns[qIdx]===null?' disabled':'')+'>'+(qIdx===Qs.length-1?'Begin The Drive':'Continue')+'</button>';
  document.getElementById('quizBody').innerHTML=h;
}
function pickQ(i){sfxPick();qAns[qIdx]=i;renderQ();}
function advQ(){
  if(qAns[qIdx]===null)return;sfxAdv();
  var ansScore=Qs[qIdx].opts[qAns[qIdx]][1];
  S.quizBase+=ansScore;
  // Crack system — risky answers crack the screen
  if(ansScore>=5){
    quizCrackLevel++;
    sfxQuizCrack(quizCrackLevel);
    addQuizCrack(quizCrackLevel);
  }
  updateQuizRisk();
  qIdx++;
  if(qIdx>=Qs.length){S.quizBase=Math.max(0,S.quizBase);document.getElementById('dimOverlay').classList.add('on');document.getElementById('driveIntroModal').style.display='block';}
  else renderQ();
}
function closeDriveIntro(){
  document.getElementById('dimOverlay').classList.remove('on');document.getElementById('driveIntroModal').style.display='none';
  showScreen('driveSim');initGame();
}

// ═══════════════════════════════════════════
// DRIVING GAME
// ═══════════════════════════════════════════
var GC,Gctx,Gdpr=1,GW=0,GH=0;
var gameActive=false,gameAnim=null,gameScroll=0;
var playerX=0,targetX=0;
var obstacles=[],logItems=[],simTimer=null,simSpeed=0,dodgeCount=0,hitCount=0;
var notifActive=false,brakeActive=false,nTimer=null,bTimer=null;

var SIM_EVENTS=[
  {t:2,type:'voice',text:'Your journey through the museum corridor begins. Eyes forward, hands steady.'},
  {t:4,type:'speed',v:30},
  {t:7,type:'obstacle',kind:'statue',lane:0},
  {t:10,type:'notif',app:'INSTAGRAM',letter:'\uD83D\uDCF7',color:'linear-gradient(135deg,#833AB4,#FD1D1D,#F77737)',title:'sarah_designs liked your photo',body:'Your post has 47 new likes'},
  {t:14,type:'obstacle',kind:'painting',lane:-1},
  {t:16,type:'speed',v:40},
  {t:17,type:'voice',text:'Steady. Do not let distractions claim your focus.'},
  {t:20,type:'obstacle',kind:'vase',lane:1},
  {t:22,type:'brake'},
  {t:24,type:'notif',app:'SNAPCHAT',letter:'\uD83D\uDC7B',color:'#FFFC00',title:'jake_m is typing...',body:'New snap from jake_m \u2022 Tap to view'},
  {t:26,type:'obstacle',kind:'statue',lane:-1},
  {t:28,type:'brake'},
  {t:29,type:'voice',text:'Final stretch. Almost through.'},
  {t:30,type:'end'}
];

function initGame(){
  GC=document.getElementById('roadCanvas');Gdpr=window.devicePixelRatio||1;
  var r=GC.getBoundingClientRect();GW=r.width;GH=r.height;if(GW<10){GW=295;GH=615;}
  GC.width=GW*Gdpr;GC.height=GH*Gdpr;Gctx=GC.getContext('2d');
  gameActive=true;gameScroll=0;playerX=0;targetX=0;
  obstacles=[];logItems=[];S.brakes=0;S.phone=0;S.safe=0;S.miles=0;S.simElapsed=0;simSpeed=0;dodgeCount=0;hitCount=0;
  notifActive=false;brakeActive=false;updateStats();
  document.addEventListener('keydown',onKey);GC.addEventListener('touchstart',onTouch,{passive:false});
  addLog('Session initialized','good');
  narrate('Welcome, '+S.visitorName+'. Navigate the museum corridor. Dodge the falling artifacts. Resist every notification. Brake when you must.');
  simTimer=setInterval(function(){
    if(!gameActive)return;S.simElapsed++;S.miles+=simSpeed/3600;updateTimer();
    SIM_EVENTS.forEach(function(ev){if(ev.t===S.simElapsed)processEv(ev);});
    if(S.simElapsed%6===0&&S.simElapsed>0&&!notifActive&&!brakeActive){S.safe++;addLog('Safe corridor segment','good');}
    recalc();updateStats();
  },1000);
  gameAnim=requestAnimationFrame(renderFrame);
}

function onKey(e){if(!gameActive)return;if(e.key==='ArrowLeft'){targetX=Math.max(-1,targetX-0.45);e.preventDefault();}if(e.key==='ArrowRight'){targetX=Math.min(1,targetX+0.45);e.preventDefault();}}
function onTouch(e){if(!gameActive)return;e.preventDefault();var r=GC.getBoundingClientRect(),x=e.touches[0].clientX-r.left;targetX=(x/r.width-0.5)*2.2;}

function processEv(ev){
  if(ev.type==='voice')narrate(ev.text);
  else if(ev.type==='speed'){simSpeed=ev.v;document.getElementById('simSpeedVal').textContent=ev.v+' mph';addLog('Speed: '+ev.v+' mph','warn');}
  else if(ev.type==='obstacle')spawnObs(ev.kind,ev.lane);
  else if(ev.type==='notif')showNotif(ev);
  else if(ev.type==='brake')showBrake();
  else if(ev.type==='end')endGame();
}
function spawnObs(kind,lane){obstacles.push({kind:kind,lane:lane,z:0,speed:0.004+simSpeed*0.00008,active:true,hit:false,imgIdx:Math.floor(Math.random()*artifactImgs.length)});var n={statue:'Ancient Statue',painting:'Sacred Relic',vase:'Golden Treasure'};addLog(n[kind]+' ahead','warn');}
function showNotif(ev){
  if(notifActive)return;notifActive=true;var n=document.getElementById('phoneNotif');
  var letterEl=document.getElementById('nLetter');letterEl.textContent=ev.letter;letterEl.style.background=ev.color;
  if(ev.app==='SNAPCHAT')letterEl.style.color='#000';else letterEl.style.color='#fff';
  document.getElementById('nApp').textContent=ev.app;document.getElementById('nTitle').textContent=ev.title;document.getElementById('nBody').textContent=ev.body;
  n.classList.remove('tapped');n.classList.add('show');addLog('Notification: '+ev.title,'warn');
  nTimer=setTimeout(function(){if(notifActive){n.classList.remove('show');notifActive=false;S.safe++;sfxGood();addLog('Notification ignored','good');narrate('Well done. Distraction resisted.');}},4500);
}
function tapNotif(){if(!notifActive||!gameActive)return;clearTimeout(nTimer);sfxBad();S.phone++;notifActive=false;var n=document.getElementById('phoneNotif');n.classList.add('tapped');setTimeout(function(){n.classList.remove('show','tapped');},600);addLog('PHONE DISTRACTION','bad');narrate('You checked your phone at '+simSpeed+' miles per hour. Distraction recorded.');recalc();updateStats();}
function showBrake(){if(brakeActive)return;brakeActive=true;document.getElementById('brakeAlert').classList.add('show');addLog('OBSTACLE — brake now','bad');narrate('Brake!');bTimer=setTimeout(function(){if(brakeActive){document.getElementById('brakeAlert').classList.remove('show');brakeActive=false;S.brakes++;sfxBad();addLog('Late braking','bad');narrate('Late reaction. Hard brake recorded.');recalc();updateStats();}},3000);}
function tapBrake(){if(!brakeActive||!gameActive)return;clearTimeout(bTimer);sfxGood();brakeActive=false;S.safe++;document.getElementById('brakeAlert').classList.remove('show');addLog('Timely braking','good');narrate('Good reflexes.');recalc();updateStats();}

function endGame(){
  gameActive=false;clearInterval(simTimer);cancelAnimationFrame(gameAnim);
  document.removeEventListener('keydown',onKey);
  document.getElementById('phoneNotif').classList.remove('show');document.getElementById('brakeAlert').classList.remove('show');
  document.getElementById('crashDetect').classList.remove('show');
  document.getElementById('crashFullscreen').classList.remove('show');
  document.getElementById('roadsidePrompt').classList.remove('show');
  document.getElementById('roadsideConnect').classList.remove('show');
  clearInterval(roadsideTimer);roadsideActive=false;simPaused=false;
  clearTimeout(nTimer);clearTimeout(bTimer);recalc();addLog('Drive complete','good');
  // Save to profile
  var run={score:S.score,phone:S.phone,brakes:S.brakes,hits:hitCount,safe:S.safe,arch:getArch(S.score).n,date:new Date().toISOString()};
  saveProfile(S.visitorName,run);
  stopVoice();
  narrate(S.visitorName+', your drive is complete. Your record has been archived.');
  // Show drive-end modal
  setTimeout(function(){
    document.getElementById('dimOverlay').classList.add('on');
    document.getElementById('driveEndModal').style.display='block';
  },800);
}
function proceedToMuseum(){
  document.getElementById('driveEndModal').style.display='none';
  document.getElementById('dimOverlay').classList.remove('on');
  stopVoice();
  showScreen('museum');showSummaryFirst();
}

// ─── CRASH DETECTION ALERT (in-sim) ───
var roadsideActive=false,roadsideTimer=null,roadsideCountdown=3,simPaused=false;

function showCrashAlert(){
  // Play shattering dish sound
  sfxShatter();
  // Stop any voice prompt immediately
  stopVoice();
  if('speechSynthesis' in window)speechSynthesis.cancel();
  // Immediately pause the simulation
  gameActive=false;clearInterval(simTimer);cancelAnimationFrame(gameAnim);
  // Full-screen red cracked overlay
  var fs=document.getElementById('crashFullscreen');
  if(fs){
    fs.classList.remove('show');
    void fs.offsetWidth;
    // Inject SVG glass cracks matching quiz cracks
    var cracksEl=document.getElementById('crashCracks');
    if(cracksEl)cracksEl.innerHTML='';
    CRACK_PATHS.forEach(function(c,i){
      var opacity=0.4+i*0.1;
      var strokeW=1.0+i*0.2;
      var div=document.createElement('div');
      div.className='crash-crack-svg';
      div.style.cssText='left:'+c.x+';top:'+c.y+';width:'+c.w+';height:'+c.h+';animation-delay:'+(i*0.06)+'s';
      div.innerHTML='<svg viewBox="0 0 40 100" preserveAspectRatio="none">'+
        '<path d="'+c.d+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.25)+')" stroke-width="'+(strokeW+1.5)+'" stroke-linecap="round" filter="blur(2px)"/>'+
        '<path d="'+c.d+'" fill="none" stroke="rgba(255,255,255,'+opacity+')" stroke-width="'+strokeW+'" stroke-linejoin="bevel"/>'+
        '<path d="'+c.d2+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.8)+')" stroke-width="'+(strokeW*0.7)+'" stroke-linejoin="bevel"/>'+
        '<path d="'+c.d3+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.7)+')" stroke-width="'+(strokeW*0.6)+'" stroke-linejoin="bevel"/>'+
        '<path d="'+c.d4+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.6)+')" stroke-width="'+(strokeW*0.5)+'" stroke-linejoin="bevel"/>'+
        '<path d="'+c.d5+'" fill="none" stroke="rgba(255,255,255,'+(opacity*0.5)+')" stroke-width="'+(strokeW*0.4)+'" stroke-linejoin="bevel"/>'+
        '</svg>';
      if(cracksEl)cracksEl.appendChild(div);
    });
    fs.classList.add('show');
  }
  // Screen shake on entire body
  document.body.classList.add('sim-shake');
  setTimeout(function(){document.body.classList.remove('sim-shake');},400);
  // After the crash screen, transition to roadside prompt
  setTimeout(function(){
    if(fs)fs.classList.remove('show');
    pauseSimForRoadside();
  },1800);
}

function pauseSimForRoadside(){
  if(roadsideActive)return;
  roadsideActive=true;simPaused=true;
  // Pause the game loop
  gameActive=false;clearInterval(simTimer);cancelAnimationFrame(gameAnim);
  // Show prompt
  var prompt=document.getElementById('roadsidePrompt');
  if(!prompt)return;
  roadsideCountdown=5;
  document.getElementById('rpTimer').textContent='5';
  document.getElementById('rpCountdown').textContent='5';
  prompt.classList.add('show');
  // Start countdown
  roadsideTimer=setInterval(function(){
    roadsideCountdown--;
    document.getElementById('rpTimer').textContent=roadsideCountdown;
    document.getElementById('rpCountdown').textContent=roadsideCountdown;
    if(roadsideCountdown<=0){
      clearInterval(roadsideTimer);
      dismissRoadside();
    }
  },1000);
}

function acceptRoadside(){
  if(!roadsideActive)return;
  clearInterval(roadsideTimer);
  document.getElementById('roadsidePrompt').classList.remove('show');
  // Show connecting screen
  var conn=document.getElementById('roadsideConnect');
  conn.classList.add('show');
  // Play 911 ringtone immediately + narrate in sync
  sfx911Ring();
  narrate('Dialing 911. Connecting you with State Farm Roadside Assistance.');
  document.getElementById('rcStatus').textContent='Dialing 911...';
  addLog('Roadside Assistance activated','good');
  S.safe+=2;
  // Progress through connection states
  setTimeout(function(){document.getElementById('rcStatus').textContent='Connecting to State Farm...';sfx911Ring();},2000);
  setTimeout(function(){
    document.getElementById('rcStatus').textContent='Connected to dispatch';
    narrate('You are now connected. Choose how you would like to communicate.');
    // Transition to voice/chat choice
    showRoadsideOptions(conn);
  },3500);
}
function showRoadsideOptions(conn){
  var inner=conn.querySelector('.rc-inner');
  if(!inner)return;
  inner.innerHTML='<div class="rc-icon"><svg viewBox="0 0 48 48" width="56" height="56"><circle cx="24" cy="24" r="22" fill="rgba(42,74,58,0.2)" stroke="#6a9882" stroke-width="2"/><path d="M16,20 Q16,14 24,14 Q32,14 32,20 L32,22 Q32,24 30,24 L28,24 L28,20 Q28,17 24,17 Q20,17 20,20 L20,24 L18,24 Q16,24 16,22 Z" fill="#6a9882"/><rect x="21" y="28" width="6" height="6" rx="1" fill="#6a9882"/></svg></div>'+
    '<div class="rc-title" style="color:#6a9882;animation:none">CONNECTED</div>'+
    '<div class="rc-sub">State Farm Roadside Assistance</div>'+
    '<div class="rc-status" style="margin-bottom:1rem">How would you like to communicate?</div>'+
    '<div style="display:flex;gap:0.6rem;justify-content:center;margin-bottom:1.2rem">'+
      '<button class="rp-btn" onclick="chooseRoadsideMode(\'voice\')" style="padding:0.6rem 1.4rem;font-size:0.65rem"><svg viewBox="0 0 20 20" width="14" height="14" style="vertical-align:middle;margin-right:6px"><rect x="8" y="2" width="4" height="10" rx="2" fill="currentColor"/><path d="M5,9 Q5,14 10,14 Q15,14 15,9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10,14 L10,17" stroke="currentColor" stroke-width="1.5"/></svg>Voice Call</button>'+
      '<button class="rp-btn" onclick="chooseRoadsideMode(\'chat\')" style="padding:0.6rem 1.4rem;font-size:0.65rem"><svg viewBox="0 0 20 20" width="14" height="14" style="vertical-align:middle;margin-right:6px"><rect x="2" y="3" width="16" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6,17 L10,14" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="7" cy="9" r="1" fill="currentColor"/><circle cx="10" cy="9" r="1" fill="currentColor"/><circle cx="13" cy="9" r="1" fill="currentColor"/></svg>Virtual Chat</button>'+
    '</div>'+
    '<button class="rp-btn" onclick="disconnectRoadside()" style="padding:0.5rem 1.2rem;font-size:0.55rem;border-color:rgba(180,140,50,0.3);color:var(--text-muted);background:none">Disconnect</button>';
}
// ─── ROADSIDE AGENT RESPONSES ───
var AGENT_RESPONSES={
  greeting:'Hi, this is Sarah with State Farm Emergency Roadside. I\'m showing your location was automatically shared from the crash detection on your device. First things first — are you safe right now? Are you able to get out of the vehicle if you need to?',
  safe:[
    'Okay, that\'s good to hear. I want you to stay right where you are if it\'s safe to do so. I\'ve already dispatched a tow truck to your GPS coordinates — they should be there in about 15 to 20 minutes depending on traffic. Is there any damage to your vehicle you can see?',
    'That\'s a relief. If you can, go ahead and turn on your hazard lights if they aren\'t on already. I\'ve got a tow truck heading your way now. While we wait, can you tell me — is anyone else involved in the incident? Any other vehicles?',
    'Okay good. Just stay put and keep your seatbelt on if you\'re still in the car. I\'ve pinged your location to our nearest service provider. ETA looks like about 18 minutes. Are you noticing any fluid leaking under the vehicle or any smoke?'
  ],
  injured:[
    'Okay, I need you to stay as calm as you can. I\'m dispatching EMS to your location right now — they\'re being notified as we speak. Do not try to move anyone who might be injured. Can you tell me where the pain is?',
    'I\'m sending paramedics to you immediately. Try not to move your neck or back. Can you tell me — is the person conscious and breathing? I need to relay this to the first responders.',
    'Help is on the way right now. If there\'s any bleeding, try to apply gentle pressure with a cloth if you have one. Are you able to stay on the line with me until they arrive?'
  ],
  notinjured:[
    'That\'s really good news. The most important thing is everyone\'s okay. Now, I\'d recommend taking some photos of the scene if you can — all angles of any damage, the road conditions, and any other vehicles involved. That\'ll make the claims process a lot smoother.',
    'I\'m glad to hear that. While we wait for the tow truck, if you have the State Farm app on your phone, you can actually start filing your claim right now. It\'ll save you a lot of time later.',
    'That\'s the best news I could hear. If there are any other drivers involved, try to exchange insurance information while you wait. I can help you through the claims process whenever you\'re ready.'
  ],
  damage:[
    'I\'m sorry to hear that. Let me get some details so we can process this quickly. With your State Farm policy, you\'re covered for collision damage, and we can get you into a rental car today if your vehicle isn\'t drivable. Can you describe what happened?',
    'Understood. I\'m going to flag this for our express claims team so you don\'t have to wait around. We\'ll need photos of the damage — the app walks you through exactly what angles to capture. Do you have your policy number, or should I look it up?',
    'I\'ll make sure we get that taken care of. Based on your policy, you\'re covered for repairs and a rental vehicle while yours is in the shop. The adjuster will reach out within 24 hours, but you can start the claim right now if you\'d like.'
  ],
  tow:[
    'Absolutely. I\'ve got a certified tow service en route — they\'re about 15 minutes out. They\'ll transport your vehicle to our nearest preferred repair shop, or if you have a specific mechanic you trust, we can send it there instead. What\'s your preference?',
    'The tow truck is already on its way. Once they arrive, the driver will need your keys and they\'ll handle everything from there. While we wait, would you like me to set up a rental car for you? We can have one ready at the shop when you arrive.',
    'I\'m dispatching the tow now. Just so you know, your policy covers up to 100 miles of towing at no cost to you. The driver should arrive within 20 minutes. Is the vehicle blocking any traffic lanes?'
  ],
  insurance:[
    'Of course. Your current policy includes comprehensive and collision coverage, roadside assistance, and rental reimbursement. Your deductible is on file. Would you like me to walk you through what your out-of-pocket costs would look like for this incident?',
    'Let me pull up your account. You\'re enrolled in Drive Safe & Save, which is great — your safe driving record can positively impact how this is handled. Your roadside assistance and towing are fully covered under your current plan.',
    'Your policy covers this situation completely. Between roadside assistance, towing, and the rental car benefit, you shouldn\'t have to pay anything out of pocket right now. The claims adjuster will go over the details of the repair costs with you.'
  ],
  thanks:[
    'Of course. That\'s what we\'re here for. Just remember — if anything changes or you think of something later, you can call us back anytime at the number on your app, or just tap the emergency button again. Drive safe.',
    'You\'re very welcome. I\'m glad I could help. Before I let you go — do you have a safe way to get home tonight? We want to make sure you\'re completely taken care of.',
    'Happy to help. If you need anything else — even if it\'s just a question about your claim tomorrow — don\'t hesitate to reach out. State Farm is here for you 24/7.'
  ],
  location:[
    'I\'ve got your exact GPS coordinates on my screen right now. That information has been shared with the tow truck driver and emergency services. They\'ll be able to find you without any issues. Are you near any intersections or landmarks?',
    'Your location came through automatically from the crash detection. I can see you on the map. All responders have your coordinates. Just stay where you are — they\'ll come to you.'
  ],
  scared:[
    'Hey, I hear you, and it\'s completely okay to feel that way. A car accident is a really jarring experience. Just take a slow, deep breath for me. You\'re safe, help is coming, and I\'m going to stay right here with you until it arrives. Okay?',
    'That\'s totally normal — your adrenaline is going right now. I want you to focus on my voice. You\'re doing great. The tow truck is on its way and you\'re going to be just fine. Is there someone I can call for you? A family member or friend?',
    'I understand. This is a stressful situation and you\'re handling it well. Take a couple deep breaths. I\'m not going anywhere — I\'ll stay on the line as long as you need me. You\'re safe.'
  ],
  police:[
    'If you feel a police report is needed — especially if there\'s another vehicle involved or significant damage — I\'d recommend calling 911 or your local non-emergency line. I can stay on with you while you do that. Having a police report will also help with the insurance claim.',
    'That\'s a smart idea. For any accident with damage over a certain amount or involving another party, a police report is important. Would you like me to connect you, or do you have the local number?'
  ],
  rental:[
    'Absolutely. Your policy includes rental car reimbursement. I can set one up for you right now — Enterprise and Hertz both work with State Farm directly, so there\'s no out-of-pocket at pickup. Which would you prefer, and what size vehicle do you need?',
    'I\'ll get that arranged for you. We can have a rental car waiting at the repair shop, or I can have one delivered to your location. What works better for you?'
  ],
  fallback:[
    'I appreciate you sharing that. Right now, the most important thing is that help is on the way. Is there anything specific I can do for you — whether it\'s the tow, the claim, getting you a rental car, or just staying on the line?',
    'I\'m here for whatever you need. We\'ve got the tow truck dispatched, and I can help you with your insurance claim, arrange a rental car, or answer any questions you have. What would be most helpful right now?',
    'Understood. Just know that you\'re fully covered and we\'re going to take care of everything. Your tow is en route. Is there anything else on your mind?'
  ]
};
var vcCallTimer=null,vcCallSeconds=0,vcRecognition=null,vcIsRecording=false;

function getAgentResponse(userText){
  var t=userText.toLowerCase();
  var pick=function(arr){return arr[Math.floor(Math.random()*arr.length)];};
  if(/scared|afraid|nervous|shaking|panic|stress|freak|terrif|shock/.test(t))return pick(AGENT_RESPONSES.scared);
  if(/hurt|injur|bleed|pain|ambulance|medical|hospital|broken.*bone|concuss|dizzy|unconscious/.test(t))return pick(AGENT_RESPONSES.injured);
  if(/no one|nobody|not injured|no injur|everyone.*(fine|ok|safe)|no.*hurt|all.*good/.test(t))return pick(AGENT_RESPONSES.notinjured);
  if(/police|cop|officer|report|law enforce|911/.test(t))return pick(AGENT_RESPONSES.police);
  if(/rental|loaner|borrow.*car|need.*ride|uber|lyft|get home/.test(t))return pick(AGENT_RESPONSES.rental);
  if(/damage|dent|broken|wreck|totaled|scratch|bumper|fender|smash|crumpl|crush/.test(t))return pick(AGENT_RESPONSES.damage);
  if(/tow|towing|pick.*up|haul|move.*car|flatbed|drag/.test(t))return pick(AGENT_RESPONSES.tow);
  if(/insurance|policy|coverage|claim|deductible|premium|file|reimburse/.test(t))return pick(AGENT_RESPONSES.insurance);
  if(/thank|thanks|appreciate|grateful/.test(t))return pick(AGENT_RESPONSES.thanks);
  if(/where|location|find|gps|address|map|coordinates/.test(t))return pick(AGENT_RESPONSES.location);
  if(/safe|okay|ok|fine|good|alright|yeah|yes|i\'m good/.test(t)&&!/not safe|not okay|not ok|not fine/.test(t))return pick(AGENT_RESPONSES.safe);
  return pick(AGENT_RESPONSES.fallback);
}

function formatCallTime(s){var m=Math.floor(s/60),sec=s%60;return m+':'+(sec<10?'0':'')+sec;}

// ─── VOICE CALL ───
function chooseRoadsideMode(mode){
  addLog('Chose '+(mode==='voice'?'Voice Call':'Virtual Chat')+' with dispatch','good');
  if(mode==='voice')startVoiceCall();
  else startVirtualChat();
}

function startVoiceCall(){
  var conn=document.getElementById('roadsideConnect');
  var inner=conn.querySelector('.rc-inner');
  if(!inner)return;
  inner.innerHTML=
    '<div class="vc-wrap">'+
      '<div class="vc-status">STATE FARM ROADSIDE</div>'+
      '<div class="vc-timer" id="vcTimer">0:00</div>'+
      '<div class="vc-wave" id="vcWave">'+
        '<div class="vc-wave-bar"></div><div class="vc-wave-bar"></div><div class="vc-wave-bar"></div>'+
        '<div class="vc-wave-bar"></div><div class="vc-wave-bar"></div><div class="vc-wave-bar"></div><div class="vc-wave-bar"></div>'+
      '</div>'+
      '<div class="vc-transcript" id="vcTranscript"></div>'+
      '<div class="vc-controls">'+
        '<button class="vc-mic-btn" id="vcMicBtn" onclick="toggleVoiceRec()">'+
          '<svg viewBox="0 0 24 24" width="20" height="20"><rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor"/><path d="M5,11 Q5,18 12,18 Q19,18 19,11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12,18 L12,22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'+
        '</button>'+
        '<button class="vc-end-btn" onclick="endRoadsideCall()">End Call</button>'+
      '</div>'+
    '</div>';
  // Start call timer
  vcCallSeconds=0;
  vcCallTimer=setInterval(function(){
    vcCallSeconds++;
    var el=document.getElementById('vcTimer');
    if(el)el.textContent=formatCallTime(vcCallSeconds);
  },1000);
  // Agent greeting via TTS
  setTimeout(function(){
    addVoiceMsg('agent',AGENT_RESPONSES.greeting);
    speakAgent(AGENT_RESPONSES.greeting);
  },800);
}

function addVoiceMsg(who,text){
  var t=document.getElementById('vcTranscript');
  if(!t)return;
  var d=document.createElement('div');
  d.className='vc-msg '+who;
  d.innerHTML='<span class="vc-sender">'+(who==='agent'?'Agent Sarah':'You')+'</span>'+text;
  t.appendChild(d);
  t.scrollTop=t.scrollHeight;
}

function speakAgent(text){
  // Set wave to active
  var wave=document.getElementById('vcWave');
  if(wave)wave.classList.remove('idle');
  if(!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(text);
  u.rate=0.95;u.pitch=1.1;u.volume=0.9;
  var voices=speechSynthesis.getVoices();
  var v=voices.find(function(x){return x.name.indexOf('Samantha')>-1;})||
         voices.find(function(x){return x.name.indexOf('Karen')>-1;})||
         voices.find(function(x){return x.lang&&x.lang.startsWith('en')&&x.name.indexOf('Female')>-1;})||
         voices.find(function(x){return x.lang&&x.lang.startsWith('en');})||null;
  if(v)u.voice=v;
  u.onend=function(){if(wave)wave.classList.add('idle');};
  u.onerror=function(){if(wave)wave.classList.add('idle');};
  speechSynthesis.speak(u);
}

function toggleVoiceRec(){
  if(vcIsRecording){stopVoiceRec();return;}
  var SpeechRec=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SpeechRec){
    addVoiceMsg('user','[Speech recognition not supported — type in chat mode instead]');
    return;
  }
  vcRecognition=new SpeechRec();
  vcRecognition.continuous=false;
  vcRecognition.interimResults=false;
  vcRecognition.lang='en-US';
  vcRecognition.onresult=function(e){
    var text=e.results[0][0].transcript;
    addVoiceMsg('user',text);
    addLog('Said: '+text.substring(0,40),'good');
    // Agent responds after brief pause
    setTimeout(function(){
      var resp=getAgentResponse(text);
      addVoiceMsg('agent',resp);
      speakAgent(resp);
    },1200);
  };
  vcRecognition.onerror=function(e){
    stopVoiceRec();
    if(e.error!=='aborted')addVoiceMsg('user','[Could not hear you — try again]');
  };
  vcRecognition.onend=function(){stopVoiceRec();};
  vcRecognition.start();
  vcIsRecording=true;
  var btn=document.getElementById('vcMicBtn');
  if(btn)btn.classList.add('recording');
  var wave=document.getElementById('vcWave');
  if(wave)wave.classList.remove('idle');
}

function stopVoiceRec(){
  vcIsRecording=false;
  if(vcRecognition){try{vcRecognition.stop();}catch(e){}}
  vcRecognition=null;
  var btn=document.getElementById('vcMicBtn');
  if(btn)btn.classList.remove('recording');
  var wave=document.getElementById('vcWave');
  if(wave)wave.classList.add('idle');
}

function endRoadsideCall(){
  clearInterval(vcCallTimer);
  stopVoiceRec();
  if('speechSynthesis' in window)speechSynthesis.cancel();
  disconnectRoadside();
}

// ─── VIRTUAL CHAT ───
var chatMsgQueue=[];

function startVirtualChat(){
  var conn=document.getElementById('roadsideConnect');
  var inner=conn.querySelector('.rc-inner');
  if(!inner)return;
  inner.innerHTML=
    '<div class="chat-wrap">'+
      '<div class="chat-header">'+
        '<div class="chat-avatar"><svg viewBox="0 0 24 24" fill="#6a9882"><circle cx="12" cy="8" r="4"/><path d="M4,20 Q4,14 12,14 Q20,14 20,20"/></svg></div>'+
        '<div class="chat-agent-info"><span class="chat-agent-name">Sarah M. — State Farm</span><span class="chat-agent-status">Online · Roadside Assistance</span></div>'+
        '<button class="chat-end-btn" onclick="endChatSession()">End</button>'+
      '</div>'+
      '<div class="chat-messages" id="chatMessages"></div>'+
      '<div class="chat-input-bar">'+
        '<input class="chat-input" id="chatInput" type="text" placeholder="Type a message..." autocomplete="off" onkeydown="if(event.key===\'Enter\')sendChatMsg()">'+
        '<button class="chat-send-btn" onclick="sendChatMsg()"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M2,21 L23,12 L2,3 L2,10 L17,12 L2,14 Z" fill="currentColor"/></svg></button>'+
      '</div>'+
    '</div>';
  // Agent greeting
  setTimeout(function(){
    showTypingThenSend(AGENT_RESPONSES.greeting);
  },600);
}

function addChatBubble(who,text){
  var c=document.getElementById('chatMessages');
  if(!c)return;
  // Remove typing indicator if present
  var typing=c.querySelector('.chat-bubble.typing');
  if(typing)typing.remove();
  var d=document.createElement('div');
  d.className='chat-bubble '+who;
  d.textContent=text;
  c.appendChild(d);
  c.scrollTop=c.scrollHeight;
}

function showTypingIndicator(){
  var c=document.getElementById('chatMessages');
  if(!c)return;
  var d=document.createElement('div');
  d.className='chat-bubble typing';
  d.innerHTML='<div class="typing-dots"><span></span><span></span><span></span></div>';
  c.appendChild(d);
  c.scrollTop=c.scrollHeight;
}

function showTypingThenSend(text){
  showTypingIndicator();
  var delay=800+Math.min(text.length*18,2200);
  setTimeout(function(){addChatBubble('agent',text);},delay);
}

function sendChatMsg(){
  var inp=document.getElementById('chatInput');
  if(!inp)return;
  var text=inp.value.trim();
  if(!text)return;
  inp.value='';
  addChatBubble('user',text);
  addLog('Chat: '+text.substring(0,30),'good');
  // Agent responds
  setTimeout(function(){
    var resp=getAgentResponse(text);
    showTypingThenSend(resp);
  },400);
}

function endChatSession(){
  disconnectRoadside();
}
function disconnectRoadside(){
  // Clean up voice/chat state
  clearInterval(vcCallTimer);
  stopVoiceRec();
  if('speechSynthesis' in window)speechSynthesis.cancel();
  var conn=document.getElementById('roadsideConnect');
  var inner=conn.querySelector('.rc-inner');
  if(!inner)return;
  addLog('Disconnected from dispatch','warn');
  inner.innerHTML='<div class="rc-icon"><svg viewBox="0 0 48 48" width="56" height="56"><circle cx="24" cy="24" r="22" fill="rgba(212,168,67,0.08)" stroke="rgba(212,168,67,0.5)" stroke-width="2"/><path d="M24,12 L24,28" stroke="rgba(212,168,67,0.8)" stroke-width="2.5" stroke-linecap="round"/><circle cx="24" cy="34" r="2" fill="rgba(212,168,67,0.8)"/></svg></div>'+
    '<div class="rc-title" style="animation:none">DRIVE ENDED</div>'+
    '<div class="rc-sub">Your record has been archived</div>'+
    '<div style="margin-top:1.2rem">'+
      '<button class="rp-btn" onclick="roadsideContinue()" style="padding:0.6rem 1.4rem;font-size:0.65rem">Continue</button>'+
    '</div>';
}
function roadsideContinue(){
  document.getElementById('roadsideConnect').classList.remove('show');
  roadsideActive=false;simPaused=false;
  crashEndGame_noNav();
  showScreen('museum');showSummaryFirst();
}
function crashEndGame_noNav(){
  gameActive=false;clearInterval(simTimer);cancelAnimationFrame(gameAnim);
  document.removeEventListener('keydown',onKey);
  document.getElementById('phoneNotif').classList.remove('show');document.getElementById('brakeAlert').classList.remove('show');
  document.getElementById('crashDetect').classList.remove('show');document.getElementById('crashFullscreen').classList.remove('show');
  document.getElementById('roadsidePrompt').classList.remove('show');
  clearInterval(roadsideTimer);clearTimeout(nTimer);clearTimeout(bTimer);
  recalc();addLog('Drive ended by collision','bad');
  var run={score:S.score,phone:S.phone,brakes:S.brakes,hits:hitCount,safe:S.safe,arch:getArch(S.score).n,date:new Date().toISOString()};
  saveProfile(S.visitorName,run);stopVoice();
}

function dismissRoadside(){
  document.getElementById('roadsidePrompt').classList.remove('show');
  roadsideActive=false;simPaused=false;
  addLog('Roadside Assistance declined','warn');
  crashEndGame();
}

function crashEndGame(){
  // End game and skip drive-end modal, go straight to reckoning
  gameActive=false;clearInterval(simTimer);cancelAnimationFrame(gameAnim);
  document.removeEventListener('keydown',onKey);
  document.getElementById('phoneNotif').classList.remove('show');
  document.getElementById('brakeAlert').classList.remove('show');
  document.getElementById('crashDetect').classList.remove('show');
  document.getElementById('crashFullscreen').classList.remove('show');
  document.getElementById('roadsidePrompt').classList.remove('show');
  document.getElementById('roadsideConnect').classList.remove('show');
  clearInterval(roadsideTimer);clearTimeout(nTimer);clearTimeout(bTimer);
  recalc();addLog('Drive ended by collision','bad');
  var run={score:S.score,phone:S.phone,brakes:S.brakes,hits:hitCount,safe:S.safe,arch:getArch(S.score).n,date:new Date().toISOString()};
  saveProfile(S.visitorName,run);
  stopVoice();
  // Go straight to reckoning — no modal
  setTimeout(function(){
    showScreen('museum');showSummaryFirst();
  },300);
}

function resumeSim(){
  if(!simPaused||roadsideActive){};
  gameActive=true;
  simTimer=setInterval(function(){S.simElapsed++;updateTimer();if(S.simElapsed>=S.simDuration)endGame();},1000);
  gameAnim=requestAnimationFrame(renderFrame);
}

// ─── DIGITAL CLAIMS: Photo Estimate ───
var CLAIM_DETECTIONS=[
  {damage:'Front bumper dent with paint transfer',part:'Front Bumper',base:650,mult:1.0},
  {damage:'Cracked headlight assembly — left side',part:'Headlight',base:420,mult:0.9},
  {damage:'Rear quarter panel scratch and scuff marks',part:'Rear Panel',base:380,mult:0.8},
  {damage:'Side mirror housing cracked',part:'Side Mirror',base:280,mult:0.6},
  {damage:'Windshield chip with spreading fracture line',part:'Windshield',base:520,mult:1.1},
  {damage:'Door panel dent — passenger side',part:'Door Panel',base:780,mult:1.2},
  {damage:'Rear bumper deformation with bracket damage',part:'Rear Bumper',base:900,mult:1.3},
  {damage:'Hood crease with paint separation',part:'Hood',base:1100,mult:1.5},
  {damage:'Fender crush — driver side front',part:'Fender',base:1350,mult:1.6},
  {damage:'Taillight assembly shattered',part:'Taillight',base:340,mult:0.7},
  {damage:'Grille impact — multiple slats broken',part:'Front Grille',base:560,mult:1.0},
  {damage:'Trunk lid misalignment from rear impact',part:'Trunk',base:1600,mult:1.8},
  {damage:'Wheel rim curb damage and tire sidewall scuff',part:'Wheel/Tire',base:450,mult:0.85},
  {damage:'A-pillar stress crack near windshield join',part:'A-Pillar',base:1800,mult:2.0},
  {damage:'Bumper cover detachment — clips broken',part:'Bumper Cover',base:480,mult:0.9}
];

function processClaimPhoto(input){
  if(!input.files||!input.files[0])return;
  var file=input.files[0];
  var reader=new FileReader();
  reader.onload=function(e){
    var el=document.getElementById('claimResult');if(!el)return;
    el.style.display='block';

    // Pick 2-3 random detections
    var shuffled=CLAIM_DETECTIONS.slice().sort(function(){return Math.random()-0.5;});
    var numDetections=2+Math.floor(Math.random()*2); // 2 or 3
    var detections=shuffled.slice(0,numDetections);

    // Risk multiplier from driving data
    var riskMult=1.0;
    riskMult+=S.quizBase*0.008;          // quiz risk adds up to ~0.5x
    riskMult+=S.phone*0.15;              // each phone distraction +15%
    riskMult+=S.brakes*0.1;              // each late brake +10%
    riskMult+=hitCount*0.2;              // each collision +20%
    riskMult-=S.safe*0.03;              // safe actions reduce slightly
    if(riskMult<0.6)riskMult=0.6;
    if(riskMult>3.0)riskMult=3.0;

    // Calculate total estimate
    var totalLow=0,totalHigh=0;
    detections.forEach(function(d){
      var low=Math.round(d.base*d.mult*riskMult*(0.85+Math.random()*0.15));
      var high=Math.round(low*(1.3+Math.random()*0.3));
      d._low=low;d._high=high;
      totalLow+=low;totalHigh+=high;
    });

    var severity=totalLow>3000?'Severe':totalLow>1500?'Major':totalLow>700?'Moderate':'Minor';
    var severityColor=totalLow>3000?'#b07070':totalLow>1500?'#c49040':totalLow>700?'#b48c50':'#6a9882';

    var html='<div class="claim-preview"><img src="'+e.target.result+'" alt="Damage photo"/></div>';
    html+='<div class="claim-estimate">';
    html+='<div class="claim-est-label">AI Damage Analysis</div>';

    // Individual detections
    detections.forEach(function(d){
      html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid rgba(212,168,67,0.04);font-family:\'DM Mono\',monospace;font-size:0.55rem;color:var(--text-muted)">';
      html+='<span style="flex:1">'+d.damage+'</span>';
      html+='<span style="color:var(--gold);font-weight:bold;margin-left:12px">$'+d._low.toLocaleString()+' \u2013 $'+d._high.toLocaleString()+'</span>';
      html+='</div>';
    });

    html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 4px;border-top:1px solid var(--border2);margin-top:6px;font-family:\'DM Mono\',monospace;font-size:0.6rem;color:var(--gold)">';
    html+='<span>Total Estimate</span>';
    html+='<span style="font-family:\'Cinzel\',serif;font-size:1.2rem">$'+totalLow.toLocaleString()+' \u2013 $'+totalHigh.toLocaleString()+'</span>';
    html+='</div>';

    html+='<div class="claim-est-severity">Severity: <strong style="color:'+severityColor+'">'+severity+'</strong>';
    if(S.phone>0)html+=' &middot; Distraction risk factor applied';
    if(hitCount>0)html+=' &middot; Collision history noted';
    html+='</div>';

    html+='<div class="claim-tracker"><div class="claim-tracker-title">Claim Status</div>';
    html+='<div class="ct-step"><span class="ct-dot good"></span><span class="ct-label">Photo received &amp; analyzed</span></div>';
    html+='<div class="ct-step"><span class="ct-dot good"></span><span class="ct-label">'+numDetections+' damage areas detected</span></div>';
    html+='<div class="ct-step"><span class="ct-dot good"></span><span class="ct-label">Estimate generated</span></div>';
    html+='<div class="ct-step"><span class="ct-dot"></span><span class="ct-label">Agent review pending</span></div>';
    html+='<div class="ct-step"><span class="ct-dot"></span><span class="ct-label">Payout approved</span></div>';
    html+='</div>';
    html+='<div class="rec-sf">State Farm digital claims \u2014 file, track, and resolve from your phone.</div>';
    html+='</div>';
    el.innerHTML=html;
  };
  reader.readAsDataURL(file);
}

function recalc(){var raw=S.brakes*10+S.phone*18+hitCount*8-S.safe*4;S.score=Math.max(0,Math.min(100,Math.round(S.quizBase+12+Math.max(0,raw))));}
function updateTimer(){var rem=Math.max(0,S.simDuration-S.simElapsed),m=Math.floor(rem/60),s=rem%60;document.getElementById('simTimerDisplay').textContent=m+':'+(s<10?'0':'')+s;}
function updateStats(){
  document.getElementById('simRiskVal').textContent=S.score;
  var arc=document.getElementById('simRiskArc');if(arc){arc.style.strokeDashoffset=314-(S.score/100*314);arc.style.stroke=S.score>65?'#8b1a2a':S.score>38?'#7a4a1e':'#2a4a3a';}
  document.getElementById('simPhoneVal').textContent=S.phone;document.getElementById('simBrakeVal').textContent=S.brakes;document.getElementById('simSafeVal').textContent=S.safe;
}
function addLog(msg,cls){logItems.unshift({m:msg,c:cls||''});if(logItems.length>8)logItems.pop();var el=document.getElementById('simLog');if(!el)return;el.innerHTML=logItems.map(function(e){return '<div class="log-item '+e.c+'">'+e.m+'</div>';}).join('');}

// ═══════════════════════════════
// CORRIDOR RENDERING
// ═══════════════════════════════
function lerp(a,b,t){return a+(b-a)*t;}

function renderFrame(){
  if(!Gctx){if(gameActive)gameAnim=requestAnimationFrame(renderFrame);return;}
  var ctx=Gctx,W=GW,H=GH;ctx.save();ctx.scale(Gdpr,Gdpr);ctx.clearRect(0,0,W,H);
  playerX+=(targetX-playerX)*0.1;playerX=Math.max(-1,Math.min(1,playerX));
  if(gameActive)gameScroll+=0.15+simSpeed*0.005;
  var VX=W/2+playerX*-15,VY=H*0.32,cTW=0.1,cBW=0.82;

  // --- SKY / CEILING (deep midnight blue) ---
  var cg=ctx.createLinearGradient(0,0,0,VY);cg.addColorStop(0,'#040810');cg.addColorStop(0.4,'#081428');cg.addColorStop(0.8,'#0c1a35');cg.addColorStop(1,'#0e1e3a');ctx.fillStyle=cg;ctx.fillRect(0,0,W,VY);
  // ceiling beams (gold trim)
  for(var b=0;b<6;b++){var bt=((b*0.2+gameScroll*0.008)%1.2)-0.1;if(bt<0.02||bt>0.95)continue;var a=0.05+bt*0.08;ctx.strokeStyle='rgba(180,140,50,'+a+')';ctx.lineWidth=0.5+bt*2;ctx.beginPath();ctx.moveTo(0,VY*bt);ctx.lineTo(W,VY*bt);ctx.stroke();}
  // starry specks on ceiling
  for(var si=0;si<8;si++){var sx2=((si*37+gameScroll*0.3)%W),sy2=(si*19+gameScroll*0.1)%(VY*0.8);var sa=0.2+Math.sin(gameScroll*0.05+si)*0.15;ctx.fillStyle='rgba(255,220,120,'+sa+')';ctx.beginPath();ctx.arc(sx2,sy2,0.5+Math.random()*0.5,0,Math.PI*2);ctx.fill();}

  // --- FLOOR (dark marble blue) ---
  var fg=ctx.createLinearGradient(0,VY,0,H);fg.addColorStop(0,'#0a1225');fg.addColorStop(0.5,'#0c1830');fg.addColorStop(1,'#0e1e38');ctx.fillStyle=fg;ctx.fillRect(0,VY,W,H);

  var wlt=VX-W*cTW/2,wrt=VX+W*cTW/2,wlb=W/2-W*cBW/2,wrb=W/2+W*cBW/2;

  // --- WALLS (deep museum blue) ---
  var wg=ctx.createLinearGradient(0,VY,0,H);wg.addColorStop(0,'#081020');wg.addColorStop(1,'#0c1830');
  ctx.fillStyle=wg;
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(wlt,VY);ctx.lineTo(wlb,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(W,0);ctx.lineTo(wrt,VY);ctx.lineTo(wrb,H);ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  // wall edges (gold trim)
  ctx.strokeStyle='rgba(180,140,50,0.3)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(wlt,VY);ctx.lineTo(wlb,H);ctx.stroke();
  ctx.beginPath();ctx.moveTo(wrt,VY);ctx.lineTo(wrb,H);ctx.stroke();
  // wall molding (gold)
  ctx.strokeStyle='rgba(180,140,50,0.1)';ctx.lineWidth=0.7;
  for(var m=0;m<3;m++){var mt=0.3+m*0.2;ctx.beginPath();ctx.moveTo(lerp(0,wlb,mt),lerp(0,H,mt));ctx.lineTo(lerp(wlt,wlb,mt),lerp(VY,H,mt));ctx.stroke();ctx.beginPath();ctx.moveTo(lerp(W,wrb,mt),lerp(0,H,mt));ctx.lineTo(lerp(wrt,wrb,mt),lerp(VY,H,mt));ctx.stroke();}

  // --- FLOOR TILES (blue marble with gold grout) ---
  for(var i=1;i<20;i++){var ft=i/20,py=VY+(H-VY)*Math.pow(ft,0.6);var lx=lerp(wlt,wlb,ft),rx=lerp(wrt,wrb,ft);ctx.strokeStyle='rgba(180,140,50,'+(0.03+ft*0.1)+')';ctx.lineWidth=0.4+ft*1.2;ctx.beginPath();ctx.moveTo(lx,py);ctx.lineTo(rx,py);ctx.stroke();}
  // center line gold
  for(var d=0;d<20;d++){var dt=((d*0.06-gameScroll*0.012)%1.2);if(dt<0)dt+=1.2;if(dt>1)continue;var dy=VY+(H-VY)*Math.pow(dt,0.6);var dw=0.6+dt*3.5,dh=1+dt*8;ctx.fillStyle='rgba(232,184,74,'+(0.05+dt*0.2)+')';ctx.fillRect(lerp(VX,(wlb+wrb)/2,dt)-dw/2,dy,dw,dh);}

  // --- TORCH GLOW (warm amber on blue walls) ---
  for(var ti=0;ti<4;ti++){
    var tt=((ti*0.28+gameScroll*0.008)%1.15)-0.05;if(tt<0.06||tt>0.88)continue;
    var ty=VY+(H-VY)*Math.pow(tt,0.6);
    var tSize=5+tt*24;var ta=0.1+tt*0.25;
    var flicker=1+Math.sin(gameScroll*0.3+ti*2)*0.15;
    // Left wall torch
    var tlx=lerp(wlt,wlb,tt);
    var tgl=ctx.createRadialGradient(tlx+tSize*0.3,ty,0,tlx+tSize*0.3,ty,tSize*3);
    tgl.addColorStop(0,'rgba(255,180,60,'+(ta*flicker)+')');tgl.addColorStop(0.3,'rgba(220,150,40,'+(ta*0.4*flicker)+')');tgl.addColorStop(1,'transparent');
    ctx.fillStyle=tgl;ctx.fillRect(tlx-tSize,ty-tSize*2.5,tSize*5,tSize*5);
    ctx.fillStyle='rgba(255,210,90,'+(ta*1.5*flicker)+')';ctx.beginPath();ctx.arc(tlx+1,ty-tSize*0.15,1+tt*2.5,0,Math.PI*2);ctx.fill();
    // Right wall torch
    var trx=lerp(wrt,wrb,tt);
    var tgr=ctx.createRadialGradient(trx-tSize*0.3,ty,0,trx-tSize*0.3,ty,tSize*3);
    tgr.addColorStop(0,'rgba(255,180,60,'+(ta*flicker)+')');tgr.addColorStop(0.3,'rgba(220,150,40,'+(ta*0.4*flicker)+')');tgr.addColorStop(1,'transparent');
    ctx.fillStyle=tgr;ctx.fillRect(trx-tSize*4,ty-tSize*2.5,tSize*5,tSize*5);
    ctx.fillStyle='rgba(255,210,90,'+(ta*1.5*flicker)+')';ctx.beginPath();ctx.arc(trx-1,ty-tSize*0.15,1+tt*2.5,0,Math.PI*2);ctx.fill();
  }

  // --- PAINTINGS on walls (deep frames) ---
  for(var p=0;p<4;p++){
    var pt=((p*0.27+gameScroll*0.008)%1.15)-0.08;if(pt<0.06||pt>0.85)continue;
    var py2=VY+(H-VY)*Math.pow(pt,0.6),sz=4+pt*30,szH=sz*0.7;
    // Left - deep navy with gold frame
    var plx=lerp(wlt,wlb,pt);ctx.fillStyle='rgba(8,16,35,'+(0.3+pt*0.5)+')';ctx.fillRect(plx-sz*0.1,py2-szH/2,sz*0.55,szH);
    ctx.strokeStyle='rgba(180,140,50,'+(0.15+pt*0.35)+')';ctx.lineWidth=0.8+pt*2;ctx.strokeRect(plx-sz*0.1,py2-szH/2,sz*0.55,szH);
    // Right - same treatment
    var prx=lerp(wrt,wrb,pt);ctx.fillStyle='rgba(8,16,35,'+(0.25+pt*0.45)+')';ctx.fillRect(prx-sz*0.45,py2-szH/2,sz*0.55,szH);
    ctx.strokeStyle='rgba(180,140,50,'+(0.15+pt*0.35)+')';ctx.strokeRect(prx-sz*0.45,py2-szH/2,sz*0.55,szH);
  }

  // --- OBSTACLES (artifact images) ---
  obstacles.forEach(function(o){
    if(!o.active)return;if(gameActive)o.z+=o.speed;
    if(o.z>1.05){o.active=false;return;}
    if(o.z>0.78&&!o.hit){var pl=playerX>0.33?1:playerX<-0.33?-1:0;if(o.lane===pl){o.hit=true;hitCount++;addLog('Collision!','bad');showCrashAlert();recalc();updateStats();}else{o.hit=true;dodgeCount++;}}
    drawObs(ctx,o,VX,VY,W,H,wlt,wlb,wrt,wrb);
  });

  // --- VANISHING POINT GLOW (warm amber) ---
  var vpg=ctx.createRadialGradient(VX,VY,0,VX,VY,W*0.18);vpg.addColorStop(0,'rgba(255,180,60,0.06)');vpg.addColorStop(0.5,'rgba(180,140,50,0.02)');vpg.addColorStop(1,'transparent');ctx.fillStyle=vpg;ctx.beginPath();ctx.arc(VX,VY,W*0.18,0,Math.PI*2);ctx.fill();

  // --- PLAYER (gold arrow) ---
  var px=W/2+playerX*W*0.24;
  ctx.fillStyle='rgba(232,184,74,0.65)';ctx.beginPath();ctx.moveTo(px,H-16);ctx.lineTo(px-12,H-5);ctx.lineTo(px+12,H-5);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(232,184,74,0.35)';ctx.lineWidth=1;ctx.stroke();
  // speed lines
  if(simSpeed>50){var slA=(simSpeed-50)/100*0.15;for(var sl=0;sl<3;sl++){ctx.strokeStyle='rgba(232,184,74,'+slA+')';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(px-20-sl*8,H-20+sl*4);ctx.lineTo(px-30-sl*10,H-10+sl*3);ctx.stroke();ctx.beginPath();ctx.moveTo(px+20+sl*8,H-20+sl*4);ctx.lineTo(px+30+sl*10,H-10+sl*3);ctx.stroke();}}

  // --- HUD (minimal — timer only) ---
  var hudGrad=ctx.createLinearGradient(0,0,0,26);hudGrad.addColorStop(0,'rgba(4,8,16,0.7)');hudGrad.addColorStop(1,'rgba(4,8,16,0.3)');ctx.fillStyle=hudGrad;ctx.fillRect(0,0,W,26);
  ctx.font='bold 9px "DM Mono",monospace';ctx.fillStyle='rgba(232,184,74,0.85)';
  ctx.textAlign='center';ctx.fillText(Math.max(0,S.simDuration-S.simElapsed)+'s',W/2,16);
  ctx.fillStyle='rgba(232,184,74,0.25)';ctx.textAlign='center';ctx.font='7px "DM Mono",monospace';
  ctx.fillText('< ARROW KEYS >',W/2,H-4);

  ctx.restore();
  if(gameActive)gameAnim=requestAnimationFrame(renderFrame);
}

function drawObs(ctx,o,VX,VY,W,H,wlt,wlb,wrt,wrb){
  var t=Math.pow(o.z,0.6),y=VY+(H-VY)*t;var lx=lerp(wlt,wlb,o.z),rx=lerp(wrt,wrb,o.z);
  var cx=lerp(lx,rx,0.5+o.lane*0.3),sz=5+o.z*75,a=0.2+o.z*0.8;
  // warm glow behind artifact
  if(o.z>0.15){var ag=ctx.createRadialGradient(cx,y-sz*0.3,0,cx,y-sz*0.3,sz*1.2);ag.addColorStop(0,'rgba(255,180,60,'+(0.02+o.z*0.08)+')');ag.addColorStop(0.5,'rgba(200,140,30,'+(0.01+o.z*0.03)+')');ag.addColorStop(1,'transparent');ctx.fillStyle=ag;ctx.beginPath();ctx.arc(cx,y-sz*0.3,sz*1.2,0,Math.PI*2);ctx.fill();}
  // danger glow when close
  if(o.z>0.6){var dg=ctx.createRadialGradient(cx,y-sz*0.2,0,cx,y-sz*0.2,sz*0.9);dg.addColorStop(0,'rgba(200,50,40,'+(0.04+o.z*0.15)+')');dg.addColorStop(1,'transparent');ctx.fillStyle=dg;ctx.beginPath();ctx.arc(cx,y-sz*0.2,sz*0.9,0,Math.PI*2);ctx.fill();}
  // Draw artifact image if loaded
  var imgIdx=o.imgIdx!==undefined?o.imgIdx:0;
  var img=artifactImgs[imgIdx];
  if(img&&img.complete&&img.naturalWidth>0){
    var iw=sz*0.8,ih=sz*0.8;
    ctx.globalAlpha=Math.min(1,a);
    ctx.drawImage(img,cx-iw/2,y-ih*0.8,iw,ih);
    ctx.globalAlpha=1;
  }else{
    // Fallback: gold silhouette
    ctx.fillStyle='rgba(232,184,74,'+a*0.4+')';ctx.beginPath();ctx.ellipse(cx,y-sz*0.3,sz*0.2,sz*0.35,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(180,140,50,'+a*0.25+')';ctx.fillRect(cx-sz*0.3,y-sz*0.02,sz*0.6,sz*0.15);
  }
  // label
  if(o.z>0.35&&o.z<0.85){ctx.font=(7+o.z*5)+'px "DM Mono",monospace';ctx.textAlign='center';ctx.fillStyle='rgba(232,184,74,'+(a*0.5)+')';var lbl={statue:'ARTIFACT',painting:'RELIC',vase:'TREASURE'};ctx.fillText(lbl[o.kind]||'ARTIFACT',cx,y+sz*0.3);}
}

// ═══════════════════════════════
// PERSONAL MUSEUM
// ═══════════════════════════════
var mArts=[],mIdx=0;

function buildMuseum(){
  stopVoice();document.getElementById('museumTitle').textContent=S.visitorName+"'s Museum";
  mArts=[];mIdx=0;var r=S.score,arch=getArch(r);

  mArts.push({type:'tablet',name:"The Golden Coin of Record",desc:'Risk index: '+r+'/100. '+(r<20?'An exemplary record, etched in pristine stone — a rare artifact in this archive.':r<40?'A moderate record. The stone bears few marks, but refinement remains possible.':r<65?'Amber warnings mark this tablet. Elevated risk signals demand your attention.':'Deep scars line this tablet. A record that demands immediate correction.'),stat:HIST_STATS.general,pos:r<40});

  if(S.phone===0)mArts.push({type:'lens',name:'The Jeweled Eye of Focus',desc:'Zero phone distractions. Your focus never wavered from the road. This is the rarest artifact in the archive — most visitors never earn it.',stat:HIST_STATS.phone,pos:true});
  else mArts.push({type:'mirror',name:'The Tarnished Jewels of Vanity',desc:S.phone+' phone distraction'+(S.phone>1?'s':'')+' recorded. Each glance fractured this mirror and your safety record. At highway speed, 5 seconds of distraction covers a football field blind.',stat:HIST_STATS.phone,pos:false});

  if(S.brakes===0)mArts.push({type:'shield',name:'The Guardian\'s Helm',desc:'Every brake event met with precision timing. This shield held firm — your reflexes protected you and everyone around you.',stat:HIST_STATS.brake,pos:true});
  else mArts.push({type:'shield_worn',name:'The Cracked Bangle',desc:S.brakes+' late braking event'+(S.brakes>1?'s':'')+'. Delayed reactions left dents in this ancient shield. Faster reflexes could prevent the crashes behind these marks.',stat:HIST_STATS.brake,pos:false});

  if(hitCount===0)mArts.push({type:'vase',name:'The Azure Vessel',desc:'Every obstacle in the corridor dodged with precision. This vessel stands untouched — a testament to your spatial awareness and composure under pressure.',stat:HIST_STATS.dodge,pos:true});
  else mArts.push({type:'vase_broken',name:'The Fallen Bird',desc:hitCount+' collision'+(hitCount>1?'s':'')+' recorded. The fragments speak of moments where awareness lapsed. On real roads, these fragments become consequences.',stat:HIST_STATS.dodge,pos:false});

  mArts.push({type:'statue',name:arch.n,desc:'Your driving archetype, cast in bronze. '+(r<30?'A figure of discipline and calm — the kind of driver who makes every road safer for everyone.':r<55?'A figure caught between vigilance and impulse. The potential for excellence exists, but habits need refinement.':'A figure whose shadow falls heavy on the road. Significant behavioral change is needed.'),stat:HIST_STATS.safe,pos:r<40});

  var disc=r<20?30:r<35?20:r<50?10:r<65?5:0;
  mArts.push({type:'scroll',name:"The Curator's Staff",desc:'State Farm Drive Safe & Save recommendation: up to '+disc+'% discount potential. '+(disc>=20?'Your record qualifies for significant savings. Like a good neighbor, State Farm rewards drivers like you.':'Improve your habits to unlock greater savings. Every safe mile brings you closer.'),stat:'State Farm\'s mission: Help people manage the risks of everyday life, recover from the unexpected, and realize their dreams.',pos:disc>=15});

  showArt(0);
}

// Map artifact types to image indices — each type gets a UNIQUE image
// 0=bangle, 1=blue-vase, 2=gold-bird, 3=gold-bust, 4=gold-coin, 5=gold-statue, 6=helmet, 7=jewelry, 8=jewelry-plush, 9=staff
var ART_IMG_MAP={tablet:4,lens:7,mirror:8,shield:6,shield_worn:0,vase:1,vase_broken:2,statue:5,scroll:9};
// tablet=gold-coin, lens=jewelry, mirror=jewelry-plush, shield=helmet, shield_worn=bangle, vase=blue-vase, vase_broken=gold-bird, statue=gold-statue, scroll=staff

function showArt(idx){
  mIdx=idx;var a=mArts[idx];
  var svgEl=document.getElementById('artifactSVG'),nameEl=document.getElementById('exName'),descEl=document.getElementById('exDesc'),numEl=document.getElementById('exNum'),statEl=document.getElementById('exStat'),verdEl=document.getElementById('exVerdict'),cntEl=document.getElementById('artCounter');
  svgEl.style.opacity='0';svgEl.style.transform='translateY(14px)';nameEl.style.opacity='0';descEl.style.opacity='0';
  setTimeout(function(){
    // Use real artifact image
    var imgIdx=ART_IMG_MAP[a.type]!==undefined?ART_IMG_MAP[a.type]:(idx%artifactImgs.length);
    var imgSrc=ARTIFACT_IMAGES[imgIdx]||ARTIFACT_IMAGES[0];
    svgEl.innerHTML='<img src="'+imgSrc+'" class="art-image" alt="'+a.name+'">';
    nameEl.textContent=a.name;descEl.textContent=a.desc;
    numEl.textContent=['I','II','III','IV','V','VI'][idx]||'';
    statEl.textContent=a.stat||'';
    verdEl.textContent=a.pos?'Favorable Signal':'Risk Signal';verdEl.className='ex-verdict '+(a.pos?'pos':'neg');
    cntEl.textContent=(idx+1)+' of '+mArts.length;
    document.getElementById('prevArt').style.visibility=idx===0?'hidden':'visible';
    document.getElementById('nextArt').textContent=idx===mArts.length-1?'Start Over':'Next';
    svgEl.style.opacity='1';svgEl.style.transform='translateY(0)';nameEl.style.opacity='1';descEl.style.opacity='1';
    sfxReveal();narrate(a.name);
  },300);
}
function nextArt(){if(mIdx>=mArts.length-1){fullReset();return;}showArt(mIdx+1);}
function prevArt(){if(mIdx<=0)return;showArt(mIdx-1);}

function showSummaryFirst(){
  // Show reckoning/summary FIRST, museum tour comes after
  document.getElementById('tourSection').style.display='none';
  document.getElementById('summarySection').style.display='block';
  showSummary();
}
function goToMuseumTour(){
  // Transition from reckoning to museum tour
  document.getElementById('summarySection').style.display='none';
  document.getElementById('tourSection').style.display='';
  buildMuseum();
}

async function showSummary(){
  document.getElementById('museumTitle').textContent=S.visitorName+"'s Reckoning";
  var r=S.score,disc=r<20?30:r<35?20:r<50?10:r<65?5:0,pot=Math.round(disc*6.5);
  var topRisk=S.phone>0?'Phone distraction':S.brakes>0?'Late braking':hitCount>0?'Obstacle collisions':'Low risk overall';

  // Score breakdown
  var bd=[];
  bd.push({label:'Survey Baseline',val:S.quizBase,sign:S.quizBase>=0?'+':''});
  bd.push({label:'Base Adjustment',val:12,sign:'+'});
  if(S.phone>0)bd.push({label:'Phone Distractions ('+S.phone+')',val:S.phone*18,sign:'+'});
  if(S.brakes>0)bd.push({label:'Late Braking ('+S.brakes+')',val:S.brakes*10,sign:'+'});
  if(hitCount>0)bd.push({label:'Collisions ('+hitCount+')',val:hitCount*8,sign:'+'});
  if(S.safe>0)bd.push({label:'Safe Actions ('+S.safe+')',val:S.safe*4,sign:'-'});

  var archData=getArch(r);
  var archImgSrc=ARTIFACT_IMAGES[archData.img]||ARTIFACT_IMAGES[0];
  var h='<div class="sum-header">';
  h+='<div class="sum-eyebrow">Good Neighbor Safety Score</div>';
  h+='<div class="sum-score-ring"><svg viewBox="0 0 120 120" width="120" height="120"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(212,168,67,0.06)" stroke-width="8"/><circle cx="60" cy="60" r="50" fill="none" stroke="'+(r>65?'#8b1a2a':r>38?'#7a4a1e':'#2a4a3a')+'" stroke-width="8" stroke-dasharray="314" stroke-dashoffset="'+(314-r/100*314)+'" stroke-linecap="round" style="transform:rotate(-90deg);transform-origin:center"/></svg><div class="sum-score-num">'+r+'<span>/100</span></div></div>';
  h+='<div class="sum-arch">'+archData.n+'</div></div>';

  // Breakdown + archetype image side by side
  h+='<div class="sum-breakdown-row">';
  h+='<div class="sum-section"><div class="sum-section-title">Score Transparency</div><div class="sum-section-sub">What raised and lowered your score</div>';
  bd.forEach(function(b){h+='<div class="bd-row"><span class="bd-label">'+b.label+'</span><span class="bd-val '+(b.sign==='+'?'up':'down')+'">'+b.sign+b.val+'</span></div>';});
  h+='<div class="bd-row total"><span class="bd-label">Final Score</span><span class="bd-val">'+r+' / 100</span></div></div>';
  h+='<div class="sum-arch-panel"><img src="'+archImgSrc+'" alt="'+archData.n+'" class="sum-arch-img"></div>';
  h+='</div>';

  // AI Assessment
  h+='<div class="sum-section ai-section"><div class="sum-section-title">The Curator\'s Assessment</div><div id="aiText" class="ai-text loading">Analyzing your profile...</div></div>';

  // Recommendations
  h+='<div class="sum-section"><div class="sum-section-title">Safety Prescriptions</div><div class="sum-section-sub">Personalized for your risk profile</div>';
  var shown={};
  if(S.phone>0&&!shown.phone){shown.phone=1;var rc=RECS[0];h+='<div class="rec-card"><div class="rec-title">'+rc.title+'</div><div class="rec-desc">'+rc.desc+'</div><div class="rec-sf">'+rc.sf+'</div></div>';}
  if(S.brakes>0&&!shown.brake){shown.brake=1;var rc2=RECS[1];h+='<div class="rec-card"><div class="rec-title">'+rc2.title+'</div><div class="rec-desc">'+rc2.desc+'</div><div class="rec-sf">'+rc2.sf+'</div></div>';}
  if(hitCount>0){var rc3=RECS[2];h+='<div class="rec-card"><div class="rec-title">'+rc3.title+'</div><div class="rec-desc">'+rc3.desc+'</div><div class="rec-sf">'+rc3.sf+'</div></div>';}
  var rc4=RECS[3];h+='<div class="rec-card"><div class="rec-title">'+rc4.title+'</div><div class="rec-desc">'+rc4.desc+'</div><div class="rec-sf">'+rc4.sf+'</div></div>';
  h+='</div>';

  // Progress over time
  var prof=getProfile(S.visitorName);
  if(prof&&prof.runs.length>1){
    h+='<div class="sum-section"><div class="sum-section-title">Your Progress</div><div class="sum-section-sub">Score history across '+prof.runs.length+' visits</div>';
    h+=buildProgressChart(prof.runs);
    var prev=prof.runs[prof.runs.length-2],cur=prof.runs[prof.runs.length-1];
    var diff=cur.score-prev.score;
    if(diff<0)h+='<div class="progress-msg good">Score improved by '+Math.abs(diff)+' points since last visit</div>';
    else if(diff>0)h+='<div class="progress-msg bad">Score increased by '+diff+' points — more risk detected</div>';
    else h+='<div class="progress-msg">Same score as last visit — consistency noted</div>';
    h+='<div class="progress-best">Personal Best: '+prof.best+'/100</div>';
    h+='</div>';
  }

  // Goal check (returning users)
  var goalResult=checkGoalAchieved();
  if(goalResult){
    h+='<div class="sum-section goal-result-section"><div class="sum-section-title">Goal Status</div>';
    h+='<div class="goal-result '+(goalResult.achieved?'achieved':'missed')+'">';
    h+='<span class="goal-result-icon">'+(goalResult.achieved?'&#10003;':'&#10007;')+'</span>';
    h+='<span class="goal-result-text">'+(goalResult.achieved?'Goal achieved: ':'Goal not met: ')+goalResult.label+'</span>';
    h+='</div></div>';
  }

  // Weather recommendation (always show if data available)
  if(weatherData){
    h+='<div class="sum-section"><div class="sum-section-title">Weather Advisory</div><div class="sum-section-sub">Real-time conditions at your location</div>';
    h+='<div class="wx-summary"><span class="wx-summary-temp">'+weatherData.temp+'°F · '+weatherData.desc+' · Wind '+weatherData.wind+' mph</span><div class="wx-summary-hazard">'+weatherData.hazard+'</div>';
    h+='<div class="rec-sf">State Farm recommends adjusting your driving habits to match current weather conditions.</div></div></div>';
  }

  // Set a goal
  h+='<div class="sum-section"><div class="sum-section-title">Set Your Next Goal</div><div class="sum-section-sub">Choose a target for your next visit</div><div class="goal-options">';
  var curGoal=getActiveGoal(S.visitorName);
  GOALS.forEach(function(g){
    h+='<button class="goal-opt'+(curGoal===g.id?' selected':'')+'" data-goal="'+g.id+'" onclick="saveGoal(\''+g.id+'\')">'+g.label+'</button>';
  });
  h+='</div><div class="goal-confirm" id="goalConfirm" style="display:none"></div></div>';

  // ── STATE FARM SERVICES HUB ──
  h+='<div class="sf-hub"><div class="sf-hub-header"><div class="sf-hub-brand">State Farm</div><div class="sf-hub-tagline">Like a Good Neighbor</div></div>';

  // 1) Crash Detection / Roadside Assistance
  h+='<div class="sf-service"><div class="sf-service-icon"><svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="16" r="14" fill="none" stroke="'+(hitCount>0?'#b07070':'#6a9882')+'" stroke-width="1.5"/><path d="M16,8 L16,18" stroke="'+(hitCount>0?'#b07070':'#6a9882')+'" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="23" r="1.5" fill="'+(hitCount>0?'#b07070':'#6a9882')+'"/></svg></div>';
  h+='<div class="sf-service-body"><div class="sf-service-title">Crash Detection & Roadside Assistance</div>';
  if(hitCount>0){
    h+='<div class="sf-service-status alert">'+hitCount+' impact'+(hitCount>1?'s':'')+' detected during your drive</div>';
    h+='<div class="sf-service-detail">State Farm\'s app detects crashes via your phone\'s accelerometer and automatically contacts 911. Roadside assistance is available 24/7 with one tap.</div>';
    h+='<div class="sf-service-demo"><div class="crash-timeline"><div class="ct-step"><span class="ct-dot alert"></span><span class="ct-label">Impact detected</span></div><div class="ct-line"></div><div class="ct-step"><span class="ct-dot"></span><span class="ct-label">Location shared</span></div><div class="ct-line"></div><div class="ct-step"><span class="ct-dot"></span><span class="ct-label">911 notified</span></div><div class="ct-line"></div><div class="ct-step"><span class="ct-dot good"></span><span class="ct-label">Help dispatched</span></div></div></div>';
  }else{
    h+='<div class="sf-service-status good">No impacts detected — clean drive</div>';
    h+='<div class="sf-service-detail">State Farm\'s crash detection monitors for sudden impacts and automatically dispatches help when needed. Your clean record means you\'re doing it right.</div>';
  }
  h+='</div></div>';

  // 2) Digital Claims / Photo Estimate
  h+='<div class="sf-service"><div class="sf-service-icon"><svg viewBox="0 0 32 32" width="28" height="28"><rect x="4" y="7" width="24" height="18" rx="2" fill="none" stroke="#b48c50" stroke-width="1.5"/><circle cx="16" cy="16" r="5" fill="none" stroke="#b48c50" stroke-width="1.2"/><circle cx="16" cy="16" r="1.5" fill="#b48c50"/><circle cx="24" cy="10" r="1.5" fill="#b48c50" opacity="0.5"/></svg></div>';
  h+='<div class="sf-service-body"><div class="sf-service-title">Digital Claims & Photo Estimate</div>';
  h+='<div class="sf-service-detail">Upload a photo of vehicle damage and receive an instant AI-powered estimate. Track your claim status in real-time, all from your phone.</div>';
  h+='<div class="sf-claim-demo">';
  h+='<label class="sf-upload-btn" for="claimPhoto"><svg viewBox="0 0 20 20" width="14" height="14" style="vertical-align:middle;margin-right:6px"><path d="M10,3 L10,13 M6,7 L10,3 L14,7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3,13 L3,16 L17,16 L17,13" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Upload Photo for Estimate</label>';
  h+='<input type="file" id="claimPhoto" accept="image/*" style="display:none" onchange="processClaimPhoto(this)">';
  h+='<div id="claimResult" style="display:none"></div>';
  h+='</div></div></div>';

  // 3) Discount Eligibility
  var discounts=[];
  if(S.phone===0)discounts.push({name:'Distraction-Free',pct:10,earned:true});
  else discounts.push({name:'Distraction-Free',pct:10,earned:false});
  if(S.brakes===0)discounts.push({name:'Smooth Braking',pct:8,earned:true});
  else discounts.push({name:'Smooth Braking',pct:8,earned:false});
  if(hitCount===0)discounts.push({name:'Collision-Free',pct:7,earned:true});
  else discounts.push({name:'Collision-Free',pct:7,earned:false});
  if(r<30)discounts.push({name:'Low Risk Driver',pct:15,earned:true});
  else if(r<50)discounts.push({name:'Moderate Risk',pct:5,earned:true});
  else discounts.push({name:'Low Risk Driver',pct:15,earned:false});
  discounts.push({name:'Drive Safe & Save Enrollment',pct:10,earned:true});
  var totalDisc=discounts.reduce(function(s,d){return s+(d.earned?d.pct:0);},0);
  if(totalDisc>30)totalDisc=30;
  var savings=Math.round(totalDisc*6.5);

  h+='<div class="sf-service"><div class="sf-service-icon"><svg viewBox="0 0 32 32" width="28" height="28"><path d="M16,4 L28,10 L28,18 Q28,26 16,30 Q4,26 4,18 L4,10 Z" fill="none" stroke="#6a9882" stroke-width="1.5"/><path d="M11,16 L14,19 L21,12" fill="none" stroke="#6a9882" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  h+='<div class="sf-service-body"><div class="sf-service-title">Discount Eligibility</div>';
  h+='<div class="sf-service-detail">Based on your driving profile, here are the discounts you qualify for:</div>';
  h+='<div class="disc-grid">';
  discounts.forEach(function(d){
    h+='<div class="disc-row '+(d.earned?'earned':'missed')+'"><span class="disc-check">'+(d.earned?'&#10003;':'&#10007;')+'</span><span class="disc-name">'+d.name+'</span><span class="disc-pct">'+(d.earned?'-'+d.pct+'%':'0%')+'</span></div>';
  });
  h+='</div>';
  h+='<div class="disc-total"><span class="disc-total-label">Total Discount</span><span class="disc-total-val">Up to '+totalDisc+'%</span></div>';
  h+='<div class="disc-savings">$'+savings+'<span>/mo estimated savings</span></div>';
  h+='<div class="sf-service-detail" style="margin-top:0.6rem;font-style:italic;text-align:center">&ldquo;We help people manage the risks of everyday life, recover from the unexpected, and realize their dreams.&rdquo;</div>';
  h+='</div></div>';

  h+='</div>'; // close sf-hub

  document.getElementById('summaryContent').innerHTML=h;

  // AI call
  var aiData={score:r,arch:getArch(r).n,phone:S.phone,brakes:S.brakes,hits:hitCount,safe:S.safe,topRisk:topRisk};
  var aiResult=await aiAssess(aiData);
  var aiEl=document.getElementById('aiText');
  if(aiEl){
    if(aiResult){aiEl.textContent=aiResult;aiEl.classList.remove('loading');}
    else{aiEl.textContent=r<30?S.visitorName+', your record stands as one of the finest artifacts in this archive. Minimal risk signals, strong reflexes, and unwavering focus define your driving character. Continue this path and let State Farm Drive Safe & Save reward your discipline.':r<55?S.visitorName+', your driving record tells a mixed story. Moments of excellent judgment are tempered by lapses in focus. Address your top risk factor — '+topRisk.toLowerCase()+' — and your next visit will yield a far more favorable assessment.':S.visitorName+', this archive has catalogued significant risk signals in your driving profile. '+topRisk+' stands as your most urgent concern. We strongly recommend enrolling in State Farm Drive Safe & Save to begin building safer habits immediately.';aiEl.classList.remove('loading');}
  }
}

// ─── ARTIFACT SVGs ───
function getArtSVG(type,pos){
  var g='rgba(212,168,67,',r='rgba(139,26,42,',gr='rgba(106,152,130,';
  var c=pos?g:r;
  var svgs={
    tablet:'<svg viewBox="0 0 120 160" class="art-svg"><rect x="20" y="10" width="80" height="120" rx="3" fill="'+c+'0.05)" stroke="'+c+'0.5)" stroke-width="1.5"/><rect x="26" y="16" width="68" height="108" fill="none" stroke="'+c+'0.18)" stroke-width="0.5"/><line x1="35" y1="38" x2="85" y2="38" stroke="'+c+'0.25)" stroke-width="0.8"/><line x1="35" y1="52" x2="80" y2="52" stroke="'+c+'0.2)" stroke-width="0.7"/><line x1="35" y1="66" x2="85" y2="66" stroke="'+c+'0.2)" stroke-width="0.7"/><line x1="35" y1="80" x2="72" y2="80" stroke="'+c+'0.15)" stroke-width="0.7"/><line x1="35" y1="94" x2="82" y2="94" stroke="'+c+'0.15)" stroke-width="0.7"/><rect x="20" y="140" width="80" height="8" rx="1" fill="'+g+'0.05)" stroke="'+g+'0.15)" stroke-width="0.5"/></svg>',
    lens:'<svg viewBox="0 0 120 150" class="art-svg"><circle cx="55" cy="55" r="35" fill="'+gr+'0.04)" stroke="'+gr+'0.5)" stroke-width="1.5"/><circle cx="55" cy="55" r="24" fill="none" stroke="'+gr+'0.25)" stroke-width="0.8"/><circle cx="55" cy="55" r="10" fill="'+gr+'0.08)" stroke="'+gr+'0.3)" stroke-width="0.5"/><circle cx="55" cy="55" r="3" fill="'+gr+'0.2)"/><line x1="80" y1="80" x2="100" y2="108" stroke="'+g+'0.45)" stroke-width="3" stroke-linecap="round"/><rect x="30" y="130" width="60" height="8" rx="1" fill="'+g+'0.05)" stroke="'+g+'0.15)" stroke-width="0.5"/></svg>',
    mirror:'<svg viewBox="0 0 110 150" class="art-svg"><rect x="20" y="10" width="70" height="100" rx="2" fill="'+r+'0.04)" stroke="'+r+'0.45)" stroke-width="1.5"/><rect x="26" y="16" width="58" height="88" fill="'+r+'0.02)" stroke="'+r+'0.12)" stroke-width="0.5"/><line x1="42" y1="16" x2="68" y2="104" stroke="'+r+'0.4)" stroke-width="1"/><line x1="50" y1="35" x2="78" y2="80" stroke="'+r+'0.25)" stroke-width="0.7"/><line x1="30" y1="50" x2="52" y2="95" stroke="'+r+'0.2)" stroke-width="0.6"/><rect x="25" y="130" width="60" height="8" rx="1" fill="'+g+'0.05)" stroke="'+g+'0.15)" stroke-width="0.5"/></svg>',
    shield:'<svg viewBox="0 0 100 145" class="art-svg"><path d="M50,12 L82,28 L82,65 Q82,105 50,120 Q18,105 18,65 L18,28 Z" fill="'+gr+'0.05)" stroke="'+gr+'0.5)" stroke-width="1.5"/><path d="M50,24 L70,35 L70,63 Q70,93 50,105 Q30,93 30,63 L30,35 Z" fill="none" stroke="'+gr+'0.2)" stroke-width="0.5"/><line x1="50" y1="36" x2="50" y2="95" stroke="'+gr+'0.15)" stroke-width="0.8"/><line x1="33" y1="60" x2="67" y2="60" stroke="'+gr+'0.15)" stroke-width="0.8"/><circle cx="50" cy="60" r="7" fill="'+gr+'0.1)" stroke="'+gr+'0.2)" stroke-width="0.5"/></svg>',
    shield_worn:'<svg viewBox="0 0 100 145" class="art-svg"><path d="M50,12 L82,28 L82,65 Q82,105 50,120 Q18,105 18,65 L18,28 Z" fill="'+r+'0.04)" stroke="'+r+'0.4)" stroke-width="1.5"/><path d="M50,24 L70,35 L70,63 Q70,93 50,105 Q30,93 30,63 L30,35 Z" fill="none" stroke="'+r+'0.12)" stroke-width="0.5"/><line x1="35" y1="28" x2="65" y2="100" stroke="'+r+'0.35)" stroke-width="1"/><line x1="45" y1="45" x2="72" y2="85" stroke="'+r+'0.2)" stroke-width="0.7"/></svg>',
    vase:'<svg viewBox="0 0 90 155" class="art-svg"><ellipse cx="45" cy="82" rx="26" ry="33" fill="'+g+'0.04)" stroke="'+g+'0.45)" stroke-width="1.5"/><rect x="38" y="35" width="14" height="20" fill="'+g+'0.03)" stroke="'+g+'0.35)" stroke-width="1"/><ellipse cx="45" cy="35" rx="13" ry="4" fill="'+g+'0.05)" stroke="'+g+'0.35)" stroke-width="1"/><path d="M19,72 Q10,58 20,46 Q28,38 34,42" fill="none" stroke="'+g+'0.3)" stroke-width="1"/><path d="M71,72 Q80,58 70,46 Q62,38 56,42" fill="none" stroke="'+g+'0.3)" stroke-width="1"/><ellipse cx="45" cy="113" rx="11" ry="3" fill="'+g+'0.06)"/><path d="M21,80 Q33,73 45,80 Q57,87 69,80" fill="none" stroke="'+g+'0.15)" stroke-width="0.7"/><rect x="22" y="135" width="46" height="8" rx="1" fill="'+g+'0.05)" stroke="'+g+'0.15)" stroke-width="0.5"/></svg>',
    vase_broken:'<svg viewBox="0 0 90 155" class="art-svg"><ellipse cx="45" cy="82" rx="26" ry="33" fill="'+r+'0.03)" stroke="'+r+'0.35)" stroke-width="1.5" stroke-dasharray="5 3"/><rect x="38" y="35" width="14" height="20" fill="'+r+'0.02)" stroke="'+r+'0.3)" stroke-width="1"/><ellipse cx="45" cy="35" rx="13" ry="4" fill="'+r+'0.04)" stroke="'+r+'0.3)" stroke-width="1"/><line x1="33" y1="50" x2="56" y2="108" stroke="'+r+'0.4)" stroke-width="1"/><line x1="50" y1="60" x2="37" y2="100" stroke="'+r+'0.25)" stroke-width="0.7"/><line x1="27" y1="78" x2="40" y2="98" stroke="'+r+'0.2)" stroke-width="0.6"/><rect x="22" y="135" width="46" height="8" rx="1" fill="'+g+'0.05)" stroke="'+g+'0.15)" stroke-width="0.5"/></svg>',
    statue:'<svg viewBox="0 0 80 165" class="art-svg"><rect x="20" y="132" width="40" height="20" rx="1" fill="'+c+'0.05)" stroke="'+c+'0.3)" stroke-width="1"/><rect x="24" y="126" width="32" height="8" rx="1" fill="'+c+'0.06)" stroke="'+c+'0.25)" stroke-width="0.8"/><rect x="32" y="60" width="16" height="66" fill="'+c+'0.04)" stroke="'+c+'0.35)" stroke-width="1"/><circle cx="40" cy="46" r="14" fill="'+c+'0.04)" stroke="'+c+'0.4)" stroke-width="1.2"/><line x1="18" y1="82" x2="32" y2="72" stroke="'+c+'0.25)" stroke-width="1"/><line x1="48" y1="72" x2="62" y2="82" stroke="'+c+'0.25)" stroke-width="1"/><circle cx="36" cy="43" r="1.5" fill="'+c+'0.25)"/><circle cx="44" cy="43" r="1.5" fill="'+c+'0.25)"/></svg>',
    scroll:'<svg viewBox="0 0 140 115" class="art-svg"><rect x="25" y="18" width="90" height="65" fill="'+g+'0.03)" stroke="'+g+'0.35)" stroke-width="1"/><ellipse cx="25" cy="50" rx="7" ry="33" fill="'+g+'0.05)" stroke="'+g+'0.35)" stroke-width="1"/><ellipse cx="115" cy="50" rx="7" ry="33" fill="'+g+'0.05)" stroke="'+g+'0.35)" stroke-width="1"/><line x1="38" y1="32" x2="102" y2="32" stroke="'+g+'0.2)" stroke-width="0.6"/><line x1="38" y1="42" x2="98" y2="42" stroke="'+g+'0.15)" stroke-width="0.6"/><line x1="38" y1="52" x2="100" y2="52" stroke="'+g+'0.15)" stroke-width="0.6"/><line x1="38" y1="62" x2="90" y2="62" stroke="'+g+'0.12)" stroke-width="0.6"/><rect x="40" y="97" width="60" height="8" rx="1" fill="'+g+'0.05)" stroke="'+g+'0.15)" stroke-width="0.5"/></svg>'
  };return svgs[type]||svgs.tablet;
}

// ─── PROGRESS CHART (SVG) ───
function buildProgressChart(runs){
  var max=100,barW=32,gap=8,h=100,pad=20;
  var totalW=runs.length*(barW+gap)-gap+pad*2;
  if(totalW<200)totalW=200;
  var svg='<svg viewBox="0 0 '+totalW+' '+(h+40)+'" width="100%" height="'+(h+50)+'" style="display:block;margin:0.8rem auto">';
  // baseline
  svg+='<line x1="'+pad+'" y1="'+h+'" x2="'+(totalW-pad)+'" y2="'+h+'" stroke="rgba(212,168,67,0.08)" stroke-width="0.5"/>';
  // 50 line
  svg+='<line x1="'+pad+'" y1="'+(h-50)+'" x2="'+(totalW-pad)+'" y2="'+(h-50)+'" stroke="rgba(212,168,67,0.04)" stroke-width="0.5" stroke-dasharray="4 3"/>';
  svg+='<text x="'+(pad-2)+'" y="'+(h-48)+'" fill="rgba(212,168,67,0.15)" font-size="7" font-family="DM Mono,monospace" text-anchor="end">50</text>';
  runs.forEach(function(run,i){
    var x=pad+i*(barW+gap);
    var barH=Math.max(2,run.score/max*h);
    var y=h-barH;
    var col=run.score>65?'rgba(139,26,42,0.6)':run.score>38?'rgba(122,74,30,0.5)':'rgba(42,74,58,0.5)';
    var colBorder=run.score>65?'rgba(139,26,42,0.8)':run.score>38?'rgba(122,74,30,0.7)':'rgba(42,74,58,0.7)';
    // bar
    svg+='<rect x="'+x+'" y="'+y+'" width="'+barW+'" height="'+barH+'" fill="'+col+'" stroke="'+colBorder+'" stroke-width="0.8" rx="2"/>';
    // score on top
    svg+='<text x="'+(x+barW/2)+'" y="'+(y-4)+'" fill="rgba(212,168,67,0.6)" font-size="9" font-family="Cinzel,serif" text-anchor="middle">'+run.score+'</text>';
    // visit label
    var isLast=i===runs.length-1;
    svg+='<text x="'+(x+barW/2)+'" y="'+(h+14)+'" fill="'+(isLast?'rgba(212,168,67,0.5)':'rgba(212,168,67,0.2)')+'" font-size="7" font-family="DM Mono,monospace" text-anchor="middle">'+(isLast?'NOW':'V'+(i+1))+'</text>';
  });
  // trend line
  if(runs.length>1){
    var pts=runs.map(function(run,i){var x=pad+i*(barW+gap)+barW/2;var y=h-run.score/max*h;return x+','+y;});
    svg+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="rgba(212,168,67,0.25)" stroke-width="1.5" stroke-dasharray="4 2"/>';
    // dots on trend
    runs.forEach(function(run,i){var x=pad+i*(barW+gap)+barW/2;var y=h-run.score/max*h;
      svg+='<circle cx="'+x+'" cy="'+y+'" r="2.5" fill="rgba(212,168,67,0.35)"/>';});
  }
  svg+='</svg>';return svg;
}

function fullReset(){
  Object.assign(S,{score:0,quizBase:0,brakes:0,phone:0,safe:0,miles:0,visitorName:'',visitorId:'',simElapsed:0});
  clearInterval(simTimer);cancelAnimationFrame(gameAnim);stopVoice();stopMusic();
  qIdx=0;qAns=Array(7).fill(null);logItems=[];obstacles=[];hitCount=0;dodgeCount=0;mArts=[];mIdx=0;
  activeGuide=null;weatherData=null;guideIdx=0;delete document.body.dataset.era;
  document.getElementById('guestName').value='';
  document.getElementById('driveEndModal').style.display='none';
  document.getElementById('dimOverlay').classList.remove('on');
  var rb=document.getElementById('returningBanner');if(rb)rb.style.display='none';
  document.getElementById('tourSection').style.display='';document.getElementById('summarySection').style.display='none';
  // Close the museum doors and restore lobby visuals
  var doors=document.getElementById('entranceDoors');if(doors)doors.classList.remove('doors-open');
  var inputArea=document.getElementById('lobbyInputArea');if(inputArea)inputArea.classList.remove('fade-out');
  document.querySelectorAll('.lobby-title,.lobby-subtitle').forEach(function(el){el.style.transition='none';el.style.opacity='1';});
  showScreen('lobby');
}
