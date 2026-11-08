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


  // Globo Gym team page sample: invented players, 17 games (14 played, 3 still to play).
  (function () {
    var r = rng(77);
    var NAMES = ["Sample Player A", "Sample Player B", "Sample Player C", "Sample Player D", "Sample Player E",
                 "Sample Player F", "Sample Player G", "Sample Player H", "Sample Player I", "Sample Player J"];
    var OPP = ["Vendetta", "Crew", "Shift Disturbers", "Dodgers", "Rosie’s Degenerates", "Gugger", "Face Melters"];
    var MON = ["May", "Jun", "Jul", "Aug", "Sep"];
    var STATS = ["At Bats", "Hits", "Runs", "RBI", "1B", "2B", "3B", "HR", "SB", "BB", "SO", "SF"];
    function r3(n) { var t = n.toFixed(3); return n < 1 ? t.replace(/^0/, "") : t; }
    function rates(a) {
      var avg = a.ab ? a.h / a.ab : null;
      var pa = a.ab + a.bb + a.sf;
      var obp = pa ? (a.h + a.bb) / pa : null;
      var slg = a.ab ? (a.b1 + 2 * a.b2 + 3 * a.b3 + 4 * a.hr) / a.ab : null;
      return [avg === null ? "" : r3(avg), obp === null ? "" : r3(obp), slg === null ? "" : r3(slg)];
    }
    var totals = NAMES.map(function () { return { ab: 0, h: 0, r: 0, rbi: 0, b1: 0, b2: 0, b3: 0, hr: 0, sb: 0, bb: 0, so: 0, sf: 0 }; });
    var games = [["Game", "Opponent", "Date", "Result", "Player Name"].concat(STATS, ["AVG", "OBP", "SLG"])];
    for (var g = 1; g <= 17; g++) {
      var d = new Date(2026, 4, 4 + 7 * (g - 1));
      var date = MON[d.getMonth() - 4] + " " + d.getDate();
      var played = g <= 14, opp = OPP[(g - 1) % OPP.length], teamRuns = 0, rows = [];
      NAMES.forEach(function (n, k) {
        var here = played && r() < 0.82;
        if (!here) { rows.push([n].concat(STATS.map(function () { return ""; }), ["", "", ""])); return; }
        var a = { ab: 3 + Math.floor(r() * 3), h: 0, r: 0, rbi: 0, b1: 0, b2: 0, b3: 0, hr: 0, sb: 0, bb: r() < 0.25 ? 1 : 0, so: r() < 0.1 ? 1 : 0, sf: r() < 0.08 ? 1 : 0 };
        for (var i = 0; i < a.ab; i++) {
          if (r() < 0.5) {
            a.h++;
            var x = r();
            if (x < 0.12) a.hr++; else if (x < 0.16) a.b3++; else if (x < 0.34) a.b2++; else a.b1++;
          }
        }
        a.r = Math.floor(r() * (a.h + 1.6));
        a.rbi = a.hr + Math.floor(r() * (a.h + 1));
        teamRuns += a.r;
        var t = totals[k];
        Object.keys(t).forEach(function (key) { t[key] += a[key]; });
        rows.push([n, a.ab, a.h, a.r, a.rbi, a.b1, a.b2, a.b3, a.hr, a.sb, a.bb, a.so, a.sf].concat(rates(a)).map(String));
      });
      var oppRuns = Math.max(0, Math.round(teamRuns + (r() - 0.5) * 12));
      var result = !played ? "" : (teamRuns > oppRuns ? "W " : teamRuns < oppRuns ? "L " : "T ") + teamRuns + "-" + oppRuns;
      rows.forEach(function (row) { games.push(["Game " + g, played ? opp : "", played ? date : "", result].concat(row)); });
    }
    var season = [["Player Name"].concat(STATS, ["AVG", "OBP", "SLG"])];
    NAMES.forEach(function (n, k) {
      var t = totals[k];
      season.push([n, t.ab, t.h, t.r, t.rbi, t.b1, t.b2, t.b3, t.hr, t.sb, t.bb, t.so, t.sf].concat(rates(t)).map(String));
    });
    window.HPSA_SAMPLE.teams = { "globo-gym-purple-cobras": { season: csv(season), games: csv(games) } };
  })();

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

  // Sample schedules (same columns as the league's schedule tab). Used only when a division has no scheduleUrl.
  (function () {
    var r = rng(5);
    function sched(teams, dow, rounds, played) {
      var n = teams.length, arr = teams.slice(), rows = [["Date", "Home Team", "Away Team", "Home Score", "Away Score", "Status", "", "Week"]];
      for (var w = 0; w < rounds; w++) {
        var d = new Date(2026, 4, 4 + dow + 7 * w);
        var date = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
        var mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
        for (var i = 0; i < n / 2; i++) {
          var a = arr[i], b = arr[n - 1 - i];
          var home = (w + i) % 2 ? b : a, away = home === a ? b : a;
          var done = w < played, hs = "", as = "";
          if (done) { hs = String(2 + Math.floor(r() * 12)); as = String(2 + Math.floor(r() * 12)); if (hs === as) hs = String(+hs + 1); }
          rows.push([date, home, away, hs, as, done ? "Played Normally" : "", mon + " " + d.getDate() + " - " + home + " vs " + away, "Week " + (w + 1)]);
        }
        arr.splice(1, 0, arr.pop());
      }
      return csv(rows);
    }
    window.HPSA_SAMPLE.monday.schedule = sched(["Vendetta", "Crew", "Shift Disturbers", "Globo Gym Purple Cobras", "Rosie's Degenerates", "Gugger", "Face Melters", "Dodgers"], 0, 7, 3);
    window.HPSA_SAMPLE.tuesday.schedule = sched(["Sunny’s Gym", "Scared Hitless", "Athletic Knit Athletics", "Bulldogs"], 1, 6, 2);
    window.HPSA_SAMPLE.wednesday.schedule = sched(["Caciques", "Cardinal Marble", "Moose Knuckles", "nWo", "The Sailor Saints", "The Batstreet Boys", "South Park Cows", "Parkview Athletics"], 2, 7, 2);
  })();

  // Sample playoff bracket (same columns as the league's playoffs tab, plus Round and the score columns).
  window.HPSA_SAMPLE.playoffs = csv([
    ["Date", "Time", "Diamond", "Division", "Home", "Away", "Round", "Home Score", "Away Score"],
    ["Monday Aug 31", "7:00 PM", "Lam 2", "5A", "Globo Gym Purple Cobras", "Shift Disturbers", "A - Semi", "11", "8"],
    ["Monday Aug 31", "9:00 PM", "Lam 2", "5A", "Vendetta", "Dodgers", "A - Semi", "16", "12"],
    ["Monday Aug 31", "7:00 PM", "Lam 1", "5B", "5", "8", "B - Semi", "", ""],
    ["Monday Aug 31", "9:00 PM", "Lam 1", "5B", "6", "7", "B - Semi", "", ""],
    ["Tuesday Sep 1", "7:00 PM", "Hendon West", "3", "2", "3", "Semi", "", ""],
    ["Tuesday Sep 1", "9:00 PM", "Hendon West", "3", "1", "4", "Semi", "", ""],
    ["Wednesday Sep 2", "7:00 PM", "Lam 2", "4A", "2", "3", "A - Semi", "", ""],
    ["Wednesday Sep 2", "9:00 PM", "Lam 2", "4A", "1", "4", "A - Semi", "", ""],
    ["Tuesday Sep 8", "7 or 9", "Hendon West", "3", "1", "2", "Game 1 Finals", "", ""],
    ["Tuesday Sep 8", "7 or 9", "Hendon West", "5A", "Vendetta", "Globo Gym Purple Cobras", "Game 1 Finals", "8", "18"],
    ["Wednesday Sep 9", "7:00 PM", "Lam 1", "5B", "5", "6", "B Championship", "", ""],
    ["Monday Sep 14", "7:00 PM", "Lam 2", "5A", "Globo Gym Purple Cobras", "Vendetta", "Game 2 A Finals", "", ""],
    ["Tuesday Sept 15 or Wednesday Sept 16", "7 or 9", "TBD", "5A", "Vendetta", "Globo Gym Purple Cobras", "Game 3 if needed", "", ""]
  ]);
})();
