const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const postcssPresetEnv = require('postcss-preset-env');

const config = {
	plugins: [
		postcssPresetEnv({
			stage: 2,
			features: {
				'nesting-rules': true,
				'custom-media-queries': true,
				'media-query-ranges': true
			}
		}),
		tailwindcss,
		autoprefixer
	]
};

module.exports = config;
