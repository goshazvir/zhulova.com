import { Container, Heading, Text } from 'zhulova';

export const Centered = () => (
  <div style={{ background: '#f0f4f8', paddingTop: 24, paddingBottom: 24 }}>
    <Container>
      <Heading level={3}>Centered, max-width content</Heading>
      <Text tone="muted" className="mt-3">
        Container caps line length and centers content with responsive horizontal
        padding, so sections share a consistent rhythm across the site.
      </Text>
    </Container>
  </div>
);
