module.exports = {
  'webServer': {
    'protocol': 'http',
    'host': 'localhost',
    'port': 5000,
  },
  'dataBaseLocal': {
    'protocol': 'mongodb',
    'host': 'localhost',
    'port': 27017,
    'name': 'hackadoo_app',
  },

  'mongoURI': 'mongodb+srv://admin:AUfv1ucUnf07JJrw@cluster0.dng65.gcp.mongodb.net/app?retryWrites=true&w=majority',
  'JWT': {
    'secret': 'jwtSuperSecretSuperCode',
  },
};
