# Background
About nine months ago I was playing with the ace editor with the goal of creating a teaching environment for TDD (a topic for another day). After playing and hacking for a bit, I instead ended up creating a live editor for jade (with css). At the time, jade was only server-side, so it also served me as an introduction to socket.io.

I've gotton a lot of used out of that version, also adding json options for passing in data models and javascript for adding behavior. But the time had come for a redo for a number of reasons:

* It existing in a project directory stuffed full of learning crap around the ace editor, and even the base html page was a ace editor demo I had started hacking on
* Jade is now supported in the browser. Running every keystroke locally with node through socket.io is actually very performant (in terms of user experience), but a full browser-based solution just seems right.
* I use the current editor to do Feature Driven Development (FDD), my current versions has some testing/pinning aspects so that you can create the visual result first, then pin it and make the jade template data driven and extract a data model. The point here being that I wanted to create the editor from scratch using FDD and work through the 'bootstrapping' issues.

This last point is want this document is about. I wanted to keep a running commentary on how I put this together. In reality, there are a lot of dead-ends I go down, so you'll be looking at an idealized view. I'll try and point out some of these insights where it makes sense.

# HTML or Jade?
One of the first choices is whether I should code up the editor itself in html or jade. One of the reasons I like jade so much is that it makes writing html a pleasure (I find straight html a bit of a pain in comparison). But that means that I would either have to server it from node or have a base html page that pulled the .jade file in and render the html into the main page. I ruled out the former because I liked the simplicity of a pure-browser solution. The later is intriguing, but it adds a layer of browser-side code that seemed contrary to the spirit of simplicity in bootstrapping this. Ultimately I think a ICanHaz.js style library for jade would be cool.

# 