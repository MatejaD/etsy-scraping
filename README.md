# Automated Web Scraping Script For Etsy

A simple script made for scraping product data from https://www.etsy.com

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the script, It is set to headless:false for better tracking if you want
the best performance make sure to set headless to true.

## Assumptions Made

It was an interesting journey creating this project and starting from 0 knowledge about web scraping. Comming from a
Front-End background this was a new and refreshing project to work on.

### Setting up:

It took me some time to set everything up and running and to get familiar with the functions Puppeteer offers. They
did a great job of documenting it and making it easy for developers to use the library without any prior knowledge.

### Interacting with Etsy

The first few interactions were not so friendly, as i ran in to bot detection, network issues and all other kinds of
problems.
I started to tackle them one by one and finaly made a break through. I can say with certainty that the start was filled
with most issues and bugs
but also that i gained the most knowledge from it.

### Finalising the script

Okay so by know i made a functional script but honestly it was very basic and could have used some improvements. So i
spent
some time working on reducing the chance of it being seen by bot detection, improving its speed and quality as well as
organizing the
code.

## Challenges

### Bot detection

It took me some time to figure out ways to bypass the bot detection. I figured out i can use some "human" movements
to make them less suspicious. Setting cookies also helped. I tried shuffling between free proxies i found on the
internet
but decide not to use them since they only worked for a few hours. If i was serious id get some good proxies and
randomly use them to bypass the
detection system. Slowing done the script a bit also helped but had the obvious disadvantage to it.

### Increase Speed and Efficiency

I made a working scraping script but wasn't that satisfied by the speed it was going so i took some time
to improve on it. I used cluster to help me with that so i can extract the data from product details page efficiently.

## Improvements

### Dealing With Detection

I added different proxies to avoid detection as well as setting up cookies and
random user agents. I also set up extra HTTP headers with random user agents decreasing my chance
of being seen by bot detection. Made sure to use puppeteer stealth library to additionally improve scrips security.

### Flexible Script

Made sure the script is flexible and support pagination. I made it so the person that is using
the script can easily choose the number of products and pages they want to scrape, instead of just hard coding the values.


### Compatible with all products

I found some products have different required fields such as personalized textareas or 
multiple dropdowns. I made the script flexible the all of those products, with or without it.

### Headless Mode friendly

Made the script friendly with the headless mode with console.logs so the person thats
using the script in headless mode can see whats happening :).
