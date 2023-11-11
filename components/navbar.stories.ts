import type { Meta, StoryObj } from '@storybook/react';
import type { AmplifyUser, CognitoAttributes } from '@aws-amplify/ui';
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

const sampleUser: AmplifyUser = {
  attributes: {
    email: 'user@example.com',
  } as unknown as CognitoAttributes,
} as unknown as AmplifyUser;

export const LoggedIn: Story = {
  args: {
    user: sampleUser,
  }, 
};
