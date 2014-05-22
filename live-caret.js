$(function() {
  // keep track of our position and pass to our presence
  $('input[type=text], textarea').bind('keypress click', function() {
    var range = $(this).range();
    Session.set('caretRange', {
      name: $(this).attr('name'),
      start: range.start,
      end: range.end,
      length: range.length
    });
  });

  // create a caret for each matching element, in order to show the other users position
  // $('input[type="text"], textarea').each(function() {
    // var fontSize = getComputedStyle($(this)[0]).getPropertyValue('font-size');
  
  var fontSize = '12px';

  var rect = document.createElement('div');

  document.body.appendChild(rect);

  // rect.setAttribute('data-caret-name', $(this).attr('name'));
  rect.style.position = 'absolute';
  rect.style.backgroundColor = 'red';
  rect.style.height = fontSize;
  rect.style.width = '2px';
  rect.style.display = 'none';
  rect.className = 'caret';
  // });
});

Presence.state = function() {
  return {
    caretRange: Session.get('caretRange')
  };
};

var setCaretPosition = function(name, coordinates) {
  var field = $('[name=' + name + ']')[0];
  // var caret = $('[data-caret-name=' + name + ']');
  var caret = $('.caret');
  caret.css('display', 'block');

  caret.css('top', field.offsetTop - field.scrollTop + coordinates.top);
  caret.css('left', field.offsetLeft - field.scrollLeft + coordinates.left);

  console.log(field, caret, coordinates);
};

// get the caretRange from the presence, calculate the coordinates
var updateCaret = function(fields) {
  var caretRange = fields.state.caretRange;
  var position = caretRange.end;
  var coordinates = getCaretCoordinates($('[name=' + caretRange.name + ']')[0], position);
  console.log(position, coordinates);

  setCaretPosition(caretRange.name, coordinates);
};

Meteor.startup(function() {
  Deps.autorun(function() {
    Presences.find(Session.get('caretWatchConnectionId')).observeChanges({
      added: function(id, fields) {
        updateCaret(fields);
      },
      changed: function(id, fields) {
        updateCaret(fields);
      },
      removed: function(id) {
        updateCaret(fields);
      }
    });
  });
});
