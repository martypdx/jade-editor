# Background
About nine months ago I was playing with the ace editor with the goal of creating a teaching environment for TDD (a topic for another day). After playing and hacking for a bit, I instead ended up creating a live editor for jade (with css). At the time, jade was only server-side, so it also served me as an introduction to socket.io.

I've gotton a lot of used out of that version, also adding json options for passing in data models and javascript for adding behavior. But the time had come for a redo for a number of reasons:

* It existing in a project directory stuffed full of learning crap around the ace editor, and even the base html page was a ace editor demo I had started hacking on
* Jade is now supported in the browser. Running every keystroke locally with node through socket.io is actually very performant (in terms of user experience), but a full browser-based solution just seems right.
* I use the current editor to do Feature Driven Development (FDD), my current versions has some testing/pinning aspects so that you can create the visual result first, then pin it and make the jade template data driven and extract a data model. The point here being that I wanted to create the editor from scratch using FDD and work through the 'bootstrapping' issues.

This last point is what this document is about. I wanted to keep a running commentary on how I put this together. In reality, there are a lot of dead-ends I go down, so you'll be looking at an idealized view. I'll try and point out some of these insights where it makes sense.

# HTML or Jade?
One of the first choices is whether I should code up the editor itself in html or jade. One of the reasons I like jade so much is that it makes writing html a pleasure (I find straight html a bit of a pain in comparison). But that means that I would either have to server it from node or have a base html page that pulled the .jade file in and render the html into the main page. I ruled out the former because I liked the simplicity of a pure-browser solution. The later is intriguing, but it adds a layer of browser-side code that seemed contrary to the spirit of simplicity in bootstrapping this. Ultimately I think a ICanHaz.js style library for jade would be cool.

# Feature Drive the Basic Jade Editor
Eventually the jade editor will be able to pin standards and test them as the template and data model are being extracted from the literal standard. For the app itself, I'll follow the process, but have to bootstrapped the tooling.

## Creating the Standard
The first step is create the visualize of what I want to see _after_ the system has been used. In this case, that means we assume that entered the jade template and having it transformed into html(I'll start with just html, no interpolation) as already occurred. What will that look like?

```html
<!DOCTYPE html>
<html>
<head>
    <style type="text/css">
        #editor {
            position: absolute;
            width: 100%; height: 60%;
        }
        .jade, .html {
            position: absolute;
            resize: none;
            top: 0%; width: 45%; height: 100%;
            border: 1px groove lightblue;
            margin: 15px; padding: 10px;
        }
        .html {
            left: 49%;
            background: ivory;
        }
        body {
            margin: 0px;
            background: lightblue;
        }
    </style>
<body>
    <div id="editor">
        <textarea class="jade">p Hello World</textarea>
        <pre class="html">&lt;p&gt;Hello World&lt;/p&gt;</pre>
    </div>
</body>
</html>
```

This core html is very simple, with a nod to the classic `Hello World`. It may seem strange to be adding styling at this point, but it's important to feel good looking at what's onscreen. The style is decoupled into css anyhow. Maybe some rounded corners or drop shadows might add more appeal, but this was enough whie keeping things simple.

## Bootstrapping the Pinning Test
The easiest way I saw was to duplicate the standard into expected and actual `div`'s (hiding the `expected` from displaying, we just need use its html to test the actual):

```html
<div id="expected" style="display: none;">
    <div class="editor">
        <textarea class="jade">p Hello World</textarea>
        <pre class="html">&lt;p&gt;Hello World&lt;/p&gt;</pre>
    </div>
</div>

<div id="actual">
    <div class="editor">
        <textarea class="jade">p Hello World</textarea>
        <pre class="html">&lt;p&gt;Hello World&lt;/p&gt;</pre>
    </div>
</div>
```

And write a test onload that makes sure they are the same:

```html
<script type="text/javascript">
    function test() {
        function getHtml(id) {
            return document.getElementById(id).innerHTML.trim();
        }
        var expected = getHtml('expected');
        var actual = getHtml('actual');
        
        if(expected !== actual) { alert('Actual does not match expected standard') }
    }
</script>
...
<body onload="test()">
```

Later on, I'll introduce some diff visualizations for comparison failures, but for now the html is short and I can just look at the (chrome for me) `Elements` viewer if I need to see what's up.

## Refactor Out the Functionality
Now I can safely make changes to bring in the functionality knowing that I'm still producing the correct output (the expected standard). First step is to pull the literal value (escaping the brackets no longer necessary) into a function called on load:

```html
function render() {
    document.querySelector('#actual>.editor>.html').textContent = '<p>Hello World</p>';
}
...
<div id="actual">
    <div class="editor">
        <textarea class="jade">p Hello World</textarea>
        <pre class="html"></pre>
    </div>
</div>
```

The test passes and now time to bring in the jade library and use the jade template code:

```html
<script src="js/3rdParty/jade.js"></script>
```
```javascript
function render() {         
    var jade_template = $('#actual>.editor>.jade').value;
    $('#actual>.editor>.html').textContent = require('jade').render(jade_template);
    
    function $(s) { return document.querySelector(s); }
}
```

## Make It Real Time
