/* NEW: additive tournament UI and safe preview interactions */
(() => {
  const $ = (id) => document.getElementById(id);
  const app = $('app');
  if (!app) return;

  // NEW: SEO, accessibility helpers and scroll controls
  const progress = document.createElement('div');
  progress.id = 'caProgress';
  progress.setAttribute('aria-hidden','true');
  document.body.prepend(progress);
  const backTop = document.createElement('button');
  backTop.id = 'caBackTop'; backTop.type = 'button'; backTop.textContent = '↑';
  backTop.setAttribute('aria-label','Back to top'); document.body.append(backTop);
  const toast = document.createElement('div');
  toast.className = 'ca-toast'; toast.setAttribute('role','status'); toast.setAttribute('aria-live','polite'); document.body.append(toast);
  let toastTimer;
  function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3200)}
  function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';backTop.classList.toggle('show',scrollY>500)}
  addEventListener('scroll',updateScroll,{passive:true}); updateScroll();
  backTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  // NEW: Live announcement ticker and secondary pro hero
  const topbar=app.querySelector('.topbar');
  if(topbar){
    const ticker=document.createElement('div');
    ticker.className='ca-ticker'; ticker.setAttribute('aria-label','Community update ticker');
    ticker.innerHTML='<div class="ca-ticker-track"><span>CARLOATHLETES • INDIAN FREE FIRE COMMUNITY</span><span>OFFICIAL MATCH CONFIRMATION VIA @ITS.YUVI.BTW</span><span>TOURNAMENT SCHEDULES WILL BE ANNOUNCED HERE</span><span>CARLOATHLETES • INDIAN FREE FIRE COMMUNITY</span><span>OFFICIAL MATCH CONFIRMATION VIA @ITS.YUVI.BTW</span><span>TOURNAMENT SCHEDULES WILL BE ANNOUNCED HERE</span></div>';
    topbar.insertAdjacentElement('afterend',ticker);
  }
  const hero=$('home');
  if(hero){
    const pro=document.createElement('section'); pro.className='ca-pro-hero';
    pro.innerHTML='<div><div class="eyebrow">CARLOATHLETES TOURNAMENT DESK</div><h2>YOUR NEXT <span>CHALLENGE</span><br>STARTS HERE.</h2><p>Explore match formats, follow official announcements and contact the organizer for confirmed tournament details. No unverified slots, prizes or schedules are displayed.</p><div class="ca-pro-actions"><a class="btn btn-primary" href="#caUpcoming">EXPLORE TOURNAMENTS ↗</a><a class="btn btn-outline" href="https://www.instagram.com/its.yuvi.btw/" target="_blank" rel="noopener">WATCH / CONTACT ↗</a></div></div><div class="ca-countdown"><small>NEXT TOURNAMENT COUNTDOWN</small><strong>NOT ANNOUNCED</strong><small>Official date and time will appear after organizer confirmation.</small></div>';
    hero.insertAdjacentElement('afterend',pro);
  }

  // NEW: Additive tournament sections. Unknown event data stays clearly unannounced.
  const footer=app.querySelector('footer');
  const sections=`
  <section id="caUpcoming" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">OFFICIAL EVENT BOARD</div><h2>UPCOMING <span>TOURNAMENTS.</span></h2><p class="ca-muted">Only organizer-confirmed events will be listed here.</p></div>
    <div class="ca-grid"><div class="ca-empty">No upcoming tournament has been officially announced yet. Follow the announcements section or contact the organizer.</div></div>
  </section>
  <section id="caRegister" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">TEAM ENTRY INTEREST</div><h2>TOURNAMENT <span>REGISTRATION.</span></h2><p class="ca-muted">Preview form only. It does not submit, store or confirm an entry. Contact the organizer for the real process.</p></div>
    <form class="ca-card ca-form" id="caInterestForm">
      <label>Team name<input name="team" maxlength="32" required placeholder="Your squad name"></label>
      <label>Captain IGN<input name="ign" maxlength="24" required placeholder="Free Fire name"></label>
      <label>Free Fire UID<input name="uid" inputmode="numeric" pattern="[0-9]{5,20}" required placeholder="Numeric UID"></label>
      <label>Captain contact<input name="contact" type="text" maxlength="40" required placeholder="Instagram handle"></label>
      <label class="wide">Team roster (4 players + optional substitute)<textarea name="roster" rows="3" maxlength="400" required placeholder="Enter player IGNs and UIDs"></textarea></label>
      <label class="wide">Discord / WhatsApp (optional)<input name="community" maxlength="80" placeholder="Only if the organizer requests it"></label>
      <div class="wide"><button class="btn btn-primary" type="submit">VALIDATE PREVIEW ↗</button><p class="ca-muted">For player safety, do not upload payment screenshots or share financial credentials here. No payment or paid-entry flow is enabled.</p></div>
    </form>
  </section>
  <section id="caPoints" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">VERIFIED PERFORMANCE</div><h2>POINTS <span>TABLE.</span></h2></div>
    <div class="ca-toolbar"><input id="caSearch" type="search" placeholder="Search verified teams..." aria-label="Search leaderboard"><span class="ca-chip">AWAITING VERIFIED RESULTS</span></div>
    <div class="ca-table-wrap"><table class="ca-table"><thead><tr><th>RANK</th><th>TEAM</th><th>KILLS</th><th>PLACEMENT</th><th>TOTAL</th></tr></thead><tbody id="caLeaderboard"><tr><td colspan="5">No verified team results published yet.</td></tr></tbody></table></div>
  </section>
  <section id="caFixtures" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">ROUND BY ROUND</div><h2>MATCH <span>FIXTURES.</span></h2></div>
    <div class="ca-empty">No fixtures are published yet. Match date, round and room details will be shared after organizer confirmation.</div>
  </section>
  <section id="caRoster" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">PLAYER ROLES</div><h2>TEAMS &amp; <span>ROSTERS.</span></h2></div>
    <div class="ca-card"><span class="ca-chip">FEATURED COMMUNITY</span><h3>Szn1.esp!</h3><p class="ca-muted">Roster names, team logos and player stats have not been supplied yet, so no players or performance numbers are invented.</p><p class="ca-muted">Roles supported when roster details are provided: Rusher • Sniper • Support • IGL.</p></div>
  </section>
  <section id="caStream" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">BROADCAST DESK</div><h2>LIVE <span>STREAM.</span></h2></div>
    <div class="ca-empty">No official YouTube or Twitch channel has been connected. A stream player will appear when the organizer supplies a channel link.</div>
  </section>
  <section id="caWinners" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">HALL OF FAME</div><h2>PREVIOUS <span>WINNERS.</span></h2></div>
    <div class="ca-empty">No verified previous winners or prize details have been published yet.</div>
  </section>
  <section id="caRewards" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">REWARDS DESK</div><h2>PRIZE POOL &amp; <span>REWARDS.</span></h2></div>
    <div class="ca-empty">Prize pools and rewards will be shown only after an event is officially announced. No estimated or fictional amounts are displayed.</div>
  </section>
  <section id="caRules" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">COMPETE WITH INTEGRITY</div><h2>TOURNAMENT <span>RULEBOOK.</span></h2></div>
    <div class="ca-accordion"><button type="button" aria-expanded="false">MAP &amp; GAME MODE <span>＋</span></button><div class="ca-accordion-panel">The map, mode and match settings will be specified in each official event announcement. Follow the in-game and organizer instructions.</div></div>
    <div class="ca-accordion"><button type="button" aria-expanded="false">FAIR PLAY &amp; CONDUCT <span>＋</span></button><div class="ca-accordion-panel">Cheats, exploits, harassment and abusive conduct are not permitted. Treat every participant and organizer respectfully.</div></div>
    <div class="ca-accordion"><button type="button" aria-expanded="false">DISQUALIFICATION &amp; DISPUTES <span>＋</span></button><div class="ca-accordion-panel">Any event-specific disqualification process and dispute deadline must be published by the organizer before that event begins.</div></div>
  </section>
  <section id="caGallery" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">COMMUNITY MOMENTS</div><h2>HIGHLIGHTS &amp; <span>GALLERY.</span></h2></div>
    <div class="ca-empty">No approved match screenshots or highlight videos have been added yet.</div>
  </section>
  <section id="caSponsors" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">POWERED BY THE COMMUNITY</div><h2>SPONSORS &amp; <span>PARTNERS.</span></h2></div>
    <div class="ca-empty">No official sponsors or partners have been confirmed.</div>
  </section>
  <section id="caNews" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">ORGANIZER UPDATES</div><h2>NEWS &amp; <span>UPDATES.</span></h2></div>
    <div class="ca-empty">Official news will be published in Announcements. Check the existing Announcements section for updates.</div>
  </section>
  <section id="caStats" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">REAL NUMBERS ONLY</div><h2>COMMUNITY <span>STATS.</span></h2></div>
    <div class="ca-grid"><div class="ca-card"><small class="ca-muted">PLAYERS</small><h3>Not yet tracked</h3></div><div class="ca-card"><small class="ca-muted">TOURNAMENTS</small><h3>Not yet verified</h3></div><div class="ca-card"><small class="ca-muted">PRIZE DISTRIBUTED</small><h3>Not yet published</h3></div></div>
  </section>
  <section id="caReviews" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">PLAYER FEEDBACK</div><h2>COMMUNITY <span>REVIEWS.</span></h2></div>
    <div class="ca-empty">Player testimonials will appear here after real participants provide permission to publish their feedback.</div>
  </section>
  <section id="caFaq" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">QUICK ANSWERS</div><h2>FREQUENTLY ASKED <span>QUESTIONS.</span></h2></div>
    <div class="ca-accordion"><button type="button" aria-expanded="false">How do I join a match? <span>＋</span></button><div class="ca-accordion-panel">Contact @its.yuvi.btw on Instagram with your Free Fire IGN, UID and squad details. Wait for organizer confirmation.</div></div>
    <div class="ca-accordion"><button type="button" aria-expanded="false">Does clicking Instagram confirm my slot? <span>＋</span></button><div class="ca-accordion-panel">No. A slot is confirmed only when the organizer replies and confirms your entry.</div></div>
    <div class="ca-accordion"><button type="button" aria-expanded="false">Where will room details appear? <span>＋</span></button><div class="ca-accordion-panel">For the existing BR schedule, room details are scheduled for 4:25 PM IST. Check the organizer's official update for confirmation.</div></div>
  </section>
  <section id="caCommunity" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">JOIN THE COMMUNITY</div><h2>STAY <span>CONNECTED.</span></h2></div>
    <div class="ca-socials"><a href="https://www.instagram.com/its.yuvi.btw/" target="_blank" rel="noopener">INSTAGRAM ↗</a></div>
    <p class="ca-muted">Discord, WhatsApp and YouTube links can be added when official community channels are provided.</p>
  </section>
  <section id="caContact" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">PLAYER SUPPORT</div><h2>CONTACT <span>ORGANIZER.</span></h2></div>
    <form class="ca-card ca-form" id="caContactForm"><label>Your display name<input name="name" maxlength="40" required></label><label>Your email (optional)<input name="email" type="email"></label><label class="wide">Message<textarea name="message" rows="4" maxlength="600" required></textarea></label><div class="wide"><button class="btn btn-primary" type="submit">CHECK MESSAGE ↗</button><p class="ca-muted">Preview validation only. Nothing is sent or stored. For a real response, use the official Instagram contact link.</p></div></form>
  </section>
  <section id="caAdminPreview" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">ORGANIZER TOOLS</div><h2>ADMIN <span>PREVIEW.</span></h2></div>
    <div class="ca-card"><span class="ca-chip">UI PREVIEW ONLY • NOT SECURE ADMIN ACCESS</span><h3>Management workspace</h3><p class="ca-muted">Tournament publishing, team approvals and result management require verified server-side authentication and database permissions. This public preview does not expose admin controls or allow changes.</p></div>
  </section>
  <section id="caLegal" class="extra-section section">
    <div class="ca-section-head"><div class="eyebrow">SITE INFORMATION</div><h2>PRIVACY &amp; <span>TERMS.</span></h2></div>
    <div class="ca-card"><h3>Privacy</h3><p class="ca-muted">This website currently uses a local demo profile in your browser. The new preview forms do not transmit or store submissions. Do not enter passwords, payment details or sensitive personal information.</p><h3>Terms</h3><p class="ca-muted">CarloAthletes is an independent community project. Match participation, schedule and eligibility are subject to official organizer announcements and applicable game rules.</p></div>
  </section>`;
  if(footer) footer.insertAdjacentHTML('beforebegin',sections);

  // NEW: Add navigation shortcuts without removing existing menu items
  const navForLinks=app.querySelector('.main-nav');
  if(navForLinks){
    [['caUpcoming','TOURNAMENTS'],['caRegister','REGISTER'],['caPoints','POINTS'],['caStream','LIVE'],['caFaq','FAQ']].forEach(([id,label])=>{
      const link=document.createElement('a');link.href='#'+id;link.className='nav-link';link.textContent=label;navForLinks.append(link);
    });
  }

  // NEW: Mobile menu, light mode and accordion interactions
  const nav=app.querySelector('.main-nav');
  if(nav){
    const toggle=document.createElement('button');toggle.className='btn btn-outline small ca-mobile-toggle';toggle.type='button';toggle.textContent='MENU ☰';toggle.setAttribute('aria-expanded','false');
    nav.insertAdjacentElement('beforebegin',toggle);
    toggle.addEventListener('click',()=>{const open=nav.classList.toggle('ca-nav-open');toggle.setAttribute('aria-expanded',String(open));});
    const style=document.createElement('style');style.textContent='.ca-mobile-toggle{display:none}@media(max-width:650px){.ca-mobile-toggle{display:inline-flex}.main-nav:not(.ca-nav-open){display:none!important}.main-nav.ca-nav-open{display:flex!important;flex-direction:column;align-items:flex-start;max-height:55vh;overflow:auto}}';document.head.append(style);
  }
  const theme=document.createElement('button');theme.className='btn btn-ghost small';theme.type='button';theme.textContent='LIGHT MODE';theme.setAttribute('aria-label','Toggle light mode');
  const actions=app.querySelector('.top-actions');if(actions)actions.prepend(theme);
  theme.addEventListener('click',()=>{document.body.classList.toggle('ca-light');theme.textContent=document.body.classList.contains('ca-light')?'DARK MODE':'LIGHT MODE';});
  app.querySelectorAll('.ca-accordion button').forEach(button=>button.addEventListener('click',()=>{const box=button.parentElement;const open=box.classList.toggle('open');button.setAttribute('aria-expanded',String(open));const mark=button.querySelector('span');if(mark)mark.textContent=open?'−':'＋';}));

  // NEW: Searchable empty leaderboard, ready for verified records later
  const search=$('caSearch');if(search)search.addEventListener('input',()=>{const row=$('caLeaderboard').querySelector('tr');if(row)row.style.display=row.textContent.toLowerCase().includes(search.value.toLowerCase())?'':'none';});

  // NEW: Frontend-only validation; no personal data is sent or stored
  const interest=$('caInterestForm');if(interest)interest.addEventListener('submit',e=>{e.preventDefault();if(!interest.reportValidity())return;notify('Form validated in preview only. Your entry has NOT been submitted or confirmed. Contact @its.yuvi.btw.');interest.reset();});
  const contact=$('caContactForm');if(contact)contact.addEventListener('submit',e=>{e.preventDefault();if(!contact.reportValidity())return;notify('Message checked in preview only. Nothing was sent. Please contact the organizer on Instagram.');contact.reset();});

  // NEW: Consent notice for future analytics/cookies; no analytics tracker is installed
  if(!localStorage.getItem('ca_privacy_choice')){
    const consent=document.createElement('aside');consent.className='ca-privacy';consent.innerHTML='<strong>YOUR PRIVACY</strong><p>This demo does not currently run an analytics tracker. Choose whether to dismiss this notice. No tracking preference is sent to a server.</p><div class="ca-privacy-actions"><button type="button" data-choice="ok">OK</button><button type="button" data-choice="close">CLOSE</button></div>';document.body.append(consent);
    consent.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{localStorage.setItem('ca_privacy_choice',btn.dataset.choice);consent.remove();}));
  }

  // NEW: CarloVerse — repeat-visit activities and local demo progression.
  // Match points are deliberately separate and must come from organizer-verified results.
  const universe = document.createElement('section');
  universe.id = 'caUniverse';
  universe.className = 'extra-section section';
  universe.innerHTML = `
    <div class="ca-section-head"><div class="eyebrow">ENTER THE CARLOVERSE</div><h2>YOUR <span>ESPORTS UNIVERSE.</span></h2><p class="ca-muted">Explore quests, quizzes, rivalries and collectibles. Your activity XP is a local demo and is not used for official tournament ranking.</p></div>
    <div class="ca-universe-grid">
      <article class="ca-card ca-rank-card">
        <span class="ca-chip">INDIA • VERIFIED MATCH RANKING</span>
        <h3>BOOYAH POWER RANKING</h3>
        <div class="ca-rank-title">RANKS ARE EARNED.</div>
        <p class="ca-muted">Official India-wide positions will appear only after the organizer publishes verified match results.</p>
        <div class="ca-empty">No verified player results published yet.</div>
        <div class="ca-points-rules">
          <b>POINTS SYSTEM</b>
          <span>Booyah / 1st place <strong>+10</strong></span>
          <span>2nd place <strong>+8</strong></span>
          <span>3rd place <strong>+6</strong></span>
          <span>4th–5th place <strong>+4</strong></span>
          <span>6th–10th place <strong>+2</strong></span>
          <span>Each kill <strong>+1</strong> (maximum 10 per match)</span>
          <small class="ca-muted">Booyah and 1st place count once, not twice. Results must be checked by the organizer.</small>
        </div>
        <div class="ca-rank-tiers">
          <b>INDIA RANK TIERS</b>
          <span>ROOKIE <small>0–99</small></span><span>HUNTER <small>100–249</small></span>
          <span>BEAST <small>250–499</small></span><span>DARINDA <small>500–899</small></span>
          <span>PHANTOM <small>900–1,499</small></span><span>NIGHTMARE <small>1,500–2,499</small></span>
          <span class="apex">APEX LEGEND <small>2,500+</small></span>
        </div>
      </article>
      <article class="ca-card ca-xp-card">
        <span class="ca-chip">LOCAL DEMO PROGRESS</span><h3>PLAYER LEVEL</h3>
        <div class="ca-xp-number" id="caXpNumber">LVL 1</div>
        <div class="ca-progressbar"><span id="caXpBar"></span></div>
        <p class="ca-muted" id="caXpText">0 / 100 activity XP</p>
        <p class="ca-muted">Activity XP is for fun only. It does not change Booyah ranking or tournament results.</p>
        <div class="ca-badges" id="caBadges"><span>STARTER</span></div>
      </article>
    </div>
    <div class="ca-section-head ca-subhead"><div class="eyebrow">COME BACK TOMORROW</div><h2>DAILY <span>QUESTS.</span></h2></div>
    <div class="ca-grid">
      <article class="ca-card"><span class="ca-chip">DAILY QUEST 01</span><h3>ARENA CHECK-IN</h3><p class="ca-muted">Visit CarloAthletes today and claim your daily activity XP.</p><button class="btn btn-primary ca-quest" id="caCheckin" type="button">CLAIM +5 XP</button></article>
      <article class="ca-card"><span class="ca-chip">DAILY QUEST 02</span><h3>KNOW YOUR GAME</h3><p class="ca-muted">Answer the daily Free Fire knowledge question.</p><p class="ca-quiz-question">In Battle Royale, what does “Booyah” indicate?</p><div class="ca-quiz-options"><button type="button" data-answer="a">A successful win</button><button type="button" data-answer="b">A team invite</button><button type="button" data-answer="c">A map location</button></div><p class="ca-muted" id="caQuizFeedback">Correct answer earns +5 activity XP once per day.</p></article>
      <article class="ca-card"><span class="ca-chip">SECRET VAULT</span><h3>UNLOCK THE C</h3><p class="ca-muted">Find the CarloAthletes secret code and unlock a collectible badge.</p><div class="ca-vault-row"><input id="caVaultCode" maxlength="16" placeholder="ENTER SECRET CODE" aria-label="Secret code"><button class="btn btn-outline" id="caVaultUnlock" type="button">UNLOCK</button></div><p class="ca-muted" id="caVaultFeedback">Hint: the name of this arena.</p></article>
    </div>
    <div class="ca-section-head ca-subhead"><div class="eyebrow">COMMUNITY RIVALRY</div><h2>RIVALRY <span>ZONE.</span></h2></div>
    <div class="ca-card ca-rivalry"><div><h3>WHICH PLAYSTYLE RULES?</h3><p class="ca-muted">Cast your local demo vote. This poll is not a live community-wide result.</p></div><div class="ca-quiz-options"><button type="button" data-rival="RUSHER">⚡ RUSHER</button><button type="button" data-rival="SNIPER">🎯 SNIPER</button><button type="button" data-rival="SUPPORT">🛡️ SUPPORT</button><button type="button" data-rival="IGL">🧠 IGL</button></div><p class="ca-muted" id="caRivalFeedback">Choose your playstyle.</p></div>
    <div class="ca-section-head ca-subhead"><div class="eyebrow">YOUR COLLECTION</div><h2>TROPHY <span>ROOM.</span></h2></div>
    <div class="ca-card"><p class="ca-muted">Collectible badges earned from website activities. Match trophies will be added only for verified achievements.</p><div class="ca-trophy-grid" id="caTrophyRoom"><span class="ca-trophy locked">🔒 FIRST CHECK-IN</span><span class="ca-trophy locked">🔒 QUIZ MASTER</span><span class="ca-trophy locked">🔒 SECRET C</span><span class="ca-trophy locked">🔒 COMMUNITY VOICE</span></div></div>
  `;
  if(footer) footer.insertAdjacentElement('beforebegin',universe);
  if(navForLinks){
    const link=document.createElement('a');link.href='#caUniverse';link.className='nav-link';link.textContent='CARLOVERSE';navForLinks.append(link);
  }
  const xpKey='ca_universe_xp_v1', badgeKey='ca_universe_badges_v1';
  let xp=Number(localStorage.getItem(xpKey)||0);
  let badges=JSON.parse(localStorage.getItem(badgeKey)||'[]');
  const dayKey=()=>new Date().toISOString().slice(0,10);
  const claimedKey='ca_quest_claims_v1', quizKey='ca_quiz_claims_v1';
  function addXp(amount,badge){
    xp+=amount;localStorage.setItem(xpKey,String(xp));
    if(badge&&!badges.includes(badge)){badges.push(badge);localStorage.setItem(badgeKey,JSON.stringify(badges));}
    renderProgress();
  }
  function renderProgress(){
    const level=Math.floor(xp/100)+1,within=xp%100;
    const number=$('caXpNumber'),bar=$('caXpBar'),label=$('caXpText'),badgeBox=$('caBadges'),room=$('caTrophyRoom');
    if(number)number.textContent='LVL '+level;
    if(bar)bar.style.width=within+'%';
    if(label)label.textContent=within+' / 100 activity XP • '+xp+' total XP';
    if(badgeBox)badgeBox.innerHTML='<span>STARTER</span>'+(level>=2?'<span>LEVEL 2</span>':'')+(level>=5?'<span>GRINDER</span>':'');
    if(room){
      const items=[['FIRST CHECK-IN','checkin'],['QUIZ MASTER','quiz'],['SECRET C','secret'],['COMMUNITY VOICE','rival']];
      room.innerHTML=items.map(([name,key])=>'<span class="ca-trophy '+(badges.includes(key)?'earned':'locked')+'">'+(badges.includes(key)?'🏆 ':'🔒 ')+name+'</span>').join('');
    }
    const claims=JSON.parse(localStorage.getItem(claimedKey)||'{}');
    const check=$('caCheckin');if(check){const done=claims[dayKey()];check.disabled=!!done;check.textContent=done?'CHECKED IN TODAY':'CLAIM +5 XP';}
  }
  renderProgress();
  const checkin=$('caCheckin');
  if(checkin)checkin.addEventListener('click',()=>{const claims=JSON.parse(localStorage.getItem(claimedKey)||'{}');if(claims[dayKey()])return;claims[dayKey()]=true;localStorage.setItem(claimedKey,JSON.stringify(claims));addXp(5,'checkin');notify('Daily check-in complete: +5 activity XP!');});
  const quizButtons=universe.querySelectorAll('[data-answer]');
  quizButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const claims=JSON.parse(localStorage.getItem(quizKey)||'{}'),feedback=$('caQuizFeedback');
    if(claims[dayKey()]){if(feedback)feedback.textContent='You have already completed today’s quiz.';return;}
    if(btn.dataset.answer==='a'){claims[dayKey()]=true;localStorage.setItem(quizKey,JSON.stringify(claims));addXp(5,'quiz');if(feedback)feedback.textContent='Correct! +5 activity XP earned.';notify('Quiz completed! +5 activity XP.');}
    else if(feedback)feedback.textContent='Not quite. Try another answer.';
  }));
  const vault=$('caVaultUnlock');
  if(vault)vault.addEventListener('click',()=>{const input=$('caVaultCode'),feedback=$('caVaultFeedback');if((input.value||'').trim().toUpperCase()==='CARLO'){if(!badges.includes('secret'))addXp(10,'secret');if(feedback)feedback.textContent='Secret C unlocked! +10 activity XP.';notify('Secret badge unlocked!');}else if(feedback)feedback.textContent='That code did not unlock the vault. Try again.';});
  universe.querySelectorAll('[data-rival]').forEach(btn=>btn.addEventListener('click',()=>{localStorage.setItem('ca_rival_vote_v1',btn.dataset.rival);addXp(2,'rival');const feedback=$('caRivalFeedback');if(feedback)feedback.textContent='Your local demo vote: '+btn.dataset.rival+'. +2 activity XP.';universe.querySelectorAll('[data-rival]').forEach(b=>b.disabled=true);}));

})();
