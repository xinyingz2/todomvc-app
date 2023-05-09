(function (window) {
	"use strict";
	// Your starting point. Enjoy the ride!
	const state = {
		todos: JSON.parse(localStorage.getItem("todomvc-todos")) || [],
		currentFilter: location.hash || "#/",
		get activeCount() {
			return this.todos.filter((todo) => !todo.completed).length;
		},
		get hasCompleted() {
			return this.todos.some((todo) => todo.completed);
		},
		get isAllCompleted() {
			return this.todos.every((todo) => todo.completed);
		},
		get hasTodo() {
			return !!this.todos.length;
		},
	};

	const app = {
		ENTER_KEY: 13,
		ESC_KEY: 27,
		main: document.querySelector(".main"),
		footer: document.querySelector(".footer"),
		todoInput: document.querySelector(".new-todo"),
		todoList: document.querySelector(".todo-list"),
		todoItemTemplate: document.querySelector(".todo-list li").cloneNode(true),
		filterList: [...document.querySelectorAll(".filters a")],
		todoCount: document.querySelector(".todo-count strong"),
		todoToggleAll: document.querySelector(".toggle-all"),
		clearCompletedBtn: document.querySelector(".clear-completed"),
	};

	const afterStateChange = (state, newState) => {
		if (Object.prototype.hasOwnProperty.call(newState, "todos")) {
			localStorage.setItem("todomvc-todos", JSON.stringify(state.todos));
		}
	};

	const setState = (newState) => {
		Object.assign(state, newState);
		afterStateChange(state, newState);
		render();
	};

	const render = () => {
		//  render main / footer
		app.main.hidden = !state.hasTodo;
		app.footer.hidden = !state.hasTodo;

		// render toggle all
		app.todoToggleAll.checked = state.isAllCompleted;
		app.todoToggleAll.addEventListener("click", (e) => {
			state.todos.forEach((todo) => (todo.completed = e.target.checked));
			setState({ todos: [...state.todos] });
		});

		// add new todo
		app.todoInput.addEventListener("keypress", (e) => {
			const todo = e.target.value.trim();
			if (e.keyCode === app.ENTER_KEY && todo.length !== 0) {
				state.todos.unshift({
					id: Date.now(),
					title: todo,
					completed: false,
				});
				e.target.value = "";
				setState({ todos: [...state.todos] });
			}
		});

		// render todo count
		app.todoCount.innerText = state.activeCount;

		// render clear completed
		app.clearCompletedBtn.hidden = !state.hasCompleted;
		app.clearCompletedBtn.addEventListener("click", () => {
			setState({ todos: state.todos.filter((todo) => !todo.completed) });
		});

		// render filter
		app.filterList.forEach((anchor) => {
			const { hash } = new URL(anchor.href);
			anchor.classList.toggle("selected", hash === state.currentFilter);
		});

		// global hash change
		window.addEventListener("hashchange", (e) => {
			const { hash } = new URL(e.newURL);
			setState({ currentFilter: hash });
		});

		// render todo list
		app.todoList.innerHTML = "";
		state.todos
			.filter((todo) => {
				const { currentFilter } = state;
				switch (currentFilter) {
					case "#/":
						return true;
					case "#/active":
						return !todo.completed;
					case "#/completed":
						return todo.completed;
				}
			})
			.forEach((todo, index) => {
				const li = app.todoItemTemplate.cloneNode(true);
				li.classList.toggle("completed", todo.completed);
				const newInputToggle = li.querySelector(".toggle");
				const newLabel = li.querySelector("label");
				const newInputEdit = li.querySelector(".edit");

				newInputToggle.checked = todo.completed;
				newLabel.innerText = todo.title;
				newInputEdit.value = todo.title;

				newInputToggle.addEventListener("click", (e) => {
					todo.completed = e.target.checked;
					setState({ todos: [...state.todos] });
				});

				newLabel.addEventListener("dblclick", (e) => {
					li.classList.toggle("editing", true);
					newInputEdit.focus();
				});

				newInputEdit.addEventListener("blur", (e) => {
					console.log("blur");
					e.preventDefault(); // it seems blur event doesn't have any default behavior
					const title = e.target.value.trim();
					if (title.length !== 0) {
						todo.title = title;
						setState({ todos: [...state.todos] });
					} else {
						state.todos.splice(index, 1);
						setState({ todos: [...state.todos] });
					}
				});

				// newInputEdit.addEventListener("keypress", (e) => {
				// 	// debugger;
				// 	// console.log("key&&&&&", e.keyCode);//TODO: ESCAPE EVENT
				// 	if (e.keyCode === app.ENTER_KEY) {
				// 		console.log("key");
				// 		li.classList.toggle("editing", false);
				// 	}
				// });

				newInputEdit.addEventListener("keyup", (e) => {
					// debugger; //TODO: ESCAPE EVENT
					if (e.keyCode === app.ENTER_KEY) {
						li.classList.toggle("editing", false);
					}
				});

				li.querySelector(".destroy").addEventListener("click", () => {
					state.todos.splice(index, 1);
					setState({ todos: [...state.todos] });
				});

				app.todoList.appendChild(li);
			});
	};

	render();
})(window);
