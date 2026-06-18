import { Card, Heading, Text } from 'zhulova';

export const Variants = () => (
  <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
    <Card variant="default">
      <Heading level={4}>Default</Heading>
      <Text tone="muted" className="mt-2">A plain surface for grouped content.</Text>
    </Card>
    <Card variant="bordered">
      <Heading level={4}>Bordered</Heading>
      <Text tone="muted" className="mt-2">Outlined for subtle separation.</Text>
    </Card>
    <Card variant="elevated">
      <Heading level={4}>Elevated</Heading>
      <Text tone="muted" className="mt-2">Raised with a soft shadow.</Text>
    </Card>
  </div>
);

export const CourseCard = () => (
  <div style={{ maxWidth: 360 }}>
    <Card variant="elevated" padding="lg">
      <Heading level={3}>Mindset Mastery</Heading>
      <Text tone="muted" className="mt-2">An 8-week program to rebuild how you approach goals, focus, and resilience.</Text>
    </Card>
  </div>
);
