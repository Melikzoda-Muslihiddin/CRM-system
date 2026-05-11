// Описывает форму данных одного клиента из API
// Эти типы помогают TypeScript проверять что мы не опечатались в названии полей

export interface Client {
  id: string;
  fullName: string;
  age: number;
  email: string;
  avatar: string;       // URL картинки
  contacts: {
    phone: string;
    address: string;
  };
  job: {
    company: string;
    description: string;
  };
}