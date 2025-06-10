const users = [];

export function addUser(user) {
  users.push(user);
}

export function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

export { users };
