import { Text } from 'zhulova';

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Text size="lg">Large — an opening statement that sets the tone.</Text>
    <Text size="md">Medium — the default body size for most paragraphs.</Text>
    <Text size="sm">Small — supporting detail and fine print.</Text>
  </div>
);

export const Tones = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Text tone="default">Default — primary body copy in deep navy.</Text>
    <Text tone="muted">Muted — secondary copy with lower emphasis.</Text>
    <Text tone="gold">Gold — an accented highlight for key phrases.</Text>
  </div>
);
