Session.set('caretWatchConnectionId', Presences.findOne({_id:{$not:Meteor.connection._lastSessionId}})._id)

### Example

```html
<form id="my-form" class="live-caret">
  <input name="test" type="text">
</form>
```
