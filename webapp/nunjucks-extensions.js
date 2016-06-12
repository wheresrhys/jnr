export default function (nunjucks) {
	nunjucks.addFilter('wrapFillerWords', function (input) {
	 	return input
	 		.replace(/^The /, '<span class="filler">The </span>')
	 		.replace(/^A /, '<span class="filler">A </span>')
	 		.replace(/jig$/i, '<span class="filler"> Jig</span>')
	 		.replace(/reel$/i, '<span class="filler"> Reel</span>')
	});

}