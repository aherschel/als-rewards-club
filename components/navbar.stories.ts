import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  tags: ['autodocs'],
};
      
export default meta;

type Story = StoryObj<typeof Navbar>;

export const LoggedOut: Story = {
  args: {
    user: undefined,
  },   
};

const sampleUser = {
  attributes: {
    email: 'user@example.com',
  },
};

export const LoggedIn: Story = {
  args: {
    user: sampleUser,
  }, 
};
