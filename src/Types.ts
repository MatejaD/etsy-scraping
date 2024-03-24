export type PRODUCT = {
  title: string | undefined,
  price: string | null,
  url: string | null
}

export type EXTRACTED_URLS = {
  urls: string,
  index: number
}

export type AVAILABLE_OPTIONS = {
  [key: string]: string[]
}

export type PRODUCT_DETAILS = {
  name: string,
  price: string,
  desc: string,
  availableOptions: AVAILABLE_OPTIONS[]| null,
  img: string[]
}