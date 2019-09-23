import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/index.js',
	output: {
		name: 'module',
		file: 'index.js',
		format: 'cjs',
		strict: false,
		sourcemap: false,
	},
	plugins: [
		resolve(),
		commonjs(),
		scss({
			output: false,
		}),
		production && terser(),
	],
};
