export class Task {
    id?:string;
    userId:string;
    status:boolean;
    title:string;
    content:string;
    createdAt:any;

    constructor(userId:string, status:boolean, title:string, content:string, createdAt:any){
        this.userId = userId;
        this.status = status;
        this.title = title;
        this.content = content;
        this.createdAt = createdAt;
    }
}
