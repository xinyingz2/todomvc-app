# Framework Name • [TodoMVC](http://todomvc.com)

## Implementation

The overall design is centered on creating a state-driven app. Since it is written purely with native JS, it is important to address the paradox of state management as well as DOM rendering at the same time. Therefore, in this purejs version, I use `setState` as a hook to indicate state changes, and thereby triggering rendering and other following actions.

Another detail that is worthing mentioning here is that every time the app get rerendered, every todo on the DOM gets replaced. This is a simple way to ensure todo's correctly reflects the state changes.

## Usage

Clone the repo and `npm install` the dependency packages.
