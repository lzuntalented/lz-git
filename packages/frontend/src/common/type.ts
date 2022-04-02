export interface ApiResponse {
    code: number
    data: any
}

export interface IGetCategoryDataItem{
    id: number
    title: string
}

export interface IGetCategoryList extends ApiResponse {
    data: IGetCategoryDataItem[]
}

export interface SelectOption<T> {
  label: string;
  value: T;
}
