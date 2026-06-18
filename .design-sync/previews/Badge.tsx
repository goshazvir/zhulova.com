import { Badge } from 'zhulova';

export const Variants = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
    <Badge variant="navy">New</Badge>
    <Badge variant="gold">Popular</Badge>
    <Badge variant="sage">Limited seats</Badge>
  </div>
);

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Badge size="sm">Small</Badge>
    <Badge size="md">Medium</Badge>
  </div>
);
