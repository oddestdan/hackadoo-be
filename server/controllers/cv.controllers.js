const User = require('../models/User');

module.exports.cv = async (req, res) => {
  try {
    const {id} = req.params;
    const cv = req.body;

    await User.findByIdAndUpdate(id,
      {
        cv: cv
      },
      {new: true, useFindAndModify: false},
      function (err, result) {
        if (err) {
          console.log(err);
          errorHandler(res, 404, new Error('User not found'));
        } else {
          console.log('Adding CV is successful');
          res.status(201).json({
            status: "CV added successfully",
            cv: result.cv,
          })
        }
      });

  } catch (e) {
    errorHandler(res, 500, e);
  }
};


