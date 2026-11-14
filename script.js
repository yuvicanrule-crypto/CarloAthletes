const $ = (id) => document.getElementById(id);
let isSignup = false;
let currentUser = null;

function showApp(user) {
  currentUser = user;
  $('authScreen').classList.add('hidden');
  $('app').classList.remove('hidden');
  $('welcomeName').textContent = `WELCOME, ${(user.displayName || user.email.split('@')[0]).toUpperCase()}`;
  $('welcomeIgn').textContent = user.ign ? `${user.ign} • UID ${user.uid || 'not added'}` : 'Add your Free Fire details to complete your profile';
  $('profileInitial').textContent = (user.displayName || user.email).charAt(0).toUpperCase();
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
function getUsers(){ try{return JSON.parse(localStorage.getItem('ca_demo_users')||'{}')}catch{return {}} }
function saveUsers(users){localStorage.setItem('ca_demo_users',JSON.stringify(users))}
function switchAuth(){
  isSignup=!isSignup;
  $('authHeading').innerHTML=isSignup?'Create account<span>.</span>':'Sign in<span>.</span>';
  $('authDescription').textContent=isSignup?'Create a local demo profile to enter the arena.':'Enter your details to access your player space.';
  $('authSubmit').innerHTML=isSignup?'CREATE ACCOUNT <span>↗</span>':'SIGN IN <span>↗</span>';
  $('switchText').textContent=isSignup?'Already have an account?':'New to CarloAthletes?';
  $('switchAuth').textContent=isSignup?'Sign in':'Create account';
}
$('switchAuth').addEventListener('click',switchAuth);
$('authForm').addEventListener('submit',e=>{
  e.preventDefault();
  const email=$('email').value.trim().toLowerCase(), password=$('password').value;
  const users=getUsers();
  if(isSignup){
    if(users[email]) return alert('An account with this email already exists on this browser.');
    users[email]={email,password,displayName:email.split('@')[0],ign:'',uid:'',team:''};
    saveUsers(users); currentUser=users[email]; showApp(currentUser); openProfile();
  }else{
    if(!users[email]||users[email].password!==password) return alert('Demo account not found. Create an account first on this browser.');
    showApp(users[email]);
  }
});
$('logoutBtn').addEventListener('click',()=>{currentUser=null;$('app').classList.add('hidden');$('authScreen').classList.remove('hidden');$('authForm').reset()});
function openProfile(){
  $('displayName').value=currentUser?.displayName||'';
  $('ign').value=currentUser?.ign||'';
  $('uid').value=currentUser?.uid||'';
  $('team').value=currentUser?.team||'';
  $('profileModal').classList.remove('hidden');
}
$('editProfileBtn').addEventListener('click',openProfile);
$('closeProfile').addEventListener('click',()=>$('profileModal').classList.add('hidden'));
$('profileForm').addEventListener('submit',e=>{
  e.preventDefault();
  const users=getUsers();
  currentUser={...currentUser,displayName:$('displayName').value.trim(),ign:$('ign').value.trim(),uid:$('uid').value.trim(),team:$('team').value.trim()};
  users[currentUser.email]=currentUser;saveUsers(users);showApp(currentUser);$('profileModal').classList.add('hidden');
});
function openMatch(type){
  const br=type==='br';
  $('modalEyebrow').textContent=br?'MAIN MODE / BATTLE ROYALE':'TEAM MODE / CLASH SQUAD';
  $('modalTitle').innerHTML=br?'BATTLE ROYALE<span>.</span>':'CLASH SQUAD<span>.</span>';
  $('modalBadges').innerHTML=br?'<span>50 PLAYER CAPACITY</span><span>SQUAD FORMAT</span><span>INDIA / IST</span>':'<span>4 VS 4</span><span>8 PLAYERS</span><span>CUSTOM ROOM</span>';
  $('modalBody').innerHTML=br?`
    <div class="detail-grid">
      <div class="detail-box"><small>MATCH START</small><strong>4:30 PM IST</strong></div>
      <div class="detail-box"><small>ROOM DETAILS</small><strong>4:25 PM IST</strong></div>
      <div class="detail-box"><small>FORMAT</small><strong>Squad</strong></div>
      <div class="detail-box"><small>CAPACITY</small><strong>50 players</strong></div>
    </div>
    <p class="modal-copy">Send your Free Fire game name, UID and squad details through Instagram DM. Your place is not confirmed until the organizer replies. Room information is shared at 4:25 PM IST.</p>
    <p class="modal-copy"><strong>Important:</strong> Players who have not joined by 4:30 PM IST may miss the match. Please contact the organizer in advance if you have a timing issue.</p>`:`
    <div class="detail-grid">
      <div class="detail-box"><small>TEAM FORMAT</small><strong>4 VS 4</strong></div>
      <div class="detail-box"><small>ROOM TYPE</small><strong>Custom room</strong></div>
      <div class="detail-box"><small>REGISTRATION</small><strong>Instagram DM</strong></div>
      <div class="detail-box"><small>SCHEDULE</small><strong>Ask organizer</strong></div>
    </div>
    <p class="modal-copy">Send your team name and the four players' Free Fire game names through Instagram DM. Wait for the organizer to confirm your team and match schedule.</p>`;
  $('matchModal').classList.remove('hidden');
}
document.querySelectorAll('[data-open]').forEach(btn=>btn.addEventListener('click',()=>openMatch(btn.dataset.open)));
$('closeModal').addEventListener('click',()=>$('matchModal').classList.add('hidden'));
$('matchModal').addEventListener('click',e=>{if(e.target===$('matchModal'))$('matchModal').classList.add('hidden')});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('.nav-link').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('.nav-link').forEach(a=>a.classList.remove('active'));link.classList.add('active')}));
