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

Meteor.startup(function() {
  Deps.autorun(function() {
    Presences.find(Session.get('caretWatchConnectionId')).observeChanges({
      added: function(id, fields) {
        var caretRange = fields.state.caretRange;
        var position = caretRange.end;
        var coordinates = getCaretCoordinates($('[name=' + caretRange.name + ']')[0], position);
        console.log('added', position, coordinates);
      },
      changed: function(id, fields) {
        var caretRange = fields.state.caretRange;
        var position = caretRange.end;
        var coordinates = getCaretCoordinates($('[name=' + caretRange.name + ']')[0], position);
        console.log('changed', position, coordinates);
      },
      removed: function(id) {
        var caretRange = fields.state.caretRange;
        var position = caretRange.end;
        var coordinates = getCaretCoordinates($('[name=' + caretRange.name + ']')[0], position);
        console.log('removed', position, coordinates);
      }
    });
  });
});
