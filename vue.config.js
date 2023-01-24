const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
	electronBuilder: {
		nodeIntegration: false,
		preload: "src/preload.js",
		mainProcessFile: "src/background.js",
		rendererProcessFile: "src/main.js"
	}
  }
})
