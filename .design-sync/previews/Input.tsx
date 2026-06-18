import { Input } from 'zhulova';

export const Default = () => (
  <div style={{ maxWidth: 360 }}>
    <Input label="Your name" placeholder="Victoria Zhulova" defaultValue="" />
  </div>
);

export const Required = () => (
  <div style={{ maxWidth: 360 }}>
    <Input label="Email" type="email" placeholder="you@example.com" required />
  </div>
);

export const WithHelper = () => (
  <div style={{ maxWidth: 360 }}>
    <Input label="Phone" placeholder="+1 555 0100" helperText="We'll only call to confirm your session." />
  </div>
);

export const WithError = () => (
  <div style={{ maxWidth: 360 }}>
    <Input label="Email" type="email" defaultValue="not-an-email" error="Please enter a valid email address." />
  </div>
);
