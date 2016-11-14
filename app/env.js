// TODO - pull appropriately from build

let env = process.env.ENV_VARIABLE || 'development'
export default {
  name: env
}