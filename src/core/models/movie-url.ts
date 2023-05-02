export class MovieUrl {
  constructor(url: string, pagination_url: string){
    this.url = url
    this.pagination_url = pagination_url
    this.is_visited = false
    this.createdAt = new Date()
  }
  id:string
  url: string;
  pagination_url: string;
  is_visited: boolean
  createdAt: Date;
}