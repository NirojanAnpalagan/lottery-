/* data.js
   - SEED: orgs, games, results, upcoming
   - TRANSLATIONS: en, si (Sinhala), ta (Tamil)
*/

const SEED = (function(){
  const uid = (p) => `${p}-${Math.random().toString(36).slice(2,9)}`;

  const orgs = [
    { code: "DLB", name: "Development Lotteries Board", color: "dlb" },
    { code: "NLB", name: "National Lotteries Board", color: "nlb" },
    { code: "SL4D", name: "Sri Lanka 4D", color: "sl4d" },
  ];

  const games = [
    { id: uid("g"), name: "Ada Kotipathi", org: "DLB", picks: 6, range: 49, price: 120, drawsPerWeek: 3, schedule: "Mon, Wed, Fri 9:30 PM", description: "Pick 6 from 1–49. Jackpot rolls over." },
    { id: uid("g"), name: "Lagama Wasana", org: "DLB", picks: 4, range: 40, price: 60, drawsPerWeek: 2, schedule: "Tue, Thu 9:00 PM", description: "Pick 4 from 1–40." },
    { id: uid("g"), name: "Sivandara", org: "DLB", picks: 5, range: 52, price: 80, drawsPerWeek: 2, schedule: "Sun, Wed 9:00 PM", description: "Pick 5 from 1–52." },
    { id: uid("g"), name: "Navajeewana", org: "DLB", picks: 6, range: 45, price: 100, drawsPerWeek: 1, schedule: "Sat 9:00 PM", description: "Pick 6 from 1–45." },
    { id: uid("g"), name: "Super Ball", org: "DLB", picks: 5, range: 50, price: 100, drawsPerWeek: 2, schedule: "Tue, Fri 9:15 PM", description: "Pick 5 from 1–50." },
    { id: uid("g"), name: "Zeroplus", org: "DLB", picks: 6, range: 49, price: 120, drawsPerWeek: 1, schedule: "Thu 9:15 PM", description: "Pick 6 from 1–49." },
    { id: uid("g"), name: "Mega Plus", org: "DLB", picks: 5, range: 45, price: 80, drawsPerWeek: 3, schedule: "Mon, Wed, Sat 9:15 PM", description: "Pick 5 from 1–45." },
    { id: uid("g"), name: "Shanida Wasana", org: "DLB", picks: 6, range: 49, price: 120, drawsPerWeek: 1, schedule: "Sat 9:30 PM", description: "Saturday special draw." },

    { id: uid("g"), name: "Mahajana Sampatha", org: "NLB", picks: 6, range: 45, price: 100, drawsPerWeek: 3, schedule: "Tue, Thu, Sun 9:30 PM", description: "Pick 6 from 1–45." },
    { id: uid("g"), name: "Govisetha", org: "NLB", picks: 6, range: 45, price: 100, drawsPerWeek: 2, schedule: "Mon, Fri 9:30 PM", description: "Pick 6 from 1–45." },
    { id: uid("g"), name: "Jaya Sri", org: "NLB", picks: 6, range: 45, price: 60, drawsPerWeek: 2, schedule: "Wed, Sat 9:30 PM", description: "Pick 6 from 1–45." },
    { id: uid("g"), name: "Supiri Vasana", org: "NLB", picks: 5, range: 36, price: 60, drawsPerWeek: 3, schedule: "Mon, Wed, Fri 9:00 PM", description: "Pick 5 from 1–36." },
    { id: uid("g"), name: "Mega Power", org: "NLB", picks: 6, range: 49, price: 120, drawsPerWeek: 1, schedule: "Thu 9:30 PM", description: "Pick 6 from 1–49." },
    { id: uid("g"), name: "Wasana Sampatha", org: "NLB", picks: 4, range: 30, price: 40, drawsPerWeek: 2, schedule: "Tue, Fri 9:00 PM", description: "Pick 4 from 1–30." },
    { id: uid("g"), name: "Dhana Nidhanaya", org: "NLB", picks: 6, range: 49, price: 120, drawsPerWeek: 1, schedule: "Sun 9:30 PM", description: "Pick 6 from 1–49." },
    { id: uid("g"), name: "Sanwardana Wasana", org: "NLB", picks: 5, range: 45, price: 80, drawsPerWeek: 2, schedule: "Mon, Thu 9:10 PM", description: "Pick 5 from 1–45." },
    { id: uid("g"), name: "Neeroga", org: "NLB", picks: 5, range: 45, price: 60, drawsPerWeek: 1, schedule: "Sat 9:10 PM", description: "Pick 5 from 1–45." },
    { id: uid("g"), name: "Kapruka", org: "NLB", picks: 6, range: 49, price: 120, drawsPerWeek: 1, schedule: "Wed 9:30 PM", description: "Pick 6 from 1–49." },
    { id: uid("g"), name: "Sevana", org: "NLB", picks: 5, range: 36, price: 60, drawsPerWeek: 2, schedule: "Tue, Thu 9:00 PM", description: "Pick 5 from 1–36." },

    { id: uid("g"), name: "SL 4D Classic", org: "SL4D", picks: 4, range: 9, price: 50, drawsPerWeek: 7, schedule: "Daily 9:00 PM", description: "Pick any 4 digits (0–9) with exact order." },
    { id: uid("g"), name: "SL 4D Box", org: "SL4D", picks: 4, range: 9, price: 80, drawsPerWeek: 7, schedule: "Daily 9:00 PM", description: "Pick 4 digits (0–9), any order." },
    { id: uid("g"), name: "SL 3D", org: "SL4D", picks: 3, range: 9, price: 40, drawsPerWeek: 7, schedule: "Daily 9:00 PM", description: "Pick 3 digits (0–9)." },
    { id: uid("g"), name: "SL 2D", org: "SL4D", picks: 2, range: 9, price: 30, drawsPerWeek: 7, schedule: "Daily 9:00 PM", description: "Pick 2 digits (0–9)." },
    { id: uid("g"), name: "SL Zodiac", org: "SL4D", picks: 4, range: 9, price: 70, drawsPerWeek: 7, schedule: "Daily 9:00 PM", description: "4-digit with zodiac bonus." },
  ];

  const today = new Date();
  const results = [];
  const upcoming = [];
  const randomPick = (picks, range) => {
    if (range === 9) return Array.from({ length: picks }, () => Math.floor(Math.random() * 10));
    const pool = Array.from({ length: range }, (_, i) => i + 1);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, picks).sort((a,b)=>a-b);
  };

  for (const g of games) {
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - (i * (7 / Math.max(1,g.drawsPerWeek))));
      results.push({
        id: uid("r"),
        gameId: g.id,
        gameName: g.name,
        org: g.org,
        drawNo: 1000 + i,
        date: d.toISOString().slice(0,10),
        numbers: randomPick(g.picks, g.range),
        prizePoolLKR: 5_000_000 + Math.floor(Math.random() * 30_000_000),
        jackpot: 20_000_000 + Math.floor(Math.random() * 100_000_000),
        range: g.range
      });
    }
    const next = new Date(today);
    next.setDate(next.getDate() + 1);
    upcoming.push({
      id: uid("u"),
      gameId: g.id,
      gameName: g.name,
      org: g.org,
      date: next.toISOString().slice(0,10),
      time: "21:00",
      estJackpot: 25_000_000 + Math.floor(Math.random() * 120_000_000),
    });
  }

  const TRANSLATIONS = {
    en: {
      title: "Sri Lankan Lottery — Results, Games & Ticket Checker",
      brandTitle: "Sri Lankan Lottery",
      brandSubtitle: "Daily Results • Game Browser • Ticket Checker",
      nav: { dashboard: "Dashboard", games: "Games", checker: "Check Ticket", results: "Latest Results" },
      cta: { checkTicket: "Check My Ticket", browseGames: "Browse Games" },
      dashboard: { title: "Today’s Sri Lankan Lottery Update", subtitle: "Live snapshot of the latest draws, jackpots, and upcoming schedules across DLB, NLB, and SL4D.", latestResults: "Latest Results", upcoming: "Upcoming Draws" },
      stat: { dlb: "DLB Games", nlb: "NLB Games", sl4d: "SL4D Games", total: "Total Games" },
      btn: { viewAll: "View all" },
      games: { search: "Search games by name…", pickLabel: "Pick", rangeDigits: "digits 0–9", numberOfPicks: "Number of Picks:", numberRange: "Number Range:", ticketPrice: "Ticket Price:", schedule: "Schedule:", drawsPerWeek: "Draws/Week:" },
      checker: { title: "Ticket Result Checker", step1: "Step 1 — Select a Game", step2: "Step 2 — Choose a Draw", step3: "Step 3 — Enter Your Numbers", checkBtn: "Check Ticket", clearBtn: "Clear", selectGameInfo: "Choose a lottery game to see its rules.", selectDraw: "Select a draw…", rules: "Rules:", picks: "picks", digitLabel: "Digit", ready: "Ready to check your numbers.", pickDraw: "Pick a draw to check your ticket.", alertSelectGameDraw: "Please select a game and a draw.", alertFillDigits: "Please set all digits.", alertSelectNumbers: "Please select the required numbers.", resultFor: "Result for", winningNumbers: "Winning Numbers", yourNumbers: "Your Numbers", noPrize: "No Prize", jackpot: "Jackpot", firstPrize: "First Prize", secondPrize: "Second Prize", thirdPrize: "Third Prize" },
      results: { search: "Search game name or draw #", from: "From", to: "To" },
      footer: { copy: "Sri Lankan Lottery (Demo)", note: "DLB / NLB / SL4D — sample data for demo purposes" },
      other: { allOrgs: "All Organizations", matches: "Matches", prizeTier: "Prize Tier", estimatedPrize: "Estimated Prize", noData: "No data found" }
    },
    si: {
      title: "ශ්‍රී ලංකා ලොතරැයි — ප්‍රතිඵල, ක්‍රීඩා සහ ටිකට් පරික්ෂකය",
      brandTitle: "ශ්‍රී ලංකා ලොතරැයි",
      brandSubtitle: "දිනපතා ප්‍රතිඵල • ක්‍රීඩා බ්‍රවුසරය • ටිකට් පරීක්ෂාව",
      nav: { dashboard: "මුල් පිටුව", games: "ක්‍රීඩා", checker: "ටිකට් පරීක්ෂණය", results: "නවතම ප්‍රතිඵල" },
      cta: { checkTicket: "මගේ ටිකට් පරීක්ෂා කරන්න", browseGames: "ක්‍රීඩා බැලියි" },
      dashboard: { title: "අද ශ්‍රී ලංකා ලොතරැයි යාවත්කාලීන", subtitle: "DLB, NLB සහ SL4D හි නවතම සෑදීම්, ජැක්පොට් හා ඉදිරි කාල සටහන්", latestResults: "නවතම ප්‍රතිඵල", upcoming: "ඉදිරි සෑදීම්" },
      stat: { dlb: "DLB ක්‍රීඩා", nlb: "NLB ක්‍රීඩා", sl4d: "SL4D ක්‍රීඩා", total: "මුළු ක්‍රීඩා" },
      btn: { viewAll: "සියලුම බලන්න" },
      games: { search: "ක්‍රීඩා නාමය අනුව සෙවීම…", pickLabel: "තෝරන්න", rangeDigits: "අංක 0–9", numberOfPicks: "තෝරා ගැනීමේ ගණන:", numberRange: "අංක පරාසය:", ticketPrice: "ටිකට් මිල:", schedule: "අනුකූලය:", drawsPerWeek: "සතියට ඇඳුම්:" },
      checker: { title: "ටිකට් ප්‍රතිඵල පරීක්ෂකය", step1: "පියවර 1 — ක්‍රීඩාව තෝරන්න", step2: "පියවර 2 — ඇඳුම තෝරන්න", step3: "පියවර 3 — ඔබේ අංක ඇතුළත් කරන්න", checkBtn: "ටිකට් පරීක්ෂා කරන්න", clearBtn: "පිරිසිදු කරන්න", selectGameInfo: "ක්‍රීඩාවක් තෝරා නීති බලන්න.", selectDraw: "ඇඳුම තෝරන්න…", rules: "නීති:", picks: "තෝරා ගැනීම්", digitLabel: "අංක", ready: "ඔබේ අංක පරීක්ෂා කිරීමට සූදානම්යි.", pickDraw: "පරීක්ෂා කිරීමට ඇඳුමක් තෝරන්න.", alertSelectGameDraw: "කරුණාකර ක්‍රීඩාවක් හා ඇඳුමක් තෝරන්න.", alertFillDigits: "සියලුම අංක සකසන්න.", alertSelectNumbers: "අවශ්ය අංක තෝරන්න.", resultFor: "ප්‍රතිඵලය", winningNumbers: "ජයගත් අංක", yourNumbers: "ඔබේ අංක" , noPrize: "ප්‍රසාද නොමැත", jackpot: "ජැක්පොට්", firstPrize: "ප්‍රථම බඩු", secondPrize: "දෙවන බඩු", thirdPrize: "තුන්වන බඩු" },
      results: { search: "ක්‍රීඩා නාමය හෝ ඇඳුම් # අනුව සෙවීම", from: "සිට", to: "ට" },
      footer: { copy: "ශ්‍රී ලංකා ලොතරැයි (Pradarshana)", note: "DLB / NLB / SL4D — පෙන්වා දුන් දත්ත" },
      other: { allOrgs: "සියලු සංවිධාන", matches: "ගැලපීම්", prizeTier: "බඩුව මට්ටම", estimatedPrize: "අනුමාන කළ බඩු", noData: "දත්ත නොමැත" }
    },
    ta: {
      title: "இலங்கை லாட்டரி — முடிவுகள், விளையாட்டுகள் மற்றும் சீட்டு சரிபார்",
      brandTitle: "இலங்கை லாட்டரி",
      brandSubtitle: "தினசரி முடிவுகள் • விளையாட்டு உலா • சீட்டு சரிபார்",
      nav: { dashboard: "மேற்பார்வை", games: "விளையாட்டுகள்", checker: "சீட்டு சரிபார்", results: "முடிவுகள்" },
      cta: { checkTicket: "என் சீட்டைக் சரிபார்", browseGames: "விளையாட்டுகளை உலா" },
      dashboard: { title: "இன்றைய இலங்கை லாட்டரி தகவல்", subtitle: "DLB, NLB மற்றும் SL4D இல் சமீபத்திய வெற்றி எண்கள், ஜாக்பாட்கள் மற்றும் எதிர்கால அட்டவணைகள்", latestResults: "சமீபத்திய முடிவுகள்", upcoming: "வரவிருக்கும் இழுப்புகள்" },
      stat: { dlb: "DLB விளையாட்டுகள்", nlb: "NLB விளையாட்டுகள்", sl4d: "SL4D விளையாட்டுகள்", total: "மொத்த விளையாட்டுகள்" },
      btn: { viewAll: "அனைத்தையும் பார்க்க" },
      games: { search: "விளையாட்டு பெயரை தேடவும்…", pickLabel: "தெறிவு", rangeDigits: "எண்கள் 0–9", numberOfPicks: "தேர்வு எண்ணிக்கை:", numberRange: "எண் வரம்பு:", ticketPrice: "காசோலை விலை:", schedule: "அட்டவணை:", drawsPerWeek: "வாரம் தோற்றங்கள்:" },
      checker: { title: "சீட்டு முடிவு சரிபார்", step1: "படி 1 — ஒரு விளையாட்டைத் தேர்ந்தெடுக்கவும்", step2: "படி 2 — ஒரு டிராவை தேர்ந்தெடுக்கவும்", step3: "படி 3 — உங்கள் எண்களை உள்ளிடவும்", checkBtn: "சீட்டு சரிபார்", clearBtn: "நீக்கு", selectGameInfo: "விளையாட்டைத் தேர்ந்தெடுத்து விதிகளை காணவும்.", selectDraw: "டிராவை தேர்ந்தெடு…", rules: "விதிகள்:", picks: "தேர்வுகள்", digitLabel: "அலகு", ready: "உங்கள் எண்களை சரிபார்க்க தயார்.", pickDraw: "உங்கள் சீட்டை சரிபார்க்க டிராவை தேர்ந்தெடுக்கவும்.", alertSelectGameDraw: "தயவுசெய்து விளையாட்டு மற்றும் டிராவை தேர்ந்தெடுக்கவும்.", alertFillDigits: "அனைத்து இலக்கங்களையும் நிரப்பவும்.", alertSelectNumbers: "தேவையான எண்களை தேர்ந்தெடுக்கவும்.", resultFor: "முடிவு", winningNumbers: "வெற்றி எண்கள்", yourNumbers: "உங்கள் எண்கள்", noPrize: "பரிசு கிடைக்கவில்லை", jackpot: "ஜாக்பாட்", firstPrize: "முதல் பரிசு", secondPrize: "இரண்டாம் பரிசு", thirdPrize: "மூன்றாம் பரிசு" },
      results: { search: "விளையாட்டு பெயர் அல்லது டிரா # மூலம் தேடவும்", from: "முதல்", to: "இறுதியில்" },
      footer: { copy: "இலங்கை லாட்டரி (டெமோ)", note: "DLB / NLB / SL4D — டெமோ தரவுகள்" },
      other: { allOrgs: "அனைத்து அமைப்புகள்", matches: "பொருத்தங்கள்", prizeTier: "வெற்றி நிலை", estimatedPrize: "கணிக்கப்பட்ட பரிசு", noData: "தரவு இல்லை" }
    }
  };

  return { orgs, games, results, upcoming, TRANSLATIONS };
})();
