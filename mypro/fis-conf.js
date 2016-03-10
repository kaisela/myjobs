fis.match('*', {
	deploy: fis.plugin('local-deliver', {
		to: 'release/$0'
	})
});
fis.match('*.less', {
   parser: fis.plugin('less-2.x'), //启用fis-parser-less插件
   rExt: '.css',
   url:"/css/$0"
});
fis.match('*.js', {
	// fis-optimizer-uglify-js 插件进行压缩，已内置
	optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
	// fis-optimizer-clean-css 插件进行压缩，已内置
	optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
	// fis-optimizer-png-compressor 插件进行压缩，已内置
	optimizer: fis.plugin('png-compressor')
});
//清除其他配置，只剩下如下配置
//fis.match('*.{js,css,png,less}', {
//useHash: true
//});
