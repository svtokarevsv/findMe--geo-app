// var path = require('path')
//
// module.exports = {
//     devtool: 'eval-cheap-module-source-map',
//     entry: [
//         './js/app.js'
//     ],
//     output: {
//         path: path.join(__dirname, 'build'),
//         filename: 'bundle.js',
//         publicPath: '/static/'
//     },
//     module: {
// 		loaders: [
// 			{
// 				test: /\.js/,
// 				loaders: ['babel-loader'],
// 				include: path.join(__dirname, 'js')
// 			},
// 			{
// 				test: /\.css/,
// 				include: path.join(__dirname, 'css'),
// 				loaders: ['style-loader', 'css-loader'],
// 			}
// 		]
//     }
// }