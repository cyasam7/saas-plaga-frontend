export interface IServiceType {
  id: string;
  name: string;
  description: string;
}

export interface IPestType {
  id: string;
  name: string;
  description: string;
}

export interface IProduct {
  id: string;
  commercialName: string;
  chemicalName: string;
  description: string;
  doses: {
    amount: string;
    unit: string;
  }[];
}

export interface IApplicationType {
  id: string;
  name: string;
  description: string;
}
