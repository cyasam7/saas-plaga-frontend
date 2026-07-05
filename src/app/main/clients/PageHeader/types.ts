export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface PageHeaderProps {
  title: string;
  onBack: () => void;
  children?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}
