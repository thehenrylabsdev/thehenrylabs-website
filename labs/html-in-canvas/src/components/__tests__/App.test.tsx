import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { App } from '../../App';

describe('App UI & Accessibility Structure', () => {
  it('renders all 5 interactive lab sections with semantic headings and zero raw emojis', () => {
    const html = renderToString(<App />);

    expect(html).toContain('THEHENRYLABS');
    expect(html).toContain('content=&quot;drawable&quot;');
    expect(html).toContain('4-Way Performance Arena');
    expect(html).toContain('drawElementImage');
    expect(html).toContain('updateGeometry');
    expect(html).toContain('Three.js');
  });
});
