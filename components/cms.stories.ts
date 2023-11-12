import type { Meta, StoryObj } from '@storybook/react';
import type { AmplifyUser, CognitoAttributes } from '@aws-amplify/ui';
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
