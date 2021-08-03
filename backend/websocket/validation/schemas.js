const Joi = require('joi')

const createMessageSchema = Joi.object({
  messageText: Joi.string().optional(),
  roomName: Joi.string().required(),
  isMessageFile: Joi.boolean().optional(),
  file: Joi.object({
    type: Joi.string().allow(''),
    name: Joi.string().allow(''),
    raw: Joi.string(),
  }).optional(),
})

const editMessageSchema = Joi.object({
  messageText: Joi.string().optional(),
  roomName: Joi.string().required(),
  messageId: Joi.number().required(),
  file: Joi.object({
    type: Joi.string().allow(''),
    name: Joi.string().allow(''),
    raw: Joi.string(),
  }).optional(),
})

const deleteMessageSchema = Joi.object({
  // replyTo: Joi.number().optional(),
  roomName: Joi.string().required(),
  messageId: Joi.number().required(),
  // isMessageFile: Joi.boolean().optional(),
  // parentId: Joi.number().optional(),
})

const replyMessageSchema = Joi.object({
  messageText: Joi.string().optional(),
  roomName: Joi.string().required(),
  isMessageFile: Joi.boolean().optional(),
  replyTo: Joi.number().required(),
  file: Joi.object({
    type: Joi.string().allow(''),
    name: Joi.string().allow(''),
    raw: Joi.string(),
  }).optional(),
})

const userJoinsSchema = Joi.object({
  roomName: Joi.string().required(),
})

module.exports = {
  createMessageSchema,
  editMessageSchema,
  deleteMessageSchema,
  replyMessageSchema,
  userJoinsSchema,
}
