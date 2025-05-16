/* eslint-disable prettier/prettier */
export class EHealthEntity {
  constructor(
    public status: 'OK' | 'ERROR',
    public  database: 'CONNECTED' | 'DISCONNECTED'
  ) {}
}
