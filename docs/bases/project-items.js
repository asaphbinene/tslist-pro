var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//<reference path="./base-component.ts" />
import { Component } from "./base-component.js";
//<reference path="../decorators/autobind.ts" />
import { autobind } from "../decorators/autobind.js";
//namespace Main {
//Project Items class
export class ProjectItem extends Component {
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
    autobind //omitting the autobind may cause the lost the declaration the id make it undefined
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    autobind
], ProjectItem.prototype, "dragEndHandler", null);
//# sourceMappingURL=project-items.js.map