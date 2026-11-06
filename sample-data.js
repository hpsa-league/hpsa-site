/* ==========================================================================
   SAMPLE DATA - only shown while a division has no sheet link in config.js.
   Players are made up. Once you add your real sheet links this file is
   ignored (you can delete it and its <script> line later if you like).
   ========================================================================== */
(function () {
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var FIRST = ["Alex", "Sam", "Jordan", "Chris", "Taylor", "Morgan", "Jamie", "Riley", "Casey", "Drew", "Dana", "Robin"];
  var LAST = ["Ng", "Silva", "Moreau", "Patel", "Kowalski", "Ibrahim", "Costa", "Murphy", "Tran", "Okafor", "Reid", "Sato", "Lang", "Duarte"];

  function csv(rows) {
    return rows.map(function (r) {
      return r.map(function (c) { return /[",\n]/.test(c) ? '"' + String(c).replace(/"/g, '""') + '"' : c; }).join(",");
    }).join("\n");
  }

  function make(teams, seed, games) {
    var r = rng(seed), used = {};
    var st = teams.map(function (t) {
      var ties = r() < 0.35 ? 1 + Math.floor(r() * 2) : 0;
      var skill = r();
      var w = Math.round(skill * (games - ties));
      var l = games - ties - w;
      var pct = (w + ties / 2) / games;
      var s = r(), run = 1 + Math.floor(r() * 4);
      var strk = ties && s < 0.12 ? "T1" : (s < 0.55 ? "W" : "L") + run;
      return { t: t, w: w, l: l, ties: ties, pct: pct, strk: strk };
    }).sort(function (a, b) { return b.pct - a.pct || b.w - a.w; });

    var standings = [["Pos", "Team", "W", "L", "T", "D", "Pct", "Strk"]];
    st.forEach(function (x, i) {
      var pos = i > 0 && st[i - 1].pct === x.pct ? standings[i][0] : String(i + 1);
      standings.push([pos, x.t, x.w, x.l, x.ties, 0, x.pct.toFixed(3), x.strk].map(String));
    });

    var players = [];
    teams.forEach(function (t) {
      for (var k = 0; k < 5; k++) {
        var name;
        do { name = FIRST[Math.floor(r() * FIRST.length)] + " " + LAST[Math.floor(r() * LAST.length)]; } while (used[name]);
        used[name] = 1;
        var ab = 30 + Math.floor(r() * 30);
        var h = Math.round(ab * (0.30 + r() * 0.42));
        var avg = h / ab;
        var obp = Math.min(1, avg + r() * 0.06);
        players.push({ n: name, t: t, ab: ab, h: h, r: Math.floor(r() * (h + 6)), rbi: Math.floor(r() * (h + 4)), avg: avg, obp: obp });
      }
    });
    players.sort(function (a, b) { return b.rbi - a.rbi || b.avg - a.avg; });
    var leaders = [["Rank", "Player", "Team", "AB", "H", "R", "RBI", "AVG", "OBP"]];
    players.slice(0, 24).forEach(function (p, i) {
      leaders.push([i + 1, p.n, p.t, p.ab, p.h, p.r, p.rbi, p.avg.toFixed(3), p.obp.toFixed(3)].map(String));
    });
    return { standings: csv(standings), leaders: csv(leaders) };
  }

  window.HPSA_SAMPLE = {
    monday: make(["Vendetta", "Globo Gym Purple Cobras", "Shift Disturbers", "Dodgers", "Rosie’s Degenerates", "Gugger", "Crew", "Face Melters"], 11, 17),
    tuesday: make(["Sunny’s Gym", "Scared Hitless", "Athletic Knit Athletics", "Bulldogs"], 23, 18),
    wednesday: make(["Caciques", "Cardinal Marble", "Moose Knuckles", "nWo", "The Sailor Saints", "The Batstreet Boys", "South Park Cows", "Parkview Athletics"], 37, 15)
  };

  // Monday leaders in the real column layout of the league's sheet (used only when no link is set).
  window.HPSA_SAMPLE.monday.leaders = csv([
    ["Player Name", "At Bats", "Hits", "Runs", "RBI", "1B", "2B", "3B", "HR", "SB", "BB", "SO", "SF", "AVG", "OBP", "SLG"],
    ["Mark Cummings", "58", "47", "41", "58", "21", "9", "2", "15", "0", "6", "0", "0", ".810", ".828", "1.810"],
    ["Michael Wexler", "61", "42", "37", "28", "30", "11", "1", "0", "0", "8", "0", "2", ".689", ".704", ".902"],
    ["Nicholas Lannutti", "52", "40", "36", "47", "20", "8", "0", "12", "0", "5", "0", "1", ".769", ".776", "1.615"],
    ["Kyle Kagan", "45", "34", "34", "31", "16", "12", "1", "5", "0", "2", "1", "0", ".756", ".766", "1.400"]
  ]);

  // Monday standings in the real column layout of the league's sheet (used only when no link is set).
  window.HPSA_SAMPLE.monday.standings = csv([
    ["Team", "GP", "W", "L", "T", "DEF", "PCT", "RS", "RA", "DIFF/GP"],
    ["Vendetta", "1", "1", "0", "0", "0", "1.000", "0", "0", "7.00"],
    ["Crew", "2", "1", "1", "0", "0", ".500", "0", "0", "-1.00"],
    ["Shift Disturbers", "2", "1", "1", "0", "1", ".500", "0", "0", "-2.00"],
    ["Globo Gym Purple Cobras", "0", "0", "0", "0", "0", ".000", "0", "0", "0.00"],
    ["Rosie's Degenerates", "0", "0", "0", "0", "0", ".000", "0", "0", "0.00"],
    ["Gugger", "0", "0", "0", "0", "0", ".000", "0", "0", "0.00"],
    ["Face Melters", "0", "0", "0", "0", "0", ".000", "0", "0", "0.00"],
    ["Dodgers", "1", "0", "1", "0", "0", ".000", "0", "0", "-1.00"]
  ]);
})();
