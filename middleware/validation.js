const Joi = require("joi");

const userSchema = Joi.object({
  firstname: Joi.string().min(3).max(16).required(),
  lastname: Joi.string().min(3).max(16).required(),
  username: Joi.string()
    .min(5)
    .max(16)
    .required()
    .pattern(new RegExp("^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$")),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

// title: { type: String, required: [true, "Title is required"] },
//     content: { type: String },
//     author: { type: Schema.Types.ObjectId, ref: "User" },
//     comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
//     image: {
//       url: { type: String },
//       filename: { type: String },
//     },
//     category: { type: String, required: [true, "Category is required"] },

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string(),
  author: Joi.array()
    .items({
      _id: Joi.string().required(),
    })
    .required(),
  comments: Joi.array().items({
    _id: Joi.string(),
  }),
  image: Joi.object(),
});

const validationUser = async (req, res, next) => {
  const user = req.body;
  try {
    await userSchema.validateAsync(user);
    next();
  } catch (e) {
    res.status(500).json(e.details[0].message);
  }
};

module.exports = { validationUser };
