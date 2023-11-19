import type { Meta, StoryObj } from '@storybook/react';
import { Cms } from './cms';

const meta: Meta<typeof Cms> = {
  title: 'Components/Cms',
  component: Cms,
  tags: ['autodocs'],
};
      
export default meta;

type Story = StoryObj<typeof Cms>;

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
