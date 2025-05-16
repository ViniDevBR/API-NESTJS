/* eslint-disable prettier/prettier */
export class ETransaction {
  constructor(
    public id: number,
    public amount: number,
    public timestamp: Date,
  ) {}
}