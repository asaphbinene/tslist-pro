namespace Main {

   //Declaring and defining a single project
    export enum ProjectStatus {Active, Finished}

    export class Project {
        constructor(
            public id: string,
            public title: string,
            public description: string,
            public people: number,
            public status: ProjectStatus
        ){}
    }

}