const { Schema, model, Types } = require('mongoose');


const CVSchema = new Schema({
  path: {type: String},
  skills: [{
    skillId: {type: Types.ObjectId},
    title: {type: String},
    childrenSkills: [{
      skillId: {type: Types.ObjectId},
      title: {type: String},
      subChildrenSkills: [{
        skillId: {type: Types.ObjectId},
        title: {type: String}
      }]
    }]
  }]
});


module.exports = model('CV', CVSchema);
