$(function() {
  $('input[type=text], textarea').bind('keypress click', function() {
    var range = $(this).range();
    Session.set('caretRange', {
      name: $(this).attr('name'),
      start: range.start,
      end: range.end,
      length: range.length
    });
  });
});

Presence.state = function() {
  return {
    caretRange: Session.get('caretRange')
  };
};

var getPos = function(fields) {
  var caretRange = fields.state.caretRange;
  var position = caretRange.end;
  var coordinates = getCaretCoordinates($('[name=' + caretRange.name + ']')[0], position);
  console.log(position, coordinates);
};

Meteor.startup(function() {
  Deps.autorun(function() {
    Presences.find(Session.get('caretWatchConnectionId')).observeChanges({
      added: function(id, fields) {
        getPos(fields);
      },
      changed: function(id, fields) {
        getPos(fields);
      },
      removed: function(id) {
        getPos(fields);
      }
    });
  });
});
