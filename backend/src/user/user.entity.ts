
export class UserEntity {
    
  auth0Id!: string;

  email!: string;

  name!: string;

  picture?: string;

  createdAt!: Date;
  
  updatedAt!: Date;

  constructor(data: any) {
    this.auth0Id = data.auth0Id;
    this.email = data.email;
    this.name = data.name;
    this.picture = data.picture;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}