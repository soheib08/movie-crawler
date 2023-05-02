export class Site {
  constructor(url:string, name:string){
    this.name = name
    this.url = url
  }
  id:string
  name: string;
  url: string;
  createdAt: Date;
}
