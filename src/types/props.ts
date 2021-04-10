import { ComponentType } from 'react';

export interface LayoutProps {
  path: string;
  exact?: boolean;
  component: ComponentType<any>;
}
