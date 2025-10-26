document.addEventListener('DOMContentLoaded', function() {
  lucide.createIcons();
  renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false},
      {left: '\\(', right: '\\)', display: false},
      {left: '\\[', right: '\\]', display: true}
    ],
    throwOnError: false
  });
});

(function() {
  var originalTitle = document.title;
  var titles = [
    "Im telling ur other tabs about this",
    "Wait... where are you going?",
    'Lonely • Akon',
    "Do tabs dream too?",
    "The tab you left behind",
    "Don't worry I’ll just sit here",
    "Wow. Rude.",
    "If you loved me you'd stay",
    "I saved your seat!",
    "Gone but not forgotten...",
    "Hold up, where you goin'?",
    "You left me with the chores!",
    "Fine. I didn’t want you anyway.",
    'Leaving me for *that* tab?',
    "Your FBI agent is disappointed"
  ];
  var lastIndex = -1;
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      var idx;
      do {
        idx = Math.floor(Math.random() * titles.length);
      } while (idx === lastIndex && titles.length > 1);
      lastIndex = idx;
      document.title = titles[idx];
    } else {
      document.title = originalTitle;
    }
  });
})();
