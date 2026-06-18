import { Stat } from 'zhulova';

export const Row = () => (
  <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(3, auto)', justifyContent: 'start' }}>
    <Stat value="500+" label="Clients coached" />
    <Stat value="12" label="Years of practice" />
    <Stat value="98%" label="Would recommend" />
  </div>
);
