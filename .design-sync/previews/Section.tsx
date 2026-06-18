import { Section, Container, Heading, Text } from 'zhulova';

export const Plain = () => (
  <Section spacing="md">
    <Container>
      <Heading level={2}>Transform your mindset</Heading>
      <Text tone="muted" className="mt-3">Personalized coaching for entrepreneurs and experts building a personal brand.</Text>
    </Container>
  </Section>
);

export const NavyBackground = () => (
  <Section spacing="md" background="navy">
    <Container>
      <Heading level={3} className="text-white">Ready to begin?</Heading>
      <Text className="mt-3 text-white/80">Book a free 30-minute consultation and map out your next step.</Text>
    </Container>
  </Section>
);

export const SageBackground = () => (
  <Section spacing="md" background="sage">
    <Container>
      <Heading level={3}>What clients say</Heading>
      <Text tone="muted" className="mt-3">Real results from people who committed to the work.</Text>
    </Container>
  </Section>
);
