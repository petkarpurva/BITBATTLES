const User = require('../../models/User');

describe('User Model', () => {
  it('should correctly calculate level based on XP', () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    // Level 1
    user.xp = 50;
    expect(user.calculateLevel()).toBe(1);

    // Level 2
    user.xp = 150;
    expect(user.calculateLevel()).toBe(2);

    // Level 3
    user.xp = 300;
    expect(user.calculateLevel()).toBe(3);

    // Level 4
    user.xp = 750;
    expect(user.calculateLevel()).toBe(4);

    // Level 5+
    user.xp = 1200;
    expect(user.calculateLevel()).toBe(5);

    user.xp = 1700;
    expect(user.calculateLevel()).toBe(6);
  });
});
