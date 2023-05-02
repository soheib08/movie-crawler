export class PaginationUrl {
  constructor(url: string, site: string){
    this.site = site
    this.url = url
    this.is_visited = false
    this.createdAt = new Date()
  }
  id:string
  url: string;
  is_visited: boolean;
  site: string;
  createdAt: Date;
}
