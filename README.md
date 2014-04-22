lessify
=======
Middleware and Browserify transform for less files.

[![Build Status](https://travis-ci.org/dstokes/lessify.png)](https://travis-ci.org/dstokes/lessify)  
[![NPM](https://nodei.co/npm/lessify.png?downloads=true)](https://nodei.co/npm/lessify/)

usage
=====
some.less
``` less
.nav { width: (1 + 1); }
```

entry.js
```
require('some.less');
```

then

```
> browserify -t lessify entry.js > app.js
```

we haz css in our bundle!

options
=======

Less options can be specified either on the command line:

```
> browserify -t [ lessify --relativeUrls --rootpath http://www.example.com/ ] entry.js
```

Or using the API:

```
var browserify = require('browserify');
var lessify = require('lessify');

var b = browserify();
b.transform({relativeUrls: true, rootpath: 'http://www.example.com/'}, lessify);
...
```

install
=======

With [npm](http://npmjs.org) do:

```
npm install lessify
```

contributors
============

[https://github.com/dstokes/lessify/graphs/contributors](https://github.com/dstokes/lessify/graphs/contributors)
