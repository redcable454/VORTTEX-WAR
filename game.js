(()=>{'use strict';
const $=id=>document.getElementById(id),home=$('home'),game=$('game'),panel=$('panel'),canvas=$('world'),ctx=canvas.getContext('2d');
let coins=1200,active=false,paused=false,keys={},shots=[],enemies=[],worldX=0,frame=0;
const player={x:100,y:360,vx:0,vy:0,w:38,h:58,onGround:false,face:1,hp:100};
function show(which){[home,game,panel].forEach(x=>x.classList.add('hidden'));which.classList.remove('hidden')}
$('play').onclick=()=>{show(game);startGame()};$('back').onclick=()=>{active=false;show(home)};$('openCharacters').onclick=()=>openPanel('PERSONAJES');$('panelBack').onclick=()=>show(home);
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>openPanel(b.dataset.panel));
function openPanel(which){let title=which.toUpperCase();$('panelTitle').textContent=title;let data={
missions:[['Completa una partida','+100 XP'],['Recoge 10 monedas','+50 monedas'],['Derrota 3 enemigos','+150 XP']],
store:[['Traje Explorador','🪙 500'],['Espada de plasma','🪙 750'],['Aspecto Neón','💎 20']],
roulette:[['Premio diario','Giro gratis disponible'],['Caja de combate','Próximamente']],
friends:[['Juego en línea','Sistema multijugador en desarrollo'],['Invitar amigos','Próximamente']],
'PERSONAJES':[['VORTEX','Personaje inicial · Disponible'],['NOVA','Próximamente'],['BLAZE','Próximamente']]
};$('panelContent').innerHTML=(data[which]||data[title]||[]).map((r,i)=>'<div class="reward"><div><b>'+r[0]+'</b><br><small style="color:#a8aec5">'+r[1]+'</small></div><button '+(which==='missions'?'disabled':'')+'>VER</button></div>').join('');show(panel)}
function startGame(){active=true;paused=false;player.x=100;player.y=360;player.vx=0;player.vy=0;player.hp=100;shots=[];enemies=[{x:570,y:395,w:36,h:45,alive:true},{x:850,y:395,w:36,h:45,alive:true},{x:1170,y:395,w:36,h:45,alive:true}];requestAnimationFrame(loop)}
window.addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowLeft','ArrowRight','ArrowUp'].includes(e.code))e.preventDefault();if(e.code==='Escape'&&active)paused=!paused;if(e.code==='KeyZ'&&!e.repeat&&active)shoot()});
window.addEventListener('keyup',e=>keys[e.code]=false);
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;if(k==='KeyZ')shoot()});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false))});
function shoot(){shots.push({x:player.x+player.w/2+player.face*20,y:player.y+25,vx:player.face*9})}
function loop(){if(!active)return;if(!paused)update();draw();requestAnimationFrame(loop)}
function update(){frame++;let left=keys.ArrowLeft||keys.KeyA,right=keys.ArrowRight||keys.KeyD;player.vx=left?-4.2:right?4.2:0;if(left)player.face=-1;if(right)player.face=1;if((keys.Space||keys.ArrowUp||keys.KeyW)&&player.onGround){player.vy=-12;player.onGround=false}player.vy+=.55;player.x+=player.vx;player.y+=player.vy;if(player.y+player.h>420){player.y=420-player.h;player.vy=0;player.onGround=true}player.x=Math.max(20,Math.min(1800,player.x));worldX=Math.max(0,player.x-250);shots=shots.filter(s=>s.x>-worldX&&s.x<worldX+1100);shots.forEach(s=>s.x+=s.vx);enemies.forEach(e=>{if(e.alive&&shots.some(s=>Math.abs(s.x-e.x)<20&&Math.abs(s.y-(e.y+20))<28)){e.alive=false;coins+=25;$('gameCoins').textContent=coins}});shots=shots.filter(s=>!enemies.some(e=>!e.alive&&Math.abs(s.x-e.x)<40));if(player.x>1780){active=false;coins+=100;$('coins').textContent=coins;show(home);openPanel('missions')}}
function draw(){let g=ctx.createLinearGradient(0,0,0,540);g.addColorStop(0,'#1c315c');g.addColorStop(1,'#6b5472');ctx.fillStyle=g;ctx.fillRect(0,0,960,540);
for(let i=0;i<9;i++){let x=(i*160-worldX*.25)%1200;ctx.fillStyle='#ffffff0b';ctx.beginPath();ctx.arc(x+80,120,50+i%3*18,0,Math.PI*2);ctx.fill()}
ctx.fillStyle='#263b4c';ctx.fillRect(0,420,960,120);ctx.fillStyle='#55c6a0';ctx.fillRect(0,420,960,7);
for(let i=0;i<20;i++){let x=(i*120-worldX*.7)%1100;ctx.fillStyle='#31566a';ctx.fillRect(x,385,50,35);ctx.fillStyle='#4b7a82';ctx.fillRect(x+8,375,34,10)}
ctx.save();ctx.translate(-worldX,0);
ctx.fillStyle='#f6ad48';ctx.fillRect(1740,340,9,80);ctx.fillStyle='#f6e27b';ctx.beginPath();ctx.moveTo(1749,340);ctx.lineTo(1795,355);ctx.lineTo(1749,370);ctx.fill();
enemies.forEach(e=>{if(!e.alive)return;ctx.fillStyle='#e85e65';ctx.fillRect(e.x,e.y,e.w,e.h);ctx.fillStyle='#fff';ctx.fillRect(e.x+7,e.y+10,7,7);ctx.fillRect(e.x+23,e.y+10,7,7);ctx.fillStyle='#27233c';ctx.fillRect(e.x+7,e.y+30,22,5)});
ctx.fillStyle='#35d8df';ctx.fillRect(player.x,player.y,player.w,player.h);ctx.fillStyle='#f4c69b';ctx.fillRect(player.x+7,player.y-15,25,22);ctx.fillStyle='#19213a';ctx.fillRect(player.x+6,player.y-18,27,9);ctx.fillStyle='#fff';ctx.fillRect(player.x+(player.face===1?23:7),player.y-7,5,5);
ctx.fillStyle='#ffd15a';shots.forEach(s=>{ctx.fillRect(s.x,s.y,15,5)});ctx.restore();
ctx.fillStyle='#10172cbb';ctx.fillRect(18,18,220,65);ctx.fillStyle='#fff';ctx.font='bold 17px Inter';ctx.fillText('VORTEX  ·  HP '+player.hp,32,45);ctx.font='13px Inter';ctx.fillStyle='#ffe08a';ctx.fillText('🪙 '+coins+'     OBJETIVO: LLEGA A LA BANDERA',32,68);
ctx.fillStyle='#fff';ctx.font='bold 14px Inter';ctx.fillText('PROGRESO',800,35);ctx.fillStyle='#ffffff30';ctx.fillRect(800,45,130,8);ctx.fillStyle='#4be2df';ctx.fillRect(800,45,130*Math.min(1,player.x/1800),8);if(paused){ctx.fillStyle='#090d1dcc';ctx.fillRect(0,0,960,540);ctx.fillStyle='#fff';ctx.font='bold 50px Inter';ctx.textAlign='center';ctx.fillText('PAUSA',480,270);ctx.font='18px Inter';ctx.fillText('Presiona ESC para continuar',480,310);ctx.textAlign='left'}}
$('gameCoins').textContent=coins;
})();