import { UserDto } from './userDto';

describe('User', () => {
  it('should be defined', () => {
    expect(new UserDto()).toBeDefined();
  });
});
