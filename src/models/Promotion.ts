export interface Banner {
  id: number;
  active: boolean;
  label: string;
  title: string;
  description: string;
  image: string;
  bgColor: string;
  imgBgColor: string;
  link: string;
}

export interface NotificationBar {
  id: number;
  active: boolean;
  message: string;
  linkText: string;
  linkUrl: string;
  bgColor: string;
}
