//<reference path="../models/drag-drop.ts" />
//<reference path="../models/project.ts" />
import { Project, ProjectStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
}
export class PortfolioState extends State {
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
        const newProject = new Project(Math.random().toString(), title, description, numberOfMembers, ProjectStatus.Active);
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
export const portfolioState = PortfolioState.getInstance();
//# sourceMappingURL=portfolio-state.js.map