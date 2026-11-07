/* ==========================================================================
   HPSA SITE SETTINGS  -  this is the one file you edit for most changes.
   Only change the text between the quote marks. Keep the commas and quotes.
   ========================================================================== */

window.HPSA = {

  /* ---- Names ---------------------------------------------------------- */
  siteName: "HPSA",
  fullName: "Hendon Park Sports Association",

  /* ---- COUNTDOWN (top of the home page) -------------------------------
     You can change the countdown as many times as you like. List every
     event you want, and the site always counts down to the NEXT one that
     hasn't happened yet. When one passes, it moves to the next on its own.

     Date format:  "YYYY-MM-DD HH:MM"  in 24-hour time, Toronto time.
     Example: "2027-05-03 18:30"  means May 3, 2027 at 6:30 PM.

     EASIER OPTION: keep the list in a Google Sheet instead (columns named
     Label and Date), publish that tab as CSV, and paste the link in
     sheetUrl below. Then you never have to touch this file for countdowns.
     If sheetUrl has a link, it is used instead of the list below.         */
  countdown: {
    sheetUrl: "",
    events: [
      { label: "Final Payment Due", date: "2027-02-28 23:59" }   // end of day, Toronto time
    ],
    afterMessage: "Final payment is now due. Pick your division below for the latest standings."
  },

  /* ---- DIVISIONS -------------------------------------------------------
     For each division, paste the "Publish to web" CSV link of the
     standings tab and the leaders tab (File > Share > Publish to web >
     choose the tab > Comma-separated values (.csv)).
     While a link is empty, the site shows SAMPLE data so you can see
     the layout.                                                           */
  divisions: {
    monday: {
      name: "Monday",
      label: "Division 5",
      standingsUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vST4tdwmHnIc2vsD2i8rw3ezjpMmjXbHuSQIzMPrZ9FNstdFRRxJ94D2b3r5RaoOufs1PiL9bZOqups/pub?gid=1161560956&single=true&output=csv",
      leadersUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Sgq4hJvvpr5x-F5wFaqJsy7XVhZTcWAZDi8UChvq8t_LBo19xdrOkrMODwp25JeEiBPop0pUVw8C/pub?gid=0&single=true&output=csv"
    },
    tuesday: {
      name: "Tuesday",
      label: "Division 3",
      standingsUrl: "",
      leadersUrl: ""
    },
    wednesday: {
      name: "Wednesday",
      label: "Division 4",
      standingsUrl: "",
      leadersUrl: ""
    }
  },

  /* ---- TEAM PAGES -------------------------------------------------------
     A team listed here gets its own page (click the team name in the
     standings): season totals plus a page for every game.
     The key is the team name in lowercase with dashes instead of spaces.

       seasonUrl : the published CSV of the team's season totals tab.
       gamesUrl  : the published CSV of ONE combined tab with a row for every
                   player in every game (see HOW-TO-UPDATE.md, section 4).
                   Leave it empty until that tab exists.                      */
  teams: {
    "globo-gym-purple-cobras": {
      name: "Globo Gym Purple Cobras",
      division: "monday",
      seasonUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Sgq4hJvvpr5x-F5wFaqJsy7XVhZTcWAZDi8UChvq8t_LBo19xdrOkrMODwp25JeEiBPop0pUVw8C/pub?gid=0&single=true&output=csv",
      gamesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2Sgq4hJvvpr5x-F5wFaqJsy7XVhZTcWAZDi8UChvq8t_LBo19xdrOkrMODwp25JeEiBPop0pUVw8C/pub?gid=949594357&single=true&output=csv"
    }
  },

  /* In the leaders table, these stats rank lowest-first when sorted
     (so the first click on ERA shows the best, i.e. lowest, ERA).         */
  lowerIsBetter: ["ERA", "WHIP"],

  /* How many leaders to show before "Show all". */
  leadersToShow: 10,

  /* ---- TEAM LOGOS ------------------------------------------------------
     To add a logo: upload an image into the "logos" folder, named after
     the team in lowercase with dashes instead of spaces, e.g.
         Globo Gym Purple Cobras  ->  logos/globo-gym-purple-cobras.png
         Rosie's Degenerates      ->  logos/rosies-degenerates.png
         nWo                      ->  logos/nwo.png
     .png, .jpg and .webp all work. A team with no logo gets a coloured
     badge with its initials.
     If a file name doesn't follow that pattern, list it here instead:     */
  logos: {
    // "Team Name": "logos/some-other-file-name.png"
  },
  logoExtensions: ["png", "jpg", "webp"],

  /* ---- MENU ------------------------------------------------------------ */
  nav: [
    { label: "Divisions", children: [
      { label: "Monday (Division 5)",    href: "monday.html" },
      { label: "Tuesday (Division 3)",   href: "tuesday.html" },
      { label: "Wednesday (Division 4)", href: "wednesday.html" }
    ]},
    { label: "Schedule",             href: "schedule.html" },
    { label: "Playoffs",             href: "playoffs.html" },
    { label: "Rules and Resources",    href: "rules.html" },
    { label: "Community Businesses", href: "businesses.html" },
    { label: "Free Agency",          href: "free-agency.html" },
    { label: "HPSA History",         href: "history.html" },
    { label: "Contact Us",           href: "contact.html" }
  ]
};
