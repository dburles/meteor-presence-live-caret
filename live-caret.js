liveCaret = {};

// default
liveCaret.bindTo = 'body';

var eventMap = [
  'form.live-caret input[type=text]',
  'form.live-caret textarea',
  'form.live-caret input[type=email]'
].join(", ");

liveCaret.bindLiveCaret = function() {
  // keep track of our position and pass to our presence
  $(eventMap).bind('keyup click', function() {
    var form = $(this).parents('form');
    var range = $(this).range();

    Session.set('caretRange', {
      form: form.attr('id'),
      name: $(this).attr('name'),
      start: range.start,
      end: range.end,
      length: range.length
    });
  });
};

Presence.state = function() {
  return {
    route: Router.current() && Router.current().path,
    caretRange: Session.get('caretRange')
  };
};

Meteor.startup(function() {
  Deps.autorun(function() {
    Presences.find();
  });
});

var createCaret = function(id) {
  var fontSize = '12px';

  var rect = document.createElement('div');

  rect.setAttribute('data-id', id);
  rect.style.position = 'absolute';
  rect.style.backgroundColor = _.first(_.shuffle(['red', 'green', 'orange', 'blue', 'purple']));
  rect.style.height = fontSize;
  rect.style.width = '2px';
  rect.style.display = 'none';
  rect.className = 'lcaret';

  $(liveCaret.bindTo).append(rect);

  console.log('createCaret ' + id);
};

var setCaretPosition = function(id, form, fieldName, coordinates) {
  var field = $('form#' + form + ' [name=' + fieldName + ']')[0];
  var caret = $('.lcaret[data-id=' + id + ']');

  caret.css('display', 'block');
  caret.css('top', field.offsetTop - field.scrollTop + coordinates.top);
  caret.css('left', field.offsetLeft - field.scrollLeft + coordinates.left);

  console.log('setCaretPosition ' + id, coordinates);
};

// get the caretRange from the presence, calculate the coordinates
var updateCaret = function(id, fields) {
  var caretRange = fields.state.caretRange;
  var position = caretRange.end;
  var coordinates = getCaretCoordinates($('[name=' + caretRange.name + ']')[0], position);
  console.log(position, coordinates);

  setCaretPosition(id, caretRange.form, caretRange.name, coordinates);
};

var removeCaret = function(id) {
  $('.lcaret[data-id=' + id + ']').remove();
};

Meteor.startup(function() {
  Deps.autorun(function() {
    Presences.find({
      userId: { $ne: Meteor.userId() },
      'state.route': Router.current() && Router.current().path
    }).observeChanges({
      added: function(id, fields) {
        createCaret(id);

        // sometimes this isn't yet set
        if (! fields.state.caretRange)
          return;
        updateCaret(id, fields);
      },
      changed: function(id, fields) {
        updateCaret(id, fields);
      },
      removed: function(id) {
        removeCaret(id);
      }
    });
  });
});
