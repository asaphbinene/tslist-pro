//<reference path="./base-component.ts" />
import { Component } from "./base-component.js";
import { ProjectItem } from "./project-items.js";
//<reference path="../decorators/autobind.ts" /> namaspace mode
import { autobind } from "../decorators/autobind.js";
//<reference path="../states/portfolio-state.ts" />
import { portfolioState } from "../states/portfolio-state.js";
//<reference path="../models/drag-drop.ts" />
import { DragTarget } from "../models/drag-drop.js";
//<reference path="../models/project.ts" />
import { Project, ProjectStatus } from "../models/project.js"


///<reference path>
//namespace Main {
  
//ProjectList 
export class ProjectList extends Component <HTMLDivElement, HTMLElement> implements DragTarget{
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'main', false, `${type}-projects`);
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent){
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
    }

    @autobind
    dropHandler(event: DragEvent){
        const prjId = event.dataTransfer!.getData('text/plain');
        portfolioState.switchProjectStatus(
            prjId,
            this.type === 'active'? ProjectStatus.Active : ProjectStatus.Finished
        );
    }

    @autobind
    dragLeaveHandler(event: DragEvent){
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    }

    configure(){
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        portfolioState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active'){
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    };

    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects(){
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listElement.innerHTML = '';
        for (const prjItem of this.assignedProjects){
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }
}
