Package.describe({
  summary: "Track caret position"
});

Package.on_use(function (api) {
  api.use(['presence', 'iron-router']);
  api.use(['jquery', 'caret-position'], 'client');
  api.add_files('jquery.caret.js', 'client');
  api.add_files('live-caret.js', 'client');

  api.export('liveCaret', 'client');
});
