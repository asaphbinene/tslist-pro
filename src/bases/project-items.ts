///<reference path="./base-component.ts" />
///<reference path="../decorators/autobind.ts" />
///<reference path="../models/drag-drop.ts" />
///<reference path="../models/project.ts" />

namespace Main {

    //Project Items class
    export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
        private project: Project;
    
        get members() {
            if(this.project.people === 1){
                return 'One member only assigned';
            }else{
                return `${this.project.people} members assigned`;
            }
        }
    
        constructor(hostId: string, project: Project){
            super('single-project', hostId, false, project.id);
            this.project =  project;
    
            this.configure();
            this.renderContent();
        }
    
        //Defining drag and drop behaviour
        @autobind //omitting the autobind may cause the lost the declaration the id make it undefined
        dragStartHandler(event: DragEvent){
            event.dataTransfer!.setData('text/plain', this.project.id);
            event.dataTransfer!.effectAllowed = 'move';
        }
    
        @autobind
        dragEndHandler(event: DragEvent) {
            console.log('DragEnd');
        }
    
        configure(){
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector('h2')!.textContent = this.project.title;
            this.element.querySelector('h3')!.textContent = this.members;
            this.element.querySelector('p')!.textContent = this.project.description;
        }
    
    }
}