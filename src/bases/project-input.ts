import { Component } from "./base-component"
import { autobind } from "../decorators/autobind"
import { Validatable, validate } from "../utils/validations"
import { portfolioState } from "../states/portfolio-state"
        
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'main', true, 'user-input');
        //Assigning the attributes and input selectors
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    
        this.configure();
    }

    configure() {
        //this.submitHandler.bind(this) way without decorator
        this.element.addEventListener('submit', this.submitHandler);
    }

    renderContent(){}

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 5
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }

        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }
        //Other way of validation 
        if(
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            //console.log(enteredTitle + ' '+ enteredDescription+ ' ' + enteredPeople);
            alert('Invalid input, please try again!')
            return;
        }else{
            return [enteredTitle, enteredDescription, +enteredPeople]
        } 
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)) {
            const [title, desc, people ] = userInput;
            console.log(title, desc, people);
            portfolioState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}
