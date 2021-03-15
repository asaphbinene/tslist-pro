"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Main;
(function (Main) {
    //component Base class
    class Component {
        constructor(templateId, hostElementId, insertAtStart, newElementId) {
            this.templateElement = document.getElementById(templateId);
            this.hostElement = document.getElementById(hostElementId);
            const importNode = document.importNode(this.templateElement.content, true);
            this.element = importNode.firstElementChild;
            if (newElementId) {
                this.element.id = newElementId;
            }
            this.attach(insertAtStart);
        }
        attach(insertAtBeginning) {
            this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
        }
    }
    Main.Component = Component;
})(Main || (Main = {}));
var Main;
(function (Main) {
    // Autobind decorator
    function autobind(id, _2, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        };
        return adjDescriptor;
    }
    Main.autobind = autobind;
})(Main || (Main = {}));
var Main;
(function (Main) {
    function validate(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLength != null &&
            typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
        }
        if (validatableInput.maxLength != null &&
            typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
        if (validatableInput.min != null &&
            typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value >= validatableInput.min;
        }
        if (validatableInput.max != null &&
            typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value <= validatableInput.max;
        }
        return isValid;
    }
    Main.validate = validate;
})(Main || (Main = {}));
//<reference path="../models/drag-drop.ts" />
//<reference path="../models/project.ts" />
var Main;
(function (Main) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class PortfolioState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new PortfolioState();
            return this.instance;
        }
        addProject(title, description, numberOfMembers) {
            const newProject = new Main.Project(Math.random().toString(), title, description, numberOfMembers, Main.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        switchProjectStatus(projectId, newStatus) {
            const project = this.projects.find(prj => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    Main.PortfolioState = PortfolioState;
    Main.portfolioState = PortfolioState.getInstance();
})(Main || (Main = {}));
///<reference path="./base-component.ts" />
///<reference path="../decorators/autobind.ts" />
///<reference path="../utils/validations.ts" />
///<reference path="../states/portfolio-state.ts" />
var Main;
(function (Main) {
    class ProjectInput extends Main.Component {
        constructor() {
            super('project-input', 'main', true, 'user-input');
            //Assigning the attributes and input selectors
            this.titleInputElement = this.element.querySelector('#title');
            this.descriptionInputElement = this.element.querySelector('#description');
            this.peopleInputElement = this.element.querySelector('#people');
            this.configure();
        }
        configure() {
            //this.submitHandler.bind(this) way without decorator
            this.element.addEventListener('submit', this.submitHandler);
        }
        renderContent() { }
        gatherUserInput() {
            const enteredTitle = this.titleInputElement.value;
            const enteredDescription = this.descriptionInputElement.value;
            const enteredPeople = this.peopleInputElement.value;
            const titleValidatable = {
                value: enteredTitle,
                required: true,
                minLength: 5
            };
            const descriptionValidatable = {
                value: enteredDescription,
                required: true,
                minLength: 5
            };
            const peopleValidatable = {
                value: +enteredPeople,
                required: true,
                min: 1,
                max: 5
            };
            //Other way of validation 
            if (!Main.validate(titleValidatable) ||
                !Main.validate(descriptionValidatable) ||
                !Main.validate(peopleValidatable)) {
                //console.log(enteredTitle + ' '+ enteredDescription+ ' ' + enteredPeople);
                alert('Invalid input, please try again!');
                return;
            }
            else {
                return [enteredTitle, enteredDescription, +enteredPeople];
            }
        }
        clearInputs() {
            this.titleInputElement.value = '';
            this.descriptionInputElement.value = '';
            this.peopleInputElement.value = '';
        }
        submitHandler(event) {
            event.preventDefault();
            const userInput = this.gatherUserInput();
            if (Array.isArray(userInput)) {
                const [title, desc, people] = userInput;
                console.log(title, desc, people);
                Main.portfolioState.addProject(title, desc, people);
                this.clearInputs();
            }
        }
    }
    __decorate([
        Main.autobind
    ], ProjectInput.prototype, "submitHandler", null);
    Main.ProjectInput = ProjectInput;
})(Main || (Main = {}));
var Main;
(function (Main) {
    //Declaring and defining a single project
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = Main.ProjectStatus || (Main.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    Main.Project = Project;
})(Main || (Main = {}));
///<reference path="./base-component.ts" />
///<reference path="../decorators/autobind.ts" />
///<reference path="../states/portfolio-state.ts" />
///<reference path="../models/drag-drop.ts" />
///<reference path="../models/project.ts" />
///<reference path>
var Main;
(function (Main) {
    //ProjectList 
    class ProjectList extends Main.Component {
        constructor(type) {
            super('project-list', 'main', false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listEl = this.element.querySelector('ul');
                listEl.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const prjId = event.dataTransfer.getData('text/plain');
            Main.portfolioState.switchProjectStatus(prjId, this.type === 'active' ? Main.ProjectStatus.Active : Main.ProjectStatus.Finished);
        }
        dragLeaveHandler(event) {
            const listEl = this.element.querySelector('ul');
            listEl.classList.remove('droppable');
        }
        configure() {
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            this.element.addEventListener('drop', this.dropHandler);
            Main.portfolioState.addListener((projects) => {
                const relevantProjects = projects.filter(prj => {
                    if (this.type === 'active') {
                        return prj.status === Main.ProjectStatus.Active;
                    }
                    return prj.status === Main.ProjectStatus.Finished;
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        ;
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector('ul').id = listId;
            this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        }
        renderProjects() {
            const listElement = document.getElementById(`${this.type}-projects-list`);
            listElement.innerHTML = '';
            for (const prjItem of this.assignedProjects) {
                new Main.ProjectItem(this.element.querySelector('ul').id, prjItem);
            }
        }
    }
    __decorate([
        Main.autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        Main.autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        Main.autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    Main.ProjectList = ProjectList;
})(Main || (Main = {}));
///<reference path="./bases/project-input.ts" />
//<reference path="./bases/project-items.ts" />
///<reference path="./bases/project-list.ts" />
var Main;
(function (Main) {
    new Main.ProjectInput();
    new Main.ProjectList('active');
    new Main.ProjectList('finished');
})(Main || (Main = {}));
///<reference path="./base-component.ts" />
///<reference path="../decorators/autobind.ts" />
///<reference path="../models/drag-drop.ts" />
///<reference path="../models/project.ts" />
var Main;
(function (Main) {
    //Project Items class
    class ProjectItem extends Main.Component {
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get members() {
            if (this.project.people === 1) {
                return 'One member only assigned';
            }
            else {
                return `${this.project.people} members assigned`;
            }
        }
        //Defining drag and drop behaviour
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(event) {
            console.log('DragEnd');
        }
        configure() {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.members;
            this.element.querySelector('p').textContent = this.project.description;
        }
    }
    __decorate([
        Main.autobind //omitting the autobind may cause the lost the declaration the id make it undefined
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        Main.autobind
    ], ProjectItem.prototype, "dragEndHandler", null);
    Main.ProjectItem = ProjectItem;
})(Main || (Main = {}));
//# sourceMappingURL=bundle.js.map