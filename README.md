# State Machine

Simple state machine with named states/transitions and pre- and post-transition callbacks.

## Basic example

Define a simple state machine with three states (`a`, `b` and `c`) that each permit a single transition to the next (wrapping from `c` around to `a`):

    > var StateMachine = require('state-machine');

    > var sm = new StateMachine(['a', 'b', 'c'], ['a>b', 'b>c', 'c>a']);

    > sm._currentState();

    < {name: "a"}

    > sm.transitionTo('b');

    > sm._currentState();

    < {name: "b"}

    > sm.transitionTo('a');

    < Uncaught ReferenceError: No transition defined from current state "b" to new state "a"

(Note that transitions between states are one-way.  Two-way transitions are considered two separate transitions.)

## More complex example (defined starting state, named transitions and pre and post-transition event handlers)

    > var StateMachine = require('state-machine');

    > var sm = new StateMachine(
        ['a', {name:'b', default:true}, 'c'],
        ['a>b', {
          from:'b',
          to:'c',
          name:'BtoCtransition',
          onPreTransition:function(to, from) { console.log('About to transition from '+from.name+' to '+to.name); },
          onPostTransition:function(to, from) { console.log('Successfully transitioned from '+from.name+' to '+to.name); }
        }, 'c>a']
      );

    > sm._currentState();   // State B is defined as the default start state when the state machines is instantiated

    < {name: "b", default: true}

    > sm.transitionTo('c');

    : About to transition from b to c
    : Successfully transitioned from b to c

    > sm._currentState();

    < {name: "c"}