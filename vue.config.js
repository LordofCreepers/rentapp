const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
	electronBuilder: {
		nodeIntegration: false,

		preload: "src/preload.js",
		mainProcessFile: "src/background.js",
		rendererProcessFile: "src/main.js",

		disableMainProcessTypescript: false,
		mainProcessTypeChecking: false,

		builderOptions: {
			appId: "com.autorent.app",
			productName: "Автопрокат",
			win: {
				target: "portable"
			},
			extraResources: [
				"./database/database.db"
			]
		}
	}
  }
})
