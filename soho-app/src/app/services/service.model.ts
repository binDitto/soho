export class Service {
  constructor(
    public name: String,
    public price: Number,
    public description: String,
    public category: String,
    public id?: String,
    public userId?: String,
    public userName?: String,
    public image?: any,
    public createdAt?: String
  ){}
}
