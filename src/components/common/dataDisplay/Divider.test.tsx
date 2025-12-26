import { render, screen } from '@testing-library/react';
import { describe, expect,it } from 'vitest';

import { Divider } from '@/components/common/dataDisplay/Divider';

describe('Divider', () => {
  it('renders without crashing', () => {
    render(<Divider />);
    const dividerElement = screen.getByTestId('divider');
    expect(dividerElement).toBeInTheDocument();
  });

  it('has correct Tailwind classes', () => {
    render(<Divider />);
    const dividerElement = screen.getByTestId('divider');

    expect(dividerElement).toHaveClass('w-full');
    expect(dividerElement).toHaveClass('h-px');
    expect(dividerElement).toHaveClass('bg-gray-200');
    expect(dividerElement).toHaveClass('dark:bg-gray-700');
  });

  it('renders as a div element', () => {
    render(<Divider />);
    const dividerElement = screen.getByTestId('divider');
    expect(dividerElement.tagName).toBe('DIV');
  });

  it('has no children', () => {
    render(<Divider />);
    const dividerElement = screen.getByTestId('divider');
    expect(dividerElement.children).toHaveLength(0);
  });
});
