const DEFAULT = [{
  admin: 'admin1',
  password: 'password1'
},{
  admin: 'admin2',
  password: 'password2'
},{
  admin: 'admin3',
  password: 'password3'
}]

function check(admin, password) {
  for (let index = 0; index < DEFAULT.length; index++) {
    if (admin == DEFAULT[index].admin && password == DEFAULT[index].password) {
      return true;
    }
  }
  return false;
}

module.exports = check