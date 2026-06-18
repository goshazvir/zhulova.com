import { Modal, Input, Button } from 'zhulova';

// The Modal renders a `position: fixed` overlay. The transformed wrapper
// establishes a containing block so the overlay renders inside the card
// instead of escaping to the viewport.
export const Open = () => (
  <div
    style={{
      position: 'relative',
      width: 560,
      height: 460,
      transform: 'translateZ(0)',
      overflow: 'hidden',
      borderRadius: 12,
    }}
  >
    <Modal isOpen title="Book a free consultation" onClose={() => {}}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Your name" placeholder="Victoria Zhulova" />
        <Input label="Email" type="email" placeholder="you@example.com" required />
        <Button variant="primary" type="submit">Send request</Button>
      </div>
    </Modal>
  </div>
);
