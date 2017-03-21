module.exports = {
  webpack: (config, options, webpack) => {
    config.output = {
      path: './dist'
    }
    return config
  }
}
