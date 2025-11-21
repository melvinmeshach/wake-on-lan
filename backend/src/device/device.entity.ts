
export class DeviceEntity {

  deviceId!: string;
    
  userId!: string;

  macAddress?: string;

  customId?: string;

  ipAddress?: string;

  name!: string;

  createdAt!: Date;
  
  updatedAt!: Date;


  constructor(data: any) {
    this.deviceId = data.deviceId;
    this.userId = data.userId;
    this.macAddress = data.macAddress;
    this.customId = data.customId;
    this.ipAddress = data.ipAddress;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}