module.exports = function StateMachine(states, transitions) {
  this._states = {};
  this._transitions = {};
  this._currentState = null;
  this._stateHistory = [];

  states.forEach(function(state) {
    if(!state || (state instanceof Object && !state.name)) {
      throw new ReferenceError('States must be an object or a string');
    }

    if(typeof state === 'string') {
      state = {
        name: ''+state
      };
    }

    this._states[state.name] = state;

    if(state.default) {
      this._currentState = state;
    }

  }.bind(this));

  transitions.forEach(function(transition) {

    var matches;

    if(typeof transition === 'string' && (matches = transition.match(/^(.*)>(.*)$/))) {
      transition = {
        from: matches[1],
        to: matches[2]
      };
    }

    if(!(transition instanceof Object)) {
      throw new ReferenceError('Transitions must be objects with from and to members');
    }

    transition.from = (transition.from instanceof Object) ? transition.from : this._states[transition.from];
    transition.to = (transition.to instanceof Object) ? transition.to : this._states[transition.to];

    if(!transition.from || !transition.to) {
      throw new ReferenceError('Transitions from and to members must be valid states');
    }

    if(!transition.name) {
      transition.name = transition.from.name+'>'+transition.to.name;
    }

    this._transitions[transition.name] = transition;

  }.bind(this));

  if(!this._currentState) {
      this._currentState = this._states[states[0] instanceof Object ? states[0].name : states[0]];
    }
}

StateMachine.prototype.transitionTo = function(newState) {

  newState = (typeof newState === 'string') ? this._states[newState]: newState;

  var transition = Object.values(this._transitions).find(function(t) {
    return t.from === this._currentState && t.to === newState;
  }.bind(this));

  if(!transition) {
    throw new ReferenceError('No transition defined from current state "'+this._currentState.name+'" to new state "'+newState.name+'"');
  }

  if(transition.onPreTransition instanceof Function) {
    transition.onPreTransition(newState, this._currentState);
  }

  this._stateHistory.push(this._currentState);
  var oldState = this._currentState;
  this._currentState = newState;

  if(transition.onPostTransition instanceof Function) {
    transition.onPostTransition(this._currentState, oldState);
  }
};