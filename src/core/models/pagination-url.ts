export class PaginationUrl {
  constructor(url: string, site: string, isVisited: boolean){
    this.site = site
    this.url = url
    this.is_visited = isVisited
    this.createdAt = new Date()
  }
  id:string
  url: string;
  is_visited: boolean;
  site: string;
  createdAt: Date;
}
