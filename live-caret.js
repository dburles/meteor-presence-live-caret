$(function() {
  $('input[type=text]').bind('keypress click', function() {
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