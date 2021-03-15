//<reference path="../models/drag-drop.ts" />
//<reference path="../models/project.ts" />

namespace Main {

    // The state and record of the portfolio project
    type Listener<T> = (itms: T[]) => void;

    class State<T> {
        protected listeners: Listener<T>[] = [];
    
        addListener(listenerFn: Listener<T>) {
            this.listeners.push(listenerFn);
        }
    }
    
    export class PortfolioState extends State<Project> {
    
        private projects: Project[] = [];
        private static instance: PortfolioState;
    
        private constructor(){
            super()
        }
    
        static getInstance() {
            if (this.instance){
                return this.instance;
            }
            this.instance = new PortfolioState();
            return this.instance;
        }
    
        addProject(title: string, description: string, numberOfMembers: number){
            const newProject  = new Project(
                Math.random().toString(),
                title,
                description,
                numberOfMembers,
                ProjectStatus.Active
            );
            this.projects.push(newProject);
            this.updateListeners();
        }
    
        switchProjectStatus(projectId: string, newStatus: ProjectStatus){
            const project = this.projects.find(prj => prj.id === projectId);
            if(project && project.status !== newStatus){
                project.status = newStatus;
                this.updateListeners();
            }
        }
    
        private updateListeners(){
            for(const listenerFn of this.listeners){
                listenerFn(this.projects.slice());
            }
        }
    }

    export const portfolioState = PortfolioState.getInstance();

}