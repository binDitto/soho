// FRONT END USER MODEL

export class User {
  constructor (
    public email: String,
    public password: String,
    public admin?: Boolean,
    public createdAt?: String,
    public firstName?: String,
    public lastName?: String,
    public userName?: String,
    public userId?: String,
    public services?: Array<Object>,
    public images?: Array<Object>
  ) {}
}
